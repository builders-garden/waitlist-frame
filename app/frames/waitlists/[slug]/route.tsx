/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../../frames";
import prisma from "../../../../lib/prisma";
import { getFrameMessage } from "frames.js/getFrameMessage";
import { createCastIntent } from "../../../../lib/warpcast";

const frameHandler = frames(async (ctx) => {
  /*if (!ctx?.message?.isValid) {
    throw new Error("Invalid message");
  }*/
  const ref = ctx.url.searchParams.get("ref");
  let slug = ctx.url.pathname.split("/").pop();
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      slug,
    },
  });
  if (!waitlist) {
    // TODO: show an error image
    throw new Error("Invalid waitlist");
  }

  return {
    image: waitlist.imageLanding,
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    buttons: [
      <Button
        action="post"
        key="1"
        target={{
          pathname: `/waitlists/${waitlist.slug}/join`,
          search: ref ? `?ref=${ref}` : "",
        }}
      >
        Join Waitlist
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;