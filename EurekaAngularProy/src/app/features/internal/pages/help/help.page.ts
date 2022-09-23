import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { internalFullRoutingNames } from '../../internal-routing.names';

@Component({
  selector: 'cs-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  goBack() {
    this.router.navigate([internalFullRoutingNames.HOME]);
  }
}
