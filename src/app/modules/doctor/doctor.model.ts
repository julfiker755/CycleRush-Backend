import { model, Schema } from "mongoose";
import { Tdoctor } from "./doctor.interface";
import { gender } from "../admin/admin.constants";

const doctorSchema = new Schema<Tdoctor>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    experience: { type: Number, required: true },
    gender: { type: String, enum:gender, required: true },
    appointmentFee: { type: Number, required: true },
    qualification: { type: String, required: true },
    currentWorkingPlace: { type: String, required: true },
    designation: { type: String, required: true },
    averageRating: { type: Number, default: 0 },
    doctor: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
});

export const doctorModel = model<Tdoctor>('doctor', doctorSchema);