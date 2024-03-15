import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact } from '../model/contact.model';
import { ContactService } from '../service/contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent implements OnInit, OnDestroy {
  @Output() createContactEvent = new EventEmitter<Contact>();
  @Output() editContactEvent = new EventEmitter<Contact>();
  firstSub!: Subscription;
  secondSub!: Subscription;

  contactForm!: FormGroup;
  editContactDetails: Contact = {
    id: 0,
    name: '',
    email: '',
    contactNumber: '',
  };
  isEditMode: boolean = false;
  editContactId: number = 0;

  constructor(private service: ContactService) {}

  ngOnInit(): void {
    console.log("ngOnInit initialized");
    this.initalizeCreate();
    this.initializeEdit();
    console.log("editmode initalized");
  }

  initalizeCreate() {
    this.contactForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      contactNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9]{11}'),
      ]),
    });
  }
  initializeEdit() {
    this.firstSub = this.service.onEdit.asObservable().subscribe((res) => {
      this.isEditMode = res;
      // console.log(this.isEditMode);
      console.log(res);
    });

    this.secondSub = this.service.editContactId
      .asObservable()
      .subscribe((resData) => {
        this.editContactId = resData;
        console.log(this.editContactId);
        this.service.getContactById(this.editContactId).subscribe((resData) => {
          this.editContactDetails = resData;
          console.log(this.editContactDetails);
          this.contactForm.setValue({
            name: this.editContactDetails.name,
            email: this.editContactDetails.email,
            contactNumber: this.editContactDetails.contactNumber,
          });
        });
      });
  }

  onSubmit() {
    try{
      if (!this.isEditMode) {
        console.log(this.isEditMode);
        this.createContactEvent.emit(this.contactForm.value);
        this.contactForm.reset();
      }
      else {
        this.editContactEvent.emit(this.contactForm.value);
        this.isEditMode = false;
        this.contactForm.reset();
      }
    }
    catch(error){
      throw new Error("Contact not found");
    }
  }

  onCancel(){
    this.service.onEdit.next(false);
    console.log(this.isEditMode)
    this.contactForm.reset();
  }

  ngOnDestroy(): void {
    this.firstSub.unsubscribe();
    console.log('first sub unsubscribed');
    this.secondSub.unsubscribe();
    console.log('second sub unsubscribed');
  }
}
