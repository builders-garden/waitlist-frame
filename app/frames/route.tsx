/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";

const frameHandler = frames(async (ctx) => {
  return {
    image: <div>1</div>,
    buttons: [
      <Button action="post" key="1" target="/waitlist/1">
        Join the Waitlist 1
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
