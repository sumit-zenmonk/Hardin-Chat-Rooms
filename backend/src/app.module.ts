import { MiddlewareConsumer, Module, NestModule, OnModuleDestroy, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DataSourceOptions } from 'typeorm';

// Common Module
import { AuthenticateMiddleware } from './common/infrastruture/middleware/authenticate.middleware';
import { createTransactionalDataSource } from './common/infrastruture/services/typeorm.transactional';
import { RabbitMQCommonModule } from './common/infrastruture/rabbit-mq/rabbit-mq.module';
import { SocketModule } from './common/infrastruture/socket/socket.module';

// User Module
import { userDataSource } from './module/auth-module/infrastructure/database/data-source';
import { UserRepository } from './module/auth-module/infrastructure/repository/user.repository';
import { JwtHelperService } from './module/auth-module/infrastructure/services/jwt.service';
import * as UserCronModule from './module/auth-module/infrastructure/cron/cron.module';
import { UserModule } from './module/auth-module/feature/user/user.module';
import { ChatRabbitMQModule } from './module/chat-module/infrastructure/rabbit-mq/rabbit-mq.module';
import { chatDataSource } from './module/chat-module/infrastructure/database/data-source';
import { RoomModule } from './module/chat-module/feature/room/room.module';
import { RoomMemberModule } from './module/chat-module/feature/room-member/room.module';

@Module({
  imports: [
    // common
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_REGISTER_SECRET,
      // signOptions: { expiresIn: '60m' },
    }),
    ScheduleModule.forRoot(),
    RabbitMQCommonModule,
    SocketModule,

    //User Modules
    TypeOrmModule.forRootAsync({
      name: process.env.DB_POSTGRES_USER_SCHEMA || 'user_schema',
      useFactory: () => ({
        ...userDataSource.options,
        retryAttempts: Number(process.env.DB_RETRY_ATTEMPTS) || 10,
        retryDelay: Number(process.env.DB_RETRY_DELAY) || 5000,
      }),
      dataSourceFactory: async (options) =>
        createTransactionalDataSource(
          process.env.DB_POSTGRES_USER_SCHEMA || 'user_schema',
          options as DataSourceOptions,
        ),
    }),
    UserModule,
    UserCronModule.CronModule,

    // Chat Modules
    ChatRabbitMQModule,
    TypeOrmModule.forRootAsync({
      name: process.env.DB_POSTGRES_CHAT_SCHEMA || 'chat_schema',
      useFactory: () => ({
        ...chatDataSource.options,
        retryAttempts: Number(process.env.DB_RETRY_ATTEMPTS) || 10,
        retryDelay: Number(process.env.DB_RETRY_DELAY) || 5000,
      }),
      dataSourceFactory: async (options) =>
        createTransactionalDataSource(
          process.env.DB_POSTGRES_CHAT_SCHEMA || 'chat_schema',
          options as DataSourceOptions,
        ),
    }),
    RoomModule,
    RoomMemberModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserRepository, JwtHelperService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .exclude(
        { path: '/user/login', method: RequestMethod.ALL },
        { path: '/user/register', method: RequestMethod.ALL },
        { path: '/room/public', method: RequestMethod.GET },
      )
      .forRoutes('/*path');
  }
}