import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Document {
  documentId: number;
  documentTitle: string;
  categoryId: number;
  priority: number;
  importance: number;
  documentFileName: string;
  documentDate: string | null;
}

interface Category {
  categoryId: number;
  categoryName: string;
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
  documentFileName: string = ''; // Store the uploaded file name here
  categories: Category[] = []; // Array to store categories

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.documentForm = this.fb.group({
      documentTitle: ['', Validators.required],
      categoryId: ['', Validators.required],
      priority: ['', Validators.required],
      importance: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      documentDate: ['', Validators.required],
      documentFileName: [''] // No need to use formControlName for file inputs
    });
    this.documentId = 0;
  }

  ngOnInit(): void {
    this.documentId = +this.route.snapshot.paramMap.get('id')!;
    this.getCategories(); // Fetch categories before fetching document details
  }

  getCategories(): void {
    this.http.get<Category[]>('https://localhost:7143/api/Document/categories').subscribe(
      (data) => {
        this.categories = data;
        console.log('Fetched categories:', this.categories); // Log to verify categories are fetched
        this.getDocumentDetails(this.documentId); // Fetch document details after categories are loaded
      },
      (error) => {
        Swal.fire('Error', 'Failed to load categories', 'error');
      }
    );
  }

  getDocumentDetails(documentId: number): void {
    this.http.get<Document>(`https://localhost:7143/api/Document/get/${documentId}`).subscribe(
      (data) => {
        const formattedDate = data.documentDate ? data.documentDate.split('T')[0] : null;

        this.documentForm.patchValue({
          documentTitle: data.documentTitle,
          categoryId: data.categoryId, // Patch the categoryId field
          priority: data.priority,
          importance: data.importance,
          documentDate: formattedDate
        });

        this.documentFileName = data.documentFileName; // Set the file name
        console.log('Fetched document details:', data); // Log to verify document details are fetched
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
      this.documentFileName = file.name; // Update the file name after selection
      console.log('Selected file:', file); // Log to verify file selection
    }
  }

  saveDocument(): void {
    if (this.documentForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('DocumentId', this.documentId.toString());
    formData.append('DocumentTitle', this.documentForm.get('documentTitle')!.value);
    formData.append('CategoryId', this.documentForm.get('categoryId')!.value); // Use CategoryId instead of CategoryName
    formData.append('Priority', this.documentForm.get('priority')!.value);
    formData.append('Importance', this.documentForm.get('importance')!.value);
    formData.append('DocumentDate', this.documentForm.get('documentDate')!.value);

    if (this.selectedFile) {
      formData.append('DocumentFile', this.selectedFile, this.selectedFile.name);
    } else {
      formData.append('DocumentFileName', this.documentFileName); // Keep the existing file if not replaced
    }

    this.http.post('https://localhost:7143/api/Document/update', formData, { responseType: 'text' })
      .subscribe(
        (response: string) => {
          console.log('API response:', response); // Log the API response
          Swal.fire('Success', 'Document updated successfully', 'success');
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('API error:', error); // Log the error response
          Swal.fire('Error', 'Failed to update the document', 'error');
        }
      );
  }
}
