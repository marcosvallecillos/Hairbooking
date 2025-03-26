import { Component } from '@angular/core';
import { Usuario } from '../../models/user.interface';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-show-profile',
  imports: [RouterLink],
  templateUrl: './show-profile.component.html',
  styleUrl: './show-profile.component.css'
})
export class ShowProfileComponent {
  userData: Usuario | null = null;
}
