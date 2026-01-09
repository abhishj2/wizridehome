import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Destination {
  name: string;
  link: string;
  arial:string;
}

interface Route {
  name: string;
  link: string;
  arial:string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  // Social Media Links
  socialLinks = [
    { name: 'Facebook', url: 'https://www.facebook.com/wizzride', icon: 'fab fa-facebook-f' },
    { name: 'Instagram', url: 'https://www.instagram.com/wizzride', icon: 'fab fa-instagram' },
    { name: 'Twitter', url: 'https://x.com/wizzride', icon: 'fab fa-twitter' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/wizzridetechnologiesprivatelimited', icon: 'fab fa-linkedin-in' }
  ];

  // Navigation Sections
  ourServices = [
    { name: 'InterCity Ride', link: '/ourservices/intercityrides' },
    { name: 'Local Ride', link: '/ourservices/localrides' },
    { name: 'Holiday & Tour Packages', link: '/ourservices/holidaystours' },
    { name: 'Corporate Events', link: '/ourservices/corporatepackages/' },
    { name: 'Package Delivery', link: '/ourservices/packagedelivery' },
    { name:'Flight Booking',link:'/ourservices/flight-booking'}
  ];

  aboutUs = [
    { name: 'Our Vision', link: '/aboutcompany/ourvision' },
    { name: 'Our Commitment', link: '/aboutcompany/ourcommittment' },
    { name: 'Work Philosophy', link: '/aboutcompany/ourworkphilosophy/' },
    { name: 'Company Overview', link: '/aboutcompany/' }
  ];

  importantLinks = [
    { name: 'Cancellation Policy', link: '/cancellationpolicy' },
    { name: 'Terms & Conditions', link: '/cancellationpolicy/termsandconditions' },
    { name: 'Privacy & Security', link: '/cancellationpolicy/privacypolicy' },
    { name: 'User Agreement', link: '/cancellationpolicy/useragreement' },
    { name: 'Sikkim Permit Guide', link: '/sikkim_permit_guide/' }
  ];

  quickLinks = [
    { name: 'FAQs', link: '/frequentlyaskedquestions' },
    { name: 'Collaborate', link: '/applyforjob/partnerwithus/influencer' },
    { name: 'Cancel Ticket', link: '/cancelticket' },
    { name: 'Apply for a Job', link: '/applyforjob' },
    { name: 'Enroll Your Car', link: '/applyforjob/partnerwithus/' }
  ];

  // Contact Information
  contactInfo = {
    phone: '+91-7478 4938 74',
    customerSupport: 'customersupport@wizzride.com',
    feedback: 'feedback@wizzride.com'
  };

  // Wizzride Routes
  routes = {
    airportShared: {
      title: "Wizzride Airport Routes - Shared Cabs",
      routes: [
        { name: "Bagdogra Airport to Gangtok", link: "/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_to_Gangtok_Shared_Cab_Service",arial:"Book Wizzride Cab Services from  Bagdogra Airport to Gangtok" } as Route,
        { name: "Bagdogra Airport to Darjeeling", link: "/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Darjeeling_Shared_Cab_Service/",arial:"Book Wizzride Cab Services from  Bagdogra Airport to Darjeeling" } as Route,
        { name: "Bagdogra Airport to Kalimpong", link: "/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Kalimpong_Shared_Cab_Service/",arial:"Book Wizzride Cab Services from  Bagdogra Airport to Kalimpong" } as Route,
        { name: "Guwahati Airport to Shillong", link: "/ourservices/Luxury-Shared-Cabs/guwahati-to-shillong/",arial:"Book Wizzride Cab Services from  Guwahati Airport to Shillong" } as Route
      ]
    },
    cityShared: {
      title: "Wizzride City Routes - Shared Cabs",
      routes: [
        { name: "Siliguri to Gangtok", link: "/ourservices/Luxury-Shared-Cabs/Siliguri_To_Gangtok_Shared_Cab_Service/",arial:"Book Wizzride Cab Services from  Siliguri to Gangtok" } as Route,
        { name: "Siliguri to SMIT", link: "/ourservices/Luxury-Shared-Cabs/Siliguri_To_SMIT_Shared_Cab_Service/",arial:"Book Wizzride Cab Services from  Siliguri to SMIT" } as Route,
        { name: "Siliguri to Rangpo", link: "/ourservices/Luxury-Shared-Cabs/Siliguri_To_Rangpo_Shared_Cab_Service/",arial:"Book Wizzride Cab Services from  Siliguri to Rangpo" } as Route,
        { name: "Siliguri to Darjeeling", link: "/ourservices/Luxury-Shared-Cabs/Siliguri_To_Darjeeling_Shared_Cab_Service/",arial:"Book Wizzride Cab Services from  Siliguri to Darjeeling" } as Route,
        { name: "Siliguri to Kurseong", link: "/ourservices/Luxury-Shared-Cabs/Siliguri_To_Kurseong_Shared_Cab_Service/",arial:"Book Wizzride Cab Services from  Siliguri to Kurseong" } as Route,
        { name: "Siliguri to Kalimpong", link: "/ourservices/Luxury-Shared-Cabs/Siliguri_To_Kalimpong_Shared_Cab_Service/", arial:"Book Wizzride Cab Services from  Siliguri to Kalimpong" } as Route,
        { name: "Guwahati to Shillong", link: "/ourservices/Luxury-Shared-Cabs/Guwahati_To_Shillong_Shared_Cab_Service",arial:"Book Wizzride Cab Services from  Guwahati to Shillong" } as Route
      ]
    },
    airportReserved: {
      title: "Wizzride Airport Connectivity - Reserved Cabs",
      routes: [
        { name: "Bagdogra Airport to Sikkim", link: "/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Sikkim_Reserved_Cab_Service/",arial:"Book Wizzride Cab Services from  Bagdogra Airport to Sikkim" } as Route,
        { name: "Bagdogra Airport to Darjeeling", link: "/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Darjeeling_Reserved_Cab_Service/",arial:"Book Wizzride Cab Services from  Bagdogra Airport to Darjeeling" } as Route,
        { name: "Bagdogra Airport to Kalimpong", link: "/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Kalimpong_Reserved_Cab_Service/",arial:"Book Wizzride Cab Services from  Bagdogra Airport to Kalimpong" } as Route,
        { name: "Guwahati Airport to Shillong", link: "/ourservices/Luxury-Reserved-Cabs/Guwahati_Airport_To_Shillong_Reserved_Cab_Service/",arial:"Book Wizzride Cab Services from  Guwahati Airport to Shillong" } as Route,
        { name: "Guwahati To IIM Shillong", link: "/ourservices/Luxury-Reserved-Cabs/IIM-Shillong-to-Guwahati-Airport/",arial:"Book Wizzride Cab Services from  Guwahati To IIM Shillong" } as Route,
        { name: "Guwahati to Tezpur", link: "/ourservices/Luxury-Reserved-Cabs/Guwahati_To_Tezpur_Reserved_Cab_Service/",arial:"Book Wizzride Cab Services from  Guwahati to Tezpur" } as Route,
        { name: "Shillong to Tezpur", link: "/ourservices/Luxury-Reserved-Cabs/Shillong_To_Tezpur_Reserved_Cab_Service/",arial:"Book Wizzride Cab Services from  Shillong to Tezpur" } as Route
      ]
    },
    airportsCovered: {
      title: "Airports Covered",
      routes: [
        { name: "Guwahati Airport", link: "/airports/guwahatiairport/",arial:"Book Wizzride Cab Services from  Guwahati Airport" } as Route,
        { name: "Bagdogra Airport", link: "/airports/bagdograairport/",arial:"Book Wizzride Cab Services from  Bagdogra Airport" } as Route,
        { name: "Shillong Airport", link: "/airports/shillongairport/",arial:"Book Wizzride Cab Services from  Shillong Airport" } as Route,
        { name: "Pakyong Airport", link: "/airports/pakyongairport/",arial:"Book Wizzride Cab Services from  Pakyong Airport" } as Route
      ]
    },
    innerlinepermits:{
      title:'Inner Line Permits',
      route:[
        { name: 'Arunachal Inner Line Permit', link: '/inner-line-permit/arunachal-inner-line-permit',arial:"Arunachal Inner Line Permit" } as Route,
        { name: 'Nagaland Inner Line Permit', link: '/inner-line-permit/nagaland-inner-line-permit',arial:"Nagaland Inner Line Permit" } as Route,
        { name: 'Sikkim Permit Guide', link: '/sikkim_permit_guide',arial:"Sikkim Permit Guide" } as Route
      ]
    }
  };

  // Popular Destinations
  destinations = {
    sikkim: [
      { name: 'Gangtok', link: '/destinations/gangtok', arial:"Book Wizzride Cab Services to  Gangtok" } as Route,
      { name: 'Namchi', link: '/destinations/namchi/', arial:"Book Wizzride Cab Services to  Namchi" } as Route,
      { name: 'Yuksom', link: '/destinations/yuksom/', arial:"Book Wizzride Cab Services to  Yuksom" } as Route,
      { name: 'Lachung', link: '/destinations/lachung/', arial:"Book Wizzride Cab Services to  Lachung" } as Route,
      { name: 'Tsomgo Lake', link: '/destinations/tsomgo_lake', arial:"Book Wizzride Cab Services to  Tsomgo Lake" } as Route,
      { name: 'Pelling', link: '/destinations/pelling/', arial:"Book Wizzride Cab Services to  Pelling" } as Route,
      { name: 'Nathula Pass', link: '/destinations/nathula_pass', arial:"Book Wizzride Cab Services to  Nathula Pass" } as Route,
      { name: 'Rumtek Monastery', link: '/destinations/rumtek_monastery', arial:"Book Wizzride Cab Services to  Rumtek Monastery" } as Route,
      { name: 'Zuluk', link: '/destinations/zuluk',arial:"Book Wizzride Cab Services to  Zuluk" } as Route,
      { name: 'Rangpo', link: '/destinations/rangpo', arial:"Book Wizzride Cab Services to  Rangpo" } as Route,
      {name:'Ravangla',link:'/destinations/ravangla', arial:"Book Wizzride Cab Services to  Ravangla" } as Route,
      {name:'Aritar Lake',link:'/destinations/aritarlake', arial:"Book Wizzride Cab Services to  Aritar Lake" } as Route,
      {name:'Baba Mandir',link:'/destinations/babamandir', arial:"Book Wizzride Cab Services to  Baba Mandir" } as Route,
    ],
    
    darjeeling: [
      { name: 'Darjeeling Town', link: '/destinations/darjeeling/', arial:"Book Wizzride Cab Services to  Darjeeling Town" } as Route,
      { name: 'Tiger Hill', link: '/destinations/tigerhill/' },
      { name: 'Ghoom Monastery', link: '/destinations/ghoom-monastery', arial:"Book Wizzride Cab Services to  Ghoom Monastery" } as Route ,
      { name: 'Batasia Loop', link: '/destinations/batasia-loop/', arial:"Book Wizzride Cab Services to  Batasia Loop" } as Route,
      { name: 'Himalayan Zoological Park', link: '/destinations/himalayan-zoological-park/', arial:"Book Wizzride Cab Services to  Himalayan Zoological Park" } as Route,
      { name: 'Happy Valley Tea Estate', link: '/destinations/happy-valley-tea-estate/', arial:"Book Wizzride Cab Services to  Happy Valley Tea Estate" } as Route,
      {name:'Kurseong',link:'destinations/kurseong', arial:"Book Wizzride Cab Services to  Kurseong" } as Route,
      {name:'Kalimpong',link:'destinations/kalimpong', arial:"Book Wizzride Cab Services to  Kalimpong" } as Route,
    ],
    assam: [
      { name: 'Kaziranga National Park', link: '/destinations/kaziranga-national-park', arial:"Book Wizzride Cab Services to  Kaziranga National Park" } as Route,
      { name: 'Majuli Island', link: '/destinations/majuli-island', arial:"Book Wizzride Cab Services to  Majuli Island" } as Route,
      { name: 'Guwahati City', link: '/destinations/guwahati' },
      { name: 'Kamakhya Temple', link: '/destinations/kamakhya', arial:"Book Wizzride Cab Services to  Kamakhya Temple" } as Route,
      { name: 'Sivasagar', link: '/destinations/sivasagar' },
      { name: 'Tezpur', link: '/destinations/tezpur', arial:"Book Wizzride Cab Services to  Tezpur" } as Route,
    ],
    meghalaya: [
      { name: 'Shillong', link: '/destinations/shillong/', arial:"Book Wizzride Cab Services to  Shillong" } as Route ,
      { name: 'Cherrapunji', link: '/destinations/cherrapunji/', arial:"Book Wizzride Cab Services to  Cherrapunji" } as Route,
      { name: 'Mawsynram', link: '/destinations/mawsynram/', arial:"Book Wizzride Cab Services to  Mawsynram" } as Route,
      { name: 'Dawki', link: '/destinations/dawki', arial:"Book Wizzride Cab Services to  Dawki" } as Route,
      { name: 'Umiam Lake', link: '/destinations/umiam-lake/', arial:"Book Wizzride Cab Services to  Umiam Lake" } as Route,
      { name: 'Laitlum Canyons', link: '/destinations/laitlum', arial:"Book Wizzride Cab Services to  Laitlum Canyons" } as Route,
      {name:'Wards Lake',link:'destinations/wards-lake-shillong', arial:"Book Wizzride Cab Services to  Wards Lake" } as Route
    ],
    arunachalPradesh: [
      { name: 'Tawang', link: '/destinations/tawang', arial:"Book Wizzride Cab Services to  Tawang" } as Route  ,
      { name: 'Ziro Valley', link: '/destinations/zirovalley', arial:"Book Wizzride Cab Services to  Ziro Valley" } as Route,
      { name: 'Namdapha National Park', link: '/destinations/namdaphanationalpark', target: '_blank', arial:"Book Wizzride Cab Services to  Namdapha National Park" } as Route,
      { name: 'Itanagar', link: '/destinations/itanagar', arial:"Book Wizzride Cab Services to  Itanagar" } as Route,
      { name: 'Bhalukpong', link: '/destinations/bhalukpong', arial:"Book Wizzride Cab Services to  Bhalukpong" } as Route,
      { name: 'Bomdila', link: '/destinations/bomdila', arial:"Book Wizzride Cab Services to  Bomdila" } as Route
    ],
    nagaland: [
      { name: 'Kohima', link: '/destinations/kohima', arial:"Book Wizzride Cab Services to  Kohima" } as Route,
      { name: 'Dimapur', link: '/destinations/dimapur', arial:"Book Wizzride Cab Services to  Dimapur" } as Route,
      { name: 'Mokokchung', link: '/destinations/mokokchung', arial:"Book Wizzride Cab Services to  Mokokchung" } as Route,
      { name: 'Mon', link: '/destinations/mon', arial:"Book Wizzride Cab Services to  Mon" } as Route,
      { name: 'Khonoma Green Village', link: '/destinations/khonomagreenvillage', arial:"Book Wizzride Cab Services to  Khonoma Green Village" } as Route,
      { name: 'Dzukou Valley', link: '/destinations/dzukouvalley', arial:"Book Wizzride Cab Services to  Dzukou Valley" } as Route
    ]
  };
}
