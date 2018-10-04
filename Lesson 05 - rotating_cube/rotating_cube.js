"use strict";
var gl;
var vertices;
var boxIndices;
var points=[];
var theta_location;
var xyz_angles=[0,30,30];

function init(){
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if(!gl)
    {
        alert("can't initialize gl");
        return;
    }

    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(1.0,1.0,1.0,1.0);
    gl.enable(gl.DEPTH_TEST);

    createCube();
    
    var program=initShaders(gl,"vertex-shader","fragment-shader");
    gl.useProgram(program);

    var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vColor');
    
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

    theta_location = gl.getUniformLocation(program,"theta");
    render();
}
function createCube()
{
    //construct the geometry   
vertices=[
    // X, Y, Z           R, G, B
            // Top
            -0.5, 0.5, -0.5,   0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,    0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,     0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,    0.5, 0.5, 0.5,
    
            // Left
            -0.5, 0.5, 0.5,    0.75, 0.25, 0.5,
            -0.5, -0.5, 0.5,   0.75, 0.25, 0.5,
            -0.5, -0.5, -0.5,  0.75, 0.25, 0.5,
            -0.5, 0.5, -0.5,   0.75, 0.25, 0.5,
    
            // Right
            0.5, 0.5, 0.5,    0.25, 0.25, 0.75,
            0.5, -0.5, 0.5,   0.25, 0.25, 0.75,
            0.5, -0.5, -0.5,  0.25, 0.25, 0.75,
            0.5, 0.5, -0.5,   0.25, 0.25, 0.75,
    
            // Front
            0.5, 0.5, 0.5,    1.0, 0.0, 0.15,
            0.5, -0.5, 0.5,    1.0, 0.0, 0.15,
            -0.5, -0.5, 0.5,    1.0, 0.0, 0.15,
            -0.5, 0.5, 0.5,    1.0, 0.0, 0.15,
    
            // Back
            0.5, 0.5, -0.5,    0.0, 1.0, 0.15,
            0.5, -0.5, -0.5,    0.0, 1.0, 0.15,
            -0.5, -0.5, -0.5,    0.0, 1.0, 0.15,
            -0.5, 0.5, -0.5,    0.0, 1.0, 0.15,
    
            // Bottom
            -0.5, -0.5, -0.5,   0.5, 0.5, 1.0,
            -0.5, -0.5, 0.5,    0.5, 0.5, 1.0,
            0.5, -0.5, 0.5,     0.5, 0.5, 1.0,
            0.5, -0.5, -0.5,    0.5, 0.5, 1.0,
    ];
   boxIndices =
        [
            // Top
            0, 1, 2,
            0, 2, 3,
    
            // Left
            5, 4, 6,
            6, 4, 7,
    
            // Right
            8, 9, 10,
            8, 10, 11,
    
            // Front
            13, 12, 14,
            15, 14, 12,
    
            // Back
            16, 17, 18,
            16, 18, 19,
    
            // Bottom
            21, 20, 22,
            22, 20, 23
        ];
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    xyz_angles[0] += 0.2;

    xyz_angles[0] %=  360;

    gl.uniform3fv(theta_location,xyz_angles);

    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimFrame(render);
}