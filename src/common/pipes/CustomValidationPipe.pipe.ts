import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationError, ValidatorOptions } from 'class-validator';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor(private reflector: Reflector) {
    super({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const result = errors.map((error: ValidationError) => {
          if (error.constraints) {
            return {
              property: error.property,
              errors: Object.values(error.constraints),
            };
          }
        });
        return new BadRequestException(result);
      },
    });
  }

  getDefaultValidatorOptions(): Partial<ValidatorOptions> {
    return {};
  }

  async transform(value: any, metadata: any) {
    const routeOptions = this.reflector.get<Partial<ValidatorOptions>>(
      'validation:options',
      metadata?.metatype,
    );
    const originalValidatorOptions: ValidatorOptions = Object.assign(
      this.getDefaultValidatorOptions(),
      this.validatorOptions,
    );

    if (routeOptions) {
      this.validatorOptions = { ...this.validatorOptions, ...routeOptions };
    }
    try {
      const result = super.transform(value, metadata);
      if (routeOptions) {
        this.validatorOptions = originalValidatorOptions;
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
