export class CanvasControl {
  constructor(_canvas) {
    this.canvas = _canvas;
    this.context = _canvas.getContext("2d");

    this.canvasOffsetX = _canvas.offsetLeft;
    this.canvasOffsetY = _canvas.offsetTop;
  }

  simpleDraw(x, y) {
    this.context.strokeStyle = this.strokeStyle;
    this.context.lineWidth = this.lineWidth;
    this.context.lineCap = this.lineCap;

    // draw a red line
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineTo(x, y + 1);
    this.context.stroke();
  }

  setDimensions(_width, _height) {
    this.canvas.height = window.innerWidth - canvasOffsetX;
    this.canvas.width = window.innerHeight - canvasOffsetY;
  }

  setLineTO(_X, _Y) {
    this.context.beginPath();
    this.context.moveTo(_X, _Y);
    this.context.lineTo(_X, _Y);
    this.context.stroke();
  }

  setLineWidth(_lineWidth) {
    this.lineWidth = _lineWidth;
  }

  setLineCap(_lineCap) {
    this.lineCap = _lineCap;
  }

  setStrokeStyle(_style) {
    this.strokeStyle = _style;
  }

  getCanvasOffsetX() {
    return this.canvasOffsetX;
  }

  getCanvas() {
    return this.canvas;
  }

  clearContext() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  generateBase64() {
    return this.canvas.toDataURL("image/png");
  }

  loadBase64(image64) {
    try {
      const baseImage = new Image();

      const context = this.context;

      baseImage.onload = function () {
        context.drawImage(baseImage, 0, 0);
      };

      baseImage.src = image64;
    } catch (error) {
      console.error(error);
    }
  }
}
