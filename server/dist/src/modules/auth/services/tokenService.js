import prisma from "../../../../prisma/prisma.ts";
import jwt from 'jsonwebtoken';
export async function createToken(userId, token, expiresAt) {
    return prisma.token.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    });
}
export async function verifyToken(token) {
    const storedToken = await prisma.token.findUnique({
        where: { token },
        include: { user: true },
    });
    if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Error("Invalid or expired token");
    }
    return storedToken.user;
}
export async function deleteToken(token) {
    try {
        await prisma.token.delete({
            where: { token },
        });
    }
    catch (error) {
        console.warn("Token not found in database during logout. It may have already been deleted or expired.");
    }
}
// Generate a refresh token
export function generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
}
// Verify refresh token
export async function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
}
// You can also add other token-related functions here as needed
//# sourceMappingURL=tokenService.js.map