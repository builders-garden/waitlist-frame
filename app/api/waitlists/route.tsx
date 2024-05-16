import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { uploadImage } from "../../../lib/imagekit";
import slugify from "slugify";

export const GET = async (req: NextRequest) => {
  const address = req.headers.get("x-address");

  const waitlists = await prisma.waitlist.findMany({
    where: {
      userAddress: address!,
    },
    include: {
      _count: {
        select: { waitlistedUsers: true },
      },
    },
  });

  console.log(waitlists);

  return NextResponse.json(waitlists);
};

export const POST = async (req: NextRequest) => {
  const body = await req.formData();

  const name = body.get("name");
  const endDate = body.get("endDate");
  const externalUrl = body.get("externalUrl");
  const address = req.headers.get("x-address");

  const landingImage: File | null = body.get("files[0]") as unknown as File;
  const sucessImage: File | null = body.get("files[1]") as unknown as File;
  if (
    !name ||
    !endDate ||
    !externalUrl ||
    !address ||
    !landingImage ||
    !sucessImage
  ) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  const landingBytes = await landingImage!.arrayBuffer();
  const landingBuffer = Buffer.from(landingBytes);
  const successBytes = await sucessImage!.arrayBuffer();
  const successBuffer = Buffer.from(successBytes);
  const [landing, success] = await Promise.all([
    uploadImage(landingBuffer, `${name}-landing.png`),
    uploadImage(successBuffer, `${name}-success.png`),
  ]);

  const waitlist = await prisma.waitlist.create({
    data: {
      name: name as string,
      slug: slugify(name as string, {
        lower: true,
        trim: true,
        replacement: "-",
      }),
      endDate: new Date(endDate as string),
      externalUrl: externalUrl as string,
      userAddress: address!,
      imageLanding: landing.url,
      imageSuccess: success.url,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(waitlist);
};
