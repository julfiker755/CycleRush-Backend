import express from 'express';
import { adminController } from './admin.controller';
import ValidateRequest from '../../middleware/validateRequest';
import { adminValidation } from './admin.validation';
import auth from '../../middleware/auth';
import { Role } from '../user/user.constants';
const router = express.Router();

router.get('/', adminController.adminGetBD);
router.post(
  '/store',
  ValidateRequest(adminValidation.adminSchema),
  adminController.adminStoreBD,
);
router.get('/:id', adminController.adminGetByIdBD);
router.put(
  '/update',
  auth(Role.super_admin, Role.admin),
  adminController.adminUpdate,
);
router.delete('/:id', auth(Role.super_admin), adminController.adminDelete);

export const adminRoutes = router;
