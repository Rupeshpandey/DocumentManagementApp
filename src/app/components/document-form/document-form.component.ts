import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.css']
})
export class DocumentFormComponent implements OnInit {
  documentTitle: string = '';
  category: string = '';
  priority: number = 1;
  importance: number = 1;
  documentDate: string = '';
  documentFile: File | null = null;

  categories: { categoryId: number, categoryName: string }[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<{ categoryId: number, categoryName: string }[]>('https://localhost:7143/api/Document/categories')
      .subscribe({
        next: (data) => {
          console.log('Loaded categories:', data);
          this.categories = data;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.documentFile = input.files[0];
      console.log('Selected file:', this.documentFile.name);
    } else {
      console.log('No file selected or file input is empty');
    }
  }

  submitForm() {
    if (!this.documentFile) {
      Swal.fire({
        icon: 'warning',
        title: 'File Required',
        text: 'Please select a file to upload.'
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('DocumentTitle', this.documentTitle);
    formData.append('CategoryId', this.category); // Changed to CategoryId
    formData.append('Priority', this.priority.toString());
    formData.append('Importance', this.importance.toString());
    formData.append('DocumentDate', this.documentDate);
    formData.append('DocumentFile', this.documentFile);
  
    this.http.post('https://localhost:7143/api/Document/insert', formData, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Document Added',
            text: 'The document has been successfully added!'
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: 'An error occurred while adding the document.'
          });
        }
      });
  }
  

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('userRole');
        this.router.navigate(['/login']);
        Swal.fire('Logged Out', 'You have been logged out.', 'success');
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  getPriorityLabel(priority: number): string {
    const labels = ['Not at all Important', 'Slightly Important', 'Somewhat Important', 'Moderately Important', 'Important', 'Very Important', 'Extremely Important'];
    return labels[priority - 1];
  }
}
