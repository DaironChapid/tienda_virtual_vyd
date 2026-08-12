import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 importar

@Module({
  imports: [PrismaModule], // 👈 agregar aquí
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}