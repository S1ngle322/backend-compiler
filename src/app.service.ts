import { Injectable } from '@nestjs/common';
import { DTO } from './app.controller';

@Injectable()
export class AppService {
  async codeChecker(): Promise<string> {
    const data = this.getSample();
    let splited = data.code.split('\n').join('')
    //console.log(splited)
    const typesIndexes = [] // if 'type' word matched then store the index of the first letter
    const bracesIndexes = [] // find all pairs of braces

    for (let i = 0; i < splited.length + 4; i++) {
      if (
          splited[i] === 't'
          && splited[i + 1] === 'y'
          && splited[i + 2] === 'p'
          && splited[i + 3] === 'e'
      ) {
        typesIndexes.push(i)
        let j = i
        for (j; j < splited.length; j++) {
          if (splited[j] === '}' && splited[j + 1] === ';') {
            bracesIndexes.push(j + 1)
            break
          }
        }
      }
    }
    let result
    for (let i = 0; i < typesIndexes.length; i++) { // clearing from types
      result = splited.substring(typesIndexes[i], bracesIndexes[i])
      console.log(result)
    }

    //console.log(result)

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
