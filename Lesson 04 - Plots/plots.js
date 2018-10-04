var gl;
var points=[];
function init(){
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if(!gl) alert("can't initialize webgl");
    
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    document.getElementById("out-scr").innerText="The canvas size is : " + canvas.width;
    gl.clearColor(1.0,1.0,1.0,1.0);

    var program=initShaders(gl,"vertex-shader","fragment-shader");
    gl.useProgram(program);

    calcLinePoints();
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
    gl.drawArrays(gl.LINE_STRIP,0,points.length);
}
function calcLinePoints()
{
    var p;
    for(x=-4;x<=4;x+=0.1)
    {
        //p=vec2(x/4,(x*x+2*x+1)/4); points.push(p);
        p=vec2(x/4,Math.sin(x)/4);  points.push(p);
       //p=vec2(x/4,(Math.pow(x,3))/4); points.push(p);
       //p=vec2(x/4,(Math.pow(Math.E,x))/4); points.push(p);
    }
}
