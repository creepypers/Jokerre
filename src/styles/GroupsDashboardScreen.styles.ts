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
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
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
  groupCardTouchable: {
    marginBottom: 16,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
  expandButton: {
    padding: 8,
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
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  projectsSection: {
    marginBottom: 16,
  },
  projectsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  projectsList: {
    gap: 8,
  },
  projectItem: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingLeft: 8,
  },
  noMembersText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
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
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  fab: {
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  assignFab: {
    backgroundColor: colors.success,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  colorPicker: {
    marginBottom: 20,
  },
  colorPickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  selectorContainer: {
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  dropdownButton: {
    marginBottom: 8,
    borderColor: colors.border,
  },
  dropdownContent: {
    justifyContent: 'flex-start',
  },
  dropdownLabel: {
    textAlign: 'left',
    color: colors.textPrimary,
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
  projectIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  groupsList: {
    paddingBottom: 20,
    maxHeight: 400,
  },
});