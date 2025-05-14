import { model, Schema} from "mongoose";
import { Tpatient } from "./patient.interface";
import { gender } from "../admin/admin.constants";


const patientSchema = new Schema<Tpatient>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    age: { type: Number,default:0 },
    blood: { type: String },
    gender: { type: String, enum:gender, required: true },
    patient: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
});

export const patientModel = model<Tpatient>('patient', patientSchema);
