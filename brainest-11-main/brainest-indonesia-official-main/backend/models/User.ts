import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'guru' | 'siswa';
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'guru', 'siswa'], default: 'siswa' }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);