"use strict";
var gl;
var vertices,colors,boxIndices;
var points=[];
var theta_location;
var xyz_angles=[0,30,30];
var current_axis=0;
var proj_location;
var projMat=mat4();
var view_location;
var viewMat=mat4();
var boxIndexBufferObject;
var presp_proj=true;
function init(){
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if(!gl)
    {
        alert("can't initialize gl");
        return;
    }

    gl.viewport(0,0,canvas.width,canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(1.0,1.0,1.0,1.0);

    createCube();
    
    var program=initShaders(gl,"vertex-shader","fragment-shader");
    gl.useProgram(program);

    var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    var colorBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,colorBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW );

	boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
    
    //we want to send the rotation angles to the GPU
    theta_location = gl.getUniformLocation(program,"thetas");
    proj_location = gl.getUniformLocation(program,"projection");
    view_location = gl.getUniformLocation(program,"view")

    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    var positionAttribLocation = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		0, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER,colorBufferObject);
    var colorAttribLocation = gl.getAttribLocation(program, 'vColor');
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		0, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
    gl.enableVertexAttribArray(colorAttribLocation);
    


    //if user clicks button, change the current axis (rotation axis)
    document.getElementById("changebtn").onclick=function(){
        current_axis++;
        if(current_axis===3) current_axis=0;
    };
    document.getElementById("toggle-proj").onclick=function(){
        if(presp_proj)
        {
            viewMat=lookAt([0.0,0.0,-3],[0.0,0.0,0.0],[0.0,1.0,0.0]);
            projMat=perspective(40, canvas.width/canvas.height, 1.0, 100.0);
            presp_proj=false;
        }
        else{
            viewMat=lookAt([0.0,0.0,-3],[0.0,0.0,0.0],[0.0,1.0,0.0]);
            projMat=ortho(-1.0,1.0,-1.0,1.0,1.0,100.0);
            presp_proj=true;
        }
    }

    render();
}
function createCube()
{
    //construct the geometry   
    vertices = [
        -0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5, 0.5,-0.5, -0.5, 0.5,-0.5,
        -0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
        -0.5,-0.5,-0.5, -0.5, 0.5,-0.5, -0.5, 0.5, 0.5, -0.5,-0.5, 0.5,
        0.5,-0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5,-0.5, 0.5,
        -0.5,-0.5,-0.5, -0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5,-0.5,-0.5,
        -0.5, 0.5,-0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,-0.5, 
        //-5, -1, 5, 5, -1, 5, 5, -1, -5, -5, -1,-5, 
     ];

     colors = [
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        0,1,0, 0,1,0, 0,1,0, 0,1,0,
        0,0,1, 0,0,1, 0,0,1, 0,0,1,
        1,0,1, 1,0,1, 1,0,1, 1,0,1,
        1,1,0, 1,1,0, 1,1,0, 1,1,0,
        0,1,1, 0,1,1, 0,1,1, 0,1,1,
        //0.5,0.5,0.5, 0.5,0.5,0.5, 0.5,0.5,0.5, 0.5,0.5,0.5
     ];

     boxIndices = [
        0,1,2, 0,2,3, 4,5,6, 4,6,7,
        8,9,10, 8,10,11, 12,13,14, 12,14,15,
        16,17,18, 16,18,19, 20,21,22, 20,22,23,
        //24,25,26, 24,26,27 
     ];
}
function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    xyz_angles[current_axis] += 0.6;
    xyz_angles[current_axis] %=  360;

    gl.uniform3fv(theta_location,xyz_angles);
    gl.uniformMatrix4fv(proj_location,false,flatten(projMat));
    gl.uniformMatrix4fv(view_location,false,flatten(viewMat));

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimFrame(render);
}