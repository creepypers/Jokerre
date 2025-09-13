import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, onSnapshot, query, where, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { logFirestoreError, isConnectionError } from '../utils/firestoreUtils';
import { useAuth } from './AuthContext';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: 'admin' | 'member';
}

export interface TeamGroup {
  id: string;
  name: string;
  description: string;
  projectId: string;
  members: string[];
  invitedEmails: string[];
  color: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
  members: string[];
  invitedEmails: string[];
  teamGroups: string[];
  archived: boolean;
  settings: {
    allowMemberInvites: boolean;
    allowTicketAssignment: boolean;
    defaultAssignee?: string;
  };
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  assignee?: string;
  assignedGroup?: string;
  projectId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface Invitation {
  id: string;
  email: string;
  type: 'project' | 'group';
  targetId: string; // ID du projet ou du groupe
  invitedBy: string; // ID de l'utilisateur qui a envoyé l'invitation
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  message?: string; // Message personnalisé
}

interface ProjectContextType {
  projects: Project[];
  tickets: Ticket[];
  teamGroups: TeamGroup[];
  projectUsers: User[];
  invitations: Invitation[];
  loading: boolean;
  
  // Project management
  createProject: (name: string, description: string, groupId?: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  restoreProject: (id: string) => Promise<void>;
  
  // Ticket management
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTicket: (id: string, data: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  getTicketsByProject: (projectId: string) => Ticket[];
  createDummyTicket: (projectId: string) => Promise<void>;
  
  // User management
  removeUserFromProject: (projectId: string, userId: string) => Promise<void>;
  updateUserRole: (projectId: string, userId: string, role: 'admin' | 'member') => Promise<void>;
  
  // Team group management
  createTeamGroup: (projectId: string, name: string, description: string, color: string) => Promise<void>;
  updateTeamGroup: (groupId: string, data: Partial<TeamGroup>) => Promise<void>;
  deleteTeamGroup: (groupId: string) => Promise<void>;
  addUserToGroup: (groupId: string, userId: string) => Promise<void>;
  removeUserFromGroup: (groupId: string, userId: string) => Promise<void>;
  
  // Assignment logic
  assignTicketToUser: (ticketId: string, userId: string) => Promise<void>;
  assignTicketToGroup: (ticketId: string, groupId: string) => Promise<void>;
  assignGroupToProject: (projectId: string, groupId: string) => Promise<void>;
  autoAssignTickets: (projectId: string) => Promise<void>;
  
  // Invitation management
  inviteUserToProject: (projectId: string, email: string, message?: string) => Promise<void>;
  inviteUserToGroup: (groupId: string, email: string, message?: string) => Promise<void>;
  acceptInvitation: (invitationId: string) => Promise<void>;
  declineInvitation: (invitationId: string) => Promise<void>;
  deleteInvitation: (invitationId: string) => Promise<void>;
  getInvitationsByEmail: (email: string) => Invitation[];
  getPendingInvitations: () => Invitation[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [teamGroups, setTeamGroups] = useState<TeamGroup[]>([]);
  const [projectUsers, setProjectUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setTickets([]);
      setLoading(false);
      return;
    }

    let cleanup: (() => void) | null = null;

    // Ajouter un délai pour éviter les connexions simultanées
    const initTimeout = setTimeout(() => {
      cleanup = setupListeners() || null;
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (cleanup) cleanup();
    };
  }, [user]);

  let unsubscribeTickets: (() => void) | null = null;
  let unsubscribeInvitations: (() => void) | null = null;
  let unsubscribeUsers: (() => void) | null = null;

  const migrateExistingData = async () => {
    if (!user) return;
    
    const migrationPromises = [];
    
    try {
      // Check if user document exists, create it if not
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.log('Creating user document for existing user:', user.uid);
        await setDoc(userDocRef, {
          id: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          avatar: user.photoURL || null,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            theme: 'light',
            language: 'fr',
            notifications: true,
          },
        });
      }
      
      // Migration pour ajouter invitedEmails aux projets de l'utilisateur
      const projectsQuery = query(collection(db, 'projects'), where('members', 'array-contains', user.uid));
      const projectsSnapshot = await getDocs(projectsQuery);
      
      for (const docSnapshot of projectsSnapshot.docs) {
        const data = docSnapshot.data();
        if (!data.invitedEmails) {
          migrationPromises.push(
            updateDoc(doc(db, 'projects', docSnapshot.id), {
              invitedEmails: []
            })
          );
        }
      }
      
      // Migration pour ajouter invitedEmails aux groupes de l'utilisateur
      const groupsQuery = query(collection(db, 'teamGroups'), where('members', 'array-contains', user.uid));
      const groupsSnapshot = await getDocs(groupsQuery);
      
      for (const docSnapshot of groupsSnapshot.docs) {
        const data = docSnapshot.data();
        if (!data.invitedEmails) {
          migrationPromises.push(
            updateDoc(doc(db, 'teamGroups', docSnapshot.id), {
              invitedEmails: []
            })
          );
        }
      }
      
      if (migrationPromises.length > 0) {
        console.log(`Migrating ${migrationPromises.length} documents...`);
        await Promise.all(migrationPromises);
        console.log('Migration completed');
      }
    } catch (error) {
      console.warn('Migration failed, but continuing:', error);
    }
  };

