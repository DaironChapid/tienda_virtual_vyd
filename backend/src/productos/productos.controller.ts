import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private productosService: ProductosService) {}

  @Post()
  crear(@Body() body: any) {
    return this.productosService.crearProducto(body);
  }

  @Get()
  obtener() {
    return this.productosService.obtenerProductos();
  }

  @Put(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.productosService.actualizarProducto(id, body);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.eliminarProducto(id);
  }
}