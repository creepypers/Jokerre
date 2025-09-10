import React, { useState, useEffect } from 'react';
import { View, ScrollView, Animated, TouchableOpacity, Text, Alert, Dimensions, SafeAreaView, FlatList } from 'react-native';
import { FAB, Portal, Modal, TextInput, Button, ActivityIndicator, Card, Icon, List } from 'react-native-paper';
import { useProject, TeamGroup } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/colors';
import { sharedStyles } from '../styles/shared.styles';
import { styles } from '../styles/GroupMembersScreen.styles';

interface GroupMembersScreenProps {
  navigation: any;
  route: any;
}

const { width } = Dimensions.get('window');

export const GroupMembersScreen: React.FC<GroupMembersScreenProps> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const { teamGroups, projectUsers, addUserToGroup, removeUserFromGroup } = useProject();
  const { user } = useAuth();
  
  const group = teamGroups.find(g => g.id === groupId);
  
  if (!group) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text>Groupe non trouvé</Text>
      </SafeAreaView>
    );
  }
  
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const groupMembers = projectUsers.filter(user => group.members.includes(user.id));

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

  const handleAddMember = async () => {
    if (!memberEmail.trim()) return;
    
    setLoading(true);
    try {
      // Trouver l'utilisateur par email
      const userToAdd = projectUsers.find(u => u.email === memberEmail.trim());
      if (!userToAdd) {
        Alert.alert('Erreur', 'Utilisateur non trouvé avec cet email');
        return;
      }

      if (group.members.includes(userToAdd.id)) {
        Alert.alert('Erreur', 'Cet utilisateur est déjà membre du groupe');
        return;
      }

      await addUserToGroup(group.id, userToAdd.id);
      setMemberEmail('');
      setShowAddMemberModal(false);
      Alert.alert('Succès', 'Membre ajouté au groupe avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter le membre au groupe');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    Alert.alert(
      'Confirmer',
      `Voulez-vous retirer ${memberName} du groupe ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeUserFromGroup(group.id, memberId);
              Alert.alert('Succès', 'Membre retiré du groupe avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de retirer le membre du groupe');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
            <View style={styles.groupHeaderInfo}>
              <View style={[styles.groupColorIndicator, { backgroundColor: group.color }]} />
              <View>
                <Text style={styles.headerTitle}>{group.name}</Text>
                <Text style={styles.headerSubtitle}>{group.description}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.content}>
        {/* Statistiques du groupe */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>{groupMembers.length}</Text>
              <Text style={styles.statLabel}>Membres</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>
                {groupMembers.filter(member => member.role === 'admin').length}
              </Text>
              <Text style={styles.statLabel}>Administrateurs</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Liste des membres */}
        <View style={styles.membersContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Membres du groupe</Text>
            <TouchableOpacity
              style={styles.addMemberButton}
              onPress={() => setShowAddMemberModal(true)}
            >
              <Text style={styles.addMemberButtonText}>+ Ajouter</Text>
            </TouchableOpacity>
          </View>

          {groupMembers.length > 0 ? (
            <FlatList
              data={groupMembers}
              renderItem={({ item: member }) => (
                <Card style={styles.memberCard}>
                  <Card.Content style={styles.memberContent}>
                    <View style={styles.memberInfo}>
                      <View style={styles.memberAvatar}>
                        <Text style={styles.memberAvatarText}>
                          {member.displayName?.charAt(0) || member.email.charAt(0)}
                        </Text>
                      </View>
                      <View style={styles.memberDetails}>
                        <Text style={styles.memberName}>
                          {member.displayName || member.email}
                        </Text>
                        <Text style={styles.memberEmail}>{member.email}</Text>
                        {member.role && (
                          <Text style={styles.memberRole}>
                            {member.role === 'admin' ? 'Administrateur' : 'Membre'}
                          </Text>
                        )}
                      </View>
                    </View>
                    
                    {member.id !== user?.uid && (
                      <TouchableOpacity
                        onPress={() => handleRemoveMember(member.id, member.displayName || member.email)}
                        style={styles.removeButton}
                      >
                        <Icon source="account-remove" size={20} color={colors.error} />
                      </TouchableOpacity>
                    )}
                  </Card.Content>
                </Card>
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.membersList}
              nestedScrollEnabled={true}
            />
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Icon 
                  source="account-group" 
                  size={48} 
                  color={colors.textSecondary}
                />
              </View>
              <Text style={styles.emptyTitle}>Aucun membre</Text>
              <Text style={styles.emptyDescription}>
                Ajoutez des membres à ce groupe pour commencer
              </Text>
            </View>
          )}
        </View>
      </View>

      <FAB
        style={styles.fab}
        icon="account-plus"
        onPress={() => setShowAddMemberModal(true)}
        color="white"
      />

      {/* Modal d'ajout de membre */}
      <Portal>
        <Modal
          visible={showAddMemberModal}
          onDismiss={() => setShowAddMemberModal(false)}
          contentContainerStyle={sharedStyles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>👤</Text>
            <Text style={sharedStyles.modalTitle}>Ajouter un membre</Text>
          </View>
          
          <Text style={styles.addMemberDescription}>
            Saisissez l'email du membre à ajouter au groupe "{group.name}".
          </Text>
          
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
              disabled={!memberEmail.trim() || loading}
            >
              {loading ? <ActivityIndicator color="white" size="small" /> : 'Ajouter'}
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

export default GroupMembersScreen;
