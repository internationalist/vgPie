function SvgPie(id, config) {
	
	//functions
	this.toRadians = function(angle) {
		  return angle * (Math.PI / 180);
	}
	
	this.createLegend=function(legendwidth, legendheight, labels, percents, colors, data) {
		var legenddiv = document.createElement("div");
		legenddiv.style.width=legendwidth;
		legenddiv.style.height=legendheight;
		legenddiv.style.position="absolute";
		legenddiv.style.left="2px";
		legenddiv.style.top="0px";
		for(var i = 0; i < labels.length; i++) {
			var legendline = document.createElement("div");
			var legendIcon = document.createElement("div");			
			var legend = document.createElement("span");
			var breakLine = document.createElement("br");
			legendIcon.style.backgroundColor=colors[i];
			legendIcon.className="legend";
			legend.innerHTML=labels[i] + " " + data[i][1] + " (" + percents[i] + "%)";
			legend.className="label";
			legenddiv.appendChild(legendline);
			legendline.appendChild(legendIcon);
			legendline.appendChild(legend);			
		}
		
		return legenddiv;
	}
	
	this.createPie=function(width, height, svg, angles, center, colors) {
		var radius = null;
		if(width < height) {
			radius=Math.floor(width/3);
		} else if(width > height) {
			radius=Math.floor(height/3);		
		} else {
			radius=Math.floor(width/3);
		}
		
		var svgNS = svg.namespaceURI;
		var circle = document.createElementNS(svgNS, 'circle');
		circle.setAttribute('cx', center[0]);
		circle.setAttribute('cy', center[1]);
		circle.setAttribute('r', radius);
		circle.setAttribute('fill', colors[colors.length - 1]);
		svg.appendChild(circle);
		
		var cumAngle = 360 - angles[angles.length - 1];
		
		for(var i = (angles.length - 2); i >= 0;i--) {
			var radianVal = this.toRadians(cumAngle);
			var y = center[1] + Math.round(Math.sin(radianVal)*radius);
			var x = center[0] + Math.round(Math.cos(radianVal)*radius);
			var attrVal = "M" + (center[0] + radius) + " " + center[1] + " ";
			attrVal += "A " + radius + " " + radius + ",0,";
			if(cumAngle < 180) {
				attrVal += "0,";
			} else {
				attrVal += "1,";
			}
			//attrVal += "0,";
			attrVal += "1,";
			attrVal += x + " " + y;
			attrVal += " L " + center[0] + " " + center[1] + " Z";
			console.log(attrVal);
			var arc = document.createElementNS(svgNS, 'path');
			arc.setAttribute('d', attrVal);
			arc.setAttribute('fill', colors[i]);
			svg.appendChild(arc);
			cumAngle -= angles[i];
		}		
	}//end of create pie
	
	var angles = new Array();
	var labels = new Array();
	var percents = new Array();
	
	var total=0;
	//calculate labels and total
	for(var j = 0; j < config.data.length; j++) {
		labels.push(config.data[j][0]);
		total += config.data[j][1];
	}
	//another pass to calculate angles
	for(var j = 0; j < config.data.length; j++) {
		percents.push(Math.round((config.data[j][1]/total)*100));
		angles.push((config.data[j][1]/total)*360);
	}
	
	//regular code
	//var angles = [20,50,30,50,60,60,90];
	var colors;
	if(config && config.colors) {
		colors = config.colors;
	} else {
		colors = new Array();
		var colorPicker = new ColorChooser();		
		for(var j = 0; j < angles.length; j++) {
			colors.push(colorPicker.getColor());
		}
	}
	
	var div = document.querySelector('#' + id);
	var parentStyle = window.getComputedStyle(div,null);
	
	var width = 200;

	var height = 200;
	
	var legendwidth = 100;
	var legendheight = 100;
	var parentWidth;
	var parentHeight;
	
	if((parentStyle['width'])
			&& (parentStyle['height'])) {
		//reduce the svg width by 25% from parent.
		parentWidth = parseSize(parentStyle['width']);
		parentHeight = parseSize(parentStyle['height']);
		
		width = parentWidth;
		height = parentHeight;
		legendwidth = parentWidth/3;
		legendheight = parentHeight/3;

	} else { //set parent dive size
		parentWidth=width + legendwidth;
		parentHeight=height + legendheight;
		div.style.height=(height + legendheight);
		div.style.width=(width + legendwidth);		
	}
	
	div.style.border="1px solid black";
	
	
	var center = [Math.floor(parentWidth/2), Math.floor(parentHeight/2)];
	
	var legenddiv = this.createLegend(legendwidth, legendheight, labels, percents, colors, config.data);


	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	var hostDiv = document.createElement("div");
	hostDiv.style.width=width;
	hostDiv.style.height=height;
	//div.style.border="1px solid black";
	svg.setAttribute('width', width);
	svg.setAttribute('height', height);
	svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	hostDiv.appendChild(svg);
	div.appendChild(legenddiv);
	div.appendChild(hostDiv);
	this.createPie(width, height, svg, angles, center, colors);
	
}

function ColorChooser() {
   this.counter = 0;
   this.baseColor = new Array();
	this.createColor = function(r, g, b) {
		var color = new Array();
		color.push(r);
		color.push(g);
		color.push(b);
		return color;
	}
	this.componentToHex=function(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}

	this.rgbToHex=function(r, g, b) {
		return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
	}			
   //blue
   this.baseColor.push(this.createColor(51,102,153));
   //green
   this.baseColor.push(this.createColor(51,102,0));
   //yellow
   this.baseColor.push(this.createColor(255,180,0));
   //orange
   this.baseColor.push(this.createColor(255,153,102));
   //red
   this.baseColor.push(this.createColor(204,102,102));
   //violet
   var col = this.createColor(51,51,102)
   this.baseColor.push(col);
   //indigo
   this.baseColor.push(this.createColor(102,0,255));		   
	   
   this.getColor = function() {
   var color;
   if(this.counter<=6) {
	   color = this.baseColor[this.counter];
	} else {
	   for(var j = 0; j < this.baseColor.length; j++) {
		   var temp = this.baseColor[j];
		   for(var i =0; i < temp.length; i++) {
			   var rgb = temp[i];
			   if(rgb + 10 > 255) {
				   rgb = 0;
			   } else {
				   rgb += 10;
			   }
			   temp[i] = rgb;
			}
		}
		color = this.baseColor[this.counter%6];
	}
	   this.counter += 1;
	   return this.rgbToHex(color[0],color[1],color[2]);
	}
}

function parseSize(dim) {
	dim = new String(dim);
	dimNum = dim.substring(0,dim.indexOf("px"));
	return Number(dimNum);
}