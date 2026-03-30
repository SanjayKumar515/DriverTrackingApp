import React, { useContext, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './loginScreen.styles';
import { UserService } from '../../../services/apiServices';
import { LocalStorage } from '../../../helpers/localStorage';
import { CommonLoader } from '../../../components/CommonLoader/commonLoader';
import { UserData, UserDataContext } from '../../../context/userDataContext';


const LoginScreen: React.FC = () => {
  

  const { setIsLoggedIn, setUserData } = useContext<UserData>(UserDataContext);
  const { showLoader, hideLoader } = CommonLoader();

  const [email, setEmail] = useState<string>(''); // accepts email OR username
  const [password, setPassword] = useState<string>('');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [error, setError] = useState<string>('');

  const emailLooksValid = useMemo(() => {
    const trimmed = email.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }, [email]);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  const onLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Email and password are required.');
      return;
    }
    const looksLikeEmail = trimmedEmail.includes('@');
    if (looksLikeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    showLoader();
    try {
      // If it's not an email, treat as DummyJSON username login
      if (!looksLikeEmail) {
        const data = await UserService.loginDummyJson({
          username: trimmedEmail,
          password: trimmedPassword,
          expiresInMins: 30,
        });
        const token = data?.accessToken ?? data?.token ?? null;
        await LocalStorage.save('@token', token);
        await LocalStorage.save('@user', { username: trimmedEmail });
        await LocalStorage.save('@login', true);
        setUserData({ user: { username: trimmedEmail }, token });
        setIsLoggedIn(true);
        return;
      }

      const data = await UserService.login({ email: trimmedEmail, password: trimmedPassword });
      await LocalStorage.save('@token', data?.token ?? null);
      await LocalStorage.save('@user', { email: trimmedEmail });
      await LocalStorage.save('@login', true);
      setUserData({ user: { email: trimmedEmail }, token: data?.token ?? null });
      setIsLoggedIn(true);
    } catch (e: any) {
      // Fallback: reqres.in may be Cloudflare-blocked on some networks.
      if (e?.code === 'REQRES_BLOCKED') {
        const ok =
          trimmedEmail.toLowerCase() === 'eve.holt@reqres.in' &&
          trimmedPassword === 'cityslicka';
        if (ok) {
          const token = 'mock-token';
          await LocalStorage.save('@token', token);
          await LocalStorage.save('@user', { email: trimmedEmail });
          await LocalStorage.save('@login', true);
          setUserData({ user: { email: trimmedEmail }, token });
          setIsLoggedIn(true);
          return;
        }
        setError(
          'Login API is blocked on this network. Use eve.holt@reqres.in / cityslicka to continue (mock).'
        );
        return;
      }

      const message =
        e?.response?.data?.error ||
        e?.message ||
        'Login failed. Please try again.';
      setError(String(message));
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>Welcome back you’ve{'\n'} 
        been missed!</Text>

      {!!error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email or username"
        placeholderTextColor="#999"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <View style={{ position: 'relative' }}>
        <TextInput
          style={[styles.input, { paddingRight: 64 }]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={isPasswordHidden}
          value={password}
          onChangeText={(text: string) => setPassword(text)}
        />
        <TouchableOpacity
          onPress={() => setIsPasswordHidden(v => !v)}
          style={{
            position: 'absolute',
            right: 12,
            top: 0,
            bottom: 15,
            justifyContent: 'center',
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={{ color: '#4A90E2', fontWeight: '700' }}>
            {isPasswordHidden ? 'Show' : 'Hide'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity
        style={[styles.button, { opacity: canSubmit ? 1 : 0.6 }]}
        onPress={onLogin}
        disabled={!canSubmit}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
    
     
    </View>
  );
};


export default LoginScreen;
