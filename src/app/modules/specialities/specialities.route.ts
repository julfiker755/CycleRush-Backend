import express from 'express';
import { specialitieController } from './specialities.controller';
const router = express.Router();

router.get('/', specialitieController.specialitieGetBD);
// router.post(
//   '/store',
//   patientController.patientStoreBD,
// );
// router.get('/:id', patientController.patientGetByIdBD);
// router.put('/update', auth(Role.patient), patientController.patientUpdateBD);
// router.delete('/:id', patientController.patientDeleteByIdBD);

export const specialitieRoutes = router;
