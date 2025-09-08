import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../utils/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
    alignItems: 'flex-start',
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
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
  content: {
    flex: 1,
    padding: 20,
  },
  
  
  // Members styles
  membersContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  inviteButton: {
    borderColor: colors.primary,
  },
  createGroupButton: {
    borderColor: colors.primary,
  },
  memberCard: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adminAvatar: {
    backgroundColor: colors.sageGreen,
  },
  memberAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  memberBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  adminBadge: {
    fontSize: 12,
    color: colors.sageGreen,
    fontWeight: '600',
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentUserBadge: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  createFirstGroupButton: {
    backgroundColor: colors.primary,
  },
  
  
  // Admin actions
  adminActions: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  autoAssignButton: {
    backgroundColor: colors.sageGreen,
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
  colorPicker: {
    marginBottom: 16,
  },
  colorPickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
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
    borderWidth: 3,
  },
});
