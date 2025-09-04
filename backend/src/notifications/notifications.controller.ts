import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { NotificationData } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserNotifications(
    @Request() req,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.notificationsService.getUserNotifications(req.user.id, limitNum);
  }

  @Post('mark-read/:notificationId')
  @UseGuards(JwtAuthGuard)
  markAsRead(
    @Param('notificationId') notificationId: string,
    @Request() req,
  ) {
    return this.notificationsService.markNotificationAsRead(notificationId, req.user.id);
  }

  @Post('mark-all-read')
  @UseGuards(JwtAuthGuard)
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllNotificationsAsRead(req.user.id);
  }

  @Post(':notificationId/delete')
  @UseGuards(JwtAuthGuard)
  deleteNotification(
    @Param('notificationId') notificationId: string,
    @Request() req,
  ) {
    return this.notificationsService.deleteNotification(notificationId, req.user.id);
  }

  @Post('custom')
  @UseGuards(JwtAuthGuard)
  sendCustomNotification(
    @Body() notificationData: NotificationData,
    @Request() req,
  ) {
    // Ensure the notification is sent to the authenticated user
    notificationData.userId = req.user.id;
    return this.notificationsService.sendCustomNotification(notificationData);
  }
}
