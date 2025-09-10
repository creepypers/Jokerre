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
    paddingBottom: 10,
    elevation: 4,
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
  logoutButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  projectsList: {
    paddingBottom: 100,
  },
  projectCard: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
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
    marginBottom: 8,
  },
  groupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  groupBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  groupBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  archivedText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '600',
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
  groupFab: {
    backgroundColor: colors.success,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  invitationsButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(74, 124, 89, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(74, 124, 89, 0.9)',
  },
  // Nouveaux styles pour les améliorations
  projectTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  membersBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersIcon: {
    margin: 0,
    padding: 0,
    width: 16,
    height: 16,
  },
  membersBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  ticketsBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.success + '40',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketsIcon: {
    margin: 0,
    padding: 0,
    width: 16,
    height: 16,
  },
  ticketsBadgeText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  userInfoContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 12,
    alignItems: 'flex-start',
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    margin: 0,
    padding: 0,
    width: 16,
    height: 16,
  },
  userName: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'left',
    marginLeft: 4,
  },
  buttonIcon: {
    margin: 0,
    padding: 0,
    width: 20,
    height: 20,
  },
});