import {
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { s3, BUCKET } from "@/lib/minio";
import { PhotoCategory, PhotoType } from "@/generated/prisma/enums";

function path(
  category: PhotoCategory,
  type: PhotoType,
  refId: string,
  fileName: string,
) {
  return `${category}/${refId}/${type}/${fileName}`;
}

class UploadService {
  async upload(
    file: File,
    category: PhotoCategory,
    refId: string,
    type: PhotoType,
  ) {
    const key = path(category, type, refId, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. save to Minio
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    // 2. return the key -- the caller stores this, and storageUrl() turns it
    //    into a public URL at render time
    return key;
  }

  async uploadMany(
    files: File[],
    category: PhotoCategory,
    refId: string,
    type: PhotoType,
  ) {
    const keys = await Promise.all(
      files.map((item) => this.upload(item, category, refId, type)),
    );

    return keys;
  }

  async deleteByType(type: PhotoType, gallerys: string[], cover?: string) {
    if (type === "GALLERY") {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: {
            Objects: gallerys.map((item) => ({
              Key: item,
            })),
          },
        }),
      );
    } else {
      if (cover) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: cover,
          }),
        );
      }
    }
  }

  async deleteByRef(refId: string) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: refId,
      }),
    );
  }
}

export const uploadService = new UploadService();
