import { StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';

export const styles = StyleSheet.create({
  groupSelector: {
    marginBottom: 16,
  },
  groupSelectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  groupDropdown: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  groupDropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  groupDropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  groupDropdownText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  dropdownArrow: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  groupDropdownList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    maxHeight: 200,
  },
  groupDropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  groupDropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupDropdownItemInfo: {
    flex: 1,
  },
  groupDropdownItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  groupDropdownItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  noGroupsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});