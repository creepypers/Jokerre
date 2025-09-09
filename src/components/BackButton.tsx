import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles/BackButton.styles';

interface BackButtonProps {
  onPress: () => void;
  text?: string;
  style?: any;
  textStyle?: any;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  text = '← Retour',
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.backButton, style]}
      activeOpacity={0.7}
    >
      <Text style={[styles.backButtonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};
