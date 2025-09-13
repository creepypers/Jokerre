import { StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  count: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: 'normal',
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexShrink: 0,
    textAlign: 'left',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  compactFilters: {
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  invitationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  invitationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    height: 24,

  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    marginBottom: 16,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  button: {
    flex: 1,
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  expiredText: {
    fontSize: 12,
    color: colors.error,
    fontStyle: 'italic',
    marginTop: 8,
  },
  listWrapper: {
    flex: 1,
  },
});
