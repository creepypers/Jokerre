import React, { useState } from 'react';
import { View, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Title, FAB } from 'react-native-paper';
import { useProject } from '../context/ProjectContext';
import { sharedStyles } from '../styles/shared.styles';
import { colors } from '../utils/colors';
import { styles } from '../styles/InvitationsScreen.styles';
import { Header, BackButton, InvitationsList } from '../components';

interface InvitationsScreenProps {
  navigation: any;
}

export const InvitationsScreen: React.FC<InvitationsScreenProps> = ({ navigation }) => {
  const { 
    invitations, 
    acceptInvitation, 
    declineInvitation, 
    deleteInvitation,
    getPendingInvitations,
    loading 
  } = useProject();

  const [processingInvitation, setProcessingInvitation] = useState<string | null>(null);

  const pendingInvitations = getPendingInvitations();

  const handleAcceptInvitation = async (invitationId: string) => {
    setProcessingInvitation(invitationId);
    try {
      console.log('InvitationsScreen - Accepting invitation:', invitationId);
      await acceptInvitation(invitationId);
      console.log('InvitationsScreen - Invitation accepted successfully');
      Alert.alert('Succès', 'Invitation acceptée avec succès !');
    } catch (error: any) {
      console.error('InvitationsScreen - Error accepting invitation:', error);
      Alert.alert('Erreur', error.message || 'Impossible d\'accepter l\'invitation');
    } finally {
      setProcessingInvitation(null);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    setProcessingInvitation(invitationId);
    try {
      await declineInvitation(invitationId);
      Alert.alert('Succès', 'Invitation refusée');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de refuser l\'invitation');
    } finally {
      setProcessingInvitation(null);
    }
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    setProcessingInvitation(invitationId);
    try {
      await deleteInvitation(invitationId);
      Alert.alert('Succès', 'Invitation supprimée');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de supprimer l\'invitation');
    } finally {
      setProcessingInvitation(null);
    }
  };

  return (
    <SafeAreaView style={[sharedStyles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Invitations"
        subtitle="Gérer vos invitations en attente"
        rightElement={<BackButton onPress={() => navigation.goBack()} />}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Title style={styles.title}>Vos invitations</Title>
          <Title style={styles.count}>
            {pendingInvitations.length} en attente
          </Title>
        </View>

        <InvitationsList
          invitations={invitations}
          onAccept={handleAcceptInvitation}
          onDecline={handleDeclineInvitation}
          onDelete={handleDeleteInvitation}
          loading={loading || processingInvitation !== null}
        />
      </View>

      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={() => {
          // Force refresh des invitations
          console.log('Refresh invitations');
        }}
        label="Actualiser"
      />
    </SafeAreaView>
  );
};
