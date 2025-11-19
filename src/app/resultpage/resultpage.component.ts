import { AfterViewInit, Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from '../services/apiservice.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-resultpage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultpage.component.html',
  styleUrls: ['./resultpage.component.css']
})
export class ResultpageComponent implements OnInit, AfterViewInit, OnDestroy { 
  public orderId : any;
  // private token : any;
  public orderAmount : any;
  public type : string = '';
  public qr : string = '';
  public list : any;
  public showSuccess : boolean = false;
  loader : boolean = true;

  contactEmail : any = 'customersupport@wizzride.com';
  feedbackEmail : any = 'feedback@wizzride.com';
  isUnifiedSegmentFormat : boolean = false;
  tripType : string = '';

  messageSubscription1!: Subscription;
  messageSubscription2!: Subscription;
  messageSubscription3!: Subscription;
  messageSubscription4!: Subscription;
  messageSubscription5!: Subscription;
  messageSubscription6!: Subscription;
  messageSubscription7!: Subscription;
  isBrowser : boolean = false;


  constructor(private _Activateroute : ActivatedRoute,
    private apiservice : ApiserviceService,
    private router : Router,
    private http : HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object){

  }
  

  ngOnInit(): void {
    this.loader = true;
    this.messageSubscription1 = this._Activateroute.paramMap.subscribe((params : any)=>{
      console.log("Value of Params",params)
      this.orderId = params.get('orderId')
      // this.token = params.get('token')
      this.orderAmount = params.get('orderAmount')
      this.type = params.get('type')

      console.log("Value of OrderId",this.orderId);
      console.log("Value of Type",this.type);
      // console.log("Value of token",this.token); 
      console.log("value of amount",this.orderAmount)      

      this.qr = "https://quickchart.io/qr?text="+this.orderId
      if(this.orderId && this.type){

      if(this.type === 'SHAREDWEB'){              
     
        this.messageSubscription2 = this.apiservice.getPNRDetails(this.orderId).subscribe((val)=>{
          console.log("List",val);
            this.list = val[0];
            console.log("Listtttttttttt",this.list);
            if(this.list['STATUS']==='ACTIVE' || this.list['STATUS'] =='CANCELLED-VERIFIED'
            || this.list['STATUS'] =='OFFLINE' || this.list['STATUS'] =='CANCELLED-ADMIN'
            || this.list['STATUS'] =='OFFLINE-TICK-NO-GEN' || this.list['STATUS'] =='OFFLINE-RESCHEDULING'
            || this.list['STATUS'] =='OFFLINE-LINK' || this.list['STATUS'] =='OFFLINE-CASH'
            ){
              this.loader = false;
              Swal.fire({
                title: 'Sorry!',
                html: "Ticket Already In The System!",
                icon: 'error',
                confirmButtonText: 'OK'
              })
              this.router.navigate(['home',{tab: 1}]);

            }else{
              this.messageSubscription3 = this.apiservice.shareSuccess(this.orderId,this.orderAmount).subscribe((val)=>{
                console.log("Sharing Ticket has been generated",val)        
                if(val.includes('GENERATED')){
                  this.messageSubscription4 = this.apiservice.getPNRDetails(this.orderId).subscribe((val)=>{
                    console.log("List",val);
                      this.list = val[0];
                      console.log("Listtttttttttt",this.list);
                      this.showSuccess = true;
                      this.loader = false;
                      setTimeout(()=>{                           
                        this.router.navigate(['home',{tab: 1}]);
                      }, 30000);
      
                  })
                }else{
                  this.loader = false;
                  Swal.fire({
                    title: 'Sorry!',
                    html: val,
                    icon: 'error',
                    confirmButtonText: 'OK'
                  })
                  this.router.navigate(['home',{tab: 1}]);
                }
                
              }) 
            }

        })
      
        
      }else if(this.type === 'RESERVEDWEB'){

        this.messageSubscription5 = this.apiservice.getFBPNRDetails(this.orderId).subscribe((val)=>{
          console.log("List",val);
            this.list = val[0];
            console.log("Listtttttttttt",this.list);
            if(this.list['STATUS']==='ACTIVE' || this.list['STATUS'] =='CANCELLED-VERIFIED'
            || this.list['STATUS'] =='CANCEL-ADMIN' || this.list['STATUS'] =='OFFLINE'
            ){
              this.loader = false;
              Swal.fire({
                title: 'Sorry!',
                html: "Ticket Already In The System!",
                icon: 'error',
                confirmButtonText: 'OK'
              })
              this.router.navigate(['home',{tab: 2}]);
            }else{
              this.messageSubscription6 = this.apiservice.wizzblacksuccess(this.orderId,this.orderAmount).subscribe((val)=>{
                console.log("FullBooking Ticket has been generated",val)        
                if(val.includes('GENERATED')){
                  this.messageSubscription7 = this.apiservice.getFBPNRDetails(this.orderId).subscribe((val)=>{
                    console.log("List",val);
                      this.list = val[0];
                      console.log("Listtttttttttt",this.list);
                      this.showSuccess = true;
                      this.loader = false;
                     
                      
                      setTimeout(()=>{                           
                        this.router.navigate(['home',{tab: 2}]);
                      }, 30000);
      
                  })
                }else{
                  this.loader = false;
                  Swal.fire({
                    title: 'Sorry!',
                    html: val,
                    icon: 'error',
                    confirmButtonText: 'OK'
                  })
                  this.router.navigate(['home',{tab: 2}]);
                }
                
              })
            }
          })
        // console.log("Reserved Value",val)
        
      }
      }
    });
    
  }


 

  ngOnDestroy(): void {
    // Unsubscribe from the subscription to avoid memory leaks
    if(this.messageSubscription1){
      this.messageSubscription1.unsubscribe();
    }
     if(this.messageSubscription2){
      this.messageSubscription2.unsubscribe();
    }
     if(this.messageSubscription3){
      this.messageSubscription3.unsubscribe();
    }
     if(this.messageSubscription4){
      this.messageSubscription4.unsubscribe();
    }
     if(this.messageSubscription5){
      this.messageSubscription5.unsubscribe();
    }
     if(this.messageSubscription6){
      this.messageSubscription6.unsubscribe();
    }
     if(this.messageSubscription7){
      this.messageSubscription7.unsubscribe();
    }
  }



  returnToHome(){
    this.router.navigate(['/home']); 
  }

  ngAfterViewInit(): void {
    // Component initialization complete
  }

}