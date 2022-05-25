import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

const baseRoute = '/api/v1';

export class DTO {
  code: string;
}

@Controller(baseRoute)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/compute')
  async compute(@Body() code: DTO): Promise<string> {
    return await this.appService.compute(code.code);
  }
}
