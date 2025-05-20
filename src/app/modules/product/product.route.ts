import express from 'express';
import { productController } from './product.controller';
const router = express.Router();

router.get('/', productController.productGetBD);


export const productRoutes = router;
