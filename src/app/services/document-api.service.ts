import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Document } from '../interfaces/document';
import { Annotation } from '../interfaces/annotation';

@Injectable({
  providedIn: 'root',
})
export class DocumentApiService {
  private readonly http = inject(HttpClient);

  getDocument(id: string): Observable<Document> {
    return this.http.get<Document>(`assets/${id}.json`);
  }

  saveDocument(document: Document, annotations: Annotation[]) {
    console.log('Документ:', document);
    console.log('Аннотации:');
    if (annotations.length > 0) {
      annotations.forEach((annotation) => console.log(annotation.text));
    } else {
      console.log('Отсутствуют');
    }
  }
}
