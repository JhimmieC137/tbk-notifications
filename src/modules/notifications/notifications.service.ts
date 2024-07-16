import { Injectable } from '@nestjs/common';
import { CreateNotificationDto, UpdateManyNotificationsDto, UpdateNotificationDto } from './dto/resquests.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { TokenBlacklist } from './entities/blacklist.entity';
import { NotificationQueryResponseDto } from './dto/responses.dto';
import { NOT_FOUND_404 } from 'src/helpers/exceptions/auth';

@Injectable()
export class NotificationsService {

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(TokenBlacklist)
    private blacklistRepository: Repository<TokenBlacklist>,
  ){}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification>  {
    try{
      const newNotification = new Notification();
      newNotification.user_id = createNotificationDto.user_id;
      newNotification.message = createNotificationDto.message;

      const newRservationObj = await this.notificationRepository.save(newNotification);

      return newRservationObj;

    } catch (error) {
      throw error
    }
  }

  async findAll( page: number, limit: number, search: string ): Promise<NotificationQueryResponseDto> {
    if (!page) page = 1;
    if (!limit) limit = 10;
    const offset = (page - 1) * limit
    try{
      const [notifications, totalCount] = await this.notificationRepository.findAndCount({
        where: {
          user_id: search
        },
        skip: offset,
        take: limit
      }) 

      return {
        notifications,
        totalCount,
        page,
      }
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string, user_id: string): Promise<Notification>{
    try{
      const notificationObj = await this.notificationRepository.findOne({
        where: {id, user_id}
      })

      if (!notificationObj) {
        throw new NOT_FOUND_404("Notification not found");
      }
      // else if (notificationObj && !notificationObj.profile.is_active) {
      //   throw new BAD_REQUEST_400("notification has been deactivated");
      // }


      return notificationObj

    } catch (error) {
      throw error 
    }
  }

  async update(id: string, user_id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      
      const notificationObj = await this.notificationRepository.findOne({
        where: {user_id}
      })

      if (!notificationObj) {
        throw new NOT_FOUND_404("Notification not found");
      }
      // else if (notificationObj && !notificationObj.profile.is_active) {
      //   throw new BAD_REQUEST_400("notification has been deactivated");
      // }

      await this.notificationRepository.update( id, {
        ...updateNotificationDto
      });
      

      const updatednotificationObj = await this.notificationRepository.findOne({
        where: {id}
      });

      return updatednotificationObj;

    } catch (error) {
      throw error
    }
  }

  async updateMany(user_id: string, updateManyNotificationsDto: UpdateManyNotificationsDto) {
    try {
      for (const notification of updateManyNotificationsDto.notifications) {
          const notificationObj = await this.notificationRepository.findOne({
          where: {user_id}
        })

        if (notificationObj) {
          await this.notificationRepository.update( notificationObj.id, {
            ...updateManyNotificationsDto
          });
        }
      }

    } catch (error) {
      throw error
    }
  }

  async remove(user_id: string, notifictaion_id: string) {
    try {
      
      const notificationObj = await this.notificationRepository.findOne({
        where: {
          id: notifictaion_id,
          user_id,
        }
      })

      if (!notificationObj) {
        throw new NOT_FOUND_404("Notification not found");
      }
      // else if (notificationObj && !notificationObj.profile.is_active) {
      //   throw new BAD_REQUEST_400("notification has been deactivated");
      // }

      await this.notificationRepository.remove(notificationObj);

    } catch (error) {
      throw error
    }
  }

  async blacklistToken(token: string) {
    try {

      const blackToken = await this.blacklistRepository.findOne({
        where: {token}
      });
    
      if (!blackToken) {
        return "Token blacklisted already";
      };

      const newBlackToken = new TokenBlacklist();
      newBlackToken.token = token;
  
      await this.blacklistRepository.save(newBlackToken);
      
      return "Token blacklisted successfully"
    } catch (error) {
      throw error
    }
  }

  async checkBlacklist(token: string): Promise<Boolean> {
    try{
      const blackToken = await this.blacklistRepository.findOne({
        where: {token}
      });
      
      if (!blackToken) {
        return false;
      };

      return true;
    } catch (error) {
      throw error;
    }

  };
}
