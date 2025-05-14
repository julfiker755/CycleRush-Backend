import mongoose from "mongoose";
import { Role } from "../user/user.constants";
import { userModel } from "../user/user.model";
import { doctorModel } from "./doctor.model";
import { Tdoctor } from "./doctor.interface";
import QueryBuilder from "../../builder/queryBuilder";
import { searchFileds } from "../admin/admin.constants";


const doctorGetBD = async (query: Record<string, unknown>) => {
  const doctorQuery = new QueryBuilder(doctorModel.find(), query)
  .search(searchFileds)
  .filter()
  .paginate()
  .sort();
const result = await doctorQuery.modelQuery;
const meta = await doctorQuery.countTotal();
return {
  result,
  meta,
};

}


const doctorStoreBD = async (payload:any) => {
  const { email, password, ...others } = payload;
  const userPayload = {
    email: email,
    password: password,
    role:Role.doctor,
  };
  const doctorPayload = {
    email: email,
    ...others,
  };
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Transaction-1
    const [user] = await userModel.create([userPayload], { session });
    // Transaction-2
    Object.assign(doctorPayload, {doctor: user._id });
    const [doctor] = await doctorModel.create([doctorPayload], { session });
    // end transaction
    await session.commitTransaction();
    session.endSession();
    return doctor;
  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err.message || 'Transaction failed');
  }
}

const doctorGetByIdBD = async (id: string) => {
    const result = await doctorModel.findById(id);
    return result;
  };
  
  const doctorUpdateByIdBD = async (payload: Partial<Tdoctor>,user:any) => {
    const doctorInfo=await doctorModel.findOne({email:user.email})
    if(!doctorInfo) throw new Error('Doctor not found')
    const result = await doctorModel.findByIdAndUpdate(doctorInfo._id, payload, {
      new: true,
    });
    return result;
  };

  const doctorDeleteByIdBD = async (id: string) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      // Transaction-1: Delete the doctor
      const doctor = await doctorModel.findByIdAndDelete(id, { session });
      if (!doctor) throw new Error('doctor not found');
      const userID=doctor.doctor
      // Transaction-2: Delete the related user
      await userModel.findByIdAndDelete(userID, { session });
      await session.commitTransaction();
      session.endSession();
  
      return doctor;
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(err.message || 'Transaction failed');
    }
  };
  

export const doctorService = {
  doctorGetBD,
  doctorStoreBD,
  doctorGetByIdBD,
  doctorUpdateByIdBD,
  doctorDeleteByIdBD
}