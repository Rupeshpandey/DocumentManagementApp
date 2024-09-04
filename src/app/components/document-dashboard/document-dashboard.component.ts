import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DocumentViewerComponent } from '../document-viewer/document-viewer.component';

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
  styleUrls: ['./document-dashboard.component.css'],
})
export class DocumentDashboardComponent implements OnInit {
  displayedColumns: string[] = ['documentTitle', 'category', 'priority', 'importance', 'documentDate', 'actions'];
  dataSource: Document[] = [];
  originalDataSource: Document[] = []; // Copy of original data

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments() {
    this.http.get<Document[]>('https://localhost:7143/api/Document/get').subscribe(
      (data) => {
        this.originalDataSource = data.map((doc) => ({
          ...doc,
          documentDate: doc.documentDate ? this.datePipe.transform(new Date(doc.documentDate), 'dd-MM-yyyy') : null,
        }));
        this.dataSource = [...this.originalDataSource]; // Initialize dataSource with original data
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }

  filterDocuments(event: any) {
    const category = event.target.value.trim().toLowerCase();
    if (category) {
      this.dataSource = this.originalDataSource.filter((doc) =>
        doc.category.toLowerCase().includes(category)
      );
    } else {
      this.dataSource = [...this.originalDataSource]; // Reset to original data if no category is selected
    }
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.dataSource.sort((a, b) => {
      let valueA = this.getValue(a, column);
      let valueB = this.getValue(b, column);

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  getValue(document: Document, column: string): any {
    switch (column) {
      case 'documentDate':
        return new Date(document.documentDate || '').getTime();
      case 'priority':
        return document.priority;
      case 'importance':
        return document.importance;
      default:
        return document[column as keyof Document]?.toString().toLowerCase();
    }
  }

  deleteDocument(documentId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`https://localhost:7143/api/Document/delete/${documentId}`, { responseType: 'text' }).subscribe(
          () => {
            Swal.fire('Deleted!', 'The document has been deleted.', 'success');
            this.fetchDocuments(); // Reload the documents after deletion
          },
          (error) => {
            Swal.fire('Error', 'Failed to delete the document', 'error');
          }
        );
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
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }

  viewDocument(documentId: number): void {
    this.router.navigate(['/document/view', documentId]);
  }

  goToAddDocument() {
    this.router.navigate(['/add-document']);
  }

  viewDocumentpopup(documentId: number): void {
    const document = this.dataSource.find((doc) => doc.documentId === documentId);
    if (document) {
      this.dialog.open(DocumentViewerComponent, {
        data: {
          documentId: document.documentId,
        },
        width: '600px',
      });
    }
  }

  editDocument(documentId: number): void {
    this.router.navigate(['/document/edit', documentId]);
  }
}
