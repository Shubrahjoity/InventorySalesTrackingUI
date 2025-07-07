import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.services';
import { BaseChartDirective } from 'ng2-charts';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { Chart, CategoryScale, LinearScale, BarElement, BarController, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip, Legend);


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  prices: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  selectedProduct: any = null;

  loadingPrices = false;
  loadingTopSold = false;
  loadingReorder = false;

  get filteredItems() {
    return this.prices.filter(p =>
      p.productName?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get pages(): number[] {
    return Array(Math.ceil(this.filteredItems.length / this.pageSize))
      .fill(0).map((x, i) => i + 1);
  }

chartType: any = 'bar';
chartData: any = { labels: [], datasets: [] };
chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: '#333',
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#333' }
    },
    y: {
      ticks: { color: '#333' }
    }
  }
};

  reorderList: any[] = [];
  topSoldProducts: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPrices();
    this.loadTopSold();
    this.loadReorderList();
  }

  loadPrices() {
    this.loadingPrices = true;
    this.apiService.getPrices().subscribe(data => {
      this.prices = data.filter(x => x.productName);
      this.loadingPrices = false;
    }, () => this.loadingPrices = false);
  }
private barColors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
  '#9966FF', '#FF9F40', '#8A2BE2', '#00CED1'
];
  loadTopSold() {
    this.loadingTopSold = true;
    this.apiService.getTopSold().subscribe(data => {
      this.topSoldProducts = data;
      this.chartData = {
        labels: data.map(item => item.productName),
        datasets: [{
          data: data.map(item => item.quantity),
          label: 'Units Sold',
          backgroundColor: data.map((_, i) => this.barColors[i % this.barColors.length])
        }]
      };
      this.loadingTopSold = false;
    }, () => this.loadingTopSold = false);
  }

  loadReorderList() {
    this.loadingReorder = true;
    this.apiService.getReorderList().subscribe(data => {
      this.reorderList = data;
      this.loadingReorder = false;
    }, () => this.loadingReorder = false);
  }

viewDetails(item: any) {
  const id = item.productId;
  if (!id) {
    console.error("Barcode missing for product:", item);
    return;
  }
  this.apiService.getProductDetails(id).subscribe(
    (data) => {
      this.selectedProduct = data;
      
      const modalEl = document.getElementById('detailsModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    },
    (err) => {
      console.error("Error loading product details", err);
    }
  );
}
exportToExcel(): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reorderList);
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Reorder List': worksheet },
    SheetNames: ['Reorder List']
  };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data: Blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });
  FileSaver.saveAs(data, 'Reorder_List.xlsx');
}

}
