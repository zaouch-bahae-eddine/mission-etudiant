import { Module, StandardSchemaValidationPipe } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppService } from './app.service.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { MissionsModule } from './missions/missions.module.js';
import { Mission } from './missions/mission.model.js';
import { UsersController } from './users/users.controller.js';
import { UsersModule } from './users/users.module.js';
import { StudentModule } from './student/student.module.js';
import { AuthModule } from './auth/auth.module.js';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
    imports: [
        // Distributed tracing, auto-correlated logs, request/job metrics, error
        // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
        // then run `npx @nestjs/observe link` to write your key pair into .env.
        ObserveModule.forRoot({
            appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
            appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
            serviceId: 'application',
        }),

        ConfigModule.forRoot(),

        //sequelize module for database connection
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'dev',
            password: 'dev123',
            database: 'nestjs_db',
            autoLoadModels: true,
            synchronize: true,
            models: [Mission],
        }),
        MissionsModule,
        UsersModule,
        StudentModule,
        AuthModule,
    ],
    providers: [
        { provide: APP_PIPE, useClass: StandardSchemaValidationPipe },
        AppService,
    ],
})
export class AppModule {}
