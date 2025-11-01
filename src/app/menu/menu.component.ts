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

closeMenu() {
    // Il mat-menu si chiude automaticamente quando si clicca un mat-menu-item.
    // Questo metodo è qui principalmente per conformità se lo hai nel template,
    // o per logica aggiuntiva se volessi controllare un altro componente (es. un mat-sidenav).
    console.log('Menu item clicked, menu should close (handled by mat-menu itself)');
  }

  ngOnInit(): void {
    this.authService.refresh$.subscribe(() => {
      console.log('MenuComponent: refresh$ triggered');
      this.refreshView();
    });
  }

}
