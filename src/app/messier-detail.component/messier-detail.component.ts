import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messier-detail',
  templateUrl: './messier-detail.component.html',
  styleUrls: ['./messier-detail.component.css']
})
export class MessierDetailComponent implements OnInit {
  messier: any;
  errorMessage = '';
  isLoading = false;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.messier = nav?.extras?.state?.['messier'] || history.state?.['messier'];
  console.log("Oggetto Messier corrente da getCurrentNavigation():", nav);
  console.log("Oggetto Messier corrente da history.state:", history.state);

    if (!this.messier) {
      this.router.navigate(['/messier']);
    }
  }

  goBack() {
    this.router.navigate(['/messier']);
  }
}