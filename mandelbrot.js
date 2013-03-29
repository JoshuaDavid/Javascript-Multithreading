window.addEventListener('load', handlePageLoad);

function handlePageLoad() {
    var body = document.body || document.getElementsByTagName('body')[0];
    var canvas = document.createElement('canvas');
    var size = 512;
    canvas.height = size;
    canvas.width  = size;
    canvas.style['height'] = size + 'px';
    canvas.style['width']  = size + 'px';
    body.appendChild(canvas);
    var context = canvas.getContext('2d');
    showMandelbrotSet(canvas, context, true);
}
function showMandelbrotSet(canvas, context, runAgain) {
    context.fillStyle="white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    var pixelsLeft = canvas.height * canvas.width;
    var startTime = new Date().getTime();
    var fillPixel = function(messageEvent) {
        var message = messageEvent.data,
            coordX  = message.coordX,
            coordY  = message.coordY,
            pixelX  = message.pixelX,
            pixelY  = message.pixelY,
            value   = message.value;
        context.fillStyle = 'rgb(' + value + ', ' + value + ', ' + value + ')' ;
        context.fillRect(pixelX, pixelY, 1, 1);
        pixelsLeft -= 1;
        if(pixelsLeft == 0) cleanup();
        return;
    };
    var numWorkers = (Math.random() * 10) | 0 + 1;
    console.log(numWorkers);
    var mandelbrotWorkers = Array(numWorkers);
    for(var i = 0; i < numWorkers; i++) {
        mandelbrotWorkers[i] = new Worker('./mandelbrot-worker.js');
        mandelbrotWorkers[i].addEventListener('message', fillPixel);
    }
    var pixel = 0;
    for(var pixelX = 0, pixelWidth = canvas.width; pixelX < pixelWidth; pixelX++) {
        for(var pixelY = 0, pixelWidth = canvas.width; pixelY < pixelWidth; pixelY++) {
            var message = {};
            message.pixelX = pixelX;
            message.pixelY = pixelY;
            message.canvasAttrs = {
                height: canvas.height,
                width: canvas.width
            };
            mandelbrotWorkers[pixel % numWorkers].postMessage(message);
            pixel += 1;
        }
    }
    function cleanup() {
        for(var i = 0; i < numWorkers; i++) {
            mandelbrotWorkers[i].terminate();
        }
        delete mandelbrotWorkers;
        var endTime = new Date().getTime();
        var runTime = endTime - startTime;
        console.log("Runtime: " + runTime);
        if(runAgain === true) showMandelbrotSet(canvas, context, runAgain);
    }
}

function coordFromPixel(canvasAttrs, pixelX, pixelY) {
    var coordXMin   = -2,
        coordXMax   =  2,
        coordYMin   = -2,
        coordYMax   =  2,
        coordWidth  = (coordXMax - coordXMin),
        coordHeight = (coordYMax - coordYMin),
        pixelWidth  = canvasAttrs.width,
        pixelHeight = canvasAttrs.height,
        coordX      = coordXMin + coordWidth  * pixelX / pixelWidth,
        coordY      = coordYMin + coordHeight * pixelY / pixelHeight;
    return {x: coordX, y: coordY};
}
function mandelbrot(coordX, coordY) {
    var coordA = coordX,
        coordB = coordY;
    for(var i = 0; i < 255; i++) {
        var coordNewA = coordA * coordA - coordB * coordB + coordX,
            coordNewB = 2 * coordA * coordB + coordY,
            coordA = coordNewA,
            coordB = coordNewB;
        if(coordA * coordA + coordB * coordB > 4) {
            return i;
        }
    }
    return 255;
}
