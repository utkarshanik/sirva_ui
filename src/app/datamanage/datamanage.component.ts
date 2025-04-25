import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KENDO_GRID, DataBindingDirective, GridComponent, EditEvent, AddEvent, CancelEvent, SaveEvent, RemoveEvent, GridModule, ColumnMenuSettings, CellClickEvent } from '@progress/kendo-angular-grid';
import { KENDO_CHARTS } from '@progress/kendo-angular-charts';
import { KENDO_CHECKBOX, KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_GRID_PDF_EXPORT, KENDO_GRID_EXCEL_EXPORT } from '@progress/kendo-angular-grid';
import { process,State, SortDescriptor } from '@progress/kendo-data-query';
import { filePdfIcon, fileExcelIcon, SVGIcon, plusIcon,menuIcon} from '@progress/kendo-svg-icons';
import { KENDO_BUTTONS, KENDO_DROPDOWNBUTTON } from '@progress/kendo-angular-buttons';
import { DropDownTreeComponent, KENDO_DROPDOWNLIST, KENDO_DROPDOWNTREE } from '@progress/kendo-angular-dropdowns';
import { IconsModule } from '@progress/kendo-angular-icons';
import { Product,Category } from '../products';
import { DataservieService } from '../services/dataservie.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule,Validators,} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { listItems,listItems2,areaData  } from './dropdown_data';
import{categories} from './category';
import { GridSettings } from './gridPref/grid-settings.interface';
import { SavedPreference, StatePersistingService } from './gridPref/service/state-persisting.service';
import{ColumnSettings} from './gridPref/column-settings.interface';
import { KENDO_DATEPICKER } from '@progress/kendo-angular-dateinputs';

