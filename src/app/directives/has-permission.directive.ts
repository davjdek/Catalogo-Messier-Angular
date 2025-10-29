import { Directive, Input, TemplateRef, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { JwtService } from '../services/jwt.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective implements OnChanges {
  @Input()
  appHasPermission!: string;

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private jwtService: JwtService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if ('appHasPermission' in changes) {
      this.updateView();
    }
  }

  private updateView() {
    if (this.jwtService.hasPermission(this.appHasPermission)) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else {
      if (this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    }
  }
}
