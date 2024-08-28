export interface Document {
    documentId: number;
    documentTitle: string;
    category: string;
    priority: number;
    importance: number;
    documentFile: ArrayBuffer;
    documentFileName: string;
    documentDate: Date;
    createdAt: Date;
    createdBy: number;
    updatedAt?: Date; 
    updatedBy?: number;
  }