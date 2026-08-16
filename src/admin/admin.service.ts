import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: { roles: { include: { role: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    const sanitizedUsers = users.map((user) => this.excludePassword(user));

    return {
      data: sanitizedUsers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: { include: { role: true } } },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.excludePassword(user);
  }

  async updateUserStatus(id: string, dto: UpdateUserStatusDto) {
    await this.getUserById(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status: dto.status },
    });

    return this.excludePassword(updatedUser);
  }

  async updateUserRoles(id: string, dto: UpdateUserRolesDto) {
    await this.getUserById(id);

    await this.prisma.userRole.deleteMany({ where: { userId: id } });

    const roles = await this.prisma.role.findMany({
      where: { name: { in: dto.roles } },
    });

    await this.prisma.userRole.createMany({
      data: roles.map((role) => ({
        userId: id,
        roleId: role.id,
      })),
    });

    return this.getUserById(id);
  }

  async deleteUser(id: string) {
    await this.getUserById(id);
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  private excludePassword<T extends Record<string, any>>(
    user: T,
  ): Omit<T, 'password' | 'refreshToken'> {
    const { password, refreshToken, ...rest } = user;
    return rest;
  }
}
