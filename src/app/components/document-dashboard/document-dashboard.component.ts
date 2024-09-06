import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentViewerComponent } from '../document-viewer/document-viewer.component';

interface Document {
  documentId: number;
  documentTitle: string;
  categoryId: number;
  priority: number;
  importance: number;
  documentFileName: string;
  documentDate: string | null;
  category?: string;
}

interface Category {
  categoryId: number;
  categoryName: string;
}

@Component({
  selector: 'app-document-dashboard',
  templateUrl: './document-dashboard.component.html',
  styleUrls: ['./document-dashboard.component.css'],
})
export class DocumentDashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['documentTitle', 'category', 'priority', 'importance', 'documentDate', 'actions'];
  dataSource: MatTableDataSource<Document> = new MatTableDataSource<Document>([]);
  originalDataSource: Document[] = [];
  categories: Category[] = [];
  filterValues = {
    category: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchCategories() {
    this.http.get<Category[]>('https://localhost:7143/api/Document/categories').subscribe(
      (data) => {
        console.log('Fetched categories:', data);
        this.categories = data;
        this.fetchDocuments(); // Fetch documents after categories are loaded
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  fetchDocuments() {
    this.http.get<Document[]>('https://localhost:7143/api/Document/get').subscribe(
      (data) => {
        console.log('Fetched documents:', data);
        this.originalDataSource = data.map((doc) => ({
          ...doc,
          category: this.categories.find(cat => cat.categoryId === doc.categoryId)?.categoryName || 'Unknown',
          documentDate: doc.documentDate ? this.datePipe.transform(new Date(doc.documentDate), 'dd-MM-yyyy') : null,
        }));

        this.dataSource.data = this.originalDataSource;
        console.log('Original dataSource:', this.originalDataSource);
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }

  createFilter(): (data: Document, filter: string) => boolean {
    return (data: Document, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      return (searchTerms.category === '' || (data.category?.toLowerCase() || '').includes(searchTerms.category.toLowerCase()));

    };
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterDocuments(event: any) {
    const value = event.target.value.trim().toLowerCase();
    this.filterValues.category = value;
    this.applyFilter();
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

  goToAddDocument() {
    this.router.navigate(['/add-document']);
  }

  viewDocumentpopup(documentId: number): void {
    const document = this.dataSource.data.find((doc) => doc.documentId === documentId);
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
