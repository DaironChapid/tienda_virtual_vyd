import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configService: ConfiguracionService) {}

  @Get()
  obtenerTodas() {
    return this.configService.obtenerTodas();
  }

  @Get(':clave')
  obtenerConfiguracion(@Param('clave') clave: string) {
    return this.configService.obtenerConfiguracion(clave);
  }

  @Put('bulk')
  actualizarBulk(@Body() data: Record<string, string>) {
    return this.configService.actualizarBulk(data);
  }

  @Put(':clave')
  actualizarConfiguracion(@Param('clave') clave: string, @Body('valor') valor: string) {
    return this.configService.actualizarConfiguracion(clave, valor);
  }
}
