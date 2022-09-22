import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cs-help-item',
  templateUrl: './help-item.component.html',
  styleUrls: ['./help-item.component.scss'],
})
export class HelpItemComponent implements OnInit {
  panelOpenState = false;
  @Input() title = '';
  constructor() {}

  ngOnInit() {}
}
