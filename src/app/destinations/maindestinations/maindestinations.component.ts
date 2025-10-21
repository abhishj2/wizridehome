import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, Inject, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-maindestinations',
  standalone: true,
  imports: [],
  templateUrl: './maindestinations.component.html',
  styleUrl: './maindestinations.component.css'
})
export class MaindestinationsComponent implements OnInit, AfterViewInit, OnDestroy {
  
  private cardObserver: IntersectionObserver | null = null;

  // Destinations data
  destinations = [
    {
      title: "Sikkim",
      places: [
        {
          name: "Gangtok",
          img: "https://images.unsplash.com/photo-1707202320239-d543e2661c7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          link: "/destinations/gangtok"
        },
        {
          name: "Namchi",
          img: "https://www.wizzride.com/assets/images/icons/Samdruptse Hill & Statue of Guru Padmasambhava.jpg",
          link: "/destinations/namchi"
        },
        {
          name: "Yuksom",
          img: "https://www.wizzride.com/assets/images/icons/yuksom-cover.jpg",
          link: "/destinations/yuksom"
        },
        {
          name: "Lachung",
          img: "https://www.wizzride.com/assets/images/icons/lachung-cover.jpg",
          link: "/destinations/lachung"
        },
        {
          name: "Tsomgo Lake",
          img: "https://wizzride.com/assets/images_new/destinations/nathula-lake.jpg",
          link: "/destinations/tsomgo_lake"
        },
        {
          name: "Pelling",
          img: "https://www.wizzride.com/assets/images/icons/pelling-cover.jpg",
          link: "/destinations/pelling"
        },
        {
          name: "Nathula Pass",
          img: "https://wizzride.com/nathula-lake.02e500e2c75ade76.jpg",
          link: "/destinations/nathula_pass"
        },
        {
          name: "Rumtek Monastery",
          img: "https://wizzride.com/assets/images_new/destinations/rumtek-view.jpg",
          link: "/destinations/rumtek_monastery"
        },
        {
          name: "Zuluk",
          img: "https://wizzride.com/assets/images_new/destinations/zulukloops.jpg",
          link: "/destinations/zuluk"
        }
      ]
    },
    {
      title: "Darjeeling",
      places: [
        {
          name: "Darjeeling",
          img: "https://wizzride.com/assets/images/icons/Wizzride_Bagdogra_Airport_to_Darjeeling_Route.png?auto=compress&cs=tinysrgb&w=600",
          link: "/destinations/darjeeling"
        },
        {
          name: "Tiger Hill",
          img: "https://wizzride.com/assets/images/icons/tiger-hill.jpg",
          link: "/destinations/tigerhill"
        },
        {
          name: "Ghoom Monastery",
          img: "https://www.wizzride.com/assets/images/icons/Ghoom_Monastery.jpg",
          link: "/destinations/ghoom-monastery"
        },
        {
          name: "Batasia Loop",
          img: "https://www.wizzride.com/assets/images/icons/batasia-loop.jpg",
          link: "/destinations/batasia-loop"
        },
        {
          name: "Himalayan Zoological Park",
          img: "https://www.wizzride.com/assets/images/icons/Himalayan_Zoological_Park.jpg",
          link: "/destinations/himalayan-zoological-park"
        },
        {
          name: "Happy Valley Tea Estate",
          img: "https://www.wizzride.com/assets/images/icons/Happy_Valley_Tea_Estate.jpg",
          link: "/destinations/happy-valley-tea-estate"
        }
      ]
    },
    {
      title: "Assam",
      places: [
        {
          name: "Kaziranga National Park",
          img: "https://www.wizzride.com/assets/images/icons/icons/Kaziranga_Hero.jpg",
          link: "/destinations/kaziranga-national-park"
        },
        {
          name: "Majuli Island",
          img: "https://www.wizzride.com/assets/images/icons/Majuli_Island.jpg",
          link: "/destinations/majuli-island"
        },
        {
          name: "Guwahati City",
          img: "https://www.wizzride.com/assets/images/icons/Guwahati.jpg",
          link: "/destinations/guwahati"
        },
        {
          name: "Kamakhya Temple",
          img: "https://www.wizzride.com/assets/images/icons/Kamakhya.jpg",
          link: "/destinations/kamakhya"
        },
        {
          name: "Sivasagar",
          img: "https://wizzride.com/assets/images_new/destinations/sivasagarboaat.jpeg",
          link: "/destinations/sivasagar"
        },
        {
          name: "Tezpur",
          img: "https://wizzride.com/assets/images/icons/Tezpur.jpg",
          link: "/destinations/tezpur"
        }
      ]
    },
    {
      title: "Meghalaya",
      places: [
        {
          name: "Shillong",
          img: "https://www.wizzride.com/assets/images/icons/Lumdiengjri Peak.jpg",
          link: "/destinations/shillong"
        },
        {
          name: "Cherrapunji",
          img: "https://www.wizzride.com/assets/images/icons/Cherrapunji_Hero.jpg",
          link: "/destinations/cherrapunji"
        },
        {
          name: "Mawsynram",
          img: "https://www.wizzride.com/assets/images/icons/mawsynram-cover.jpg",
          link: "/destinations/mawsynram"
        },
        {
          name: "Dawki",
          img: "https://www.wizzride.com/assets/images/icons/dawki-cover.jpg",
          link: "/destinations/dawki"
        },
        {
          name: "Umiam Lake",
          img: "https://www.wizzride.com/assets/images/icons/Umiam_Lake.jpg",
          link: "/destinations/umiam-lake"
        },
        {
          name: "Laitlum Canyons",
          img: "https://www.wizzride.com/assets/images/icons/laitlum-canyons-cover.jpg",
          link: "/destinations/laitlum"
        }
      ]
    },
    {
      title: "Arunachal Pradesh",
      places: [
        {
          name: "Tawang",
          img: "https://www.wizzride.com/assets/images/icons/tawang-cover.jpg",
          link: "/destinations/tawang"
        },
        {
          name: "Ziro Valley",
          img: "https://wizzride.com/ziro-photography.879c0ae245257b97.jpg",
          link: "/destinations/zirovalley"
        },
        {
          name: "Namdapha National Park",
          img: "https://wizzride.com/namdapha-forest.2b9dae05477a56b5.jpg",
          link: "/destinations/namdaphanationalpark"
        },
        {
          name: "Itanagar",
          img: "http://wizzride.com/Arunachal.edc6adb2c16bc584.jpeg",
          link: "/destinations/itanagar"
        },
        {
          name: "Bhalukpong",
          img: "https://wizzride.com/bhalukpong-nature.b390d3abf2003899.jpg",
          link: "/destinations/bhalukpong"
        },
        {
          name: "Bomdila",
          img: "https://wizzride.com/assets/images_new/destinations/bomdila-viewpoint.57afaa5c667d4515.jpg",
          link: "/destinations/bomdila"
        }
      ]
    },
    {
      title: "Nagaland",
      places: [
        {
          name: "Kohima",
          img: "https://wizzride.com/kohima.3fb979cb315ab2bd.jpg",
          link: "/destinations/kohima"
        },
        {
          name: "Dimapur",
          img: "https://wizzride.com/dimapur-hills.6451ae835475b39d.jpg",
          link: "/destinations/dimapur"
        },
        {
          name: "Mokokchung",
          img: "https://wizzride.com/mokokchung-town-view.7963861e96a4d888.jpg",
          link: "/destinations/mokokchung"
        },
        {
          name: "Mon",
          img: "https://images.unsplash.com/photo-1707202320239-d543e2661c7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzZ8fGdhbmd0b2t8ZW58MHx8MHx8fDA%3D",
          link: "/destinations/mon"
        },
        {
          name: "Khonoma Green Village",
          img: "https://wizzride.com/khonoma-village.65073cc9e3cd341a.webp",
          link: "/destinations/khonomagreenvillage"
        },
        {
          name: "Dzukou Valley",
          img: "https://wizzride.com/dzukou-scenic-view.57aad113f3e15734.jpeg",
          link: "/destinations/dzukouvalley"
        }
      ]
    }
  ];

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/destinations');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Explore Our Destinations | WizzRide – Northeast India Travel");
    this.metaService.updateTag({
      name: 'description',
      content: "From the misty hills of Meghalaya and the serene valleys of Arunachal Pradesh to the tea-scented slopes of Darjeeling, the charming landscapes of Kalimpong, and the breathtaking beauty of Sikkim, Northeast India is a treasure trove of unforgettable experiences."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Explore Our Destinations | WizzRide – Northeast India Travel"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: "Explore Our Destinations | WizzRide – Northeast India Travel" });
    this.metaService.updateTag({ property: 'og:description', content: "From the misty hills of Meghalaya and the serene valleys of Arunachal Pradesh to the tea-scented slopes of Darjeeling, the charming landscapes of Kalimpong, and the breathtaking beauty of Sikkim, Northeast India is a treasure trove of unforgettable experiences." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: "Explore Our Destinations | WizzRide – Northeast India Travel" });
    this.metaService.updateTag({ name: 'twitter:description', content: "From the misty hills of Meghalaya and the serene valleys of Arunachal Pradesh to the tea-scented slopes of Darjeeling, the charming landscapes of Kalimpong, and the breathtaking beauty of Sikkim, Northeast India is a treasure trove of unforgettable experiences." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Destinations",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/destinations"
          }
        }
      ]
    });
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  ngAfterViewInit(): void {
    // Generate dynamic destinations content
    this.generateDestinationsContent();
    
    // Initialize interactive features
    this.initCardObserver();
  }

  ngOnDestroy(): void {
    // Disconnect intersection observer
    if (this.cardObserver) {
      this.cardObserver.disconnect();
    }
  }

  // Generate dynamic destinations content
  private generateDestinationsContent(): void {
    const root = this.elementRef.nativeElement.querySelector('#destinations-root');
    if (!root) return;

    this.destinations.forEach(section => {
      const sectionEl = this.renderer.createElement('section');
      sectionEl.classList.add('destination-section');

      const titleEl = this.renderer.createElement('h2');
      titleEl.className = 'destination-title';
      titleEl.textContent = section.title;
      this.renderer.appendChild(sectionEl, titleEl);

      const grid = this.renderer.createElement('div');
      grid.className = 'destination-grid';

      section.places.forEach(place => {
        const a = this.renderer.createElement('a');
        a.href = place.link;
        a.className = 'destination-card';

        const imgWrap = this.renderer.createElement('div');
        imgWrap.className = 'image-wrapper';

        const img = this.renderer.createElement('img');
        img.src = place.img;
        img.alt = place.name;
        this.renderer.appendChild(imgWrap, img);

        const name = this.renderer.createElement('div');
        name.className = 'destination-link';
        name.textContent = place.name;

        this.renderer.appendChild(a, imgWrap);
        this.renderer.appendChild(a, name);
        this.renderer.appendChild(grid, a);
      });

      this.renderer.appendChild(sectionEl, grid);
      this.renderer.appendChild(root, sectionEl);
    });
  }


  // Card observer for destination cards fade-ins
  private initCardObserver(): void {
    setTimeout(() => {
      this.cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      });

      const destinationCards = this.elementRef.nativeElement.querySelectorAll('.destination-card');
      destinationCards.forEach((card: HTMLElement, index: number) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        card.style.transitionDelay = `${(index % 6) * 0.1}s`;
        this.cardObserver?.observe(card);
      });
    }, 200);
  }


}
