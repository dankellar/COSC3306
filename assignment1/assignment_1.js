var VS = "attribute vec4 a_P;\n"+
         "attribute vec4 a_C;\n"+
		 "varying vec4 v_C;\n"+
         "void main()\n"+
		 "{\n"+
		 "gl_Position = a_P;\n"+
		 "v_C = a_C;\n"+
		 "gl_PointSize=2.0;\n"+
		 "}\n";

var FS = "precision mediump float;\n"+
         "varying vec4 v_C;\n"+
         "void main()\n"+
         "{\n"+
		 "gl_FragColor = v_C;\n"+
		 "}\n";

function main()
{
	var canvas = document.getElementById("pikture");
	
	if (!canvas)
	{
		console.log("Failed to get canvas");
		return;
	}
	
	var gl = getWebGLContext(canvas)
	
	if (!gl)
	{
		console.log("Failed to get WebGL Context");
		return;
	}
	
	if (!initShaders(gl, VS, FS))
	{
		console.log("Failed to initialize the shaders");
		return;
	}
	
	doTheThing(gl);
	
	gl.clearColor(0.0, 0.5, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	gl.drawArrays(gl.TRIANGLE_STRIP, 4, 5);
	gl.drawArrays(gl.TRIANGLES, 9, 24);
	
	//That this is a LINE_STRIP means nothing but fulfulling that requirement
	gl.drawArrays(gl.LINE_STRIP, 33, 12);
	
	gl.drawArrays(gl.POINTS, 47, 16);
	
	gl.drawArrays(gl.TRIANGLE_FAN, 63, 4);
	gl.drawArrays(gl.TRIANGLES, 67, 3);
	
	// This LINE_LOOP is supposed to act like glare, but I have no idea what I'm doing at this point.
	gl.drawArrays(gl.LINE_LOOP, 70, 3);
	
	// These are supposed to be clouds. Use you imagination.
	gl.drawArrays(gl.LINES, 73, 4);
	
	console.log(intersect_X(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0))
	console.log(intersect_Y(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0))
	console.log(Y_A(-0.1, 0.8, 0.8, -0.3, intersect_X(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0)))
}

function M(x1, y1, x2, y2)
{
	return (y2 - y1) / (x2 - x1);
}

function Y(m, x, b)
{
	return m * x + b;
}

function X(m, b, y)
{
	return (y - b) / m;
}

function X_A(x1, y1, x2, y2, y)
{
	var m = M(x1, y1, x2, y2);
	var b = B(y1, m, x1);
	return X(m, b, y);
}

function Y_A(x1, y1, x2, y2, x)
{
	var m = M(x1, y1, x2, y2);
	console.log("slope: " + m);
	var b = B(y1, m, x1);
	console.log(b);
	return Y(m, x, b);
}

function B(y, m, x)
{
	return y - m * x;
}

function intersect_X(x1, y1, x2, y2, x3, y3, x4, y4)
{
	var m1 = M(x1, y1, x2, y2);
	var m2 = M(x3, y3, x4, y4);
	var b1 = B(y1, m1, x1);
	var b2 = B(y3, m2, x3);
	
	return (b2 - b1) / (m1 - m2);
}

function intersect_Y(x1, y1, x2, y2, x3, y3, x4, y4)
{
	
	var m1 = M(x1, y1, x2, y2);
	
	return M(x1, y1, x2, y2) * intersect_X(x1, y1, x2, y2, x3, y3, x4, y4) + B(y1, m1, x1);
}

function doTheThing(gl)
{
	var vertices = new Float32Array([
									 //DAT SKY DOE
									 // Make one side a little darker than the other + pretty gradient
									 -1.0,  1.0,	0.3, 0.3, 0.8, //+That there are two different values here
									 -1.0, -0.3,    1.0, 1.0, 0.5, //-Same about here
									  1.0,  1.0,	0.3, 0.3, 1.0, //+and here is intentional. Makes a subtle, but nice difference, IMO 
									  1.0, -0.3,	1.0, 1.0, 0.2, //-and here.
									  
									  //MOUNTAINS
									  // MIDDLE "MOUNTAIN"
									 -0.1, 0.8,		0.5, 0.5, 0.5, //4
									  0.8, -0.3,	0.3, 0.3, 0.3,
									 -1.0, -0.3,	0.3, 0.3, 0.3,
									  
									  // LEFT "MOUNTAIN"
									 -0.2, -0.3,	0.3, 0.3, 0.3, //7
									 -0.6,  0.3,	0.5, 0.5, 0.5,
									  
									  // RIGHT "MOUNTAIN"
									  // Since this one shares no points with either
									  // of the other two, it must be drawn with TRIANGLES
									  0.6, -0.3,	0.3, 0.3, 0.3, // 9
									  1.0, -0.3,	0.3, 0.3, 0.3,
									  0.8,  0.0,	0.5, 0.5, 0.5,
									  
									  //SNOW PEAKS
									  
									  // CENTER "MOUNTAIN"
									  // Top, Right, Left
									  -0.1, 0.8, 1.0, 1.0, 1.0, //12
									  X(M(-0.1, 0.8, 0.8, -0.3), B(-0.3, M(-0.1, 0.8, 0.8, -0.3), 0.8), 0.7), 0.7, 1.0, 1.0, 1.0,
									  X(M(-1.0, -0.3, -0.1, 0.8), B(0.8, M(-1.0, -0.3, -0.1, 0.8), -0.1), 0.7), 0.7, 1.0, 1.0, 1.0,
									  
									  X(M(-1.0, -0.3, -0.1, 0.8), B(0.8, M(-1.0, -0.3, -0.1, 0.8), -0.1), 0.7), 0.7, 1.0, 1.0, 1.0,
									  X(M(-1.0, -0.3, -0.1, 0.8), B(0.8, M(-1.0, -0.3, -0.1, 0.8), -0.1), 0.7) + 0.03, 0.63, 1.0, 1.0, 1.0,
									  -0.1, 0.8, 1.0, 1.0, 1.0,
									  
									  X(M(-1.0, -0.3, -0.1, 0.8), B(0.8, M(-1.0, -0.3, -0.1, 0.8), -0.1), 0.7) + 0.1, 0.63, 1.0, 1.0, 1.0, // 18
									  X(M(-0.1, 0.8, 0.8, -0.3), B(-0.3, M(-0.1, 0.8, 0.8, -0.3), 0.8), 0.7), 0.7, 1.0, 1.0, 1.0,
									  //X(M(-1.0, -0.3, -0.1, 0.8), B(0.8, M(-1.0, -0.3, -0.1, 0.8), -0.1), 0.7), 0.7, 1.0, 1.0, 1.0,
									  X_A(-1.0, -0.3, -0.1, 0.8, 0.7), 0.7, 1.0, 1.0, 1.0,
									  
									  // LEFT MOUNTAIN
									  //-1.0, -0.3,	0.3, 0.3, 0.3, LEFT
									  //-0.2, -0.3,	0.3, 0.3, 0.3, //7 RIGHT
									  //-0.6,  0.3,	0.5, 0.5, 0.5, TOP
									  
									  // Top, Right, Left
									  -0.6,  0.3, 1.0, 1.0, 1.0, // 21
									  X_A(-0.6, 0.3, -0.2, -0.3, 0.2), 0.2, 1.0, 1.0, 1.0,
									  X_A(-1.0, -0.3, -0.6, 0.3, 0.2), 0.2, 1.0, 1.0, 1.0,
									  
									  X_A(-1.0, -0.3, -0.6, 0.3, 0.2), 0.2, 1.0, 1.0, 1.0,
									  X_A(-1.0, -0.3, -0.6, 0.3, 0.2) + 0.05, 0.15, 1.0, 1.0, 1.0,
									  -0.6,  0.3, 1.0, 1.0, 1.0,
									  
									  X_A(-0.6, 0.3, -0.2, -0.3, 0.2) - 0.09, 0.1, 1.0, 1.0, 1.0,
									  X_A(-0.6, 0.3, -0.2, -0.3, 0.2), 0.2, 1.0, 1.0, 1.0,
									  -0.6,  0.3, 1.0, 1.0, 1.0,
									  
									  // RIGHT MOUNTAIN
									  //0.6, -0.3,	0.3, 0.3, 0.3, LEFT
									  //1.0, -0.3,	0.3, 0.3, 0.3, RIGHT
									  //0.8,  0.0,	0.5, 0.5, 0.5, TOP
									  
									  // TOP, RIGHT, LEFT
									  0.8, 0.0, 1.0, 1.0, 1.0,  // 30
									  X_A(1.0, -0.3, 0.8, 0.0, -0.05), -0.05, 1.0, 1.0, 1.0,
									  X_A(0.8, 0.0, 0.6, -0.3, -0.05), -0.05, 1.0, 1.0, 1.0,
									  
									  
									  -0.1, -1.0, 0.0, 0.0, 1.0,
									  1.0, -0.3, 0.0, 0.0, 1.0,
									  
									  -0.095, -1.0, 0.0, 0.0, 1.0,
									  1.0, -0.305, 0.0, 0.0, 1.0,
									  
									  -0.090, -1.0, 0.0, 0.0, 1.0,
									  1.0, -0.31, 0.0, 0.0, 1.0,
									  
									  -0.085, -1.0, 0.0, 0.0, 1.0,
									  1.0, -0.315, 0.0, 0.0, 1.0,
									  
									  -0.080, -1.0, 0.0, 0.0, 1.0,
									  1.0, -0.32, 0.0, 0.0, 1.0,
									  
									  -0.075, -1.0, 0.0, 0.0, 1.0,
									  1.0, -0.325, 0.0, 0.0, 1.0,
									  
									  -1.0, -0.30005,	0.0, 0.0, 0.0,
									   1.0, -0.30005, 	0.0, 0.0, 0.0,
									   
									   
									   //stars
									   0.9, 0.9, 1.0, 1.0, 1.0,
									   0.85, 0.7, 1.0, 1.0, 1.0,
									   0.70, 0.8, 1.0, 1.0, 1.0,
									   0.65, 0.75, 1.0, 1.0, 1.0,
									   0.50, 0.95, 1.0, 1.0, 1.0,
									   0.45, 0.7, 1.0, 1.0, 1.0,
									   0.30, 0.85, 1.0, 1.0, 1.0,
									   0.15, 0.73, 1.0, 1.0, 1.0,
									   0.0, 0.90, 1.0, 1.0, 1.0,
									   -0.15, 0.8, 1.0, 1.0, 1.0,
									   -0.3, 0.85, 1.0, 1.0, 1.0,
									   -0.45, 0.7, 1.0, 1.0, 1.0,
									   -0.60, 0.95, 1.0, 1.0, 1.0,
									   -0.75, 0.8, 1.0, 1.0, 1.0,
									   -0.9, 0.7, 1.0, 1.0, 1.0,
									   -0.95, 0.95, 1.0, 1.0, 1.0,
									   
									   //MOON
									   -0.65, 0.8, 0.8, 0.8, 0.8,
									   -0.70, 0.85, 0.2, 0.2, 0.2,
									   -0.65, 0.9, 0.8, 0.8, 0.8,
									   -0.6, 0.85, 0.8, 0.8, 0.8,
									   
									   /*
									   -0.1, 0.8, 1.0, 0.0, 0.0,
									   0.8, -0.3, 1.0, 0.0, 0.0,
									   0.6, -0.3, 1.0, 0.0, 0.0,
									   0.8, 0.0, 1.0, 0.0, 0.0,*/
									   
									   // SUN
									   intersect_X(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0), intersect_Y(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0), 1.0, 0.3, 0.3,
									   X_A(-0.1, 0.8, 0.8, -0.3, intersect_Y(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0) + 0.05), intersect_Y(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0) + 0.05, 1.0, 0.8, 0.3,
									   X_A(0.6, -0.3, 0.8, 0.0, intersect_Y(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0) + 0.05), intersect_Y(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0) + 0.05, 1.0, 0.8, 0.3,
									   
									   
									   intersect_X(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0), intersect_Y(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0) + 0.01, 1.0, 0.3, 0.3,
									   X_A(-0.1, 0.8, 0.8, -0.3, intersect_Y(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0) + 0.05) - 0.01, intersect_Y(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0) + 0.06, 1.0, 0.8, 0.3,
									   X_A(0.6, -0.3, 0.8, 0.0, intersect_Y(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0) + 0.05) + 0.01, intersect_Y(-0.1, 0.8, 0.8, -0.3, 0.6, -0.3, 0.8, 0.0) + 0.06, 1.0, 0.8, 0.3,
									   
									   
									   // CLOUDS
									   // TODO: ADD MOAR KLOWDS
									   0.7, 0.5, 0.93, 0.93, 0.93,
									   0.5, 0.5, 0.93, 0.93, 0.93,
									   -0.4, 0.3, 0.93, 0.93, 0.93,
									   -0.3, 0.3, 0.93, 0.93, 0.93,
									   
									 ]);
	
	var f = vertices.BYTES_PER_ELEMENT;
	
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	
	var a_P = gl.getAttribLocation(gl.program, "a_P");
	
	if (a_P < 0)
	{
		console.log("Failed to locate attribute position");
		return -1;
	}
	
	gl.vertexAttribPointer(a_P, 2, gl.FLOAT, false, f * 5, 0);
	gl.enableVertexAttribArray(a_P);
	
	var a_C = gl.getAttribLocation(gl.program, "a_C");
	
	gl.vertexAttribPointer(a_C, 3, gl.FLOAT, false, f * 5, f * 2);
	gl.enableVertexAttribArray(a_C);
}