import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent {
  documentUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    // Use the sanitizer to bypass Angular's security model
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getDocumentUrl());
  }

  getDocumentUrl(): string {
    // Construct the URL to download the document
    return `https://localhost:7143/api/Document/download/${this.data.documentFileName}`;
  }
}
