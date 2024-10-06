document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('signature-pad');
    var ctx = canvas.getContext('2d');
    var drawing = false;
    var strokes = [];

    function resizeCanvas() {
        var containerWidth = canvas.parentElement.clientWidth;
        canvas.width = containerWidth - 4; // Subtract 4 for the border
        canvas.height = containerWidth / 2;
        redrawCanvas();
    }

    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (strokes.length > 0) {
            ctx.putImageData(strokes[strokes.length - 1], 0, 0);
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function getTouchPos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.touches[0].clientX - rect.left,
            y: evt.touches[0].clientY - rect.top
        };
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    function startDrawing(e) {
        drawing = true;
        var pos = e.type.startsWith('touch') ? getTouchPos(canvas, e) : getMousePos(canvas, e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        e.preventDefault();
    }

    function draw(e) {
        if (!drawing) return;
        var pos = e.type.startsWith('touch') ? getTouchPos(canvas, e) : getMousePos(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        e.preventDefault();
    }

    function stopDrawing() {
        if (drawing) {
            drawing = false;
            strokes.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
    }

    document.getElementById('clear-button').addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strokes = [];
    });

    document.getElementById('undo-button').addEventListener('click', function () {
        if (strokes.length > 0) {
            strokes.pop();
            redrawCanvas();
        }
    });

    document.getElementById('download-button').addEventListener('click', function () {
        var dataURL = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.href = dataURL;
        link.download = 'signature.png';
        link.click();
    });
});