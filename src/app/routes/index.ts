import { Router } from 'express';
import { productRoutes } from '../modules/product/product.route';



const router = Router();


const moduleRoues = [
{
    path: '/product',
    route:productRoutes,
}
];

moduleRoues.forEach((route) => router.use(route.path, route.route));

export default router;
