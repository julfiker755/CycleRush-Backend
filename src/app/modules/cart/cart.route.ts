import express from 'express';
import auth from '../../middleware/auth';
import { Role } from '../user/user.constants';
import { cartController } from './cart.controller';
const router = express.Router();

router.get('/all', auth(Role.customer), cartController.cartGetBD);
router.patch("/increment/:id", auth(Role.customer),cartController.incrementCartDB);
router.patch("/decrement/:id",auth(Role.customer), cartController.decrementCartDB);
router.post("/store",auth(Role.customer),cartController.cartStoreBD);
router.delete("/:id",cartController.deleteCartBD);


export const cartRoutes = router;
