import React, { useState } from 'react';
import { 
  View, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  Text, 
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  Animated
} from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/colors';
import { registerStyles } from '../styles/RegisterScreen.styles';
import { sharedStyles } from '../styles/shared.styles';

interface RegisterScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const { signUp } = useAuth();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert('Succès', 'Compte créé avec succès !');
    } catch (error: any) {
      Alert.alert('Erreur d\'inscription', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={sharedStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header avec logo et titre */}
        <Animated.View 
          style={[
            registerStyles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={registerStyles.logoContainer}>
            <Text style={registerStyles.logo}>Jokkere</Text>
            <View style={registerStyles.logoAccent} />
          </View>
          <Text style={registerStyles.welcomeText}>Créer un compte</Text>
          <Text style={registerStyles.subtitle}>Rejoignez notre communauté</Text>
        </Animated.View>

        {/* Formulaire d'inscription */}
        <Animated.View 
          style={[
            registerStyles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={registerStyles.inputContainer}>
            <Text style={registerStyles.inputLabel}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={registerStyles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Entrez votre email"
              placeholderTextColor={colors.placeholder}
              mode="outlined"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              selectionColor={colors.primary}
            />
          </View>

          <View style={registerStyles.inputContainer}>
            <Text style={registerStyles.inputLabel}>Mot de passe</Text>
            <View style={registerStyles.passwordContainer}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={registerStyles.passwordInput}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Créez un mot de passe"
                placeholderTextColor={colors.placeholder}
                mode="outlined"
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                selectionColor={colors.primary}
              />
              <TouchableOpacity 
                style={registerStyles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Text style={registerStyles.eyeText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={registerStyles.inputContainer}>
            <Text style={registerStyles.inputLabel}>Confirmer le mot de passe</Text>
            <View style={registerStyles.passwordContainer}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={registerStyles.passwordInput}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Confirmez votre mot de passe"
                placeholderTextColor={colors.placeholder}
                mode="outlined"
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                selectionColor={colors.primary}
              />
              <TouchableOpacity 
                style={registerStyles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                <Text style={registerStyles.eyeText}>
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={registerStyles.termsContainer}>
            <Text style={registerStyles.termsText}>
              En créant un compte, vous acceptez nos{' '}
              <Text style={registerStyles.termsLink}>Conditions d'utilisation</Text>
              {' '}et notre{' '}
              <Text style={registerStyles.termsLink}>Politique de confidentialité</Text>
            </Text>
          </View>

          <TouchableOpacity 
            style={[
              sharedStyles.primaryButton,
              registerStyles.registerButton, 
              loading && registerStyles.registerButtonDisabled
            ]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={sharedStyles.primaryButtonText}>Créer un compte</Text>
            )}
          </TouchableOpacity>

         
        </Animated.View>

        {/* Footer avec lien de connexion */}
        <Animated.View 
          style={[
            registerStyles.footer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={registerStyles.footerText}>Déjà un compte ? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={registerStyles.footerLink}>Se connecter</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
