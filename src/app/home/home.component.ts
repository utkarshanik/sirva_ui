import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KENDO_GRID, DataBindingDirective } from '@progress/kendo-angular-grid';
import { KENDO_CHARTS } from '@progress/kendo-angular-charts';
import { KENDO_CHECKBOX, KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_GRID_PDF_EXPORT, KENDO_GRID_EXCEL_EXPORT } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { employees } from '../employees';
import { filePdfIcon, fileExcelIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { images } from '../images';
import { NavbarComponent } from '../navbar/navbar.component';
import { KENDO_BUTTONS, KENDO_DROPDOWNBUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { menuIcon } from '@progress/kendo-svg-icons'
import { IconsModule } from '@progress/kendo-angular-icons';

@Component({
  selector: 'app-home',
  imports: [KENDO_GRID,  CommonModule,
    KENDO_CHARTS,
    KENDO_INPUTS,
    KENDO_GRID_PDF_EXPORT,
    KENDO_GRID_EXCEL_EXPORT,NavbarComponent,KENDO_CHECKBOX,KENDO_BUTTONS,KENDO_DROPDOWNLIST,IconsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  public gridData: unknown[] = employees;
  public gridView: unknown[] = [];
  public menuIcon = menuIcon;
  public mySelection: string[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;

  public ngOnInit(): void {
    this.gridView = this.gridData;
  }

  // DropDowns
  public listItems: Array<string> = [
    "Item 1",
    "Item 2",
    "Item 3"
];

  public onFilter(value: string): void {
    const inputValue = value;

    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "full_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "job_title",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "budget",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "phone",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "address",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  public photoURL(dataItem: { img_id: string; gender: string }): string {
    const code: string = dataItem.img_id + dataItem.gender;
    const image: { [Key: string]: string } = images;

    return image[code];
  }

  public flagURL(dataItem: { country: string }): string {
    const code: string = dataItem.country;
    const image: { [Key: string]: string } = images;

    return image[code];
  }
  
  onButtonClick()
  {
      alert("cliked on create")
  }
  // save()
  // {
  //   alert("export to excel")
  // }
}
