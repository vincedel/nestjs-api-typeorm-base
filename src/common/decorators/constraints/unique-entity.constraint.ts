import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';

export type IsUniqueOptions = {
  tableName: string;
  column: any;
};

@ValidatorConstraint({ async: true })
@Injectable()
export class isUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const { tableName, column }: IsUniqueOptions = args.constraints[0];

    const dataExist = await this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: value })
      .getExists();

    return !dataExist;
  }

  defaultMessage(args: ValidationArguments) {
    return `The ${args.property} is not unique.`;
  }
}

export function isUnique(
  options: IsUniqueOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: isUniqueConstraint,
    });
  };
}
