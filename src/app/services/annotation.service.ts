import { ElementRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Annotation } from '../interfaces/annotation';
import { ZoomService } from './zoom.service';

@Injectable({
  providedIn: 'root',
})
export class AnnotationService {
  private readonly zoomService = inject(ZoomService);
  scale: number;

  private readonly _annotations = signal<Annotation[]>([]);
  readonly annotations = this._annotations.asReadonly();

  private draggingAnnotation: Annotation | null = null;
  private dragOffsetX: number;
  private dragOffsetY: number;
  private scrollYOnDragStart: number;
  private rightBoundary: number;

  private scrollContainer: ElementRef<HTMLElement>;
  private documentContainer: ElementRef<HTMLElement>;

  setContainers(scrollContainer: ElementRef, documentContainer: ElementRef): void {
    this.scrollContainer = scrollContainer;
    this.documentContainer = documentContainer;
  }

  addAnnotation(event: MouseEvent): void {
    this.setScale();

    const headerHeight: number = this.scrollContainer.nativeElement.getBoundingClientRect().top;
    const posX: number =
      (event.clientX + this.scrollContainer.nativeElement.scrollLeft) / this.scale;
    const posY: number =
      (event.clientY - headerHeight + this.scrollContainer.nativeElement.scrollTop) / this.scale;

    this._annotations.update((annotations) => {
      return [...annotations, { posX, posY, text: '' }];
    });
  }

  deleteAnnotation(index: number): void {
    this._annotations.update((annotations) => {
      annotations.splice(index, 1);
      return annotations;
    });
  }

  startDrag(event: StartDragEvent, index: number): void {
    const mouseEvent = event.mouseEvent;
    mouseEvent.stopPropagation();
    mouseEvent.preventDefault();

    this.setScale();
    this.draggingAnnotation = this.annotations()[index];

    this.calculateDragOffset(mouseEvent);

    this.scrollYOnDragStart = this.scrollContainer.nativeElement.scrollTop;

    this.rightBoundary =
      (this.documentContainer.nativeElement.clientWidth - event.annotationWidth) / this.scale;
  }

  onDrag(event: MouseEvent): void {
    if (this.draggingAnnotation === null) return;

    const scrolledYFromDragStart: number =
      this.scrollContainer.nativeElement.scrollTop - this.scrollYOnDragStart;

    const posX = event.clientX / this.scale - this.dragOffsetX;
    const posY = (event.clientY + scrolledYFromDragStart) / this.scale - this.dragOffsetY;

    this.draggingAnnotation.posX = Math.max(0, Math.min(posX, this.rightBoundary));
    this.draggingAnnotation.posY = Math.max(0, posY);
  }

  stopDrag(): void {
    this.draggingAnnotation = null;
  }

  private calculateDragOffset(event: MouseEvent) {
    if (this.draggingAnnotation === null) return;

    const scaleOffsetX: number = event.clientX - event.clientX / this.scale;
    const scaleOffsetY: number = event.clientY - event.clientY / this.scale;

    const buttonOffsetX: number = event.clientX - this.draggingAnnotation.posX;
    const buttonOffsetY: number = event.clientY - this.draggingAnnotation.posY;

    this.dragOffsetX = buttonOffsetX - scaleOffsetX;
    this.dragOffsetY = buttonOffsetY - scaleOffsetY;
  }

  private setScale() {
    this.scale = this.zoomService.scale();
  }
}
