var gl;
function init()
{
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL (canvas);
    if(!gl) {this.alert("WebGL isn't available");}
    
    //configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(1.0,1.0,1.0,1.0);

    //load shaders
    var program=initShaders(gl,"vertex-shader","fragment-shader");
    gl.useProgram(program);

    //load the data into the GPU
    var vertices = new Float32Array([-1,-1,0,1,1,-1]);
    var bufferid=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,bufferid);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

    //associate out shader variables with our data buffer
    var vPosition=gl.getAttribLocation(program,"vPosition");
    gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vPosition);
    render();

}
function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,3);
}
