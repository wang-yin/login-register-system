export interface RegisterDTO {
  name: string;
  password: string;
  email: string;
}

export interface LoginDTO {
  password: string;
  email: string;
}

export interface UpdatePasswordDTO {
  currentPassword: string;
  newPassword: string;
}
