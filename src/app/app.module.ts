import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { DocumentFormComponent } from './components/document-form/document-form.component';
import { DocumentDashboardComponent } from './components/document-dashboard/document-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DocumentFormComponent,
    DocumentDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
