import express from 'express';
import ValidateRequest from '../../middleware/validateRequest';
import { patientController } from './patient.controller';
import auth from '../../middleware/auth';
import { Role } from '../user/user.constants';
import { patientValidation } from './patient.validation';
const router = express.Router();

router.get('/', patientController.patientGetBD);
router.post(
  '/store',
  ValidateRequest(patientValidation.patientSchema),
  patientController.patientStoreBD,
);
router.get('/:id', patientController.patientGetByIdBD);
router.put('/update', auth(Role.patient), patientController.patientUpdateBD);
router.delete('/:id', patientController.patientDeleteByIdBD);

export const patientRoutes = router;
