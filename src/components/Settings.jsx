import React from "react";
import Checkbox from "./Checkbox.jsx";

export default function(props){

    return (
        <div className="settings">
            <Checkbox text="Полярная функция" value={props.isPolar} onChange={props.handleCheckboxChange}/>
            <input type="color" className="color" value={props.color} onChange={props.handleColorChange}/>
        </div>
    )
}