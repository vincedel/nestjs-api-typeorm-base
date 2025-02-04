import {
  ArrayContains,
  DataSource,
  ILike,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { SortEnum } from '../enums/SortEnum.enum';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    mockDataSource = {
      getMetadata: jest
        .fn()
        .mockReturnValue({ columns: [{ propertyName: 'test' }], name: 'User' }),
    } as any;

    service = new (class extends DatabaseService {
      constructor() {
        super(mockDataSource);
      }
    })();
  });

  describe('getEntityMetadata', () => {
    it("should throw an error because we don't have metadata", () => {
      jest.spyOn(mockDataSource, 'getMetadata').mockReturnValue(null);

      expect(() => {
        service.getFindOptionsByQueryOptions(
          {
            page: 1,
            limit: 10,
            filter: [
              {
                test: {
                  operator: 'ilike',
                  value: '%test%',
                },
              },
            ],
          },
          User,
        );
      }).toThrow('Entity metadata not found for class User');
    });
  });

  describe('getFindOptionsByQueryOptions', () => {
    it('should return the correct limit and page options', () => {
      const queryOptions = {
        page: 3,
        limit: 30,
      };

      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 3,
          limit: 30,
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: queryOptions.limit * (queryOptions.page - 1),
        take: queryOptions.limit,
      });
    });

    it("should not return take option because it's less than 0", () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: -1,
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
      });
    });

    it('should return the correct sort options', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          sort: {
            test: SortEnum.Asc,
          },
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        order: {
          test: SortEnum.Asc,
        },
      });
    });

    it('should return the correct filter options', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'eq',
                value: 'test',
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: 'test',
          },
        ],
      });
    });

    it("should throw an error because the filter column doesn't exist", () => {
      expect(() => {
        service.getFindOptionsByQueryOptions(
          {
            page: 1,
            limit: 10,
            filter: [
              {
                testNotExist: {
                  operator: 'eq',
                  value: 'test',
                },
              },
            ],
          },
          User,
        );
      }).toThrow("Column testNotExist doesn't exist in User");
    });
  });

  describe('getWhereOptionByFilter', () => {
    it('should return the correct find options (eq)', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'eq',
                value: 'test',
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: 'test',
          },
        ],
      });
    });

    it('should return the correct find options (ne)', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'ne',
                value: 'test',
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: Not('test'),
          },
        ],
      });
    });

    it('should return the correct find options (gt)', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'gt',
                value: 10,
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: MoreThan(10),
          },
        ],
      });
    });

    it('should return the correct find options (gte)', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'gte',
                value: 10,
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: MoreThanOrEqual(10),
          },
        ],
      });
    });

    it('should return the correct find options (lt)', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'lt',
                value: 10,
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: LessThan(10),
          },
        ],
      });
    });

    it('should return the correct find options (lte)', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'lte',
                value: 10,
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: LessThanOrEqual(10),
          },
        ],
      });
    });

    it('should return the correct find options (like)', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'like',
                value: '%test%',
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: Like('%test%'),
          },
        ],
      });
    });

    it('should return the correct find options (ilike)', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'ilike',
                value: '%test%',
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: ILike('%test%'),
          },
        ],
      });
    });

    it('should return the correct find options (isNull)', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'isNull',
                value: null,
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: IsNull(),
          },
        ],
      });
    });

    it('should return the correct find options (isNotNull)', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'isNotNull',
                value: null,
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: Not(IsNull()),
          },
        ],
      });
    });

    it('should return the correct find options (inArray)', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'inArray',
                value: [1, 2, 3],
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: ArrayContains([1, 2, 3]),
          },
        ],
      });
    });

    it('should return the correct find options (notInArray)', () => {
      const findOptions = service.getFindOptionsByQueryOptions(
        {
          page: 1,
          limit: 10,
          filter: [
            {
              test: {
                operator: 'notInArray',
                value: [1, 2, 3],
              },
            },
          ],
        },
        User,
      );

      expect(findOptions).toStrictEqual({
        skip: 0,
        take: 10,
        where: [
          {
            test: Not(ArrayContains([1, 2, 3])),
          },
        ],
      });
    });

    it('should throw an error because the filter operator does not exist', () => {
      expect(() => {
        service.getFindOptionsByQueryOptions(
          {
            page: 1,
            limit: 10,
            filter: [
              {
                test: {
                  operator: 'operatorNotExist',
                  value: 2,
                },
              },
            ],
          },
          User,
        );
      }).toThrow("Filter operator 'operatorNotExist' doesn't exist");
    });
  });
});
