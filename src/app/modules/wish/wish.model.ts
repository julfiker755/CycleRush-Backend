import mongoose, { model, Schema } from "mongoose";
import { Twish } from "./wish.interface";


const wishSchema = new Schema<Twish>({
    email: {type: String, required: true },
    wishId:{type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
}, {
    timestamps: true,
});

export const wishModel = model<Twish>('wish',  wishSchema);
