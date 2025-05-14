import { Types } from "mongoose";
import { Tgender } from "../admin/admin.interface";


export type Tpatient = {
  name: string;
  email: string;
  photo?: string;
  contactNumber: string;
  address: string;
  age?:number;
  blood?:string;
  gender:Tgender;
  patient:Types.ObjectId
  isDeleted?: boolean;
};
