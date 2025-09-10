import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../utils/colors';

const { width, height } = Dimensions.get('window');

export const sharedStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  
  // Headers
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '400',
  },
  
  // Cards
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  cardContent: {
    padding: 20,
  },
  
  // Buttons
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // FAB
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    maxWidth: width * 0.9,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  
  // Inputs
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  
  // Text
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  
  // Empty states
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  
  // Buttons
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Animations
  fadeIn: {
    opacity: 1,
  },
  slideUp: {
    transform: [{ translateY: 0 }],
  },
});

