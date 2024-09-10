import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

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
  userId: number | null = null;
  maxDate: string = '';

  categories: { categoryId: number, categoryName: string }[] = [];

  @ViewChild('documentForm') documentForm!: NgForm;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const userIdStr = localStorage.getItem('userId');
    this.userId = userIdStr ? parseInt(userIdStr, 10) : null;

    if (this.userId === null) {
      Swal.fire({
        icon: 'error',
        title: 'User Not Logged In',
        text: 'User ID could not be retrieved from localStorage.'
      });
      return;
    }

    this.setMaxDate();
    this.loadCategories();
  }

  setMaxDate() {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }

  loadCategories() {
    this.http.get<{ categoryId: number, categoryName: string }[]>('https://localhost:7143/api/Document/categories')
      .subscribe({
        next: (data) => {
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
    }
  }

  submitForm() {
    if (!this.documentForm.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Form Incomplete',
        text: 'Please fill out all required fields correctly.'
      });
      return;
    }

    if (!this.documentFile) {
      Swal.fire({
        icon: 'warning',
        title: 'File Required',
        text: 'Please select a file to upload.'
      });
      return;
    }

    if (this.userId === null) {
      Swal.fire({
        icon: 'error',
        title: 'User Not Logged In',
        text: 'Please log in to submit the form.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('DocumentTitle', this.documentTitle);
    formData.append('CategoryId', this.category);
    formData.append('Priority', this.priority.toString());
    formData.append('Importance', this.importance.toString());
    formData.append('DocumentDate', this.documentDate);
    formData.append('DocumentFile', this.documentFile);
    formData.append('CreatedBy', this.userId.toString());

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
        localStorage.removeItem('userId');
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
