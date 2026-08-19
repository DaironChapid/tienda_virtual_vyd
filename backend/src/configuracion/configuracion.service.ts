import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConfiguracionService {
  constructor(private prisma: PrismaService) {}

  async obtenerConfiguracion(clave: string) {
    const conf = await this.prisma.configuracion.findUnique({
      where: { clave },
    });
    if (!conf && clave === 'mostrar_carrusel') {
      return { clave, valor: 'true' };
    }
    return conf;
  }

  async obtenerTodas() {
    const records = await this.prisma.configuracion.findMany();
    const configMap: Record<string, string> = {};
    records.forEach(r => {
      configMap[r.clave] = r.valor;
    });
    // Ensure default fallback
    if (configMap['mostrar_carrusel'] === undefined) {
      configMap['mostrar_carrusel'] = 'true';
    }
    return configMap;
  }

  async actualizarConfiguracion(clave: string, valor: string) {
    return this.prisma.configuracion.upsert({
      where: { clave },
      update: { valor },
      create: { clave, valor },
    });
  }

  async actualizarBulk(data: Record<string, string>) {
    const transactions = Object.entries(data).map(([clave, valor]) => {
      return this.prisma.configuracion.upsert({
        where: { clave },
        update: { valor },
        create: { clave, valor },
      });
    });
    await this.prisma.$transaction(transactions);
    return { success: true };
  }
}
