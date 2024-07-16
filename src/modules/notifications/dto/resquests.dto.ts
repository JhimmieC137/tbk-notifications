import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateNotificationDto {
    @ApiProperty({
      required: true,
    })
    user_id: String;
    
    @ApiProperty({
      required: true,
    })
    message: String;
  }
  
  export class UpdateNotificationDto extends PickType(CreateNotificationDto, ['user_id'] as const) {
    // @ApiProperty({
    //   required: true,
    // })
    // status: String;
  }
  
export class UpdateManyNotificationsDto extends UpdateNotificationDto {
  @ApiProperty({
    required: true,
  })
  notifications: string[];
}

export class paginationDto {
    @ApiPropertyOptional({
      default: 1
    })
    @Transform(({ value }) => (value ? Number(value) : 1))
    @IsNumber()
    @IsOptional()
    page?: number;
    
    @ApiPropertyOptional({
      default: 10
    })
    @Transform(({ value }) => (value ? Number(value) : 1))
    @IsNumber()
    @IsOptional()
    limit?: number;
  }
  
  export class NotificationQueryDto extends paginationDto {
    @ApiProperty({
      required:  false,
    })
    search: string = null;
  }