function deleteUnions(code: string): string {
    return code.replace(/type .*=(.*[\|\&][\s\S]*?)*;/g, '');
}

function deleteTypeDeclarations(code: string): string {
    const types = [];
    for (let i of code.matchAll(/\stype /g)) {
        types.push(i.index + 1);
    };

    let newCode = code.slice();
    const clear = [];

    for (let i = 0; i < types.length; i++) {
        const startIndex = types[i];
        let index = startIndex + 1;

        while (code[index] !== '{') {
            index++;
        }

        const stack = [code[index]];

        while (stack.length !== 0) {
            index++;
            if (code[index] === '{') {
                stack.push(code[index]);
            } else if (code[index] === '}') {
                stack.pop();
            }
        }

        const endIndex = index + 1;

        clear.push([startIndex, endIndex]);
    }

    clear.reverse();

    for (let i = 0; i < clear.length; i++) {
        const types = code.slice(clear[i][0], clear[i][1] + 1);
        newCode = newCode.replace(types, '');
    }

    return newCode;
}

function deleteTypeVars(code: string): string {
    const matches = code.matchAll(/((let)|(const)) .*:/g);

    let newCode = code.slice();
    const clear = [];

    for (let match of matches) {
        let index = match.index;
        while (code[index] !== ':') {
            index++;
        }
        const startIndex = index;
        while (code[index] !== '=') {
            index++;
        }
        const endIndex = index;

        clear.push([startIndex, endIndex]);
    }

    clear.reverse();

    for (let i = 0; i < clear.length; i++) {
        const types = code.slice(clear[i][0], clear[i][1]);
        newCode = newCode.replace(types, ' ');
    }

    return newCode;
}

function deleteTypeFunctions(code: string): string {
    const matches = code.matchAll(/function .*:/g);

    let newCode = code.slice();
    const clear = [];

    for (let match of matches) {
        let index = match.index;
        while (code[index] !== '{') {
            while (code[index] !== ':' && code[index] !== '{') {
                if (code[index] === '{') {
                    break;
                }
                index++;
            }
            const startIndex = index;
            while (code[index] !== ',' && code[index] !== ')' && code[index] !== '{') {
                index++;
            }

            const endIndex = index;
    
            clear.push([startIndex, endIndex]);
        }
    }

    clear.reverse();

    for (let i = 0; i < clear.length; i++) {
        const types = code.slice(clear[i][0], clear[i][1]);
        newCode = newCode.replace(types, '');
    }

    return newCode;
}

export function deleteTypes(code: string): string {
    const unions = deleteUnions(code);
    const types = deleteTypeDeclarations(unions);
    const vars = deleteTypeVars(types);
    const func = deleteTypeFunctions(vars);

    return func;
}
