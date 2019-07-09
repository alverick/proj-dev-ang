import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { User } from "src/app/shared/models/user.model";
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public user: User;

  constructor(
    private storageService: StorageService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.user = this.storageService.getCurrentUser();
  }

}
