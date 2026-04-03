import { AuthView, AuthConfigItem } from '../type/auth';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

interface AuthUIEntry extends AuthConfigItem {
  component: React.ComponentType<any>;
}

export const AUTH_CONFIG: Record<AuthView, AuthUIEntry> = {
  login: {
    overlayTitle: 'Welcome Back',
    overlayText: 'Enter your details and start journey with us',
    color: 'text-green-300',
    bgColor: 'bg-green-300',
    hoverColor: 'hover:text-green-300',
    btnText: 'SIGN UP',
    component: LoginForm,
  },
  register: {
    overlayTitle: 'Create Account',
    overlayText: 'To keep connected with us please login with your info',
    color: 'text-blue-300',
    bgColor: 'bg-blue-300',
    hoverColor: 'hover:text-blue-300',
    btnText: 'SIGN IN',
    component: RegisterForm,
  },
  forgot: {
    overlayTitle: 'Reset Password',
    overlayText: 'We will send a reset link to your email',
    color: 'text-orange-300',
    bgColor: 'bg-orange-300',
    hoverColor: 'hover:text-orange-300',
    btnText: 'BACK TO LOGIN',
    component: ForgotPasswordForm,
  },
};
