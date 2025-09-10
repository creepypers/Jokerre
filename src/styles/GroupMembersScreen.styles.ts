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
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
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
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  addMemberButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  addMemberButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: '600',
  },
  membersList: {
    paddingBottom: 20,
    maxHeight: 300,
  },
  memberCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginBottom: 8,
  },
  memberContent: {
    padding: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '200',
    backgroundColor: colors.success + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    margin: 0,
    padding: 0,
    width: 48,
    height: 48,
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
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  groupHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  addMemberDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
});