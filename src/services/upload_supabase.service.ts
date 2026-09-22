import {
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { s3, BUCKET } from "@/lib/minio";
import { PhotoCategory, PhotoType } from "@/generated/prisma/enums";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

function path(
  category: PhotoCategory,
  type: PhotoType,
  refId: string,
  fileName: string,
) {
  return `${category}/${refId}/${type}/${fileName}`;
}

type UploadPhoto = {
  url: string;
  key: string;
  fileName: string;
  originalName: string;
  size: number;
};

class UploadServiceSupabase {
  async upload(
    file: File,
    category: PhotoCategory,
    refId: string,
    type: PhotoType,
  ): Promise<UploadPhoto> {
    const folder = `${category}/${refId}/${type}`;

    // sanitize file name
    const safeFileName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-");

    const fileName = `${Date.now()}-${safeFileName}`;
    const filePath = `${folder}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. check error
    const { error } = await supabase.storage
      .from("Digital Produk")
      .upload(filePath, buffer, {
        contentType: file.type,
        // upsert: false,
      });
    if (error) throw new Error(error.message);

    // 2. Succes ? -> generate url
    const { data } = await supabase.storage
      .from("Digital Produk")
      .getPublicUrl(filePath);

    // return Response.json({ url: data.publicUrl });

    return {
      url: data.publicUrl,
      key: filePath,
      fileName,
      originalName: file.name,
      size: file.size,
    };
  }

  async uploadMany(files: File[], category: PhotoCategory, refId: string) {
    const keys = await Promise.all(
      files.map((item) =>
        this.upload(item, category, refId, PhotoType.GALLERY),
      ),
    );

    return keys;
  }

  async deleteByType(
    category: PhotoCategory,
    type: PhotoType,
    refId: string,
    files: string[],
  ) {
    const url = `${category}/${refId}/${type}`;
    const path = await Promise.all(files.map((item) => `${url}/${item}`));

    console.log("path : ", path);

    const { data, error } = await supabase.storage
      .from("Digital Produk")
      .remove(path);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async deleteItemsInGallery(key: string[]) {
    const { data, error } = await supabase.storage
      .from("Digital Produk")
      .remove(key);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async deleteByRefId(keys: string[]) {
    const { data, error } = await supabase.storage
      .from("Digital Produk")
      .remove(keys);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

export const uploadServiceSB = new UploadServiceSupabase();
