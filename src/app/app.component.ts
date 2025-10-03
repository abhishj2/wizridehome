import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component"; // <-- needed for *ngIf, *ngFor

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, NavbarComponent, FooterComponent], // <-- add CommonModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // <-- corrected
})
export class AppComponent {
  title = 'wizbooking';
}
