addEventListener('message', function(messageEvent) {
    var message = messageEvent.data,
        coord = coordFromPixel(message.canvasAttrs, message.pixelX, message.pixelY);
    returnMessage = {
        pixelX: message.pixelX,
        pixelY: message.pixelY,
        coord: coord,
        value: mandelbrot(coord.x, coord.y)
    };
    postMessage(returnMessage);
});
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
