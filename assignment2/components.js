
var vertex = "attribute vec4 a_Position;\
			  uniform mat4 u_ModelMatrix;\
			  \
			  void main()\
			  {\
			  gl_Position = u_ModelMatrix * a_Position;\
			  }";

var fragment = "precision mediump float;\
				uniform vec4 u_Colour;\
				\
				void main()\
				{\
				gl_FragColor = u_Colour;\
				}";

// not the same as the background colour.
// I.
// WIN!
var r = 0.65;
var g = 0.65;
var b = 0.65;

var gl;
var canvas;

var Tx = 0.0;
var Ty = 0.0;

var Sx = 1.0;
var Sy = 1.0;

var rotate = 30.0;

var u_Col;

var count = 0;

var interval = 100.0;
var stop = false;

var now = 0;
var last = 0;

var tick;

function main()
{
	canvas = document.getElementById("gl");
	
	if (!canvas)
	{
		console.log("Couldn't find canvas");
		return;
	}
	
	gl = getWebGLContext(canvas);
	
	if(!gl)
	{
		console.log("Couldn't get the context");
		return;
	}
	
	if (!initShaders(gl, vertex, fragment))
	{
		console.log("Does this actually need to exist? I mean if the shaders aren't initialized, doesn't it throw a shitload of errors on its own?");
		return;
	}
	
	u_Col = gl.getUniformLocation(gl.program, "u_Colour");
	
	var u_Matrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
	
	var model = new Matrix4();
	
	window.addEventListener( "keydown", setColour, true );
	window.addEventListener("click", setTranslation, true);
	
	gl.clearColor(0.6, 0.6, 0.6, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	var foo = fighters();
	gl.uniform4f(u_Col, r, g, b, 1);
	
	last = Date.now();
	
	tick = function()
	{
		now = Date.now();
		
		// I tried firguring out 10 per minute (second?), but it got broke.
		// I initially thought 1000.0 / interval (1000 ms in 1 s, interval = 10, should draw once every 100 ms, given 10 draws per second).
		// Now, I'm a little tired, so my refelxes weren't good enough for a stop watch to time whether or not it was drawing at
		// the proper rate, and changing interval either did nothing broke it even harder (for larger changes). So, I give up.
		if (now - last >= (60000.0 / interval))
		{
			draw(gl, foo, rotate, model, u_Matrix);
			if (!stop) count++;
			last = Date.now();
		}
		requestAnimationFrame(tick, canvas);
	}
	tick();
}

function fighters()
{
	var v = new Float32Array([ 0.0, 0.0,
							  -0.2, 0.2,
							   0.0, 0.2,
	
							  -0.2, 0.2,
							  -0.1, 0.3,
							   0.0, 0.2,
	
							   0.0, 0.2,
							   0.1, 0.3,
							   0.2, 0.2,
	
							   0.0, 0.2,
							   0.2, 0.2,
							   0.0, 0.0]);
	
	var buffer = gl.createBuffer();
	
	if (!buffer)
	{
		console.log("Failed to create a buffer");
		return -1;
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);
	
	var a_Pos = gl.getAttribLocation(gl.program, "a_Position");
	
	gl.vertexAttribPointer(a_Pos, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Pos);
	
	return 12;
}

function setColour(event)
{
	console.log(event.keyCode);
	var code = event.keyCode;
	
	switch(code)
	{
		//RED
		case 82:
			r = 0.72157;
			g  = 0.21961;
			b  = 0.23137;
			break;
		case 71:
			r = 0.25882;
			g = 0.30980;
			b = 0.23137;
			break;
		//BLU
		case 66:
			r  = 0.345098;
			g = 0.521569;
			b = 0.635294;
			break;
		case 65:
			r = 0.90588;
			g = 0.7098;
			b = 0.2317;
			break;
		case 79:
			r = 0.81176;
			g = 0.45098;
			b = 0.21176;
			break;
		
		
		
		//PAGEDOWN
		case 34:
			if (interval > 110)
			interval -= 50;
			else interval = 60;
			break;
			
		// PAGEUP
		case 33:
			if (interval < 950)
			interval += 50;
			else interval = 1000;
			break;
		
		case 107:
			updateRotate2("+");
			break;
		case 109:
			updateRotate2("-");
			break;
		case 73:
			console.log("interval: " + interval);
			break;
	}
}

function draw(gl, n, angle, matrix, u_model)
{
	gl.clearColor(0.6, 0.6, 0.6, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	matrix.setTranslate(Tx, Ty, 0);
	matrix.scale(Sx, Sy, 1);
	
	for (var i = 1; i <= count; i++)
	{
		gl.uniform4f(u_Col, r, g, b, 1);
		gl.drawArrays(gl.TRIANGLES, 0, n);
		gl.uniform4f(u_Col, 0, 0, 0, 1);
		gl.drawArrays(gl.LINE_STRIP, 0, 2);
		gl.drawArrays(gl.LINE_STRIP, 3, 3);
		gl.drawArrays(gl.LINE_STRIP, 6, 3);
		gl.drawArrays(gl.LINE_STRIP, 10, 2);
		matrix.rotate(angle, 0, 0, 1);
		gl.uniformMatrix4fv(u_model, false, matrix.elements);
	}
	
}

function updateRotate()
{
	var s = document.getElementById("rot");
	rotate = s.value;
	
	document.getElementById("ra").innerHTML=s.value;
}

function updateRotate2(dir)
{
	if (dir == "+")
	{
		if (rotate <= 40) rotate += 5;
		else rotate = 45;
	}
	
	else if (dir == "-")
	{
		if (rotate >= 10) rotate -= 5;
		else rotate = 5;
	}
	
	document.getElementById("rot").value = rotate;
	
	document.getElementById("ra").innerHTML = rotate;
}

function toggle(state)
{
	if (state == 'on')
	{
		stop = false;
	}
	
	else if (state == 'off')
	{
		stop = true;
	}
}

function setScale(size)
{
	Sx = Sy = size;
}

function setTranslation(event)
{
	var box = canvas.getBoundingClientRect();
	
	var xz = box.left + box.width / 2;
	var yz = box.top + box.height / 2;
	
	if (event.clientX < box.left || event.clientX > box.right) return;
	if (event.clientY < box.top || event.clientY > box.bottom) return;
	console.log((event.clientX) + " " + (event.clientY));
	
	Tx = (event.clientX - xz) / (box.right / 2);
	Ty = (yz - event.clientY) / (box.bottom / 2);
	
	console.log("Tx: " + Tx + "\nTy: " + Ty);
}

function refresh()
{
	
	r = 0.7;
	g = 0.7;
	b = 0.7;
	
	last = 0;
	now = 0;
	
	count = 0;
	Tx = Ty = 0;
	Sx = Sy = 1;
	rotate = 30;
	interval = 100;
	stop = true;
	
	document.getElementById("one").checked="checked";
	document.getElementById("rot").value=30;
	document.getElementById("ra").innerHTML="30";
}