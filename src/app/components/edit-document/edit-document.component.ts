import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css']
})
export class EditDocumentComponent implements OnInit {
  documentForm: FormGroup;
  documentId: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.documentForm = this.fb.group({
      documentTitle: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      importance: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      documentDate: ['', Validators.required],
      documentFileName: ['']
    });
    this.documentId = 0;
  }

  ngOnInit(): void {
    this.documentId = +this.route.snapshot.paramMap.get('id')!;
    this.getDocumentDetails(this.documentId);
  }

  // Fetch document details by ID and populate the form
  getDocumentDetails(documentId: number): void {
    this.http.get<Document>(`https://localhost:7143/api/Document/${documentId}`).subscribe(
      (data) => {
        this.documentForm.patchValue(data);
      },
      (error) => {
        Swal.fire('Error', 'Failed to load document details', 'error');
      }
    );
  }

  // Save the edited document
  saveDocument(): void {
    if (this.documentForm.invalid) {
      return;
    }

    const updatedDocument = this.documentForm.value;
    updatedDocument.documentId = this.documentId;

    // Set headers for the PUT request
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.put(`https://localhost:7143/api/Document/${this.documentId}`, updatedDocument, { headers }).subscribe(
      () => {
        Swal.fire('Success', 'Document updated successfully', 'success');
        this.router.navigate(['/document-dashboard']);
      },
      (error) => {
        Swal.fire('Error', 'Failed to update the document', 'error');
      }
    );
  }
}
