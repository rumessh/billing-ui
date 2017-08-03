import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Customer, CustomerDataService} from '../customer-data/customer-data';
import { Location } from '@angular/common';
import {MdSnackBar} from '@angular/material';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'customer-create',
  templateUrl: 'customer-create.html',
  styleUrls: ['customer-create.scss'],
})
export class CustomerCreate {

  createCustomerForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private customerDataService: CustomerDataService,
              private location: Location,
              private snackbar: MdSnackBar) {   
      this.createCustomerForm = this.formBuilder.group( {
            name: [ '', Validators.required ],
            phone: [ '', Validators.required ]
          });
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
      orgUuid: 'cb84016e-73d9-11e7-8a46-1db42fcd78ef'
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