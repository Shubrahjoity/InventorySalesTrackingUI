import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule,RouterLink],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  name = '';
  email = '';
  photoUrl = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.name = sessionStorage.getItem('name') || '';
    this.email = sessionStorage.getItem('email') || '';
    this.photoUrl = sessionStorage.getItem('photoUrl') || '';
  };

  logout(): void {
  console.log('Logging out...');
  
  this.router.navigateByUrl('/login').then(() => {
    setTimeout(() => {
      window.location.reload(); // ✅ reload after route is fully changed
    }, 50); // ⏳ 50ms is usually enough
  });
  sessionStorage.clear();
}
}
