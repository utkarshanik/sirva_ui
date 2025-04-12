import { Component } from '@angular/core';
import { KENDO_TOOLBAR } from '@progress/kendo-angular-toolbar';
// import { SVGIcon, alignLeftIcon, alignRightIcon, alignCenterIcon, alignJustifyIcon } from '@progress/kendo-svg-icons';

@Component({
  selector: 'app-navbar',
  imports: [KENDO_TOOLBAR],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // public alignLeftIcon: SVGIcon = alignLeftIcon;
  // public alignRightIcon: SVGIcon = alignRightIcon;
  // public alignCenterIcon: SVGIcon = alignCenterIcon;
  // public alignJustifyIcon: SVGIcon = alignJustifyIcon;

  // public splitButtonData: Array<{ text: string }> = [
  //   {
  //     text: "Option 1",
  //   },
  //   {
  //     text: "Option 2",
  //   },
  //   {
  //     text: "Option 3",
  //   },
  // ];

  // public dropdownButtonData: Array<{ text: string }> = [
  //   {
  //     text: "Option 1",
  //   },
  //   {
  //     text: "Option 2",
  //   },
  //   {
  //     text: "Option 3",
  //   },
  // ];
}
