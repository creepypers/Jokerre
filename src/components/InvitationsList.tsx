import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Text } from 'react-native-paper';
import { Invitation } from '../context/ProjectContext';
import { colors } from '../utils/colors';
import { styles } from './styles/InvitationsList.styles';

interface InvitationsListProps {
  invitations: Invitation[];
  onAccept: (invitationId: string) => Promise<void>;
  onDecline: (invitationId: string) => Promise<void>;
  onDelete?: (invitationId: string) => Promise<void>;
  loading?: boolean;
}

export const InvitationsList: React.FC<InvitationsListProps> = ({
  invitations,
  onAccept,
  onDecline,
  onDelete,
  loading = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'accepted': return colors.success;
      case 'declined': return colors.error;
      case 'expired': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      case 'declined': return 'Refusée';
      case 'expired': return 'Expirée';
      default: return status;
    }
  };

  const isExpired = (invitation: Invitation) => {
    return invitation.expiresAt < new Date();
  };

  if (invitations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucune invitation en attente</Text>
      </View>
    );
  }

  const renderInvitation = ({ item: invitation }: { item: Invitation }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.title}>
            Invitation {invitation.type === 'project' ? 'au projet' : 'au groupe'}
          </Title>
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(invitation.status) }]}
            textStyle={styles.statusText}
          >
            {getStatusText(invitation.status)}
          </Chip>
        </View>

        <Paragraph style={styles.message}>
          {invitation.message}
        </Paragraph>

        <View style={styles.details}>
          <Text style={styles.detailText}>
            Type: {invitation.type === 'project' ? 'Projet' : 'Groupe'}
          </Text>
          <Text style={styles.detailText}>
            Expire le: {invitation.expiresAt.toLocaleDateString()}
          </Text>
        </View>

        {invitation.status === 'pending' && !isExpired(invitation) && (
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => onDecline(invitation.id)}
              style={styles.button}
              disabled={loading}
            >
              Refuser
            </Button>
            <Button
              mode="contained"
              onPress={() => onAccept(invitation.id)}
              style={[styles.button, styles.acceptButton]}
              disabled={loading}
            >
              Accepter
            </Button>
          </View>
        )}

        {(invitation.status === 'accepted' || invitation.status === 'declined' || invitation.status === 'expired') && onDelete && (
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => onDelete(invitation.id)}
              style={[styles.button, { borderColor: colors.error }]}
              disabled={loading}
              textColor={colors.error}
            >
              Supprimer
            </Button>
          </View>
        )}

        {isExpired(invitation) && invitation.status === 'pending' && (
          <Text style={styles.expiredText}>
            Cette invitation a expiré
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={invitations}
      renderItem={renderInvitation}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};
