import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Menu } from 'react-native-paper';
import { colors } from '../utils/colors';
import { styles } from './GroupSelector.styles';

interface TeamGroup {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface GroupSelectorProps {
  label: string;
  selectedGroup: string;
  onGroupSelect: (groupId: string) => void;
  groups: TeamGroup[];
  showDropdown: boolean;
  onToggleDropdown: () => void;
  placeholder?: string;
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  label,
  selectedGroup,
  onGroupSelect,
  groups,
  showDropdown,
  onToggleDropdown,
  placeholder = 'Aucun groupe sélectionné',
}) => {
  const selectedGroupData = groups.find(g => g.id === selectedGroup);

  return (
    <View style={styles.groupSelector}>
      <Text style={styles.groupSelectorLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.groupDropdown}
        onPress={onToggleDropdown}
        activeOpacity={0.7}
      >
        <View style={styles.groupDropdownContent}>
          <View style={styles.groupDropdownLeft}>
            {selectedGroupData ? (
              <>
                <View style={[styles.groupColorDot, { backgroundColor: selectedGroupData.color }]} />
                <Text style={styles.groupDropdownText}>
                  {selectedGroupData.name}
                </Text>
              </>
            ) : (
              <>
                <View style={[styles.groupColorDot, { backgroundColor: colors.border }]} />
                <Text style={[styles.groupDropdownText, styles.placeholderText]}>
                  {placeholder}
                </Text>
              </>
            )}
          </View>
          <Text style={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.groupDropdownList}>
          <TouchableOpacity
            style={styles.groupDropdownItem}
            onPress={() => onGroupSelect('')}
          >
            <View style={styles.groupDropdownItemContent}>
              <View style={[styles.groupColorDot, { backgroundColor: colors.border }]} />
              <View style={styles.groupDropdownItemInfo}>
                <Text style={styles.groupDropdownItemText}>Aucun groupe</Text>
              </View>
            </View>
          </TouchableOpacity>
          {groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupDropdownItem}
              onPress={() => onGroupSelect(group.id)}
            >
              <View style={styles.groupDropdownItemContent}>
                <View style={[styles.groupColorDot, { backgroundColor: group.color }]} />
                <View style={styles.groupDropdownItemInfo}>
                  <Text style={styles.groupDropdownItemText}>{group.name}</Text>
                  <Text style={styles.groupDropdownItemDescription}>{group.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {groups.length === 0 && (
            <View style={styles.groupDropdownItem}>
              <Text style={styles.noGroupsText}>Aucun groupe disponible</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
