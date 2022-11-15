import React, {useEffect} from 'react';
import './App.css';
import main from "../WebGL/webgl";

function App() {
    useEffect(() => {
        main()
    })
    return (
        <div className="App">
            <canvas id="c"></canvas>
            {/*/// HTML CANVAS*/}
        </div>
    );
}

export default App;
