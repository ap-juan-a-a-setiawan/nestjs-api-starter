import { RepositoryBase } from "../../App/abstracts/repository.base";
import { EntityRepository } from "typeorm";
import { Barang } from "../entities/barang.entity";

@EntityRepository(Barang)
export class BarangRepository extends RepositoryBase<Barang> {
  // 
}