import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

interface Document {
  documentId: number;
  documentTitle: string;
  category: string;
  priority: number;
  importance: number;
  documentFileName: string;
  documentDate: string | null;
}

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css']
})
export class ViewDocumentComponent implements OnInit {
  document: Document | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const documentId = this.route.snapshot.paramMap.get('id');
    if (documentId) {
      this.getDocumentDetails(+documentId);
    }
  }

  // Fetch document details by ID
  getDocumentDetails(documentId: number): void {
    this.http.get<Document>(`https://localhost:7143/api/Document/${documentId}`).subscribe(
      (data) => {
        this.document = data;
      },
      (error) => {
        Swal.fire('Error', 'Failed to load document details', 'error');
      }
    );
  }
}
