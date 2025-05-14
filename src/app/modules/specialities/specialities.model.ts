import { model, Schema} from "mongoose";
import { Tspecialitie } from "./specialities.interface";


const specialitieSchema = new Schema<Tspecialitie>({
    title: { type: String, required: true },
    icon: { type: String },
}, {
    timestamps: true,
});

export const specialitieModel = model<Tspecialitie>('specialitie', specialitieSchema);
