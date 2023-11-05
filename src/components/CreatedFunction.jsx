import React, { useEffect, useRef, useState } from "react";
import "../styles/CreatedFunction.css";

export default function(props){


    let [color, setColor] = useState(props.color);
    let time = useRef(performance.now());

    useEffect(() => {
        props.graph.setFunctionColor(props.id, color);
    }, [color])

    function handleColorChange(e){
        let currentTime = performance.now();

        if(currentTime - time.current < 50) return;
        time.current = currentTime;

        setColor(e.target.value);
    }

    return (
        <div className="main">
            
            <button className="delete" onClick={props.handleButtonClick}></button>
            <span className="expression">{props.expression}</span>
            <input type="color" className="color" value={color} onChange={handleColorChange}/>

        </div>
    )
}