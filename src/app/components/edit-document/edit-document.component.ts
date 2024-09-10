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
  updatedBy: number;
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
  selectedFile: File | null = null;
  documentFileName: string = '';
  categories: Category[] = [];
  userId: number | null = null;

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
      documentFileName: [''],
      updatedBy: ['']
    });
    this.documentId = 0;
  }

  ngOnInit(): void {
    this.documentId = +this.route.snapshot.paramMap.get('id')!;
    const userIdStr = localStorage.getItem('userId');
    this.userId = userIdStr ? parseInt(userIdStr, 10) : null;

    if (this.userId === null) {
      console.error('User ID is not set in localStorage');
      Swal.fire({
        icon: 'error',
        title: 'User Not Logged In',
        text: 'User ID could not be retrieved from localStorage.'
      });
      return;
    }

    this.getCategories();
  }

  getCategories(): void {
    this.http.get<Category[]>('https://localhost:7143/api/Document/categories').subscribe(
      (data) => {
        this.categories = data;
        this.getDocumentDetails(this.documentId);
      },
      (error) => {
        console.error('Error fetching categories:', error);
        Swal.fire('Error', 'Failed to load categories', 'error');
      }
    );
  }

  getDocumentDetails(documentId: number): void {
    this.http.get<Document>(`https://localhost:7143/api/Document/get/${documentId}`).subscribe(
      (data) => {
        const formattedDate = data.documentDate ? data.documentDate.split('T')[0] : null;
  
        // Strip UUID from the file name (assuming the file name follows the pattern: UUID_filename)
        const fileNameParts = data.documentFileName.split('_');
        const actualFileName = fileNameParts.length > 1 ? fileNameParts.slice(1).join('_') : data.documentFileName;
  
        this.documentForm.patchValue({
          documentTitle: data.documentTitle,
          categoryId: data.categoryId,
          priority: data.priority,
          importance: data.importance,
          documentDate: formattedDate,
          documentFileName: actualFileName, // Set the actual file name
          updatedBy: data.updatedBy
        });
  
        this.documentFileName = actualFileName; // Store the stripped file name for display
      },
      (error) => {
        console.error('Error fetching document details:', error);
        Swal.fire('Error', 'Failed to load document details', 'error');
      }
    );
  }
  

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.documentFileName = file.name;
    }
  }

  getFileUrl(fileName: string): string {
    return `https://localhost:7143/api/document/view/${this.documentId}`;
  }

  saveDocument(): void {
    if (this.documentForm.invalid) {
        console.log('Form is invalid. Cannot save document.');
        return;
    }

    const formData = new FormData();
    formData.append('DocumentId', this.documentId.toString());
    formData.append('DocumentTitle', this.documentForm.get('documentTitle')!.value);
    formData.append('CategoryId', this.documentForm.get('categoryId')!.value);
    formData.append('Priority', this.documentForm.get('priority')!.value);
    formData.append('Importance', this.documentForm.get('importance')!.value);
    formData.append('DocumentDate', this.documentForm.get('documentDate')!.value);
    formData.append('UpdatedBy', this.userId!.toString());

    if (this.selectedFile) {
        // If a new file is selected, append it
        formData.append('DocumentFile', this.selectedFile, this.selectedFile.name);
    } else if (this.documentFileName) {
        // If no new file is selected, retain the existing file
        formData.append('DocumentFile', new Blob(), this.documentFileName);  // Send empty blob
    } else {
        // If no file is selected and no existing file, handle this case accordingly
        formData.append('DocumentFile', new Blob([''], { type: 'text/plain' }), 'dummy.txt'); // Dummy file
    }

    console.log('FormData being sent:');
    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });

    this.http.post('https://localhost:7143/api/Document/update', formData, { responseType: 'text' })
        .subscribe(
            (response: string) => {
                Swal.fire('Success', 'Document updated successfully', 'success');
                this.router.navigate(['/dashboard']);
            },
            (error) => {
                console.error('API error:', error);
                Swal.fire('Error', 'Failed to update the document', 'error');
            }
        );
}

  
  
  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }
}
