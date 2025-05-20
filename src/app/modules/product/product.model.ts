import mongoose, { model, Schema } from "mongoose";
import { Tproduct } from "./product.interface";

const productSchema = new Schema<Tproduct>({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    frameMaterial: { type: String, required: true },
    wheelSize: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true }
}, {
    timestamps: true,
});

export const productModel = model<Tproduct>('Product', productSchema);
