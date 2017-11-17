import * as moment from '../../node_modules/moment/moment';

export class TimeKeep {
  public lastTwentyTickTimes: number[] = [];
  public lastTwentyDrawTimes: number[] = [];
  private _index: number = 0;
  private _avgTPS: number = 1;
  private _delta: number = 1;
  private _globalStartTime: moment.Moment;
  private _currentStartTime: moment.Moment;
  private _totalTicks: number;
  private _lastFrameTime: number;

  constructor() {
    this._globalStartTime = moment();
    this._currentStartTime = moment();
  }

  public addTick(tick: number): void {
    this._totalTicks++;
    if (this.lastTwentyTickTimes.length < 20)
      this.lastTwentyTickTimes.push(tick);
    else
      this.lastTwentyTickTimes[this._index] = tick;
  }
  public addDraw(draw: number): void {
    if (this.lastTwentyDrawTimes.length < 20)
      this.lastTwentyDrawTimes.push(draw);
    else
      this.lastTwentyDrawTimes[this._index] = draw;
  }
  public getTPS(): number {
    if (this._index != 0) return this._avgTPS;
    let frame = 50 - this.getTimeToWait();
    if (frame <= 0) frame = 1;
    this._avgTPS = 1000 / frame;
    return this._avgTPS;
  }
  public getDelta(): number {
    this._delta = Math.floor(this._lastFrameTime / 50);
    return this._delta !== 0 ? this._delta : 1;
  }
  public getTimeToWait(): number {
    return 50 - this._lastFrameTime < 0 ? 0 : 50 - this._lastFrameTime;
  }
  public startUpdate(): void {
    this._currentStartTime = moment();
  }
  public completeUpdate(): void {
    this._lastFrameTime = moment().diff(this._currentStartTime);
    this._index++;
    if (this._index > 20)
      this._index = 0;
  }
}

export class Perlin {

}