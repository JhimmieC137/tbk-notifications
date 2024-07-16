import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, NotificationQueryDto, UpdateManyNotificationsDto, UpdateNotificationDto } from './dto/resquests.dto';
import { CustomInfoResDto, CustomListResDto, CustomResDto } from 'src/helpers/schemas.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as reqType from 'express';
import { FORBIDDEN_403 } from 'src/helpers/exceptions/auth';
import { EventPattern, Payload } from '@nestjs/microservices';

@ApiTags('Notification')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly customResDto: CustomResDto,
    private readonly customInfoResDto: CustomInfoResDto,
    private readonly customListResDto: CustomListResDto,
  ) {}

  async checkBlacklist(req: reqType.Request) {
    try {
      const isBlacklisted = await this.notificationsService.checkBlacklist(req.headers.authorization.split(' ')[1])
      if (isBlacklisted) {
        throw new FORBIDDEN_403("Invalid token")
      }
    } catch (error) {
      throw error
    }

  }

  @EventPattern('create-notification')
  async create(@Payload() createNotificationDto: string): Promise<CustomResDto> {
    const response = this.customResDto;
    response.results = await this.notificationsService.create(JSON.parse(createNotificationDto));
    response.message = "Notification created successfully"

    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: reqType.Request, @Query() notificationQueryDto: NotificationQueryDto): Promise<CustomListResDto> {
    await this.checkBlacklist(req);
    const page = Number(notificationQueryDto?.page) ?? 1;
    const limit = Number(notificationQueryDto?.limit) ?? 10;

    const notifications =  await this.notificationsService.findAll(page, limit, req.user['id']);
    
    const response = this.customListResDto;
    response.results = notifications.notifications;
    response.total_count = notifications.totalCount;
    response.count = response.results.length;
    response.page = notifications.page
    response.message = 'Notifications retrieved successfully'
    response.next_page = notifications.page + 1
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req: reqType.Request, @Param('id') id: string): Promise<CustomResDto> {
    await this.checkBlacklist(req);
    const notifications =  await this.notificationsService.findOne(id, req.user['id']);
    
    const response = this.customResDto;
    response.results = notifications;
    response.message = 'Notification retrieved successfully'
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Request() req: reqType.Request, @Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto): Promise<CustomResDto> {
    await this.checkBlacklist(req);
    const notification =  await this.notificationsService.update(id, req.user['id'], updateNotificationDto);
    
    const response = this.customResDto;
    response.results = notification;
    response.message = 'Notification updated successfully'
    return response;
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateMany(@Request() req: reqType.Request, @Body() updateManyNotificationDto: UpdateManyNotificationsDto): Promise<CustomInfoResDto> {
    await this.checkBlacklist(req);
    // await this.notificationsService.updateMany(id, updateNotificationDto);

    const response = this.customInfoResDto;
    response.message = "Notifications updated successfully";
    return response;
  }

  
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // async remove(@Request() req: reqType.Request, @Param('id') id: string): Promise<CustomInfoResDto> {
  //   await this.checkBlacklist(req);
  //   await this.notificationsService.remove(id);
  //   const response = this.customInfoResDto;
  //   response.info = 'Deleted successfully';
  //   return response;
  // }

  // @EventPattern('blacklist_token')
  // async handleBlacklistToken(@Payload() token: string): Promise<CustomInfoResDto> {
  //   const response = this.customInfoResDto; 
  //   response.message = await this.notificationsService.blacklistToken(token);
  //   return response
  // }
}
