import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar,MatSnackBarModule } from '@angular/material/snack-bar'; 
import { Product } from '../../models/product';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule ,MatSnackBarModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productList: Product[] = [];
  productModel: Product = { id: 0, name: '', price: 0, category: '' };
  filteredList: Product[]=[];
  searchText: string = '';
  sortColumn: string = '';
  sortDirection: string = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private productService: ProductService,   private snackBar: MatSnackBar  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.snackBar.open('Snackbar Test Working!', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  getAllProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.productList = data;
      this.filteredList = [...data]; 
    });
  }
  get paginatedList(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredList.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredList.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }


  filterProducts(): void {
    const search = this.searchText.trim().toLowerCase();
    if (search) {
      this.filteredList = this.productList.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      );
    } else {
      this.filteredList = [...this.productList];  // Show all when empty
    }
  }


  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    if (this.productModel.id === 0) {
      this.productService.addProduct(this.productModel).subscribe(() => {
        this.getAllProducts();
        this.resetForm();
        this.snackBar.open('Product added successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      });
    } else {
      this.productService.updateProduct(this.productModel).subscribe(() => {
        this.getAllProducts();
        this.resetForm();
        this.snackBar.open('Product updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      });
    }
  }

  editProduct(product: Product): void {
    this.productModel = { ...product };
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.getAllProducts();
      });
    }
  }

  resetForm(form?: NgForm): void {
    if (form) {
      form.resetForm();
    }
    this.productModel = { id: 0, name: '', price: 0, category: '' };
  }

  
  sortTable(column: keyof Product): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  
    this.filteredList.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
  
      // Handle string and number safely
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
  
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
  
      return 0;  // fallback
    });
  }
  



  

}

