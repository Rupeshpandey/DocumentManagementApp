import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  selectedFile: File | null = null; // Store the selected file here

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

  getDocumentDetails(documentId: number): void {
    this.http.get<Document>(`https://localhost:7143/api/Document/${documentId}`).subscribe(
      (data) => {
        const formattedDate = data.documentDate ? data.documentDate.split('T')[0] : null;

        this.documentForm.patchValue({
          documentTitle: data.documentTitle,
          category: data.category,
          priority: data.priority,
          importance: data.importance,
          documentDate: formattedDate
        });
      },
      (error) => {
        Swal.fire('Error', 'Failed to load document details', 'error');
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveDocument(): void {
    if (this.documentForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('documentTitle', this.documentForm.get('documentTitle')!.value);
    formData.append('category', this.documentForm.get('category')!.value);
    formData.append('priority', this.documentForm.get('priority')!.value);
    formData.append('importance', this.documentForm.get('importance')!.value);
    formData.append('documentDate', this.documentForm.get('documentDate')!.value);

    // Append the file only if a new file was selected
    if (this.selectedFile) {
      formData.append('documentFileName', this.selectedFile);
    }

    this.http.put(`https://localhost:7143/api/Document/${this.documentId}`, formData).subscribe(
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
