import React, { useEffect, useState } from "react";
import Settings from "./Settings";
import "../styles/CreatedFunction.css";

export default function(props){


    let [color, setColor] = useState(props.color);

    // function handleColorChange(e){
    //     setColor(e.target.value);
    // }

    useEffect(() => {
        props.graph.setFunctionColor(props.id, color);
    }, [color])

    return (
        <div className="main">
            
            <button className="delete" onClick={props.handleButtonClick}></button>
            <span className="expression">{props.expression}</span>
            <input type="color" className="color" value={color} onChange={(e) => setColor(e.target.value)}/>

        </div>
    )
}