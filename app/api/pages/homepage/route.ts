/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

async function writeImageToPublic(fileName: string, imageBuffer: Buffer) {
  const filePath = path.join(process.cwd(), "public", "account", fileName);
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, imageBuffer);
  } catch (err) {
    console.error("Error writing image:", err);
    throw new Error("Unable to write image");
  }
}

async function handleImage(file: any, fileName: string) {
  if (file instanceof File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeImageToPublic(fileName, buffer);
  } else {
    console.log(`Skipping ${fileName} since it's not a File object.`);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const subtitle = formData.get("subtitle")?.toString();
    const banner = formData.get("banner") as File | null;

    // Exercises data
    const exercises = JSON.parse(formData.get("exercises")?.toString() || "[]");

    // Promotions data
    const promotions = JSON.parse(
      formData.get("promotions")?.toString() || "[]"
    );

    // Gallery images
    const galleryImages = formData.getAll("gallery") as File[];

    if (!title || !subtitle || !banner) {
      return NextResponse.json(
        { error: "Title, subtitle, and banner are required" },
        { status: 400 }
      );
    }

    // Handle banner image
    const bannerFilePath = `account/${banner.name}`;
    await handleImage(banner, bannerFilePath);

    // Create page_home entry with related data
    const data = await prisma.page_home.create({
      data: {
        title,
        subtitle,
        banner: bannerFilePath,
        page_home_exercise: {
          create: exercises.map((exercise: any) => ({
            name_exercise: exercise.name,
            description: exercise.description,
            banner_exercise: exercise.banner
              ? `account/${exercise.banner.name}`
              : null,
          })),
        },
        page_home_promotion: {
          create: promotions.map((promotion: any) => ({
            title_promotion: promotion.title,
            detail_promotion: promotion.detail,
            banner_promotion: promotion.banner
              ? `account/${promotion.banner.name}`
              : null,
          })),
        },
        page_home_gallery: {
          create: galleryImages.map((image: File) => ({
            picture_gallery: `account/${image.name}`,
          })),
        },
      },
      include: {
        page_home_exercise: true,
        page_home_promotion: true,
        page_home_gallery: true,
      },
    });

    // Write additional images for exercises, promotions, and gallery
    for (const exercise of exercises) {
      if (exercise.banner) {
        await handleImage(exercise.banner, `account/${exercise.banner.name}`);
      }
    }

    for (const promotion of promotions) {
      if (promotion.banner) {
        await handleImage(promotion.banner, `account/${promotion.banner.name}`);
      }
    }

    for (const image of galleryImages) {
      await handleImage(image, `account/${image.name}`);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await prisma.page_home.findMany({
      include: {
        page_home_exercise: true,
        page_home_promotion: true,
        page_home_gallery: true,
      },
    });
    // console.log("data==> GET()", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}

// export async function PUT(request: Request) {
//   try {
//     const formData = await request.formData();
//     console.log("formData==> PUT()", formData);
//     const page_home_id = parseInt(
//       formData.get("page_home_id")?.toString() || "0"
//     );
//     const title = formData.get("title")?.toString();
//     const subtitle = formData.get("subtitle")?.toString();
//     const banner = formData.get("banner") as File | null;
//     const existingBanner = formData.get("existingBanner")?.toString();
    
//     const exerciseFiles = formData.getAll("exerciseFiles") as File[];
//     const promotionFiles = formData.getAll("promotionFiles") as File[];

//     // Map files to metadata using filename as key
//     const exerciseFileMap = new Map(
//       exerciseFiles.map((file) => [file.name, file])
//     );
//     const promotionFileMap = new Map(
//       promotionFiles.map((file) => [file.name, file])
//     );

//     // New gallery images
//     const galleryImages = formData.getAll("gallery") as (File | string)[];
    
//     // Existing gallery images to keep
//     const existingGalleryImages = formData.getAll("existingGallery").map(img => img.toString());

//     // Exercises data
//     const exercises = JSON.parse(
//       formData.get("page_home_exercise")?.toString() || "[]"
//     );

//     // Promotions data
//     const promotions = JSON.parse(
//       formData.get("promotions")?.toString() || "[]"
//     );

//     if (!page_home_id) {
//       return NextResponse.json(
//         { error: "Page ID is required" },
//         { status: 400 }
//       );
//     }

//     console.log("exercises ----------------> ", exercises);
//     console.log("promotions ----------------> ", promotions);
//     console.log("existingGalleryImages ----------------> ", existingGalleryImages);

//     function normalizePath(path: string | null): string | null {
//       if (!path) return null;
      
//       // If path already starts with "account/", return it as is
//       if (path.startsWith("account/")) {
//         return path;
//       }
      
//       // Otherwise, prepend "account/"
//       return `account/${path}`;
//     }

//     const updateData: any = {
//       title,
//       subtitle,
//     };

//     // Update banner if a new one is provided
//     if (banner) {
//       const bannerFilePath = `account/${banner.name}`;
//       await handleImage(banner, bannerFilePath);
//       updateData.banner = bannerFilePath;
//     } else if (existingBanner) {
//       // Keep existing banner
//       updateData.banner = existingBanner;
//     }

//     // Update main page data
//     await prisma.page_home.update({
//       where: { page_home_id },
//       data: updateData,
//     });

//     // Only update related data if new data is provided
//     if (exercises.length > 0) {
//       // Delete old data
//       await prisma.page_home_exercise.deleteMany({ where: { page_home_id } });

//       await prisma.page_home_exercise.createMany({
//   data: exercises.map((exercise: any) => ({
//     name_exercise: exercise.name,
//     description: exercise.description,
//     banner_exercise: normalizePath(exercise.banner),
//     page_home_id,
//   })),
// });

//       // Upload only files that are actual File objects
//       for (const exercise of exercises) {
//         const file = exerciseFileMap.get(exercise.banner); // Find from Map
//         if (file) {
//           const exerciseBannerBuffer = Buffer.from(await file.arrayBuffer());
//           await writeImageToPublic(file.name, exerciseBannerBuffer);
//         }
//       }
//     }

//     if (promotions.length > 0) {
//       // Delete old data
//       await prisma.page_home_promotion.deleteMany({ where: { page_home_id } });

//       await prisma.page_home_promotion.createMany({
//         data: promotions.map((promotion: any) => ({
//           title_promotion: promotion.title,
//           detail_promotion: promotion.detail,
//           banner_promotion: normalizePath(promotion.banner),
//           page_home_id,
//         })),
//       });

//       // Upload only files that are actual File objects
//       for (const promotion of promotions) {
//         const file = promotionFileMap.get(promotion.banner);
//         if (file) {
//           const promotionBannerBuffer = Buffer.from(await file.arrayBuffer());
//           await writeImageToPublic(file.name, promotionBannerBuffer);
//         }
//       }
//     }

//     // Handle gallery images - combine new and existing
//     if (galleryImages.length > 0 || existingGalleryImages.length > 0) {
//       // Delete old gallery images for this page
//       await prisma.page_home_gallery.deleteMany({ where: { page_home_id } });

//       // Create entries for new files and existing files
//       const galleryEntries = [
//         // New files
//         ...galleryImages.map((image) => {
//           if (typeof image === "string") {
//             return { picture_gallery: normalizePath(image), page_home_id };
//           } else {
//             return { picture_gallery: `account/${image.name}`, page_home_id };
//           }
//         }),
//         // Existing files
//         ...existingGalleryImages.map((path) => ({
//           picture_gallery: normalizePath(path),
//           page_home_id
//         }))
//       ];

//       // Create all gallery entries
//       await prisma.page_home_gallery.createMany({
//         data: galleryEntries
//       });

//       // Write new files to disk
//       for (const image of galleryImages) {
//         if (!(typeof image === "string")) {
//           // If image is a File
//           const galleryImageBuffer = Buffer.from(await image.arrayBuffer());
//           await writeImageToPublic(image.name, galleryImageBuffer);
//         }
//       }
//     }

//     return NextResponse.json(
//       { message: "Updated successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: `Something went wrong: ${error}` },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const page_home_id = parseInt(
      formData.get("page_home_id")?.toString() || "0"
    );
    const title = formData.get("title")?.toString();
    const subtitle = formData.get("subtitle")?.toString();
    const banner = formData.get("banner") as File | null;
    const existingBanner = formData.get("existingBanner")?.toString();
    
    const exerciseFiles = formData.getAll("exerciseFiles") as File[];
    const promotionFiles = formData.getAll("promotionFiles") as File[];

    const exerciseFileMap = new Map(
      exerciseFiles.map((file) => [file.name, file])
    );
    const promotionFileMap = new Map(
      promotionFiles.map((file) => [file.name, file])
    );

    const galleryImages = formData.getAll("gallery") as (File | string)[];
    const existingGalleryImages = formData.getAll("existingGallery").map(img => img.toString());

    const exercises = JSON.parse(
      formData.get("page_home_exercise")?.toString() || "[]"
    );

    const promotions = JSON.parse(
      formData.get("promotions")?.toString() || "[]"
    );

    if (!page_home_id) {
      return NextResponse.json(
        { error: "Page ID is required" },
        { status: 400 }
      );
    }

    function normalizePath(path: string | null): string | null {
      if (!path) return null;
      if (path.startsWith("account/")) {
        return path;
      }
      return `account/${path}`;
    }

    const updateData: any = { title, subtitle };

    if (banner) {
      const bannerFilePath = `account/${banner.name}`;
      await handleImage(banner, bannerFilePath);
      updateData.banner = bannerFilePath;
    } else if (existingBanner) {
      updateData.banner = existingBanner;
    }

    await prisma.page_home.update({
      where: { page_home_id },
      data: updateData,
    });

    // Delete and reset auto-increment for exercises
    await prisma.page_home_exercise.deleteMany({ where: { page_home_id } });
    await prisma.$executeRaw`ALTER TABLE page_home_exercise AUTO_INCREMENT = 1;`;

    if (exercises.length > 0) {
      await prisma.page_home_exercise.createMany({
        data: exercises.map((exercise: any) => ({
          name_exercise: exercise.name,
          description: exercise.description,
          banner_exercise: normalizePath(exercise.banner),
          page_home_id,
        })),
      });

      for (const exercise of exercises) {
        const file = exerciseFileMap.get(exercise.banner);
        if (file) {
          const exerciseBannerBuffer = Buffer.from(await file.arrayBuffer());
          await writeImageToPublic(file.name, exerciseBannerBuffer);
        }
      }
    }

    // Delete and reset auto-increment for promotions
    await prisma.page_home_promotion.deleteMany({ where: { page_home_id } });
    await prisma.$executeRaw`ALTER TABLE page_home_promotion AUTO_INCREMENT = 1;`;

    if (promotions.length > 0) {
      await prisma.page_home_promotion.createMany({
        data: promotions.map((promotion: any) => ({
          title_promotion: promotion.title,
          detail_promotion: promotion.detail,
          banner_promotion: normalizePath(promotion.banner),
          page_home_id,
        })),
      });

      for (const promotion of promotions) {
        const file = promotionFileMap.get(promotion.banner);
        if (file) {
          const promotionBannerBuffer = Buffer.from(await file.arrayBuffer());
          await writeImageToPublic(file.name, promotionBannerBuffer);
        }
      }
    }

    // Delete and reset auto-increment for gallery images
    await prisma.page_home_gallery.deleteMany({ where: { page_home_id } });
    await prisma.$executeRaw`ALTER TABLE page_home_gallery AUTO_INCREMENT = 1;`;

    if (galleryImages.length > 0 || existingGalleryImages.length > 0) {
      const galleryEntries = [
        ...galleryImages.map((image) => {
          if (typeof image === "string") {
            return { picture_gallery: normalizePath(image), page_home_id };
          } else {
            return { picture_gallery: `account/${image.name}`, page_home_id };
          }
        }),
        ...existingGalleryImages.map((path) => ({
          picture_gallery: normalizePath(path),
          page_home_id
        }))
      ];

      await prisma.page_home_gallery.createMany({
        data: galleryEntries
      });

      for (const image of galleryImages) {
        if (!(typeof image === "string")) {
          const galleryImageBuffer = Buffer.from(await image.arrayBuffer());
          await writeImageToPublic(image.name, galleryImageBuffer);
        }
      }
    }

    return NextResponse.json(
      { message: "Updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}
