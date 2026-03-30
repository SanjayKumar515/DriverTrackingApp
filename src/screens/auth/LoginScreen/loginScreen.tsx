import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { UserService } from '../../../services/apiServices';
import { LocalStorage } from '../../../helpers/localStorage';
import { CommonLoader } from '../../../components/CommonLoader/commonLoader';
import {FloatingInput} from '../../../components';
import { UserData, UserDataContext } from '../../../context/userDataContext';
import styles from './loginScreen.styles';




const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const getFieldErrors = (email: string, password: string) => ({
  email:
    !email.trim()
      ? 'Email or username is required.'
      : email.includes('@') && !validateEmail(email)
      ? 'Enter a valid email address.'
      : '',
  password: !password.trim()
    ? 'Password is required.'
    : password.length < 4
    ? 'Password is too short.'
    : '',
});

const LoginScreen: React.FC = () => {
  const { setIsLoggedIn, setUserData } = useContext<UserData>(UserDataContext);
  const { showLoader, hideLoader } = CommonLoader();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [apiError, setApiError] = useState('');
  const fieldErrors = useMemo(() => getFieldErrors(email, password), [email, password]);

  const canSubmit =
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    !fieldErrors.email &&
    !fieldErrors.password;

  const onLogin = async () => {
    setTouched({ email: true, password: true });
    if (!canSubmit) return;

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const looksLikeEmail = trimmedEmail.includes('@');

    setApiError('');
    showLoader();
    try {
      if (!looksLikeEmail) {
        const data = await UserService.loginDummyJson({
          username: trimmedEmail,
          password: trimmedPassword,
          expiresInMins: 30,
        });
        //@ts-ignore
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
        setApiError('Network blocked. Use eve.holt@reqres.in / cityslicka (mock).');
        return;
      }
      setApiError(
        e?.response?.data?.error || e?.message || 'Login failed. Please try again.'
      );
    } finally {
      hideLoader();
    }
  };

  const showEmailError = touched.email && !!fieldErrors.email;
  const showPasswordError = touched.password && !!fieldErrors.password;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Image source={require('../../../assets/driverIcon.png')} style={styles.logo} />
          </View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

       
        <View style={styles.card}>
          {/* API error */}
          {!!apiError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>⚠ {apiError}</Text>
            </View>
          )}

          <FloatingInput
            label="Email or Username"
            value={email}
            onChangeText={(t) => { setEmail(t); setApiError(''); }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={showEmailError}
          />
          {showEmailError && (
            <Text style={styles.fieldError}>{fieldErrors.email}</Text>
          )}

          {/* Password */}
          <FloatingInput
            label="Password"
            value={password}
            onChangeText={(t) => { setPassword(t); setApiError(''); }}
            secureTextEntry={isPasswordHidden}
            error={showPasswordError}
            rightElement={
              <TouchableOpacity
                onPress={() => setIsPasswordHidden((v) => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.showHide}>{isPasswordHidden ? 'Show' : 'Hide'}</Text>
              </TouchableOpacity>
            }
          />
          {showPasswordError && (
            <Text style={[styles.fieldError, { marginTop: -8 }]}>{fieldErrors.password}</Text>
          )}

          {/* Forgot */}
          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity
            style={[styles.button, { opacity: canSubmit ? 1 : 0.55 }]}
            onPress={onLogin}
            activeOpacity={0.82}
            disabled={!canSubmit}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social stubs */}
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialBtnText}>🔵  Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};




export default LoginScreen;