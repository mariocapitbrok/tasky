import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  list(userId: number) {}
  create(userId: number, dto: CreateTaskDto) {}
  update(userId: number, Id: number, dto: UpdateTaskDto) {}
  remove(userId: number, id: number) {}
}
