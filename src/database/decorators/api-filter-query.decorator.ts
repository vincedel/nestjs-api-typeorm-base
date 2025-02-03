import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SortEnum } from '../enums/SortEnum.enum';
import { FilterEnum } from '../enums/FilterEnum.enum';

export function ApiFilterQuery() {
  return applyDecorators(
    // ApiExtraModels(filterQuery),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of elements per page',
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      style: 'deepObject',
      explode: true,
      type: 'object',
      description: 'Sort criteria',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'string',
          enum: Object.values(SortEnum),
          example: Object.values(SortEnum).join('|'),
        },
      },
    }),
    ApiQuery({
      name: 'filter',
      required: false,
      style: 'deepObject',
      description: 'Filter criteria',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                columnName: {
                  type: 'object',
                  properties: {
                    operator: {
                      type: 'string',
                      enum: Object.values(FilterEnum),
                      example: Object.values(FilterEnum).join('|'),
                    },
                    value: {
                      example: '%John%',
                    },
                  },
                },
              },
              required: ['key', 'operator', 'value'],
            },
          },
        },
      },
    }),
  );
}
