import express from 'express';
import { wishController } from './wish.controller';
const router = express.Router();

router.get('/all', wishController.wishGetBD);
router.post("/store",wishController.wishStoreBD);


export const wishRoutes = router;
