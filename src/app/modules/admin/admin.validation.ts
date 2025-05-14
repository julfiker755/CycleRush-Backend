import { z } from 'zod';
import { gender } from './admin.constants';


const adminSchema = z.object({
    name: z.string({
    invalid_type_error: 'name must be string',
    required_error: 'name is Required',
  }),
  email: z.string({
    invalid_type_error: 'email must be string',
    required_error: 'email is Required',
  }),
  password: z.string({
    invalid_type_error: 'password must be string',
    required_error: 'password is Required',
  }),
  address: z.string({
    invalid_type_error: 'password must be string',
    required_error: 'password is Required',
  }),
  gender:z.enum(gender,{
    invalid_type_error: 'gender must be string',
    required_error: 'gender is Required',
  }),
  contactNumber: z.string({
    invalid_type_error: 'contactNumber must be string',
    required_error: 'contact is Required',
  }),
});


export const adminValidation = {
    adminSchema,
};
