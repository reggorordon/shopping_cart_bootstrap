
   
 <script>
	 (function() {
	var canvas = document.querySelector('#paint');
	var ctx = canvas.getContext('2d');
	
	var sketch = document.querySelector('#sketch');
	var sketch_style = getComputedStyle(sketch);
	canvas.width = parseInt(sketch_style.getPropertyValue('width'));
	canvas.height = parseInt(sketch_style.getPropertyValue('height'));
	
	var canvas_small = document.getElementById('brush_size');
    var context_small = canvas_small.getContext('2d');
    var centerX = canvas_small.width / 2;
    var centerY = canvas_small.height / 2;
    var radius ;

     
	
	
	// Creating a tmp canvas
	var tmp_canvas = document.createElement('canvas');
	var tmp_ctx = tmp_canvas.getContext('2d');
	tmp_canvas.id = 'tmp_canvas';
	tmp_canvas.width = canvas.width;
	tmp_canvas.height = canvas.height;
	
	sketch.appendChild(tmp_canvas);

	var mouse = {x: 0, y: 0};
	var start_mouse = {x: 0, y: 0};
	var last_mouse = {x: 0, y: 0};
	
	var sprayIntervalID;
	
	// Pencil Points
	var ppts = [];
	
	//undo array
	var undo_arr = [];// NEWTHING
	
	var undo_count = 0;// NEWTHING
	
	var empty_canv; // NEWTHING
	
	
	
	
	
	// current tool
	var tool = 'brush';
	 
	 $('#tools button').on('click', function(){
            tool = $(this).attr('id');
            console.log(tool);
        })
		
		 
		 //NEWTHING
		 $('#colors button').on('click', function(){
            tmp_ctx.strokeStyle = $(this).attr('id');
			tmp_ctx.fillStyle = tmp_ctx.strokeStyle;
            console.log(tmp_ctx.strokeStyle);
			
			drawBrush();
        })
		
	
	
	/* Mouse Capturing Work */
	tmp_canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);
	
	canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);
	
	
			
		//NEWTHING
	var drawBrush = function() {
	
	context_small.clearRect(0, 0, canvas_small.width, canvas_small.height);
		
		radius = tmp_ctx.lineWidth;
		radius = radius / 2;
		
		context_small.beginPath();
		context_small.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context_small.fillStyle = tmp_ctx.strokeStyle;
		context_small.globalAlpha = tmp_ctx.globalAlpha;
		context_small.fill();
		
		};
		
	
	
	/* Drawing on Paint App */
	tmp_ctx.lineWidth = document.getElementById("width_range").value;
	//tmp_ctx.lineWidth = 5;
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = 'blue';
	tmp_ctx.fillStyle = 'blue';
	//tmp_ctx.globalAlpha = 0.5;
			
	//show current brush view  //NEWTHING
	drawBrush();
	
	empty_canv = canvas.toDataURL(); //NEWTHING
	undo_arr.push(empty_canv); //NEWTHING
	
	tmp_canvas.addEventListener('mousedown', function(e) {
		tmp_canvas.addEventListener('mousemove', onPaint, false);
		
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
		
		start_mouse.x = mouse.x;
		start_mouse.y = mouse.y;
		
		ppts.push({x: mouse.x, y: mouse.y});
		
		
		//spraying tool.
		sprayIntervalID = setInterval(onPaint, 50);
		
		onPaint();
		//onPaintCircle();
		
	}, false);
	
	tmp_canvas.addEventListener('mouseup', function() {
		tmp_canvas.removeEventListener('mousemove', onPaint, false);
		
		// for erasing
		ctx.globalCompositeOperation = 'source-over';
		//spraying tool.
		clearInterval(sprayIntervalID);
		
		// Writing down to real canvas now
		ctx.drawImage(tmp_canvas, 0, 0);
		// Clearing tmp canvas
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		// Emptying up Pencil Points
		ppts = [];
		
		
		
		undo_arr.push(canvas.toDataURL());	 //NEWTHING
		//window.alert(undo_arr.length);
		undo_count = 0; //NEWTHING
		
		
	}, false);
	
	
	
	
	//NEWTHING
	
	document.getElementById("undo").addEventListener("click", function(){
	
	/*window.alert(undo_count);
	window.alert(undo_arr.length);*/
	

	if ( undo_arr.length > 1 ) {
		
								
						
				if ( undo_count + 1 < undo_arr.length ) {
					if ( undo_count + 2 == undo_arr.length ) { 
						if (confirm("Do you really want to UNDO ??? WARNING ! You will not be able to REDO this step ")) {
							undo_count++;
							UndoFunc(undo_count); 
						}
					}
					else {
					undo_count++;
					//window.alert(undo_count);
					UndoFunc(undo_count);
						}
	
					if ( undo_count + 1 == undo_arr.length ) { undo_count = 0; undo_arr = []; undo_arr.push(empty_canv); }

				
			
		}
	
	//else { undo_count = 0; undo_arr = []; undo_arr.push(empty_canv); }
	}
	
	
});
	

	document.getElementById("redo").addEventListener("click", function(){
		if ( undo_count > 0 ) {
		undo_count--;
		UndoFunc(undo_count);
		}
	
	});

	
		//NEWTHING  
	document.getElementById("width_range").addEventListener("change", function(){
		tmp_ctx.lineWidth = document.getElementById("width_range").value / 2;
		
		drawBrush();
		//document.getElementById("brush_size")
		
	});
	//NEWTHING
	document.getElementById("opacity_range").addEventListener("change", function(){
		tmp_ctx.globalAlpha = document.getElementById("opacity_range").value / 100;
		
		drawBrush();
		//document.getElementById("brush_size")
		
	});
	
	//NEWTHING
	document.getElementById("clear").addEventListener("click", function(){
		if (confirm("Do you really want CLEAR the canvas?")) {
			ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
			}
	});
	

	
	var onPaintCircle = function() {
 
    // Tmp canvas is always cleared up before drawing.
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
 
    var x = (mouse.x + start_mouse.x) / 2;
    var y = (mouse.y + start_mouse.y) / 2;
 
    var radius = Math.max(
        Math.abs(mouse.x - start_mouse.x),
        Math.abs(mouse.y - start_mouse.y)
    ) / 2;
 
    tmp_ctx.beginPath();
    tmp_ctx.arc(x, y, radius, 0, Math.PI*2, false);
    // tmp_ctx.arc(x, y, 5, 0, Math.PI*2, false);
    tmp_ctx.stroke();
    tmp_ctx.closePath();
 
};
	
	var onPaintBrush = function() {
		
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
		
		if (ppts.length < 3) {
			var b = ppts[0];
			tmp_ctx.beginPath();
			//ctx.moveTo(b.x, b.y);
			//ctx.lineTo(b.x+50, b.y+50);
			tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			tmp_ctx.fill();
			tmp_ctx.closePath();
			
			return;
		}
		
		// Tmp canvas is always cleared up before drawing.
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		tmp_ctx.beginPath();
		tmp_ctx.moveTo(ppts[0].x, ppts[0].y);
		
		for (var i = 1; i < ppts.length - 2; i++) {
			var c = (ppts[i].x + ppts[i + 1].x) / 2;
			var d = (ppts[i].y + ppts[i + 1].y) / 2;
			
			tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
		}
		
		// For the last 2 points
		tmp_ctx.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
		tmp_ctx.stroke();
		
	};
	
	var onPaintLine = function() {
 
    // Tmp canvas is always cleared up before drawing.
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
 
    tmp_ctx.beginPath();
    tmp_ctx.moveTo(start_mouse.x, start_mouse.y);
    tmp_ctx.lineTo(mouse.x, mouse.y);
    tmp_ctx.stroke();
    tmp_ctx.closePath();
	
	
 
};

