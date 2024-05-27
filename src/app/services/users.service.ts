import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockService } from './mock.service';

export interface User {
  displayName: string;
  email: string;
  id: string;
  locationChangeReason: string;
  locationId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // This would be the real user ID, but for the sake of the challenge, we'll just use a dummy value.
  private userId = 'tGHd75wX0Mukjd46QQSP';

  constructor(
    private mockService: MockService,
  ) {}

  getCurrent(): Observable<User | null> {
    return this.mockService.getUser(this.userId);
  }

  updateLocation(changeReason: string, newLocationId: string): Promise<void> {
    return this.mockService.updateUser(this.userId, {
      locationChangeReason: changeReason,
      locationId: newLocationId,
    });
  }
}
