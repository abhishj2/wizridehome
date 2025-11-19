import { Injectable } from '@angular/core';
import { HttpClient,HttpParams, HttpHeaders } from '@angular/common/http';

export interface SourceValue {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {
readonly ROOT_URL = 'https://www.wizzride.com/app/api/testBed/getSrcDestPickDrop.php';
  
  
  constructor(private http : HttpClient) {
    
   }

  getSource()
  {
    const data = {      
      page: 'home',
      type: 'SOURCE',
      
    }
    console.log("value of data",data)
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<SourceValue[]>(this.ROOT_URL,data,{headers});
  }

  getPickupDrop(source:any, destination : any)
  {
    const data = {
      page: 'home',
      type: 'PICKNEW',
      source: source,    
      destination : destination  
    }
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }

  getSharedCarList($userPhone : any, $source : any, $destination : any, $pickup:any, $drop: any, $seats:any, $traveldate: any)
  {
    const data = {
      useId: $userPhone,
      page: 'carlistweb',
      source : $source,
      destination : $destination,
      pickpoint: $pickup,
      droppoint: $drop,
      seats : $seats,
      traveldate : $traveldate
    }
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }

  getSourceDestCode(name : any){
    const data = {
      // useId:this.getUserId(),
      page: 'getcode',
      name : name      
    }
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }

  getSeatDetails(tid : any)
  {
    const data = {
      page: 'seatselection',
      tid : tid
    }
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }

  shareSeatBlock(tid : any, seatno: any, phonenumber : any)
  {
    const data = {
      page: 'seatselectionforblocking',
      type: 'checkblocked',
      tid : tid,
      seatnumber : seatno,
      phonenumber : phonenumber
    }
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }



caraddditionrequest(fullName : any, contactNumber : any, emailId : any, preferredTime : any, travelDate : any, 
  source : any, pickup : any, destination : any, drop : any, seats : any){
  const data = {
    page: 'caradditionrequest',
    fullName : fullName,
    contactNumber : contactNumber,    
    emailId : emailId,
    preferredTime : preferredTime,
    travelDate : travelDate,
    source : source,
    destination : destination,
    pickup : pickup,
    drop: drop,
    seats : seats
  }    

  console.log("Value of Data",data)
  const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
  return this.http.post<any[]>(this.ROOT_URL,data,{headers});
}
  // WIZZBLACK APIs

  getSourceDestinationFb()
  {
    const data = {
      page: 'fbhome',
      type: 'SOURCE'
    }
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }

  getReservedCarList(fromlocid : any, tolocid : any, travelDate:any, travelTime: any)
  {
    const data = {
      page: 'fbshow',
      fromlocid : fromlocid,
      tolocid : tolocid,
      traveldate : travelDate,
      requesttime : travelTime
    }
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }

  getSourceDestCodeBlk(name : any){
    const data = {
      // useId:this.getUserId(),
      page: 'getcodefb',
      name : name      
    }
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }

  // CASHFREE PAYMENTS INTEGRATION 

  sendSharePayment(ORDERID:string,
    APPID : any, traveldate : any,
    source : any, destination : any,
    pickup : any, droppoint : any,
    noofseats : any, totalamount : any,
    traveltime : any, tid : any,
    seatnumber : any, fname : any,
    lname : any, email : any, primaryCountryCode : any, number : any,
    secondaryCountryCode : any, alternatenumber : any, gstNumber : any,
    totalDeficitAmount : any, totalDeficitAmountFlag : any
  
  )
  {
    

    const data = {
      page: 'wspaymentnew',
      ORDERID: ORDERID,
      APPID : APPID,
      traveldate : traveldate,
      source : source, 
      destination : destination,
      pickup : pickup, 
      droppoint : droppoint,
      noofseats : noofseats, 
      totalamount : totalamount,
      traveltime : traveltime, 
      tid : tid,
      seatnumber : seatnumber, 
      fname : fname,
      lname : lname, 
      email : email, 
      primaryCountryCode : primaryCountryCode,
      number : number,
      secondaryCountryCode : secondaryCountryCode,
      alternatenumber : alternatenumber,
      customerGSTIN : gstNumber,
      totalDeficitAmount : totalDeficitAmount, 
      totalDeficitAmountFlag : totalDeficitAmountFlag,

      // dev : 'test',
      dev : 'test',
      type : 'SHAREDWEB'
    }

    console.log("value to temp details",data)
    
    // die();

    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }
  

