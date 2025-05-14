import mongoose from 'mongoose';
import { doctorItem, patientItem, adminItem } from './data';
import { patientService } from '../src/app/modules/patient/patient.service';
import { doctorService } from '../src/app/modules/doctor/doctor.service';
import { adminService } from '../src/app/modules/admin/admin.serviec';
import config from '../src/app/config';

const StoreData = async () => {
  let loading = true;
  try {
    await mongoose.connect(config.database_url as string);
    console.log('✅ Connected to MongoDB');
    loading && console.log('Waiting...');

    // **************Store Admins
    for (const item of adminItem) {
      await adminService.adminStoreBD(item);
    }

    // ************** Store Doctors
    for (const item of doctorItem) {
      await doctorService.doctorStoreBD(item);
    }
    // ************** Store Patients
    for (const item of patientItem) {
      await patientService.patientStoreBD(item);
    }
    loading = false;
    console.log(`✅ Stored successfully`);
  } catch (error) {
    console.error('❌ Error occurred during data storage:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
};

StoreData();
