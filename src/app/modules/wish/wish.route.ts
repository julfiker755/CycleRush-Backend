import express from 'express';
import { wishController } from './wish.controller';
import auth from '../../middleware/auth';
import { Role } from '../user/user.constants';
const router = express.Router();

router.get('/all', auth(Role.customer), wishController.wishGetBD);
router.post("/store",wishController.wishStoreBD);
router.delete("/:id",wishController.deleteWishBD);


export const wishRoutes = router;