  sendFbPayment(ORDERID: any,
    totalamt : any,
    traveldate : any,
    source : any,
    destination : any,
    sourcelocid : any,
    destinationlocid : any,
    capacity : any,
    fare : any,
    gst : any,
    cartype : any,
    traveltime : any,
    fname : any,
    lname : any,
    email : any,
    primaryCountryCode : any,
    primarynumber : any,
    secondaryCountryCode : any,
    alternatenumber : any,
    adults : any,
    infants : any,
    picklandmark : any,
    droplandmark : any,
    APPID : any,
    gstNumber : any,
    totalDeficitAmount : any,
    totalDeficitAmountFlag : any
  
  )
    {
      const data = {
        page: 'fbpaymentnew',
        ORDERID: ORDERID,
        totalamt : totalamt,
        traveldate : traveldate,
        source : source,
        destination : destination,
        sourcelocid : sourcelocid,
        destinationlocid : destinationlocid,
        capacity : capacity,
        fare : fare,
        gst : gst,
        cartype : cartype,
        traveltime : traveltime,
        fname : fname,
        lname : lname,
        email : email,
        primaryCountryCode : primaryCountryCode,
        primarynumber : primarynumber,
        secondaryCountryCode : secondaryCountryCode,
        alternatenumber : alternatenumber,
        adults : adults,
        infants : infants,
        picklandmark : picklandmark,
        droplandmark : droplandmark,
        APPID : APPID,
        customerGSTIN : gstNumber,
        totalDeficitAmount : totalDeficitAmount,    
        totalDeficitAmountFlag : totalDeficitAmountFlag,
        // dev : 'test',
        dev : 'test',
        type : 'RESERVEDWEB'

      }

      // console.log("value to temp details",data)

      const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
      return this.http.post<any[]>(this.ROOT_URL,data,{headers});
    }





  insertShareTempDetails(ORDERID:string,
    APPID : any, traveldate : any,
    source : any, destination : any,
    pickup : any, droppoint : any,
    noofseats : any, totalamount : any,
    traveltime : any, tid : any,
    seatnumber : any, fname : any,
    lname : any, email : any, number : any,
    alternatenumber : any)
  {
    const data = {
      page: 'insertsharetempdetails',
      ORDERID: ORDERID,
      APPID : APPID,
      traveldate : traveldate,
      source : source, 
      destination : destination,
      pickup : pickup, 
      droppoint : droppoint,
      noofseats : noofseats, 
      totalamount : totalamount,
      traveltime : traveltime, 
      tid : tid,
      seatnumber : seatnumber, 
      fname : fname,
      lname : lname, 
      email : email, 
      number : number,
      alternatenumber : alternatenumber
    }

    // console.log("value to temp details",data)

    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }

  insertReserveTempDetails(ORDERID:string,
    APPID : any, traveldate : any,
    source : any, destination : any,
    fromlocid: number, tolocid : number,
    pickupLandmark : string, dropLandmark : string,
    capacity : number, fare : any, gst : any, 
    totalamount : any, cartype : any,
    traveltime : any, fname : string,
    lname : string, email : any, number : any,
    alternatenumber : any, noofadults : number, noofkids : number)
  {
    const data = {
      page: 'insertreservetempdetails',
      ORDERID: ORDERID,
      APPID : APPID,
      traveldate : traveldate,
      source : source, 
      destination : destination,
      sourcelocid: fromlocid, 
      destinationlocid : tolocid,
      picklandmark : pickupLandmark, 
      droplandmark : dropLandmark,
      capacity : capacity, 
      fare : fare, 
      gst : gst, 
      totalamt : totalamount, 
      cartype : cartype,
      traveltime : traveltime, 
      fname : fname, lname : lname, email : email, primarynumber : number,
      alternatenumber : alternatenumber, adults : noofadults, infants : noofkids
    }

    // console.log("value to reserve temp details",data)

    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }

