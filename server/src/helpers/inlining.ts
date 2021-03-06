function findArgs(str: string, ind: number) : string{
  const argsBoundaries = [];
  let openCounter = 0;
  let closeCounter = 0;
  for (let i = ind; i<str.length; i++) {
    if (str[i] === "(") {
      if (openCounter === 0) {
        argsBoundaries.push(i);
      }
      openCounter++;
    } else if (str[i] === ")") {
      closeCounter++;
      if (closeCounter === openCounter) {
        argsBoundaries.push(i);
        break;
      }
    }
  };
  const res = str.slice(argsBoundaries[0], argsBoundaries[1]+1)
  return res;
}

function findName(str: string, ind: number) : string {
  let finish = 0;
  for (let i = ind; i<str.length; i++) {
    if (str[i] === "(") {
      finish = i;
      break;
    }
  }
  const functionDeclaration = str.slice(ind, finish);
  const name = functionDeclaration.replace(/\s\s+/g, ' ').split(' ');

  return name[name.length - 1] ? name[name.length - 1] : name[name.length - 2];
}

function replaceFunctionCall(str: string, ind: number) : any[]{
  const bodyBoundaries = [];
  let openCounter = 0;
  let closeCounter = 0;
  let args = findArgs(str, ind);
  let name = findName(str, ind); 
  for (let i = ind; i<str.length; i++) {
    if (str[i] === "{") {
      if (openCounter === 0) {
        bodyBoundaries.push(i);
      }
      openCounter++;
    } else if (str[i] === "}") {
      closeCounter++;
      if (closeCounter === openCounter) {
        bodyBoundaries.push(i);
        break;
      }
    }
  }
  const body = str.slice(bodyBoundaries[0], bodyBoundaries[1]+1);
  let iifeBody = `(function ${args} ${body})`;
  let changedString = str.slice(0, ind) + str.slice(bodyBoundaries[1]+2, str.length);
  return [name, iifeBody, changedString];
}


export function inline(code: string): string {
  let inlineables = 0;
  const re = /inlineable\s+function\s+.*\(.*\)/;
  let match;

  for (let i of code.matchAll(RegExp(re, 'g'))) {
      inlineables++;
  };
  
  for (let i = 0; i<inlineables; i++) {
    match = re.exec(code);
    let [name, iife, changedString] = replaceFunctionCall(code, match.index);
    code = changedString.replace(new RegExp(name, 'g'), iife);
  }

  const finalStr = code.replace(/\n\n+/g, '\n');

  return finalStr;
}
