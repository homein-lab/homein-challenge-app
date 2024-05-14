import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MockService } from './mock.service';

export interface City {
  id: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  constructor(
    private mockService: MockService,
  ) {}

  get(id: string): Promise<City | null> {
    return firstValueFrom(this.mockService.getCity(id));
  }

  getAll(): Promise<City[]> {
    return firstValueFrom(this.mockService.getCities());
  }
}
