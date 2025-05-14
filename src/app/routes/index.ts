import { Router } from 'express';
import { adminRoutes } from '../modules/admin/admin.route';
import { userRoutes } from '../modules/user/user.route';
import { doctorRoutes } from '../modules/doctor/doctor.route';
import { patientRoutes } from '../modules/patient/patient.route';
import { specialitieRoutes } from '../modules/specialities/specialities.route';

const router = Router();


const moduleRoues = [
  {
    path: '/user',
    route:userRoutes,
  },
  {
    path:'/admin',
    route:adminRoutes
  },{
    path:'/doctor',
    route:doctorRoutes
  },{
    path:'/patient',
    route:patientRoutes
  },{
    path:'/specialitie',
    route:specialitieRoutes
  }
];

moduleRoues.forEach((route) => router.use(route.path, route.route));

export default router;
