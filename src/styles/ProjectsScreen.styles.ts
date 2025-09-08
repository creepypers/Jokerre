import { StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    fontWeight: '400',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: 'white',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  projectCard: {
    marginBottom: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectStats: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  arrowText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  customFab: {
    backgroundColor: colors.primary,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  fab: {
    position: 'relative',
    margin: 0,
    minWidth: 80,
  },
  groupFab: {
    backgroundColor: colors.sageGreen,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  
  // Group selector styles
  groupSelector: {
    marginBottom: 16,
  },
  groupSelectorLabel: {
    fontSize: 14,
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
  groupDropdownText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  dropdownArrow: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  groupDropdownList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: 'white',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
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
    marginLeft: 8,
  },
  groupDropdownItemText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  groupDropdownItemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  groupColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  noGroupsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  archivedText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
