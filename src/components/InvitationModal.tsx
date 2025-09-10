import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Modal, Portal, TextInput, Button, Card, Title, Paragraph, Text } from 'react-native-paper';
import { colors } from '../utils/colors';
import { styles } from './styles/InvitationModal.styles';

interface InvitationModalProps {
  visible: boolean;
  onDismiss: () => void;
  onInvite: (email: string, message: string) => Promise<void>;
  type: 'project' | 'group';
  targetName: string;
  loading?: boolean;
}

export const InvitationModal: React.FC<InvitationModalProps> = ({
  visible,
  onDismiss,
  onInvite,
  type,
  targetName,
  loading = false
}) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email');
      return;
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email valide');
      return;
    }

    setIsLoading(true);
    try {
      await onInvite(email.trim(), message.trim());
      setEmail('');
      setMessage('');
      onDismiss();
      Alert.alert('Succès', `Invitation envoyée à ${email}`);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible d\'envoyer l\'invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setEmail('');
    setMessage('');
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleDismiss} contentContainerStyle={styles.modalContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>
              Inviter quelqu'un au {type === 'project' ? 'projet' : 'groupe'}
            </Title>
            <Paragraph style={styles.subtitle}>
              {targetName}
            </Paragraph>

            <TextInput
              label="Adresse email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              disabled={isLoading || loading}
            />

            <TextInput
              label="Message personnalisé (optionnel)"
              value={message}
              onChangeText={setMessage}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              disabled={isLoading || loading}
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleDismiss}
                style={styles.button}
                disabled={isLoading || loading}
              >
                Annuler
              </Button>
              <Button
                mode="contained"
                onPress={handleInvite}
                style={[styles.button, styles.primaryButton]}
                loading={isLoading || loading}
                disabled={isLoading || loading}
              >
                Envoyer l'invitation
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
};
