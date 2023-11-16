import { useRef, useState } from "react"
import CreatedFunction from './CreatedFunction.jsx';
import FunctionList from "./FunctionList";
import Settings from "./Settings.jsx";

import "../styles/ModalWindow.css";


export default function(props){

    let {graph, width, height} = props;

    let [position, setPosition] = useState({x: 0, y: 0});

    let [expression, setExpression] = useState('');
    let [isPolar, setPolar] = useState(false);
    let [color, setColor] = useState('#FF0000');
    let [scale, setScale] = useState(50);

    let [error, setError] = useState(false);

    let modalWindow = useRef();
    let windowRect = useRef({});

    let [savedFunctions, setSavedFunctions] = useState([]);


    function handlePosition(position, windowRect){
        if(position.x < 0){
            position.x = 0;
        }
        else if(position.x + windowRect.width > width){
            position.x = width - windowRect.width;
        }

        if(position.y < 0){
            position.y = 0;
        }
        else if(position.y + windowRect.height > height){
            position.y = height - windowRect.height;
        }

        return position;
    }
        
    function handlePointerMove(e){
        let rect = windowRect.current;

        let position = {
            x: e.pageX + rect.offsetX,
            y: e.pageY + rect.offsetY
        }
        
        setPosition(handlePosition(position, rect));
    }

    function handlePointerUp(e){
        document.removeEventListener('pointerup', handlePointerUp);
        document.removeEventListener('pointermove', handlePointerMove);

        console.log(e.type)

    }

    function handleMouseDown(e){
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('pointermove', handlePointerMove);

        let rect = modalWindow.current.getBoundingClientRect();

        windowRect.current = {
            offsetX: rect.left - e.pageX,
            offsetY: rect.top - e.pageY,
            width: rect.width,
            height: rect.height
        };

    }


    function handleSubmit(e){
        e.preventDefault();

        if(!expression.length) return;

        let id = String(+window.crypto.getRandomValues(new Uint16Array(1)));
        if(graph.buildFunction(expression, {}, isPolar, color, id)) setError(true);  
        else {
            if(error) setError(false);  

            setSavedFunctions([
                ...savedFunctions,
                {
                    expression,
                    isPolar,
                    color,
                    graph,
                    id,
                }
            ]);
        }
        
    }

    function handleInput(e){
        setExpression(e.target.value);
        if(error) setError(false);
    }

    function handleButtonClick(i, id){
        setSavedFunctions(savedFunctions.toSpliced(i, 1));
        graph.deleteFunction(id);
    }
    
    function handleScaleEnter(e){

        if(e.code !== 'Enter' || scale < 5 || scale > 250) return;

        graph.setGraphScale(scale);
    }

    function handleScaleChange(e){    
        let value = +e.target.value;
        setScale(value);
    }

    return (
        <div ref={modalWindow} className="modal" style={{left: position.x + 'px', top: position.y + 'px'}}>
            <div className="hook" onPointerDown={handleMouseDown} onContextMenu={(e) => {
                e.preventDefault();
            }}></div>
 
            <FunctionList>{savedFunctions.map((props, i) => <CreatedFunction key={props.id} handleButtonClick={() => handleButtonClick(i, props.id)} {...props}/>)}</FunctionList>

            <div className="block">
                <input type="text" className={"function" + (error? ' error': '')} placeholder="Введите выражение" maxLength={30} onInput={handleInput} value={expression}/><br/>
                <Settings isPolar={isPolar} color={color} scale={scale || ''} handleScaleChange={handleScaleChange} handleScaleEnter={handleScaleEnter} handleCheckboxChange={(e) => setPolar(!(e.target.value === 'true'))} handleColorChange={(e) => setColor(e.target.value)}/>       
            </div>
            
            <input type="submit" className="confirm" value="Подтвердить" onClick={handleSubmit}/>
        </div>
    )
}

