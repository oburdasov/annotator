import { Injectable, signal } from '@angular/core';
import { MAX_SCALE } from '../constants/max-scale.const';
import { MIN_SCALE } from '../constants/min-scale.const';

const DEFAULT_SCALE_INDEX = 7;

@Injectable({
  providedIn: 'root',
})
export class ZoomService {
  private readonly scales: number[] = [
    MIN_SCALE,
    0.33,
    0.5,
    0.67,
    0.75,
    0.8,
    0.9,
    1,
    1.1,
    1.25,
    1.5,
    1.75,
    2,
    2.5,
    3,
    4,
    MAX_SCALE,
  ];
  private currentScaleIndex = DEFAULT_SCALE_INDEX;

  private readonly _scale = signal<number>(this.scales[DEFAULT_SCALE_INDEX]);
  readonly scale = this._scale.asReadonly();

  zoomIn(): void {
    this.currentScaleIndex++;
    this._scale.set(this.scales[this.currentScaleIndex]);
  }

  zoomOut(): void {
    this.currentScaleIndex--;
    this._scale.set(this.scales[this.currentScaleIndex]);
  }
}
