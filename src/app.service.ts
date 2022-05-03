import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async codeChecker(): Promise<string> {
    return 'Checking syntax';
  }

  async compute (): Promise<string> {
    return 'Code submitted for computing'
  }
}
