import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCreate } from './invoice-create';

describe('InvoiceCreate', () => {
  let component: InvoiceCreate;
  let fixture: ComponentFixture<InvoiceCreate>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceCreate ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
