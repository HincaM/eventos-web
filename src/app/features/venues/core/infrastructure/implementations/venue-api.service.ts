import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Venue } from '../../domain/models/venue.model';
import { VenueService } from '../../domain/servicios/venue.service';

@Injectable()
export class VenueApiService extends VenueService {
  private readonly http = inject(HttpClient);
  private readonly group = '/venues';

  listar(): Observable<Venue[]> {
    return this.http.get<Venue[]>(`${this.group}/listar`);
  }
}
