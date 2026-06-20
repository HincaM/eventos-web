import { Provider } from '@angular/core';
import { VenueService } from './core/domain/servicios/venue.service';
import { VenueApiService } from './core/infrastructure/implementations/venue-api.service';

export const VENUES_PROVIDERS: Provider[] = [
  { provide: VenueService, useClass: VenueApiService },
];
