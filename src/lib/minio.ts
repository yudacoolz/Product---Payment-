import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  // MinIO ignores region, but the AWS SDK refuses to sign without one
  region: process.env.MINIO_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export const BUCKET = process.env.MINIO_BUCKET!;

// export async function createBucketIfNotExists(bucketName: string) {
//   const bucketExists = await s3.bucketExists(bucketName);
//   if (!bucketExists) {
//     await s3.makeBucket(bucketName);
//   }
// }
