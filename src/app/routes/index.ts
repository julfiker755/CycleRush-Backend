import { Router } from 'express';
import { productRoutes } from '../modules/product/product.route';
import { userRoutes } from '../modules/user/user.route';
import { wishRoutes } from '../modules/wish/wish.route';
import { cartRoutes } from '../modules/cart/cart.route';

const router = Router();

const moduleRoues = [
  {
    path: '/auth',
    route:userRoutes,
  },
  {
    path: '/product',
    route: productRoutes,
  },{
    path: '/wish',
    route:wishRoutes,
  },{
    path: '/cart',
    route:cartRoutes,
  }
];

moduleRoues.forEach((route) => router.use(route.path, route.route));

export default router;
