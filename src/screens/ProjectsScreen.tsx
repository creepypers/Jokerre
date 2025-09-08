import React, { useState } from 'react';
import { View, FlatList, Alert, Text, TouchableOpacity } from 'react-native';
import { FAB, Card, Title, Paragraph, TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useProject, Project } from '../context/ProjectContext';
import { sharedStyles } from '../styles/shared.styles';
import { colors } from '../utils/colors';
import { styles } from '../styles/ProjectsScreen.styles';
import { Header, GenericModal, AnimatedView, ToggleButtons, GroupSelector, ContextMenu } from '../components';

interface ProjectsScreenProps {
  navigation: any;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ navigation }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const { user, logout } = useAuth();
  const { projects, teamGroups, createProject, updateProject, deleteProject, archiveProject, restoreProject, loading: projectsLoading } = useProject();

  const userProjects = projects.filter(p => p.createdBy === user?.uid);
  const activeProjects = userProjects.filter(p => !p.archived);
  const archivedProjects = userProjects.filter(p => p.archived);
  const displayedProjects = showArchived ? archivedProjects : activeProjects;

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un nom de projet');
      return;
    }

    setLoading(true);
    try {
      if (editingProject) {
        // Mode édition
        await updateProject(editingProject.id, {
          name: projectName.trim(),
          description: projectDescription.trim(),
        });
        Alert.alert('Succès', 'Projet modifié avec succès');
      } else {
        // Mode création
        await createProject(projectName.trim(), projectDescription.trim(), selectedGroup || undefined);
      }
      setProjectName('');
      setProjectDescription('');
      setSelectedGroup('');
      setEditingProject(null);
      setShowCreateModal(false);
    } catch (error: any) {
      Alert.alert('Erreur', editingProject ? 'Impossible de modifier le projet' : 'Impossible de créer le projet');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer définitivement ce projet ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProject(projectId);
              Alert.alert('Succès', 'Projet supprimé avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le projet');
            }
          }
        }
      ]
    );
  };

  const handleArchiveProject = async (projectId: string) => {
    try {
      await archiveProject(projectId);
      Alert.alert('Succès', 'Projet archivé avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'archiver le projet');
    }
  };

  const handleRestoreProject = async (projectId: string) => {
    try {
      await restoreProject(projectId);
      Alert.alert('Succès', 'Projet restauré avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de restaurer le projet');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description);
    setSelectedGroup(project.teamGroups[0] || '');
    setShowCreateModal(true);
    setShowMenu(null);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setProjectName('');
    setProjectDescription('');
    setSelectedGroup('');
    setShowCreateModal(false);
  };


  const renderProject = ({ item, index }: { item: Project; index: number }) => {
    const projectGroups = teamGroups.filter(g => item.teamGroups.includes(g.id));
    
    return (
      <AnimatedView animationType="both" delay={index * 100}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProjectDetails', { project: item })}
          activeOpacity={0.7}
        >
          <Card style={styles.projectCard}>
            <Card.Content>
              <View style={styles.projectHeader}>
                <View style={styles.projectInfo}>
                  <Title style={styles.projectTitle}>{item.name}</Title>
                  {item.description && (
                    <Paragraph style={styles.projectDescription}>{item.description}</Paragraph>
                  )}
                  
                  {/* Badges des groupes */}
                  {projectGroups.length > 0 && (
                    <View style={styles.groupsContainer}>
                      {projectGroups.map((group) => (
                        <View key={group.id} style={[styles.groupBadge, { backgroundColor: group.color }]}>
                          <Text style={styles.groupBadgeText}>{group.name}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  {item.archived && (
                    <Text style={styles.archivedText}>Archivé</Text>
                  )}
                </View>
                <ContextMenu
                  visible={showMenu === item.id}
                  onDismiss={() => setShowMenu(null)}
                  onOpen={() => setShowMenu(item.id)}
                  items={[
                    {
                      title: 'Modifier',
                      icon: 'pencil',
                      onPress: () => handleEditProject(item),
                    },
                    {
                      title: item.archived ? 'Restaurer' : 'Archiver',
                      icon: item.archived ? 'archive-arrow-up' : 'archive',
                      onPress: () => item.archived ? handleRestoreProject(item.id) : handleArchiveProject(item.id),
                    },
                    {
                      title: 'Supprimer',
                      icon: 'delete',
                      onPress: () => handleDeleteProject(item.id),
                      titleStyle: { color: colors.error },
                    },
                  ]}
                />
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </AnimatedView>
    );
  };

  if (projectsLoading) {
    return (
      <View style={sharedStyles.container}>
        <Header title="Mes Projets" />
        <View style={sharedStyles.loadingContainer}>
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>Chargement des projets...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={sharedStyles.container}>
      <AnimatedView animationType="both">
        <Header
          title="Mes Projets"
          subtitle={`${displayedProjects.length} projet${displayedProjects.length > 1 ? 's' : ''} ${showArchived ? 'archivé' : 'actif'}${showArchived ? 's' : ''}`}
          rightElement={
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          }
        />
      </AnimatedView>

      <ToggleButtons
        options={[
          { value: 'active', label: 'Projets Actifs', count: activeProjects.length },
          { value: 'archived', label: 'Projets Archivés', count: archivedProjects.length },
        ]}
        selectedValue={showArchived ? 'archived' : 'active'}
        onValueChange={(value) => setShowArchived(value === 'archived')}
      />

      {displayedProjects.length === 0 ? (
        <AnimatedView 
          style={sharedStyles.emptyContainer}
          animationType="fade"
        >
          <Text style={{ fontSize: 48, marginBottom: 16 }}>
            {showArchived ? '📁' : '📂'}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>
            {showArchived ? 'Aucun projet archivé' : 'Aucun projet'}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 }}>
            {showArchived 
              ? 'Vous n\'avez pas encore archivé de projets.'
              : 'Commencez par créer votre premier projet pour organiser votre travail.'
            }
          </Text>
        </AnimatedView>
      ) : (
        <FlatList
          data={displayedProjects}
          renderItem={renderProject}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.projectsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.fabContainer}>
        <FAB
          icon="account-group"
          style={[styles.fab, styles.groupFab]}
          onPress={() => navigation.navigate('GroupsDashboard')}
          label="Groupes"
          color="white"
        />
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowCreateModal(true)}
          label="Nouveau projet"
          color="white"
        />
      </View>

      <GenericModal
        visible={showCreateModal}
        onDismiss={handleCancelEdit}
        title={editingProject ? 'Modifier le projet' : 'Nouveau Projet'}
        icon={editingProject ? '✏️' : '📁'}
        primaryButtonText={editingProject ? 'Modifier' : 'Créer'}
        onPrimaryPress={handleCreateProject}
        onSecondaryPress={handleCancelEdit}
        loading={loading}
        disabled={!projectName.trim()}
        primaryIcon={editingProject ? "check" : "plus"}
      >
        <TextInput
          label="Nom du projet"
          value={projectName}
          onChangeText={setProjectName}
          mode="outlined"
          style={sharedStyles.input}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          left={<TextInput.Icon icon="folder-outline" />}
        />
        
        <TextInput
          label="Description (optionnel)"
          value={projectDescription}
          onChangeText={setProjectDescription}
          mode="outlined"
          style={sharedStyles.input}
          multiline
          numberOfLines={3}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          left={<TextInput.Icon icon="text" />}
        />
        
        <GroupSelector
          label="Assigner à un groupe (optionnel)"
          selectedGroup={selectedGroup}
          onGroupSelect={(groupId) => {
            setSelectedGroup(groupId);
            setShowGroupDropdown(false);
          }}
          groups={teamGroups}
          showDropdown={showGroupDropdown}
          onToggleDropdown={() => setShowGroupDropdown(!showGroupDropdown)}
          placeholder="Sélectionner un groupe"
        />
      </GenericModal>

    </View>
  );
};
