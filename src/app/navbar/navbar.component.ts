import { Component } from '@angular/core';
import { KENDO_CALENDAR, CalendarModule, KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { TabStripModule } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-navbar',
  imports: [TabStripModule, KENDO_CALENDAR, CalendarModule,KENDO_DATEINPUTS],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
