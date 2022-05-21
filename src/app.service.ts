import { Injectable } from '@nestjs/common';
import { DTO } from './app.controller';

@Injectable()
export class AppService {
  async codeChecker(): Promise<string> {
    const data = this.getSample();
    let splited = data.code.split('};').join('')
    console.log(splited)

    // let splited2 = []
    // for (let i = 0; i < splited.length; i++) {
    //   if (splited[i].startsWith('type')) {
    //     delete splited[i]
    //   }
    // }

    //console.log(splited)
    //console.log(splited2)
    // for (let i = 0; i < splited2.length; i++) {
    //   if (splited2[i].startsWith('type')) {
    //     delete splited2[i]
    //   }
    // }

    //console.log(splited2)
    return 'Checking syntax';
  }

  async compute(): Promise<string> {
    return 'Code submitted for computing';
  }

  private getSample() {
    const codeFrom: DTO = {
      code:
        'type Job = {\n' +
        '  position: string;\n' +
        '  experience: number;\n' +
        '};\n' +
        '\n' +
        'type UsualFullName = {\n' +
        '  name: string;\n' +
        '  surname: string;\n' +
        '};\n' +
        '\n' +
        'type RussianFullName = {\n' +
        '  name: string;\n' +
        '  surname: string;\n' +
        '  patronic: string;\n' +
        '};\n' +
        '\n' +
        'type FullName = UsualFullname | RussianFullName;\n' +
        '\n' +
        'type User = FullName & Job;\n' +
        '\n' +
        'inlineable function sayHello() {\n' +
        '  console.log("Hello!");\n' +
        '}\n' +
        '\n' +
        'let user: User = {\n' +
        '  name: "Daniel",\n' +
        '  surname: "Leinad",\n' +
        '  position: "Fullstack web developer",\n' +
        '  experience: 4\n' +
        '};\n' +
        '\n' +
        'sayhello();\n' +
        '\n' +
        'let fullText: string = "My name is" + user.name + user.surname + "and I have been working as a " + user.position + " for " + String(user.experience) + " years."',
    };
    return codeFrom
  }
}
