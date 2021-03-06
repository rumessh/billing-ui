import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, CatalogDataService} from '../catalog-data/catalog-data';
import { Location } from '@angular/common';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../../../shared/auth-service/auth-service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'category-create',
  templateUrl: 'category-create.html',
  styleUrls: ['category-create.scss'],
})
export class CategoryCreate {

  createCategoryForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private catalogDataService: CatalogDataService,
              private location: Location,
              private snackbar: MatSnackBar,
              private authService: AuthService) {   
      this.createCategoryForm = this.formBuilder.group( {
            name: [ '', Validators.required ]
          });
  }

  onSubmit() {
    const category = this.prepareSaveCategory();
    this.catalogDataService.createCategory(category).then(() => {
      let snackbarRef = this.snackbar.open('Category created successfully', 'Done');
      snackbarRef.afterDismissed().subscribe(() => {
        this.goBack();
      });
    });
  }

  prepareSaveCategory(): Category {
    const formModel = this.createCategoryForm.value;
    
    const category: Category = {
      name: formModel.name,
      orgUuid: this.authService.getOrgUuid()
    };

    return category;
  }

  revert() {
    this.createCategoryForm.reset();
  }

  goBack() {
    this.location.back();
  }
  
}