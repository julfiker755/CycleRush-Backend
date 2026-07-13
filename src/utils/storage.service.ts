import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { v2 as cloudinary } from 'cloudinary';

export interface UploadResult {
  url: string;
  key: string;
}

type StorageDriver = 'local' | 'cloudinary';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly driver: StorageDriver =
    (process.env.STORAGE_DRIVER as StorageDriver) ?? 'local';
  private readonly baseUrl = process.env.APP_URL ?? 'http://localhost:3000';

  constructor() {
    if (this.driver === 'cloudinary') {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }
  }

  async upload(
    folder: string,
    file: Express.Multer.File,
  ): Promise<UploadResult> {
    if (!file) {
      throw new InternalServerErrorException('No file provided for upload');
    }

    try {
      if (this.driver === 'cloudinary') {
        return await this.uploadToCloudinary(folder, file);
      }
      return await this.uploadToLocal(folder, file);
    } catch (err: any) {
      this.logger.error(`Upload failed: ${err?.message ?? err}`);
      throw new InternalServerErrorException('File upload failed');
    }
  }

  async remove(folder: string, key?: string): Promise<void> {
    if (!key) return;

    try {
      if (this.driver === 'cloudinary') {
        await cloudinary.uploader.destroy(key, { resource_type: 'image' });
      } else {
        await fs.unlink(join(process.cwd(), 'uploads', folder, key));
      }
    } catch (err: any) {
      this.logger.warn(
        `Failed to remove file "${key}": ${err?.message ?? err}`,
      );
    }
  }

  private uploadToCloudinary(
    folder: string,
    file: Express.Multer.File,
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
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

  private async uploadToLocal(
    folder: string,
    file: Express.Multer.File,
  ): Promise<UploadResult> {
    const dir = join(process.cwd(), 'uploads', folder);
    await fs.mkdir(dir, { recursive: true });

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(
      file.originalname,
    )}`;
    await fs.writeFile(join(dir, filename), file.buffer);

    const key = `${folder}/${filename}`;
    return { url: `${this.baseUrl}/uploads/${key}`, key };
  }
}