var onPaintRect = function() {
 
    // Tmp canvas is always cleared up before drawing.
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
 
    var x = Math.min(mouse.x, start_mouse.x);
	var y = Math.min(mouse.y, start_mouse.y);
	var width = Math.abs(mouse.x - start_mouse.x);
	var height = Math.abs(mouse.y - start_mouse.y);
	tmp_ctx.strokeRect(x, y, width, height);
	
	
 
};



function drawEllipse(ctx) {

	
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		var x = Math.min(mouse.x, start_mouse.x);
		var y = Math.min(mouse.y, start_mouse.y);
		
		var w = Math.abs(mouse.x - start_mouse.x);
		var h = Math.abs(mouse.y - start_mouse.y);
		
		
		var kappa = .5522848,
			ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle
		
		ctx.beginPath();
		ctx.moveTo(x, ym);
		ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
		ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		ctx.closePath();
		ctx.stroke();
	};

	
	
		var onErase = function() {
		
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
		
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.strokeStyle = 'rgba(0,0,0,1)';
		ctx.lineWidth = tmp_ctx.lineWidth;
		
		if (ppts.length < 3) {
			var b = ppts[0];
			ctx.beginPath();
			//ctx.moveTo(b.x, b.y);
			//ctx.lineTo(b.x+50, b.y+50);
			ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			ctx.fill();
			ctx.closePath();
			
			return;
		}
		
		// Tmp canvas is always cleared up before drawing.
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		ctx.beginPath();
		ctx.moveTo(ppts[0].x, ppts[0].y);
		
		for (var i = 1; i < ppts.length - 2; i++) {
			var c = (ppts[i].x + ppts[i + 1].x) / 2;
			var d = (ppts[i].y + ppts[i + 1].y) / 2;
			
			ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
		}
		
		// For the last 2 points
		ctx.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
		ctx.stroke();
		
	};
	
	var getRandomOffset = function(radius) {
	
    var random_angle = Math.random() * (2*Math.PI);
    var random_radius = Math.random() * radius;
     
    // console.log(random_angle, random_radius, Math.cos(random_angle), Math.sin(random_angle));
     
    return {
        x: Math.cos(random_angle) * random_radius,
        y: Math.sin(random_angle) * random_radius
    };
};

	var generateSprayParticles = function() {
    // Particle count, or, density
    var density = tmp_ctx.lineWidth*2;
     
    for (var i = 0; i < density; i++) {
        var offset = getRandomOffset(tmp_ctx.lineWidth);
         
        var x = mouse.x + offset.x;
        var y = mouse.y + offset.y;
         
        tmp_ctx.fillRect(x, y, 1, 1);
    }
};
			
			

	var UndoFunc = function(count) {
	
	
	var number = undo_arr.length;
	var img_data = undo_arr[number - (count + 1)];
	var undo_img = new Image();
	
	undo_img.src = img_data.toString();
	
	ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
	ctx.drawImage(undo_img, 0, 0);
	
	
	
	//window.alert('undoing'); 
	
	

};

