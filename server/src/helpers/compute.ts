// @ts-nocheck
export function compute(theInstructions: string) {
    console.stdlog = console.log.bind(console);
    console.logs = [];
    console.log = function(){
        console.logs.push(Array.from(arguments));
        console.stdlog.apply(console, arguments);
    }

    try {
        eval('(function() {'  + theInstructions + '}())');
        return console.logs.join('\n');
    }
    catch (err) {
        return err;
    }
}
