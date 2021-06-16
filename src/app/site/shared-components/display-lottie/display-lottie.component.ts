import { Component,  OnInit } from '@angular/core';
// import { AnimationItem } from 'lottie-web';
import { HelperService } from '../../core/services/helper.service';

@Component({
  selector: 'app-display-lottie',
  templateUrl: './display-lottie.component.html',
  styleUrls: ['./display-lottie.component.scss'],
})
export class DisplayLottieComponent implements OnInit {
  // private animations: AnimationItem;
  working: boolean;

  constructor(private helperService: HelperService) {
    helperService.setLoader(this);
  }

  ngOnInit(): void {
 
  }


  isWorking(working: boolean = true): void {
    this.working = working;
  }
}
