import prisma from "../../../../prisma/prisma.ts";
import crypto from "crypto";
import jwt from 'jsonwebtoken';

export async function createToken(
  userId: number,
  token: string,
  expiresAt: Date
) {
  return prisma.token.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
}

export async function verifyToken(token: string) {
  const storedToken = await prisma.token.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error("Invalid or expired token");
  }

  return storedToken.user;
}

export async function deleteToken(token: string) {
  try {
    await prisma.token.delete({
      where: { token },
    });
  } catch (error) {
    console.warn(
      "Token not found in database during logout. It may have already been deleted or expired."
    );
  }
}

// Generate a refresh token
export function generateRefreshToken(userId: number): string {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );
}

// Verify refresh token
export async function verifyRefreshToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET as string) as { id: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}

// You can also add other token-related functions here as needed