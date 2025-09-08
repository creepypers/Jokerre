import React from 'react';
import { Menu, IconButton } from 'react-native-paper';
import { colors } from '../utils/colors';

interface MenuItem {
  title: string;
  icon?: string;
  onPress: () => void;
  titleStyle?: any;
}

interface ContextMenuProps {
  visible: boolean;
  onDismiss: () => void;
  onOpen: () => void;
  items: MenuItem[];
  icon?: string;
  iconSize?: number;
  iconColor?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  visible,
  onDismiss,
  onOpen,
  items,
  icon = 'dots-vertical',
  iconSize = 20,
  iconColor = colors.textSecondary,
}) => {
  return (
    <Menu
      visible={visible}
      onDismiss={onDismiss}
      anchor={
        <IconButton
          icon={icon}
          size={iconSize}
          onPress={onOpen}
          iconColor={iconColor}
        />
      }
    >
      {items.map((item, index) => (
        <Menu.Item
          key={index}
          onPress={() => {
            item.onPress();
            onDismiss();
          }}
          title={item.title}
          leadingIcon={item.icon}
          titleStyle={item.titleStyle}
        />
      ))}
    </Menu>
  );
};
