import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flightcards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flightcards.component.html',
  styleUrls: ['./flightcards.component.css']
})
export class FlightcardsComponent implements OnInit {
  @Input() flight: any;
  @Input() showPriceFooter: boolean = true;

  ngOnInit(): void {
    console.log("Flights", this.flight);
  }

  formatMinutesToHrMin(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let parts = [];
    if (hrs > 0) parts.push(`${hrs}hr`);
    if (mins > 0) parts.push(`${mins}m`);
    return parts.join(' ');
  }

  getTotalDuration(flight: any): string {
    const segments = flight.Segments[0];
    const start = new Date(segments[0].Origin.DepTime);
    const end = new Date(segments[segments.length - 1].Destination.ArrTime);
    const duration = end.getTime() - start.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    let parts = [];
    if (hours > 0) parts.push(`${hours}hr`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.length ? parts.join(' ') : '';
  }

  getLayoverDuration(prevSeg: any, nextSeg: any): string {
    const layoverStart = new Date(prevSeg.Destination.ArrTime);
    const layoverEnd = new Date(nextSeg.Origin.DepTime);
    const diffMs = layoverEnd.getTime() - layoverStart.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    let parts = [];
    if (hours > 0) parts.push(`${hours}hr`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.length ? `${parts.join(' ')} Layover` : '';
  }

  getLayoverDayText(prevSeg: any, nextSeg: any): string {
    const prevArrival = new Date(prevSeg.Destination.ArrTime);
    const nextDeparture = new Date(nextSeg.Origin.DepTime);
    const dayDiff = nextDeparture.getDate() - prevArrival.getDate();
    return dayDiff > 0 ? `+ ${dayDiff} Day` : '';
  }

  getDayDiff(dep: string | Date, arr: string | Date): number {
    const depDate = new Date(dep);
    const arrDate = new Date(arr);
    const depDay = depDate.getDate();
    const arrDay = arrDate.getDate();
    const depMonth = depDate.getMonth();
    const arrMonth = arrDate.getMonth();
    const depYear = depDate.getFullYear();
    const arrYear = arrDate.getFullYear();
    const isSameMonth = depMonth === arrMonth && depYear === arrYear;
    return isSameMonth ? arrDay - depDay : Math.floor((arrDate.getTime() - depDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  getGroupDuration(group: any[]): string {
    const lastSegment = group[group.length - 1];
    const totalMinutes = lastSegment?.AccumulatedDuration || 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let parts = [];
    if (hours > 0) parts.push(`${hours}hr`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.length ? `Total Duration: ${parts.join(' ')}` : '';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/logos/OO.png';
  }
}
