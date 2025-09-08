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
import { loginStyles } from '../styles/LoginScreen.styles';
import { sharedStyles } from '../styles/shared.styles';

interface LoginScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const { signIn } = useAuth();

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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Erreur de connexion', error.message);
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
        {/* Header */}
        <Animated.View 
          style={[
            loginStyles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={loginStyles.logoContainer}>
            <Text style={loginStyles.logo}>Jokkere</Text>
            <View style={loginStyles.logoAccent} />
          </View>
          <Text style={loginStyles.welcomeText}>Bon retour !</Text>
          <Text style={loginStyles.subtitle}>Connectez-vous à votre compte</Text>
        </Animated.View>

        {/* Formulaire */}
        <Animated.View 
          style={[
            loginStyles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Email Field */}
          <View style={loginStyles.inputContainer}>
            <Text style={loginStyles.inputLabel}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={loginStyles.input}
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

          {/* Password Field */}
          <View style={loginStyles.inputContainer}>
            <Text style={loginStyles.inputLabel}>Mot de passe</Text>
            <View style={loginStyles.passwordContainer}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={loginStyles.passwordInput}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor={colors.placeholder}
                mode="outlined"
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                selectionColor={colors.primary}
              />
              <TouchableOpacity 
                style={loginStyles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Text style={loginStyles.eyeText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity 
            style={loginStyles.forgotPassword}
            onPress={() => {/* TODO: Implement forgot password */}}
            activeOpacity={0.7}
          >
            <Text style={loginStyles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[
              sharedStyles.primaryButton,
              loginStyles.loginButton, 
              loading && loginStyles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={sharedStyles.primaryButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.View 
          style={[
            loginStyles.footer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={loginStyles.footerText}>Pas encore de compte ? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.7}
          >
            <Text style={loginStyles.footerLink}>Créer un compte</Text>
          </TouchableOpacity>
        </Animated.View>

       
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
