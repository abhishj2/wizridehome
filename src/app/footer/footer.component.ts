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
    { name: 'Local Ride', link: 'https://wizzride.com/ourservices/localrides/' },
    { name: 'Holiday & Tour Packages', link: 'https://wizzride.com/ourservices/holidaystours/' },
    { name: 'Corporate Events', link: 'https://wizzride.com/ourservices/corporatepackages/' },
    { name: 'Package Delivery', link: 'https://wizzride.com/ourservices/packagedelivery' }
  ];

  aboutUs = [
    { name: 'Our Vision', link: 'https://wizzride.com/aboutcompany/ourvision' },
    { name: 'Our Commitment', link: 'https://wizzride.com/aboutcompany/ourcommittment' },
    { name: 'Work Philosophy', link: 'https://wizzride.com/aboutcompany/ourworkphilosophy/' },
    { name: 'Company Overview', link: 'https://wizzride.com/aboutcompany/' }
  ];

  importantLinks = [
    { name: 'Cancellation Policy', link: 'https://wizzride.com/cancellationpolicy/' },
    { name: 'Terms & Conditions', link: 'https://wizzride.com/cancellationpolicy/termsandconditions' },
    { name: 'Privacy & Security', link: 'https://wizzride.com/cancellationpolicy/privacypolicy' },
    { name: 'User Agreement', link: 'https://wizzride.com/cancellationpolicy/useragreement' },
    { name: 'Sikkim Permit Guide', link: 'https://wizzride.com/sikkim_permit_guide/' }
  ];

  quickLinks = [
    { name: 'FAQs', link: 'https://wizzride.com/frequentlyaskedquestions' },
    { name: 'Collaborate', link: 'https://wizzride.com/influencerapply/' },
    { name: 'Cancel Ticket', link: 'https://wizzride.com/cancelticket' },
    { name: 'Apply for a Job', link: 'https://wizzride.com/applyforjob' },
    { name: 'Enroll Your Car', link: 'https://wizzride.com/applyforjob/partnerwithus/' }
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
        { name: "Guwahati Airport", link: "https://wizzride.com/airports/guwahatiairport/" },
        { name: "Bagdogra Airport", link: "https://wizzride.com/airports/bagdograairport/" },
        { name: "Shillong Airport", link: "https://wizzride.com/airports/shillongairport/" },
        { name: "Pakyong Airport", link: "https://wizzride.com/airports/pakyongairport/" }
      ]
    }
  };

  // Popular Destinations
  destinations = {
    sikkim: [
      { name: 'Gangtok', link: 'https://wizzride.com/destinations/gangtok' },
      { name: 'Namchi', link: 'https://wizzride.com/destinations/namchi/' },
      { name: 'Yuksom', link: 'https://wizzride.com/destinations/yuksom/' },
      { name: 'Lachung', link: 'https://wizzride.com/destinations/lachung/' },
      { name: 'Tsomgo Lake', link: 'https://wizzride.com/destinations/tsomgo_lake' },
      { name: 'Pelling', link: 'https://wizzride.com/destinations/pelling/' },
      { name: 'Nathula Pass', link: 'https://wizzride.com/destinations/nathula_pass' },
      { name: 'Rumtek Monastery', link: 'https://wizzride.com/destinations/rumtek_monastery' }
    ],
    darjeeling: [
      { name: 'Darjeeling Town', link: 'https://wizzride.com/destinations/darjeeling/' },
      { name: 'Tiger Hill', link: 'https://wizzride.com/destinations/tigerhill/' },
      { name: 'Ghoom Monastery', link: 'https://wizzride.com/destinations/ghoom-monastery' },
      { name: 'Batasia Loop', link: 'https://wizzride.com/destinations/batasia-loop/' },
      { name: 'Himalayan Zoological Park', link: 'https://wizzride.com/destinations/himalayan-zoological-park/' },
      { name: 'Happy Valley Tea Estate', link: 'https://wizzride.com/destinations/happy-valley-tea-estate/' }
    ],
    assam: [
      { name: 'Kaziranga National Park', link: 'https://wizzride.com/destinations/kaziranga-national-park' },
      { name: 'Majuli Island', link: 'https://wizzride.com/destinations/majuli-island' },
      { name: 'Guwahati City', link: 'https://wizzride.com/destinations/guwahati' },
      { name: 'Kamakhya Temple', link: 'https://wizzride.com/destinations/kamakhya' },
      { name: 'Sivasagar', link: 'https://wizzride.com/destinations/kamakhya/sivasagar' },
      { name: 'Tezpur', link: 'https://wizzride.com/destinations/tezpur' }
    ],
    meghalaya: [
      { name: 'Shillong', link: 'https://wizzride.com/destinations/shillong/' },
      { name: 'Cherrapunji', link: 'https://wizzride.com/destinations/cherrapunji/' },
      { name: 'Mawsynram', link: 'https://wizzride.com/destinations/mawsynram/' },
      { name: 'Dawki', link: 'https://wizzride.com/destinations/dawki' },
      { name: 'Umiam Lake', link: 'https://wizzride.com/destinations/umiam-lake/' },
      { name: 'Laitlum Canyons', link: 'https://wizzride.com/destinations/laitlum'}
    ],
    arunachalPradesh: [
      { name: 'Tawang', link: 'https://wizzride.com/destinations/tawang'},
      { name: 'Ziro Valley', link: 'https://wizzride.com/destinations/zirovalley'},
      { name: 'Namdapha National Park', link: 'https://wizzride.com/destinations/namdaphanationalpark', target: '_blank' },
      { name: 'Itanagar', link: 'https://wizzride.com/destinations/itanagar'},
      { name: 'Bhalukpong', link: 'https://wizzride.com/destinations/bhalukpong'},
      { name: 'Bomdila', link: 'https://wizzride.com/destinations/bomdila'}
    ],
    nagaland: [
      { name: 'Kohima', link: 'https://wizzride.com/destinations/kohima'},
      { name: 'Dimapur', link: 'https://wizzride.com/destinations/dimapur' },
      { name: 'Mokokchung', link: 'https://wizzride.com/destinations/mokokchung' },
      { name: 'Mon', link: 'https://wizzride.com/destinations/mon' },
      { name: 'Khonoma Green Village', link: 'https://wizzride.com/destinations/khonomagreenvillage'},
      { name: 'Dzukou Valley', link: 'https://wizzride.com/destinations/dzukouvalley' }
    ]
  };
}