  shareSuccess(orderId : any,orderAmount : any){
    const data = {
      page: 'wssuccessnew',
      orderId : orderId,    
      orderAmount : orderAmount,
      env : 'test'
      // env : 'prod'

    }    
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }

  wizzblacksuccess(orderId : any,orderAmount : any){
    const data = {
      page: 'fbsuccessnew',
      orderId : orderId,    
      orderAmount : orderAmount,
      env : 'test'
      // env : 'test'
    }    
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }


  getPNRDetails(PNR : any){
    const data = {
      page: 'getpnrdetails',
      PNR : PNR,      
    }    
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }

  getFBPNRDetails(PNR : any){
    const data = {
      page: 'getfbpnrdetails',
      PNR : PNR,      
    }    
    const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
    return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }



  


sendEmail(message : any, subjectname : any, fromaddress : any, fromname : any, toaddress : any, toname : any, 
  ccaddress : any, ccname : any, bccaddress : any, bccname : any, attachmentname : any){
  const data = {
    page: 'sendemail',
    message : message,
    subjectname : subjectname,
    fromaddress : fromaddress,
    fromname : fromname,
    toaddress : toaddress,
    toname : toname,
    ccaddress : ccaddress,
    ccname : ccname,
    bccaddress : bccaddress,
    bccname : bccname,
    attachmentname : attachmentname
  }    
  const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
  return this.http.post<any[]>(this.ROOT_URL,data,{headers});
}

sendOtp(phonenumber : any){
  const data = {
    page: 'signup',
    type: 'otpcall',
    APPID : phonenumber,      
  }    
  const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
  return this.http.post<any[]>(this.ROOT_URL,data,{headers});
}

cancelcriteria(PNR : any){
  const data = {
    page: 'cancelcriteria',
    PNR: PNR
  }    
  const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
  return this.http.post<any[]>(this.ROOT_URL,data,{headers});
}

cancelShareTicket(pnr : any, refundamount : any, wizzamount : any){
  const data = {
    page: 'cancelticket',
    PNR : pnr,
    refundamount : refundamount,      
    wizzamount : wizzamount
  }    
  const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
  return this.http.post<any[]>(this.ROOT_URL,data,{headers});
}

fbcancelcriteria(PNR : any){
  const data = {
    page: 'fbcancelcriteria',
    PNR: PNR
  }    
  const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
  return this.http.post<any[]>(this.ROOT_URL,data,{headers});
}

cancelReservedTicket(pnr : any, appid : any, refundamount : any, wizzamount : any){
  const data = {
    page: 'fbcancelticket',
    PNR : pnr,
    APPID : appid,
    refundamount : refundamount,      
    wizzamount : wizzamount
  }    
  const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
  return this.http.post<any[]>(this.ROOT_URL,data,{headers});
}





captachVerify(token: any){
  const data = {
    page: 'verifycaptcha',
    grecaptcharesponse : token,
    
  }    
  const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
  return this.http.post<any[]>(this.ROOT_URL,data,{headers});
}

sellYourCar(fullName : any,contactNumber : any, cityName : any, carType : any, 
  carRegNo : any, manufactureYear : any, carPhoto : any, message : any){
  const data = {
    page: 'sellyourcarapply',
    fullName : fullName,
    contactNumber : contactNumber,
    cityName : cityName,
    carType : carType,
    carRegNo : carRegNo,
    manufactureYear : manufactureYear,
    carPhoto : carPhoto,
    message : message        
  }    

  console.log("Data for Sell Your Car",data)
  const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
  return this.http.post<any[]>(this.ROOT_URL,data,{headers});
}



  getDeficitUnionTotal(primary : any, secondary : any){
      const data = {
        page: 'getdeficitamountunion',
        primary : primary,  
        secondary : secondary      

      }    

      console.log("Data for Sell Your Car",data)
      console.log('Selected Add-on Payload:', JSON.stringify(data, null, 2));
      const headers = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'});
      return this.http.post<any[]>(this.ROOT_URL,data,{headers});
  }

    

}




