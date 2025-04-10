import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
            type: "mysql",
            host: configService.getOrThrow("MYSQL_HOST"),
            port: configService.getOrThrow("MYSQL_PORT"),
            username: configService.getOrThrow("MYSQL_USERNAME"),
            password: configService.getOrThrow("MYSQL_PASSWORD"),
            database: configService.getOrThrow("MYSQL_DATABASE"),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true
        }),
        inject: [ConfigService]
    })]
})
export class DatabaseModule { }
