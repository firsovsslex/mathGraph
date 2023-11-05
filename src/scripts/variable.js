
// import math from "./node_modules/mathjs/dist/math.js";

class Variable {

    static functions = {
        'sin': (x) => Math.sin(x),
        'cos': (x) => Math.cos(x),
        'tan': (x) => Math.tan(x),
        'ln': (x) => Math.log(x)
        // 'cot': (x) => Math.cot(x),
        // 'log': (a, x) => math.log(x, a)
    };

    constructor(coefficient, value, degree, funcs){

        this.funcs = [];
        
        if(arguments.length === 1){
            this.value = arguments[0];
            this.coefficient = 1;
            this.degree = 1;
        }

        else if(arguments.length === 2){
            this.coefficient = arguments[0];
            this.value = arguments[1];
            this.degree = 1;
        }

        else {
            this.coefficient = coefficient;
            this.value = value;
            this.degree = degree;

            if(arguments.length === 4){
                this.funcs = funcs;
            }

        }
        

    }

    calculate(x){

        let coefficient = this.coefficient;
        let value = this.value;
        let degree = this.degree;

        if(typeof this.coefficient !== 'number'){
            coefficient = this.coefficient.calculate(x);
        }

        if(typeof this.value === 'string'){
            value = x;
        }

        else if(typeof this.value !== 'number'){
            value = this.value.calculate(x);
        }

        if(typeof this.degree !== 'number'){
            degree = this.degree.calculate(x);   
        }


        let result = coefficient * (value ** degree);


        for(let i = 0; i < this.funcs.length; i++){
            result = Variable.functions[this.funcs[i]](result);
        }

        return result;
    }


    addFuncs(...funcs){
        this.funcs = this.funcs.concat(funcs);
        return this;
    }

    
}

class Polynomial{
    constructor(...vars){
        this.vars = vars;
    }

    calculate(...values){
        let i = 0;
        return this.vars.map(variable => typeof variable === 'number'? variable: variable.calculate(values[i < values.length? i++: i - 1])).reduce((prev, value) => value + prev, 0);
    }
}

export {Variable, Polynomial};