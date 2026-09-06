import { Module } from '@nestjs/common';
import { BarangController } from './controllers/barang.controller';
import { BarangService } from './services/barang.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarangRepository } from './repositories/barang.repository';

@Module({
    imports: [TypeOrmModule.forFeature([BarangRepository])],
    controllers: [BarangController],
    providers: [BarangService],
    exports: [BarangService],
})

export class BarangModule { }