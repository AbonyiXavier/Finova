import { IsEnum, IsString } from 'class-validator';
import { CardType } from '../enums';

export class CreateCardDTO {

  @IsEnum(CardType)
  cardType: CardType;

  @IsString()
  accountId: string;

}
