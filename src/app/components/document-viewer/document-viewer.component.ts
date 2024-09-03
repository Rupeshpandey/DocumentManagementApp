import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit {
  documentUrl: SafeResourceUrl | null = null;
  documentType: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { documentId: number },
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<DocumentViewerComponent>
  ) { }

  ngOnInit(): void {
    if (this.data.documentId) {
      this.http.get(`https://localhost:7143/api/document/view/${this.data.documentId}`, { responseType: 'blob' })
        .subscribe(blob => {
          const url = URL.createObjectURL(blob);
          this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url) as SafeResourceUrl;
          this.detectFileType(blob);
        }, error => {
          console.error('Error fetching document', error);
        });
    }
  }

  detectFileType(blob: Blob): void {
    const fileType = blob.type;
    this.documentType = fileType;
  }

  isImageType(): boolean {
    return this.documentType?.startsWith('image/') ?? false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}