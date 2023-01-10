import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IEntryModel } from '../../../../shared/models';
import { authFullRoutingChildNames } from '../../auth-routing.names';
import { errorRegisterAuth } from '../../constants';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-update-company',
  templateUrl: './update-company.page.html',
  styleUrls: ['./update-company.page.scss'],
})
export class UpdateCompanyPage implements OnInit {
  entryOptions: IEntryModel[] = [];
  errors = errorRegisterAuth;

  constructor(
    private router: Router,
    public affiliation: AffiliationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ entries }: any) => {
      this.entryOptions = entries;
    });
  }

  onSubmit() {
    this.router.navigate([authFullRoutingChildNames.UPDATE_SERVICES]);
  }
}
