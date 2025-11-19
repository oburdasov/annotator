import { Routes } from '@angular/router';
import { DocumentViewComponent } from './components/document-view/document-view.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'view/1',
    pathMatch: 'full',
  },
  {
    path: 'view/:id',
    component: DocumentViewComponent,
  },
  {
    path: '**',
    redirectTo: 'view/1',
  },
];
