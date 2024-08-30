import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from './material/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { DocumentFormComponent } from './components/document-form/document-form.component';
import { DocumentDashboardComponent } from './components/document-dashboard/document-dashboard.component';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DatePipe } from '@angular/common';
import { ViewDocumentComponent } from './components/view-document/view-document.component';
import { EditDocumentComponent } from './components/edit-document/edit-document.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DocumentFormComponent,
    DocumentDashboardComponent,
    ViewDocumentComponent,
    EditDocumentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    MatInputModule,
    HttpClientModule,
    MatToolbarModule,
    ReactiveFormsModule

  ],
  providers: [
    DatePipe,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
