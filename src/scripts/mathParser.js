import {log, pow, gamma, tan, divide, sin, cos, cot, sinh, cosh, tanh, coth} from "mathjs";

class MathNumber{
    constructor(number){
        this.value = number;
    }
}

class MathFunction{
    constructor(name){
        this.name = name;
    }
}

class MathExpression{
    constructor(text, params){
        this.text = text;
        this.params = {};

        if(params) this.params = params;
    }
}

function parse(expression, params){
    const reg = /\s/;

    const operators = '^*/+-';
    const numbers = '0123456789';

    const functions = {
        'sin': (x) => sin(x),
        'cos': (x) => cos(x),
        'ln': (x) => Math.log(x),
        'log': (a, x) => log(x, a),
        'tan': (x) => tan(x),
        'cot': (x) => cot(x),
        'gamma': (x) => gamma(x),
        'sinh': (x) => sinh(x),
        'cosh': (x) => cosh(x),
        'tanh': (x) => tanh(x),
        'coth': (x) => coth(x),
    }

    let funcs = Object.keys(functions).sort((a, b) => b.length - a.length);

    params.E = Math.E;
    params.P = Math.PI;

    let variables = Object.keys(params);

    expression = expression.split('').filter(sym => !reg.test(sym));
    expression = handleMultVars(numberParser(functionParser(expression)))


    if(variables.length) expression = variableParser(expression);

    try{
       return polynomialParser(bracketParser(expression)).value;
    }
    catch(e){
        return 'error';
    }
    


    function variableParser(expression){

        for(let i = 0; i < expression.length; i++){
            let param = expression[i];
            if(variables.includes(param)){
                expression[i] = new MathNumber(params[param]);
            }
        }

        return expression;
    }

    function polynomialParser(expression){

        const minPriority = 2;

        let priorities = {
            '^': 0,
            '*': 1,
            '/': 1,
            '+': 2,
            '-': 2
        }


        for(let i = 0; i < expression.length; i++){
            let func = expression[i];
            if(funcs.includes(func.name)){
                let result = functions[func.name](expression[i + 1].value);
                expression.splice(i, 2, new MathNumber(result));
            }
        }


        for(let i = 0; i < minPriority + 1; i++){
            for(let j = 0; j < expression.length; j++){
                let operator = expression[j];
                if(!operators.includes(operator)) continue;
            
                if(priorities[operator] !== i) continue;

                if(!j && operator === '-'){
                    expression.unshift(new MathNumber(0));
                    j++;
                }

                let firstNumber = expression[j - 1].value;
                let secondNumber = expression[j + 1].value;

                let result = calc(firstNumber, secondNumber, operator); 

                if(!isFinite(result)) throw new Error('invalid expression');
            
                expression.splice(j - 1, 3, new MathNumber(result));

                j--;
            }
        }
        
        return expression[0];
    }


    function handleMultVars(expression){
        for(let i = 1; i < expression.length; i++){
            let elem = expression[i];

            if(elem === '(' || elem instanceof MathFunction || variables.includes(elem)){
                let prevElem = expression[i - 1];

                if(prevElem === ')' || prevElem instanceof MathNumber || variables.includes(prevElem)){
                    expression.splice(i, 0, '*');
                    i++;
                }   
            }

        }

        return expression;
    }


    function numberParser(expression){
        
        let result = [];

        let isNumberParse = false;
        let start = 0;

        for(let i = 0; i < expression.length; i++){
            let elem = expression[i];

            if(!numbers.includes(elem) && elem !== '.'){

                if(isNumberParse) result.push(new MathNumber(+expression.slice(start, i).join('')));
                
                result.push(elem);

                isNumberParse = false;
            }
            else if(!isNumberParse){
                isNumberParse = true;

                start = i;
            }
        }

        if(isNumberParse) result.push(new MathNumber(+expression.slice(start, expression.length).join('')));

        return result;
    }


    function functionParser(expression){

        
        for(let i = 0; i < expression.length; i++){
         
            for(let j = 0; j < funcs.length; j++){
                let func = funcs[j];

                if(expression.slice(i, i + func.length).join('') === func){
                    expression.splice(i, func.length, new MathFunction(func))
                    i -= func.length - 1;

                    break;
                }
        
            }
        }

        return expression;
    }


    function bracketParser(expression){
        let indexes = [];
    
        for(let i = 0; i < expression.length; i++){
            let sym = expression[i];

            if(sym === '('){
                indexes.push(i)   
            }

            else if(sym === ')'){
                let last = indexes.pop();

                expression.splice(last, i - last + 1, polynomialParser(expression.slice(last + 1, i)));        
                
                i = last;
            }

        }


        return expression;
    }

    function calc(a, b, operation){
        a = +a;
        b = +b;

        switch(operation){
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return divide(a, b);
            case '^': return pow(a, b);
        }
    }

    
}

let mathParser = {
    parse,
    MathExpression
};

// let start = performance.now();

// console.log('value ' + (log(73, Math.E)));

// console.log(performance.now() - start);

// console.log(parser.parse('cos(51)^2 + sin(51)^2 + ln(e) ', {p: Math.PI, e: Math.E}));
// console.log(mathParser.parse('cos(x) + sin(2x)', {x: 5}))
// console.log(mathParser.parse('-x^2', {x: 2}))



export default mathParser;