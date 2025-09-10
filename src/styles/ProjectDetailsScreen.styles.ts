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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teamButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  projectInfo: {
    marginBottom: 20,
  },
  projectDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  tabsContainer: {
    marginBottom: 20,
  },
  segmentedButtons: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabContent: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  ticketsList: {
    paddingBottom: 20,
  },
  ticketItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginBottom: 12,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  ticketDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketAssignee: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  ticketActions: {
    flexDirection: 'row',
    gap: 8,
  },
  moveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  moveBackButton: {
    backgroundColor: colors.warning,
  },
  moveButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },


  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kebabButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  kebabButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
  },
  assigneeText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontStyle: 'italic',
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
  modalAssigneeContainer: {
    marginBottom: 16,
  },
  modalAssigneeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  assigneeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  assigneeButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  assigneeArrow: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priorityCheckboxes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    maxHeight: 120,
  },
  priorityCheckboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  priorityCheckboxText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
  },
});