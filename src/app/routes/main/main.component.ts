import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/interfaces/customer';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  tutorial: Customer = new Customer();
  submitted = false;
  constructor(private tutorialService: FirebaseService) { }

  saveTutorial(): void {
    this.tutorialService.create(this.tutorial).then(() => {
      console.log('Created new item successfully!');
      this.submitted = true;
    });
  }
  newTutorial(): void {
    this.submitted = false;
    this.tutorial = new Customer();
  }
  ngOnInit(): void { }

}
