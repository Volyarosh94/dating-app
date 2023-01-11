import { Injectable, OnModuleInit } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { extname } from 'path';

import { UploadFilePathEnum } from '../enums/upload-file-path.enum';

@Injectable()
export class S3Service implements OnModuleInit {
  private s3!: S3;
  private bucket!: string;

  onModuleInit() {
    const region = process.env.AWS_REGION;
    const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
    const accessKey = process.env.AWS_ACCESS_KEY_ID;
    const bucketName = process.env.AWS_BUCKET_NAME;

    this.s3 = new S3({
      region,
      secretAccessKey: secretKey,
      accessKeyId: accessKey,
    });
    this.bucket = bucketName;
  }

  async uploadFile(file: Express.Multer.File, uploadPath: UploadFilePathEnum) {
    const fileName = this.generateFileName(extname(file.originalname));

    return this.s3
      .upload({
        Body: file.buffer,
        Key: `${uploadPath}/${fileName}`,
        Bucket: this.bucket,
        ACL: 'public-read',
      })
      .promise();
  }

  generateFileName(extension: string) {
    return `${randomUUID()}${extension}`;
  }
}
