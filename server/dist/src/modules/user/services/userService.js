// import { hash, compare } from "bcrypt";
// import { User, UserTier } from "../models/User";
// import { Folder } from "../../folder/models/Folder";
// import { Token } from "../../auth/models/Token";
// import prisma from "../../../../prisma/prisma";
export {};
// interface UserProfile {
//   id: number;
//   email: string;
//   tier: string;
// }
// export class UserService {
//   private static readonly SALT_ROUNDS = 10;
//   async createUser(
//     email: string,
//     password: string,
//     tier: UserTier = UserTier.BASIC
//   ): Promise<User> {
//     try {
//       const hashedPassword = await this.hashPassword(password);
//       const user = await prisma.user.create({
//         data: {
//           email,
//           password: hashedPassword,
//           tier,
//         },
//         include: { folders: true, tokens: true },
//       });
//       return this.mapPrismaUserToUser(user);
//     } catch (error) {
//       this.handlePrismaError(error, "Failed to create user");
//     }
//   }
//   async getUserById(id: number): Promise<User | null> {
//     try {
//       const user = await prisma.user.findUnique({
//         where: { id },
//         include: { folders: true, tokens: true },
//       });
//       return user ? this.mapPrismaUserToUser(user) : null;
//     } catch (error) {
//       this.handlePrismaError(error, "Failed to fetch user");
//       return null;
//     }
//   }
//   async getUserProfileById(id: number): Promise<UserProfile | null> {
//     try {
//       const user = await prisma.user.findUnique({
//         where: { id },
//         select: {
//           id: true,
//           email: true,
//           tier: true,
//         },
//       });
//       return user ? { id: user.id, email: user.email, tier: user.tier } : null;
//     } catch (error) {
//       this.handlePrismaError(error, "Failed to fetch user profile");
//       return null;
//     }
//   }
//   async getUserByEmail(email: string): Promise<User | null> {
//     try {
//       const user = await prisma.user.findUnique({
//         where: { email },
//         include: { folders: true, tokens: true },
//       });
//       return user ? this.mapPrismaUserToUser(user) : null;
//     } catch (error) {
//       this.handlePrismaError(error, "Failed to fetch user by email");
//       return null;
//     }
//   }
//   async updateUser(
//     id: number,
//     data: Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "folders" | "tokens">>
//   ): Promise<User> {
//     try {
//       const updateData = { ...data };
//       if (data.password) {
//         updateData.password = await this.hashPassword(data.password);
//       }
//       const updatedUser = await prisma.user.update({
//         where: { id },
//         data: updateData,
//         include: { folders: true, tokens: true },
//       });
//       return this.mapPrismaUserToUser(updatedUser);
//     } catch (error) {
//       this.handlePrismaError(error, "Failed to update user");
//     }
//   }
//   async deleteUser(id: number): Promise<void> {
//     try {
//       await prisma.user.delete({
//         where: { id },
//       });
//     } catch (error) {
//       this.handlePrismaError(error, "Failed to delete user");
//     }
//   }
//   async validatePassword(user: User, password: string): Promise<boolean> {
//     return compare(password, user.password);
//   }
//   async updateUserTier(id: number, tier: UserTier): Promise<User> {
//     try {
//       const updatedUser = await prisma.user.update({
//         where: { id },
//         data: { tier },
//         include: { folders: true, tokens: true },
//       });
//       return this.mapPrismaUserToUser(updatedUser);
//     } catch (error) {
//       this.handlePrismaError(error, "Failed to update user tier");
//     }
//   }
//   private async hashPassword(password: string): Promise<string> {
//     return hash(password, UserService.SALT_ROUNDS);
//   }
//   private mapPrismaUserToUser(prismaUser: User): User {
//     return {
//       id: prismaUser.id,
//       email: prismaUser.email,
//       password: prismaUser.password,
//       tier: prismaUser.tier as UserTier,
//       folders: prismaUser.folders as Folder[],
//       tokens: prismaUser.tokens as Token[],
//       createdAt: prismaUser.createdAt,
//       updatedAt: prismaUser.updatedAt,
//     };
//   }
//   private handlePrismaError(error: unknown, message: string): never {
//     if (error instanceof Error) {
//       const prismaError = error as { code?: string };
//       if (prismaError.code === 'P2002') {
//         throw new Error("Unique constraint violation");
//       }
//       if (prismaError.code === 'P2025') {
//         throw new Error("Record not found");
//       }
//     }
//     console.error(error);
//     throw new Error(message);
//   }
// }
//# sourceMappingURL=userService.js.map