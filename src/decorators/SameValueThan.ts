import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ClassConstructor } from 'class-transformer';

@ValidatorConstraint({ async: true })
export class SameValueThanConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments): boolean {
    const [relatedProperty] = args.constraints;

    return confirmPassword === relatedProperty(args.object);
  }

  defaultMessage(): string {
    return "new password and confirm new password don't match";
  }
}

export function SameValueThan<T>(
  type: ClassConstructor<T>,
  property: (object: T) => any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: SameValueThanConstraint,
    });
  };
}
