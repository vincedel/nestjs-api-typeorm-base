import { FilterQueryOptionsDto } from '../dto/filter-query-options.dto';
import {
  ArrayContains,
  DataSource,
  EntityMetadata,
  FindManyOptions,
  ILike,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { FilterEnum } from '../enums/FilterEnum.enum';
import { ArrayNotContains, IsNotEmpty } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export abstract class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  getFindOptionsByQueryOptions<T>(
    queryOptions: FilterQueryOptionsDto,
    entityClass: new () => T,
  ): FindManyOptions {
    const findOptions: FindManyOptions = {};
    const { page, limit, sort, filter } = queryOptions;

    if (limit >= 0) {
      findOptions.take = limit;
    }

    if (page) {
      findOptions.skip = (page - 1) * limit;
    }

    if (sort) {
      findOptions.order = sort;
    }

    if (filter) {
      const whereOptions: FindOptionsWhere<T>[] = [];
      const entityMetadata: EntityMetadata =
        this.getEntityMetadata(entityClass);

      filter.forEach((andFilter) => {
        const andWhereOptions: FindOptionsWhere<T> = {};

        for (const [columnName, value] of Object.entries(andFilter)) {
          if (
            !entityMetadata.columns.some(
              (col) => col.propertyName === columnName,
            )
          ) {
            throw new BadRequestException(
              `Column ${columnName} doesn't exist in ${entityMetadata.name}`,
            );
          }
          andWhereOptions[columnName] = this.getWhereOptionByFilter(value);
        }

        whereOptions.push(andWhereOptions);
      });

      findOptions.where = whereOptions;
    }

    return findOptions;
  }

  private getWhereOptionByFilter(filterOption) {
    switch (filterOption.operator) {
      case FilterEnum.EQ: {
        return filterOption.value;
      }
      case FilterEnum.NE: {
        return Not(filterOption.value);
      }
      case FilterEnum.GT: {
        return MoreThan(filterOption.value);
      }
      case FilterEnum.GTE: {
        return MoreThanOrEqual(filterOption.value);
      }
      case FilterEnum.LT: {
        return LessThan(filterOption.value);
      }
      case FilterEnum.LTE: {
        return LessThanOrEqual(filterOption.value);
      }
      case FilterEnum.LIKE: {
        return Like(filterOption.value);
      }
      case FilterEnum.ILIKE: {
        return ILike(filterOption.value);
      }
      case FilterEnum.IS_NULL: {
        return IsNull();
      }
      case FilterEnum.IS_NOT_NULL: {
        return IsNotEmpty();
      }
      case FilterEnum.IN_ARRAY: {
        return ArrayContains(filterOption.value);
      }
      case FilterEnum.NOT_IN_ARRAY: {
        return ArrayNotContains(filterOption.value);
      }
    }

    throw new BadRequestException(
      `Filter operator '${filterOption.operator}' doesn't not exist`,
    );
  }

  private getEntityMetadata<T>(entityClass: new () => T): EntityMetadata {
    const metadata = this.dataSource.getMetadata(entityClass);
    if (!metadata) {
      throw new BadRequestException(
        `Entity metadata not found for class ${entityClass.name}`,
      );
    }
    return metadata;
  }
}
