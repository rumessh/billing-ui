import {NgModule} from '@angular/core';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    MatSnackBarModule
  } from '@angular/material';

  @NgModule({
    exports: [
      MatAutocompleteModule,
      MatButtonModule,
      MatCheckboxModule,
      MatIconModule,
      MatInputModule,
      MatPaginatorModule,
      MatSelectModule,
      MatSidenavModule,
      MatTableModule,
      MatToolbarModule,
      MatTooltipModule,
      MatCardModule,
      MatSnackBarModule
    ]
  })
  export class BaseMaterialModule {}