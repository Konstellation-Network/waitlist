import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export const INTENTS = ['building', 'using', 'node', 'curious'] as const;
export type Intent = (typeof INTENTS)[number];

export class SurveyDto {
  @IsIn(INTENTS)
  intent!: Intent;

  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  chainsUsed!: string[];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  firstThing?: string;
}
