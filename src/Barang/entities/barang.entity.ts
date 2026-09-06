import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '../../App/abstracts/entity.base';

@Entity('barang')
export class Barang extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: string;

  @Column()
  deskripsi: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  harga: string;

  @Column({ type: 'int', default: 0 })
  stok: number;

  @Column()
  kategori: string;

  @Column({ type: 'enum', enum: ['aktif', 'non-aktif'], default: 'aktif' })
  status: string;
}