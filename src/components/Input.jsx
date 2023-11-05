import React, { useState } from "react";

export default function(props){

    let [value, setValue] = useState('');

    return (
        <input type={props.type || 'text'} className={props.className || ''}  placeholder={props.placeholder || ''} maxLength={props.maxLength || 20} value={value} onInput={(e) => setValue(e.target.value)}/>
    )
}