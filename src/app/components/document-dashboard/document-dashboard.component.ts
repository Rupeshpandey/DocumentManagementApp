import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface Document {
  documentId: number;
  documentTitle: string;
  category: string;
  priority: number;
  importance: number;
  documentFileName: string;
  documentDate: string;
}

@Component({
  selector: 'app-document-dashboard',
  templateUrl: './document-dashboard.component.html',
  styleUrls: ['./document-dashboard.component.css']
})
export class DocumentDashboardComponent implements OnInit {
editDocument(arg0: number) {
throw new Error('Method not implemented.');
}
viewDocument(arg0: number) {
throw new Error('Method not implemented.');
}
  documents: Document[] = [];
  filteredDocuments: Document[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments() {
    this.http.get<Document[]>('https://localhost:7143/api/Document/getAll')
      .subscribe(data => {
        this.documents = data;
        this.filteredDocuments = data;
      });
  }

  deleteDocument(documentId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`https://localhost:5001/api/documents/${documentId}`)
          .subscribe(() => {
            Swal.fire('Deleted!', 'Your document has been deleted.', 'success');
            this.documents = this.documents.filter(d => d.documentId !== documentId);
            this.filteredDocuments = this.filteredDocuments.filter(d => d.documentId !== documentId);
          });
      }
    });
  }

  filterDocuments(category: string) {
    this.filteredDocuments = this.documents.filter(d => d.category === category);
  }

  sortDocuments(sortBy: string) {
    if (sortBy === 'date') {
      this.filteredDocuments = this.filteredDocuments.sort((a, b) => a.documentDate.localeCompare(b.documentDate));
    } else if (sortBy === 'priority') {
      this.filteredDocuments = this.filteredDocuments.sort((a, b) => a.priority - b.priority);
    } else if (sortBy === 'importance') {
      this.filteredDocuments = this.filteredDocuments.sort((a, b) => a.importance - b.importance);
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
}
