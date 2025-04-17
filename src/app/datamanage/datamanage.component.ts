import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KENDO_GRID, DataBindingDirective, GridComponent, EditEvent, AddEvent, CancelEvent, SaveEvent, RemoveEvent } from '@progress/kendo-angular-grid';
import { KENDO_CHARTS } from '@progress/kendo-angular-charts';
import { KENDO_CHECKBOX, KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_GRID_PDF_EXPORT, KENDO_GRID_EXCEL_EXPORT } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { filePdfIcon, fileExcelIcon, SVGIcon } from '@progress/kendo-svg-icons';
// import { images } from '../images';
import { KENDO_BUTTONS, KENDO_DROPDOWNBUTTON } from '@progress/kendo-angular-buttons';
import { DropDownTreeComponent, KENDO_DROPDOWNLIST, KENDO_DROPDOWNTREE } from '@progress/kendo-angular-dropdowns';
import { menuIcon } from '@progress/kendo-svg-icons'
import { IconsModule } from '@progress/kendo-angular-icons';
// import { products,Product } from '../employees';
import { Product } from '../products';
import { DataservieService } from '../services/dataservie.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-datamanage',
  imports: [KENDO_GRID,CommonModule,HttpClientModule,
    KENDO_CHARTS,
    KENDO_INPUTS,
    KENDO_GRID_PDF_EXPORT,
    KENDO_GRID_EXCEL_EXPORT,KENDO_BUTTONS,KENDO_DROPDOWNLIST,IconsModule,DropDownTreeComponent,KENDO_DROPDOWNTREE,KENDO_CHECKBOX,],
    providers: [DataservieService],
  templateUrl: './datamanage.component.html',
  styleUrl: './datamanage.component.css',
})

export class DatamanageComponent implements OnInit {
 public gridData: Product[] = [];
//  public gridView: unknown[] = [];
 public menuIcon = menuIcon;
 public mySelection: string[] = [];
 public pdfSVG: SVGIcon = filePdfIcon;
 public excelSVG: SVGIcon = fileExcelIcon;
 public gridData2: Product[] = [];
 public formGroup: FormGroup | undefined;
 private editedRowIndex: number | undefined = undefined;

  constructor(private service: DataservieService) {}

  public ngOnInit(): void {
    // this.gridView = this.gridData;
    // this.gridData2 = this.service.products();
    // console.log(this.gridData2);
    this.loadProducts();
  }


  private loadProducts(): void {
    this.service.products().subscribe((data) => {
      this.gridData = data;
    });
  }

  public addHandler({ sender }: AddEvent): void {
    this.closeEditor(sender);

    this.formGroup = createFormGroup({
      ProductName: '',
      UnitPrice: "0",
      UnitsInStock: 0,
      CategoryID: 0,
      SupplierID: 0,
      QuantityPerUnit: "0",
      UnitsOnOrder: 0,
      ReorderLevel: "0",
      ProductID: 0,
    });

    sender.addRow(this.formGroup);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    const product = formGroup.value;
  
    console.log('Saving product:', product); // Debug log to check the product object
  
    if (isNew) {
      this.service.addProduct(product).subscribe(() => this.loadProducts());
    } else {
      if (!product.id) {
        console.error('Product ID is missing:', product); // Log error if ID is missing
        return;
      }
      this.service.updateProduct(product).subscribe(() => this.loadProducts());
    }
  
    sender.closeRow(rowIndex);
  }
  
  public removeHandler({ dataItem }: RemoveEvent): void {
    this.service.removeProduct(dataItem).subscribe(() => this.loadProducts());
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex): void {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  // public addHandler({ sender }: AddEvent): void {
  //   this.closeEditor(sender);

  //   this.formGroup = createFormGroup({
  //     ProductName: "",
  //     UnitPrice: 0,
  //     UnitsInStock: 0,
  //     CategoryID: 1,
  //   });

  //   sender.addRow(this.formGroup);
  // }

  public editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
    this.closeEditor(sender);

    this.formGroup = createFormGroup(dataItem);

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }: CancelEvent): void {
    this.closeEditor(sender, rowIndex);
  }

  // public saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
  //   const product = formGroup.value;

  //   this.service.save(product, isNew);

  //   sender.closeRow(rowIndex);
  // }

  // public removeHandler({ dataItem }: RemoveEvent): void {
  //   this.service.remove(dataItem);
  // }

  // private closeEditor(
  //   grid: GridComponent,
  //   rowIndex = this.editedRowIndex
  // ): void {
  //   grid.closeRow(rowIndex);
  //   this.editedRowIndex = undefined;
  //   this.formGroup = undefined;
  // }
 
 @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
 @ViewChild('myGrid') grid!: GridComponent;

