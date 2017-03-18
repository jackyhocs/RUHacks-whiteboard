var canvas = document.getElementById('drawCanvas');
var canvasButton = document.getElementById('clearCanvas');
var changeBrush = document.getElementById('changeBrush');
var ctx = canvas.getContext('2d');

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
    ctx.fillRect(0,0,800,600);
}

function changeColor() {
    console.log(ctx.strokeStyle);
    if(ctx.strokeStyle == "#ffffff") {
        console.log("erase");
        document.getElementById('changeBrush').textContent = "Erase";
        ctx.strokeStyle = "#000000";
    } else {
        console.log("draw");
        document.getElementById('changeBrush').textContent = "Draw";
        ctx.strokeStyle = "#ffffff";
    }
}

ctx.lineWidth = '3';
ctx.fillStyle = "#ffffff";
ctx.strokeStyle = "#000000";

canvas.addEventListener('mousedown', startDraw, false);
canvas.addEventListener('mousemove', draw, false);
canvas.addEventListener('mouseup', endDraw, false);
canvasButton.addEventListener('click', clearCanvas);
changeBrush.addEventListener('onmouseup', changeColor);