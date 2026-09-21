import { IsBoolean, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsBoolean()
  isRead: boolean;

}