@Component({
  selector: 'app-datamanage',
  imports: [KENDO_GRID, GridModule, CommonModule, HttpClientModule,
    KENDO_CHARTS,
    KENDO_INPUTS,
    KENDO_GRID_PDF_EXPORT,
    KENDO_GRID_EXCEL_EXPORT,KENDO_BUTTONS,KENDO_DROPDOWNLIST,
    IconsModule,DropDownTreeComponent,KENDO_DATEPICKER,
    KENDO_DROPDOWNTREE,KENDO_CHECKBOX,ReactiveFormsModule,FormsModule],
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
 public mySelection: string[] = [];
 public pdfSVG: SVGIcon = filePdfIcon;
 public excelSVG: SVGIcon = fileExcelIcon;
 public gridData2: Product[] = [];
 public categories: Category[] = categories;
 public formGroup: FormGroup | undefined;
 private editedRowIndex: number | undefined = undefined;
 private currentlyEditedRow: number | undefined;
 private originalGridData: Product[] = [];
 public menuIcon = menuIcon;
 public plusIcon= plusIcon;

 public savedPreferences: SavedPreference[] = [];
 public selectedPreferenceId: string = '';
 public selectedPreference: SavedPreference | null = null; 

constructor(private service: DataservieService,public persistingService: StatePersistingService) {
  const persistedSettings = this.persistingService.get("gridSettings") as GridSettings;
  if (persistedSettings && 'state' in persistedSettings && 'columnsConfig' in persistedSettings) {
    this.gridSettings = this.mapGridSettings(persistedSettings);
  }
}

public ngOnInit(): void {
  this.loadProducts();
  this.loadPreferences();
}

private loadProducts(): void {
  this.service.products().subscribe((data) => {
    this.gridData = data;
    this.originalGridData = [...data]; 
    // console.log('Loaded products:', this.gridData);
  });
}

// Load saved preferences from the service
private loadPreferences(): void {
  this.savedPreferences = this.persistingService.getAllPreferences();
  this.savedStateExists = this.savedPreferences.length > 0;
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
      Discontinued: false,
      Sales: "0",
      Source: "0",
      Coordinator: "0",
      Mobile: "0",
      AssignedDate: "0",
      EffectiveDate: "0",
      ValidDate: "0",
      CheckingDate: "0",
    });

    sender.addRow(this.formGroup);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew, dataItem }: SaveEvent): void {
    const formValue = formGroup.value;
  
    // Format date before saving
    if (formValue.AssignedDate instanceof Date) {
      formValue.AssignedDate = formValue.AssignedDate.toISOString();
    }
    formValue.EffectiveDate = formValue.EffectiveDate.toISOString();
    formValue.ValidDate = formValue.ValidDate.toISOString();
    const product = {
      ...formValue,
      id: dataItem.id
    };
  
    if (isNew) {
      this.service.addProduct(product).subscribe(() => this.loadProducts());
      this.closeEditor(sender, rowIndex);
    } else {
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
@HostListener('document:click', ['$event'])
handleDocumentClick(event: MouseEvent) {
  if (!this.grid?.wrapper.nativeElement.contains(event.target)) {
    this.saveCurrentEdit();
  }
}
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

  // Add column menu and settings Drop down lead id
public category(id: number): Category {
  const category = this.categories.find((x) => x.CategoryID === id);
  if (!category) {
    throw new Error(`Category with ID ${id} not found`);
  }
  return category;
}
public getCategoryName(categoryId: number): string {
  const category = this.categories.find(c => c.CategoryID === categoryId);
  return category?.CategoryName || '';
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
    window.location.reload()
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

  // ---------------------Save Prefrence-------------------->
  public gridSettings: GridSettings = {
    state: {
      skip: 0,
      take: 5,

      // Initial filter descriptor
      filter: {
        logic: "and",
        filters: [],
      },
      group: [],
    },
    gridData: process(this.gridData, {
      skip: 0, 
      take: 5,
      // Initial filter descriptor
      filter: {
        logic: "and",
        filters: [],
      },
      group: [],
    }),
    columnsConfig: [
      {
        field: "ProductID",
        title: "ID",
        filterable: false,
        filter: "numeric",
        width: 60,
        hidden: false,
      },
      {
        field: "ProductName",
        title: "Product Name",
        filterable: true,
        filter: "text",
        width: 300,
        hidden: false,
      },
      {
        field: "SupplierID",
        title: "Supplier",
        filterable: true,
        filter: "numeric",
        width: 200,
        hidden: false,
      },
      {
        field: "CategoryID",
        title: "Category",
        filterable: true,
        filter: "numeric",
        width: 200,
        hidden: false,
      },
      {
        field: "QuantityPerUnit",
        title: "Quantity Per Unit",
        filterable: true,
        filter: "text",
        width: 200,
        hidden: false,
      },
      {
        field: "UnitPrice",
        title: "Units Price",
        filterable: true,
        filter: "text",
        width: 180,
        hidden: false,
      },
      {
        field: "UnitsInStock",
        title: "Units In Stock",
        filterable: true,
        filter: "numeric",
        width: 180,
        hidden: false,
      },
      {
        field: "UnitsOnOrder",
        title: "Units On Order",
        filterable: true,
        filter: "numeric",
        width: 180,
        hidden: false,
      },
      {
        field: "ReorderLevel",
        title: "Reorder Level",
        filterable: true,
        filter: "text",
        width: 180,
        hidden: false,
      },
    ],
  };

  private isValidGridSettings(settings: any): settings is GridSettings {
    return settings 
      && 'state' in settings 
      && 'columnsConfig' in settings 
      && Array.isArray(settings.columnsConfig);
  }

  private applyGridSettings(settings: GridSettings): void {
    if (!this.grid) return;
  
    // Apply sort
    if (settings.state.sort) {
      this.grid.sort = settings.state.sort;
    }
  
    // Apply filters
    if (settings.state.filter) {
      this.grid.filter = settings.state.filter;
    }
  
    // Apply column configurations
    if (settings.columnsConfig) {
      this.grid.columns.forEach(column => {
        const savedColumn = settings.columnsConfig.find(c => c.field === (column as any).field);
        if (savedColumn) {
          column.width = savedColumn.width;
          column.hidden = savedColumn.hidden;
        }
      });
    }

  }
  public saveGridSettings(grid: GridComponent): void {
    // Show dialog for preference name
    const name = prompt('Enter a name for this preference:');
    if (!name) return;
  
    const gridConfig = {
      state: this.gridSettings.state,
      gridData: this.gridSettings.gridData,
      columnsConfig: grid.columns.toArray().map(item => ({
        field: (item as any).field,
        width: (item as any).width,
        title: (item as any).title,
        filter: (item as any).filter,
        format: (item as any).format,
        filterable: (item as any).filterable,
        orderIndex: item.orderIndex,
        hidden: item.hidden,
      }))
    };
  
    this.persistingService.savePreference(name, gridConfig);
    this.loadPreferences();
  }
  
  public loadSavedState(preference: SavedPreference): void {
    if (!preference) return;
  
    const settings = preference.gridConfig;
    if (settings && this.isValidGridSettings(settings)) {
      try {
        // Update grid settings
        this.gridSettings = this.mapGridSettings(settings);
  
        if (this.grid) {
          // Apply state
          if (settings.state) {
            if (settings.state.sort) {
              this.grid.sort = settings.state.sort;
            }
            if (settings.state.filter) {
              this.grid.filter = settings.state.filter;
            }
            this.gridSettings.state.take = this.gridData.length; // Show all rows
            this.gridSettings.state.skip = 0; // Start from first page
            this.grid.pageSize = this.gridData.length;
            this.grid.skip = 0;
          }
  
          // Apply column configurations
          if (settings.columnsConfig) {
            const columns = this.grid.columns.toArray();
            
            // First apply column properties
            columns.forEach(column => {
              const savedColumn = settings.columnsConfig.find(c => c.field === (column as any).field);
              if (savedColumn) {
                column.width = savedColumn.width;
                column.hidden = savedColumn.hidden;
                (column as any).orderIndex = savedColumn.orderIndex;
              }
            });
  
            // Then handle column reordering
            const orderedFields = settings.columnsConfig
              .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
              .map(col => col.field);
  
            if (orderedFields.length > 0) {
              orderedFields.forEach((field, index) => {
                  const column = this.grid.columns.find(col => (col as any).field === field);
                  if (column) {
                      this.grid.reorderColumn(column, index);
                  }
              });
            }
          }
  
          // Refresh data and grid
          this.gridData = process(this.gridData, settings.state).data;
          this.grid.data = [...this.gridData];
          // this.grid.refresh();
  
          console.log('Successfully loaded preference:', preference.name);
        }
      } catch (error) {
        console.error('Error applying grid settings:', error);
      }
    } else {
      console.warn('Invalid grid settings in preference:', preference);
    }
  }
 
  private getDefaultGridSettings(): GridSettings {
    return {
      state: {
        skip: 0,
        take: 5,
        filter: {
          logic: "and",
          filters: [],
        },
        group: [],
      },
      gridData: process(this.gridData, {
        skip: 0,
        take: 5,
        filter: {
          logic: "and",
          filters: [],
        },
        group: [],
      }),
      columnsConfig: this.gridSettings.columnsConfig
    };
  }

  public savedStateExists: boolean = false;
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.gridSettings.gridData = process(this.gridData, state);
  }

  public mapGridSettings(gridSettings: GridSettings): GridSettings {
    const state = gridSettings.state;
    this.mapDateFilter(state.filter);

    return {
      state,
      columnsConfig: gridSettings.columnsConfig.sort(
        (a: any, b: any) => a.orderIndex - b.orderIndex
      ),
      gridData: process(this.gridData, state),
    };
  }

  private mapDateFilter = (descriptor: any) => {
    const filters = descriptor.filters || [];

    filters.forEach((filter: any) => {
      if (filter.filters) {
        this.mapDateFilter(filter);
      } else if (filter.field === "FirstOrderedOn" && filter.value) {
        filter.value = new Date(filter.value);
      }
    });
  };

  // --------Delete Prefrences------------------->
  
  deletePreference(item: any, event: Event): void {
    event.stopPropagation(); // Prevent dropdown from selecting the item
    const index = this.savedPreferences.indexOf(item);
    if (index > -1) {
      this.savedPreferences.splice(index, 1);
      // Optional: clear selectedPreference if it's the deleted one
      if (this.selectedPreference?.id === item.id) {
        this.selectedPreference = null;
      }
    }
    this.persistingService.deletePreference(item.id);
  }
  

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
    Sales: new FormControl(dataItem.Sales),
    Source: new FormControl(dataItem.Source),
    Coordinator: new FormControl(dataItem.Coordinator),
    Mobile: new FormControl(dataItem.Mobile),
    AssignedDate: new FormControl(
      dataItem.AssignedDate ? new Date(dataItem.AssignedDate) : null
    ),
    EffectiveDate: new FormControl(dataItem.EffectiveDate ? new Date(dataItem.EffectiveDate) : null),
    ValidDate: new FormControl(dataItem.ValidDate ? new Date(dataItem.ValidDate) : null),
    CheckingDate: new FormControl(dataItem.CheckingDate),

  });


