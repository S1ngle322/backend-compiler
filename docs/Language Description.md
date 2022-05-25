# FypeScript

## Language Ideas

The idea of FypeScript is to construct a static type checker on top of simplified JavaScript syntax.

We are creating a transpiler of a program written in JavaScript with additional features to a pure JavaScript code after running checking its type correctness.

## Language List of Features

| Features                                                         | Approximate Difficulty Points |
| ---------------------------------------------------------------- | ----------------------------- |
| Type Checker                                                     |                               |
| Base Types (integer, real, booleans, strings)                    |                               |
| User-defined terms and types (structures)                        |                               |
| Standard library (e.g. arithmetic, logical, lists)               |                               |
| First-class functions (anonymous functions)                      |                               |
| Nested definitions (nested functions)                            |                               |
| Simple Constraint-Based Type Inference (e.g. support auto types) |                               |
| Functions with multiple arguments                                | 1                             |
| Type Ascription                                                  | 1                             |
| General Recursion                                                | 2                             |
| Inlineable Functions                                             | x                             |
| Intersection Types                                               | 4                             |
| Union Types                                                      | 4                             |
| References (mutable variables, arrays)                           | 4                             |
| **Difficulty Result**                                            | **12 + x**                    |

## Demo program

```

type Job = {
  position: string;
  experience: number;
};

type UsualFullName = {
  name: string;
  surname: string;
};

type RussianFullName = {
  name: string;
  surname: string;
  patronic: string;
};

type FullName = UsualFullName | RussianFullName;

type User = FullName & Job;

inlineable function sayHello() {
  console.log("Hello!");
};

inlineable function inlineSum(x, y) {
  return x+y;
};

let user: User = {
  name: "Daniel",
  surname: "Leinad",
  position: "Fullstack web developer",
  experience: 4
};

sayHello();

let sum = inlineSum(5, 8);
console.log("Sum is "+sum);

function anotherFunction(a: string) : void {
  console.log(a);
}



let fullText: string = "My name is" + user.name + user.surname + "and I have been working as a " + user.position + " for " + String(user.experience) + " years.";

```

## Formal Grammar

In contrast with pure JavaScript, in FypeScript ";" at the end of statements (function, type, variable declarations etc.) cannot be omitted.
Omitting this symbol may result in unwanted behavior or errors.

### <b>Program :</b>

{ Statement }

### <b>Statement :</b>

Declaration | TypeDeclaration | Assignment | SpecialForm | Function

### <b>Declaration</b>

DeclarationType Identifier<code>:</code> TypeIdentifier <code>=</code> Expression <code>;</code> <br/>
DeclarationType Identifier <code>=</code> Expression <code>;</code> <br/>
<code>let</code> Identifier<code>;</code><br/>
<code>let</code> Identifier<code>:</code> TypeIdentifier<code>;</code>

### <b>TypeDeclaration</b>

<code>type</code> TypeIdentifier <code>=</code> Union | Intersection | PureType<code>;</code>

### <b>Assignment</b>

Identifier <code>=</code> Expression<code>;</code>

### <b>SpecialForms</b>

<code>if (</code> Expression <code>) {</code> Statement <code>}</code> { <code>else {</code> Statement <code>}</code>}

<code>while (</code> Expression <code>) {</code> Statement <code>}</code>

<code>for (</code> Statement <code>) {</code> Statement <code>}</code>

### <b>Function</b>

NamedFunction | InlineableFunction | LambdaFunction

### Identifier

Letter { Letter | DecimalDigit }

### Letter

Any Unicode character that represents a letter

### DecimalDigit

0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

### DeclarationType

<code>let</code> | <code>const</code>

### Expression

Relation [ ( <code>&&</code> | <code>||</code> ) Relation ]

### Relation

Factor [ ( <code></code> | <code><=</code> | <code>></code> | <code>>=</code> | <code>==</code> | <code>===</code> | <code>!=</code> | <code>!==</code> ) Factor ]

### Factor

Term { ( + | - ) Term }

### Unary

[ + | - | ] Identifier | Literal

### Literal

INTEGER | REAL | BOOL | STRING | NULL | UNDEFINED | OBJECT | ArrayLiteral | Function

