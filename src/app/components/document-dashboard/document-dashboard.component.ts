import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  styleUrls: ['./document-dashboard.component.css']
})
export class DocumentDashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['documentTitle', 'category', 'priority', 'importance', 'documentDate', 'actions'];
  dataSource = new MatTableDataSource<Document>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: Document, property: string) => {
      switch (property) {
        case 'documentDate':
          return new Date(item.documentDate || '').getTime();
        case 'priority':
          return item.priority;
        case 'importance':
          return item.importance;
        default:
          return (item as any)[property];
      }
    };
  }

  fetchDocuments() {
    this.http.get<Document[]>('https://localhost:7143/api/Document/get')
      .subscribe(data => {
        this.dataSource.data = data.map(doc => ({
          ...doc,
          documentDate: doc.documentDate ? this.datePipe.transform(new Date(doc.documentDate), 'dd-MM-yyyy') : null
        }));
      });
  }

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
          () => {
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
    const category = event.target.value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Document, filter: string) => {
      return data.category.toLowerCase().includes(filter);
    };
    this.dataSource.filter = category;
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

  goToAddDocument() {
    this.router.navigate(['/add-document']);
  }

  viewDocument(documentId: number): void {
    this.router.navigate(['/document/view', documentId]);
  }

  viewDocumentpopup(documentId: number): void {
    const document = this.dataSource.data.find(doc => doc.documentId === documentId);
    if (document) {
      this.dialog.open(DocumentViewerComponent, {
        data: {
          documentId: document.documentId
        },
        width: '600px'
      });
    }
  }
  

  editDocument(documentId: number): void {
    this.router.navigate(['/document/edit', documentId]);
  }
}
