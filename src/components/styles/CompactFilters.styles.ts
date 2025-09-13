import { StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  contentContainer: {
    paddingHorizontal: 4,
  },
  filterContainer: {
    marginHorizontal: 2,
  },
  filterButton: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    minWidth: 80,
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  filterIcon: {
    marginRight: 4,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  filterSpacing: {
    marginRight: 8,
  },
  menuContent: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  selectedMenuItemText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
