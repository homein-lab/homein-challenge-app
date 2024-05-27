import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockService } from './mock.service';

export interface Weather {
  currentTemperature: number;
  cityId: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(
    private mockService: MockService,
  ) {}

  getAll(): Observable<Weather[]> {
    return this.mockService.getWeather();
  }
}
