import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit {
  documentTitle: string;
  documentFileName: string;
  documentUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DocumentViewerComponent>,
    private sanitizer: DomSanitizer
  ) { 
    this.documentTitle = data.documentTitle;
    this.documentFileName = decodeURIComponent(data.documentFileName); // Decode the file name

    // Sanitize the URL with the encoded file name
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://localhost:7143/api/Document/view/${encodeURIComponent(this.documentFileName)}`);
    console.log('Document URL:', this.documentUrl);
  }

  ngOnInit(): void { }

  close(): void {
    this.dialogRef.close();
  }
}
