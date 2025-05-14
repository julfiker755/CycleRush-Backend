import { z } from 'zod';
import { gender } from '../admin/admin.constants';

const patientSchema = z.object({
  name: z.string({
    invalid_type_error: 'Name must be a text value',
    required_error: 'Name is required',
  }),
  email: z.string({
    invalid_type_error: 'Email must be a valid email address',
    required_error: 'Email is required',
  }).email('Invalid email format'),
  password: z.string({
    invalid_type_error: 'Password must be a text value',
    required_error: 'Password is required',
  }).min(6, 'Password must be at least 6 characters'),
  contactNumber: z.string({
    invalid_type_error: 'Contact number must be a text value',
    required_error: 'Contact number is required',
  }),
  address: z.string({
    invalid_type_error: 'Address must be a text value',
    required_error: 'Address is required',
  }),
  gender: z.enum(gender, {
    invalid_type_error: 'Gender must be one of the allowed values',
    required_error: 'Gender is required',
  }),
});


export const patientValidation = {
  patientSchema,
};
