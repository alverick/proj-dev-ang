import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { User } from "src/app/shared/models/user.model";
import { StorageService } from 'src/app/shared/services/storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    
  public user: User;
  private homeService: HomeService;
  private unsubscribe = new Subject();

  typeSelected: String;
  type: String[];

  wayPaySelected: String;
  wayPay: String[];

  dateSelected: String;
  date: String[];

  constructor(
    private storageService: StorageService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();
    this.homeService.getType().pipe(takeUntil(this.unsubscribe)).subscribe(
      value => {
        this.type = value;
        this.typeSelected = value[0];
      }
    );
    this.homeService.getWayPay().pipe(takeUntil(this.unsubscribe)).subscribe(
      value => {
        this.wayPay = value;
        this.wayPaySelected = value[0];
      }
    );    
    
    this.homeService.getDate().pipe(takeUntil(this.unsubscribe)).subscribe(
      value =>{
        this.date = value;
        this.dateSelected = value[0];
      }
    );
      
      

  }


  

}
