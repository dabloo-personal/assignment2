import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
