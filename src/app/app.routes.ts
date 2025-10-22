import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookingResultsComponent } from './booking-results/booking-results.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { AboutCompanyComponent } from './aboutpages/about-company/about-company.component';
import { OurvisionComponent } from './aboutpages/ourvision/ourvision.component';
import { OurcommitmentComponent } from './aboutpages/ourcommitment/ourcommitment.component';
import { OurphilosophyComponent } from './aboutpages/ourphilosophy/ourphilosophy.component';
import { ContactusComponent } from './contactus/contactus.component';
import { ApplyforjobComponent } from './careerpages/applyforjob/applyforjob.component';
import { DriverjobComponent } from './careerpages/driverjob/driverjob.component';
import { PartnerwithusComponent } from './careerpages/partnerwithus/partnerwithus.component';
import { InfulencerapplyComponent } from './collaborate/infulencerapply/infulencerapply.component';
import { CorporatepackagesComponent } from './ourservices/corporatepackages/corporatepackages.component';
import { IntercityridesComponent } from './ourservices/intercityrides/intercityrides.component';
import { LocalridesComponent } from './ourservices/localrides/localrides.component';
import { HolidaytoursComponent } from './ourservices/holidaytours/holidaytours.component';
import { PackageddeliveryComponent } from './ourservices/packageddelivery/packageddelivery.component';
import { NortheastindiaholidayComponent } from './ourservices/northeastindiaholiday/northeastindiaholiday.component';
import { WizzrideinternationalholidayComponent } from './ourservices/wizzrideinternationalholiday/wizzrideinternationalholiday.component';
import { ServicesmainComponent } from './ourservices/servicesmain/servicesmain.component';
import { CancellationpolicyComponent } from './importantlinks/cancellationpolicy/cancellationpolicy.component';
import { TermsandconditonsComponent } from './importantlinks/termsandconditons/termsandconditons.component';
import { PrivacyandsecurityComponent } from './importantlinks/privacyandsecurity/privacyandsecurity.component';
import { UseragreementComponent } from './importantlinks/useragreement/useragreement.component';
import { FrequentlyaskedquestionsComponent } from './frequentlyaskedquestions/frequentlyaskedquestions.component';
import { MaindestinationsComponent } from './destinations/maindestinations/maindestinations.component';
import { CancelbookingComponent } from './cancelbooking/cancelbooking.component';
import { GangtokComponent } from './destinations/sikkim/gangtok/gangtok.component';
import { NamchiComponent } from './destinations/sikkim/namchi/namchi.component';



export const routes: Routes = [
      { path: '', component: HomeComponent },
      { path: 'booking-results', component: BookingResultsComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'thankyou', component: ThankyouComponent },
      {path:'aboutcompany',component:AboutCompanyComponent},
      {path:'aboutcompany/ourvision',component:OurvisionComponent},
      {
            path:'aboutcompany/ourcommittment',component:OurcommitmentComponent
      },
      {path:'aboutcompany/ourworkphilosophy',component:OurphilosophyComponent},
      {path:'contactus',component:ContactusComponent},
      {path:'applyforjob',component:ApplyforjobComponent},
      {path:'applyforjob/driverjob',component:DriverjobComponent},
      {path:'applyforjob/partnerwithus',component:PartnerwithusComponent},
      {path:'influencerapply',component:InfulencerapplyComponent},
      {path:'ourservices/corporatepackages',component:CorporatepackagesComponent},
      {path:'ourservices/intercityrides',component:IntercityridesComponent},
      {path:'ourservices/localrides',component:LocalridesComponent},
      {path:'ourservices/holidaystours',component:HolidaytoursComponent},
      {path:'ourservices/packagedelivery',component:PackageddeliveryComponent},

      {path:'ourservices/holidaystours/WizzTour-North-East-India-Holiday-Planner', component:NortheastindiaholidayComponent},
      {path:'ourservices/holidaystours/Wizzride-International-Holiday-Planner',component:WizzrideinternationalholidayComponent},
      {path:'ourservices',component:ServicesmainComponent},
      {path:'cancellationpolicy',component:CancellationpolicyComponent},
      {path:'cancellationpolicy/termsandconditions',component:TermsandconditonsComponent},
      {path:'cancellationpolicy/privacypolicy',component:PrivacyandsecurityComponent},
      {path:'cancellationpolicy/useragreement',component:UseragreementComponent},
      {path:'frequentlyaskedquestions',component:FrequentlyaskedquestionsComponent},
      {path:'destinations',component:MaindestinationsComponent},
      {path:'cancelticket',component:CancelbookingComponent},
      

      //destinations

      {path:'destinations/gangtok',component:GangtokComponent},
      {path:'destinations/namchi',component:NamchiComponent},
      
];
