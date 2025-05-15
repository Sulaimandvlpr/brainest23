import mongoose, { Document } from 'mongoose';

export interface IIrtSetting extends Document {
  user: mongoose.Schema.Types.ObjectId;
  mode: '1PL' | '2PL' | '3PL';
  thetaMean: number;
  thetaSD: number;
  maxItems: number;
  startItems: number;
}

const IrtSettingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    mode: { type: String, enum: ['1PL', '2PL', '3PL'], required: true },
    thetaMean: { type: Number, default: 0 },
    thetaSD: { type: Number, default: 1 },
    maxItems: { type: Number, default: 20 },
    startItems: { type: Number, default: 5 },
    isGlobal: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<IIrtSetting>('IrtSetting', IrtSettingSchema);