import { Types } from "mongoose";

export type Tcart = {
    email: string;
    quantity: number;
    totalPrice: number;
    productId:Types.ObjectId;
};
