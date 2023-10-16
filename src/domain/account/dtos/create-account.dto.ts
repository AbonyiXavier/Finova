import { IsString } from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  companyId: string;
}
