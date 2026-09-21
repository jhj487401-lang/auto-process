import { IsBoolean, IsDateString, IsInt, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  invoiceNumber: string;

  @IsInt()
  totalAmount: number;

  @IsBoolean()
  isPaid: boolean;

  @IsDateString()
  issuedAt: Date;

}
