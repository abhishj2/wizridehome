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
];
