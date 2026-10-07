import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Barang } from '../entities/barang.entity';
import { getRepository } from 'typeorm';
import { CreateBarangDto } from '../dto/create-barang.dto';
import { BarangRepository } from '../repositories/barang.repository';

@Injectable()
export class BarangService {
  constructor(
    @InjectRepository(Barang)
    private readonly barangRepository: BarangRepository
  ) { }

  getAll(): Promise<Barang[]> {
    return this.barangRepository.find();
  }

  getById(id: string): Promise<Barang> {
    return this.barangRepository.findOne(id);
  }

  async create(data: CreateBarangDto): Promise<Barang> {
    const qb = await getRepository(Barang)
      .createQueryBuilder('barang')
      .where('barang.nama = :nama', { nama: data.nama });

    const barang = await qb.getOne();

    if (barang) {
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        errors: ['Nama barang must be unique.'],
        error: 'Bad Request'
      }, HttpStatus.BAD_REQUEST);
    }

    const entity = {
      ...data,
      ...(data.harga !== undefined ? { harga: String(data.harga) } : {}),
    };

    return this.barangRepository.save(entity);
  }
}