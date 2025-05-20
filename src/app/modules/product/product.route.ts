import express, { NextFunction, Request, Response } from 'express';
import { productController } from './product.controller';
const router = express.Router();

router.get('/all', productController.productGetBD);
router.post('/store', (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.body.data);
//   console.log("file"+ req.body.file)
  req.body = JSON.parse(req.body.data);
  return productController.productStoreBD(req, res, next);
});

export const productRoutes = router;
