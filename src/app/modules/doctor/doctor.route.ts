import express from 'express';
import ValidateRequest from '../../middleware/validateRequest';
import { doctorController } from './doctor.controller';
import { doctorValidation } from './doctor.validation';
import auth from '../../middleware/auth';
import { Role } from '../user/user.constants';
const router = express.Router();

router.get('/', doctorController.doctorGetBD);
router.post(
  '/store',
  ValidateRequest(doctorValidation.doctorSchema),
  doctorController.dcotorStoreBD,
);
router.get('/:id', doctorController.doctorGetByIdBD);
router.put('/update', auth(Role.doctor), doctorController.doctorUpdateBD);
router.delete('/:id',doctorController.doctorDeleteByIdBD);   

export const doctorRoutes = router;
