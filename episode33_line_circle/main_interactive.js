
window.onload = function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight;

	var radius = 100;

	var p0 = {
			x: 100,
			y: 200
		},
		p1 = {
			x: 1000,
			y: 200
		},
		p2 = {
			x: 600,
			y: 300
		},
		clickPoint;

	

	document.body.addEventListener("mousedown", onMouseDown);

	function onMouseDown(event) {
		clickPoint = getClickPoint(event.clientX, event.clientY);
		if(clickPoint) {
			document.body.addEventListener("mousemove", onMouseMove);
			document.body.addEventListener("mouseup", onMouseUp);
		}
	}

	function onMouseMove(event) {
		clickPoint.x = event.clientX;
		clickPoint.y = event.clientY;
		render();
	}

	function onMouseUp(event) {
		document.body.removeEventListener("mousemove", onMouseMove);
		document.body.removeEventListener("mouseup", onMouseUp);
	}

	function getClickPoint(x, y) {
		var points = [p0, p1, p2];
		for(var i = 0; i < points.length; i++) {
			var p = points[i],
				dx = p.x - x,
				dy = p.y - y,
				dist = Math.sqrt(dx * dx + dy * dy);
			if(dist < 10) {
				return p;
			}

		}
	}

	render();

	function render() {
		context.clearRect(0, 0, width, height);
		drawPoint(p0);
		drawPoint(p1);
		drawPoint(p2);

		var dist0 = Math.sqrt( ((p0.x-p1.x)*(p0.x-p1.x)) + ((p0.y-p1.y)*(p0.y-p1.y)));

		var dxp = (p0.x - p1.x)/dist0;
		var dyp = (p0.y - p1.y)/dist0;

		var lineLength = Math.sqrt( ((p0.x-p1.x)*(p0.x-p1.x)) + ((p0.y-p1.y)*(p0.y-p1.y)));

		var dx = (p0.x - p1.x)/lineLength*radius;
		var dy = (p0.y - p1.y)/lineLength*radius;

		//circle normal to line
		var cntl0 = {
			x: (p2.x+dy),
			y: (p2.y-dx)
		},
		cntl1 = {
			x: (p2.x-dy),
			y: (p2.y+dx)
		}

		var disected = false;

		var distancetoline = lineDistance(p2, p0, p1);

		if(distancetoline<radius) {
			var intersect = lineIntersect(p0, p1, cntl0, cntl1);
			if(intersect) {

				var newradius = Math.sqrt((radius*radius)-(distancetoline*distancetoline));

				var pol = {
					x: intersect.x+(dxp*newradius),
					y: intersect.y+(dyp*newradius)
				}

				if(pointonLine(pol, p0, p1)){
					// draw red hit circle
					context.beginPath();
					context.strokeStyle = "red";
					context.arc(pol.x, pol.y, 15, 0, Math.PI * 2, false);
					context.stroke();
					// draw our red line
					context.beginPath();
					context.moveTo(p0.x, p0.y);
					context.lineTo(pol.x, pol.y);
					context.stroke();
					disected = true;
				}

				var pol = {
					x: intersect.x-(dxp*newradius),
					y: intersect.y-(dyp*newradius)
				}

				if(pointonLine(pol, p0, p1)){
					// draw blue hit circle
					context.beginPath();
					context.strokeStyle = "blue";
					context.arc(pol.x, pol.y, 15, 0, Math.PI * 2, false);
					context.stroke();
					// draw our blue line
					context.beginPath();
					context.moveTo(p1.x, p1.y);
					context.lineTo(pol.x, pol.y);
					context.stroke();
					disected = true;
				}

				if( (pointDistance(p2,p0)<radius)&&(pointDistance(p2,p1)<radius) ) {
					disected = true;
				}

			}
		}
		if(!disected) {
			// draw our line black
			context.beginPath();
			context.strokeStyle = "black";
			context.moveTo(p0.x, p0.y);
			context.lineTo(p1.x, p1.y);
			context.stroke();
		}


		// draw our circle
		context.beginPath();
		context.strokeStyle = "black";
		context.arc(p2.x, p2.y, radius, 0, Math.PI * 2, false);
		context.stroke();

	}

	function drawPoint(p) {
		context.beginPath();
		context.strokeStyle = "black";
		context.arc(p.x, p.y, 10, 0, Math.PI * 2, false);
		context.fillStyle = "white";
		context.fill();
		context.stroke();
	}

	function signedlineDistance(p0, p1, p2) {
		return ( ( ((p2.x-p1.x)*(p1.y-p0.y)) - ((p1.x-p0.x)*(p2.y-p1.y)) )/(Math.sqrt( (((p2.x-p1.x)*(p2.x-p1.x)) + ((p2.y-p1.y)*(p2.y-p1.y)))) ));
	}

	function pointDistance(p0, p1) {
		return Math.sqrt( (((p1.x-p0.x)*(p1.x-p0.x)) + ((p1.y-p0.y)*(p1.y-p0.y))));
	}

	function pointonLine(p0, p1, p2) {
		//rounding errors
		//return pointDistance(p1, p0) + pointDistance(p2, p0) == pointDistance(p1, p2);

		if(p0.x<Math.min(p1.x,p2.x)) {
			return false;
		}
		if(p0.y<Math.min(p1.y,p2.y)) {
			return false;
		}

		if(p0.x>Math.max(p1.x,p2.x)) {
			return false;
		}
		if(p0.y>Math.max(p1.y,p2.y)) {
			return false;
		}

		return true;
	}

//return distance(A, C) + distance(B, C) == distance(A, B);

	function lineDistance(p0, p1, p2) {
		return ( Math.abs( ((p2.x-p1.x)*(p1.y-p0.y)) - ((p1.x-p0.x)*(p2.y-p1.y)) )/(Math.sqrt( (((p2.x-p1.x)*(p2.x-p1.x)) + ((p2.y-p1.y)*(p2.y-p1.y)))) ));
	}

	function lineIntersect(p0, p1, p2, p3) {
		var A1 = p1.y - p0.y,
			B1 = p0.x - p1.x,
			C1 = A1 * p0.x + B1 * p0.y,
			A2 = p3.y - p2.y,
			B2 = p2.x - p3.x,
			C2 = A2 * p2.x + B2 * p2.y,
			denominator = A1 * B2 - A2 * B1;

		if(denominator == 0) {
			return null;
		}

		return {
			x: (B2 * C1 - B1 * C2) / denominator,
			y: (A1 * C2 - A2 * C1) / denominator
		}
	}


	function segmentIntersect(p0, p1, p2, p3) {
		var A1 = p1.y - p0.y,
			B1 = p0.x - p1.x,
			C1 = A1 * p0.x + B1 * p0.y,
			A2 = p3.y - p2.y,
			B2 = p2.x - p3.x,
			C2 = A2 * p2.x + B2 * p2.y,
			denominator = A1 * B2 - A2 * B1;

		if(denominator == 0) {
			return null;
		}

		var intersectX = (B2 * C1 - B1 * C2) / denominator,
			intersectY = (A1 * C2 - A2 * C1) / denominator,
			rx0 = (intersectX - p0.x) / (p1.x - p0.x),
			ry0 = (intersectY - p0.y) / (p1.y - p0.y),
			rx1 = (intersectX - p2.x) / (p3.x - p2.x),
			ry1 = (intersectY - p2.y) / (p3.y - p2.y);

		if(((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) && 
		   ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))) {
			return {
				x: intersectX,
				y: intersectY
			};
		}
		else {
			return null;
		}
	}
};