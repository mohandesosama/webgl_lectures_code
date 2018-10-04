///<reference path="../Common/webgl.d.ts" />
var gl;
var vertices;
var points=[];
var depth=5;
function init(){
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if(!gl) alert("can't initialize webgl");
    
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(0.0,0.0,0.0,1.0);

    var program=initShaders(gl,"vertex-shader","fragment-shader");
    gl.useProgram(program);

    vertices = [vec2(-1,-1),vec2(0,1),vec2(1,-1)];
    divideTriangle(vertices[0],vertices[1],vertices[2],depth);
    //to GPU
    var bufferid=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,bufferid);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(points),gl.STATIC_DRAW);

    //Let shaders workout these vertices. 
    var vPosition=gl.getAttribLocation(program,"vPosition");
    gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vPosition);
    render();
}
function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,points.length);
}
function addTriangle(a,b,c)
{
    points.push(a,b,c);
}
function divideTriangle(a,b,c,fdepth){
    if(fdepth==0){
        addTriangle(a,b,c);
    }
    else{
        //bisect sides
        var ab=mix(a,b,0.5);
        var ac=mix(a,c,0.5);
        var bc=mix(b,c,0.5);
        
        divideTriangle(a,ab,ac,fdepth-1);
        divideTriangle(c,ac,bc,fdepth-1);
        divideTriangle(b,bc,ab,fdepth-1);
        
    }
}
