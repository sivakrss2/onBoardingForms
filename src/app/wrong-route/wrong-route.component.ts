import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader.services';

@Component({
  selector: 'app-wrong-route',
  templateUrl: './wrong-route.component.html',
  styleUrls: ['./wrong-route.component.css']
})
export class WrongRouteComponent implements OnInit {

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderService.isLoading.next(false);;
    
  }

}
