import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cs-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent implements OnInit {
  @Input() additionalButtons = false;
  @Output() add = new EventEmitter();
  @Output() finish = new EventEmitter();
  constructor() {}

  ngOnInit() {}
}
