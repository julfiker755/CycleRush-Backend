import { Schema, model } from 'mongoose';
import { Tuser } from './user.interface';
import { userRole, userStatus } from './user.constants';
import { BcryptStore } from '../../../ulits';

const userSchema = new Schema<Tuser>(
  {
    email: { type: String, unique: true, required:true},
    password: { type: String, required: true },
    role: {
      type: String,
      enum: userRole,
    },
    status: {
      type: String,
      enum: userStatus,
      default: 'active',
    },
    needsPasswordChange: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  this.password =await BcryptStore(this.password, 10);
  next()
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

export const userModel = model<Tuser>('user', userSchema);

