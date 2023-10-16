import { IsEmail, IsString } from 'class-validator';

export class CreateCompanyDTO {
    @IsString()
    companyName: string;
  
    @IsString()
    @IsEmail()
    email: string;
  
    @IsString()
    companyAddress: string;
  
    @IsString()
    yearFounded: string;
  
    @IsString()
    password: string;
  }