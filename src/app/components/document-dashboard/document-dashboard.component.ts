




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
  styleUrls: ['./document-dashboard.component.css'],
})
export class DocumentDashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['documentTitle', 'category', 'priority', 'importance', 'documentDate', 'actions'];
  dataSource = new MatTableDataSource<Document>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('Component initialized.');
    this.fetchDocuments();
  }

  ngAfterViewInit(): void {
    console.log('After view init. Setting up sort...');

    if (this.sort) {
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
            return (item as any)[property]?.toString().toLowerCase() || '';
        }
      };

      this.sort.sortChange.subscribe(() => {
        console.log('Sort changed. Current sort direction:', this.sort.direction);
        console.log('Current sort active:', this.sort.active);
      });
    } else{
      console.log("mat sort not initialize");
    }
  }

  fetchDocuments() {
    console.log('Fetching documents...');
    this.http.get<Document[]>('https://localhost:7143/api/Document/get')
      .subscribe(data => {
        console.log('Documents fetched:', data);
        this.dataSource.data = data.map(doc => ({
          ...doc,
          documentDate: doc.documentDate ? this.datePipe.transform(new Date(doc.documentDate), 'dd-MM-yyyy') : null
        }));
        console.log('Processed documents with formatted dates:', this.dataSource.data);
      }, error => {
        console.error('Error fetching documents:', error);
      });
  }

  deleteDocument(documentId: number): void {
    console.log('Attempting to delete document with ID:', documentId);
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
        console.log('Delete confirmation received.');
        this.http.delete(`https://localhost:7143/api/Document/delete/${documentId}`, { responseType: 'text' }).subscribe(
          () => {
            console.log('Document deleted successfully:', documentId);
            Swal.fire('Deleted!', 'The document has been deleted.', 'success');
            this.fetchDocuments(); // Reload the documents after deletion
          },
          (error) => {
            console.error('Delete failed:', error);
            Swal.fire('Error', 'Failed to delete the document', 'error');
          }
        );
      } else {
        console.log('Delete action canceled.');
      }
    });
  }

  filterDocuments(event: any) {
    const category = event.target.value.trim().toLowerCase();
    console.log('Filtering documents by category:', category);
    this.dataSource.filterPredicate = (data: Document, filter: string) => {
      const match = data.category.toLowerCase().includes(filter);
      console.log('Filter match:', match, 'for document:', data);
      return match;
    };
    this.dataSource.filter = category;
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
        console.log('User confirmed logout.');
        this.router.navigate(['/login']);
      } else {
        console.log('Logout canceled.');
      }
    });
  }

  viewDocument(documentId: number): void {
    console.log('Viewing document with ID:', documentId);
    this.dialog.open(DocumentViewerComponent, {
      data: { documentId },
      width: '80vw',
      height: '80vh'
    });
  }

  goToAddDocument() {
    console.log('Navigating to add document page.');
    this.router.navigate(['/add-document']);
  }

  viewDocumentpopup(documentId: number): void {
    console.log('Opening document viewer popup for document ID:', documentId);
    const document = this.dataSource.data.find(doc => doc.documentId === documentId);
    if (document) {
      this.dialog.open(DocumentViewerComponent, {
        data: {
          documentId: document.documentId
        },
        width: '600px'
      });
    } else {
      console.warn('Document not found for ID:', documentId);
    }
  }

  editDocument(documentId: number): void {
    console.log('Editing document with ID:', documentId);
    this.router.navigate(['/document/edit', documentId]);
  }
}

