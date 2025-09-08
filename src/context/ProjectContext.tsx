import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
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
  color: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  members: string[];
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

interface ProjectContextType {
  projects: Project[];
  tickets: Ticket[];
  teamGroups: TeamGroup[];
  projectUsers: User[];
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
  inviteUserToProject: (projectId: string, email: string) => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setTickets([]);
      setLoading(false);
      return;
    }

    // Écouter les changements de projets
    const projectsQuery = query(collection(db, 'projects'), where('members', 'array-contains', user.uid));
    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Project[];
      setProjects(projectsData);
    });

    // Écouter les changements de tickets
    const ticketsQuery = query(collection(db, 'tickets'));
    const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Ticket[];
      setTickets(ticketsData);
    });

    // Écouter les changements de groupes d'équipe
    const teamGroupsQuery = query(collection(db, 'teamGroups'));
    const unsubscribeTeamGroups = onSnapshot(teamGroupsQuery, (snapshot) => {
      const teamGroupsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as TeamGroup[];
      setTeamGroups(teamGroupsData);
      setLoading(false);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeTickets();
      unsubscribeTeamGroups();
    };
  }, [user]);

  const createProject = async (name: string, description: string, groupId?: string) => {
    if (!user) throw new Error('User not authenticated');
    
    await addDoc(collection(db, 'projects'), {
      name,
      description,
      createdAt: new Date(),
      createdBy: user.uid,
      members: [user.uid],
      teamGroups: groupId ? [groupId] : [],
      archived: false,
      settings: {
        allowMemberInvites: true,
        allowTicketAssignment: true,
        defaultAssignee: user.uid,
      },
    });
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
    await addDoc(collection(db, 'tickets'), {
      ...ticketData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const updateTicket = async (id: string, data: Partial<Ticket>) => {
    await updateDoc(doc(db, 'tickets', id), {
      ...data,
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
  const inviteUserToProject = async (projectId: string, email: string) => {
    if (!user) throw new Error('User not authenticated');
    
    // Vérifier si l'utilisateur est admin du projet
    const project = projects.find(p => p.id === projectId);
    if (!project || project.createdBy !== user.uid) {
      throw new Error('Only project admins can invite users');
    }

    // Créer une invitation
    await addDoc(collection(db, 'projectInvitations'), {
      projectId,
      email,
      invitedBy: user.uid,
      createdAt: new Date(),
      status: 'pending',
    });
  };

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
    
    const project = projects.find(p => p.id === group.projectId);
    if (!project || project.createdBy !== user.uid) {
      throw new Error('Only project admins can delete team groups');
    }

    await deleteDoc(doc(db, 'teamGroups', groupId));
    
    // Retirer le groupe du projet
    await updateDoc(doc(db, 'projects', group.projectId), {
      teamGroups: project.teamGroups.filter(id => id !== groupId),
    });
  };

  const addUserToGroup = async (groupId: string, userId: string) => {
    const group = teamGroups.find(g => g.id === groupId);
    if (!group) throw new Error('Team group not found');

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
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const updatedTeamGroups = [...project.teamGroups];
    if (!updatedTeamGroups.includes(groupId)) {
      updatedTeamGroups.push(groupId);
    }

    await updateDoc(doc(db, 'projects', projectId), {
      teamGroups: updatedTeamGroups,
      updatedAt: new Date(),
    });
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

  const value = {
    projects,
    tickets,
    teamGroups,
    projectUsers,
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
    inviteUserToProject,
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
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
