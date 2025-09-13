import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert, Dimensions, RefreshControl, SafeAreaView, FlatList } from 'react-native';
import { Title, FAB, TextInput, Card, Chip, Icon, Avatar, Badge, SegmentedButtons, Menu, Divider } from 'react-native-paper';
import { useProject, TeamGroup, User } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/colors';
import { sharedStyles } from '../styles/shared.styles';
import { styles } from '../styles/TeamManagementScreen.styles';
import { Header, GenericModal, AnimatedView, BackButton, ContextMenu, CompactFilters } from '../components';

const { width } = Dimensions.get('window');

interface TeamManagementScreenProps {
  navigation: any;
  route: any;
}

const TeamManagementScreen: React.FC<TeamManagementScreenProps> = ({ navigation, route }) => {
  const { projectId } = route.params;
  const { 
    projects, 
    teamGroups, 
    projectUsers, 
    tickets,
    inviteUserToProject, 
    removeUserFromProject, 
    updateUserRole,
    addUserToGroup,
    removeUserFromGroup,
    assignTicketToUser,
    autoAssignTickets,
    getTicketsByProject,
    loading: projectLoading 
  } = useProject();
  const { user } = useAuth();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTicketsDropdown, setShowTicketsDropdown] = useState(false);
  const [showTicketMenu, setShowTicketMenu] = useState(false);
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  
  // Filtres pour les membres
  const [roleFilter, setRoleFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<string>('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const project = projects.find(p => p.id === projectId);
  const allProjectMembers = projectUsers.filter(u => project?.members.includes(u.id));
  const projectGroups = teamGroups.filter(g => project?.teamGroups.includes(g.id));
  const projectTickets = getTicketsByProject(projectId);
  
  // Appliquer les filtres aux membres
  const filteredMembers = allProjectMembers.filter(member => {
    const roleMatch = roleFilter === 'all' || 
      (roleFilter === 'owner' && member.id === project?.createdBy) ||
      (roleFilter === 'member' && member.id !== project?.createdBy);
    
    const groupMatch = groupFilter === 'all' ||
      (groupFilter === 'no-group' && !projectGroups.some(g => g.members.includes(member.id))) ||
      (groupFilter !== 'no-group' && projectGroups.some(g => g.id === groupFilter && g.members.includes(member.id)));
    
    return roleMatch && groupMatch;
  });
  
  const projectMembers = filteredMembers;

  const onRefresh = async () => {
    setRefreshing(true);
    // Simuler un refresh - en réalité, les données se mettent à jour automatiquement
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email');
      return;
    }

    setLoading(true);
    try {
      await inviteUserToProject(projectId, inviteEmail.trim());
      Alert.alert('Succès', 'Invitation envoyée avec succès');
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible d\'envoyer l\'invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir retirer cet utilisateur du projet ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Retirer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeUserFromProject(projectId, userId);
              Alert.alert('Succès', 'Utilisateur retiré du projet');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de retirer l\'utilisateur');
            }
          }
        }
      ]
    );
  };



  const handleAddUserToGroup = async () => {
    if (!selectedUser || !selectedGroup) {
      Alert.alert('Erreur', 'Veuillez sélectionner un utilisateur et un groupe');
      return;
    }

    setLoading(true);
    try {
      await addUserToGroup(selectedGroup, selectedUser);
      Alert.alert('Succès', 'Utilisateur ajouté au groupe');
      setSelectedUser('');
      setSelectedGroup('');
      setShowAddToGroupModal(false);
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'utilisateur au groupe');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUserFromGroup = async (groupId: string, userId: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir retirer cet utilisateur du groupe ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Retirer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeUserFromGroup(groupId, userId);
              Alert.alert('Succès', 'Utilisateur retiré du groupe');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de retirer l\'utilisateur du groupe');
            }
          }
        }
      ]
    );
  };

  const handleAssignTicket = async () => {
    if (!selectedTicket || !selectedAssignee) {
      Alert.alert('Erreur', 'Veuillez sélectionner un ticket et un assigné');
      return;
    }

    setLoading(true);
    try {
      await assignTicketToUser(selectedTicket, selectedAssignee);
      Alert.alert('Succès', 'Ticket assigné avec succès');
      setSelectedTicket('');
      setSelectedAssignee('');
      setShowAssignModal(false);
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible d\'assigner le ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssignTickets = async () => {
    setLoading(true);
    try {
      await autoAssignTickets(projectId);
      Alert.alert('Succès', 'Tickets assignés automatiquement');
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible d\'assigner automatiquement les tickets');
    } finally {
      setLoading(false);
    }
  };

  const getTicketAssigneeName = (assigneeId?: string) => {
    if (!assigneeId) return 'Non assigné';
    const assignee = projectMembers.find(member => member.id === assigneeId);
    return assignee ? (assignee.displayName || assignee.email) : 'Utilisateur inconnu';
  };

  const getUnassignedTickets = () => {
    return projectTickets.filter(ticket => !ticket.assignee);
  };


  const renderUser = ({ item: user, index }: { item: User; index: number }) => {
    const userGroups = projectGroups.filter(g => g.members.includes(user.id));
    
    return (
      <AnimatedView animationType="both" delay={index * 100}>
        <Card style={styles.memberCard}>
          <Card.Content>
            <View style={styles.memberHeader}>
              <View style={styles.memberInfo}>
                <Avatar.Text 
                  size={36} 
                  label={user.displayName.charAt(0).toUpperCase()} 
                  style={[styles.memberAvatar, { backgroundColor: colors.primary }]}
                />
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{user.displayName}</Text>
                  <Text style={styles.memberEmail}>{user.email}</Text>
                  {userGroups.length > 0 && (
                    <View style={styles.memberGroups}>
                      {userGroups.map(group => (
                        <Text 
                          key={group.id} 
                          style={[styles.groupChip, { backgroundColor: group.color }]}
                        >
                          {group.name}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.memberActions}>
                <Text style={styles.roleBadge}>
                  {user.id === project?.createdBy ? 'Propriétaire' : 'Membre'}
                </Text>
                {user.id !== project?.createdBy && (
                  <ContextMenu
                    visible={showMenu === user.id}
                    onDismiss={() => setShowMenu(null)}
                    onOpen={() => setShowMenu(user.id)}
                    items={[
                      {
                        title: 'Retirer du projet',
                        icon: 'account-remove',
                        onPress: () => handleRemoveUser(user.id),
                        titleStyle: { color: colors.error },
                      },
                    ]}
                  />
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
      </AnimatedView>
    );
  };


  if (projectLoading) {
    return (
      <SafeAreaView style={[sharedStyles.container, { backgroundColor: colors.background }]}>
        <Header 
          title="Gestion d'Équipe" 
          subtitle={project?.name || 'Chargement...'}
          rightElement={<BackButton onPress={() => navigation.goBack()} />}
        />
        <View style={sharedStyles.loadingContainer}>
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView style={[sharedStyles.container, { backgroundColor: colors.background }]}>
        <Header 
          title="Gestion d'Équipe" 
          subtitle="Projet non trouvé"
          rightElement={<BackButton onPress={() => navigation.goBack()} />}
        />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Projet non trouvé</Text>
          <Text style={styles.emptyDescription}>
            Le projet demandé n'existe pas ou vous n'y avez pas accès.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[sharedStyles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Gestion d'Équipe" 
        subtitle={project.name}
        rightElement={<BackButton onPress={() => navigation.goBack()} />}
      />

      <View style={styles.content}>
        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <View style={styles.statIcon}>
                <Icon 
                  source="account-group" 
                  size={24} 
                  color={colors.primary}
                />
              </View>
              <Text style={styles.statNumber}>{projectMembers.length}</Text>
              <Text style={styles.statLabel}>Membres</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <View style={styles.statIcon}>
                <Icon 
                  source="tag" 
                  size={24} 
                  color={colors.primary}
                />
              </View>
              <Text style={styles.statNumber}>{projectGroups.length}</Text>
              <Text style={styles.statLabel}>Groupes</Text>
            </Card.Content>
          </Card>
        </View>

         {/* Section des tickets */}
         <View style={styles.ticketsSection}>
           <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Gestion des Tickets</Text>
             <TouchableOpacity
               style={styles.ticketsDropdownButton}
               onPress={() => setShowTicketsDropdown(!showTicketsDropdown)}
             >
               <Text style={styles.ticketsDropdownText}>
                 {projectTickets.length} ticket{projectTickets.length > 1 ? 's' : ''}
               </Text>
               <View style={styles.ticketsDropdownArrow}>
                 <Icon 
                   source={showTicketsDropdown ? 'chevron-up' : 'chevron-down'} 
                   size={16} 
                   color={colors.primary}
                 />
               </View>
             </TouchableOpacity>
           </View>

           {showTicketsDropdown && (
             <View style={styles.ticketsDropdownContent}>
               <View style={styles.ticketActions}>
                 <TouchableOpacity
                   style={styles.assignButton}
                   onPress={() => setShowAssignModal(true)}
                 >
                   <Text style={styles.assignButtonText}>Assigner</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.autoAssignButton}
                   onPress={handleAutoAssignTickets}
                 >
                   <Text style={styles.autoAssignButtonText}>Auto-assigner</Text>
                 </TouchableOpacity>
               </View>

               {projectTickets.length === 0 ? (
                 <View style={styles.emptyTicketsState}>
                   <Text style={styles.emptyTicketsText}>Aucun ticket disponible</Text>
                 </View>
               ) : (
                 <FlatList
                   data={projectTickets}
                   renderItem={({ item: ticket }) => (
                     <TouchableOpacity
                       style={styles.ticketMenuItem}
                       onPress={() => {
                         // Optionnel: action quand on clique sur un ticket
                       }}
                     >
                       <View style={styles.ticketMenuInfo}>
                         <Text style={styles.ticketMenuTitle}>{ticket.title}</Text>
                         <Text style={styles.ticketMenuAssignee}>
                           {getTicketAssigneeName(ticket.assignee)}
                         </Text>
                       </View>
                       <View style={styles.ticketMenuStatus}>
                         <Text style={[
                           styles.ticketMenuStatusText,
                           { color: ticket.status === 'todo' ? colors.warning : ticket.status === 'in-progress' ? colors.primary : colors.success }
                         ]}>
                           {ticket.status === 'todo' ? 'À faire' : ticket.status === 'in-progress' ? 'En cours' : 'Terminé'}
                         </Text>
                       </View>
                     </TouchableOpacity>
                   )}
                   keyExtractor={(item) => item.id}
                   showsVerticalScrollIndicator={false}
                   style={styles.ticketsMenu}
                   nestedScrollEnabled={true}
                 />
               )}
             </View>
           )}
         </View>

        {/* Section des membres */}
        <View style={styles.tabContent}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Membres du Projet</Text>
            
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => setShowInviteModal(true)}
            >
              <Text style={styles.inviteButtonText}>+ Inviter</Text>
              
            </TouchableOpacity>
            
          </View>
          
          
          {projectMembers.length === 0 ? (
            <AnimatedView 
              style={styles.emptyState}
              animationType="fade"
            >
              <View style={styles.emptyIcon}>
                <Icon 
                  source="account-group" 
                  size={48} 
                  color={colors.textSecondary}
                />
              </View>
              <Text style={styles.emptyTitle}>Aucun membre</Text>
              <Text style={styles.emptyDescription}>
                Invitez des utilisateurs à rejoindre ce projet.
              </Text>
            </AnimatedView>
          ) : (
            <FlatList
              ListHeaderComponent={
          <CompactFilters
            filters={[
              {
                title: "Rôle",
                icon: "account-key",
                options: [
                  { value: "all", label: "Tous", count: allProjectMembers.length },
                  {
                    value: "owner",
                    label: "Propriétaire",
                    count: allProjectMembers.filter((m) => m.id === project?.createdBy).length,
                  },
                  {
                    value: "member",
                    label: "Membres",
                    count: allProjectMembers.filter((m) => m.id !== project?.createdBy).length,
                  },
                ],
                selectedValue: roleFilter,
                onValueChange: setRoleFilter,
              },
              {
                title: "Groupe",
                icon: "account-group",
                options: [
                  { value: "all", label: "Tous", count: allProjectMembers.length },
                  {
                    value: "no-group",
                    label: "Sans groupe",
                    count: allProjectMembers.filter((m) => 
                      !projectGroups.some(g => g.members.includes(m.id))
                    ).length,
                  },
                  ...projectGroups.map((group) => ({
                    value: group.id,
                    label: group.name,
                    count: allProjectMembers.filter((m) => group.members.includes(m.id)).length,
                    color: group.color,
                  })),
                ],
                selectedValue: groupFilter,
                onValueChange: setGroupFilter,
              },
            ]}
            style={styles.compactFilters}
          /> }
              data={projectMembers}
              renderItem={renderUser}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.membersList}
              nestedScrollEnabled={true}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </View>
      </View>

      {/* Modals */}
      <GenericModal
        visible={showInviteModal}
        onDismiss={() => setShowInviteModal(false)}
        title="Inviter un utilisateur"
        icon="account-plus"
        primaryButtonText="Inviter"
        onPrimaryPress={handleInviteUser}
        onSecondaryPress={() => setShowInviteModal(false)}
        loading={loading}
        disabled={!inviteEmail.trim()}
        primaryIcon="send"
      >
        <TextInput
          label="Adresse email"
          value={inviteEmail}
          onChangeText={setInviteEmail}
          mode="outlined"
          style={sharedStyles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          left={<TextInput.Icon icon="email" />}
        />
      </GenericModal>


      <GenericModal
        visible={showAddToGroupModal}
        onDismiss={() => setShowAddToGroupModal(false)}
        title="Ajouter au groupe"
        icon="account-plus"
        primaryButtonText="Ajouter"
        onPrimaryPress={handleAddUserToGroup}
        onSecondaryPress={() => setShowAddToGroupModal(false)}
        loading={loading}
        disabled={!selectedUser || !selectedGroup}
        primaryIcon="check"
      >
        <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Utilisateur</Text>
          <Menu
            visible={false}
            onDismiss={() => {}}
            anchor={
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>
                  {selectedUser ? projectMembers.find(u => u.id === selectedUser)?.displayName : 'Sélectionner un utilisateur'}
                </Text>
                <View style={styles.modalArrow}>
                  <Icon 
                    source="chevron-down" 
                    size={16} 
                    color={colors.textSecondary}
                  />
                </View>
              </TouchableOpacity>
            }
          >
            {projectMembers.map((member) => (
              <Menu.Item
                key={member.id}
                onPress={() => setSelectedUser(member.id)}
                title={member.displayName}
              />
            ))}
          </Menu>
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Groupe</Text>
          <Menu
            visible={false}
            onDismiss={() => {}}
            anchor={
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>
                  {selectedGroup ? projectGroups.find(g => g.id === selectedGroup)?.name : 'Sélectionner un groupe'}
                </Text>
                <View style={styles.modalArrow}>
                  <Icon 
                    source="chevron-down" 
                    size={16} 
                    color={colors.textSecondary}
                  />
                </View>
              </TouchableOpacity>
            }
          >
            {projectGroups.map((group) => (
              <Menu.Item
                key={group.id}
                onPress={() => setSelectedGroup(group.id)}
                title={group.name}
              />
            ))}
          </Menu>
        </View>
      </GenericModal>

       {/* Modal d'assignation de ticket */}
       <GenericModal
         visible={showAssignModal}
         onDismiss={() => setShowAssignModal(false)}
         title="Assigner un ticket"
         icon="assignment"
         primaryButtonText="Assigner"
         onPrimaryPress={handleAssignTicket}
         onSecondaryPress={() => setShowAssignModal(false)}
         loading={loading}
         disabled={!selectedTicket || !selectedAssignee}
         primaryIcon="check"
       >
         <View style={styles.modalSection}>
           <Text style={styles.modalLabel}>Ticket</Text>
           <TouchableOpacity 
             style={styles.modalButton}
             onPress={() => setShowTicketMenu(!showTicketMenu)}
           >
             <Text style={styles.modalButtonText}>
               {selectedTicket ? projectTickets.find(t => t.id === selectedTicket)?.title : 'Sélectionner un ticket'}
             </Text>
             <Text style={styles.modalArrow}>▼</Text>
           </TouchableOpacity>
           
           {showTicketMenu && (
             <View style={styles.dropdownMenu}>
               {getUnassignedTickets().map((ticket) => (
                 <TouchableOpacity
                   key={ticket.id}
                   style={styles.dropdownItem}
                   onPress={() => {
                     setSelectedTicket(ticket.id);
                     setShowTicketMenu(false);
                   }}
                 >
                   <Text style={styles.dropdownItemText}>{ticket.title}</Text>
                 </TouchableOpacity>
               ))}
             </View>
           )}
         </View>

         <View style={styles.modalSection}>
           <Text style={styles.modalLabel}>Assigné à</Text>
           <TouchableOpacity 
             style={styles.modalButton}
             onPress={() => setShowAssigneeMenu(!showAssigneeMenu)}
           >
             <Text style={styles.modalButtonText}>
               {selectedAssignee ? projectMembers.find(u => u.id === selectedAssignee)?.displayName : 'Sélectionner un utilisateur'}
             </Text>
             <Text style={styles.modalArrow}>▼</Text>
           </TouchableOpacity>
           
           {showAssigneeMenu && (
             <View style={styles.dropdownMenu}>
               {projectMembers.map((member) => (
                 <TouchableOpacity
                   key={member.id}
                   style={styles.dropdownItem}
                   onPress={() => {
                     setSelectedAssignee(member.id);
                     setShowAssigneeMenu(false);
                   }}
                 >
                   <Text style={styles.dropdownItemText}>{member.displayName}</Text>
                 </TouchableOpacity>
               ))}
             </View>
           )}
         </View>
       </GenericModal>
    </SafeAreaView>
  );
};

export default TeamManagementScreen;