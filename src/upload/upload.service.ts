import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  async uploadFileAmazonS3(fileName: string, file: Buffer) {
    try {
      const result = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: 'ea-bank-payment-voucher',
          Key: fileName,
          Body: file,
          ACL: 'public-read',
        }),
      );

      return {
        result,
        url: `https://ea-bank-payment-voucher.s3.${this.configService.getOrThrow('AWS_S3_REGION')}.amazonaws.com/${fileName}`,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Erro ao fazer o upload do arquivo',
      );
    }
  }
}
