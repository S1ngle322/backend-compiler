import { Injectable } from '@nestjs/common';
import { DTO } from './app.controller';
import { check } from './helpers/checker';
import { deleteTypes } from './helpers/delete';
import { inline } from './helpers/inlining';
import { compute as computeProgram } from './helpers/compute';

@Injectable()
export class AppService {
  async compute(code: string): Promise<string> {
    try {
      const re = /inlineable/g;
      const codeToCheck = code.replace(re, '');
      const report = await check(codeToCheck);

      if (report.length !== 0) {
        return `${report[0].type} at line ${report[0].type}: ${report[0].message}`
      }
  
      const clearedCode = deleteTypes(code);
      const inlinedCode = inline(clearedCode);
      const computed = await computeProgram(inlinedCode);

      return computed;
    } catch (err) {
      return `Some error occured: ${err}`;
    }
  }
}
