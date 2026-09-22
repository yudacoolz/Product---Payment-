import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { createProductSchema } from "@/validations/product.validation";
import { uploadService } from "@/services/upload.service";
import { PhotoCategory, PhotoType } from "@/generated/prisma/enums";
import { uploadServiceSB } from "@/services/upload_supabase.service";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch products",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // const body = await request.json();

    // 1. get FormData
    const FormData = await request.formData();
    const name = FormData.get("name");
    const description = FormData.get("description");
    const jumlah = FormData.get("jumlah");
    const price = FormData.get("price");
    const cover = FormData.get("coverUrl");
    const gallery = FormData.getAll("galleryUrl");

    // 2. validate data
    const validatedData = createProductSchema.parse({
      name,
      description,
      jumlah,
      price,
      coverUrl: cover,
      galleryUrl: gallery,
    });

    // 3. create product
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        jumlah: validatedData.jumlah,
      },
    });

    // 4. update cover
    if (cover) {
      const coverKey = await uploadServiceSB.upload(
        validatedData.coverUrl,
        PhotoCategory.PRODUCTS,
        product.id,
        PhotoType.COVER,
      );
      await prisma.product.update({
        where: { id: product.id },
        data: {
          coverUrl: coverKey.url,
        },
      });

      await prisma.photo.create({
        data: {
          url: coverKey.url,
          key: coverKey.key,
          refId: product.id,
          fileName: coverKey.fileName,
          originalName: coverKey.originalName,
          size: coverKey.size,
          category: PhotoCategory.PRODUCTS,
          type: PhotoType.COVER,
        },
      });
    }

    // 5. update gallery
    if (gallery.length > 0) {
      const galleryKeys = await uploadServiceSB.uploadMany(
        validatedData.galleryUrl,
        PhotoCategory.PRODUCTS,
        product.id,
      );
      await prisma.product.update({
        where: { id: product.id },
        data: {
          galleryUrl: galleryKeys.map((item) => item.url),
        },
      });

      // pakai CreateMany
      await prisma.photo.createMany({
        data: galleryKeys.map((item) => ({
          url: item.url,
          key: item.key,
          refId: product.id,
          fileName: item.fileName,
          originalName: item.originalName,
          size: item.size,
          category: PhotoCategory.PRODUCTS,
          type: PhotoType.GALLERY,
        })),
      });
    }

    // 6. return
    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid product data",
          errors: error.issues,
        },
        {
          status: 400,
        },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create product",
      },
      {
        status: 500,
      },
    );
  }
}
