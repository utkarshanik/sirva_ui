import { Component } from '@angular/core';
import { KENDO_CALENDAR, CalendarModule, KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { HomeComponent } from "../home/home.component";
import { DatamanageComponent } from '../datamanage/datamanage.component';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [
    TabStripModule, 
    KENDO_CALENDAR, 
    CalendarModule, 
    KENDO_DATEINPUTS, 
    HomeComponent,
    DatamanageComponent,
    KENDO_BUTTONS
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private themeService: ThemeService) {}

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
