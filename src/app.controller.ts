import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseMessage } from './decorators/customize';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ResponseMessage("Get Hello World")
  getHello(): string {
    return this.appService.getHello();
  }
}
