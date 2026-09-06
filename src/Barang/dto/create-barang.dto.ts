import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBarangDto {
  @IsNotEmpty()
  nama: string;

  deskripsi: string;

  @IsOptional()
  harga?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stok?: number;

  @IsNotEmpty()
  kategori: string;
}