import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductComponent } from './core/components/product/product.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductComponent],
  template: `<app-product></app-product>`
})

export class AppComponent {
 
}






