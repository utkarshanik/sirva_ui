import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { KENDO_DROPDOWNLIST } from "@progress/kendo-angular-dropdowns";
import {
  AddEvent,
  CancelEvent,
  EditEvent,
  GridComponent,
  KENDO_GRID,
  RemoveEvent,
  SaveEvent,
} from "@progress/kendo-angular-grid";
import { categories } from "../categories";
import { Category } from "../model";
import { Product } from "../products";
import { ProductsService } from "../products.service";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [ReactiveFormsModule, KENDO_GRID, KENDO_DROPDOWNLIST],
  providers: [ProductsService],
  template: `
    <kendo-grid
      [data]="gridData"
      (edit)="editHandler($event)"
      (cancel)="cancelHandler($event)"
      (save)="saveHandler($event)"
      (remove)="removeHandler($event)"
      (add)="addHandler($event)"
      [height]="410"
    >
      <ng-template kendoGridToolbarTemplate>
        <button kendoGridAddCommand>Add new</button>
      </ng-template>
      <kendo-grid-column field="ProductName" title="Name" [width]="150">
      </kendo-grid-column>
      <kendo-grid-column field="CategoryID" title="Category" [width]="150">
        <ng-template
          kendoGridEditTemplate
          let-dataItem="dataItem"
          let-formGroup="formGroup"
        >
          <kendo-dropdownlist
            [defaultItem]="{
              CategoryID: null,
              CategoryName: 'Test null item'
            }"
            [data]="categories"
            textField="CategoryName"
            valueField="CategoryID"
            [valuePrimitive]="true"
            [formControl]="formGroup.get('CategoryID')"
          >
          </kendo-dropdownlist>
        </ng-template>
        <ng-template kendoGridCellTemplate let-dataItem>
          {{ category(dataItem.CategoryID)?.CategoryName }}
        </ng-template>
      </kendo-grid-column>
      <kendo-grid-column
        field="UnitPrice"
        title="Price"
        format="c"
        [width]="120"
        editor="numeric"
      >
      </kendo-grid-column>
      <kendo-grid-column
        field="UnitsInStock"
        title="In stock"
        [width]="120"
        editor="numeric"
      >
      </kendo-grid-column>
      <kendo-grid-command-column [width]="220">
        <ng-template kendoGridCellTemplate let-isNew="isNew">
          <button kendoGridEditCommand [primary]="true">Edit</button>
          <button kendoGridRemoveCommand>Remove</button>
         <button kendoGridSaveCommand [disabled]="!!formGroup?.invalid">
            {{ isNew ? "Add" : "Update" }}
          </button>

          <button kendoGridCancelCommand>
            {{ isNew ? "Discard changes" : "Cancel" }}
          </button>
        </ng-template>
      </kendo-grid-command-column>
    </kendo-grid>
  `,
})

export class App2Component implements OnInit {
  public gridData: Product[] = [];
  public categories: Category[] = categories;
  public formGroup: FormGroup | undefined;
  private editedRowIndex: number | undefined = undefined;

  constructor(private service: ProductsService) {}

  public ngOnInit(): void {
    this.gridData = this.service.products();
  }

  public category(id: number): Category | undefined {
    return this.categories.find((x) => x.CategoryID === id);
  }

  public addHandler({ sender }: AddEvent): void {
    this.closeEditor(sender);

    this.formGroup = createFormGroup({
      ProductName: "",
      UnitPrice: 0,
      UnitsInStock: 0,
      CategoryID: 1,
    });

    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
    this.closeEditor(sender);

    this.formGroup = createFormGroup(dataItem);

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }: CancelEvent): void {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    const product = formGroup.value;

    this.service.save(product, isNew);

    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }: RemoveEvent): void {
    this.service.remove(dataItem);
  }

  private closeEditor(
    grid: GridComponent,
    rowIndex = this.editedRowIndex
  ): void {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
}

const createFormGroup = (dataItem: Partial<Product>) =>
  new FormGroup({
    ProductID: new FormControl(dataItem.ProductID),
    ProductName: new FormControl(dataItem.ProductName, Validators.required),
    UnitPrice: new FormControl(dataItem.UnitPrice),
    UnitsInStock: new FormControl(
      dataItem.UnitsInStock,
      Validators.compose([
        Validators.required,
        Validators.pattern("^[0-9]{1,3}"),
      ])
    ),
    CategoryID: new FormControl(dataItem.CategoryID, Validators.required),
  });
