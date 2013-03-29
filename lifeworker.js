function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
function onmessage(messageEvent) {
    var data = messageEvent.data,
        func = data.func,
        args = data.args,
        response = {
            func: func,
            args: args,
            value: null,
            error: null
        };
    if(!isFunction(functions[func])) {
        response.error = "Function "+func+" not found.";
        postMessage(response);
    }
}
var functions = {
    ret1: function() {
        return 1;
    },
}
