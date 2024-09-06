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
  userId: number | null = null; // Change to number type

  categories: { categoryId: number, categoryName: string }[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    console.log('DocumentFormComponent initialized');
    const userIdStr = localStorage.getItem('userId');
    
    // Convert userId to number
    this.userId = userIdStr ? parseInt(userIdStr, 10) : null;

    // Check if userId is null and handle it
    if (this.userId === null) {
      console.error('User ID is not set in localStorage');
      Swal.fire({
        icon: 'error',
        title: 'User Not Logged In',
        text: 'User ID could not be retrieved from localStorage.'
      });
      return;
    }

    this.loadCategories();
  }

  loadCategories() {
    console.log('Loading categories...');
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
    console.log('Submitting form...');
    if (!this.documentFile) {
      console.log('No file selected.');
      Swal.fire({
        icon: 'warning',
        title: 'File Required',
        text: 'Please select a file to upload.'
      });
      return;
    }

    if (this.userId === null) {
      console.log('User not logged in.');
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
    formData.append('CreatedBy', this.userId.toString()); // Convert userId to string

    console.log('Form data being sent:', {
      DocumentTitle: this.documentTitle,
      CategoryId: this.category,
      Priority: this.priority,
      Importance: this.importance,
      DocumentDate: this.documentDate,
      DocumentFile: this.documentFile?.name,
      CreatedBy: this.userId
    });

    this.http.post('https://localhost:7143/api/Document/insert', formData, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('Document added successfully:', response);
          Swal.fire({
            icon: 'success',
            title: 'Document Added',
            text: 'The document has been successfully added!'
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error adding document:', error);
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: 'An error occurred while adding the document.'
          });
        }
      });
  }

  logout() {
    console.log('Logging out...');
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
        localStorage.removeItem('userId'); // Clear the user ID from localStorage
        this.router.navigate(['/login']);
        Swal.fire('Logged Out', 'You have been logged out.', 'success');
      }
    });
  }

  goToDashboard() {
    console.log('Navigating to dashboard...');
    this.router.navigate(['/dashboard']);
  }

  getPriorityLabel(priority: number): string {
    const labels = ['Not at all Important', 'Slightly Important', 'Somewhat Important', 'Moderately Important', 'Important', 'Very Important', 'Extremely Important'];
    console.log(`Priority label for ${priority}: ${labels[priority - 1]}`);
    return labels[priority - 1];
  }
}
