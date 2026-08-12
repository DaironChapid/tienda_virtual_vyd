import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Get()
  obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  @Post()
  crear(@Body() body: { nombre: string; email: string; password: string; rol?: string }) {
    return this.usuariosService.crearUsuario(body);
  }

  @Put(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.usuariosService.actualizarUsuario(id, body);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.eliminarUsuario(id);
  }
}
