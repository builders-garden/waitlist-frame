import { NextResponse } from "next/server";
import { jwtVerify, importSPKI } from "jose";

import type { NextRequest } from "next/server";

export const config = {
  matcher: "/api/:function*",
};

export async function middleware(req: NextRequest) {
  if (req.url.includes("/api/public/")) {
    // If the request is for a public endpoint, continue processing the request
    return NextResponse.next();
  }

  // Get the Dynamic token from the headers
  const authToken = req.headers.get("Authorization");

  if (!authToken) {
    return NextResponse.json(
      { success: false, message: "Missing auth token" },
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const token = authToken.replace("Bearer ", "");
    const key = await importSPKI(
      process.env.NEXT_PUBLIC_DYNAMIC_PUBLIC_KEY!.replace(/\\n/g, "\n"),
      "RS256"
    );
    const isAuthenticated = await jwtVerify(token, key);

    if (!isAuthenticated) {
      // Respond with JSON indicating an error message
      return NextResponse.json(
        { success: false, message: "Authentication failed" },
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // If authentication is successful, continue processing the request
    const response = NextResponse.next();
    const address = (
      isAuthenticated.payload as any
    ).verified_credentials[0].address.toLowerCase();
    response.headers.set("x-address", address);
    return response;
  } catch (error: any) {
    // Handle errors related to token verification or other issues
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
        error: error.message,
      },
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
