import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User, UsersService } from '../../services/users.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DecimalPipe
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  loadUser(): void {
    this.userSubscription = this.usersService.getCurrent().subscribe({
      next: (user) => {
        this.user = user;
      }
    });
  }
}
