import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from './styles/ToggleButtons.styles';

interface ToggleOption {
  value: string;
  label: string;
  count?: number;
}

interface ToggleButtonsProps {
  options: ToggleOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: any;
}

export const ToggleButtons: React.FC<ToggleButtonsProps> = ({
  options,
  selectedValue,
  onValueChange,
  style,
}) => {
  return (
    <View style={[styles.toggleContainer, style]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.toggleButton,
            selectedValue === option.value && styles.toggleButtonActive
          ]}
          onPress={() => onValueChange(option.value)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.toggleButtonText,
            selectedValue === option.value && styles.toggleButtonTextActive
          ]}>
            {option.label} {option.count !== undefined && `(${option.count})`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
