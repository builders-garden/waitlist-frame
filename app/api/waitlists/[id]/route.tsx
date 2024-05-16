import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { uploadImage } from "../../../../lib/imagekit";
import slugify from "slugify";

export const GET = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const address = req.headers.get("x-address");
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      userAddress: address!,
      id: parseInt(id),
    },
    include: {
      _count: {
        select: { waitlistedUsers: true },
      },
    },
  });
  if (!waitlist) {
    return NextResponse.json(
      {
        message: "Waitlist not found",
      },
      { status: 404 }
    );
  }
  return NextResponse.json(waitlist);
};

export const PUT = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  // update waitlist
  const body = await req.formData();

  const name = body.get("name");
  const endDate = body.get("endDate");
  const externalUrl = body.get("externalUrl");
  const address = req.headers.get("x-address");

  const landingImage: File | null = body.get("files[0]") as unknown as File;
  const successImage: File | null = body.get("files[1]") as unknown as File;

  if (!name || !endDate || !externalUrl) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const slugName = slugify(name as string, {
    lower: true,
    trim: true,
    replacement: "-",
  });
  const existingWaitlist = await prisma.waitlist.findFirst({
    where: {
      id: {
        not: parseInt(id),
      },
      slug: slugName,
    },
  });

  if (existingWaitlist) {
    return NextResponse.json(
      { message: "Waitlist with that name already exists" },
      { status: 400 }
    );
  }

  let landing: { url: string } = { url: "" };
  if (landingImage) {
    const landingBytes = await landingImage!.arrayBuffer();
    const landingBuffer = Buffer.from(landingBytes);
    const landingUpload = await uploadImage(
      landingBuffer,
      `${name}-landing.png`
    );
    landing = { url: landingUpload.url };
  }

  let success: { url: string } = { url: "" };
  if (successImage) {
    const successBytes = await successImage!.arrayBuffer();
    const successBuffer = Buffer.from(successBytes);
    const successUpload = await uploadImage(
      successBuffer,
      `${name}-success.png`
    );
    success = { url: successUpload.url };
  }

  const waitlist = await prisma.waitlist.update({
    where: {
      userAddress: address!,
      id: parseInt(id),
    },
    data: {
      name: name as string,
      endDate: new Date(endDate as string),
      externalUrl: externalUrl as string,
      ...(landing.url ? { imageLanding: landing.url } : {}),
      ...(success.url ? { imageSuccess: success.url } : {}),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(waitlist);
};

export const DELETE = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  // delete waitlist
  const address = req.headers.get("x-address");
  const waitlist = await prisma.waitlist.delete({
    where: {
      userAddress: address!,
      id: parseInt(id),
    },
  });
  if (!waitlist) {
    return NextResponse.json(
      {
        message: "Waitlist not found",
      },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true });
};
