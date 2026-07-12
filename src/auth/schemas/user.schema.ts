import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../roles.decorator';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Auth {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  contact_number: string;

  @Prop({ default: Role.User })
  role: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  is_email_verified: boolean;

  @Prop({ default: false })
  is_phone_verified: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
