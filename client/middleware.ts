import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const authToken = req.cookies.get("qf_auth_token")?.value;
  const refreshToken = req.cookies.get("qf_refresh_token")?.value;
  const url = req.url;

  console.log(authToken, refreshToken);

  // Function to refresh the token
  const refreshAuthToken = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `qf_refresh_token=${refreshToken}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        const nextResponse = NextResponse.next();
        nextResponse.cookies.set("qf_auth_token", result.authToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60, // 15 minutes
        });
        return nextResponse;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
    return null;
  };
  
  // If there's no auth token but there's a refresh token, attempt to refresh
  if (!authToken && refreshToken) {
    const refreshedResponse = await refreshAuthToken();
    if (refreshedResponse) {
      return refreshedResponse;
    }
  }

  // If accessing login page and already authenticated, redirect to dashboard
  if (req.nextUrl.pathname.startsWith("/auth/sign-in") && authToken) {
    return NextResponse.redirect(new URL("/dashboard", url));
  }

  // For protected routes
  if (
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/api/")
  ) {
    // If no auth token after refresh attempt, redirect to login or return 401
    if (!authToken) {
      if (req.nextUrl.pathname.startsWith("/api/")) {
        return new NextResponse(
          JSON.stringify({
            error: { message: "authentication required" },
            status: 401,
          }),
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/auth/sign-in", url));
    }
  }

  return NextResponse.next();
}

// The middleware will run for these pages
export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/:path*", "/auth/sign-in"],
};