  const setupListeners = () => {
    if (!user) {
      console.log('No user authenticated, skipping listeners setup');
      return;
    }

    console.log('Setting up listeners for user:', user.uid, 'email:', user.email);
    let unsubscribeProjects: (() => void) | null = null;
    let unsubscribeTeamGroups: (() => void) | null = null;

    try {
    // Exécuter la migration des données existantes
    migrateExistingData().catch(error => {
      console.error('Migration failed:', error);
    });

      // Écouter les changements de projets
      const projectsQuery = query(collection(db, 'projects'), where('members', 'array-contains', user.uid));
      unsubscribeProjects = onSnapshot(projectsQuery, 
        (snapshot) => {
      console.log('Projects listener triggered, received', snapshot.docs.length, 'projects');
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        invitedEmails: doc.data().invitedEmails || [],
      })) as Project[];
      console.log('Projects data:', projectsData.map(p => ({ id: p.id, name: p.name, members: p.members })));
      setProjects(projectsData);
          
          // Mettre à jour les tickets après avoir reçu les projets
          setupTicketsListener(projectsData);
          
          // Setup users listener after receiving projects data
          setupUsersListener(projectsData);
        },
        (error) => {
          logFirestoreError('projects listener', error);
          if (isConnectionError(error)) {
            console.warn('Connection error detected, listeners will retry automatically');
          }
          setLoading(false);
        }
      );

