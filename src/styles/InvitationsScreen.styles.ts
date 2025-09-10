import { StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
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
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});
