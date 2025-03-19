import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-list-price',
  imports: [HeaderComponent , FooterComponent],
  templateUrl: './list-price.component.html',
  styleUrl: './list-price.component.css'
})
export class ListPriceComponent {

}
