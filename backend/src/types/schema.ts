import { Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password?: string
  providers?: IProvider[]
  resetPasswordToken: string | null
  resetPasswordExpires: Date | null
}

interface IProvider {
  providers: 'google' | 'github'
  providerId: string
}
