import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

import './App.css';
import {useEffect} from "react";

/// VERTEX SHADER
const vertexShaderSource = `
    // an attribute will recieve data from a buffer
    attribute vec4 a_position;
        // all shaders have a main function
                void main() {
                // gl_Position is a special variable a vertex shader
                // is responsible for setting
                gl_Position = a_position;
            }`
/// VX SHADER:= javascript Version
/*
*  var positionBuffer = [
*  0, 0, 0, 0,
*  0, 0.5, 0, 0,
*  0.7, 0, 0, 0,
*  ];
*  var attributes = {};
*  var gl_Position;
*
*  drawArrays(..., offset, count) {
*   var stride = 4;
*   var size = 4;
*   for (var i = 0; i < count; ++i) {
*       // copy the next 4 values from positionBuffer to the a_position attribute
*       const start = offset + i * stride;
*       attributes.a_position = positionBUffer.slice(start, start + size);
*       runVertexShader();
*       ...
*       doSomethingWith_gl_Position();
*   }
* */
// Back to reality:
// positionBuffer would need to be converted to binary data.
// actual computation for getting data out of the buffer would be a little different
// but hopefully this gives you an idea.

/// FRAGMENT SHADER

const fragmentShaderSource = `
    // fragment shader don't have a default precision so we need
    // to pick one. mediump is a good default. 
    // It means "medium precision"
    precision mediump float;
    
    void main() {
      // gl_FragColor is a special variable 
      // a fragment shader is responsible for setting
      gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
      //                  r, g,   b, a
      
    }
    `
// above we're setting gl_FragColor = [1, 0, 0.5, 1]






function webgl() {
  // look that up
  var canvas = document.querySelector("#c") as HTMLCanvasElement

  // create a WebGLRenderingContext

  var gl = canvas?.getContext("webgl")
  if (!gl) {
    // no webgl for you!
    return;
  }
  /// Most 3D engines generate GLSL shaders on the fly using various types
  /// of templates, concatenation, etc.
  /// TODO: generate GLSL at runtime :D

  // Create a shader.
  // Upload the GLSL source and,
  // Compile the shader.
  function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    var shader = gl.createShader(type);
    if (!shader) throw new Error("No shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader)
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) return shader
    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
  }

  // Create Two Shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

  ///
  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    var success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) return program;
    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program);
  }

  var program = createProgram(gl, vertexShader, fragmentShader)
  // supply data
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  var positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  // Init done
  // Render
  webglUtils.resizeCanvasToDisplaySize(gl.canvas) // set viewport to canvas size
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program)
  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // tell attrib how to pull data from positionBuffer (ARRAY_BUFFER)
  var size = 2;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration
  var offset = 0; // start of buffer
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset
  )
  /**********************/

  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);

}
/* eslint no-console:0 consistent-return:0 */
"use strict";

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // Get the strings for our GLSL shaders
  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // code above this line is initialization code.
  // code below this line is rendering code.

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}


class webglUtils {

  static resizeCanvasToDisplaySize(canvas) {

    const canvasToDisplaySizeMap = new Map([[canvas, [300, 150]]])

    function onResize(entries) {
      for (const entry of entries) {
        let width;
        let height;
        let dpr = window.devicePixelRatio;
        if (entry.devicePixelContentBoxSize) {
          width = entry.devicePixelContentBoxSize[0].inlineSize
          height = entry.devicePixelContentBoxSize[0].blockSize
          dpr = 1
        } else if (entry.contentBoxSize) {
          if (entry.contentBoxSize[0]) {
            width = entry.contentBoxSize[0].inlineSize;
            height = entry.contentBoxSize[0].blockSize;
          } else {
            width = entry.contentBoxSize.inlineSize;
            height = entry.contentBoxSize.blockSize;
          }
        } else {
          width = entry.contentRect.width
          height = entry.contentRect.height
        }
        const displayWidth = Math.round(width * dpr)
        const displayHeight = Math.round(height * dpr)
        canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
      }
    }

    const resizeObserver = new ResizeObserver(onResize).observe(canvas, {box: 'content-box'})
    const [displayWidth, displayHeight] = canvasToDisplaySizeMap.get(canvas)
    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;
    if (needResize) {
      canvas.width = displayWidth
      canvas.height = displayHeight
    }
    return needResize;
  }
}

function App() {
  useEffect(() => {
    webgl()
  })
  return (
      <div className="App">
        <canvas id="c"></canvas>  /// HTML CANVAS
      </div>
  );
}
export default App;
