//W---------={ Book Interface }=----------</br>
export interface Book {
  id: number;
  title: string;
  description: string;
  highlight: string;
  imageUrl?: string;
  price: number;
  discountPrice?: number;
  isActive: boolean;
  createdAt: string;
  editedAt?: string;
  createdBy: {
    id: number;
    firstName: string;
    lastName?: string;
  };
}

//W---------={ Create Book Interface }=----------</br>
export interface CreateBookDto {
  title: string;
  description: string;
  highlight: string;
  imageUrl?: string;
  price: number;
  discountPrice?: number;
}

//W---------={ Update Book Interface }=----------</br>
export interface UpdateBookDto {
  title?: string;
  description?: string;
  highlight?: string;
  imageUrl?: string;
  price?: number;
  discountPrice?: number;
  isActive?: boolean;
}

//W---------={ Search Book Interface }=----------</br>
export interface BookSearchParams {
  search?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  createdBy?: number;
  dateFrom?: string;
  dateTo?: string;
}

//W---------={ Response Book Interface }=----------</br>
export interface BookResponse {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
}

//W---------={ Transaction Interface }=----------</br>
export interface TransactionRes {
  id: number;
  amount: number;
  type: string;
  category: string;
  description: string;
  transactionDate: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}