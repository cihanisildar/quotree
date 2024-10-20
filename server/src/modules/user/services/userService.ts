import { PrismaClient, User, UserTier } from "@prisma/client";
import { compare, hash } from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export class UserService {
  async createUser(
    email: string,
    password: string,
    tier: UserTier = UserTier.BASIC
  ): Promise<User> {
    const hashedPassword = await this.hashPassword(password);
    return prisma.user.create({
      data: { email, password: hashedPassword, tier },
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return compare(password, user.password);
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, SALT_ROUNDS);
  }
}
