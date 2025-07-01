import { Injectable } from '@angular/core';
import { faker } from '@faker-js/faker';
import { map, Observable, Subject } from 'rxjs';
import { City } from './cities.service';
import { User } from './users.service';
import { Weather } from './weather.service';

// You can change this % value to test your error handling cases
const ERROR_RATE_PERCENTAGE = 5;

// You shouldn't need to modify any code below this line
class Mock<T> {
  data: T[] = [];
  subject = new Subject<T[]>();
}

@Injectable({
  providedIn: 'root'
})
export class MockService {
  private cities = new Mock<City>();
  private users = new Mock<User>();
  private weather = new Mock<Weather>();

  constructor() {
    // Mock data for cities
    this.cities.data = [
      { id: 'zRLBYgwjag6XWAvhSBnx', label: 'Santiago' },
      { id: 'NgQeE7wVIhIcP1JwDbDB', label: 'Concepción' },
      { id: '5BAbWjwTx9qxFwjiyF37', label: 'Viña del Mar' },
    ];
    // Mock data for users
    this.users.data = [
      {
        displayName: 'John',
        email: 'john.smith@homein.cl',
        id: 'tGHd75wX0Mukjd46QQSP',
        locationChangeReason: 'Viaje de negocios',
        locationId: 'zRLBYgwjag6XWAvhSBnx',
      }
    ];
    // Mock data for cities weather that constantly changes
    this.weather.data = [
      { id: 'mozSADUpGo064TwK7igJ', cityId: 'zRLBYgwjag6XWAvhSBnx', currentTemperature: 15 },
      { id: 'flJzi3zUZKO7BGEqoa4Z', cityId: 'NgQeE7wVIhIcP1JwDbDB', currentTemperature: 13 },
      { id: 'WmSIdmrO977msu0KL9HE', cityId: '5BAbWjwTx9qxFwjiyF37', currentTemperature: 16 },
    ];
    setInterval(() => {
      this.weather.data = this.weather.data.map((weather) => {
        return {
          ...weather,
          currentTemperature: faker.number.float({ min: 10, max: 20 }),
        };
      });
      this.triggerChange(this.weather, 0);
    }, 1000);
  }

  getCity(id: string): Observable<City | null> {
    return this.get<City>(this.cities, id);
  }

  getCities(): Observable<City[]> {
    return this.getAll<City>(this.cities);
  }

  getUser(id: string): Observable<User | null> {
    return this.get<User>(this.users, id);
  }

  getWeather(): Observable<Weather[]> {
    return this.getAll<Weather>(this.weather);
  }

  updateUser(id: string, data: Partial<User>): Promise<void> {
    return this.update<User>(this.users, id, data);
  }

  private get<T extends { id: string; }>(mock: Mock<T>, id: string): Observable<T | null> {
    return this.getAll(mock).pipe(map((values: T[]) => {
      return values.find((value) => value.id === id) ?? null;
    }));
  }

  private getAll<T>(mock: Mock<T>): Observable<T[]> {
    this.triggerChange(mock);
    return new Observable((subscriber) => mock.subject.subscribe((values) => {
      if (this.triggerRandomError(subscriber)) {
        return;
      }
      subscriber.next(values);
    }));
  }

  private triggerChange<T>(mock: Mock<T>, timeout = 1000): void {
    setTimeout(() => mock.subject.next(mock.data), timeout);
  }

  private triggerRandomError(rejectError: any): boolean {
    const random = Math.round(Math.random() * 100);
    if (random <= ERROR_RATE_PERCENTAGE) {
      const error = { code: 'unknown-error', message: 'Unknown error' };
      if (typeof rejectError === 'object') {
        rejectError.error(error);
      } else {
        rejectError(error);
      }
      return true;
    }
    return false;
  }

  private update<T>(mock: Mock<T>, id: string, data: Partial<T>): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.triggerRandomError(reject)) {
          return;
        }
        let found = false;
        for (let i = 0; 0 < mock.data.length; i++) {
          if ((mock.data[i] as any).id === id) {
            mock.data[i] = {
              ...mock.data[i],
              ...data,
              updatedAt: new Date(),
            };
            found = true;
            break;
          }
        }
        if (!found) {
          throw new Error(`Entity ${id} not found.`);
        }
        this.triggerChange(mock, 0);
        resolve();
      }, 1000);
    });
  }
}
