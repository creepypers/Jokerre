import React, { useState } from 'react';
import { View, FlatList, Alert, Animated, TouchableOpacity, Text } from 'react-native';
import { FAB, Card, Title, Paragraph, Button, Portal, Modal, TextInput, ActivityIndicator, Menu, IconButton, List } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useProject, Project } from '../context/ProjectContext';
import { sharedStyles } from '../styles/shared.styles';
import { colors } from '../utils/colors';
import { styles } from '../styles/ProjectsScreen.styles';

interface ProjectsScreenProps {
  navigation: any;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ navigation }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
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

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  const renderProject = ({ item, index }: { item: Project; index: number }) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 50],
                outputRange: [0, 50],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[sharedStyles.card, styles.projectCard]}
      onPress={() => navigation.navigate('ProjectDetails', { project: item })}
        activeOpacity={0.8}
      >
        <View style={sharedStyles.cardContent}>
          <View style={styles.projectHeader}>
            <Text style={sharedStyles.title}>{item.name}</Text>
            <View style={styles.projectHeaderRight}>
              <View style={styles.projectBadge}>
                <Text style={styles.badgeText}>
            {item.members.length} membre{item.members.length > 1 ? 's' : ''}
                </Text>
              </View>
              <Menu
                visible={showMenu === item.id}
                onDismiss={() => setShowMenu(null)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={20}
                    onPress={() => setShowMenu(item.id)}
                    iconColor={colors.textSecondary}
                  />
                }
              >
                <Menu.Item
                  onPress={() => handleEditProject(item)}
                  title="Modifier"
                  leadingIcon="pencil"
                />
                <Menu.Item
                  onPress={() => {
                    setShowMenu(null);
                    if (item.archived) {
                      handleRestoreProject(item.id);
                    } else {
                      handleArchiveProject(item.id);
                    }
                  }}
                  title={item.archived ? "Restaurer" : "Archiver"}
                  leadingIcon={item.archived ? "archive-arrow-up" : "archive"}
                />
                <Menu.Item
                  onPress={() => {
                    setShowMenu(null);
                    handleDeleteProject(item.id);
                  }}
                  title="Supprimer"
                  leadingIcon="delete"
                  titleStyle={{ color: colors.error }}
                />
              </Menu>
            </View>
          </View>
          {item.description && (
            <Text style={[sharedStyles.body, styles.projectDescription]}>
              {item.description}
            </Text>
          )}
          <View style={styles.projectFooter}>
            <View style={styles.projectStats}>
              <Text style={[styles.statText, item.archived && styles.archivedText]}>
                {item.archived ? "Projet archivé" : "Projet actif"}
              </Text>
            </View>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (projectsLoading) {
    return (
      <View style={sharedStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[sharedStyles.body, { marginTop: 16 }]}>Chargement des projets...</Text>
      </View>
    );
  }

  return (
    <View style={sharedStyles.container}>
      <Animated.View 
        style={[
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Mes Projets</Text>
              <Text style={styles.headerSubtitle}>
                {displayedProjects.length} projet{displayedProjects.length > 1 ? 's' : ''} {showArchived ? 'archivé' : 'actif'}{showArchived ? 's' : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Bouton de basculement */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !showArchived && styles.toggleButtonActive]}
          onPress={() => setShowArchived(false)}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleButtonText, !showArchived && styles.toggleButtonTextActive]}>
            Projets Actifs ({activeProjects.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, showArchived && styles.toggleButtonActive]}
          onPress={() => setShowArchived(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleButtonText, showArchived && styles.toggleButtonTextActive]}>
            Projets Archivés ({archivedProjects.length})
          </Text>
        </TouchableOpacity>
      </View>

      {displayedProjects.length === 0 ? (
        <Animated.View 
          style={[
            sharedStyles.emptyContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.emptyIcon}>📁</Text>
          <Text style={[sharedStyles.emptyText, styles.emptyTitle]}>
            {showArchived ? 'Aucun projet archivé' : 'Aucun projet trouvé'}
          </Text>
          <Text style={sharedStyles.emptyText}>
            {showArchived 
              ? 'Aucun projet n\'a été archivé pour le moment.' 
              : 'Créez votre premier projet pour commencer à organiser vos tâches !'
            }
          </Text>
        </Animated.View>
      ) : (
        <FlatList
          data={displayedProjects}
          renderItem={renderProject}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.fabContainer}>
        <FAB
          style={[styles.fab, styles.groupFab]}
          icon="account-group"
          onPress={() => navigation.navigate('GroupsDashboard')}
          label="Groupes"
          color="white"
        />
        <FAB
          icon="plus"
          style={[styles.fab, styles.customFab]}
          onPress={() => setShowCreateModal(true)}
          label="Projet"
          color="white"
        />
      </View>

      <Portal>
        <Modal
          visible={showCreateModal}
          onDismiss={handleCancelEdit}
          contentContainerStyle={sharedStyles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>{editingProject ? '✏️' : '📁'}</Text>
            <Text style={sharedStyles.modalTitle}>{editingProject ? 'Modifier le projet' : 'Nouveau Projet'}</Text>
          </View>
          
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
          
          <View style={styles.groupSelector}>
            <Text style={styles.groupSelectorLabel}>Assigner à un groupe (optionnel)</Text>
            <TouchableOpacity
              style={styles.groupDropdown}
              onPress={() => setShowGroupDropdown(!showGroupDropdown)}
              activeOpacity={0.7}
            >
              <View style={styles.groupDropdownContent}>
                <View style={styles.groupDropdownLeft}>
                  {selectedGroup ? (
                    <>
                      <View style={[styles.groupColorDot, { backgroundColor: teamGroups.find(g => g.id === selectedGroup)?.color || colors.primary }]} />
                      <Text style={styles.groupDropdownText}>
                        {teamGroups.find(g => g.id === selectedGroup)?.name || 'Groupe sélectionné'}
                      </Text>
                    </>
                  ) : (
                    <>
                      <View style={[styles.groupColorDot, { backgroundColor: colors.border }]} />
                      <Text style={[styles.groupDropdownText, styles.placeholderText]}>
                        Sélectionner un groupe
                      </Text>
                    </>
                  )}
                </View>
                <Text style={styles.dropdownArrow}>{showGroupDropdown ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>
            
            {showGroupDropdown && (
              <View style={styles.groupDropdownList}>
                <TouchableOpacity
                  style={styles.groupDropdownItem}
                  onPress={() => {
                    setSelectedGroup('');
                    setShowGroupDropdown(false);
                  }}
                >
                  <View style={styles.groupDropdownItemContent}>
                    <View style={[styles.groupColorDot, { backgroundColor: colors.border }]} />
                    <Text style={styles.groupDropdownItemText}>Aucun groupe</Text>
                  </View>
                </TouchableOpacity>
                {teamGroups.map((group) => (
                  <TouchableOpacity
                    key={group.id}
                    style={styles.groupDropdownItem}
                    onPress={() => {
                      setSelectedGroup(group.id);
                      setShowGroupDropdown(false);
                    }}
                  >
                    <View style={styles.groupDropdownItemContent}>
                      <View style={[styles.groupColorDot, { backgroundColor: group.color }]} />
                      <View style={styles.groupDropdownItemInfo}>
                        <Text style={styles.groupDropdownItemText}>{group.name}</Text>
                        <Text style={styles.groupDropdownItemDescription}>{group.description}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                {teamGroups.length === 0 && (
                  <View style={styles.groupDropdownItem}>
                    <Text style={styles.noGroupsText}>Aucun groupe disponible</Text>
                  </View>
                )}
              </View>
            )}
          </View>
          
          <View style={sharedStyles.modalButtons}>
            <Button
              mode="outlined"
              onPress={handleCancelEdit}
              style={[sharedStyles.modalButton, sharedStyles.secondaryButton]}
              labelStyle={sharedStyles.secondaryButtonText}
              icon="close"
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleCreateProject}
              style={[sharedStyles.modalButton, sharedStyles.primaryButton]}
              labelStyle={sharedStyles.primaryButtonText}
              disabled={loading || !projectName.trim()}
              icon={loading ? undefined : (editingProject ? "check" : "plus")}
            >
              {loading ? <ActivityIndicator color="white" size="small" /> : (editingProject ? 'Modifier' : 'Créer')}
            </Button>
          </View>
        </Modal>
      </Portal>

    

    </View>
  );
};

