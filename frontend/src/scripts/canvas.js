export class CanvasControl {
    constructor(_canvas) {
      this.canvas = _canvas;
      this.context = _canvas.getContext("2d");
  
      this.canvasOffsetX = _canvas.offsetLeft;
      this.canvasOffsetY = _canvas.offsetTop;
    }
  
    setDimensions(_width, _height) {
      this.canvas.height = window.innerWidth - canvasOffsetX;
      this.canvas.width = window.innerHeight - canvasOffsetY;
    }
  
    setLineTO(_X, _Y) {
      this.context.lineTo(_X, _Y);
      this.context.stroke();
    }
  
    setLineWidth(_lineWidth) {
      this.context.lineWidth = _lineWidth;
    }
  
    setLineCap(_lineCap) {
      this.context.lineCap = _lineCap;
    }
  
    setStrokeStyle(_style) {
      this.context.strokeStyle = _style;
    }
  
    getCanvasOffsetX() {
      return this.canvasOffsetX;
    }
  
    clearContext() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }