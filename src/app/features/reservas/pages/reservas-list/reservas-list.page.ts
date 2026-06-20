import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { FormField, form } from '@angular/forms/signals';
import { NotificationService } from '../../../../core/services/notification.service';
import { EstadoReserva } from '../../../../core/enums/estado-reserva.enum';
import { UiBadge } from '../../../../shared/components/badge/badge';
import { UiButton } from '../../../../shared/components/button/button';
import { UiModal } from '../../../../shared/components/modal/modal';
import { UiSelect } from '../../../../shared/components/select/select';
import { UiSpinner } from '../../../../shared/components/spinner/spinner';
import { Reserva } from '../../core/domain/models/reserva.model';
import { ListarReservasFiltro } from '../../core/domain/models-request/listar-reservas.filtro';
import { ListarReservasUseCase } from '../../core/application/use-cases/listar-reservas.use-case';
import { ConfirmarPagoReservaUseCase } from '../../core/application/use-cases/confirmar-pago-reserva.use-case';
import { CancelarReservaUseCase } from '../../core/application/use-cases/cancelar-reserva.use-case';
import { Evento } from '../../../eventos/core/domain/models/evento.model';
import { EventoService } from '../../../eventos/core/domain/servicios/evento.service';

interface FiltroFormModel {
  estado: EstadoReserva | '';
  eventoId: string;
  nombreComprador: string;
}

@Component({
  selector: 'reservas-list-page',
  imports: [DatePipe, FormField, UiBadge, UiButton, UiModal, UiSelect, UiSpinner],
  templateUrl: './reservas-list.page.html',
})
export class ReservasListPage {
  private readonly listarReservasUseCase = inject(ListarReservasUseCase);
  private readonly confirmarPagoReservaUseCase = inject(ConfirmarPagoReservaUseCase);
  private readonly cancelarReservaUseCase = inject(CancelarReservaUseCase);
  private readonly eventoService = inject(EventoService);
  private readonly notificationService = inject(NotificationService);

  protected readonly estadosReserva = Object.values(EstadoReserva);
  protected readonly identidad = (valor: string) => valor;
  protected readonly eventoCodigo = (evento: Evento) => evento.id;
  protected readonly eventoDescripcion = (evento: Evento) => evento.titulo;

  protected readonly eventos = signal<Evento[]>([]);
  protected readonly eventoTituloPorId = computed(() => new Map(this.eventos().map((e) => [e.id, e.titulo])));

  protected readonly model = signal<FiltroFormModel>({ estado: '', eventoId: '', nombreComprador: '' });
  protected readonly form = form(this.model);

  protected readonly filtro$ = new BehaviorSubject<ListarReservasFiltro>({});
  protected readonly reservas = signal<Reserva[] | null>(null);
  protected readonly accionando = signal<string | null>(null);
  protected readonly reservaACancelar = signal<Reserva | null>(null);

  constructor() {
    this.eventoService.listar({}).subscribe((eventos) => this.eventos.set(eventos));

    this.filtro$
      .pipe(
        switchMap((filtro) => {
          this.reservas.set(null);
          return this.listarReservasUseCase.execute(filtro);
        }),
      )
      .subscribe((reservas) => this.reservas.set(reservas));
  }

  protected onFiltrar(event: SubmitEvent): void {
    event.preventDefault();
    const value = this.model();
    this.filtro$.next({
      estado: value.estado,
      eventoId: value.eventoId || undefined,
      nombreComprador: value.nombreComprador || undefined,
    });
  }

  protected onConfirmarPago(reserva: Reserva): void {
    this.accionando.set(reserva.id);
    this.confirmarPagoReservaUseCase.execute(reserva.id).subscribe({
      next: () => {
        this.notificationService.show('Reserva confirmada correctamente.', 'success');
        this.accionando.set(null);
        this.filtro$.next(this.filtro$.value);
      },
      error: () => this.accionando.set(null),
    });
  }

  protected onCancelar(): void {
    const reserva = this.reservaACancelar();
    if (!reserva) return;

    this.accionando.set(reserva.id);
    this.cancelarReservaUseCase.execute(reserva.id).subscribe({
      next: () => {
        this.notificationService.show('Reserva cancelada correctamente.', 'success');
        this.accionando.set(null);
        this.reservaACancelar.set(null);
        this.filtro$.next(this.filtro$.value);
      },
      error: () => {
        this.accionando.set(null);
        this.reservaACancelar.set(null);
      },
    });
  }
}