// Search and filter====================> 
public onFilter(value: string): void {
  const inputValue = value;
  console.log(inputValue);
  this.gridData = process(this.gridData, {
    filter: {
      logic: "or",
      filters: [
        {
          field: "ProductID",
          operator: "contains",
          value: inputValue,
        },
        {
          field: "ProductName",
          operator: "contains",
          value: inputValue,
        },
      ],
    },
  }).data;

  this.dataBinding.skip = 0;
}

// Excel sheet 
exportExcel(): void {
  if (this.grid) {
    this.grid.saveAsExcel();  // Should work now
  } else {
    console.warn("Grid reference is undefined.");
  }
}

// buuton function -------------------------------
onButtonClick() {
  // Add your button click logic here
  console.log("Button clicked!");
}
//Toggle button---------------------------------
selected: string = 'non-intl'; // default
selectButton(type: string) {
  this.selected = type;
}
// DropDowns ===========>
  public listItems: Array<string> = [
    "lead 1",
    "lead 2",
    "lead 3"
];
  public listItems2: Array<string> = [
    "Pref 1",
    "Pref 2",
    "Pref 3"
];

// DropDown
public areaData: AreaData[] = [
  {
    text: "View Lead",
    id: 1,
    areas: [
      { text: "Chicago", id: 4 },
      { text: "Los Angeles", id: 3 },
      { text: "New York", id: 2 },
      { text: "San Francisco", id: 5 },
    ],
  },
  {
    text: "Edit Lead",
    id: 6,
    areas: [
      { text: "Amsterdam", id: 7 },
      { text: "Barcelona", id: 10 },
      { text: "London", id: 8 },
      { text: "Paris", id: 9 },
    ],
  },
  {
    text: "Assigned to Sales Rep",
    id: 6,
    areas: [
      { text: "Amsterdam", id: 7 },
      { text: "Barcelona", id: 10 },
      { text: "London", id: 8 },
      { text: "Paris", id: 9 },
    ],
  },
  {
    text: "Schedule Appoitment",
    id: 6,
    areas: [
      { text: "Amsterdam", id: 7 },
      { text: "Barcelona", id: 10 },
      { text: "London", id: 8 },
      { text: "Paris", id: 9 },
    ],
  },
  {
    text: "Possible Matches",
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

const createFormGroup = (dataItem: Partial<Product>) =>
  new FormGroup({
    id: new FormControl(dataItem.id), // Ensure this is included
    ProductID: new FormControl(dataItem.ProductID, Validators.required),
    ProductName: new FormControl(dataItem.ProductName, Validators.required),
    UnitPrice: new FormControl(dataItem.UnitPrice),
    UnitsInStock: new FormControl(
      dataItem.UnitsInStock,
      Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])
    ),
    CategoryID: new FormControl(dataItem.CategoryID, Validators.required),
    SupplierID: new FormControl(dataItem.SupplierID), // Add SupplierID
    QuantityPerUnit: new FormControl(dataItem.QuantityPerUnit), // Add QuantityPerUnit
    UnitsOnOrder: new FormControl(dataItem.UnitsOnOrder), // Add UnitsOnOrder
    ReorderLevel: new FormControl(dataItem.ReorderLevel), // Add ReorderLevel
    Discontinued: new FormControl(dataItem.Discontinued), // Add Discontinued
  });

  type AreaData = {
    text: string;
    id: number;
    areas: Area[];
  };
  
  type Area = {
    text: string;
    id: number;
  };