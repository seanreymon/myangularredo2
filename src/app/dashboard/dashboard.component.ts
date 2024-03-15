import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { Contact } from '../model/contact.model';
import { Subscription, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  editContactId!: number;
  editSub!: Subscription;

  constructor(private service: ContactService) {}

  ngOnInit(): void {
    this.fetchContacts();
    this.editSub = this.service.editContactId.asObservable().subscribe((id) => {
      this.editContactId = id;
    });
  }

  fetchContacts() {
    this.service.getContacts().subscribe((contacts: Contact[]) => {
      this.contacts = contacts.slice();
    });
  }

  addContact(contactData: Contact) {
    this.service.createContact(contactData).subscribe((resData) => {
      if (resData) {
        this.fetchContacts();
      }
    });
  }

  updateContact(contactData: Contact) {
    this.service
      .updateContact(this.editContactId, contactData)
      .pipe(
        catchError((error) => {
          console.error('Error updating contact', error);
          return throwError(error);
        })
      )
      .subscribe((res) => {
        if (res) {
          this.fetchContacts();
        }
      });
  }

  deleteContact(id: number) {
    this.service.deleteContact(id).subscribe((resData) => {
      if (resData) {
        this.fetchContacts();
      }
    });
  }

  ngOnDestroy(): void {
    this.editSub.unsubscribe();
  }
}
