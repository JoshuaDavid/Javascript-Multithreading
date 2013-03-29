var init = function() {
    var body = document.body || document.getElementsByTagName('body')[0],
        canvas = createCanvas();
    body.appendChild(canvas);

    var isImageData = function(object) {
	return object.constructor === ImageData;
    }
    var worker = new Worker('./lifeworker.js');
    worker.addEventListener('message', parseMessage);
    imageData = context.createImageData(10, 10);
    var message = {
	func: 'randomFill',
	args: imageData
    };
    worker.postMessage(message);

};

function createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.height = 500;
    canvas.width = 500;
    canvas.style['height'] = '500px';
    canvas.style['width'] = '500px';
    canvas.style['border'] = '1px solid black';
    canvas.style['background-color'] = 'black';
    canvas.style['background-color'] = 'white';
    return canvas;
}


window.addEventListener('load', init);
