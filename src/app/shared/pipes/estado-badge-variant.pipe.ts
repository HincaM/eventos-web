import { Pipe, PipeTransform } from '@angular/core';

const VARIANT_BY_ESTADO: Record<string, string> = {
  Activo: 'success',
  Confirmada: 'success',
  Completado: 'secondary',
  PendientePago: 'warning',
  Cancelado: 'danger',
  Cancelada: 'danger',
};

@Pipe({ name: 'estadoBadgeVariant' })
export class EstadoBadgeVariantPipe implements PipeTransform {
  transform(estado: string): string {
    return VARIANT_BY_ESTADO[estado] ?? 'secondary';
  }
}
