import { NotificationsModule } from 'src/modules/notifications/notifications.module';

export const baseRoute = 'api/v1';

const notificationRoute = {
  path: baseRoute,
  module: NotificationsModule,
};

export const appRoutes = [
  notificationRoute
];
