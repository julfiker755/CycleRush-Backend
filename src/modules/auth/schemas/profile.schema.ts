import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Auth } from './user.schema';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Profile {
  @Prop({
    type: Types.ObjectId,
    ref: Auth.name,
    required: true,
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: null })
  bio: string;

  @Prop({ default: null })
  date_of_birth: Date;

  @Prop({ type: null })
  present_address: string;

  @Prop({ type: null })
  permanent_address: string;

  @Prop({ type: Number })
  latitude: number;

  @Prop({ type: Number })
  longitude: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