### ArrayLiteral

<code>[</code> { Expression } <code>]</code>

### TypeIdentifier

Letter { Letter | DecimalDigit }

### PureType

Build-in type | <code>{</code> { Identifier<code>:</code> PureType<code>;</code> } <code>}</code>

### Union

PureType <code>|</code> PureType { <code>|</code> PureType }

### Intersection

PureType <code>&</code> PureType { <code>&</code> PureType }

### NamedFunction

<code>function</code> Identifier <code>(</code> { Identifier } <code>) {</code><br>
Program<br>
<code>}</code>

### InlineableFunction

<code>inlineable function</code> Identifier <code>(</code> { Identifier } <code>) {</code><br>
Program<br>
<code>}</code>

### LambdaFunction

<code>(</code> { Identifier } <code>) => {</code><br>
Program<br>
<code>}</code>

## Examples of Features

### Base Types

boolean: <code>true</code>|<code>false</code>

number: [|-] Digit {Digit}

string: [<code>'</code>|<code>"</code>]{Letter|Digit}[<code>'</code>|<code>"</code>]

object: <code>{</code>key1: value1,<br>key2: value2,<br>...<code>}</code>>

There are also ```null``` and ```undefined``` types, but they are unique and have only one same-called value ("null" and "undefined" respectively)
Also, declared variable without value has "undefined" value, "null" stands for intentionally nullified value.

```
const a: number = 1;
let b: boolean = true;
const c: string = 'hello';
const user: {name: string; surname: string} = {name: "Ivan"; surname: "Ivanov"};
const nullValue: null = null;
const undefined: undefined = undefined;
```

### Loops

There can be ```for``` and ```while``` loops.

```while``` has a form ```while (condition) {body}```. Body should make condition closer to being satisfied, otherwise infinite loop will happen:

```
let i = 10;
// infinite loop:
while(i>0) {
  console.log(i);
};

//Finite loop:
while(i>0) {
  console.log(i);
  i = i-1;
};

```
```for``` loop has the following form:
```for (initial condition; terminating condition; after-body operation)```<br>
Omitting one of the parts can result in infinite loop.
Example:

```
for (let i = 0; i<10; ) {
  console.log(i); //infinitely prints 0
}

for (let i = 0; i<10; i++) {
  console.log(i); //OK
}
```

### Comments

```
// One line comment
/*
    Multi
    line
    comments
*/
```

### Anonymous functions

```
(a: number, b: number) => {
    return a + b;
}
```

### Named functions
Regular named functions with arguments are declared as follows:
```function nameOfFunction(arguments with their types) : returnedType {body}```
If a function doesn't return anything, its returnedType is void.<br>
```
function namedFunction(arg: string) : void {
  console.log(arg);
};

function anotherNamedFunction(arg: number) : number {
  console.log()
}
```

### Inlineable Functions

```
inlineable function hello(x, y) {
  let k = 'hi' + x + y
  console.log(k);
};

inlineable function inlineReturnSum(x, y) {
  return x+y;
};

hello(5, 2);

console.log(inlineReturnSum(5, 2));

```
The difference between Named Functions and Inlineable is that the inlineable function's body is inserted in a place of its call. Thus, global namespace for functions will not be polluted, and the program won't need to remember the function.
However, if the function is frequently used in a program, it shouldn't be inlineable.
### Type Defining
Mostly for objects. Describes the fields and their types that the object must have. An instance of the type must have ALL the properties with right types of that type and cannot have extra fields.

The properties in this case are separated by ;
```
type MyType = {
    field1: string;
    field2: number;
};

let myVar = {field1: "Hello", field2: 5};
```
Incorrect examples:
```
const myVar2 = {field1: "Hello"}; // no field2
const myVar3 = {field1: "Hello", field2: 5, field3: "Extra"}; //no field3 on MyType
const myVar4 = {field1: 1, field2: 2}; // incorrect type of field1
```
### Union of types

Union type is a combination of two or more types, representing a value that may be any of those types.

```
type MyType1 = {
    field1: string;
    field3: string;
};
type MyType2 = {
    field2: string;
    field3: string;
};
type MyType3 = MyType1 | MyType2;
```
Value of type MyType3 can be __either__ of MyType1 (i.e. object with ```field1``` and ```field3``` properties), __or__ of MyType2 (object with ```field2``` and ```field3``` properties).

However, in this case, only common properties and methods can be safely accessed, which means that 
```
function wrong(a: MyType3) {
  console.log(a.field1);
};
```
is incorrect as field1 doesn't exist on MyType2. This will work:
```
function wrong(a: MyType3) {
  console.log(a.field3);
};
```
because field3 exists both on MyType1 and MyType2.

The above applies only to function arguments. Accessing properties of object/value of some type is not restricted:

```
let variable: MyType3 = {field1: "Hello", field3: "World"}; //OK
console.log(variable.field1);
```

### Intersection of types
Stands for a type that wil include __both__ field of the first type __and__ fields of other types. I.e., the instance of that type has to have all the properties of its parts
```
type Animal = {
  name: string
};

type Bear = Animal & {
  honey: boolean
};

/*
    type Bear = {
        name: string;
        honey: boolean;
    };
*/

let bear = {name: "Misha", honey: "True"};
```
The error in this case would be raised in these cases:

```
let bear: Bear = {name: "Misha"}; // there should be also "honey" property
let bearTwo: Bear = {name: "Misha", color: "Black"}; // there is no property "color" on type Bear

```

### Nested functions

```
function isArraySumEven(array: number[]) {
    function sum(array: number[]): number {
        let s = 0;
        for (let i = 0; i < array.length; i++) {
            s += array[i];
        }
        return s;
    }

    return sum(array) % 2 === 0;
}
```

## Standard library

Since FypeScript is more of a transpiler, it supports a lot of JavaScript functions on BaseTypes.
However, not all JavaScript features are supported.

One of the most important features is, of course, an outputting:

```
console.log(1); // prints 1
console.log("Hello") // prints "Hello"
```

### Type casting

A term sometimes can be explicitly converted to a value of another type:

<code>Boolean(0)</code> -> <code>False</code>
<code>Boolean({})</code> -> <code>True</code>
<code>String(52)</code> -> <code> "52"</code>

Other examples of type conversion will be provided below.

However, some castings will lead to either runtime error or unwanted behavior:

<code>Number("52 1")</code> -> <code>NaN</code>, not some array of <code>[52, 1]</code>

### String

Strings themselves are immutable (one cannot change only some part of the string).

Strings' symbols can be referred to by index:

<code>"Hello"[1]</code> -> <code>"e"</code>

String can be added to another string:
<code>String1 + String2</code> -><code>String1String2</code>

Length of a string:

<code>"Hello".length</code> -> <code>5</code>

Another examples

```
let str: string = "Hello, world!";

let firstAndLast: string = str[0] + str[12]; // "H!"

```
#### String.slice() ####
String.slice(first, last, []) will aplly slice method and return substring from **first-th** to **(last-1)-th** position

**Example:**
```
const str = 'The quick brown fox jumps over the lazy dog.';

console.log(str.slice(31));
// expected output: "the lazy dog."
```



#### String.fromCharCode() ####
String.fromCharCode(num1, num2, ..., numN) returns a string created from the specified sequence of UTF-16 code units

**Example:**
```
console.log(String.fromCharCode(189, 43, 190, 61));
// expected output: "½+¾="
```

#### String.indexOf() ####
String.indexOf(substring) takes a substring to search for, searches the entire calling string, and returns the index of **the first occurrence** of the specified **substring**

**Example:**
```
const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';

const searchTerm = 'dog';
const indexOfFirst = paragraph.indexOf(searchTerm);

console.log(`The index of the first "${searchTerm}" from the beginning is ${indexOfFirst}`);
// expected output: "The index of the first "dog" from the beginning is 40"
```

#### String.replace() ####
String.replace(pattern, replacement) method returns a new string with some or all matches of a **pattern** replaced by a **replacement**

**Example:**
```
const p = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?';

console.log(p.replace('dog', 'monkey'));
// expected output: "The quick brown fox jumps over the lazy monkey. If the dog reacted, was it really lazy?"
```


#### String.split() ####
String.split(separator) method divides a String into an ordered list of substrings, puts these substrings into an array, and returns the array. The division is done by searching for a **separator**; where the pattern is provided as the first parameter in the method's call.

**Example:**
```
const str = 'The quick brown fox jumps over the lazy dog.';
const words = str.split(' ');

console.log(words[3]);
// expected output: "fox"
```


#### String.toLowerCase() ####
String.toLowerCase() method returns the calling string value converted **to lower case**

**Example:**
```
const sentence = 'The quick brown fox jumps over the lazy dog.';

console.log(sentence.toLowerCase());
// expected output: "the quick brown fox jumps over the lazy dog."
```


#### String.toUpperCase() ####
String.toUpperCase() method returns the calling string value converted to **uppercase** (the value will be converted to a string if it isn't one)

**Example:**
```
const sentence = 'The quick brown fox jumps over the lazy dog.';

console.log(sentence.toUpperCase());
// expected output: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG."
```


#### String.substring() ####
String.substring(indexStart, indexEnd) method returns the part of the string between the **start** and end **indexes**, or to the end of the string

**Example:**
```
const str = 'Mozilla';

console.log(str.substring(1, 3));
// expected output: "oz"
```


#### String.charAt() ####
String.charAt(index) method returns a new string consisting of the single UTF-16 code unit located at the specified **index** into the string

**Example:**
```
const sentence = 'The quick brown fox jumps over the lazy dog.';
const index = 4;

console.log(`The character at index ${index} is ${sentence.charAt(index)}`);
// expected output: "The character at index 4 is q"
```
#### String.charCodeAt() ####
String.charCodeAt(index) method returns an integer between 0 and 65535 representing the UTF-16 code unit at the given **index**

**Example:**
```
const sentence = 'The quick brown fox jumps over the lazy dog.';
const index = 4;

console.log(`The character code ${sentence.charCodeAt(index)} is equal to ${sentence.charAt(index)}`);
// expected output: "The character code 113 is equal to q"
```

#### String.concat() ####
String.concat(str1, str2, ... , strN) method concatenates the **string** arguments to the calling string and returns a new string

**Example:**
```
const str1 = 'Hello';
const str2 = 'World';

console.log(str1.concat(' ', str2));
// expected output: "Hello World"
```
---
### Number

All basic math operations are supported:

```
let first: number = 1;
let second: number = 5;

console.log(first+second); // 6
console.log(first-second); // -4
console.log(first*second); // 5
console.log(first/second); // 0.2
```
#### Number.isFinite() ####
`Number.isFinite(value)` method determines whether the passed `value` is a finite number — that is, it checks that the type of a given value is Number, and the number is neither positive Infinity, negative Infinity, nor NaN

**Example:**
```
console.log(Number.isFinite(1 / 0));
// expected output: false

console.log(Number.isFinite(10 / 5));
// expected output: true

console.log(Number.isFinite(0 / 0));
// expected output: false
```
#### Number.isFinite() ####
`Number.isInteger(value)` method determines whether the passed `value` is an integer

**Example:**
```
a = Number.isInteger(1 / 2)
b = Number.isInteger(2 / 2)
console.log(a, b);
// expected output: false true
```
#### Number.isNaN() ####
`Number.isNaN(value)` method determines whether the passed `value` is NaN and its type is Number

**Example:**
```
a = Number.isNaN('100F'));
b = Number.isNaN(NaN));

console.log(a, b);
// expected output: false true
```
#### Number.parseFloat() ####
`Number.parseFloat(argument)` method parses an `argument` and returns a floating point number. If a number cannot be parsed from the argument, it returns NaN

**Example:**
```
a = Number.parseFloat('4.567abcdefgh');
b = Number.parseFloat('abcdefgh');

console.log(a, b);
// expected output: 4.567 NaN
```
#### Number.parseInt() ####
`Number.parseInt(string, radix)` method parses a `string` argument and returns an integer of the specified `radix`

**Example:**
```
a = Number.parseFloat('4.567abcdefgh', 16);
b = Number.parseFloat('abcdefgh', 2);

console.log(a, b);
// expected output: 15 NaN
```
#### Number.toFixed() ####
`Number.toFixed(number)` method formats a `number` using fixed-point notation

**Example:**
```
a = (123.456).toFixed(2);
b = (0.004).toFixed(2);

console.log(a, b);
// expected output: "123.46" "0.00"
```
#### Number.toString() ####
`Number.toString(radix)` method returns a string representing the specified Number object

**Example:**
```
a = (233).toString(16);
b = (11).toString(16);

console.log(a, b);
// expected output: "e9" "b"
```

#### Number.valueOf() ####
`Number.valueOf()` method returns the wrapped primitive value of a Number object

**Example:**
```
const numObj = new Number(42);
console.log(numObj.valueOf());
// expected output: 42
```
---
### Boolean
The Boolean object is an object wrapper for a boolean value
#### Description ####
The value passed as the first parameter is converted to a boolean value, if necessary. If the value is omitted or is 0, -0, null, false, NaN, undefined, or the empty string (""), the object has an initial value of false. All other values, including any object, an empty array ([]), or the string "false", create an object with an initial value of true. 

They are mostly logical operators:

```
let tru: boolean = true;
let fls: boolean = false;

console.log(tru||fls); // true
console.log(tru&&fls); // false
console.log(~tru); // false
console.log(~fls); // true
```
#### Boolean.toString() ####
Boolean.concat() method returns a string representing the specified Boolean object

**Example:**
```
const flag1 = new Boolean(true);
const flag2 = new Boolean(1);

console.log(flag1.toString(), );
// expected output: "true" "true"
```

#### Boolean.valueOf() ####
Boolean.valueOf() method returns the primitive value of a Boolean object

**Example:**
```
const x = new Boolean();
const y = new Boolean('Mozilla');

console.log(x.valueOf(), y.valueOf());
// expected output: false true
```
---
### Array
Array is a special built-in object.
Represented as ```[values]```
In type annotation one should put [] at the end of the base type:
```
const myArr: string[] = ["Hello", "World"];
```
#### Properties 
```Array.length``` will return a number of elements in array:
<code>
const myArr: string[] = ["Hello", "World"];
console.log(myArr.length); // 2
</code>

#### Array.isArray()
The ```Array.isArray(value)``` method determines whether the passed value is an Array.

**Example**
```
Array.isArray([1, 2, 3]);  // true
Array.isArray({foo: 123}); // false
Array.isArray('foobar');   // false
Array.isArray(undefined);  // false
```
#### Array.indexOf()
The ```Array.indexOf(searchElement [,fromIndex])``` method returns the first index at which a given element can be found in the array, or -1 if it is not present.
**Example**
```
const beasts = ['ant', 'bison', 'camel', 'duck', 'bison'];

console.log(beasts.indexOf('bison')); // expected output: 1
console.log(beasts.indexOf('giraffe')); // expected output: -1
```

#### Array.join()

The ```Array.join()``` method creates and returns a new string by concatenating all of the elements in an array separated by comma or another specified separator.
**Example**
```
const elements = ['Fire', 'Air', 'Water'];

console.log(elements.join()); // expected output: "Fire,Air,Water"
console.log(elements.join('-')); // expected output: "Fire-Air-Water"
```
#### Array.push()

The ```Array.push()``` method adds one or more elements to the end of an array and returns the new length of the array.
**Example**
```
const animals = ['pigs', 'goats', 'sheep'];
const count = animals.push('cows');
console.log(count); // expected output: 4
console.log(animals); // expected output: Array ["pigs", "goats", "sheep", "cows"]
```

#### Array.pop()
The ```Array.pop()``` method removes the last element from an array and returns that element. This method changes the length of the array.
**Example**
```
const plants = ['broccoli', 'cauliflower', 'cabbage', 'kale', 'tomato'];

console.log(plants.pop()); // expected output: "tomato"

console.log(plants); // expected output: Array ["broccoli", "cauliflower", "cabbage", "kale"]
```

#### Array.reverse()
The ```Array.reverse()``` method reverses an array in place. The first array element becomes the last, and the last array element becomes the first.
It changes the original array.
**Example**
```
const array1 = ['one', 'two', 'three'];
const reversed = array1.reverse();
console.log('reversed:', reversed); // expected output: "reversed:" Array ["three", "two", "one"]
console.log('array1:', array1); // expected output: "array1:" Array ["three", "two", "one"]
```

#### Array.slice()

**Example**
```
const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

console.log(animals.slice(2)); // expected output: Array ["camel", "duck", "elephant"]

console.log(animals.slice(1, 5)); // expected output: Array ["bison", "camel", "duck", "elephant"]

console.log(animals.slice(-2)); // expected output: Array ["duck", "elephant"]
```
#### Array.sort()
The ```Array.sort(compareFn)``` method sorts the elements of an array in place and returns the sorted array. The default sort order is ascending, built upon converting the elements into strings. If provided compareFn, the sorting depends on its returned value: if ```compareFn(a,b)```>0, then b will be sorted before a; else if ```compareFn(a,b)```<0, then a is sorted before b; else (if === 0) the original order is kept.
**Example**
```
const array1 = [1, 30, 4, 21, 100000];
array1.sort();
console.log(array1); // expected output: Array [1, 100000, 21, 30, 4]
array1.sort((a,b) => a-b);
console.log(array1); // expected output: Array [1, 4, 21, 30, 10000]
```
---

### Object
In order to access the value of some kay, one can use one of the following options:

```
let obj = {
  field: "Name",
};

console.log(obj.field);
console.log(obj['field']);
```
Using brackets allows to compute the value of the field and use variable, while dot notation doesn't:

```
let fieldname = "fi"+"eld";

console.log(obj.fieldname); //error: no key 'fieldname'
console.log(obj[fieldname]); // OK

```

#### Object.assign() ####
`Object.assign(target, ...sources)` method copies all enumerable own properties from one or more `source` objects to a `target` object. It returns the modified target object.

**Example:**
```
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
```

#### Object.entries() ####
`Object.entries(object)` method returns an array of a given `object's` own enumerable string-keyed property [key, value] pairs. This is the same as iterating with a for...in loop, except that a for...in loop enumerates properties in the prototype chain as well.

**Example:**
```
const object1 = {
  a: 'somestring',
  b: 42
};

for (const [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}

// expected output:
// "a: somestring"
// "b: 42"
```

#### Object.keys() ####
`Object.keys(object)` method returns an array of a given `object's` own enumerable property names, iterated in the same order that a normal loop would

**Example:**
```
const object1 = {
  a: 'somestring',
  b: 42,
  c: false
};

console.log(Object.keys(object1));
// expected output: Array ["a", "b", "c"]
```

#### Object.values() ####
`Object.values(object)` method returns an array of a given `object's` own enumerable property values, in the same order as that provided by a for...in loop. (The only difference is that a for...in loop enumerates properties in the prototype chain as well.)

**Example:**
```
const object1 = {
  a: 'somestring',
  b: 42,
  c: false
};

console.log(Object.values(object1));
// expected output: Array ["somestring", 42, false]
```

#### Object.toString() ####
`Object.toString()` method returns a string representing the object

**Example:**
```
function Dog(name) {
  this.name = name;
}

const dog1 = new Dog('Gabby');

Dog.prototype.toString = function dogToString() {
  return `${this.name}`;
};

console.log(dog1.toString());
// expected output: "Gabby"
```

#### Object.valueOf() ####
`Object.valueOf()` method returns the primitive value of the specified object

**Example:**
```
function MyNumberType(n) {
  this.number = n;
}

MyNumberType.prototype.valueOf = function() {
  return this.number;
};

const object1 = new MyNumberType(4);

console.log(object1 + 3);
// expected output: 7
```
---
## Invalid programs

These are examples of the programs that will fail to run due to type checking problems, runtime errors, or will have unpredicted behavior.

```
type OkType = {
  first: string;
  second: string;
};

let kolya: OkType = {
  first: "Kolya",
  second: "Ivanov",
  third: "Petrovich" // field "third" doesn't exist on type "OkType"
}
```

```
let kolya = "Kolya";
console.log(kolya; // missing ')'
```