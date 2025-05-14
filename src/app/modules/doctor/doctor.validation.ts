import { z } from 'zod';
import { gender } from '../admin/admin.constants';

const doctorSchema = z.object({
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
  address: z.string({
    invalid_type_error: 'Address must be a text value',
    required_error: 'Address is required',
  }),
  gender: z.enum(gender, {
    invalid_type_error: 'Gender must be one of the allowed values',
    required_error: 'Gender is required',
  }),
  contactNumber: z.string({
    invalid_type_error: 'Contact number must be a text value',
    required_error: 'Contact number is required',
  }),
  registrationNumber: z.string({
    invalid_type_error: 'Registration number must be a text value',
    required_error: 'Registration number is required',
  }),
  experience: z.number({
    invalid_type_error: 'Experience must be a number',
    required_error: 'Experience is required',
  }).min(0, 'Experience cannot be negative'),
  appointmentFee: z.number({
    invalid_type_error: 'Appointment fee must be a number',
    required_error: 'Appointment fee is required',
  }).min(0, 'Appointment fee cannot be negative'),
  qualification: z.string({
    invalid_type_error: 'Qualification must be a text value',
    required_error: 'Qualification is required',
  }),
  currentWorkingPlace: z.string({
    invalid_type_error: 'Current working place must be a text value',
    required_error: 'Current working place is required',
  }),
  designation: z.string({
    invalid_type_error: 'Designation must be a text value',
    required_error: 'Designation is required',
  })
});

export const doctorValidation = {
  doctorSchema,
};
