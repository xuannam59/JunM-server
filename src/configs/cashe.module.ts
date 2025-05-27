import { createKeyv, Keyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheableMemory } from "cacheable";

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const redisHost = configService.get<string>('REDIS_HOST');
                const redisPort = configService.get<number>('REDIS_PORT');
                const redisPassword = configService.get<string>('REDIS_PASSWORD');
                const redisUrl = `redis://:${redisPassword}@${redisHost}:${redisPort}`;

                return {
                    stores: [
                        new Keyv({
                            store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
                            namespace: 'junMusic'
                        }),
                        createKeyv(redisUrl),
                    ],
                    isGlobal: true
                };
            },
            inject: [ConfigService],
        }),
    ],
    exports: [CacheModule]
})
export class CacheRedisModule { }