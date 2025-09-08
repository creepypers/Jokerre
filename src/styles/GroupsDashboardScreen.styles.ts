import { StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  
  // Stats section
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  // Member Management section
  memberManagementContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  memberManagementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },

  // Groups section
  groupsContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  addMemberButton: {
    borderColor: colors.sageGreen,
  },
  assignButton: {
    borderColor: colors.primary,
  },
  
  // Group cards
  groupCard: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  groupContent: {
    padding: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  groupActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandIcon: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  groupDetails: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  // Group stats
  groupStats: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statItemNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  statItemLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  // Members section
  membersSection: {
    marginBottom: 16,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  addMemberToGroupButton: {
    borderColor: colors.sageGreen,
  },
  membersList: {
    gap: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  memberAvatarText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  memberName: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  memberEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  removeMemberButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeMemberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noMembersText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 16,
  },
  
  // Projects section
  projectsSection: {
    marginBottom: 8,
  },
  projectsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  projectsList: {
    gap: 4,
  },
  projectItem: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // FAB
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  
  // Modal styles
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  assignDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  addMemberDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  
  // Color picker
  colorPicker: {
    marginBottom: 16,
  },
  colorPickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: colors.primary,
  },
  
  // Selectors
  selectorContainer: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  optionItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  groupOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  groupOptionInfo: {
    flex: 1,
  },
});
