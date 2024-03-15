import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../model/contact.model';
import { ContactService } from '../service/contact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() contacts: Contact[] = [];
  @Output() onContactUpdate = new EventEmitter();

  constructor(private router: Router, private service : ContactService) {}

  onView(id: number) {
    this.router.navigate(['contacts', id]);
  }

  onEdit(id: number) {
    this.service.editContactId.next(id);
    this.service.onEdit.next(true);
  }

  onDelete(id: number) {
    this.onContactUpdate.emit(id);
  }
}
