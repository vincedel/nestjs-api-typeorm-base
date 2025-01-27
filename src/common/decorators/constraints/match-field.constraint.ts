import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class MatchFieldConstraint implements ValidatorConstraintInterface {
  validate(fieldValue: any, args: any) {
    const [relatedPropertyName] = args.constraints;
    const relatedPropertyValue = (args.object as any)[relatedPropertyName];
    return relatedPropertyValue === fieldValue;
  }

  defaultMessage(args: any) {
    return `The value does not match to the field ${args.constraints}.`;
  }
}

export function MatchField(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchFieldConstraint,
    });
  };
}
