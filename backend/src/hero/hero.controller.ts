import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { HeroService } from './hero.service';

@Controller('hero-images')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  obtenerImagenes() {
    return this.heroService.obtenerImagenes();
  }

  @Post()
  agregarImagen(@Body('url') url: string) {
    return this.heroService.agregarImagen(url);
  }

  @Delete(':id')
  eliminarImagen(@Param('id') id: string) {
    return this.heroService.eliminarImagen(+id);
  }
}