var callDownload = function() {
		download(paint,'myPicture.png');
		};
	
	document.getElementById("id_download").addEventListener("click", callDownload);
	
	function download(canvas, filename) {

	
	//create a dummy CANVAS

	
    // create an "off-screen" anchor tag
    var lnk = document.createElement('a'),
        e;

    // the key here is to set the download attribute of the a tag
    lnk.download = filename;

    // convert canvas content to data-uri for link. When download
    // attribute is set the content pointed to by link will be
    // pushed as "download" in HTML5 capable browsers
    lnk.href = canvas.toDataURL();

    // create a "fake" click-event to trigger the download
    if (document.createEvent) {

        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
                         0, 0, 0, 0, 0, false, false, false,
                         false, 0, null);

        lnk.dispatchEvent(e);

    } else if (lnk.fireEvent) {

        lnk.fireEvent("onclick");
    }
};


	var onPaint = function() {
	
		if ( tool == 'brush' )
		{	onPaintBrush(); }
		
		else if ( tool == 'circle' )
		{	onPaintCircle(); }
		
		else if ( tool == 'line' )
		{	onPaintLine(); }
		
		else if ( tool == 'rectangle' )
		{	onPaintRect(); }
				
		else if ( tool == 'ellipse' )
		{	drawEllipse(tmp_ctx);	}
		
				
		else if ( tool == 'eraser' )
		{	onErase(); }
		
		else if ( tool == 'spray' )
		{	generateSprayParticles(); }
		
		elseif(tool=='tube')
		{ generateFur();}
		
	};
            
            
	function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
         switch(event.type)
    {
        case "touchstart": type ="mousedown"; break;
        case "touchmove":  type="mousemove"; break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }

             //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //           screenX, screenY, clientX, clientY, ctrlKey, 
    //           altKey, shiftKey, metaKey, button, relatedTarget);

                                var simulatedEvent = document.createEvent("MouseEvent");
                                simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                first.screenX, first.screenY, 
                                first.clientX, first.clientY, false, 
                                false, false, false, 0/*left*/, null);

                                                                                 first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function init() 
{
    thecanvas.addEventListener("touchstart", touchHandler, true);
    thecanvas.addEventListener("touchmove", touchHandler, true);
    thecanvas.addEventListener("touchend", touchHandler, true);
    thecanvas.addEventListener("touchcancel", touchHandler, true);    
}
canvas.ontouchstart = function(e) {
  if (e.touches) e = e.touches[0];
  return false;
}
}());

</script>