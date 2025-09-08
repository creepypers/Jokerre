import React, { useState, useEffect } from 'react';
import { View, ScrollView, Animated, TouchableOpacity, Text, Alert, Dimensions } from 'react-native';
import { Title, FAB, Portal, Modal, TextInput, Button, ActivityIndicator, Card, IconButton } from 'react-native-paper';
import { useProject, TeamGroup } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/colors';
import { sharedStyles } from '../styles/shared.styles';
import { styles } from '../styles/GroupsDashboardScreen.styles';

interface GroupsDashboardScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

export const GroupsDashboardScreen: React.FC<GroupsDashboardScreenProps> = ({ navigation }) => {
  const { teamGroups, projects, projectUsers, createTeamGroup, updateTeamGroup, deleteTeamGroup, assignTicketToGroup, addUserToGroup, getTicketsByProject } = useProject();
  const { user } = useAuth();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupColor, setGroupColor] = useState('#3B82F6');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [memberEmail, setMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const userProjects = projects.filter(p => p.createdBy === user?.uid);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    
    setLoading(true);
    try {
      await createTeamGroup(
        '', // projectId - Groupe global (empty string)
        groupName.trim(),
        groupDescription.trim(),
        groupColor
      );
      setGroupName('');
      setGroupDescription('');
      setGroupColor('#3B82F6');
      setShowCreateModal(false);
      Alert.alert('Succès', 'Groupe créé avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le groupe');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    Alert.alert(
      'Confirmer',
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
    if (!selectedGroup || !selectedProject) return;
    
    setLoading(true);
    try {
      const projectTickets = getTicketsByProject(selectedProject);
      
      for (const ticket of projectTickets) {
        await assignTicketToGroup(ticket.id, selectedGroup);
      }
      
      setSelectedGroup('');
      setSelectedProject('');
      setShowAssignModal(false);
      Alert.alert('Succès', 'Projet assigné au groupe avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'assigner le projet au groupe');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim() || !selectedGroup) return;
    
    setLoading(true);
    try {
      // Trouver l'utilisateur par email
      const userToAdd = projectUsers.find(u => u.email === memberEmail.trim());
      if (!userToAdd) {
        Alert.alert('Erreur', 'Utilisateur non trouvé avec cet email');
        return;
      }

      await addUserToGroup(selectedGroup, userToAdd.id);
      setMemberEmail('');
      setSelectedGroup('');
      setShowAddMemberModal(false);
      Alert.alert('Succès', 'Membre ajouté au groupe avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter le membre au groupe');
    } finally {
      setLoading(false);
    }
  };

  const getGroupMembers = (group: TeamGroup) => {
    return projectUsers.filter(user => group.members.includes(user.id));
  };

  const getAssignedProjects = (group: TeamGroup) => {
    return projects.filter(project => project.teamGroups?.includes(group.id));
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Gestion des Groupes</Text>
            <Text style={styles.headerSubtitle}>Organisez vos équipes et projets</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>{teamGroups.length}</Text>
              <Text style={styles.statLabel}>Groupes créés</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>
                {teamGroups.reduce((total, group) => total + group.members.length, 0)}
              </Text>
              <Text style={styles.statLabel}>Membres total</Text>
            </Card.Content>
          </Card>
        </View>


        <View style={styles.groupsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Groupes disponibles</Text>
            <Button
              mode="outlined"
              onPress={() => setShowAssignModal(true)}
              style={styles.assignButton}
              icon="link"
              compact
            >
              Assigner un projet
            </Button>
          </View>

           {teamGroups.map((group) => {
             const members = getGroupMembers(group);
             const assignedProjects = getAssignedProjects(group);
             
             return (
               <Card key={group.id} style={styles.groupCard}>
                 <Card.Content style={styles.groupContent}>
                   <TouchableOpacity 
                     style={styles.groupHeader}
                     onPress={() => navigation.navigate('GroupMembers', { group })}
                     activeOpacity={0.7}
                   >
                     <View style={styles.groupInfo}>
                       <View style={[styles.groupColorIndicator, { backgroundColor: group.color }]} />
                       <View style={styles.groupDetails}>
                         <Text style={styles.groupName}>{group.name}</Text>
                         <Text style={styles.groupDescription}>{group.description}</Text>
                       </View>
                     </View>
                     <View style={styles.groupActions}>
                       <TouchableOpacity
                         onPress={() => handleDeleteGroup(group.id)}
                         style={styles.deleteButton}
                       >
                         <Text style={styles.deleteButtonText}>×</Text>
                       </TouchableOpacity>
                       <Text style={styles.expandIcon}>→</Text>
                     </View>
                   </TouchableOpacity>

                  <View style={styles.groupStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statItemNumber}>{members.length}</Text>
                      <Text style={styles.statItemLabel}>Membres</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statItemNumber}>{assignedProjects.length}</Text>
                      <Text style={styles.statItemLabel}>Projets</Text>
                    </View>
                  </View>

                   {assignedProjects.length > 0 && (
                     <View style={styles.projectsSection}>
                       <Text style={styles.projectsTitle}>Projets assignés :</Text>
                       <View style={styles.projectsList}>
                         {assignedProjects.map((project) => (
                           <Text key={project.id} style={styles.projectItem}>
                             • {project.name}
                           </Text>
                         ))}
                       </View>
                     </View>
                   )}
                </Card.Content>
              </Card>
            );
          })}

          {teamGroups.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyTitle}>Aucun groupe créé</Text>
              <Text style={styles.emptyDescription}>
                Créez votre premier groupe pour organiser vos équipes
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setShowCreateModal(true)}
        color="white"
      />

      {/* Modal de création de groupe */}
      <Portal>
        <Modal
          visible={showCreateModal}
          onDismiss={() => setShowCreateModal(false)}
          contentContainerStyle={sharedStyles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>👥</Text>
            <Text style={sharedStyles.modalTitle}>Créer un groupe</Text>
          </View>
          
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
              {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map((color) => (
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
          
          <View style={sharedStyles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowCreateModal(false)}
              style={[sharedStyles.modalButton, sharedStyles.secondaryButton]}
              labelStyle={sharedStyles.secondaryButtonText}
              icon="close"
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleCreateGroup}
              style={[sharedStyles.modalButton, sharedStyles.primaryButton]}
              labelStyle={sharedStyles.primaryButtonText}
              icon="check"
              disabled={loading || !groupName.trim()}
            >
              {loading ? <ActivityIndicator color="white" size="small" /> : 'Créer'}
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Modal d'assignation de projet */}
      <Portal>
        <Modal
          visible={showAssignModal}
          onDismiss={() => setShowAssignModal(false)}
          contentContainerStyle={sharedStyles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>🔗</Text>
            <Text style={sharedStyles.modalTitle}>Assigner un projet à un groupe</Text>
          </View>
          
          <Text style={styles.assignDescription}>
            Sélectionnez un projet et un groupe pour assigner tous les tickets du projet au groupe.
          </Text>
          
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>Projet :</Text>
            {userProjects.map((project) => (
              <TouchableOpacity
                key={project.id}
                style={[
                  styles.optionItem,
                  selectedProject === project.id && styles.selectedOption
                ]}
                onPress={() => setSelectedProject(project.id)}
              >
                <Text style={styles.optionName}>{project.name}</Text>
                <Text style={styles.optionDescription}>{project.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>Groupe :</Text>
            {teamGroups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.optionItem,
                  selectedGroup === group.id && styles.selectedOption
                ]}
                onPress={() => setSelectedGroup(group.id)}
              >
                <View style={styles.groupOptionContent}>
                  <View style={[styles.groupColorDot, { backgroundColor: group.color }]} />
                  <View style={styles.groupOptionInfo}>
                    <Text style={styles.optionName}>{group.name}</Text>
                    <Text style={styles.optionDescription}>{group.description}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={sharedStyles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowAssignModal(false)}
              style={[sharedStyles.modalButton, sharedStyles.secondaryButton]}
              labelStyle={sharedStyles.secondaryButtonText}
              icon="close"
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleAssignProject}
              style={[sharedStyles.modalButton, sharedStyles.primaryButton]}
              labelStyle={sharedStyles.primaryButtonText}
              icon="check"
              disabled={!selectedGroup || !selectedProject || loading}
            >
              {loading ? <ActivityIndicator color="white" size="small" /> : 'Assigner'}
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Modal d'ajout de membre */}
      <Portal>
        <Modal
          visible={showAddMemberModal}
          onDismiss={() => setShowAddMemberModal(false)}
          contentContainerStyle={sharedStyles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>👤</Text>
            <Text style={sharedStyles.modalTitle}>Ajouter un membre au groupe</Text>
          </View>
          
          <Text style={styles.addMemberDescription}>
            Sélectionnez un groupe et saisissez l'email du membre à ajouter.
          </Text>
          
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>Groupe :</Text>
            {teamGroups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.optionItem,
                  selectedGroup === group.id && styles.selectedOption
                ]}
                onPress={() => setSelectedGroup(group.id)}
              >
                <View style={styles.groupOptionContent}>
                  <View style={[styles.groupColorDot, { backgroundColor: group.color }]} />
                  <View style={styles.groupOptionInfo}>
                    <Text style={styles.optionName}>{group.name}</Text>
                    <Text style={styles.optionDescription}>{group.description}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <TextInput
            label="Email du membre"
            value={memberEmail}
            onChangeText={setMemberEmail}
            mode="outlined"
            style={sharedStyles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="email" />}
            placeholder="exemple@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <View style={sharedStyles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowAddMemberModal(false)}
              style={[sharedStyles.modalButton, sharedStyles.secondaryButton]}
              labelStyle={sharedStyles.secondaryButtonText}
              icon="close"
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleAddMember}
              style={[sharedStyles.modalButton, sharedStyles.primaryButton]}
              labelStyle={sharedStyles.primaryButtonText}
              icon="check"
              disabled={!selectedGroup || !memberEmail.trim() || loading}
            >
              {loading ? <ActivityIndicator color="white" size="small" /> : 'Ajouter'}
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default GroupsDashboardScreen;
