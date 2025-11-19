import { TuiButton } from '@taiga-ui/core';
import { AfterViewInit, Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContenteditableValueAccessor } from '../../directives/contenteditable-value-accessor';
import { Annotation } from '../../interfaces/annotation';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
  imports: [FormsModule, ContenteditableValueAccessor, TuiButton],
})
export class AnnotationComponent implements AfterViewInit {
  @ViewChild('textElement', { static: true }) textElement: ElementRef<HTMLElement>;

  readonly annotation = input.required<Annotation>();
  readonly startDrag = output<StartDragEvent>();
  readonly deleteAnnotation = output<void>();

  ngAfterViewInit() {
    this.textElement.nativeElement.focus();
  }

  deleteIfEmpty(): void {
    if (this.annotation()?.text.trim() === '') {
      this.deleteAnnotation.emit();
    }
  }

  onStartDrag(event: MouseEvent) {
    this.startDrag.emit({
      mouseEvent: event,
      annotationWidth: this.textElement.nativeElement.clientWidth,
    });
  }
}
