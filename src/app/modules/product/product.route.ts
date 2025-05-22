import express, { NextFunction, Request, Response } from 'express';
import { productController } from './product.controller';
import { upload } from '../../../ulits/sendImageToCloudinary';
const router = express.Router();

router.get('/all', productController.productGetBD);
router.post(
  '/store',
  upload.array('files',10),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return productController.productStoreBD(req, res, next);
  },
);
router.get('/:id', productController.singleProductBD);
router.delete('/:id', productController.deleteProductBD);

export const productRoutes = router;
