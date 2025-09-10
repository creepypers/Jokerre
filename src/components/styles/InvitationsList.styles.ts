import { StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  statusChip: {
    marginLeft: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
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
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: colors.success,
  },
  expiredText: {
    fontSize: 12,
    color: colors.error,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
