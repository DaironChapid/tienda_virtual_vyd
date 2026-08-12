import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async crearProducto(data: any) {
    return this.prisma.producto.create({ data });
  }

  async obtenerProductos() {
    return this.prisma.producto.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async actualizarProducto(id: number, data: any) {
    return this.prisma.producto.update({ where: { id }, data });
  }

  async eliminarProducto(id: number) {
    return this.prisma.producto.delete({ where: { id } });
  }
}