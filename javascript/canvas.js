var canvas = document.getElementById('drawCanvas');
var canvasButton = document.getElementById('clearCanvas');
var changeBrush = document.getElementById('changeBrush');
var ctx = canvas.getContext('2d');
var currentColour = "#000000";
var currentWidth = '3';

var channel = 'illustrate demo'

var pubnub = PUBNUB.init({
    publish_key: 'pub-c-dca9e4ba-e2a5-45d9-970e-69a8cc345062',
    subscribe_key: 'sub-c-3424df24-0c40-11e7-930d-02ee2ddab7fe',
    leave_on_unload : true,
    ssl		: document.location.protocol === "https:"
});

// create a flag
var isActive = false;

// array to collect coordinates
var plots = [];

ctx.lineWidth = currentWidth;
ctx.strokeStyle = "#000000";

function startDraw(e) {
    isActive = true;
}

function drawFromStream(message) {
    if(!message) return;        

    ctx.beginPath();
    drawOnCanvas(message.width, message.colour, message.plots);
}

function drawOnCanvas(width, colour, plots) {
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(plots[0].x, plots[0].y);

    for (i = 1; i < plots.length; i++) {
        ctx.lineTo(plots[i].x, plots[i].y);
    }
    ctx.stroke();
}

function draw(e) {
    if (!isActive) {
        return;
    }

    // cross-browser canvas coordinates
    var x = e.offsetX || e.layerX - canvas.offsetLeft;
    var y = e.offsetY || e.layerY - canvas.offsetTop;

    plots.push({x: x, y: y});

    drawOnCanvas(plots);
}

function endDraw(e) {
   pubnub.publish({
    channel: channel,
    message: { 
        plots: plots, // your array goes here
        colour: currentColour,
        width: currentWidth
    } 
   });
    
    isActive = false;
    plots=[];
}


function clearCanvas(e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function changeColor() {
    console.log(ctx.strokeStyle);
    if(ctx.strokeStyle != currentColour) {
        console.log("erase");
        document.getElementById('changeBrush').textContent = "Erase";
        ctx.strokeStyle = currentColour;
    } else {
        console.log("draw");
        document.getElementById('changeBrush').textContent = "Draw";
        ctx.strokeStyle = "#FFFFFF";
    }
}

function changeColour(colour) {
    console.log(colour);
    switch(colour) {
        case 'red':
            ctx.strokeStyle = '#ff0000';
            currentColour = '#ff0000';
            break;
        case 'orange':
            ctx.strokeStyle = '#ff7600';
            currentColour = '#ff7600';
            break;
        case 'yellow':
            ctx.strokeStyle = '#fffB00';
            currentColour = '#fffB00';
            break;
        case 'cyan':
            ctx.strokeStyle = '#00ffeb';
            currentColour = '#00ffeb';
            break;
        case 'blue':
            ctx.strokeStyle = '#0800ff';
            currentColour = '#0800ff';
            break;
    }
    document.getElementById('changeBrush').textContent = "Erase";
}

function changeSize(size) {
    console.log(size);
    switch(size) {
        case 'small':
            ctx.lineWidth = '3';
            currentWidth = '3';
            break;
        case 'medium':
            ctx.lineWidth = '6';
            currentWidth = '6';
            break;
        case 'large':
            ctx.lineWidth = '10';
            currentWidth = '10';
            break;
    }
}

pubnub.subscribe({
    channel: channel,
    callback: drawFromStream,
    
    presence: function(m){
     document.getElementById('occupancy').textContent = m.occupancy;
  }
});



canvas.addEventListener('mousedown', startDraw, false);
canvas.addEventListener('mousemove', draw, false);
canvas.addEventListener('mouseup', endDraw, false);
canvasButton.addEventListener('click', clearCanvas);
changeBrush.addEventListener('onmouseup', changeColor);