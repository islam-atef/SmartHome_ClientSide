import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeFacadeService } from '../../application/home-facade-service';

@Component({
  selector: 'app-create-new-home-component',
  imports: [],
  templateUrl: './create-new-home-component.html',
  styleUrl: './create-new-home-component.css',
})
export class CreateNewHomeComponent implements OnInit {
  constructor(private router: Router, private homeFacade: HomeFacadeService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
