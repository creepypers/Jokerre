import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert, Dimensions, RefreshControl } from 'react-native';
import { Title, FAB, TextInput, Card, Chip, IconButton, Avatar, Badge, SegmentedButtons, Menu, Divider } from 'react-native-paper';
import { useProject, TeamGroup, User } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/colors';
import { sharedStyles } from '../styles/shared.styles';
import { styles } from '../styles/TeamManagementScreen.styles';
import { Header, GenericModal, AnimatedView, BackButton, ContextMenu } from '../components';

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
    inviteUserToProject, 
    removeUserFromProject, 
    updateUserRole,
    addUserToGroup,
    removeUserFromGroup,
    loading: projectLoading 
  } = useProject();
  const { user } = useAuth();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const project = projects.find(p => p.id === projectId);
  const projectMembers = projectUsers.filter(u => project?.members.includes(u.id));
  const projectGroups = teamGroups.filter(g => project?.teamGroups.includes(g.id));

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


  const renderUser = (user: User, index: number) => {
    const userGroups = projectGroups.filter(g => g.members.includes(user.id));
    
    return (
      <AnimatedView key={user.id} animationType="both" delay={index * 100}>
        <Card style={styles.memberCard}>
          <Card.Content>
            <View style={styles.memberHeader}>
              <View style={styles.memberInfo}>
                <Avatar.Text 
                  size={48} 
                  label={user.displayName.charAt(0).toUpperCase()} 
                  style={[styles.memberAvatar, { backgroundColor: colors.primary }]}
                />
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{user.displayName}</Text>
                  <Text style={styles.memberEmail}>{user.email}</Text>
                  {userGroups.length > 0 && (
                    <View style={styles.memberGroups}>
                      {userGroups.map(group => (
                        <Chip 
                          key={group.id} 
                          style={[styles.groupChip, { backgroundColor: group.color }]}
                          textStyle={styles.groupChipText}
                        >
                          {group.name}
                        </Chip>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.memberActions}>
                <Badge style={styles.roleBadge}>
                  {user.id === project?.createdBy ? 'Propriétaire' : 'Membre'}
                </Badge>
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
      <View style={sharedStyles.container}>
        <Header 
          title="Gestion d'Équipe" 
          subtitle={project?.name || 'Chargement...'}
          rightElement={<BackButton onPress={() => navigation.goBack()} />}
        />
        <View style={sharedStyles.loadingContainer}>
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>Chargement...</Text>
        </View>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={sharedStyles.container}>
        <Header 
          title="Gestion d'Équipe" 
          subtitle="Projet non trouvé"
          rightElement={<BackButton onPress={() => navigation.goBack()} />}
        />
        <View style={sharedStyles.emptyContainer}>
          <Text style={sharedStyles.emptyTitle}>Projet non trouvé</Text>
          <Text style={sharedStyles.emptyDescription}>
            Le projet demandé n'existe pas ou vous n'y avez pas accès.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={sharedStyles.container}>
      <Header 
        title="Gestion d'Équipe" 
        subtitle={project.name}
        rightElement={<BackButton onPress={() => navigation.goBack()} />}
      />

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statIcon}>👥</Text>
              <Text style={styles.statNumber}>{projectMembers.length}</Text>
              <Text style={styles.statLabel}>Membres</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statIcon}>🏷️</Text>
              <Text style={styles.statNumber}>{projectGroups.length}</Text>
              <Text style={styles.statLabel}>Groupes</Text>
            </Card.Content>
          </Card>
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
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={sharedStyles.emptyTitle}>Aucun membre</Text>
              <Text style={sharedStyles.emptyDescription}>
                Invitez des utilisateurs à rejoindre ce projet.
              </Text>
            </AnimatedView>
          ) : (
            projectMembers.map((member, index) => renderUser(member, index))
          )}
        </View>
      </ScrollView>

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
                <Text style={styles.modalArrow}>▼</Text>
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
                <Text style={styles.modalArrow}>▼</Text>
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
    </View>
  );
};

export default TeamManagementScreen;