import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cs-sidebar-service',
  templateUrl: './sidebar-service.component.html',
  styleUrls: ['./sidebar-service.component.scss'],
})
export class SidebarServiceComponent implements OnInit {
  @Input() position: number;
  constructor() {}

  ngOnInit() {}
}
