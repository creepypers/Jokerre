import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Portal, Modal, Button } from 'react-native-paper';
import { sharedStyles } from '../styles/shared.styles';
import { colors } from '../utils/colors';
import { styles } from './styles/GenericModal.styles';

interface GenericModalProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  icon?: string;
  children: React.ReactNode;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  primaryIcon?: string;
  secondaryIcon?: string;
}

export const GenericModal: React.FC<GenericModalProps> = ({
  visible,
  onDismiss,
  title,
  icon,
  children,
  primaryButtonText,
  secondaryButtonText = 'Annuler',
  onPrimaryPress,
  onSecondaryPress,
  loading = false,
  disabled = false,
  primaryIcon,
  secondaryIcon = 'close',
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={sharedStyles.modalContent}
      >
        <View style={styles.modalHeader}>
          {icon && <Text style={styles.modalIcon}>{icon}</Text>}
          <Text style={sharedStyles.modalTitle}>{title}</Text>
        </View>
        
        {children}
        
        <View style={sharedStyles.modalButtons}>
          <Button
            mode="outlined"
            onPress={onSecondaryPress || onDismiss}
            style={[sharedStyles.modalButton, sharedStyles.secondaryButton]}
            labelStyle={sharedStyles.secondaryButtonText}
            icon={secondaryIcon}
          >
            {secondaryButtonText}
          </Button>
          <Button
            mode="contained"
            onPress={onPrimaryPress}
            style={[sharedStyles.modalButton, sharedStyles.primaryButton]}
            labelStyle={sharedStyles.primaryButtonText}
            disabled={loading || disabled}
            icon={loading ? undefined : primaryIcon}
          >
            {loading ? <ActivityIndicator color="white" size="small" /> : primaryButtonText}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};
