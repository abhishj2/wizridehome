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
          img: "../../../assets/images/destinations/gangtok.jpg",
          link: "/destinations/gangtok"
        },
        {
          name: "Namchi",
          img: "../../../assets/images/destinations/Samdruptse Hill & Statue of Guru Padmasambhava.jpg",
          link: "/destinations/namchi"
        },
        {
          name: "Yuksom",
          img: "../../../assets/images/destinations/yuksom.jpeg",
          link: "/destinations/yuksom"
        },
        {
          name: "Lachung",
          img: "../../../assets/images/destinations/lachung.jpg",
          link: "/destinations/lachung"
        },
        {
          name: "Tsomgo Lake",
          img: "../../../assets/images/destinations/nathula-lake.jpg",
          link: "/destinations/tsomgo_lake"
        },
        {
          name: "Pelling",
          img: "../../../assets/images/destinations/pelling-cover.jpg",
          link: "/destinations/pelling"
        },
        {
          name: "Nathula Pass",
          img: "../../../assets/images/destinations/nathula-lake.jpg",
          link: "/destinations/nathula_pass"
        },
        {
          name: "Rumtek Monastery",
          img: "../../../assets/images/destinations/rumtek-view.jpg",
          link: "/destinations/rumtek_monastery"
        },
        {
          name: "Zuluk",
          img: "../../../assets/images/destinations/zulukloops.jpg",
          link: "/destinations/zuluk"
        },
        {
          name: "Rangpo",
          img: "assets/images/destinations/rangpo.jpg",
          link: "/destinations/rangpo"
        },
        {
          name: "Ravangla",
          img: "assets/images/destinations/borong.jpg",
          link: "/destinations/ravangla"
        }
      ]
    },
    {
      title: "Darjeeling & Kalimpong",
      places: [
        {
          name: "Darjeeling",
          img: "../../../assets/images/destinations/darjeeling.jpg",
          link: "/destinations/darjeeling"
        },
        {
          name: "Tiger Hill",
          img: "../../../assets/images/destinations/Tiger_Hill.jpg",
          link: "/destinations/tigerhill"
        },
        {
          name: "Ghoom Monastery",
          img: "../../../assets/images/destinations/Ghoom_Monastery.jpg",
          link: "/destinations/ghoom-monastery"
        },
        {
          name: "Batasia Loop",
          img: "../../../assets/images/destinations/batasia-loop.jpg",
          link: "/destinations/batasia-loop"
        },
        {
          name: "Himalayan Zoological Park",
          img: "../../../assets/images/destinations/Himalayan_Zoological_Park.jpg",
          link: "/destinations/himalayan-zoological-park"
        },
        {
          name: "Happy Valley Tea Estate",
          img: "../../../assets/images/destinations/Happy_Valley_Tea_Estate.jpg",
          link: "/destinations/happy-valley-tea-estate"
        }, {
          name: "Kurseong",
          img: "../../../assets/images/destinations/kurseong.jpg",
          link: "/destinations/kurseong"
        },
        {
          name: "Kalimpong",
          img: "../../../assets/images/destinations/kalimpong.jpg",
          link: "/destinations/kalimpong"
        }
      ]
    },
    {
      title: "Assam",
      places: [
        {
          name: "Kaziranga National Park",
          img: "../../../assets/images/destinations/Kaziranga_Hero.jpg",
          link: "/destinations/kaziranga-national-park"
        },
        {
          name: "Majuli Island",
          img: "../../../assets/images/destinations/Majuli_Island.jpg",
          link: "/destinations/majuli-island"
        },
        {
          name: "Guwahati City",
          img: "../../../assets/images/destinations/majuliboa.jpeg",
          link: "/destinations/guwahati"
        },
        {
          name: "Kamakhya Temple",
          img: "../../../assets/images/destinations/Kamakhya.jpg",
          link: "/destinations/kamakhya"
        },
        {
          name: "Sivasagar",
          img: "../../../assets/images/destinations/sivasagarboaat.jpeg",
          link: "/destinations/sivasagar"
        },
        {
          name: "Tezpur",
          img: "../../../assets/images/destinations/Tezpur.jpg",
          link: "/destinations/tezpur"
        }
      ]
    },
    {
      title: "Meghalaya",
      places: [
        {
          name: "Shillong",
          img: "../../../assets/images/destinations/LumdiengjriPeak.jpg",
          link: "/destinations/shillong"
        },
        {
          name: "Cherrapunji",
          img: "../../../assets/images/destinations/Cherrapunji_Hero.jpg",
          link: "/destinations/cherrapunji"
        },
        {
          name: "Mawsynram",
          img: "../../../assets/images/destinations/mawsynram-cover.jpg",
          link: "/destinations/mawsynram"
        },
        {
          name: "Dawki",
          img: "../../../assets/images/destinations/mawsynram-cover.jpg",
          link: "/destinations/dawki"
        },
        {
          name: "Umiam Lake",
          img: "../../../assets/images/destinations/Umiam_Lake.jpg",
          link: "/destinations/umiam-lake"
        },
        {
          name: "Laitlum Canyons",
          img: "../../../assets/images/destinations/laitlum-canyons-cover.jpg",
          link: "/destinations/laitlum"
        }
      ]
    },
    {
      title: "Arunachal Pradesh",
      places: [
        {
          name: "Tawang",
          img: "../../../assets/images/destinations/Tawang.jpg",
          link: "/destinations/tawang"
        },
        {
          name: "Ziro Valley",
          img: "../../../assets/images/destinations/ziro-photography.879c0ae245257b97.jpg",
          link: "/destinations/zirovalley"
        },
        {
          name: "Namdapha National Park",
          img: "../../../assets/images/destinations/namdapha-forest.2b9dae05477a56b5.jpg",
          link: "/destinations/namdaphanationalpark"
        },
        {
          name: "Itanagar",
          img: "http://wizzride.com/Arunachal.edc6adb2c16bc584.jpeg",
          link: "/destinations/itanagar"
        },
        {
          name: "Bhalukpong",
          img: "../../../assets/images/destinations/bhalukpong-nature.b390d3abf2003899.jpg",
          link: "/destinations/bhalukpong"
        },
        {
          name: "Bomdila",
          img: "../../../assets/images/destinations/bomdila-viewpoint.57afaa5c667d4515.jpg",
          link: "/destinations/bomdila"
        }
      ]
    },
    {
      title: "Nagaland",
      places: [
        {
          name: "Kohima",
          img: "../../../assets/images/destinations/kohima.3fb979cb315ab2bd.jpg",
          link: "/destinations/kohima"
        },
        {
          name: "Dimapur",
          img: "../../../assets/images/destinations/dimapur-hills.6451ae835475b39d.jpg",
          link: "/destinations/dimapur"
        },
        {
          name: "Mokokchung",
          img: "../../../assets/images/destinations/mokokchung-town-view.7963861e96a4d888.jpg",
          link: "/destinations/mokokchung"
        },
        {
          name: "Mon",
          img: "../../../assets/images/destinations/monbanner.jpeg",
          link: "/destinations/mon"
        },
        {
          name: "Khonoma Green Village",
          img: "../../../assets/images/destinations/khonoma.jpeg",
          link: "/destinations/khonomagreenvillage"
        },
        {
          name: "Dzukou Valley",
          img: "../../../assets/images/destinations/dzukou-scenic-view.57aad113f3e15734.jpeg",
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
