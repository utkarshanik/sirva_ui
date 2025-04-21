import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KENDO_GRID, DataBindingDirective, GridComponent, EditEvent, AddEvent, CancelEvent, SaveEvent, RemoveEvent, GridModule, ColumnMenuSettings, CellClickEvent } from '@progress/kendo-angular-grid';
import { KENDO_CHARTS } from '@progress/kendo-angular-charts';
import { KENDO_CHECKBOX, KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_GRID_PDF_EXPORT, KENDO_GRID_EXCEL_EXPORT } from '@progress/kendo-angular-grid';
import { process, SortDescriptor } from '@progress/kendo-data-query';
import { filePdfIcon, fileExcelIcon, SVGIcon, plusIcon } from '@progress/kendo-svg-icons';
import { KENDO_BUTTONS, KENDO_DROPDOWNBUTTON } from '@progress/kendo-angular-buttons';
import { DropDownTreeComponent, KENDO_DROPDOWNLIST, KENDO_DROPDOWNTREE } from '@progress/kendo-angular-dropdowns';
import { menuIcon } from '@progress/kendo-svg-icons'
import { IconsModule } from '@progress/kendo-angular-icons';
import { Product } from '../products';
import { DataservieService } from '../services/dataservie.service';
import {FormControl, FormGroup, ReactiveFormsModule,Validators,} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { listItems,listItems2,areaData  } from './dropdown_data';


@Component({
  selector: 'app-datamanage',
  imports: [KENDO_GRID, GridModule, CommonModule, HttpClientModule,
    KENDO_CHARTS,
    KENDO_INPUTS,
    KENDO_GRID_PDF_EXPORT,
    KENDO_GRID_EXCEL_EXPORT,KENDO_BUTTONS,KENDO_DROPDOWNLIST,
    IconsModule,DropDownTreeComponent,
    KENDO_DROPDOWNTREE,KENDO_CHECKBOX,],
    providers: [DataservieService],
  templateUrl: './datamanage.component.html',
  styleUrls: ['./datamanage.component.css'],
})

export class DatamanageComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  @ViewChild('myGrid') grid!: GridComponent;

 public listItems = listItems;
 public listItems2 = listItems2;
 public areaData = areaData;
 public gridData: Product[] = [];
 public menuIcon = menuIcon;
 public plusIcon= plusIcon;
 public mySelection: string[] = [];
 public pdfSVG: SVGIcon = filePdfIcon;
 public excelSVG: SVGIcon = fileExcelIcon;
 public gridData2: Product[] = [];
 public formGroup: FormGroup | undefined;
 private editedRowIndex: number | undefined = undefined;
 private currentlyEditedRow: number | undefined;
private originalGridData: Product[] = [];

constructor(private service: DataservieService) {}

// Add column menu settings
public ngOnInit(): void {
  this.loadProducts();
}

private loadProducts(): void {
  this.service.products().subscribe((data) => {
    this.gridData = data;
    this.originalGridData = [...data]; 
  });
}

  public addHandler(args: AddEvent | { sender: any }): void {
    const sender = args.sender || this.grid;
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

  public saveHandler({ sender, rowIndex, formGroup, isNew, dataItem }: SaveEvent): void {
    const product = {
      ...formGroup.value,
      id: dataItem.id  // Ensure we include the original item's ID
    };
  
    console.log('Saving product:', product);
  
    if (isNew) {
      this.service.addProduct(product).subscribe(() => this.loadProducts());
      this.closeEditor(sender, rowIndex);
    } else {
      if (!product.id) {
        console.error('Product ID is missing:', product);
        return;
      }
      this.service.updateProduct(product).subscribe(
        () => {
          this.loadProducts();
          sender.closeRow(rowIndex);
          this.formGroup = undefined;
          this.editedRowIndex = undefined;
        },
        error => {
          console.error('Error updating product:', error);
        }
      );
    }
  }

  public editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
    this.closeEditor(sender);
    this.formGroup = createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    this.currentlyEditedRow = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }

  public removeHandler({ dataItem }: RemoveEvent): void {
    this.service.removeProduct(dataItem).subscribe(() => this.loadProducts());
  }

  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex): void {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
    }
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.currentlyEditedRow = undefined;
  }

  public cancelHandler({ sender, rowIndex }: CancelEvent): void {
    this.closeEditor(sender, rowIndex);
  }
 
  public onFilter(value: string): void {
    if (!value) {
      // Reset to original data if search is empty
      this.gridData = [...this.originalGridData];
      return;
    }
  
    const inputValue = value.toLowerCase();
    this.gridData = this.originalGridData.filter(item => {
      return Object.keys(item).some(prop => {
        const value = item[prop]?.toString().toLowerCase();
        return value?.includes(inputValue);
      });
    });
  
    // Only set skip if dataBinding exists
    if (this.dataBinding) {
      this.dataBinding.skip = 0;
    }
  }

