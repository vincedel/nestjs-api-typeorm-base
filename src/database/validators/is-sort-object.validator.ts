import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { SortEnum } from '../enums/SortEnum.enum';

export function IsSortObject(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSortObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'object' || value === null) {
            return false;
          }

          const allowedValues: string[] = Object.values(SortEnum);
          return Object.values(value).every((val: string) =>
            allowedValues.includes(val),
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `Each sort value must be one of the following: ${Object.values(SortEnum).join(', ')}`;
        },
      },
    });
  };
}
