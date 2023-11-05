
import mathParser from "./mathParser.js";


class Graph{
    constructor(canvas, width, height, scale){
        this.ctx = canvas.getContext('2d', {colorSpace: "display-p3"});

        this.width = width;
        this.height = height;
        this.scale = scale;

        this.offsetX = this.width / 2;
        this.offsetY = this.height / 2;

        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";

        this.paths = new Map();

    }

    init(){
        this.drawAxis();
        this.drawGrid(-20, -10);
    }

    setScale(scale){
        this.scale = scale;
    }
    
    drawAxis(){
       
        this.ctx.save();

        this.ctx.beginPath();

        this.ctx.strokeStyle = "blue";
        this.ctx.lineCap = "square";
        this.ctx.lineWidth = 3;

        this.ctx.moveTo(0, this.height / 2);
        this.ctx.lineTo(this.width, this.height / 2)

        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);

        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.restore();
    }


    drawLine(startX, startY, endX, endY){

        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);

    }

    drawLines(directions, lineOffset, size, draw){
        let center = size / 2;

        let length = Math.floor(center / lineOffset) + 1;

        for(let i = 0; i < directions.length; i++){
            for(let j = 0; j < length; j++){
                let coord = j * directions[i];
                let pos = center + lineOffset * coord;
                
                draw(pos, coord);
            }
        }
    }

    drawGrid(numOffsetX, numOffsetY){

        this.ctx.save();

        this.ctx.beginPath();

        this.ctx.strokeStyle = "#808080";
        this.ctx.lineWidth = this.scale / 50;
        this.ctx.font = `bold ${this.scale * 15 / 50}px Arial`;
        this.ctx.textAlign = 'center';

        let directions = [1, -1];

        this.drawLines(directions, this.scale, this.width, (posX, num) => {
            this.drawLine(posX, 0, posX, this.height);
            this.ctx.fillText(num.toString(), posX + numOffsetX, this.height / 2 + numOffsetY);
        });

        this.drawLines(directions, this.scale, this.height, (posY, num) => {
            this.drawLine(0, posY, this.width, posY);
            this.ctx.fillText((-num).toString(), this.width / 2 - 20, posY + numOffsetY);
        });

        this.ctx.stroke();

        this.ctx.restore();
    }

    convertToPolar(value, result){
        let x = Math.cos(value) * result;
        let y = Math.sin(value) * result;

        return [x, y];
    }

    initCtx(offsetX, offsetY){
        
        this.ctx.translate(offsetX, offsetY);
        this.ctx.scale(this.scale, -this.scale);
        this.ctx.lineWidth = 1 / this.scale * 2;

        this.ctx.moveTo(0, 0);
    }

    buildFunction(expression, params, isPolar, color, id){

        this.ctx.save();

        this.initCtx(this.offsetX, this.offsetY);

        this.ctx.strokeStyle = color;

        let result;

        if(isPolar) result = this.drawFunction(expression, params, this.offsetX, this.offsetY, 0.001, this.convertToPolar);
        else result = this.drawFunction(expression, params, this.offsetX, this.offsetY, -this.offsetX, (x, y) => [x, y]);

        if(result === 'error'){
            this.ctx.closePath();
            this.ctx.restore();

            return result
        }

        this.paths.set(id, {path: result, color, isPolar});
        this.ctx.stroke(result);

        this.ctx.restore();
    }


    drawFunction(expression, params, offsetX, offsetY, startIndex, convert){
        
        let path = new Path2D();

        let correct = false;

        for(let i = startIndex; i < offsetX; i++){

            let value = i / this.scale;
            params.x = value;

            let result = mathParser.parse(expression, params);

            if(!isFinite(result)) continue;
            if(!correct) correct = true;

            let [x, y] = convert(value, result);
            if(y > offsetY || y < -offsetY) continue;
            
            path.lineTo(x, y);
        }

        if(!correct){
            path.closePath();

            return 'error';
        }

        return path;
    }

    deleteFunction(id){
        this.paths.delete(id);  
        this.updateGraph();
    }

    setFunctionColor(id, color){
        this.paths.get(id).color = color;
        this.updateGraph();
    }

    setFunctionType(id, isPolar){
        this.paths.get(id).isPolar = isPolar;
        this.updateGraph();
    }

    updateGraph(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.init();

        this.ctx.save();

        this.initCtx(this.offsetX, this.offsetY);

        for(let {path, color} of this.paths.values()){
            this.ctx.strokeStyle = color;
                
            this.ctx.stroke(path);
        }

        this.ctx.restore();
    }


}

export default Graph;

// buildFunction(new mathParser.MathExpression('sin(x) + cos(2*x)', {p: Math.PI}), scale);






