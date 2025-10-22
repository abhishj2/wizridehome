import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonDestinationService } from '../../commondest';

@Component({
  selector: 'app-gangtok',
  standalone: true,
  imports: [],
  templateUrl: './gangtok.component.html',
  styleUrl: './gangtok.component.css'
})
export class GangtokComponent implements AfterViewInit, OnDestroy {
  
  constructor(private commonDestService: CommonDestinationService) {}

  ngAfterViewInit(): void {
    // Initialize all common destination page functionality
    this.commonDestService.initializeDestinationPage();
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    this.commonDestService.cleanup();
  }
}
