import { Component, OnInit  } from '@angular/core';
import * as _moment from 'moment';

import { JwtService } from './services/jwt.service';

const moment = _moment;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';



  constructor(private jwtService: JwtService) {
    }

    ngOnInit() {
      console.log('AppComponent ngOnInit called');
      if (!sessionStorage.getItem('sessionActive')) {
        localStorage.clear();
        sessionStorage.setItem('sessionActive', 'true');
    }
    this.jwtService.logDecodedToken();

}
}
