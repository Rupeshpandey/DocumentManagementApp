import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.css']
})
export class DocumentFormComponent {
  documentTitle: string = '';
  category: string = '';
  priority: number = 1;
  importance: number = 1;
  documentDate: string = '';
  documentFile: File | null = null;

  categories: string[] = ['Financial', 'Legal', 'Projects', 'HR', 'Custom Categories', 'Others'];

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any) {
    this.documentFile = event.target.files[0];
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
    formData.append('Category', this.category);
    formData.append('Priority', this.priority.toString());
    formData.append('Importance', this.importance.toString());
    formData.append('DocumentDate', this.documentDate);
    formData.append('DocumentFile', this.documentFile);

    this.http.post('https://localhost:7143/api/Document/insert', formData)
      .subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Document Added',
          text: 'The document has been successfully added!'
        });
        this.router.navigate(['/dashboard']);
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: 'An error occurred while adding the document.'
        });
      });
  }
}
