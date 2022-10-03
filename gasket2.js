"use strict ";
var canvas;

var gl;

var positions = [];
var numTimesToSubdivide = 10;

window.onload = function init()

{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

//initialize vertices of main triangle
var vertices = [
    vec2(-1, -1),
    vec2(0, 1),
    vec2(1, -1)
];

divideTriangle( vertices[0], vertices[1], vertices[2],
    numTimesToSubdivide);


//load on viewport and clear color of canvas 
gl.viewport(0, 0, canvas.width,canvas.height);

//clear the canvas - could be white 
gl.clearColor(1.0, 1.0, 1.0, 1.0);


//load shaders into program object 
 var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

//create buffer 
var bufferId = gl.createBuffer();

//bind buffer 
gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

//load data into the buffer 
gl.bufferData( gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW );

//accessing the program object ao as to access the shaders 

var positionLoc = gl.getAttribLocation( program, "aPosition" );
gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
gl.enableVertexAttribArray( positionLoc );


render();


};

function triangle (a, b, c)
{
positions.push(a, b, c);
}
function divideTriangle(a, b, c, count)
//what happens at the end of the recursion
{
    if (count === 0) {
        triangle(a,b,c);

    }
    else {
        //bisecting the sides 
        var ab = mix (a, b, 0.5);
        var ac = mix (a, c, 0.5);
        var bc = mix (b, c, 0.5);
        --count;
        //three triangles 
        divideTriangle(a, ab, ac,count);
        divideTriangle(c, ac, bc,count);
        divideTriangle(b, bc, ab,count);

    }

}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length );
}

