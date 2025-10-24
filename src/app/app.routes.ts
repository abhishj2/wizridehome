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
import { YuksomComponent } from './destinations/sikkim/yuksom/yuksom.component';
import { LachungComponent } from './destinations/sikkim/lachung/lachung.component';
import { TsomgolakeComponent } from './destinations/sikkim/tsomgolake/tsomgolake.component';
import { PellingComponent } from './destinations/sikkim/pelling/pelling.component';
import { NathulapassComponent } from './destinations/sikkim/nathulapass/nathulapass.component';
import { RumtekmonasteryComponent } from './destinations/sikkim/rumtekmonastery/rumtekmonastery.component';
import { ZulukComponent } from './destinations/sikkim/zuluk/zuluk.component';
import { RangpoComponent } from './destinations/sikkim/rangpo/rangpo.component';
import { DarjeelingtownComponent } from './destinations/darjeelingandkalimpong/darjeelingtown/darjeelingtown.component';
import { TigerhillComponent } from './destinations/darjeelingandkalimpong/tigerhill/tigerhill.component';
import { GhoommonsateryComponent } from './destinations/darjeelingandkalimpong/ghoommonsatery/ghoommonsatery.component';
import { BatasialoopComponent } from './destinations/darjeelingandkalimpong/batasialoop/batasialoop.component';
import { HimalayanzoologicalparkComponent } from './destinations/darjeelingandkalimpong/himalayanzoologicalpark/himalayanzoologicalpark.component';
import { HappyvalleyteaestateComponent } from './destinations/darjeelingandkalimpong/happyvalleyteaestate/happyvalleyteaestate.component';
import { KurseongComponent } from './destinations/darjeelingandkalimpong/kurseong/kurseong.component';
import { KalimpongComponent } from './destinations/darjeelingandkalimpong/kalimpong/kalimpong.component';
import { RavanglaComponent } from './destinations/sikkim/ravangla/ravangla.component';
import { KazirangaComponent } from './destinations/assam/kaziranga/kaziranga.component';
import { MajuliislandComponent } from './destinations/assam/majuliisland/majuliisland.component';
import { GuwahaticityComponent } from './destinations/assam/guwahaticity/guwahaticity.component';
import { KamakhyatempleComponent } from './destinations/assam/kamakhyatemple/kamakhyatemple.component';
import { SavasagarComponent } from './destinations/assam/savasagar/savasagar.component';
import { TezpurComponent } from './destinations/assam/tezpur/tezpur.component';
import { ShillongComponent } from './destinations/meghalaya/shillong/shillong.component';
import { CherrapunjiComponent } from './destinations/meghalaya/cherrapunji/cherrapunji.component';
import { MawsynramComponent } from './destinations/meghalaya/mawsynram/mawsynram.component';
import { DawkiComponent } from './destinations/meghalaya/dawki/dawki.component';
import { UmiamlakeComponent } from './destinations/meghalaya/umiamlake/umiamlake.component';
import { LaitlumcanyonsComponent } from './destinations/meghalaya/laitlumcanyons/laitlumcanyons.component';
import { TawangComponent } from './destinations/arunachal/tawang/tawang.component';
import { ZirovalleyComponent } from './destinations/arunachal/zirovalley/zirovalley.component';
import { NamdaphanationalparkComponent } from './destinations/arunachal/namdaphanationalpark/namdaphanationalpark.component';
import { ItanagarComponent } from './destinations/arunachal/itanagar/itanagar.component';
import { BhalukpongComponent } from './destinations/arunachal/bhalukpong/bhalukpong.component';
import { BomdilaComponent } from './destinations/arunachal/bomdila/bomdila.component';
import { KohimaComponent } from './destinations/nagaland/kohima/kohima.component';
import { DimapurComponent } from './destinations/nagaland/dimapur/dimapur.component';
import { MokokchungComponent } from './destinations/nagaland/mokokchung/mokokchung.component';
import { MonComponent } from './destinations/nagaland/mon/mon.component';
import { KhonomagreenvillageComponent } from './destinations/nagaland/khonomagreenvillage/khonomagreenvillage.component';
import { DzukouvalleyComponent } from './destinations/nagaland/dzukouvalley/dzukouvalley.component';
import { GuwahatiairportComponent } from './airports/guwahatiairport/guwahatiairport.component';
import { BagdograirportComponent } from './airports/bagdograirport/bagdograirport.component';
import { ShillongairportComponent } from './airports/shillongairport/shillongairport.component';
import { PakyongairportComponent } from './airports/pakyongairport/pakyongairport.component';



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
      {path:'destinations/yuksom',component:YuksomComponent},
      {path:'destinations/lachung',component:LachungComponent},
      {path:'destinations/tsomgo_lake',component:TsomgolakeComponent},
      {path:'destinations/pelling',component:PellingComponent},
      {path:'destinations/nathula_pass',component:NathulapassComponent},
      {path:'destinations/rumtek_monastery',component:RumtekmonasteryComponent},
      {path:'destinations/zuluk',component:ZulukComponent},
      {path:'destinations/rangpo',component:RangpoComponent},


      //Darjeeling
      {path:'destinations/darjeeling',component:DarjeelingtownComponent},
      {path:'destinations/tigerhill',component:TigerhillComponent},
      {path:'destinations/ghoom-monastery',component:GhoommonsateryComponent},
      {path:'destinations/batasia-loop',component:BatasialoopComponent},
      {path:'destinations/himalayan-zoological-park',component:HimalayanzoologicalparkComponent},
      {path:'destinations/happy-valley-tea-estate',component:HappyvalleyteaestateComponent},
      

      {path:'destinations/kurseong',component:KurseongComponent},
      {path:'destinations/kalimpong',component:KalimpongComponent},
      {path:'destinations/ravangla',component:RavanglaComponent},
      {path:'destinations/kaziranga-national-park',component:KazirangaComponent},
      {path:'destinations/majuli-island',component:MajuliislandComponent},
      {path:'destinations/guwahati',component:GuwahaticityComponent},
      {path:'destinations/kamakhya',component:KamakhyatempleComponent},
      {path:'destinations/sivasagar',component:SavasagarComponent},
      {path:'destinations/tezpur',component:TezpurComponent},
      {path:'destinations/shillong',component:ShillongComponent},
      {path:'destinations/cherrapunji',component:CherrapunjiComponent},
      {path:'destinations/mawsynram',component:MawsynramComponent},
      {path:'destinations/dawki',component:DawkiComponent},
      {path:'destinations/umiam-lake',component:UmiamlakeComponent},
      {path:'destinations/laitlum',component:LaitlumcanyonsComponent},
      {path:'destinations/tawang',component:TawangComponent},
      {path:'destinations/zirovalley',component:ZirovalleyComponent},
      {path:'destinations/namdaphanationalpark',component:NamdaphanationalparkComponent},
      {path:'destinations/itanagar',component:ItanagarComponent},
      

      {path:'destinations/bhalukpong',component:BhalukpongComponent},
      {path:'destinations/bomdila',component:BomdilaComponent},
      {path:'destinations/kohima',component:KohimaComponent},
      {path:'destinations/dimapur',component:DimapurComponent},
      {path:'destinations/mokokchung',component:MokokchungComponent},
      {path:'destinations/mon',component:MonComponent},
      {path:'destinations/khonomagreenvillage',component:KhonomagreenvillageComponent},
      {path:'destinations/dzukouvalley',component:DzukouvalleyComponent},

      {path:'airports/guwahatiairport',component:GuwahatiairportComponent},
      {path:'airports/bagdograairport',component:BagdograirportComponent},
      {path:'airports/shillongairport',component:ShillongairportComponent},
      {path:'airports/pakyongairport',component:PakyongairportComponent},
];
