import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert, Dimensions } from 'react-native';
import { Title, FAB, TextInput, Card, IconButton, Menu, Button } from 'react-native-paper';
import { useProject, TeamGroup } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/colors';
import { sharedStyles } from '../styles/shared.styles';
import { styles } from '../styles/GroupsDashboardScreen.styles';
import { Header, GenericModal, AnimatedView, BackButton, ContextMenu } from '../components';

interface GroupsDashboardScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

export const GroupsDashboardScreen: React.FC<GroupsDashboardScreenProps> = ({ navigation }) => {
  const { teamGroups, projects, projectUsers, createTeamGroup, updateTeamGroup, deleteTeamGroup, getTicketsByProject, assignGroupToProject } = useProject();
  const { user } = useAuth();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignProjectModal, setShowAssignProjectModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupColor, setGroupColor] = useState('#3B82F6');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const colorOptions = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const userProjects = projects.filter(p => p.createdBy === user?.uid);
  const userGroups = teamGroups.filter(g => g.members.includes(user?.uid || ''));

  React.useEffect(() => {
    // Animation handled by AnimatedView component
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un nom de groupe');
      return;
    }

    setLoading(true);
    try {
      await createTeamGroup('', groupName.trim(), groupDescription.trim(), groupColor);
      setGroupName('');
      setGroupDescription('');
      setGroupColor('#3B82F6');
      setShowCreateModal(false);
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de créer le groupe');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce groupe ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTeamGroup(groupId);
              Alert.alert('Succès', 'Groupe supprimé avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le groupe');
            }
          }
        }
      ]
    );
  };



  const handleAssignProject = async () => {
    if (!selectedGroup || !selectedProject) {
      Alert.alert('Erreur', 'Veuillez sélectionner un groupe et un projet');
      return;
    }

    setLoading(true);
    try {
      await assignGroupToProject(selectedProject, selectedGroup);
      Alert.alert('Succès', 'Groupe assigné au projet avec succès');
      setSelectedGroup('');
      setSelectedProject('');
      setShowAssignProjectModal(false);
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible d\'assigner le groupe au projet');
    } finally {
      setLoading(false);
    }
  };

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const renderGroup = (group: TeamGroup) => {
    const isExpanded = expandedGroups.has(group.id);
    const groupProjects = userProjects.filter(p => p.teamGroups.includes(group.id));
    const groupMembers = projectUsers.filter(u => group.members.includes(u.id));
    const groupTickets = groupProjects.flatMap(p => getTicketsByProject(p.id));

    return (
      <AnimatedView key={group.id} animationType="both">
        <TouchableOpacity
          onPress={() => navigation.navigate('GroupMembers', { group })}
          style={styles.groupCardTouchable}
        >
          <Card style={styles.groupCard}>
            <Card.Content>
              <View style={styles.groupHeader}>
                <View style={styles.groupInfo}>
                  <View style={[styles.groupColorIndicator, { backgroundColor: group.color }]} />
                  <View style={styles.groupDetails}>
                    <Title style={styles.groupName}>{group.name}</Title>
                    <Text style={styles.groupDescription}>{group.description}</Text>
                  </View>
                </View>
                <View style={styles.groupActions}>
                  <ContextMenu
                    visible={showMenu === group.id}
                    onDismiss={() => setShowMenu(null)}
                    onOpen={() => setShowMenu(group.id)}
                    items={[
                      {
                        title: 'Gérer les membres',
                        icon: 'account-group',
                        onPress: () => navigation.navigate('GroupMembers', { group }),
                      },
                      {
                        title: 'Supprimer',
                        icon: 'delete',
                        onPress: () => handleDeleteGroup(group.id),
                        titleStyle: { color: colors.error },
                      },
                    ]}
                  />
                  <TouchableOpacity
                    onPress={() => toggleGroupExpansion(group.id)}
                    style={styles.expandButton}
                  >
                    <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <View style={styles.projectsSection}>
                  <Text style={styles.projectsTitle}>Projets associés ({groupProjects.length})</Text>
                  <View style={styles.projectsList}>
                    {groupProjects.map((project) => (
                      <Text key={project.id} style={styles.projectItem}>• {project.name}</Text>
                    ))}
                    {groupProjects.length === 0 && (
                      <Text style={styles.noMembersText}>Aucun projet associé</Text>
                    )}
                  </View>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
        </TouchableOpacity>
      </AnimatedView>
    );
  };

  if (loading) {
    return (
      <View style={sharedStyles.container}>
        <Header 
          title="Gestion des Groupes" 
          subtitle="Organisez vos équipes et projets"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={sharedStyles.loadingContainer}>
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>Chargement...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={sharedStyles.container}>
      <Header 
        title="Gestion des Groupes" 
        subtitle="Organisez vos équipes et projets"
        rightElement={
          <BackButton onPress={() => navigation.goBack()} />
        }
      />

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>{userGroups.length}</Text>
              <Text style={styles.statLabel}>Mes Groupes</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>{userProjects.length}</Text>
              <Text style={styles.statLabel}>Projets</Text>
            </Card.Content>
          </Card>
        </View>


        <View style={styles.groupsContainer}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Mes Groupes ({userGroups.length})</Title>
          </View>
          
          {userGroups.length === 0 ? (
            <AnimatedView 
              style={styles.emptyState}
              animationType="fade"
            >
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyTitle}>Aucun groupe</Text>
              <Text style={styles.emptyDescription}>
                Créez votre premier groupe pour organiser votre équipe et vos projets.
              </Text>
            </AnimatedView>
          ) : (
            userGroups.map(renderGroup)
          )}
        </View>
      </ScrollView>

      <View style={styles.fabContainer}>
        <FAB
          icon="link"
          style={[styles.fab, styles.assignFab]}
          onPress={() => setShowAssignProjectModal(true)}
          label="Assigner"
          color="white"
        />
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowCreateModal(true)}
          label="Nouveau groupe"
          color="white"
        />
      </View>

      <GenericModal
        visible={showCreateModal}
        onDismiss={() => setShowCreateModal(false)}
        title="Nouveau Groupe"
        icon="👥"
        primaryButtonText="Créer"
        onPrimaryPress={handleCreateGroup}
        loading={loading}
        disabled={!groupName.trim()}
        primaryIcon="plus"
      >
        <TextInput
          label="Nom du groupe"
          value={groupName}
          onChangeText={setGroupName}
          mode="outlined"
          style={sharedStyles.input}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          left={<TextInput.Icon icon="account-group" />}
        />
        
        <TextInput
          label="Description (optionnel)"
          value={groupDescription}
          onChangeText={setGroupDescription}
          mode="outlined"
          style={sharedStyles.input}
          multiline
          numberOfLines={3}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          left={<TextInput.Icon icon="text" />}
        />
        
        <View style={styles.colorPicker}>
          <Text style={styles.colorPickerLabel}>Couleur du groupe</Text>
          <View style={styles.colorOptions}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  groupColor === color && styles.selectedColorOption
                ]}
                onPress={() => setGroupColor(color)}
              />
            ))}
          </View>
        </View>
      </GenericModal>



      <GenericModal
        visible={showAssignProjectModal}
        onDismiss={() => setShowAssignProjectModal(false)}
        title="Assigner un projet"
        icon="🔗"
        primaryButtonText="Assigner"
        onPrimaryPress={handleAssignProject}
        onSecondaryPress={() => setShowAssignProjectModal(false)}
        loading={loading}
        disabled={!selectedGroup || !selectedProject}
        primaryIcon="link"
      >
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>Sélectionner un groupe</Text>
          <Menu
            visible={showGroupDropdown}
            onDismiss={() => setShowGroupDropdown(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setShowGroupDropdown(true)}
                style={styles.dropdownButton}
                contentStyle={styles.dropdownContent}
                labelStyle={styles.dropdownLabel}
              >
                {selectedGroup ? userGroups.find(g => g.id === selectedGroup)?.name || 'Sélectionner un groupe' : 'Sélectionner un groupe'}
              </Button>
            }
          >
            {userGroups.map((group) => (
              <Menu.Item
                key={group.id}
                onPress={() => {
                  setSelectedGroup(group.id);
                  setShowGroupDropdown(false);
                }}
                title={group.name}
                leadingIcon={() => (
                  <View style={[styles.groupColorDot, { backgroundColor: group.color }]} />
                )}
              />
            ))}
          </Menu>
        </View>

        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>Sélectionner un projet</Text>
          <Menu
            visible={showProjectDropdown}
            onDismiss={() => setShowProjectDropdown(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setShowProjectDropdown(true)}
                style={styles.dropdownButton}
                contentStyle={styles.dropdownContent}
                labelStyle={styles.dropdownLabel}
              >
                {selectedProject ? userProjects.find(p => p.id === selectedProject)?.name || 'Sélectionner un projet' : 'Sélectionner un projet'}
              </Button>
            }
          >
            {userProjects.map((project) => (
              <Menu.Item
                key={project.id}
                onPress={() => {
                  setSelectedProject(project.id);
                  setShowProjectDropdown(false);
                }}
                title={project.name}
                leadingIcon={() => (
                  <Text style={styles.projectIcon}>📋</Text>
                )}
              />
            ))}
          </Menu>
        </View>
      </GenericModal>
    </View>
  );
};
