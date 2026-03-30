import { StyleSheet } from 'react-native'
import Colors from '../../../constant/colors';


// Define the styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color:Colors.PRIMARY[100],
    marginBottom: 18,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ebeffc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  forgotPasswordText: {
    color: Colors.PRIMARY[100],
    fontSize: 14,
    textAlign: 'right',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor:Colors.PRIMARY[100],
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  continueWithText: {
    fontSize: 14,
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButton: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default styles;
