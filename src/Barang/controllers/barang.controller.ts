import { Controller, Get, Post, Param, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { BarangService } from '../services/barang.service';
import { CreateBarangDto } from '../dto/create-barang.dto';
import { JwtAuthGuard } from '../../Auth/guards/jwt-auth.guard';

@Controller('barang')
@UseGuards(JwtAuthGuard)
export class BarangController {
  constructor(private readonly barangService: BarangService) { }

  @Get()
  getAll() {
    return this.barangService.getAll();
  }

  @Get(':id')
  getById(@Param() params) {
    return this.barangService.getById(params.id);
  }

  @Post()
  async create(@Body() barangData: CreateBarangDto) {
    return {
      statusCode: HttpStatus.OK,
      barang: await this.barangService.create(barangData),
    };
  }
}