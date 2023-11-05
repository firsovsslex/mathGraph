import React, { createRef } from "react";
import "./styles/App.css";

import FunctionBuilder from './components/FunctionBuilder.jsx';
import Graph from "./scripts/graph.js";

let width = window.innerWidth;
let height = window.innerHeight;


class App extends React.Component{
    constructor(props){
        super(props);
        this.canvas = createRef();
        this.state = {graph: null};
    }


    componentDidMount(){
        this.setState({graph: new Graph(this.canvas.current, width, height, 50)}, () => this.state.graph.init());
    }

    render(){
        return (
            <div className="wrapper">
                <FunctionBuilder graph={this.state.graph} width={width} height={height}/>
                <canvas ref={this.canvas} width={width} height={height}>Error</canvas>
            </div>
        )
    }
}


export default App;