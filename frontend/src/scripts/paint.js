export class Paint {
  constructor() {
    this.lineWidth = 3;
    this.color = "#000000";
    this.active = false;
    this.move = false;
    this.pos = {
      x: 0,
      y: 0,
    };
    this.before = null;
  }

  setColor(_color) {
    this.color = _color;
  }

  setWidth(_lineWidth, _color) {
    this.lineWidth = _lineWidth;
  }

  activeCursor() {
    this.active = true;
  }

  disabledCursor() {
    this.active = false;
  }

  setBeforeCursor() {
    this.before = {
      x: this.pos.x,
      y: this.pos.y,
    };
  }

  setMoveCursor(posX, posY) {
    this.active = true;
    this.move = true;
    this.pos.x = posX;
    this.pos.y = posY;
  }

  getState() {
    return this.active;
  }
  getLineWidth() {
    return this.lineWidth;
  }

  getColor() {
    return this.color;
  }

  getPos() {
    return { x: this.pos.x, y: this.pos.y };
  }
}
