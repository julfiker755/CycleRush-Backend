import mongoose from 'mongoose';
import { adminModel } from './admin.model';
import { Role } from '../user/user.constants';
import { userModel } from '../user/user.model';
import { Tadmin } from './admin.interface';
import QueryBuilder from '../../builder/queryBuilder';
import { searchFileds } from './admin.constants';

const adminGetBD = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(adminModel.find(), query)
    .search(searchFileds)
    .filter()
    .paginate()
    .sort();
  const result = await adminQuery.modelQuery;
  const meta = await adminQuery.countTotal();
  return {
    result,
    meta,
  };
};

// adminStoreBD
const adminStoreBD = async (payload: any) => {
  const { email, password, ...others } = payload;

  const userPayload = {
    email: email,
    password: password,
    role: Role.admin,
  };
  const adminPayload = {
    email: email,
    ...others,
  };

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Transaction-1
    const [user] = await userModel.create([userPayload], { session });
    // Transaction-2
    Object.assign(adminPayload, { admin: user._id });
    const [admin] = await adminModel.create([adminPayload], { session });
    // end transaction
    await session.commitTransaction();
    session.endSession();
    return admin;
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err.message || 'Transaction failed');
  }
};

const adminGetByIdBD = async (id: string) => {
  const result = await adminModel.findById(id);
  return result;
};

const adminUpdateByIdBD = async (payload: Partial<Tadmin>, user: any) => {
  const adminInfo = await adminModel.findOne({ email: user.email });
  if (!adminInfo) throw new Error('Admin not found');
  const result = await adminModel.findByIdAndUpdate(adminInfo._id, payload, {
    new: true,
  });
  return result;
};

const adminDeleteByIdBD = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Transaction-1: Delete the admin
    const admin = await adminModel.findByIdAndDelete(id, { session });
    if (!admin) throw new Error('Admin not found');
    const userID = admin.admin;
    // Transaction-2: Delete the related user (using admin.admin field)
    const user = await userModel.findByIdAndDelete(userID, { session });
    if (!user) throw new Error('Admin not found');
    await session.commitTransaction();
    session.endSession();

    return admin;
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(err.message || 'Transaction failed');
  }
};

export const adminService = {
  adminStoreBD,
  adminGetBD,
  adminGetByIdBD,
  adminUpdateByIdBD,
  adminDeleteByIdBD,
};
