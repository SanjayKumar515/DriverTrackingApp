import React, { ErrorInfo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type State = {
  hasError: boolean;
  errorMessage: string;
};

class ErrorBoundary extends React.Component<{}, State> {
  state: State = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'Unknown error' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, errorMessage: '' });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong.</Text>
          <Text style={styles.message}>{this.state.errorMessage}</Text>
          <TouchableOpacity style={styles.button} onPress={this.reset}>
            <Text style={styles.buttonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

const styles = StyleSheet.create({
  container: { flex: 1, 
    alignItems: 'center',
     justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  message: { textAlign: 'center', color: '#666', marginBottom: 18 },
  button: { backgroundColor: '#6C63FF', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
