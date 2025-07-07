import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ApiService } from '../services/api.services';

interface Product {
  productId: number;
  productName: string;
  productDetailsLT :string;
  productDetailsEN :string;
  inventoryQuantity :string;
  dOE :Date;
  barcode :string;
  price :number;
}

interface CartItem extends Product {
  quantity: number;
}

@Component({
  selector: 'app-sales-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './sales-entry.component.html',
  styleUrls: ['./sales-entry.component.css']
})
export class SalesEntryComponent implements OnInit {
  barcode: string = '';
  cart: CartItem[] = [];
  isLoading = false;
  errorMessage = '';
  showInvoice = false;
  invoiceNumber = '';
  customerName = '';
  customerContact = '';
  currentDate = new Date();

  constructor(private http: HttpClient,private apiService: ApiService) {}

  ngOnInit() {
    const savedCart = localStorage.getItem('salesCart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }
saveInvoice() {
  if (!this.customerName || !this.customerContact) {
    alert('Please enter customer name and contact.');
    return;
  }

  const invoiceData = {
    invoiceNumber: this.invoiceNumber,
    customerName: this.customerName,
    customerContact: this.customerContact,
    items: this.cart,
    total: this.total
  };


this.apiService.saveSalesInvoice(invoiceData).subscribe({
    next: (res) => {
      console.log('Invoice saved!', res);
      this.showInvoice = true;
    },
    error: (err) => {
      console.error(err);
      alert('Failed to save invoice.');
    }
  });
}

  addProduct() {
    if (!this.barcode.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.apiService.getProductDetailsbyBarcode(this.barcode)
      .subscribe({
        next: (product) => {
          const existing = this.cart.find(p => p.barcode === product.barcode);
          if (existing) {
            existing.quantity += 1;
          } else {
            this.cart.push({ ...product, quantity: 1 });
          }
          this.saveCart();
          this.barcode = '';
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Product not found.';
          this.isLoading = false;
        }
      });
  }

  removeItem(index: number) {
    this.cart.splice(index, 1);
    this.saveCart();
  }

  saveCart() {
    localStorage.setItem('salesCart', JSON.stringify(this.cart));
  }

  get total() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

 generateInvoice() {
  this.invoiceNumber = 'INV-' + Date.now();
  this.saveInvoice();
}

  exportPDF() {
    const invoiceElement = document.getElementById('invoice');
    if (!invoiceElement) return;

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${this.invoiceNumber}.pdf`);
    });
  }

  clearCart() {
    this.cart = [];
    this.customerName = '';
    this.customerContact = '';
    this.saveCart();
    this.showInvoice = false;
  }
}
