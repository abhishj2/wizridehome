import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { ApiserviceService } from '../services/apiservice.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FlightcardsComponent } from '../flightcards/flightcards.component';

@Component({
  selector: 'app-flightsuccesspage',
  standalone: true,
  imports: [CommonModule, FlightcardsComponent],
  templateUrl: './flightsuccesspage.component.html',
  styleUrls: ['./flightsuccesspage.component.css']
})
export class FlightsuccesspageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  private processing = false;
  private idemKey = '';

  loader: boolean = true;
  flightType: string = '';
  tboTokenId: any;
  onwardFlights: any[] = [];
  returnFlights: any[] = [];
  onwardPassengerList: any[] = [];
  returnPassengerList: any[] = [];
  onwardFareDetails: any = null;
  returnFareDetails: any = null;
  onwardBookingId: string = '';
  returnBookingId: string = '';
  onwardPnr: string = '';
  returnPnr: string = '';
  onwardAirlineTollFreeNo: string = '';
  returnAirlineTollFreeNo: string = '';
  activeTab: 'onward' | 'return' = 'onward';
  animationState: 'in' | 'out' = 'in';
  ip: any;
  isInternationalReturn: boolean = false;
  showFlightCardFooter: boolean = false;
  orderId: string = '';

  constructor(
    public apiService: ApiserviceService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      const pnrOnward = params['pnrOnward'];
      const pnrReturn = params['pnrReturn'];
      const firstNameOnward = params['firstNameOnward'] || 'DefaultFirstName1';
      const firstNameReturn = params['firstNameReturn'] || 'DefaultFirstName2';
      this.flightType = params['tripType'];
      
      console.log("PNR Onward", pnrOnward);
      console.log("PNR Return", pnrReturn);
      console.log("Flight Type", this.flightType);
      
      this.idemKey = `ticket:${this.orderId}:${pnrOnward || ''}:${pnrReturn || ''}`;
      if (sessionStorage.getItem(this.idemKey)) {
        Swal.fire('Error', 'Ticket flow already completed for this key, skipping rerun', 'error')
          .then(() => this.router.navigate(['/home']));
        console.warn('Ticket flow already completed for this key, skipping rerun:', this.idemKey);
        this.loader = true;
        return;
      }
      
      if (this.processing) {
        Swal.fire('Error', 'Ticket flow is already in progress, skipping duplicate trigger.', 'error')
          .then(() => this.router.navigate(['/home']));
        console.warn('Ticket flow is already in progress, skipping duplicate trigger.');
        this.loader = true;
        return;
      }
      
      this.processing = true;

      if ((!pnrOnward && !pnrReturn) || !this.flightType) {
        Swal.fire('Error', 'Missing required PNRs or trip type. Redirecting to home.', 'error')
          .then(() => this.router.navigate(['/home']));
        return;
      }
      
      this.fetchBookingDetails(pnrOnward, pnrReturn, firstNameOnward, firstNameReturn);
    });
  }

  fetchBookingDetails(pnrOnward: string, pnrReturn: string, firstNameOnward: string, firstNameReturn: string) {
    this.subscriptions.add(
      this.apiService.getTboToken().subscribe(
        (val: any) => {
          console.log('TBo Token', val);
          if (val?.TokenId) {
            this.tboTokenId = val.TokenId;
            this.subscriptions.add(
              this.http.get<{ ip: string }>('https://api.ipify.org?format=json')
                .subscribe((res) => {
                  this.ip = res.ip;
                  console.log('IP', this.ip);

                  const requests = [
                    this.apiService.getFlightBookingDetails(this.tboTokenId, this.ip, pnrOnward, firstNameOnward)
                  ];
                  if (this.flightType === 'roundtrip') {
                    requests.push(this.apiService.getFlightBookingDetails(this.tboTokenId, this.ip, pnrReturn, firstNameReturn));
                  }

                  this.subscriptions.add(
                    forkJoin(requests).subscribe(
                      (responses: any[]) => {
                        const onwardResponse = responses[0];
                        const returnResponse = responses[1];
                        console.log('Onward Response:', JSON.stringify(onwardResponse, null, 2));
                        console.log('Return Response:', JSON.stringify(returnResponse, null, 2));
                        
                        const onwardValid = onwardResponse?.Response?.ResponseStatus === 1 &&
                          onwardResponse?.Response?.Error?.ErrorCode === 0;

                        const returnValid = this.flightType === 'roundtrip' &&
                                            returnResponse?.Response?.ResponseStatus === 1 &&
                                            returnResponse?.Response?.Error?.ErrorCode === 0;

                        if (!onwardValid && !returnValid) {
                          Swal.fire('Error', 'No valid booking details found for either journey.', 'error')
                            .then(() => this.router.navigate(['/home']));
                          return;
                        }

                        let ONWARDFLIGHTPNR: string | null = null;
                        let ONWARDBOOKINGID: string | null = null;
                        let RETURNFLIGHTPNR: string | null = null;
                        let RETURNBOOKINGID: string | null = null;
                        let ONWARDORDERDETAILS: any = null;
                        let RETURNORDERDETAILS: any = null;
                        let PASSENGERCOUNT: number = 0;
                        let ONWARDTOTALAMOUNT: number = 0;
                        let RETURNTOTALAMOUNT: number = 0;
                        let TOTALAMOUNT: number = 0;

                        let APPID: string = '';
                        let NAME: string = '';
                        let EMAIL: string = '';
                        let PHONE: string = '';
                        let COUNTRY_CODE: string | null = null;

                        if (onwardResponse?.Response?.FlightItinerary) {
                          const itinerary = onwardResponse.Response.FlightItinerary;

                          if (itinerary.JourneyType === 2) {
                            const tripIndicators = new Set(itinerary.Segments.map((seg: any) => seg.TripIndicator));
                            this.isInternationalReturn = tripIndicators.has(1) && tripIndicators.has(2);
                          } else {
                            this.isInternationalReturn = false;
                          }

                          if(itinerary.JourneyType === 3 || (itinerary.JourneyType === 2 && this.isInternationalReturn)){
                            this.onwardFlights = [{
                              Segments: this.groupSegmentsByTripIndicator(itinerary.Segments),
                              price: itinerary.Fare.PublishedFare
                            }];
                          } else {
                            this.onwardFlights = [{
                              Segments: [itinerary.Segments],
                              price: itinerary.Fare.PublishedFare
                            }];
                          }
                          
                          this.onwardPassengerList = itinerary.Passenger || [];
                          this.onwardFareDetails = itinerary.Fare || null;
                          this.onwardBookingId = itinerary.BookingId || '';
                          this.onwardPnr = itinerary.PNR || '';
                          this.onwardAirlineTollFreeNo = itinerary.AirlineTollFreeNo || 'N/A';

                          this.onwardPassengerList.forEach((pax: any) => {
                            if (!pax.SegmentAdditionalInfo || pax.SegmentAdditionalInfo.length === 0) {
                              pax.SegmentAdditionalInfo = itinerary.Segments.map((segment: any) => ({
                                Baggage: segment.Baggage || 'N/A',
                                CabinBaggage: segment.CabinBaggage || 'N/A',
                                Meal: 'N/A',
                                Seat: pax.SeatDynamic?.find((seat: any) => seat.FlightNumber === segment.Airline.FlightNumber)?.Code || 'N/A'
                              }));
                            }
                          });

                          this.onwardPassengerList.forEach((pax: any) => {
                            if (this.isInternationalReturn && Array.isArray(pax.Baggage) && pax.Baggage.length > 1) {
                              pax.OnwardBaggage = [pax.Baggage[0]];
                              pax.ReturnBaggage = [pax.Baggage[1]];
                            } else if (Array.isArray(pax.Baggage) && pax.Baggage.length === 1) {
                              pax.OnwardBaggage = [pax.Baggage[0]];
                              pax.ReturnBaggage = [];
                            } else {
                              pax.OnwardBaggage = [];
                              pax.ReturnBaggage = [];
                            }

                            if (this.isInternationalReturn && Array.isArray(pax.SpecialServices)) {
                              const segments = itinerary.Segments;
                              let onwardOrigin = '';
                              let onwardDestination = '';
                              let returnOrigin = '';
                              let returnDestination = '';

                              segments.forEach((seg: any) => {
                                if (seg.TripIndicator === 1) {
                                  if (!onwardOrigin) onwardOrigin = seg.Origin.Airport.AirportCode;
                                  onwardDestination = seg.Destination.Airport.AirportCode;
                                } else if (seg.TripIndicator === 2) {
                                  if (!returnOrigin) returnOrigin = seg.Origin.Airport.AirportCode;
                                  returnDestination = seg.Destination.Airport.AirportCode;
                                }
                              });

                              pax.OnwardSpecialServices = pax.SpecialServices.filter((ssr: any) =>
                                ssr.Origin === onwardOrigin && ssr.Destination === onwardDestination
                              );

                              pax.ReturnSpecialServices = pax.SpecialServices.filter((ssr: any) =>
                                ssr.Origin === returnOrigin && ssr.Destination === returnDestination
                              );
                            } else {
                              pax.OnwardSpecialServices = pax.SpecialServices || [];
                              pax.ReturnSpecialServices = [];
                            }
                          });

                          ONWARDFLIGHTPNR = itinerary.PNR || null;
                          ONWARDBOOKINGID = itinerary.BookingId || null;
                          ONWARDORDERDETAILS = onwardResponse;
                          PASSENGERCOUNT += itinerary.Passenger?.length || 0;
                          ONWARDTOTALAMOUNT = itinerary.Fare?.PublishedFare || 0;
                          TOTALAMOUNT += ONWARDTOTALAMOUNT;
                        } else {
                          console.error('Invalid onward response structure', onwardResponse);
                          this.onwardFlights = [];
                        }

                        if (this.flightType === 'roundtrip' && returnResponse?.Response?.FlightItinerary) {
                          const itinerary = returnResponse.Response.FlightItinerary;
                          this.returnFlights = [{
                            Segments: [itinerary.Segments],
                            price: itinerary.Fare.PublishedFare
                          }];
                          
                          this.returnPassengerList = itinerary.Passenger || [];
                          this.returnFareDetails = itinerary.Fare || null;
                          this.returnBookingId = itinerary.BookingId || '';
                          this.returnPnr = itinerary.PNR || '';
                          this.returnAirlineTollFreeNo = itinerary.AirlineTollFreeNo || 'N/A';

                          this.returnPassengerList.forEach((pax: any) => {
                            if (!pax.SegmentAdditionalInfo || pax.SegmentAdditionalInfo.length === 0) {
                              pax.SegmentAdditionalInfo = itinerary.Segments.map((segment: any) => ({
                                Baggage: segment.Baggage || 'N/A',
                                CabinBaggage: segment.CabinBaggage || 'N/A',
                                Meal: 'N/A',
                                Seat: pax.SeatDynamic?.find((seat: any) => seat.FlightNumber === segment.Airline.FlightNumber)?.Code || 'N/A'
                              }));
                            }
                          });

                          RETURNFLIGHTPNR = itinerary.PNR || null;
                          RETURNBOOKINGID = itinerary.BookingId || null;
                          RETURNORDERDETAILS = returnResponse;
                          RETURNTOTALAMOUNT = itinerary.Fare?.PublishedFare || 0;
                          TOTALAMOUNT += RETURNTOTALAMOUNT;
                        } else if (this.flightType === 'roundtrip') {
                          console.error('Invalid return response structure', returnResponse);
                          this.returnFlights = [];
                        }

                        const leadOnward = this.getLeadPax(onwardResponse);
                        const leadReturn = this.flightType === 'roundtrip' ? this.getLeadPax(returnResponse) : null;
                        const leadPax = leadOnward || leadReturn;

                        if (leadPax) {
                          const first = (leadPax.FirstName || '').trim();
                          const last = (leadPax.LastName || '').trim();
                          NAME = [first, last].filter(Boolean).join(' ');
                          EMAIL = (leadPax.Email || '').trim();
                          const { countryCode, phone } = this.splitPhone(leadPax.ContactNo);
                          COUNTRY_CODE = '+' + countryCode;
                          PHONE = phone;
                          APPID = phone;
                        } else {
                          NAME = NAME || 'Guest';
                          EMAIL = EMAIL || 'noemail@unknown.com';
                          PHONE = PHONE || '0000000000';
                          APPID = APPID || PHONE;
                        }

                        this.subscriptions.add(
                          this.apiService.flightTicketInsert(
                            this.orderId,
                            ONWARDFLIGHTPNR,
                            ONWARDBOOKINGID,
                            RETURNFLIGHTPNR,
                            RETURNBOOKINGID,
                            ONWARDORDERDETAILS,
                            RETURNORDERDETAILS,
                            PASSENGERCOUNT,
                            ONWARDTOTALAMOUNT,
                            RETURNTOTALAMOUNT,
                            TOTALAMOUNT,
                            APPID,
                            NAME,
                            EMAIL,
                            COUNTRY_CODE,
                            PHONE,
                          ).subscribe((val) => {
                            console.log("Value of Inserted", val);
                            sessionStorage.setItem(this.idemKey, 'done');
                            this.router.navigate([], {
                              replaceUrl: true,
                              queryParams: { orderId: this.orderId },
                              queryParamsHandling: ''
                            });
                            this.processing = false;
                          })
                        );

                        this.loader = false;
                      },
                      (error) => {
                        console.error('Error fetching booking details', error);
                        this.onwardFlights = [];
                        this.returnFlights = [];
                        this.loader = false;
                        this.processing = false;
                      }
                    )
                  );
                })
            );
          } else {
            console.error('No TBO token received');
            this.loader = false;
            this.processing = false;
          }
        },
        (error) => {
          console.error('Error fetching TBO token', error);
          this.loader = false;
          this.processing = false;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private groupSegmentsByTripIndicator(segments: any[]): any[][] {
    const grouped: { [key: number]: any[] } = {};
    segments.forEach((seg) => {
      const key = seg.TripIndicator || 1;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(seg);
    });
    return Object.values(grouped);
  }

  switchTab(tab: 'onward' | 'return'): void {
    this.animationState = 'out';
    setTimeout(() => {
      this.activeTab = tab;
      this.animationState = 'in';
    }, 300);
  }

  getGenderText(gender: number): string {
    return gender === 1 ? 'Male' : gender === 2 ? 'Female' : 'Other';
  }

  getPaxType(type: number): string {
    return type === 1 ? 'Adult' : type === 2 ? 'Child' : 'Infant';
  }

  getMealCode(passenger: any, segmentIndex: number): string {
    if (passenger?.Meal?.Code) {
      return passenger.Meal.Code.trim();
    }
    if (passenger?.MealDynamic?.[segmentIndex]?.Code) {
      return passenger.MealDynamic[segmentIndex].Code;
    }
    return passenger?.SegmentAdditionalInfo?.[segmentIndex]?.Meal || "N/A";
  }

  shouldShowTripInfo(pax: any): boolean {
    if (this.isInternationalReturn) {
      return false;
    }
    const hasBaggage = Array.isArray(pax?.Baggage) && pax.Baggage[0]?.Weight > 0;
    const hasSpecialServices = Array.isArray(pax?.SpecialServices) &&
      pax.SpecialServices.some((s: any) => s.Text && s.Text.trim().length > 0);
    return hasBaggage || hasSpecialServices;
  }

  hasValidOnwardData(pax: any): boolean {
    return (
      pax?.OnwardBaggage?.some((b: any) => b?.Weight > 0) ||
      pax?.OnwardSpecialServices?.some((s: any) => s?.Text?.trim()?.length > 0)
    );
  }

  hasValidReturnData(pax: any): boolean {
    return (
      pax?.ReturnBaggage?.some((b: any) => b?.Weight > 0) ||
      pax?.ReturnSpecialServices?.some((s: any) => s?.Text?.trim()?.length > 0)
    );
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  private getLeadPax(res: any): any | null {
    const pax = res?.Response?.FlightItinerary?.Passenger;
    if (!Array.isArray(pax) || pax.length === 0) return null;
    return pax.find((p: any) => p?.IsLeadPax) || pax[0];
  }

  private splitPhone(contact: string | null | undefined): { countryCode: string | null; phone: string } {
    if (!contact) return { countryCode: null, phone: '' };
    const digits = String(contact).replace(/[^\d]/g, '');
    if (!digits) return { countryCode: null, phone: '' };
    if (digits.length > 10) {
      return { countryCode: digits.slice(0, digits.length - 10), phone: digits.slice(-10) };
    }
    return { countryCode: null, phone: digits };
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/logos/OO.png';
    }
  }
}
