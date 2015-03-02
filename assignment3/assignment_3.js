var vertex = 'attribute vec4 a_Position;\n \
			  \
			  void main()\n\
			  {\n\
				gl_Position = a_Position;\
			  }';
var fragment = 'precision mediump float;\n\
				uniform vec4 u_Colour;\n\
				\
				void main()\n\
				{\n\
					gl_FragColor = u_Colour;\n\
				}';

var v;
var buffer;
var canvas;
var gl;
var box;

var elems = 0;

// <Original line>
var ox1;
var oy1;

var ox2;
var oy2;

var r0 = 0.0;
var g0 = 0.0;
var b0 = 0.0;
// </Original line>

// <Clipped line>
var cx1;
var cy1;

var cx2;
var cy2;

var r1 = 1.0;
var g1 = 0.0;
var b1 = 0.0;
// </Clipped Line>

// <Bounding box>
var x = 0.7;
var y = 0.7;

var height = 1.4;
var width = 1.4;

var r = 0.0;
var g = 1.0;
var b = 0.0;
// </Bounding box>

var down = false; // is the mouse down?

function main()
{
	canvas = document.getElementById("canofvase");
	
	if (!canvas)
	{
		console.log("What we have here, is a failure to communicate");
		return;
	}
	
	box = canvas.getBoundingClientRect();
	
	gl = getWebGLContext(canvas);
	
	if (!gl)
	{
		console.log("Who needs that stinkin' GL biznis anyways? Oh wait, we do D:");
		return;
	}
	
	if (!initShaders(gl, vertex, fragment))
	{
		console.log("Happy debugging :D");
		return;
	}
	
	gl.clearColor(0.7, 0.7, 0.74, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	rekit();
	
	document.addEventListener("keydown", setAlgorithm, true);
	document.addEventListener("mousedown", mouseOne, true);
	document.addEventListener("mouseup", mouseTwo, true);
	document.addEventListener("mousemove", mouseThree, true);
}

function rekit()
{
	v = [x, y,
		 x - width, y,
		 x - width, y - height,
		 x, y - height];
	
	elems = 8;
	
	buffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.DYNAMIC_DRAW);
	
	var a_Position = gl.getAttribLocation(gl.program, "a_Position");
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);
	
	var u_Colour = gl.getUniformLocation(gl.program, "u_Colour");
	
	gl.uniform4f(u_Colour, r, g, b, 1.0);
	gl.drawArrays(gl.LINE_LOOP, 0, 4);
	
}

function subData()
{
	var s = v.length;
	console.log("s: " + s);
	var f = v.BYTES_PER_ELEMENT;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(v));
}


function inBox(e)
{
	if (e.clientX < box.left || e.clientX > box.right) return false;
	if (e.clientY < box.top || e.clientY > box.bottom) return false;
	
	return true;
}

function canvasCoord(e)
{
	var xz = box.left + box.width / 2;
	var yz = box.top + box.height / 2;
	
	return [ (event.clientX - xz) / (box.right / 2),
			 (yz - event.clientY) / (box.bottom / 2)];
}

function setAlgorithm(e)
{
}

function mouseOne(e)
{
	if (inBox(e))
	{
		//console.log("Mouse down");
		
		down = true;
		
		var c = canvasCoord(e);
		
		ox1 = c[0];
		oy1 = c[1];
		
		v.push(ox1);
		v.push(oy1);
		
		ox2 = ox1;
		oy2 = oy1;
		
		v.push(ox2);
		v.push(oy2);
		
		subData();
		
		console.log(ox1 + " " + oy1);
	}
}

function mouseTwo(e)
{
	if (inBox(e) && down == true)
	{
		console.log("Mouse up");
		
		var c = canvasCoord(e);
		
		v.pop();
		v.pop();
		
		ox2 = c[0];
		oy2 = c[0];
		
		v.push(ox2);
		v.push(oy2);
		
		down = false;
		
		
		subData();
	}
}

function mouseThree(e)
{
	if (inBox(e))
	{
		//console.log("Mouse move");
	}
}