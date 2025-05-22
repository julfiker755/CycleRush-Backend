import { Router } from 'express';
import { productRoutes } from '../modules/product/product.route';
import { userRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoues = [
  {
    path: '/auth',
    route:userRoutes,
  },
  {
    path: '/product',
    route: productRoutes,
  },
];

moduleRoues.forEach((route) => router.use(route.path, route.route));

export default router;
