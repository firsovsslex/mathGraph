import React from "react";

export default function(props){
    return (
        <div className="label"><input className="checkbox" type="checkbox" value={props.flag} onChange={props.onChange}/><span style={{fontSize: 16}}>{props.text}</span></div>
    )
}