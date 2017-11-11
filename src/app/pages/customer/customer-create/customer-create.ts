import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer, CustomerDataService } from '../customer-data/customer-data';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../../shared/auth-service/auth-service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'customer-create',
  templateUrl: 'customer-create.html',
  styleUrls: ['customer-create.scss'],
})
export class CustomerCreate {

  step = 0;

  createCustomerForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private customerDataService: CustomerDataService,
    private location: Location,
    private snackbar: MatSnackBar,
    private authService: AuthService) {
    this.createCustomerForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address1: [''],
      address2: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      country: ['']
    });
  }

  setStep(index: number) {
    this.step = index;
  }

  openAddress() {
    this.step++;
  }

  openPersonalInfo() {
    this.step--;
  }

  onSubmit() {
    const customer = this.prepareSaveCustomer();
    this.customerDataService.createCustomer(customer).then(() => {
      let snackbarRef = this.snackbar.open('Customer created successfully', 'Done');
      snackbarRef.afterDismissed().subscribe(() => {
        this.goBack();
      });
    });
  }

  prepareSaveCustomer(): Customer {
    const formModel = this.createCustomerForm.value;

    const customer: Customer = {
      name: formModel.name,
      phone: formModel.phone,
      orgUuid: this.authService.getOrgUuid(),
      address: {
        address1: formModel.address1,
        address2: formModel.address2,
        city: formModel.city,
        state: formModel.state,
        zipCode: formModel.zipCode,
        country: formModel.country
      }
    };

    return customer;
  }

  revert() {
    this.createCustomerForm.reset();
  }

  goBack() {
    this.location.back();
  }

}