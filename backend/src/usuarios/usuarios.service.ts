import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async obtenerTodos() {
    const usuarios = await this.prisma.usuario.findMany({ orderBy: { createdAt: 'desc' } });
    return usuarios.map(({ password, ...rest }) => rest);
  }

  async crearUsuario(data: { nombre: string; email: string; password: string; rol?: string }) {
    const existe = await this.prisma.usuario.findUnique({ where: { email: data.email } });
    if (existe) throw new ConflictException('Este correo ya está registrado.');
    const hash = await bcrypt.hash(data.password, 10);
    const usuario = await this.prisma.usuario.create({
      data: { ...data, password: hash },
    });
    const { password: _, ...resultado } = usuario;
    return resultado;
  }

  async actualizarUsuario(id: number, data: { nombre?: string; email?: string; password?: string; rol?: string }) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado.');
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    const updated = await this.prisma.usuario.update({ where: { id }, data: updateData });
    const { password: _, ...resultado } = updated;
    return resultado;
  }

  async eliminarUsuario(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado.');
    await this.prisma.usuario.delete({ where: { id } });
    return { message: 'Usuario eliminado correctamente.' };
  }
}
