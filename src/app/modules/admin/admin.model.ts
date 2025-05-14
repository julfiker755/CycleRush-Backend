import mongoose, { model, Schema } from "mongoose";
import { Tadmin } from "./admin.interface";
import { gender } from "./admin.constants";



const adminSchema=new Schema<Tadmin>({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    photo:{type:String},
    address:{type:String,required:true},
    gender:{type:String,enum:gender,required:true},
    contactNumber:{type:String,required:true},
    isDeleted:{type:Boolean,default:false},
    admin:{type: mongoose.Schema.Types.ObjectId,required:true,ref: 'user'},
},{
    timestamps:true,
}
);

export const adminModel = model<Tadmin>('admin', adminSchema);