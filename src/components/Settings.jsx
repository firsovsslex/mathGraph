import React from "react";
import Checkbox from "./Checkbox.jsx";
import "../styles/Settings.css";

export default function(props){

    return (
        <div className="settings">
            <div className="settings__block1">
                <Checkbox text="Полярная функция" flag={props.isPolar} onChange={props.handleCheckboxChange}/>
                <input type="color" className="color" value={props.color} onChange={props.handleColorChange}/>
            </div>
            <span>Масштаб: </span>
            <input type="number" className="scale" value={props.scale} onChange={props.handleScaleChange} onKeyDown={props.handleScaleEnter}/>
        </div>
    )
}