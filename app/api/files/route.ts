import { getAuth } from "@/lib/auth/dal";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import {Jimp, JimpMime} from "jimp";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { user } = await getAuth();

  if (!user) {
    // User is not authorized
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = (await formData.getAll("files[]")) as File[];

  let fileIds: string[] = [];

  for (const file of files) {
    if (!file.name || !file.type || !file.size) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    let fileBuffer: ArrayBuffer | Buffer = await file.arrayBuffer();

    if (file.type.startsWith("image")) {
      let image = await Jimp.read(Buffer.from(fileBuffer));
      await image.resize({w: 720});
      fileBuffer = await image.clone().getBuffer("image/png", {quality: 80});
    }

    // Save file to the database
    const fileData = await prisma.file.create({
      data: {
        uploadedById: user.id,
        mimetype: file.type,
        filename: file.name,
        size: file.size,
        path: `uploads/${file.name}`,
      },
    });

    // Save file to the filesystem
    await fs.writeFile(`uploads/${fileData.id}`, new Uint8Array(fileBuffer));

    fileIds.push(fileData.id);
  }

  return NextResponse.json({ fileIds });
};
