export type AuthView = 'login' | 'register' | 'forgot';

export interface AuthConfigItem {
  overlayTitle: string;
  overlayText: string;
  color: string;
  bgColor: string;
  hoverColor: string;
  btnText: string;
}

export interface AuthFormProps {
  setView: (view: AuthView) => void;
}
