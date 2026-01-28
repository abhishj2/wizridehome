import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

export interface SourceValue {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {
  readonly ROOT_URL = 'https://www.wizzride.com/app/api/testBed/getSrcDestPickDrop.php';


  constructor(private http: HttpClient) {

  }

  getSource() {
    const data = {
      page: 'home',
      type: 'SOURCE',

    }
    // console.log("value of data",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<SourceValue[]>(this.ROOT_URL, data, { headers });
  }

  getCheckedBlockedNumber(number: any) {
    const data = {
      page: 'checkblockednumber',
      blockedNumber: number
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  getstatewisecitywithpopularity() {
    const data = {
      page: 'getnewsourcedestnames'
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }
  getPickupDrop(source: any, destination: any) {
    const data = {
      page: 'home',
      type: 'PICKNEW',
      source: source,
      destination: destination
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  getSharedCarList($userPhone: any, $source: any, $destination: any, $pickup: any, $drop: any, $seats: any, $traveldate: any) {
    const data = {
      useId: $userPhone,
      page: 'carlistweb',
      source: $source,
      destination: $destination,
      pickpoint: $pickup,
      droppoint: $drop,
      seats: $seats,
      traveldate: $traveldate
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  getSourceDestCode(name: any) {
    const data = {
      // useId:this.getUserId(),
      page: 'getcode',
      name: name
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  getSeatDetails(tid: any) {
    const data = {
      page: 'seatselection',
      tid: tid
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  shareSeatBlock(tid: any, seatno: any, phonenumber: any) {
    const data = {
      page: 'seatselectionforblocking',
      type: 'checkblocked',
      tid: tid,
      seatnumber: seatno,
      phonenumber: phonenumber
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }



  caraddditionrequest(fullName: any, contactNumber: any, emailId: any, preferredTime: any, travelDate: any,
    source: any, pickup: any, destination: any, drop: any, seats: any) {
    const data = {
      page: 'caradditionrequest',
      fullName: fullName,
      contactNumber: contactNumber,
      emailId: emailId,
      preferredTime: preferredTime,
      travelDate: travelDate,
      source: source,
      destination: destination,
      pickup: pickup,
      drop: drop,
      seats: seats
    }

    // console.log("Value of Data",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }
  // WIZZBLACK APIs

  getSourceDestinationFb() {
    const data = {
      page: 'fbhome',
      type: 'SOURCE'
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  getReservedCarList(fromlocid: any, tolocid: any, travelDate: any, travelTime: any) {
    const data = {
      page: 'fbshow',
      fromlocid: fromlocid,
      tolocid: tolocid,
      traveldate: travelDate,
      requesttime: travelTime
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  getSourceDestCodeBlk(name: any) {
    const data = {
      // useId:this.getUserId(),
      page: 'getcodefb',
      name: name
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  // CASHFREE PAYMENTS INTEGRATION 

  sendSharePayment(ORDERID: string,
    APPID: any, traveldate: any,
    source: any, destination: any,
    pickup: any, droppoint: any,
    noofseats: any, totalamount: any,
    traveltime: any, tid: any,
    seatnumber: any, fname: any,
    lname: any, email: any, primaryCountryCode: any, number: any,
    secondaryCountryCode: any, alternatenumber: any, gstNumber: any,
    totalDeficitAmount: any, totalDeficitAmountFlag: any

  ) {


    const data = {
      page: 'wspaymentnew',
      ORDERID: ORDERID,
      APPID: APPID,
      traveldate: traveldate,
      source: source,
      destination: destination,
      pickup: pickup,
      droppoint: droppoint,
      noofseats: noofseats,
      totalamount: totalamount,
      traveltime: traveltime,
      tid: tid,
      seatnumber: seatnumber,
      fname: fname,
      lname: lname,
      email: email,
      primaryCountryCode: primaryCountryCode,
      number: number,
      secondaryCountryCode: secondaryCountryCode,
      alternatenumber: alternatenumber,
      customerGSTIN: gstNumber,
      totalDeficitAmount: totalDeficitAmount,
      totalDeficitAmountFlag: totalDeficitAmountFlag,

      // dev : 'test',
      dev: 'test',
      type: 'SHAREDWEB'
    }

    // console.log("value to temp details",data)

    // die();

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  sendFbPayment(ORDERID: any,
    totalamt: any,
    traveldate: any,
    source: any,
    destination: any,
    sourcelocid: any,
    destinationlocid: any,
    capacity: any,
    fare: any,
    gst: any,
    cartype: any,
    traveltime: any,
    fname: any,
    lname: any,
    email: any,
    primaryCountryCode: any,
    primarynumber: any,
    secondaryCountryCode: any,
    alternatenumber: any,
    adults: any,
    infants: any,
    picklandmark: any,
    droplandmark: any,
    APPID: any,
    gstNumber: any,
    totalDeficitAmount: any,
    totalDeficitAmountFlag: any

  ) {
    const data = {
      page: 'fbpaymentnew',
      ORDERID: ORDERID,
      totalamt: totalamt,
      traveldate: traveldate,
      source: source,
      destination: destination,
      sourcelocid: sourcelocid,
      destinationlocid: destinationlocid,
      capacity: capacity,
      fare: fare,
      gst: gst,
      cartype: cartype,
      traveltime: traveltime,
      fname: fname,
      lname: lname,
      email: email,
      primaryCountryCode: primaryCountryCode,
      primarynumber: primarynumber,
      secondaryCountryCode: secondaryCountryCode,
      alternatenumber: alternatenumber,
      adults: adults,
      infants: infants,
      picklandmark: picklandmark,
      droplandmark: droplandmark,
      APPID: APPID,
      customerGSTIN: gstNumber,
      totalDeficitAmount: totalDeficitAmount,
      totalDeficitAmountFlag: totalDeficitAmountFlag,
      // dev : 'test',
      dev: 'test',
      type: 'RESERVEDWEB'

    }

    // console.log("value to temp details",data)

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }





  insertShareTempDetails(ORDERID: string,
    APPID: any, traveldate: any,
    source: any, destination: any,
    pickup: any, droppoint: any,
    noofseats: any, totalamount: any,
    traveltime: any, tid: any,
    seatnumber: any, fname: any,
    lname: any, email: any, number: any,
    alternatenumber: any) {
    const data = {
      page: 'insertsharetempdetails',
      ORDERID: ORDERID,
      APPID: APPID,
      traveldate: traveldate,
      source: source,
      destination: destination,
      pickup: pickup,
      droppoint: droppoint,
      noofseats: noofseats,
      totalamount: totalamount,
      traveltime: traveltime,
      tid: tid,
      seatnumber: seatnumber,
      fname: fname,
      lname: lname,
      email: email,
      number: number,
      alternatenumber: alternatenumber
    }

    // console.log("value to temp details",data)

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  insertReserveTempDetails(ORDERID: string,
    APPID: any, traveldate: any,
    source: any, destination: any,
    fromlocid: number, tolocid: number,
    pickupLandmark: string, dropLandmark: string,
    capacity: number, fare: any, gst: any,
    totalamount: any, cartype: any,
    traveltime: any, fname: string,
    lname: string, email: any, number: any,
    alternatenumber: any, noofadults: number, noofkids: number) {
    const data = {
      page: 'insertreservetempdetails',
      ORDERID: ORDERID,
      APPID: APPID,
      traveldate: traveldate,
      source: source,
      destination: destination,
      sourcelocid: fromlocid,
      destinationlocid: tolocid,
      picklandmark: pickupLandmark,
      droplandmark: dropLandmark,
      capacity: capacity,
      fare: fare,
      gst: gst,
      totalamt: totalamount,
      cartype: cartype,
      traveltime: traveltime,
      fname: fname, lname: lname, email: email, primarynumber: number,
      alternatenumber: alternatenumber, adults: noofadults, infants: noofkids
    }

    // console.log("value to reserve temp details",data)

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  shareSuccess(orderId: any, orderAmount: any) {
    const data = {
      page: 'wssuccessnew',
      orderId: orderId,
      orderAmount: orderAmount,
      env: 'test'
      // env : 'prod'

    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  wizzblacksuccess(orderId: any, orderAmount: any) {
    const data = {
      page: 'fbsuccessnew',
      orderId: orderId,
      orderAmount: orderAmount,
      env: 'test'
      // env : 'test'
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  getPNRDetails(PNR: any) {
    const data = {
      page: 'getpnrdetails',
      PNR: PNR,
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  getFBPNRDetails(PNR: any) {
    const data = {
      page: 'getfbpnrdetails',
      PNR: PNR,
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }






  sendEmail(message: any, subjectname: any, fromaddress: any, fromname: any, toaddress: any, toname: any,
    ccaddress: any, ccname: any, bccaddress: any, bccname: any, attachmentname: any) {
    const data = {
      page: 'sendemail',
      message: message,
      subjectname: subjectname,
      fromaddress: fromaddress,
      fromname: fromname,
      toaddress: toaddress,
      toname: toname,
      ccaddress: ccaddress,
      ccname: ccname,
      bccaddress: bccaddress,
      bccname: bccname,
      attachmentname: attachmentname
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  sendOtp(phonenumber: any) {
    const data = {
      page: 'signup',
      type: 'otpcall',
      APPID: phonenumber,
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  cancelcriteria(PNR: any) {
    const data = {
      page: 'cancelcriteria',
      PNR: PNR
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  cancelShareTicket(pnr: any, refundamount: any, wizzamount: any) {
    const data = {
      page: 'cancelticket',
      PNR: pnr,
      refundamount: refundamount,
      wizzamount: wizzamount
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  fbcancelcriteria(PNR: any) {
    const data = {
      page: 'fbcancelcriteria',
      PNR: PNR
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  cancelReservedTicket(pnr: any, appid: any, refundamount: any, wizzamount: any) {
    const data = {
      page: 'fbcancelticket',
      PNR: pnr,
      APPID: appid,
      refundamount: refundamount,
      wizzamount: wizzamount
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }





  captachVerify(token: any) {
    const data = {
      page: 'verifycaptcha',
      grecaptcharesponse: token,

    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  sellYourCar(fullName: any, contactNumber: any, cityName: any, carType: any,
    carRegNo: any, manufactureYear: any, carPhoto: any, message: any) {
    const data = {
      page: 'sellyourcarapply',
      fullName: fullName,
      contactNumber: contactNumber,
      cityName: cityName,
      carType: carType,
      carRegNo: carRegNo,
      manufactureYear: manufactureYear,
      carPhoto: carPhoto,
      message: message
    }

    // console.log("Data for Sell Your Car",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }



  getDeficitUnionTotal(primary: any, secondary: any) {
    const data = {
      page: 'getdeficitamountunion',
      primary: primary,
      secondary: secondary

    }

    // console.log("Data for Sell Your Car",data)
    // console.log('Selected Add-on Payload:', JSON.stringify(data, null, 2));
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  getTboToken() {
    const data = {
      page: 'authenticatetbo',
      // env : 'test'
      env: 'prod'

    }

    // console.log("Data for Sell Your Car",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }
  // generateFlighToken()
  getFlightDetailsOneWay(enduserip: any, tokenid: any, adultcount: any, childcount: any, infantcount: any,
    journeyType: any, sourceAirport: any, destinationAirport: any, cabinClass: any, departureDate: any, fareType: any
  ) {
    const data = {
      page: 'flightsearchtbo',
      enduserip: enduserip,
      tokenid: tokenid,
      adultcount: adultcount,
      childcount: childcount,
      infantcount: infantcount,
      journeyType: journeyType,
      sourceAirport: sourceAirport,
      destinationAirport: destinationAirport,
      cabinClass: cabinClass,
      departureDate: departureDate,
      resultFareType: fareType,
      // env : 'test'  // COMMENTED OUT - Using production environment for real flight data
      env: 'prod'
    }

    // console.log("Data for Sell Your Car",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  getFlightDetailsBothWay(enduserip: any, tokenid: any, adultcount: any, childcount: any, infantcount: any,
    journeyType: any, sourceAirport: any, destinationAirport: any, cabinClass: any, departureDate: any,
    returnDate: any, fareType: any
  ) {
    const data = {
      page: 'flightsearchtboreturnflight',
      enduserip: enduserip,
      tokenid: tokenid,
      adultcount: adultcount,
      childcount: childcount,
      infantcount: infantcount,
      journeyType: journeyType,
      sourceAirport: sourceAirport,
      destinationAirport: destinationAirport,
      cabinClass: cabinClass,
      departureDate: departureDate,
      returnDate: returnDate,
      resultFareType: fareType,
      // env : 'test'  // COMMENTED OUT - Using production environment for real flight data
      env: 'prod'
    }

    // console.log("Data for Sell Your Car",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  getFareRule(enduserip: any, tokenid: any, traceid: any, resultindex: any) {
    const data = {
      page: 'fareruletbo',
      enduserip: enduserip,
      tokenid: tokenid,
      traceid: traceid,
      resultindex: resultindex,
      // env : 'test'
      env: 'prod'
    }

    // console.log("Data for Sell Your Car",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  getFareQuote(enduserip: any, tokenid: any, traceid: any, resultindex: any) {
    const data = {
      page: 'farequotetbo',
      enduserip: enduserip,
      tokenid: tokenid,
      traceid: traceid,
      resultindex: resultindex,
      // env : 'test'
      env: 'prod'
    }

    // console.log("Data for Sell Your Car",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  getSSR(enduserip: any, tokenid: any, traceid: any, resultindex: any) {
    const data = {
      page: 'ssrtbo',
      enduserip: enduserip,
      tokenid: tokenid,
      traceid: traceid,
      resultindex: resultindex,
      // env : 'test'
      env: 'prod'
    }

    // console.log("Data for Sell Your Car",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  getCalendarFare(enduserip: any, tokenid: any, journeyType: any, sourceAirport: any, destinationAirport: any,
    cabinClass: any, departureDate: any, extendedDate: any
  ) {
    const data = {
      page: 'getcalendarfare',
      enduserip: enduserip,
      tokenid: tokenid,
      journeyType: journeyType,
      sourceAirport: sourceAirport,
      destinationAirport: destinationAirport,
      cabinClass: cabinClass,
      departureDate: departureDate,
      extendedDate: extendedDate,
      // env : 'test'
      env: 'prod'
    }

    // console.log("Data for Sell Your Car",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  bookTicketLCC(enduserip: any, tokenid: any, traceid: any, resultindex: any, payload: any) {
    const data = {
      page: 'bookticketlcc',
      enduserip: enduserip,
      tokenid: tokenid,
      traceid: traceid,
      resultindex: resultindex,
      payload: payload,
      // env : 'test'
      env: 'prod'
    }
    // console.log("Data for Sell Your Car",data)
    // console.log('Selected Add-on Payload:', JSON.stringify(data, null, 2));
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  bookTicketNonLCC(enduserip: any, tokenid: any, traceid: any, resultindex: any, payload: any) {
    const data = {
      page: 'bookticketnonlcc',
      enduserip: enduserip,
      tokenid: tokenid,
      traceid: traceid,
      resultindex: resultindex,
      payload: payload,
      // env : 'test'
      env: 'prod'
    }

    // console.log("Data for Sell Your Car",data)
    // console.log('Selected Add-on Payload:', JSON.stringify(data, null, 2));
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  finalTicketNonLCC(enduserip: any, tokenid: any, traceid: any, PNR: any, bookingid: any, passport: any) {
    const data = {
      page: 'ticketnonlcc',
      enduserip: enduserip,
      tokenid: tokenid,
      traceid: traceid,
      PNR: PNR,
      bookingid: bookingid,
      passport: passport,
      // env : 'test'
      env: 'prod'
    }

    // console.log("Data for Sell Your Car",data)
    // console.log('Selected Add-on Payload:', JSON.stringify(data, null, 2));
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }



  // CASHFREE PAYMENTS INTEGRATION 

  sendFlightPayment(ORDERID: string,
    APPID: any, passengerFname: any, passengerLname: any, passengerEmail: any, passengerContact: any, orderAmount: any,
    payload: any) {
    const data = {
      page: 'wsflightpaymentnew',
      ORDERID: ORDERID,
      APPID: APPID,
      passengerFname: passengerFname,
      passengerLname: passengerLname,
      passengerEmail: passengerEmail,
      passengerContact: passengerContact,
      orderAmount: orderAmount,
      payload: payload,
      dev: 'prod',
      // dev : 'prod',
      type: 'FLIGHTWEB'
    }
    console.log("value to temp details", data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  getFullAiportList() {
    const data = {
      page: 'getallairports',
    }

    // console.log("Data for Sell Your Car",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  getFlightBookingDetails(tokenid: any, enduserip: any, pnr: any, firstName: any) {
    const data = {
      page: 'gettbobookingdetails',
      enduserip: enduserip,
      tokenid: tokenid,
      PNR: pnr,
      firstName: firstName,
      // env : 'test'
      env: 'prod'
    }

    // console.log("Data for Sell Your Car",data)
    // console.log('Selected Add-on Payload:', JSON.stringify(data, null, 2));
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  flightSuccess(APPID: any, ORDERID: any, TRIPTYPE: any, ISUNIFIEDSEGMENT: any,
    CUSTOMERNAME: any, CUSTOMEREMAIL: any, CUSTOMERDIALCOUNTRYCODE: any,
    CUSTOMERPHONE: any,
    SOURCE: any, DESTINATION: any, ONWARDDATE: any, RETURNDATE: any,


    ONWARDPAYLOAD: any, RETURNPAYLOAD: any, ONWARDAMOUNT: any,
    RETURNAMOUNT: any, TOTALAMOUNT: any, ISLCC: any, ISLCCRETURN: any
  ) {
    const data = {
      page: 'flpaymentnew',
      APPID: APPID,
      ORDERID: ORDERID,
      TRIPTYPE: TRIPTYPE,
      ISUNIFIEDSEGMENT: ISUNIFIEDSEGMENT,
      CUSTOMERNAME: CUSTOMERNAME,
      CUSTOMEREMAIL: CUSTOMEREMAIL,
      CUSTOMERDIALCOUNTRYCODE: CUSTOMERDIALCOUNTRYCODE,
      CUSTOMERPHONE: CUSTOMERPHONE,
      SOURCE: SOURCE,
      DESTINATION: DESTINATION,
      ONWARDDATE: ONWARDDATE,
      RETURNDATE: RETURNDATE,
      ONWARDPAYLOAD: ONWARDPAYLOAD,
      RETURNPAYLOAD: RETURNPAYLOAD,
      ONWARDAMOUNT: ONWARDAMOUNT,
      RETURNAMOUNT: RETURNAMOUNT,
      TOTALAMOUNT: TOTALAMOUNT,
      ISLCC: ISLCC,
      ISLCCRETURN: ISLCCRETURN,
      //  dev : 'test',
      dev: 'prod',
      type: 'FLIGHT'

    }

    // console.log("Payment Data",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  checkFlightPaymentTbo(orderId: any, orderAmount: any) {
    const data = {
      page: 'checktboflightsignature',
      ORDERID: orderId,
      TOTALAMOUNT: orderAmount,
      //  dev : 'test',
      dev: 'prod',
    }

    // console.log("Payment Data",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  flightTicketInsert(ORDERID: any, ONWARDFLIGHTPNR: any, ONWARDBOOKINGID: any,
    RETURNFLIGHTPNR: any, RETURNBOOKINGID: any,
    ONWARDORDERDETAILS: any, RETURNORDERDETAILS: any,
    PASSENGERCOUNT: any, ONWARDTOTALAMOUNT: any, RETURNTOTALAMOUNT: any,
    TOTALAMOUNT: any,
    APPID: any, NAME: any, EMAIL: any, COUNTRYCODE: any, PHONE: any,
  ) {
    const data = {
      page: 'flightgenerateticket',
      ORDERID: ORDERID,
      ONWARDFLIGHTPNR: ONWARDFLIGHTPNR,
      ONWARDBOOKINGID: ONWARDBOOKINGID,
      RETURNFLIGHTPNR: RETURNFLIGHTPNR,
      RETURNBOOKINGID: RETURNBOOKINGID,
      ONWARDORDERDETAILS: ONWARDORDERDETAILS,
      RETURNORDERDETAILS: RETURNORDERDETAILS,
      PASSENGERCOUNT: PASSENGERCOUNT,
      ONWARDTOTALAMOUNT: ONWARDTOTALAMOUNT,
      RETURNTOTALAMOUNT: RETURNTOTALAMOUNT,
      TOTALAMOUNT: TOTALAMOUNT,
      APPID: APPID,
      NAME: NAME,
      EMAIL: EMAIL,
      COUNTRYCODE: COUNTRYCODE,
      PHONE: PHONE
    }

    // console.log("Payment Data",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }

  insertNonLCCBookingDetails(finalPayload: any) {
    const data = {
      page: 'insertnonlccbookingdetail',
      enduserip: finalPayload.enduserip,
      tokenid: finalPayload.tokenid,
      traceid: finalPayload.traceid,
      PNR: finalPayload.PNR,
      bookingid: finalPayload.bookingid,
      passport: finalPayload.passport,
      errormessage: finalPayload.errormessage,
      wizzpnr: finalPayload.wizzpnr
    }

    // console.log("Data for Sell Your Car",data)
    // console.log('Selected Add-on Payload:', JSON.stringify(data, null, 2));
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  getFlightDetailsMultiCity(enduserip: any, tokenid: any, adultcount: any, childcount: any, infantcount: any,
    segments: any, fareType: any
  ) {
    const data = {
      page: 'flightsearchtbomulticityflight',
      enduserip: enduserip,
      tokenid: tokenid,
      adultcount: adultcount,
      childcount: childcount,
      infantcount: infantcount,
      segments: segments,
      resultFareType: fareType,
      // env : 'test'
      env: 'prod'
    }

    // console.log("Data for Sell Your Car",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  getTempFlightDetails(pnr: any
  ) {
    const data = {
      page: 'getflightdetailtempdetails',
      pnr: pnr
    }

    // console.log("Data for Sell Your Car",data)
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


  insertWizzblackValidRequest(source: any, destination: any, requestDate: any, requestTime: any, contact: any) {
    const data = {
      page: 'wizzblackvalidrequest',
      source: source,
      destination: destination,
      requestDate: requestDate,
      requestTime: requestTime,
      contact: contact
    }

    // console.log("Data for Sell Your Car",data)
    // console.log('Selected Add-on Payload:', JSON.stringify(data, null, 2));
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }



  createFlightRequestData(fromAirport: any, fromCode: any, toAirport: any, toCode: any, tripType: any,
    travelClass: any, noOfAdults: any, noOfChildren: any, noOfInfants: any, multiCityArray: any,
    departureDate: any, returnDate: any, contact: any
  ) {
    const data = {
      page: 'flightrequest',
      fromAirport: fromAirport,
      fromCode: fromCode,
      toAirport: toAirport,
      toCode: toCode,
      tripType: 'Website : ' + tripType,
      travelClass: travelClass,
      noOfAdults: noOfAdults,
      noOfChildren: noOfChildren,
      noOfInfants: noOfInfants,
      multiCityArray: multiCityArray,
      departureDate: departureDate,
      returnDate: returnDate,
      contact: contact,

    }

    // console.log("Data for Sell Your Car",data)
    // console.log('Selected Add-on Payload:', JSON.stringify(data, null, 2));
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    return this.http.post<any[]>(this.ROOT_URL, data, { headers });
  }


}


