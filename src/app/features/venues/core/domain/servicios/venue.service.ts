import { Observable } from 'rxjs';
import { Venue } from '../models/venue.model';

export abstract class VenueService {
  abstract listar(): Observable<Venue[]>;
}
