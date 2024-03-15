import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../service/contact.service';
import { Contact } from '../model/contact.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit, OnDestroy {

  private dataSub!: Subscription;

  contact: Contact = {
    id: 0,
    name: '',
    email: '',
    contactNumber: ''
  }

  constructor(private route: ActivatedRoute, private service: ContactService) {}

  ngOnInit(): void {
    this.dataSub = this.route.params.subscribe((param) => {
      console.log("subscription done");
      const id = param['id'];
      this.service.getContactById(id).subscribe(resData =>{
        if(resData){
          this.contact = resData;
        }
      })
    });
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy initialized");
    if(this.dataSub){
      this.dataSub.unsubscribe();
      console.log("unsubcription successfull")
    }
  }
}
