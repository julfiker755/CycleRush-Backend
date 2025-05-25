import mongoose, { model, Schema } from 'mongoose';
import { Tcart } from './cart.interface';

const cartSchema = new Schema<Tcart>(
  {
    email: { type: String, required: true },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity must be at least 1'],
    },
    totalPrice: { type: Number, default:0},
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  },
  {
    timestamps: true,
  },
);

export const cartModel = model<Tcart>('cart', cartSchema);
