import React, { useState, useEffect } from 'react';
import { View, ScrollView, Animated, TouchableOpacity, Text, Alert, Dimensions } from 'react-native';
import { Title, FAB, Portal, Modal, TextInput, Button, ActivityIndicator, Card, Chip, IconButton, Avatar, Badge } from 'react-native-paper';
import { useProject, TeamGroup, User } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/colors';
import { sharedStyles } from '../styles/shared.styles';
import { styles } from '../styles/TeamManagementScreen.styles';

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
    createTeamGroup,
    updateTeamGroup,
    deleteTeamGroup,
    addUserToGroup,
    removeUserFromGroup,
    assignTicketToUser,
    assignTicketToGroup,
    autoAssignTickets
  } = useProject();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'members'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const project = projects.find(p => p.id === projectId);
  const isAdmin = project?.createdBy === user?.uid;

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

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) return;
    
    setLoading(true);
    try {
      await inviteUserToProject(projectId, inviteEmail.trim());
      setInviteEmail('');
      setShowInviteModal(false);
      Alert.alert('Succès', 'Invitation envoyée avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer l\'invitation');
    } finally {
      setLoading(false);
    }
  };


  const handleRemoveUser = async (userId: string) => {
    Alert.alert(
      'Confirmer',
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



  const renderMembers = () => (
    <View style={styles.membersContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Membres de l'équipe</Text>
        {isAdmin && (
          <Button
            mode="outlined"
            onPress={() => setShowInviteModal(true)}
            style={styles.inviteButton}
            icon="account-plus"
            compact
          >
            Inviter
          </Button>
        )}
      </View>

      {project?.members.map((memberId) => {
        const member = projectUsers.find(u => u.id === memberId);
        const isCurrentUser = memberId === user?.uid;
        const isProjectAdmin = memberId === project?.createdBy;
        
        return (
          <Card key={memberId} style={styles.memberCard}>
            <Card.Content style={styles.memberContent}>
              <View style={styles.memberInfo}>
                <View style={[styles.memberAvatar, isProjectAdmin && styles.adminAvatar]}>
                  <Text style={styles.memberAvatarText}>
                    {member?.displayName?.charAt(0) || 'U'}
                  </Text>
                </View>
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>
                    {member?.displayName || 'Utilisateur inconnu'}
                  </Text>
                  <Text style={styles.memberEmail}>
                    {member?.email || 'Email non disponible'}
                  </Text>
                  <View style={styles.memberBadges}>
                    {isProjectAdmin && (
                      <Text style={styles.adminBadge}>Admin</Text>
                    )}
                    {isCurrentUser && (
                      <Text style={styles.currentUserBadge}>Vous</Text>
                    )}
                  </View>
                </View>
              </View>
              {isAdmin && !isCurrentUser && (
                <TouchableOpacity
                  onPress={() => handleRemoveUser(memberId)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </Card.Content>
          </Card>
        );
      })}
    </View>
  );


  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.projectInfo}>
            <Text style={styles.projectTitle}>Gestion d'équipe</Text>
            <Text style={styles.projectDescription}>
              {project?.name} • {project?.members.length || 0} membre{project?.members.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderMembers()}
      </ScrollView>

      {/* Modal d'invitation */}
      <Portal>
        <Modal
          visible={showInviteModal}
          onDismiss={() => setShowInviteModal(false)}
          contentContainerStyle={sharedStyles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>📧</Text>
            <Text style={sharedStyles.modalTitle}>Inviter un membre</Text>
          </View>
          
          <TextInput
            label="Email du membre"
            value={inviteEmail}
            onChangeText={setInviteEmail}
            mode="outlined"
            style={sharedStyles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="email" />}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <View style={sharedStyles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowInviteModal(false)}
              style={[sharedStyles.modalButton, sharedStyles.secondaryButton]}
              labelStyle={sharedStyles.secondaryButtonText}
              icon="close"
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleInviteUser}
              style={[sharedStyles.modalButton, sharedStyles.primaryButton]}
              labelStyle={sharedStyles.primaryButtonText}
              disabled={loading || !inviteEmail.trim()}
              icon={loading ? undefined : "send"}
            >
              {loading ? <ActivityIndicator color="white" size="small" /> : 'Inviter'}
            </Button>
          </View>
        </Modal>
      </Portal>

    </View>
  );
};

export default TeamManagementScreen;
