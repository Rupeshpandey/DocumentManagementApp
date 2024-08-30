import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DocumentFormComponent } from './components/document-form/document-form.component';
import { DocumentDashboardComponent } from './components/document-dashboard/document-dashboard.component';
import { ViewDocumentComponent } from './components/view-document/view-document.component';
import { EditDocumentComponent } from './components/edit-document/edit-document.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'document/view/:id', component: ViewDocumentComponent },
  { path: 'document/edit/:id', component: EditDocumentComponent },
  { path: 'add-document', component: DocumentFormComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DocumentDashboardComponent, canActivate: [AuthGuard] },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
