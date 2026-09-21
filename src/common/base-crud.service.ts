import { NotFoundException } from '@nestjs/common';

export interface CrudDelegate<T> {
  create(args: { data: any }): Promise<T>;
  findMany(args?: { skip?: number; take?: number }): Promise<T[]>;
  count(): Promise<number>;
  findUnique(args: { where: { id: number } }): Promise<T | null>;
  update(args: { where: { id: number }; data: any }): Promise<T>;
  delete(args: { where: { id: number } }): Promise<T>;
}

export interface PaginationParams {
  skip?: number;
  take?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
}

/**
 * Shared CRUD behavior for every generated entity service.
 * Generated services extend this and pass their own Prisma delegate —
 * new entities get create/findAll/findOne/update/remove for free, and this
 * class is the only place that logic needs to change for every entity at once.
 */
export abstract class BaseCrudService<T, CreateDto = any, UpdateDto = any> {
  protected constructor(protected readonly delegate: CrudDelegate<T>) {}

  async create(dto: CreateDto): Promise<T> {
    return this.delegate.create({ data: dto });
  }

  async findAll(params: PaginationParams = {}): Promise<PaginatedResult<T>> {
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const [data, total] = await Promise.all([
      this.delegate.findMany({ skip, take }),
      this.delegate.count(),
    ]);
    return { data, total, skip, take };
  }

  async findOne(id: number): Promise<T> {
    const record = await this.delegate.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Record with id ${id} not found`);
    }
    return record;
  }

  async update(id: number, dto: UpdateDto): Promise<T> {
    await this.findOne(id);
    return this.delegate.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<T> {
    await this.findOne(id);
    return this.delegate.delete({ where: { id } });
  }
}
