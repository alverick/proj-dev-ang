import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cs-message-alert',
  templateUrl: './message-alert.component.html',
  styleUrls: ['./message-alert.component.scss'],
})
export class MessageAlertComponent implements OnInit {
  @Input() mode: string;
  constructor() {}

  ngOnInit() {}
}
