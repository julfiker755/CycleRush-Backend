import { Types } from 'mongoose';
import { gender } from './admin.constants';

export type Tgender = typeof gender[number];
export type Tadmin = {
  name: string;
  email: string;
  photo?: string;
  address: string;
  gender: Tgender;
  contactNumber: string;
  isDeleted?: boolean;
  admin:Types.ObjectId;
};
