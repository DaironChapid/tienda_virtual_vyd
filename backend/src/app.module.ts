import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ProductosModule } from './productos/productos.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { HeroModule } from './hero/hero.module';
import { UploadModule } from './upload/upload.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';

@Module({
  imports: [ProductosModule, PrismaModule, AuthModule, UsuariosModule, HeroModule, UploadModule, ConfiguracionModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
