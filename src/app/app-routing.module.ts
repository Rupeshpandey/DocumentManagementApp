import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DocumentFormComponent } from './components/document-form/document-form.component';
import { DocumentDashboardComponent } from './components/document-dashboard/document-dashboard.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'add-document', component: DocumentFormComponent },
  { path: 'dashboard', component: DocumentDashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirect to login as the default route
  { path: '**', redirectTo: '/login' }  // Wildcard route for a 404 page, redirects to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
