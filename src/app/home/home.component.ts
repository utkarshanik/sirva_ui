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
import { KENDO_BUTTONS, KENDO_DROPDOWNBUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DROPDOWNLIST, KENDO_DROPDOWNTREE } from '@progress/kendo-angular-dropdowns';
import { menuIcon } from '@progress/kendo-svg-icons'
import { IconsModule } from '@progress/kendo-angular-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [KENDO_GRID,  CommonModule,
    KENDO_CHARTS,
    KENDO_INPUTS,
    KENDO_GRID_PDF_EXPORT,
    KENDO_GRID_EXCEL_EXPORT,KENDO_CHECKBOX,KENDO_BUTTONS,KENDO_DROPDOWNLIST,IconsModule,KENDO_DROPDOWNTREE],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',

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

  // dropDowntree
  public areaData: AreaData[] = [
    {
      text: "America",
      id: 1,
      areas: [
        { text: "Chicago", id: 4 },
        { text: "Los Angeles", id: 3 },
        { text: "New York", id: 2 },
        { text: "San Francisco", id: 5 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
    {
      text: "Europe",
      id: 6,
      areas: [
        { text: "Amsterdam", id: 7 },
        { text: "Barcelona", id: 10 },
        { text: "London", id: 8 },
        { text: "Paris", id: 9 },
      ],
    },
  ];
}
type AreaData = {
  text: string;
  id: number;
  areas: Area[];
};

type Area = {
  text: string;
  id: number;
};