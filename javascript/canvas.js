var canvas = document.getElementById('drawCanvas');
var canvasButton = document.getElementById('clearCanvas');
var changeBrush = document.getElementById('changeBrush');
var ctx = canvas.getContext('2d');
var currentColour = "#000000";
// create a flag
var isActive = false;

// array to collect coordinates
var plots = [];

function startDraw(e) {
    isActive = true;
}

function drawOnCanvas(plots) {
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
    isActive = false;
    plots=[];
}

function clearCanvas(e) {
    // Store the current transformation matrix
ctx.save();

// Use the identity matrix while clearing the canvas
ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Restore the transform
ctx.restore();
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
            break;
        case 'medium':
            ctx.lineWidth = '6';
            break;
        case 'large':
            ctx.lineWidth = '10';
            break;
    }
}

ctx.lineWidth = '3';
ctx.strokeStyle = "#000000";

canvas.addEventListener('mousedown', startDraw, false);
canvas.addEventListener('mousemove', draw, false);
canvas.addEventListener('mouseup', endDraw, false);
canvasButton.addEventListener('click', clearCanvas);
changeBrush.addEventListener('onmouseup', changeColor);