// ----------Edit On Row Click------------------->
public rowClickHandler(event: any): void {
  // Save previous edit if exists
  this.saveCurrentEdit();

  const targetRow = event.target.closest('tr');
  if (!targetRow) return;
  
  // Ignore if clicking command buttons
  if (event.target.closest('.k-grid-commands')) return;
  
  const rowElements = Array.from(this.grid.wrapper.nativeElement.querySelectorAll('tbody tr'));
  const rowIndex = rowElements.indexOf(targetRow);
  
  const data = this.grid.data as any[] | null;
  const dataItem = data ? data[rowIndex] : null;
  
  if (dataItem) {
    this.editHandler({
      sender: this.grid,
      rowIndex,
      dataItem,
      isNew: false
    });
  }
}

  public onGridBlur(event: any): void {
    if (this.currentlyEditedRow !== undefined && this.formGroup) {
      const data = this.grid.data as Product[] | null;
      const dataItem = data && this.currentlyEditedRow !== undefined ? data[this.currentlyEditedRow] : null;
      // Save the changes
      this.saveHandler({
        sender: this.grid,
        rowIndex: this.currentlyEditedRow,
        formGroup: this.formGroup,
        isNew: false,
        dataItem
      });
      this.currentlyEditedRow = undefined;
    }
  }

  public onCellClose(args: any): void {
    if (this.formGroup?.dirty && this.editedRowIndex !== undefined) {
      const data = this.grid.data as Product[] | null;
      const dataItem = data && this.editedRowIndex !== undefined ? data[this.editedRowIndex] : null;
      this.saveHandler({
        sender: this.grid,
        rowIndex: this.editedRowIndex,
        formGroup: this.formGroup,
        isNew: false,
        dataItem
      });
    }
  }

  public onCellBlur(args: any): void {
    if (this.formGroup?.dirty) {
      const dataItem = args.dataItem;
      const formGroup = args.formGroup || this.formGroup;
      
      this.saveHandler({
        sender: this.grid,
        rowIndex: this.editedRowIndex || args.rowIndex,
        formGroup: formGroup,
        isNew: false,
        dataItem
      });
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    if (!this.grid?.wrapper.nativeElement.contains(event.target)) {
      this.saveCurrentEdit();
    }
  }

  private saveCurrentEdit(): void {
    if (this.formGroup?.dirty && this.editedRowIndex !== undefined) {
      const data = this.grid.data as Product[] | null;
      const dataItem = data?.[this.editedRowIndex];
      
      if (dataItem) {
        this.saveHandler({
          sender: this.grid,
          rowIndex: this.editedRowIndex,
          formGroup: this.formGroup,
          isNew: false,
          dataItem
        });
      }
    }
  }

 
  // -----------Excel-Sort-Toogle----------------->
  exportExcel(): void {
    if (this.grid) {
      this.grid.saveAsExcel();
    } else {
      console.warn("Grid reference is undefined.");
    }
  }

  onButtonClick() {
    console.log("Button clicked!");
  }

  selected: string = 'non-intl';
  selectButton(type: string) {
    this.selected = type;
  }

  public dropdownSort: SortDescriptor[] = [];
  public onSortChange(sort: SortDescriptor[]): void {
  this.dropdownSort = sort;
  this.gridData = process(this.gridData, { sort }).data;
  }

  public columnMenuSettings: ColumnMenuSettings = {
    filter: true,
    columnChooser: true
  };

  // Add sort settings
  // public sort: Array<any> = [
  //   {
  //     field: 'ProductID',
  //     dir: 'asc'
  //   }
  // ];
}

const createFormGroup = (dataItem: Partial<Product>) =>
  new FormGroup({
    id: new FormControl(dataItem.id),
    ProductID: new FormControl(dataItem.ProductID, Validators.required),
    ProductName: new FormControl(dataItem.ProductName, Validators.required),
    UnitPrice: new FormControl(dataItem.UnitPrice),
    UnitsInStock: new FormControl(
      dataItem.UnitsInStock,
      Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])
    ),
    CategoryID: new FormControl(dataItem.CategoryID, Validators.required),
    SupplierID: new FormControl(dataItem.SupplierID),
    QuantityPerUnit: new FormControl(dataItem.QuantityPerUnit),
    UnitsOnOrder: new FormControl(dataItem.UnitsOnOrder),
    ReorderLevel: new FormControl(dataItem.ReorderLevel),
    Discontinued: new FormControl(dataItem.Discontinued),
  });


