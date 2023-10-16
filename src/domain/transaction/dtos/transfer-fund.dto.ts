import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TransferFundDTO {
  @IsString()
  accountNumber: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  message?: string;
}
