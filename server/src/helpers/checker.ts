import * as ts from 'typescript';
import * as _ from 'lodash';
import * as fs from 'fs';

import {
  Assertion,
  Failure,
  NodedAssertion,
  Report,
} from './types';

interface Options {
  allowExpectError: boolean;
}

const generateRandom = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(23).substring(2, 5);

// Extract information about the type/error assertions in a source file.
function extractAssertions(
  scanner: ts.Scanner,
  source: ts.SourceFile,
  options: Options,
): Assertion[] {
  const assertions = [] as Assertion[];

  let isFirstTokenOnLine = true;
  let lastLine = -1;

  while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
    const token = scanner.getToken();
    if (token === ts.SyntaxKind.WhitespaceTrivia) continue;  // ignore leading whitespace.

    const pos = scanner.getTokenPos();
    let { line } = source.getLineAndCharacterOfPosition(pos);

    isFirstTokenOnLine = (line !== lastLine);
    lastLine = line;

    if (token === ts.SyntaxKind.SingleLineCommentTrivia) {
      const commentText = scanner.getTokenText();
      const m = commentText.match(/^\/\/ \$Expect(Type|Error) (.*)/);
      if (!m) continue;

      if (isFirstTokenOnLine) {
        line++;  // the assertion applies to the next line.
      }

      const [, kind, text] = m;

      if (kind === 'Error' && !options.allowExpectError) {
        throw new Error(`Found $ExpectError assertion at ${source.fileName}:${line
          } but --allow-expect-error was not set.`);
      }
      if (kind === 'Type') {
        assertions.push({ kind: 'type', type: text, line });
      } else if (kind === 'Error') {
        assertions.push({ kind: 'error', pattern: text, line });
      }
    }
  }
  return assertions;
}

export function attachNodesToAssertions(
  source: ts.SourceFile,
  checker: ts.TypeChecker,
  assertions: Assertion[],
): NodedAssertion[] {
  const nodedAssertions = [] as NodedAssertion[];

  // Match assertions to the first node that appears on the line they apply to.
  function collectNodes(node: ts.Node) {
    if (node.kind !== ts.SyntaxKind.SourceFile) {
      const pos = node.getStart();
      const { line } = source.getLineAndCharacterOfPosition(pos);
      const assertionIndex = _.findIndex(assertions, {line});
      if (assertionIndex >= 0) {
        const assertion = assertions[assertionIndex];
        const type = checker.getTypeAtLocation(node.getChildren()[0]);
        nodedAssertions.push({ node, assertion, type });
        assertions.splice(assertionIndex, 1);
      }
    }

    ts.forEachChild(node, child => { collectNodes(child); });
    return nodedAssertions;
  }

  collectNodes(source);
  if (assertions.length) {
    const prettyAssertions = assertions.map(assertion => {
      let msg: string;
      if (assertion.kind === 'type') {
        msg = `$ExpectType ${assertion.type}`;
      } else {
        msg = `$ExpectError ${assertion.pattern}`;
      }
      return `{assertion.line + 1}: ${msg}`;
    });
    console.error(JSON.stringify(prettyAssertions, null, '\t'));
    throw new Error('Unable to attach nodes to all assertions.');
  }

  return nodedAssertions;
}

function generateReport(
  checker: ts.TypeChecker,
  nodedAssertions: NodedAssertion[],
  diagnostics: ts.Diagnostic[],
): Report {
  const failures = [] as Failure[];
  let numSuccesses = 0;

  // Attach errors to nodes; if this isn't possible, then the error was unexpected.
  for (const diagnostic of diagnostics) {
    const line = diagnostic.file &&
        diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line;

    const nodedAssertion = _.find(nodedAssertions, {assertion: {line}} as any);
    if (nodedAssertion) {
      nodedAssertion.error = diagnostic;
    } else {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      failures.push({
        type: 'UNEXPECTED_ERROR',
        line,
        message,
      });
    }
  }

  // Go through and check all the assertions.
  for (const noded of nodedAssertions) {
    const { assertion, type, error, node } = noded;
    const line = assertion.line;
    const code = node.getText();
    if (assertion.kind === 'error') {
      if (!error) {
        failures.push({
          type: 'MISSING_ERROR',
          line,
          code,
          message: assertion.pattern,
        });
      } else {
        const message = ts.flattenDiagnosticMessageText(error.messageText, '\n');
        if (message.indexOf(assertion.pattern) === -1) {
          failures.push({
            type: 'WRONG_ERROR',
            line,
            code,
            expectedMessage: assertion.pattern,
            actualMessage: message,
          });
        } else {
          numSuccesses++;
        }
      }
    } else if (assertion.kind === 'type') {
      const actualType = checker.typeToString(type);
      if (actualType !== assertion.type) {
        failures.push({
          type: 'WRONG_TYPE',
          line,
          code,
          expectedType: assertion.type,
          actualType,
        });
      } else {
        numSuccesses++;
      }
    }
  }

  failures.sort((a, b) => a.line - b.line);

  return { numSuccesses, failures };
}

/**
 * Check a single TypeScript source file for typings assertions and errors.
 *
 * The file passes the checks if report.failures.length === 0.
 */
function checkFile(
  source: ts.SourceFile,
  scanner: ts.Scanner,
  checker: ts.TypeChecker,
  diagnostics: ts.Diagnostic[],
  options: Options,
): Report {
  const assertions = extractAssertions(scanner, source, options);
  const nodedAssertions = attachNodesToAssertions(source, checker, assertions);
  return generateReport(checker, nodedAssertions, diagnostics);
}

export async function check(code: string) {
  const tsFile = `./store/${generateRandom()}.ts`;

  try {
    fs.writeFileSync(tsFile, code);
  } catch (e) {
    throw new Error('Error');
  }

  try {
    const program = ts.createProgram([tsFile], {});
    const source = program.getSourceFile(tsFile);
    if (!source) {
      console.error(`could not load content of ${tsFile}`);
    }
    const languageVersion = ts.ScriptTarget.ES5;
    const scanner = ts.createScanner(
      languageVersion, false, source.languageVariant, source.getFullText());
    
    const checker = program.getTypeChecker();
    const diagnostics = ts.getPreEmitDiagnostics(program);
    
    const typingsOptions = {
      allowExpectError: false,
    };
    
    const report = checkFile(source, scanner, checker, diagnostics as ts.Diagnostic[], typingsOptions);
    for (const failure of report.failures) {
      let message: string;
      switch (failure.type) {
        case 'UNEXPECTED_ERROR':
          message = `Unexpected error\n  ${failure.message}`;
          break;
        case 'MISSING_ERROR':
          message = `Expected error ${failure.message}`;
          break;
        case 'WRONG_ERROR':
          message = `Expected error\n  ${failure.expectedMessage
              }\nbut got:\n  ${failure.actualMessage}`;
          break;
        case 'WRONG_TYPE':
          message = `Expected type\n  ${failure.expectedType}\nbut got:\n  ${failure.actualType}`;
          break;
      }
      // console.error(`${tsFile}:${line + 1}: ${message}\n`);
    }
    
    const numFailures = report.failures.length;
  
  
    fs.unlinkSync(tsFile);
  
    if (numFailures) {
      return report.failures;
    } else {
      return [];
    }
  } catch (err) {
    fs.unlinkSync(tsFile);

    return [err];
  }
}
