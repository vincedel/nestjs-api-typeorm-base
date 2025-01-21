export function getRepositoryMock<Entity>(dataProvider: Entity[] = []) {
  const data: Entity[] = [...dataProvider];
  console.log(data);

  return {
    findOne: jest.fn().mockImplementation((options: any) => {
      const whereArray = Array.isArray(options.where)
        ? options.where
        : [options.where];

      const entityFound = data.find((entity) => {
        return whereArray.some((whereClause) => {
          return Object.keys(whereClause).every(
            (field) => entity[field] === whereClause[field],
          );
        });
      });

      return entityFound ?? null;
    }),
    findOneBy: jest.fn().mockImplementation((options: any) => {
      const entityFound: Entity | undefined = data.find((entity) => {
        let result = true;
        for (const key in options) {
          result = result && entity[key] === options[key];
        }

        return result;
      });

      return entityFound ?? null;
    }),
  };
}
