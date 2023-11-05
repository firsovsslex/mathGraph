import React from "react";
import '../styles/FunctionList.css';

export default function(props){
    return (
        <div className="container">
            {props.children}
        </div>
    )
}