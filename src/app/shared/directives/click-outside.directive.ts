import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[uiClickOutside]',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class ClickOutsideDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly uiClickOutside = output<void>();

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.uiClickOutside.emit();
    }
  }
}
