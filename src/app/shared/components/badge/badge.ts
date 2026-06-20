import { Component, input } from '@angular/core';
import { EstadoBadgeVariantPipe } from '../../pipes/estado-badge-variant.pipe';

@Component({
  selector: 'ui-badge',
  imports: [EstadoBadgeVariantPipe],
  template: `<span class="badge" [class]="'text-bg-' + (estado() | estadoBadgeVariant)">{{ estado() }}</span>`,
})
export class UiBadge {
  readonly estado = input.required<string>();
}
