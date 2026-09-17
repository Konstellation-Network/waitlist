import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { ERRORS } from '../../constants/copy';

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;

const UTM_KEY_SET: ReadonlySet<string> = new Set(UTM_KEYS);

/** Plain object whose keys are utm_* and whose values are short strings. */
function IsUtmRecord(options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isUtmRecord',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: unknown): boolean {
          if (
            typeof value !== 'object' ||
            value === null ||
            Array.isArray(value)
          )
            return false;
          return Object.entries(value).every(
            ([k, v]) =>
              UTM_KEY_SET.has(k) && typeof v === 'string' && v.length <= 200,
          );
        },
        defaultMessage: () => 'utm must be an object of utm_* string values',
      },
    });
  };
}

export class JoinDto {
  @IsEmail({}, { message: ERRORS.invalidEmail })
  @MaxLength(254, { message: ERRORS.invalidEmail })
  email!: string;

  @IsString()
  @Length(1, 2048)
  turnstileToken!: string;

  @IsOptional()
  @IsUtmRecord()
  utm?: Utm;
}
