import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Destination {
  name: string;
  link: string;
}

interface Route {
  name: string;
  link: string;
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
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/wizzride', icon: 'fab fa-linkedin-in' }
  ];

  // Navigation Sections
  ourServices = [
    { name: 'InterCity Ride', link: '/ourservices/intercityrides' },
    { name: 'Local Ride', link: '/ourservices/localrides' },
    { name: 'Holiday & Tour Packages', link: '/ourservices/holidaystours' },
    { name: 'Corporate Events', link: '/ourservices/corporatepackages/' },
    { name: 'Package Delivery', link: '/ourservices/packagedelivery' }
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
    { name: 'Collaborate', link: '/influencerapply/' },
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
        { name: "Bagdogra Airport to Gangtok", link: "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Bagdogra%20Airport%20to%20Gangtok%20-%20Shared%20Cab%20Service/" } as Route,
        { name: "Bagdogra Airport to Darjeeling", link: "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Darjeeling_Shared_Cab_Service/" } as Route,
        { name: "Bagdogra Airport to Kalimpong", link: "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Kalimpong_Shared_Cab_Service/" } as Route,
        { name: "Guwahati Airport to Shillong", link: "https://wizzride.com/ourservices/Luxury-Shared-Cabs/guwahati-to-shillong/" } as Route
      ]
    },
    cityShared: {
      title: "Wizzride City Routes - Shared Cabs",
      routes: [
        { name: "Siliguri to Gangtok", link: "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Gangtok_Shared_Cab_Service/" },
        { name: "Siliguri to SMIT", link: "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_SMIT_Shared_Cab_Service/" },
        { name: "Siliguri to Rangpo", link: "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Rangpo_Shared_Cab_Service/" },
        { name: "Siliguri to Darjeeling", link: "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Darjeeling_Shared_Cab_Service/" },
        { name: "Siliguri to Kurseong", link: "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Kurseong_Shared_Cab_Service/" },
        { name: "Siliguri to Kalimpong", link: "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Kalimpong_Shared_Cab_Service/" }
      ]
    },
    airportReserved: {
      title: "Wizzride Airport Connectivity - Reserved Cabs",
      routes: [
        { name: "Bagdogra Airport to Sikkim", link: "https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Sikkim_Reserved_Cab_Service/" },
        { name: "Bagdogra Airport to Darjeeling", link: "https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Darjeeling_Reserved_Cab_Service/" },
        { name: "Bagdogra Airport to Kalimpong", link: "https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Kalimpong_Reserved_Cab_Service/" },
        { name: "Guwahati Airport to Shillong", link: "https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Guwahati_Airport_To_Shillong_Reserved_Cab_Service/" },
        { name: "Guwahati To IIM Shillong", link: "https://wizzride.com/ourservices/Luxury-Reserved-Cabs/IIM-Shillong-to-Guwahati-Airport/" },
        { name: "Guwahati to Tezpur", link: "https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Guwahati_To_Tezpur_Reserved_Cab_Service/" },
        { name: "Shillong to Tezpur", link: "https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Shillong_To_Tezpur_Reserved_Cab_Service/" }
      ]
    },
    airportsCovered: {
      title: "Airport Covered",
      routes: [
        { name: "Guwahati Airport", link: "/airports/guwahatiairport/" },
        { name: "Bagdogra Airport", link: "/airports/bagdograairport/" },
        { name: "Shillong Airport", link: "/airports/shillongairport/" },
        { name: "Pakyong Airport", link: "/airports/pakyongairport/" }
      ]
    }
  };

  // Popular Destinations
  destinations = {
    sikkim: [
      { name: 'Gangtok', link: '/destinations/gangtok' },
      { name: 'Namchi', link: '/destinations/namchi/' },
      { name: 'Yuksom', link: '/destinations/yuksom/' },
      { name: 'Lachung', link: '/destinations/lachung/' },
      { name: 'Tsomgo Lake', link: '/destinations/tsomgo_lake' },
      { name: 'Pelling', link: '/destinations/pelling/' },
      { name: 'Nathula Pass', link: '/destinations/nathula_pass' },
      { name: 'Rumtek Monastery', link: '/destinations/rumtek_monastery' },
      { name: 'Zuluk', link: '/destinations/zuluk' },
      { name: 'Rangpo', link: '/destinations/rangpo' },
      {name:'Ravangla',link:'/destinations/ravangla'},
    ],
    darjeeling: [
      { name: 'Darjeeling Town', link: '/destinations/darjeeling/' },
      { name: 'Tiger Hill', link: '/destinations/tigerhill/' },
      { name: 'Ghoom Monastery', link: '/destinations/ghoom-monastery' },
      { name: 'Batasia Loop', link: '/destinations/batasia-loop/' },
      { name: 'Himalayan Zoological Park', link: '/destinations/himalayan-zoological-park/' },
      { name: 'Happy Valley Tea Estate', link: '/destinations/happy-valley-tea-estate/' },
      {name:'Kurseong',link:'destinations/kurseong'},
      {name:'Kalimpong',link:'destinations/kalimpong'},
    ],
    assam: [
      { name: 'Kaziranga National Park', link: '/destinations/kaziranga-national-park' },
      { name: 'Majuli Island', link: '/destinations/majuli-island' },
      { name: 'Guwahati City', link: '/destinations/guwahati' },
      { name: 'Kamakhya Temple', link: '/destinations/kamakhya' },
      { name: 'Sivasagar', link: '/destinations/sivasagar' },
      { name: 'Tezpur', link: '/destinations/tezpur' }
    ],
    meghalaya: [
      { name: 'Shillong', link: '/destinations/shillong/' },
      { name: 'Cherrapunji', link: '/destinations/cherrapunji/' },
      { name: 'Mawsynram', link: '/destinations/mawsynram/' },
      { name: 'Dawki', link: '/destinations/dawki' },
      { name: 'Umiam Lake', link: '/destinations/umiam-lake/' },
      { name: 'Laitlum Canyons', link: '/destinations/laitlum'}
    ],
    arunachalPradesh: [
      { name: 'Tawang', link: '/destinations/tawang'},
      { name: 'Ziro Valley', link: '/destinations/zirovalley'},
      { name: 'Namdapha National Park', link: '/destinations/namdaphanationalpark', target: '_blank' },
      { name: 'Itanagar', link: '/destinations/itanagar'},
      { name: 'Bhalukpong', link: '/destinations/bhalukpong'},
      { name: 'Bomdila', link: '/destinations/bomdila'}
    ],
    nagaland: [
      { name: 'Kohima', link: '/destinations/kohima'},
      { name: 'Dimapur', link: '/destinations/dimapur' },
      { name: 'Mokokchung', link: '/destinations/mokokchung' },
      { name: 'Mon', link: '/destinations/mon' },
      { name: 'Khonoma Green Village', link: '/destinations/khonomagreenvillage'},
      { name: 'Dzukou Valley', link: '/destinations/dzukouvalley' }
    ]
  };
}
