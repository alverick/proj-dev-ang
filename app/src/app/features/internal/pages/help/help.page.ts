import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';

import {
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
import { sectionCommissions } from '../../constants';
import { internalFullRoutingNames } from '../../internal-routing.names';

@Component({
  selector: 'cs-help',
  templateUrl: './help.page.html',
  standalone: true,
  imports: [AccordionModule],
})
export class HelpPage implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly tracking = inject(TrackingService);

  accordionContainer = viewChild<ElementRef<HTMLElement>>('accordionContainer');

  public readonly activeIndex = signal<number>(-1);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    const section = params['section'] as string;

    if (section === sectionCommissions) {
      this.activeIndex.set(6);

      void this.router.navigate([], {
        queryParams: { section: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.activeIndex() === 6) {
      this.scrollToActiveTab();
    }
  }

  private scrollToActiveTab(): void {
    setTimeout(() => {
      const containerRef = this.accordionContainer();
      const element = containerRef?.nativeElement;

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 400);
  }

  goBack() {
    void this.router.navigate([internalFullRoutingNames.HOME]);
  }

  openedTab({ index }: { index: number }) {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Ayuda',
      action: 'Click',
      detail: `Abrir panel ${index + 1}`,
      label: 'Titulo',
      typeElement: 'Link',
      location: 'Ayuda',
    });
  }
}
