import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(nombre: string, email: string, password: string) {
    // Verificar si el email ya existe
    const existe = await this.prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      throw new ConflictException('Este correo ya está registrado.');
    }

    const hash = await bcrypt.hash(password, 10);
    const usuario = await this.prisma.usuario.create({
      data: { nombre, email, password: hash },
    });

    const { password: _, ...resultado } = usuario;
    return resultado;
  }

  async login(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    const { password: _, ...resultado } = usuario;
    return resultado;
  }
}
