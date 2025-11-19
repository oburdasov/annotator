import { TuiButton } from '@taiga-ui/core';
import { AfterViewInit, Component, ElementRef, inject, Signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DocumentApiService } from '../../services/document-api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Document } from '../../interfaces/document';
import { AnnotationComponent } from '../annotation/annotation.component';
import { DecimalPipe } from '@angular/common';
import { ZoomService } from '../../services/zoom.service';
import { AnnotationService } from '../../services/annotation.service';
import { Annotation } from '../../interfaces/annotation';
import { MAX_SCALE } from '../../constants/max-scale.const';
import { MIN_SCALE } from '../../constants/min-scale.const';

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  styleUrl: './document-view.component.scss',
  imports: [FormsModule, TuiButton, AnnotationComponent, DecimalPipe],
})
export class DocumentViewComponent implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly documentApiService = inject(DocumentApiService);
  private readonly zoomService = inject(ZoomService);
  private readonly annotationService = inject(AnnotationService);

  readonly zoomScale: Signal<number> = this.zoomService.scale;
  readonly minScale: number = MIN_SCALE;
  readonly maxScale: number = MAX_SCALE;

  @ViewChild('scrollContainer', { static: true }) scrollContainer: ElementRef<HTMLElement>;
  @ViewChild('documentContainer', { static: true }) documentContainer: ElementRef<HTMLElement>;

  readonly document: Signal<Document | null> = toSignal(
    this.route.params.pipe(
      switchMap((params) => this.documentApiService.getDocument(params['id']))
    ),
    {
      initialValue: null,
    }
  );

  readonly annotations: Signal<Annotation[]> = this.annotationService.annotations;

  ngAfterViewInit(): void {
    this.annotationService.setContainers(this.scrollContainer, this.documentContainer);
  }

  zoomIn() {
    this.zoomService.zoomIn();
  }

  zoomOut() {
    this.zoomService.zoomOut();
  }

  addAnnotation(event: MouseEvent) {
    this.annotationService.addAnnotation(event);
  }

  deleteAnnotation(index: number) {
    this.annotationService.deleteAnnotation(index);
  }

  startDrag(event: StartDragEvent, index: number) {
    this.annotationService.startDrag(event, index);
  }

  onDrag(event: MouseEvent) {
    this.annotationService.onDrag(event);
  }

  stopDrag() {
    this.annotationService.stopDrag();
  }

  saveDocument(): void {
    this.documentApiService.saveDocument(this.document() as Document, this.annotations());
  }
}
