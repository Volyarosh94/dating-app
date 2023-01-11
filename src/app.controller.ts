import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    type: String,
  })
  @ApiOperation({
    summary: 'Check server health status',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
