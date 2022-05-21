import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

const baseRoute = '/api/v1';

export class DTO {
  code: string;
}

@Controller(baseRoute)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/check')
  async codeCheck(): Promise<string> {
    return await this.appService.codeChecker();
  }

  @Post('/compute')
  async compute(): Promise<string> {
    return await this.appService.compute();
  }
}
