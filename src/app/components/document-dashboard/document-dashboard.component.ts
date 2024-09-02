import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

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
  selector: 'app-document-dashboard',
  templateUrl: './document-dashboard.component.html',
  styleUrls: ['./document-dashboard.component.css']
})
export class DocumentDashboardComponent implements OnInit {
  documents: Document[] = [];
  filteredDocuments: Document[] = [];

  constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments() {
    this.http.get<Document[]>('https://localhost:7143/api/Document/get')
      .subscribe(data => {
        this.documents = data.map(doc => {
          return {
            ...doc,
            documentDate: doc.documentDate ? this.datePipe.transform(new Date(doc.documentDate), 'dd-MM-yyyy') : null  // Format the date
          };
        });
        this.filteredDocuments = [...this.documents];
      });
  }

  // Delete document
  deleteDocument(documentId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`https://localhost:7143/api/Document/delete/${documentId}`, { responseType: 'text' }).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'The document has been deleted.', 'success');
            this.fetchDocuments(); // Reload the documents after deletion
          },
          (error) => {
            console.error('Delete failed', error); // Log error details for debugging
            Swal.fire('Error', 'Failed to delete the document', 'error');
          }
        );
      }
    });
  }
  
  

  filterDocuments(event: any) {
    console.log(event);
    var category = event.target.value;
    if (category) {
      this.filteredDocuments = this.documents.filter(d => d.category === category);
    } else {
      this.filteredDocuments = [...this.documents];
    }
  }

  sortDocuments(event: any) {
    var sortBy = event.target.value;
    if (sortBy === 'date') {
      this.filteredDocuments.sort((a, b) => {
        const dateA = a.documentDate ? new Date(a.documentDate).getTime() : 0;
        const dateB = b.documentDate ? new Date(b.documentDate).getTime() : 0;
        return dateA - dateB;
      });
    } else if (sortBy === 'priority') {
      this.filteredDocuments.sort((a, b) => a.priority - b.priority);
    } else if (sortBy === 'importance') {
      this.filteredDocuments.sort((a, b) => a.importance - b.importance);
    }
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
        // Clear user data
        localStorage.removeItem('userRole');
        // Navigate to login page
        this.router.navigate(['/login']);
        Swal.fire('Logged Out', 'You have been logged out.', 'success');
      }
    });
  }

  goToAddDocument() {
    this.router.navigate(['/add-document']);
  }

  // View document details
  viewDocument(documentId: number): void {
    this.router.navigate(['/document/view', documentId]);
  }

  // Edit document
  editDocument(documentId: number): void {
    this.router.navigate(['/document/edit', documentId]);
  }

  
}
