import {
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
  IsObject,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ValidationOptions } from '../../common/decorators/validation-options.decorator';
import { IsSortObject } from '../validators/is-sort-object.validator';
import { SortEnum } from '../enums/SortEnum.enum';

export class FilterItem {
  @IsString()
  @IsNotEmpty()
  operator: string;

  @IsNotEmpty()
  value: any;
}

class FilterEntry {
  [key: string]: FilterItem;
}

@ValidationOptions({
  whitelist: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
})
export class FilterQueryOptionsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value !== null) {
      try {
        value = JSON.parse(value);
      } catch {
        return {};
      }
    }
    if (typeof value === 'object' && value !== null) {
      const transformedValue: Record<string, string> = {};
      for (const [key, val] of Object.entries(value)) {
        transformedValue[key] = String(val).toLowerCase();
      }
      return transformedValue;
    }
    return {};
  })
  @IsSortObject()
  sort?: Record<string, SortEnum>;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  })
  @IsArray()
  @Type(() => FilterEntry)
  filter?: FilterEntry[];
}
