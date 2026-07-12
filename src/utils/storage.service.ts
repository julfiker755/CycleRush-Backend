import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class StorageService {
  private driver = process.env.STORAGE_DRIVER ?? 'local'; // 'local' | 'cloudinary'
  private baseUrl = process.env.APP_URL ?? 'http://localhost:3000';

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(file: Express.Multer.File, folder: string) {
    if (this.driver === 'cloudinary') {
      return new Promise<{ url: string; key: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `app/${folder}` },
          (err, result) => {
            if (err || !result) return reject(err);
            resolve({ url: result.secure_url, key: result.public_id });
          },
        );
        stream.end(file.buffer);
      });
    }

    const dir = join(process.cwd(), 'uploads', folder);
    await fs.mkdir(dir, { recursive: true });
    const filename = `${Date.now()}${extname(file.originalname)}`;
    await fs.writeFile(join(dir, filename), file.buffer);
    const key = `${folder}/${filename}`;
    return { url: `${this.baseUrl}/uploads/${key}`, key };
  }

  async remove(key?: string) {
    if (!key) return;
    if (this.driver === 'cloudinary') {
      await cloudinary.uploader.destroy(key).catch(() => {});
    } else {
      await fs.unlink(join(process.cwd(), 'uploads', key)).catch(() => {});
    }
  }

  /** old file remove + notun file upload — ekসাথে */
  async replace(file: Express.Multer.File, folder: string, oldKey?: string) {
    await this.remove(oldKey);
    return this.upload(file, folder);
  }
}
