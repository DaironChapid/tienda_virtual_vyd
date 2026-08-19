import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}

  async obtenerImagenes() {
    return this.prisma.heroImage.findMany({ orderBy: { id: 'asc' } });
  }

  async agregarImagen(url: string) {
    return this.prisma.heroImage.create({ data: { url } });
  }

  async eliminarImagen(id: number) {
    return this.prisma.heroImage.delete({ where: { id } });
  }
}
