import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  list(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
  create(userId: number, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: { ...dto, userId },
    });
  }
  update(userId: number, id: number, dto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }
  remove(userId: number, id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}
