import mongoose from 'mongoose';
import { Role } from '../user/user.constants';
import { userModel } from '../user/user.model';
import { patientModel } from './patient.model';
import { Tpatient } from './patient.interface';
import { searchFileds } from '../admin/admin.constants';
import QueryBuilder from '../../builder/queryBuilder';

const patientGetBD = async (query: Record<string, unknown>) => {
  const patientQuery = new QueryBuilder(patientModel.find(), query)
    .search(searchFileds)
    .filter()
    .paginate()
    .sort();
  const result = await patientQuery.modelQuery;
  const meta = await patientQuery.countTotal();
  return {
    result,
    meta,
  };
};

const patientStoreBD = async (payload: any) => {
  const { email, password, ...others } = payload;
  const userPayload = {
    email: email,
    password: password,
    role: Role.patient,
  };
  const patientPayload = {
    email: email,
    ...others,
  };
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Transaction-1
    const [user] = await userModel.create([userPayload], { session });
    // Transaction-2
    Object.assign(patientPayload, { patient: user._id });
    const [patient] = await patientModel.create([patientPayload], { session });
    // end transaction
    await session.commitTransaction();
    session.endSession();
    return patient;
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err.message || 'Transaction failed');
  }
};

const patientGetByIdBD = async (id: string) => {
  const result = await patientModel.findById(id);
  return result;
};

const patientUpdateByIdBD = async (payload: Partial<Tpatient>, user: any) => {
  const patientInfo = await patientModel.findOne({ email: user.email });
  if (!patientInfo) throw new Error('patient not found');
  const result = await patientModel.findByIdAndUpdate(
    patientInfo._id,
    payload,
    {
      new: true,
    },
  );
  return result;
};

const patientDeleteByIdBD = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Transaction-1
    const patient = await patientModel.findByIdAndDelete(id, { session });
    if (!patient) throw new Error('patient not found');
    const userID = patient.patient;
    // Transaction-2
    await userModel.findByIdAndDelete(userID, { session });
    await session.commitTransaction();
    session.endSession();

    return patient;
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(err.message || 'Transaction failed');
  }
};

export const patientService = {
  patientGetBD,
  patientStoreBD,
  patientGetByIdBD,
  patientUpdateByIdBD,
  patientDeleteByIdBD,
};
