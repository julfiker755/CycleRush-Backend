import { Types } from "mongoose";
import { Tgender } from "../admin/admin.interface";

export type Tdoctor = {
  name: string;
  email: string;
  photo?: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender:Tgender;
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  averageRating: number;
  doctor:Types.ObjectId
  isDeleted?: boolean;
};
