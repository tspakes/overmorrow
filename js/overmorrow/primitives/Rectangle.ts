import Vector from "./Vector";

export default class Rectangle {
  private _x1: number;
  private _y1: number;
  public x2: number;
  public y2: number;
  
  get x1(): number {
    return this._x1;
  }
  set x1(value: number) { // Move instead of resizing for x1 and y1
    this.x2 += (value - this._x1);
    this._x1 = value;
  }
  get y1(): number {
    return this._y1;
  }
  set y1(value: number) {
    this.y2 += (value - this._y1);
    this._y1 = value;
  }

  get width(): number {
    return this.x2 - this._x1;
  }
  set width(value: number) {
    this.x2 += (value - this.width);
  }

  get height(): number {
    return this.y2 - this._y1;
  }
  set height(value: number) {
    this.y2 += (value - this.height);
  }

  constructor(x: number, y: number, width: number, height: number) {
    this._x1 = x;
    this._y1 = y;
    this.x2 = x + width;
    this.y2 = y + height;
  }

  intersects(rect: Rectangle): boolean {
    return this._x1 < rect.x2 && this.x2 > rect._x1 && this._y1 < rect.y2 && this.y2 > rect._y1;
  }

  inside(x: number, y: number): boolean {
    return x < this.x2 && x >= this.x1 && y < this.y2 && y >= this.y1;
  }

  clone(): Rectangle {
    return new Rectangle(this._x1, this._y1, this.width, this.height);
  }

  equals(rect: Rectangle): boolean {
    return this.x1 === rect.x1 && this.y1 === rect.y1 && this.x2 === rect.x2 && this.y2 === rect.y2;
  }

  distanceTo(rect: Rectangle): number {
    // TODO Take the widths and heights into account
    return Math.sqrt((this.y1 - rect.y1) * (this.y1 - rect.y1) + (this.x1 - rect.x1) * (this.x1 - rect.x1));
  }

  offset(x: number, y: number): Rectangle {
    this.x1 += x;
    this.y1 += y;
    return this;
  }

  offsetByVector(vec: Vector): Rectangle {
    this.x1 += vec.x;
    this.y1 += vec.y;
    return this;
  }
}