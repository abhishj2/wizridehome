import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CustomCalendarComponent implements OnInit, OnChanges {
  @Input() selectedDate: string = '';
  @Input() minDate: string = '';
  @Input() maxDate: string = '';
  @Input() placeholder: string = 'Select Date';
  @Input() disabled: boolean = false;
  @Input() alwaysOpen: boolean = false;
  @Input() initialDate: string = ''; // Date to show when calendar opens with no selection
  @Input() calendarFareMap?: Map<string, any>; // Fare data for each date
  @Output() dateSelected = new EventEmitter<string>();
  @Output() calendarOpened = new EventEmitter<void>();
  @Output() calendarClosed = new EventEmitter<void>();

  @ViewChild('calendarDropdown', { static: false }) calendarDropdown!: ElementRef;
  @ViewChild('calendarInputWrapper', { static: false }) calendarInputWrapper!: ElementRef;

  isOpen = false;
  currentDate = new Date();
  displayMonth = new Date();
  displayYear: number = new Date().getFullYear();
  selectedDateObj: Date | null = null;
  openUpward = false;
  
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  availableYears: number[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (this.alwaysOpen) {
      this.isOpen = true;
    }
    this.updateSelectedDate();
    
    if (this.minDate) {
      const minDateObj = new Date(this.minDate);
      if (this.currentDate < minDateObj) {
        this.currentDate = minDateObj;
        if (!this.selectedDate) {
          this.displayMonth = minDateObj;
          this.displayYear = this.displayMonth.getFullYear();
        }
      }
    }
    
    // Generate available years based on minDate and maxDate
    const currentYear = new Date().getFullYear();
    let startYear = currentYear;
    let endYear = currentYear + 10;
    
    // If maxDate is set and is in the past (DOB scenarios), adjust year range
    if (this.maxDate) {
      const maxDateObj = new Date(this.maxDate);
      if (maxDateObj.getFullYear() < currentYear) {
        endYear = maxDateObj.getFullYear();
        startYear = endYear - 100; // Show 100 years range for DOB
      }
    }
    
    // If minDate is set and is in the past, use it as start
    if (this.minDate) {
      const minDateObj = new Date(this.minDate);
      if (minDateObj.getFullYear() < startYear) {
        startYear = minDateObj.getFullYear();
      }
    }
    
    for (let year = startYear; year <= endYear; year++) {
      this.availableYears.push(year);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDate'] && !changes['selectedDate'].firstChange) {
      this.updateSelectedDate();
    }
    if (changes['initialDate'] && !changes['initialDate'].firstChange) {
      this.updateSelectedDate();
    }
    if ((changes['minDate'] || changes['maxDate'] || changes['initialDate']) && !changes['minDate']?.firstChange && !changes['maxDate']?.firstChange) {
      // Regenerate available years when date range changes
      this.availableYears = [];
      const currentYear = new Date().getFullYear();
      let startYear = currentYear;
      let endYear = currentYear + 10;
      
      if (this.maxDate) {
        const maxDateObj = new Date(this.maxDate);
        if (maxDateObj.getFullYear() < currentYear) {
          endYear = maxDateObj.getFullYear();
          startYear = endYear - 100;
        }
      }
      
      if (this.minDate) {
        const minDateObj = new Date(this.minDate);
        if (minDateObj.getFullYear() < startYear) {
          startYear = minDateObj.getFullYear();
        }
      }
      
      for (let year = startYear; year <= endYear; year++) {
        this.availableYears.push(year);
      }
    }
  }

  updateSelectedDate() {
    if (this.selectedDate) {
      try {
        const date = new Date(this.selectedDate);
        if (!isNaN(date.getTime())) {
          this.selectedDateObj = date;
          this.displayMonth = new Date(date);
          this.displayYear = this.displayMonth.getFullYear();
        }
      } catch (e) {
        console.error('Invalid date format:', this.selectedDate);
      }
    } else {
      this.selectedDateObj = null;
      // Use initialDate if provided (for DOB scenarios)
      if (this.initialDate) {
        const initialDateObj = new Date(this.initialDate);
        if (!isNaN(initialDateObj.getTime())) {
          this.displayMonth = new Date(initialDateObj);
          this.displayYear = this.displayMonth.getFullYear();
          return;
        }
      }
      // For DOB scenarios (when maxDate is in the past), show a more appropriate initial date
      if (this.maxDate) {
        const maxDateObj = new Date(this.maxDate);
        const currentYear = new Date().getFullYear();
        if (maxDateObj.getFullYear() < currentYear) {
          // This is likely a DOB picker, show the max allowed date's year
          this.displayMonth = new Date(maxDateObj);
          this.displayYear = this.displayMonth.getFullYear();
          return;
        }
      }
      // Default to current date
      this.displayMonth = new Date();
      this.displayYear = this.displayMonth.getFullYear();
    }
  }

  toggleCalendar() {
    if (this.disabled) return;
    
    if (!this.isOpen) {
      // Check available space before opening
      this.checkAvailableSpace();
      // Ensure displayYear is in sync with displayMonth
      this.displayYear = this.displayMonth.getFullYear();
    }
    
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.calendarOpened.emit();
    } else {
      this.calendarClosed.emit();
    }
  }

  checkAvailableSpace() {
    if (!this.calendarInputWrapper) return;
    
    // Use the input wrapper to determine positioning
    const inputRect = this.calendarInputWrapper.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceBelow = viewportHeight - inputRect.bottom;
    const calendarHeight = 350; // More realistic calendar height
    
    // For standard laptop screens (14-15 inch), always prefer downward opening
    if (viewportHeight >= 700 && viewportWidth >= 1024) {
      this.openUpward = false;
      return;
    }
    
    // For smaller screens, be extremely conservative
    const buffer = 250; // Very large buffer
    this.openUpward = spaceBelow < (calendarHeight + buffer);
    
    // Additional check: if we're in the upper 60% of the screen, prefer downward
    const screenThreshold = viewportHeight * 0.6;
    if (inputRect.top < screenThreshold) {
      this.openUpward = false;
    }
  }

  closeCalendar() {
    if (!this.alwaysOpen) {
      this.isOpen = false;
      this.calendarClosed.emit();
    }
  }

  selectDate(date: Date) {
    // Use the same logic as isDateDisabled
    const minDateObj = this.minDate ? new Date(this.minDate) : null;
    const maxDateObj = this.maxDate ? new Date(this.maxDate) : null;
    
    if (minDateObj) {
      minDateObj.setHours(0, 0, 0, 0);
      if (date < minDateObj) return;
    }
    
    if (maxDateObj) {
      maxDateObj.setHours(0, 0, 0, 0);
      if (date > maxDateObj) return;
    }

    this.selectedDateObj = new Date(date);
    this.selectedDate = this.formatDateForInput(date);
    this.dateSelected.emit(this.selectedDate);
    this.closeCalendar();
  }

  isDateSelected(date: Date): boolean {
    // Check both selectedDateObj and selectedDate input for reliability
    if (this.selectedDateObj) {
      const dateStr = date.toDateString();
      const selectedStr = this.selectedDateObj.toDateString();
      if (dateStr === selectedStr) return true;
    }
    
    // Fallback: check selectedDate input directly
    if (this.selectedDate) {
      try {
        const selectedDateParsed = new Date(this.selectedDate);
        if (!isNaN(selectedDateParsed.getTime())) {
          date.setHours(0, 0, 0, 0);
          selectedDateParsed.setHours(0, 0, 0, 0);
          return date.getTime() === selectedDateParsed.getTime();
        }
      } catch (e) {
        // Invalid date format, ignore
      }
    }
    
    return false;
  }

  isDateDisabled(date: Date): boolean {
    const minDateObj = this.minDate ? new Date(this.minDate) : null;
    const maxDateObj = this.maxDate ? new Date(this.maxDate) : null;
    
    if (minDateObj) {
      minDateObj.setHours(0, 0, 0, 0);
      if (date < minDateObj) return true;
    }
    
    if (maxDateObj) {
      maxDateObj.setHours(0, 0, 0, 0);
      if (date > maxDateObj) return true;
    }
    
    return false;
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.displayMonth.getMonth();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  }

  getCalendarDays(): Date[] {
    const year = this.displayMonth.getFullYear();
    const month = this.displayMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: Date[] = [];
    
    // Add previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    // Add next month's leading days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }
    
    return days;
  }

  previousMonth() {
    const newMonth = new Date(this.displayMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    
    // Don't allow going to months before minimum date's month
    if (this.minDate) {
      const minDateObj = new Date(this.minDate);
      const newMonthStart = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1);
      const minMonthStart = new Date(minDateObj.getFullYear(), minDateObj.getMonth(), 1);
      
      if (newMonthStart < minMonthStart) {
        return;
      }
    }
    
    this.displayMonth = newMonth;
    this.displayYear = this.displayMonth.getFullYear();
  }

  nextMonth() {
    this.displayMonth = new Date(this.displayMonth.getFullYear(), this.displayMonth.getMonth() + 1, 1);
    this.displayYear = this.displayMonth.getFullYear();
  }

  // goToToday() {
  //   const today = new Date();
  //   this.displayMonth = new Date(today);
  //   this.displayYear = this.displayMonth.getFullYear();
  // }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDisplayDate(): string {
    if (!this.selectedDate) return this.placeholder;
    
    const date = new Date(this.selectedDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target) && this.isOpen) {
      this.closeCalendar();
    }
  }

  @HostListener('keydown.escape')
  onEscapeKey() {
    if (this.isOpen) {
      this.closeCalendar();
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.isOpen) {
      this.checkAvailableSpace();
    }
  }

  getMonthYearDisplay(): string {
    return this.displayMonth.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  isPrevMonthDisabled(): boolean {
    if (!this.minDate) return false;
    
    const minDateObj = new Date(this.minDate);
    const currentMonthStart = new Date(this.displayMonth.getFullYear(), this.displayMonth.getMonth(), 1);
    const minMonthStart = new Date(minDateObj.getFullYear(), minDateObj.getMonth(), 1);
    
    // Disable if current month is the same as or before the minimum month
    return currentMonthStart <= minMonthStart;
  }

  onMonthChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedMonth = parseInt(target.value);
    this.displayMonth = new Date(this.displayMonth.getFullYear(), selectedMonth, 1);
    this.displayYear = this.displayMonth.getFullYear();
  }

  onYearChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedYear = parseInt(target.value);
    this.displayMonth = new Date(selectedYear, this.displayMonth.getMonth(), 1);
    this.displayYear = selectedYear;
  }

  // Get fare data for a specific date
  getFareForDate(date: Date): any {
    if (!this.calendarFareMap) return null;
    
    const dateString = this.formatDateForInput(date);
    return this.calendarFareMap.get(dateString);
  }

  // Check if a date has the lowest fare
  isLowestFare(date: Date): boolean {
    const fareData = this.getFareForDate(date);
    return fareData?.isLowest === true;
  }
}