      // Écouter les changements de groupes d'équipe
      // Écouter tous les groupes d'équipe (pas seulement ceux dont l'utilisateur est membre)
      // car l'utilisateur peut être ajouté à des groupes via des invitations de projet
      const teamGroupsQuery = collection(db, 'teamGroups');
      unsubscribeTeamGroups = onSnapshot(teamGroupsQuery, 
        (snapshot) => {
          const teamGroupsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            invitedEmails: doc.data().invitedEmails || [],
          })) as TeamGroup[];
          setTeamGroups(teamGroupsData);
          setLoading(false);
        },
        (error) => {
          logFirestoreError('team groups listener', error);
          if (isConnectionError(error)) {
            console.warn('Connection error detected, listeners will retry automatically');
          }
          setLoading(false);
        }
      );


      // Écouter les invitations pour l'utilisateur connecté
      if (user.email) {
        console.log('Setting up invitations listener for email:', user.email);
        const invitationsQuery = query(
          collection(db, 'invitations'), 
          where('email', '==', user.email)
        );
        unsubscribeInvitations = onSnapshot(invitationsQuery, 
          (snapshot) => {
            console.log('Invitations snapshot received:', snapshot.docs.length, 'invitations');
            const invitationsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              expiresAt: doc.data().expiresAt?.toDate() || new Date(),
            })) as Invitation[];
            setInvitations(invitationsData);
          },
          (error) => {
            console.error('Invitations listener error:', error);
            logFirestoreError('invitations listener', error);
            if (isConnectionError(error)) {
              console.warn('Connection error detected, listeners will retry automatically');
            }
          }
        );
      } else {
        console.warn('User email not available, skipping invitations listener');
      }
    } catch (error) {
      logFirestoreError('setup listeners', error);
      setLoading(false);
    }

    // Retourner une fonction de nettoyage
    return () => {
      if (unsubscribeProjects) unsubscribeProjects();
      if (unsubscribeTickets) unsubscribeTickets();
      if (unsubscribeTeamGroups) unsubscribeTeamGroups();
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribeInvitations) unsubscribeInvitations();
    };
  };

  const setupTicketsListener = (projectsData: Project[]) => {
    if (unsubscribeTickets) {
      unsubscribeTickets();
    }

    const userProjectIds = projectsData.map(p => p.id);
    let ticketsQuery;
    
    if (userProjectIds.length > 0) {
      // Filtrer les tickets par les projets de l'utilisateur
      ticketsQuery = query(
        collection(db, 'tickets'),
        where('projectId', 'in', userProjectIds)
      );
    } else {
      // Si pas de projets, écouter tous les tickets (pour les nouveaux utilisateurs)
      ticketsQuery = query(collection(db, 'tickets'));
    }

    unsubscribeTickets = onSnapshot(ticketsQuery, 
      (snapshot) => {
        const ticketsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Ticket[];
        setTickets(ticketsData);
      },
      (error) => {
        logFirestoreError('tickets listener', error);
        if (isConnectionError(error)) {
          console.warn('Connection error detected, listeners will retry automatically');
        }
      }
    );
  };

  const setupUsersListener = (projectsData: Project[]) => {
    if (unsubscribeUsers) {
      unsubscribeUsers();
    }

    // Récupérer tous les membres de tous les projets
    const allMemberIds = [...new Set(projectsData.flatMap(p => p.members))];
    
    if (allMemberIds.length > 0) {
      const usersQuery = query(
        collection(db, 'users'),
        where('__name__', 'in', allMemberIds)
      );
      unsubscribeUsers = onSnapshot(usersQuery, 
        (snapshot) => {
          const usersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            role: 'member' as const, // Default role
          })) as User[];
          setProjectUsers(usersData);
        },
        (error) => {
          logFirestoreError('users listener', error);
          if (isConnectionError(error)) {
            console.warn('Connection error detected, listeners will retry automatically');
          }
        }
      );
    } else {
      setProjectUsers([]);
    }
  };

  const createProject = async (name: string, description: string, groupId?: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const projectRef = await addDoc(collection(db, 'projects'), {
      name,
      description,
      createdAt: new Date(),
      createdBy: user.uid,
      members: [user.uid],
      invitedEmails: [],
      teamGroups: groupId ? [groupId] : [],
      archived: false,
      settings: {
        allowMemberInvites: true,
        allowTicketAssignment: true,
        defaultAssignee: user.uid,
      },
    });

    // Si un groupe est spécifié, ajouter l'utilisateur à ce groupe
    if (groupId) {
      try {
        const groupDoc = await getDoc(doc(db, 'teamGroups', groupId));
        if (groupDoc.exists()) {
          const groupData = groupDoc.data();
          if (!groupData.members.includes(user.uid)) {
            console.log('Adding project creator to team group:', groupId);
            await updateDoc(doc(db, 'teamGroups', groupId), {
              members: [...groupData.members, user.uid],
              updatedAt: new Date(),
            });
            console.log('Project creator added to team group:', groupId);
          }
        }
      } catch (error) {
        console.error('Error adding project creator to team group:', groupId, error);
      }
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    await updateDoc(doc(db, 'projects', id), {
      ...data,
      updatedAt: new Date(),
    });
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, 'projects', id));
  };

  const archiveProject = async (id: string) => {
    await updateDoc(doc(db, 'projects', id), {
      archived: true,
      updatedAt: new Date(),
    });
  };

  const restoreProject = async (id: string) => {
    await updateDoc(doc(db, 'projects', id), {
      archived: false,
      updatedAt: new Date(),
    });
  };

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Filter out undefined values to avoid Firebase errors
    const cleanData = Object.fromEntries(
      Object.entries(ticketData).filter(([_, value]) => value !== undefined)
    );
    
    await addDoc(collection(db, 'tickets'), {
      ...cleanData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const updateTicket = async (id: string, data: Partial<Ticket>) => {
    // Filter out undefined values to avoid Firebase errors
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );
    
    await updateDoc(doc(db, 'tickets', id), {
      ...cleanData,
      updatedAt: new Date(),
    });
  };

  const deleteTicket = async (id: string) => {
    await deleteDoc(doc(db, 'tickets', id));
  };

  const getTicketsByProject = (projectId: string) => {
    return tickets.filter(ticket => ticket.projectId === projectId);
  };

  const createDummyTicket = async (projectId: string) => {
    const dummyTickets = [
      {
        title: "Améliorer l'interface utilisateur",
        description: "Refactoriser les composants pour une meilleure expérience utilisateur et une interface plus moderne.",
        status: "todo" as const,
        priority: "high" as const,
        projectId,
        tags: ["ui", "refactoring", "amélioration"],
      },
      {
        title: "Corriger le bug de navigation",
        description: "Résoudre le problème de navigation entre les écrans qui cause des erreurs intermittentes.",
        status: "in-progress" as const,
        priority: "urgent" as const,
        projectId,
        tags: ["bug", "navigation", "critique"],
      },
      {
        title: "Ajouter des tests unitaires",
        description: "Implémenter une suite de tests pour couvrir les fonctionnalités principales de l'application.",
        status: "done" as const,
        priority: "medium" as const,
        projectId,
        tags: ["test", "qualité", "développement"],
      },
      {
        title: "Optimiser les performances",
        description: "Améliorer les performances de l'application en optimisant les requêtes et le rendu des composants.",
        status: "todo" as const,
        priority: "medium" as const,
        projectId,
        tags: ["performance", "optimisation"],
      },
      {
        title: "Documenter l'API",
        description: "Créer une documentation complète pour l'API backend et les endpoints disponibles.",
        status: "todo" as const,
        priority: "low" as const,
        projectId,
        tags: ["documentation", "api"],
      }
    ];

    // Créer tous les tickets factices
    for (const ticketData of dummyTickets) {
      await createTicket(ticketData);
    }
  };

  // User management functions

  const removeUserFromProject = async (projectId: string, userId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const project = projects.find(p => p.id === projectId);
    if (!project || project.createdBy !== user.uid) {
      throw new Error('Only project admins can remove users');
    }

    await updateDoc(doc(db, 'projects', projectId), {
      members: project.members.filter(id => id !== userId),
    });
  };

  const updateUserRole = async (projectId: string, userId: string, role: 'admin' | 'member') => {
    if (!user) throw new Error('User not authenticated');
    
    const project = projects.find(p => p.id === projectId);
    if (!project || project.createdBy !== user.uid) {
      throw new Error('Only project admins can update user roles');
    }

    // Mettre à jour le rôle dans la collection des utilisateurs du projet
    await updateDoc(doc(db, 'projectUsers', `${projectId}_${userId}`), {
      role,
      updatedAt: new Date(),
    });
  };

  // Team group management functions
  const createTeamGroup = async (projectId: string, name: string, description: string, color: string) => {
    if (!user) throw new Error('User not authenticated');
    
    // Si projectId est vide, créer un groupe global
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (!project || project.createdBy !== user.uid) {
        throw new Error('Only project admins can create team groups');
      }
    }

    const groupData = {
      name,
      description,
      projectId: projectId || null,
      members: [user.uid], // L'utilisateur qui crée le groupe en est automatiquement membre
      invitedEmails: [],
      color,
      createdAt: new Date(),
    };

    const groupRef = await addDoc(collection(db, 'teamGroups'), groupData);
    
    // Si c'est un groupe de projet, l'ajouter au projet
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        await updateDoc(doc(db, 'projects', projectId), {
          teamGroups: [...project.teamGroups, groupRef.id],
        });
      }
    }
  };

  const updateTeamGroup = async (groupId: string, data: Partial<TeamGroup>) => {
    await updateDoc(doc(db, 'teamGroups', groupId), {
      ...data,
      updatedAt: new Date(),
    });
  };

  const deleteTeamGroup = async (groupId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const group = teamGroups.find(g => g.id === groupId);
    if (!group) throw new Error('Team group not found');
    
    // Allow deletion if user is the creator of the group OR if it's a global group (no projectId)
    if (group.projectId) {
      const project = projects.find(p => p.id === group.projectId);
      if (!project || project.createdBy !== user.uid) {
        throw new Error('Only project admins can delete team groups');
      }
    } else {
      // For global groups, only the creator can delete
      if (group.members[0] !== user.uid) {
        throw new Error('Only the group creator can delete this group');
      }
    }

    await deleteDoc(doc(db, 'teamGroups', groupId));
    
    // Retirer le groupe du projet si c'est un groupe de projet
    if (group.projectId) {
      const project = projects.find(p => p.id === group.projectId);
      if (project) {
        await updateDoc(doc(db, 'projects', group.projectId), {
          teamGroups: project.teamGroups.filter(id => id !== groupId),
        });
      }
    }
  };

  const addUserToGroup = async (groupId: string, userId: string) => {
    const group = teamGroups.find(g => g.id === groupId);
    if (!group) throw new Error('Team group not found');

    console.log('Adding user to group:', {
      groupId,
      userId,
      groupProjectId: group.projectId,
      currentUser: user?.uid,
      groupMembers: group.members
    });

    // Vérifier si l'utilisateur est membre du projet associé
    if (group.projectId) {
      const project = projects.find(p => p.id === group.projectId);
      if (project && !project.members.includes(user?.uid || '')) {
        console.error('User is not a member of the project:', {
          projectId: group.projectId,
          projectMembers: project.members,
          currentUser: user?.uid
        });
        throw new Error('User must be a member of the project to be added to its team groups');
      }
    }

    await updateDoc(doc(db, 'teamGroups', groupId), {
      members: [...group.members, userId],
      updatedAt: new Date(),
    });
  };

  const removeUserFromGroup = async (groupId: string, userId: string) => {
    const group = teamGroups.find(g => g.id === groupId);
    if (!group) throw new Error('Team group not found');

    await updateDoc(doc(db, 'teamGroups', groupId), {
      members: group.members.filter(id => id !== userId),
      updatedAt: new Date(),
    });
  };

  // Assignment logic functions
  const assignTicketToUser = async (ticketId: string, userId: string) => {
    await updateDoc(doc(db, 'tickets', ticketId), {
      assignee: userId,
      assignedGroup: null,
      updatedAt: new Date(),
    });
  };

  const assignTicketToGroup = async (ticketId: string, groupId: string) => {
    await updateDoc(doc(db, 'tickets', ticketId), {
      assignedGroup: groupId,
      assignee: null,
      updatedAt: new Date(),
    });
  };

  const assignGroupToProject = async (projectId: string, groupId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const updatedTeamGroups = [...project.teamGroups];
    if (!updatedTeamGroups.includes(groupId)) {
      updatedTeamGroups.push(groupId);
    }

    // Mettre à jour le projet avec le nouveau groupe
    await updateDoc(doc(db, 'projects', projectId), {
      teamGroups: updatedTeamGroups,
      updatedAt: new Date(),
    });

    // Ajouter l'utilisateur au groupe s'il n'en est pas déjà membre
    try {
      const groupDoc = await getDoc(doc(db, 'teamGroups', groupId));
      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        if (!groupData.members.includes(user.uid)) {
          console.log('Adding user to assigned team group:', groupId);
          await updateDoc(doc(db, 'teamGroups', groupId), {
            members: [...groupData.members, user.uid],
            updatedAt: new Date(),
          });
          console.log('User added to assigned team group:', groupId);
        } else {
          console.log('User already a member of assigned team group:', groupId);
        }
      }
    } catch (error) {
      console.error('Error adding user to assigned team group:', groupId, error);
    }
  };

  const autoAssignTickets = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const unassignedTickets = tickets.filter(t => 
      t.projectId === projectId && !t.assignee && !t.assignedGroup
    );

    if (unassignedTickets.length === 0) return;

    // Stratégie d'assignation automatique : distribuer équitablement
    const availableMembers = project.members;
    let memberIndex = 0;

    for (const ticket of unassignedTickets) {
      const assignee = availableMembers[memberIndex % availableMembers.length];
      await assignTicketToUser(ticket.id, assignee);
      memberIndex++;
    }
  };

  // Fonctions d'invitation
  const inviteUserToProject = async (projectId: string, email: string, message?: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');
    
    // Vérifier si l'utilisateur est membre du projet
    if (!project.members.includes(user.uid)) {
      throw new Error('You must be a member of the project to invite others');
    }

    // Vérifier si une invitation existe déjà
    const existingInvitation = invitations.find(inv => 
      inv.email === email && inv.targetId === projectId && inv.type === 'project' && inv.status === 'pending'
    );
    
    if (existingInvitation) {
      throw new Error('An invitation has already been sent to this email');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire dans 7 jours

    // Ajouter l'email à la liste des emails invités
    const updatedInvitedEmails = [...(project.invitedEmails || []), email];
    await updateDoc(doc(db, 'projects', projectId), {
      invitedEmails: updatedInvitedEmails
    });

    await addDoc(collection(db, 'invitations'), {
      email,
      type: 'project',
      targetId: projectId,
      invitedBy: user.uid,
      status: 'pending',
      createdAt: new Date(),
      expiresAt,
      message: message || `Vous avez été invité à rejoindre le projet "${project.name}"`,
    });
  };

  const inviteUserToGroup = async (groupId: string, email: string, message?: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const group = teamGroups.find(g => g.id === groupId);
    if (!group) throw new Error('Group not found');
    
    // Vérifier si l'utilisateur est membre du groupe
    if (!group.members.includes(user.uid)) {
      throw new Error('You must be a member of the group to invite others');
    }

    // Vérifier si une invitation existe déjà
    const existingInvitation = invitations.find(inv => 
      inv.email === email && inv.targetId === groupId && inv.type === 'group' && inv.status === 'pending'
    );
    
    if (existingInvitation) {
      throw new Error('An invitation has already been sent to this email');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire dans 7 jours

    // Ajouter l'email à la liste des emails invités
    const updatedInvitedEmails = [...(group.invitedEmails || []), email];
    await updateDoc(doc(db, 'teamGroups', groupId), {
      invitedEmails: updatedInvitedEmails
    });

    await addDoc(collection(db, 'invitations'), {
      email,
      type: 'group',
      targetId: groupId,
      invitedBy: user.uid,
      status: 'pending',
      createdAt: new Date(),
      expiresAt,
      message: message || `Vous avez été invité à rejoindre le groupe "${group.name}"`,
    });
  };

  const acceptInvitation = async (invitationId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    console.log('Accepting invitation:', invitationId, 'for user:', user.uid);
    
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation) throw new Error('Invitation not found');
    
    console.log('Found invitation:', invitation);
    
    if (invitation.status !== 'pending') {
      throw new Error('Invitation is no longer valid');
    }

    console.log('Checking invitation email match:', {
      invitationEmail: invitation.email,
      userEmail: user.email,
      userUid: user.uid
    });
    
    if (invitation.email !== user.email) {
      throw new Error(`This invitation is not for you. Invitation is for ${invitation.email}, but you are logged in as ${user.email}`);
    }

    // Vérifier si l'invitation n'a pas expiré
    if (invitation.expiresAt < new Date()) {
      await updateDoc(doc(db, 'invitations', invitationId), {
        status: 'expired'
      });
      throw new Error('Invitation has expired');
    }

    // Mettre à jour le statut de l'invitation
    console.log('Updating invitation status to accepted');
    await updateDoc(doc(db, 'invitations', invitationId), {
      status: 'accepted'
    });

    // Ajouter l'utilisateur au projet ou au groupe
    if (invitation.type === 'project') {
      console.log('Adding user to project:', invitation.targetId);
      // Récupérer le projet directement depuis Firestore
      const projectDoc = await getDoc(doc(db, 'projects', invitation.targetId));
      if (projectDoc.exists()) {
        const projectData = projectDoc.data();
        console.log('Project data:', projectData);
        if (!projectData.members.includes(user.uid)) {
          console.log('Updating project with new member:', user.uid);
          await updateDoc(doc(db, 'projects', invitation.targetId), {
            members: [...projectData.members, user.uid]
          });
          console.log('Project updated successfully');
          
          // Attendre un moment pour que les permissions se propagent
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Ajouter l'utilisateur aux groupes d'équipe du projet
          if (projectData.teamGroups && projectData.teamGroups.length > 0) {
            console.log('Adding user to project teams:', projectData.teamGroups);
            for (const groupId of projectData.teamGroups) {
              try {
                const groupDoc = await getDoc(doc(db, 'teamGroups', groupId));
                if (groupDoc.exists()) {
                  const groupData = groupDoc.data();
                  if (!groupData.members.includes(user.uid)) {
                    console.log('Adding user to team group:', groupId);
                    await updateDoc(doc(db, 'teamGroups', groupId), {
                      members: [...groupData.members, user.uid],
                      updatedAt: new Date(),
                    });
                    console.log('User added to team group:', groupId);
                  } else {
                    console.log('User already a member of team group:', groupId);
                  }
                }
              } catch (error) {
                console.error('Error adding user to team group:', groupId, error);
                // Continue with other groups even if one fails
              }
            }
          }
          
          // Retirer l'email de la liste des emails invités APRÈS avoir ajouté aux teams
          const updatedInvitedEmails = (projectData.invitedEmails || []).filter((email: string) => email !== invitation.email);
          await updateDoc(doc(db, 'projects', invitation.targetId), {
            invitedEmails: updatedInvitedEmails
          });
          console.log('Removed email from invitedEmails list');
        } else {
          console.log('User already a member of this project');
        }
      } else {
        console.error('Project not found:', invitation.targetId);
      }
    } else if (invitation.type === 'group') {
      console.log('Adding user to group:', invitation.targetId);
      // Récupérer le groupe directement depuis Firestore
      const groupDoc = await getDoc(doc(db, 'teamGroups', invitation.targetId));
      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        console.log('Group data:', groupData);
        if (!groupData.members.includes(user.uid)) {
          // Retirer l'email de la liste des emails invités
          const updatedInvitedEmails = (groupData.invitedEmails || []).filter((email: string) => email !== invitation.email);
          console.log('Updating group with new member:', user.uid);
          await updateDoc(doc(db, 'teamGroups', invitation.targetId), {
            members: [...groupData.members, user.uid],
            invitedEmails: updatedInvitedEmails
          });
          console.log('Group updated successfully');
        } else {
          console.log('User already a member of this group');
        }
      } else {
        console.error('Group not found:', invitation.targetId);
      }
    }
  };

  const declineInvitation = async (invitationId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation) throw new Error('Invitation not found');
    
    if (invitation.email !== user.email) {
      throw new Error('This invitation is not for you');
    }

    // Mark the invitation as declined
    await updateDoc(doc(db, 'invitations', invitationId), {
      status: 'declined'
    });

    // Remove user from project or team if they were added through this invitation
    if (invitation.type === 'project') {
      const project = projects.find(p => p.id === invitation.targetId);
      if (project && project.members.includes(user.uid)) {
        await updateDoc(doc(db, 'projects', invitation.targetId), {
          members: project.members.filter(id => id !== user.uid),
          updatedAt: new Date(),
        });
      }
    } else if (invitation.type === 'group') {
      const group = teamGroups.find(g => g.id === invitation.targetId);
      if (group && group.members.includes(user.uid)) {
        await updateDoc(doc(db, 'teamGroups', invitation.targetId), {
          members: group.members.filter(id => id !== user.uid),
          updatedAt: new Date(),
        });
      }
    }
  };

  const getInvitationsByEmail = (email: string) => {
    return invitations.filter(inv => inv.email === email);
  };

  const deleteInvitation = async (invitationId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation) throw new Error('Invitation not found');
    
    // Only allow deletion by the person who sent the invitation or the person who received it
    if (invitation.invitedBy !== user.uid && invitation.email !== user.email) {
      throw new Error('You can only delete invitations you sent or received');
    }

    await deleteDoc(doc(db, 'invitations', invitationId));
  };

  const getPendingInvitations = () => {
    return invitations.filter(inv => inv.status === 'pending');
  };

  const value = {
    projects,
    tickets,
    teamGroups,
    projectUsers,
    invitations,
    loading,
    
    // Project management
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    restoreProject,
    
    // Ticket management
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketsByProject,
    createDummyTicket,
    
    // User management
    removeUserFromProject,
    updateUserRole,
    
    // Team group management
    createTeamGroup,
    updateTeamGroup,
    deleteTeamGroup,
    addUserToGroup,
    removeUserFromGroup,
    
    // Assignment logic
    assignTicketToUser,
    assignTicketToGroup,
    assignGroupToProject,
    autoAssignTickets,
    
    // Invitation management
    inviteUserToProject,
    inviteUserToGroup,
    acceptInvitation,
    declineInvitation,
    deleteInvitation,
    getInvitationsByEmail,
    getPendingInvitations,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
