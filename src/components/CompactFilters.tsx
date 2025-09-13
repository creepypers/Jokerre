import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Chip, Icon, Menu, Button } from "react-native-paper";
import { colors } from "../utils/colors";
import { styles } from "./styles/CompactFilters.styles";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
  color?: string;
}

interface CompactFilterProps {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  icon?: string;
  style?: any;
}

export const CompactFilter: React.FC<CompactFilterProps> = ({
  title,
  options,
  selectedValue,
  onValueChange,
  icon,
  style,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getSelectedLabel = () => {
    const option = options.find((opt) => opt.value === selectedValue);
    return option?.label || "Tous";
  };

  return (
    <View style={[styles.filterContainer, style]}>
      <Menu
        visible={showMenu}
        onDismiss={() => setShowMenu(false)}
        anchor={
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowMenu(true)}
            activeOpacity={0.7}
          >
            <View style={styles.filterButtonContent}>
              {icon && (
                <View style={styles.filterIcon}>
                  <Icon source={icon} size={14} color={colors.textSecondary} />
                </View>
              )}
              <Text style={styles.filterButtonText}>{getSelectedLabel()}</Text>
              <Icon
                source="chevron-down"
                size={14}
                color={colors.textSecondary}
              />
            </View>
          </TouchableOpacity>
        }
        contentStyle={styles.menuContent}
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            onPress={() => {
              onValueChange(option.value);
              setShowMenu(false);
            }}
            title={option.label}
            titleStyle={[
              styles.menuItemText,
              selectedValue === option.value && styles.selectedMenuItemText,
            ]}
          />
        ))}
      </Menu>
    </View>
  );
};

interface CompactFiltersProps {
  filters: Array<{
    title: string;
    options: FilterOption[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    icon?: string;
  }>;
  style?: any;
}

export const CompactFilters: React.FC<CompactFiltersProps> = ({
  filters,
  style,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
    >
      {filters.map((filter, index) => (
        <CompactFilter
          key={index}
          title={filter.title}
          options={filter.options}
          selectedValue={filter.selectedValue}
          onValueChange={filter.onValueChange}
          icon={filter.icon}
          style={index < filters.length - 1 && styles.filterSpacing}
        />
      ))}
    </ScrollView>
  );
};
