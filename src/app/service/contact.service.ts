import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from '../model/contact.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  public editContactId = new Subject<number>();
  public onEdit = new Subject<boolean>();
  
  url = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {}

  getContacts(){
    return this.http.get<Contact[]>(this.url);
  }

  getContactById(id : number){
    return this.http.get<Contact>(`${this.url}/${id}`);
  }
  
  createContact(contactData : Contact){
    return this.http.post(this.url, {
      name: contactData.name,
      email: contactData.email,
      contactNumber: contactData.contactNumber
    })
  }

  updateContact(id: number, contactData: Contact){
    return this.http.put(`${this.url}/${id}`, contactData);
  }

  deleteContact(id:number){
    return this.http.delete<Contact[]>(`${this.url}/${id}`);
  }
}
