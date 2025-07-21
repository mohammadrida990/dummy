import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();
  const cookieStore = await cookies();

  if (!token) return NextResponse.json({ error: "No token" }, { status: 400 });

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return new Response("ok");
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}
