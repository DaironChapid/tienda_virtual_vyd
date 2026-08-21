import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({
      data: createCategoriaDto,
    });
  }

  async findAll() {
    return this.prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
    });
    if (!categoria) {
      throw new NotFoundException(`Categoria #${id} no encontrada`);
    }
    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return this.prisma.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });
  }

  async remove(id: number) {
    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}
