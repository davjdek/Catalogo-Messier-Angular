import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../services/authService';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(public authService : AuthService, private cdr: ChangeDetectorRef) { }

  display () {
    
    if (this.authService.isLoggedIn()) {
      return 'Logout?';
    }
    return 'Login';
  }

  public refreshView() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.authService.refresh$.subscribe(() => {
      console.log('MenuComponent: refresh$ triggered');
      this.refreshView();
    });
  }

}
