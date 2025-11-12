import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, Inject, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../services/seo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface JapanMoment {
  author: string;
  authorInitial: string;
  story: string;
}

interface Activity {
  time: string;
  title: string;
  description: string;
  images?: string[];
}

interface Day {
  title: string;
  activities: Activity[];
}

@Component({
  selector: 'app-japantour',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './japantour.component.html',
  styleUrl: './japantour.component.css'
})
export class JapantourComponent implements OnInit, AfterViewInit, OnDestroy {
  enquiryFormData = {
    fullName: '',
    contactNo: '',
    emailId: '',
    fromCity: '',
    message: ''
  };

  // Hero Video
  heroVideoSrc: string = 'assets/videos/JapanVideo.mp4';
  heroImageFallback: string = 'assets/images/japan.jpg';

  // Activity Image Slider Tracking
  activityImageIndices: { [key: string]: number } = {};

  // Read More/Less tracking for Japan Moments
  expandedMoments: { [key: number]: boolean } = {};
  readonly maxStoryLength = 200; // Characters to show before "Read More"

  japanMoments: JapanMoment[] = [
    {
      author: 'Alexandre Mercier',
      authorInitial: 'AM',
      story: 'So one day I went a little bit overboard with whiskey and had to take the train from Shin-Otsuka all the way to Midorigaoka. I may or may not have missed the last train and I may or may not have passed out in the train station. Long story short I woke up in my bed. I checked if I had my phone, my keys and my purse. Everything was there. I then checked my inner pocket in my jacket which seemed a little heavier than usual. I found a receipt of a taxi and some coins. Wait, really? As I keep a strict budget, I checked how much money I had left on my purse and how much money was on my budget app minus the taxi fare. It matched !! As I passed out, the taxi driver took some paper money in my purse inside my jacket, put the change in my pocket and left me home. Only in Japan.'
    },
    {
      author: 'Michael Schrader',
      authorInitial: 'MS',
      story: 'I went into a McDonald\'s in Japan (Don\'t judge, I\'m not proud of it) and was carrying a shirt and pants to change into prior to a business meeting. The shirt and pants were folded, but weren\'t in any kind of bag. As one employee handed me my food, another signaled for me to hand them my clothes. They proceeded to bag them so they would be easier to carry. As if that wasn\'t enough, about five minutes after sitting down with my food, I proceeded to spill my Mountain Dew (again, I\'m not proud of it). A small army of workers immediately rushed out to wipe down the seat, the floor, the table, and even my shirt. It was remarkable. It is an amazingly kind and generous country.'
    },
    {
      author: 'Sze Yao Tan',
      authorInitial: 'SY',
      story: 'I was waiting at a traffic light to cross the road with Haruki, a Japanese friend. It was a lazy Sunday afternoon in a small town on the Tokyo outskirts and there was not a vehicle or soul in sight. So I turned to Haruki and said, "Hey, I know it\'s a red man but should we just cross?" Haruki looked at me and shook his head. "No, we wait for the green man." I was a bit perplexed - it did not seem to me that it would make any difference whether we waited or not. "There aren\'t any cars. Why do we need to wait?" Haruki smiled, then asked me a question in return: "What if a child is watching?"'
    },
    {
      author: 'Kaushal',
      authorInitial: 'K',
      story: 'In JAPAN, there is NO TEACHER\'S DAY... Once I asked my Japanese colleague, Teacher Yamamoto: When do you celebrate Teachers\' Day in Japan, and how do you observe it? Surprised by my question, he replied: We don\'t have any Teachers\' Day celebration. Hearing his response, I didn\'t know whether to believe him or not. I wondered, \'Why does a country with a developed economy, science, and technology show such a lack of respect for teachers and their work?\' One day after work, Yamamoto invited me to his home. Since he lived far from the school, we took the subway. The subway cars were crowded during the evening rush hour. I managed to squeeze in and stood, holding onto the handrails tightly. Suddenly, an elderly man sitting next to me offered his seat. Not understanding such respectful behavior from the older man, I couldn\'t accept his offer, but he insisted, and I had to sit. After leaving the subway, I asked Yamamoto to explain the elder\'s action. Yamamoto smiled and pointed to my teacher\'s badge, saying: This old man saw your teacher\'s badge and offered his seat as a sign of respect for your status. Since it was my first time visiting Teacher Yamamoto, I felt uncomfortable going empty-handed, so I decided to buy a gift. I shared my thoughts with Yamamoto, and he supported me, saying that there\'s a store for teachers ahead where you can buy items at discounted prices. Are these discounts only for teachers? - I asked. Confirming my words, Yamamoto said: In Japan, a teacher is the most respected profession, the most respected person. Japanese entrepreneurs are delighted when teachers visit their stores; they consider it an honor. During my time in Japan, I repeatedly saw how Japanese people deeply respect teachers. There are separate seats for them on the subway, dedicated stores, and teachers don\'t wait in line for tickets on any form of transportation. Why do Japanese teachers need a separate holiday when every day of their lives is like a celebration? As I retell this story, I wholeheartedly wish for our society to grow to such a level of reverence for teachers, and for teachers to be worthy of such a high title!'
    }
  ];

  itineraryDays: Day[] = [
    {
      title: 'Day 01',
      activities: [
        {
          time: '08:00 AM',
          title: 'Transfer from Airport to Hotel at Tokyo',
          description: 'Welcome to Japan! Upon arrival in Tokyo International Airport, you will be met by our friendly Tour guide. From there you would be transferred in a Private coach to your hotel. The rest of the day is free to relax after a long flight. Overnight in Tokyo.'
        },
        {
          time: '8:00 AM - 10:00 AM',
          title: 'Breakfast at Hotel',
          description: 'Enjoy breakfast at the hotel or partake in any arrangements provided by the company.'
        },
        {
          time: '9:30 AM - 11:30 AM',
          title: 'Visit Tokyo Imperial Palace and East Gardens',
          description: 'The Tokyo Imperial Palace is the primary residence of the Emperor of Japan, located on the site of the former Edo Castle. The palace complex is surrounded by walls and moats, covering approximately 1.15 square kilometers (0.44 square miles). The Kyūden (宮殿) is the main building where the Emperor conducts official duties and ceremonies. The East Gardens (東御苑, Higashi-gyoen) are a public area offering a serene escape with traditional Japanese gardens, ponds, bridges, and historic structures. The gardens include areas like Honmaru, Ninomaru, and Sannomaru, with the Ninomaru Garden featuring a pond, islands, and teahouses. The Fujimi yagura offers panoramic views of the palace grounds.',
          images: [
            'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1578637381404-fb7f3c6d8d5c?w=800&h=600&fit=crop'
          ]
        }
      ]
    },
    {
      title: 'Day 02',
      activities: [
        {
          time: 'Full Day',
          title: 'Full Day Tokyo City Tour',
          description: 'After breakfast, proceed for a full day Tokyo city tour. Visit Senso-ji Temple (Asakusa Kannon Temple), Tokyo Skytree (from outside), Imperial Palace (from outside), Shibuya Crossing, and Harajuku. Enjoy lunch at a local restaurant. Return to hotel in the evening. Overnight stay in Tokyo.'
        }
      ]
    },
    {
      title: 'Day 03',
      activities: [
        {
          time: 'Morning',
          title: 'Transfer to Hakone & Mt. Fuji Tour',
          description: 'After breakfast, check out from hotel and transfer to Hakone. Enjoy a scenic tour of Hakone including Lake Ashi cruise and ropeway ride (weather permitting). Visit Mt. Fuji 5th Station (subject to weather conditions). Check-in at hotel in Hakone. Overnight stay in Hakone.',
          images: [
            'https://images.unsplash.com/photo-1578637381404-fb7f3c6d8d5c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=600&fit=crop'
          ]
        }
      ]
    },
    {
      title: 'Day 04',
      activities: [
        {
          time: 'Morning',
          title: 'Transfer to Kyoto via Bullet Train',
          description: 'After breakfast, check out from hotel. Transfer to Odawara station and board the Bullet Train (Shinkansen) to Kyoto. Arrive at Kyoto station and transfer to hotel. Check-in and rest. In the afternoon, visit Fushimi Inari Shrine famous for its thousands of vermilion torii gates. Overnight stay in Kyoto.'
        }
      ]
    },
    {
      title: 'Day 05',
      activities: [
        {
          time: 'Full Day',
          title: 'Full Day Kyoto City Tour',
          description: 'After breakfast, proceed for a full day Kyoto city tour. Visit Kinkaku-ji (Golden Pavilion), Kiyomizu-dera Temple, Arashiyama Bamboo Grove, and Gion District (famous Geisha district). Enjoy traditional Japanese lunch. Return to hotel in the evening. Overnight stay in Kyoto.'
        }
      ]
    },
    {
      title: 'Day 06',
      activities: [
        {
          time: 'Morning',
          title: 'Transfer to Nara & Visit Todaiji Temple',
          description: 'After breakfast, transfer to Nara (approximately 1 hour). Visit Todaiji Temple, home to the world\'s largest bronze statue of Buddha. The temple is a UNESCO World Heritage site and represents the grandeur and skill of ancient Japanese craftsmanship. Todaiji\'s historical and cultural significance extends beyond its architectural marvels. It played a crucial role in the spread of Buddhism in Japan and served as the head temple of all provincial Buddhist temples. The temple complex includes various other significant buildings, such as the Nandaimon (Great South Gate), which features two imposing statues of Nio guardians, and the Nigatsu-do and Sangatsu-do halls, known for their cultural treasures and annual rituals. As a UNESCO World Heritage site, Todaiji not only embodies the spiritual and cultural heritage of Japan but also stands as a testament to the country\'s architectural and artistic achievements. Visiting Todaiji offers a profound glimpse into Japan\'s rich history and religious traditions, making it an essential destination for travelers.',
          images: [
            'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1578637381404-fb7f3c6d8d5c?w=800&h=600&fit=crop'
          ]
        },
        {
          time: '12:00 PM - 1:00 PM',
          title: 'Lunch Nearby',
          description: 'Enjoy lunch at a nearby restaurant.'
        },
        {
          time: '1:30 PM - 2:30 PM',
          title: 'Transfer to Osaka City & Check-in at Hotel',
          description: 'Transfer to Osaka City and check-in at hotel.'
        },
        {
          time: '4:00 PM - 6:00 PM',
          title: 'Visit Osaka Castle',
          description: 'Osaka Castle is one of Japan\'s most famous landmarks, offering visitors a fascinating glimpse into the country\'s rich history and culture. Originally built in 1583 by Toyotomi Hideyoshi, a key figure in Japan\'s unification, the castle has played a significant role in various historical events, including the Siege of Osaka. The castle\'s striking main tower, surrounded by moats and impressive stone walls, stands as a testament to the architectural ingenuity of the time. Visiting Osaka Castle provides an opportunity to explore its expansive grounds, which include beautifully landscaped gardens, such as the Nishinomaru Garden, offering spectacular views of the castle tower against a backdrop of cherry blossoms in spring. The castle\'s interior has been transformed into a modern museum, showcasing a vast collection of historical artifacts, samurai armor, and informative displays detailing the castle\'s storied past. The observation deck at the top of the main tower offers panoramic views of Osaka, allowing visitors to appreciate the city\'s blend of historical and modern elements. The castle grounds are also a hub for cultural events and festivals, providing a vibrant atmosphere throughout the year. Overall, Osaka Castle is a must-visit destination for history enthusiasts, architecture lovers, and anyone looking to experience the cultural heritage of Japan. Its blend of historical significance, architectural beauty, and cultural activities makes it a highlight of any visit to Osaka.',
          images: [
            'https://images.unsplash.com/photo-1578637381404-fb7f3c6d8d5c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop'
          ]
        },
        {
          time: '6:00 PM - 8:00 PM',
          title: 'Visit Dotonbori, Osaka',
          description: 'Dotonbori, located in Osaka, is a must-visit destination for anyone traveling to Japan. This vibrant entertainment district is famous for its lively atmosphere, neon lights, and diverse culinary offerings. As you stroll along the Dotonbori Canal, you\'ll be captivated by the bright, animated billboards, including the iconic Glico Running Man and the giant Kani Doraku crab sign, which have become symbols of the area. Dotonbori is a food lover\'s paradise, offering an array of delicious street food and local delicacies. From takoyaki (octopus balls) and okonomiyaki (savory pancakes) to kushikatsu (deep-fried skewers) and fugu (pufferfish), the district is renowned for its diverse and mouth-watering cuisine. The numerous restaurants and food stalls ensure that visitors can indulge in Osaka\'s culinary delights at any time of day. The area is also home to a variety of entertainment options, including theaters, bars, and shops, making it a bustling hub of activity both day and night. The nearby Dotonbori Arcade offers a unique shopping experience with its eclectic mix of stores. Visiting Dotonbori allows travelers to experience the vibrant energy and rich culinary culture of Osaka. Whether you\'re savoring local dishes, exploring the bustling streets, or enjoying the dazzling lights along the canal, Dotonbori promises an unforgettable and immersive experience that captures the essence of Osaka\'s lively spirit.'
        },
        {
          time: '8:00 PM',
          title: 'Return to Hotel',
          description: 'Return to your hotel in Osaka.'
        }
      ]
    },
    {
      title: 'Day 07',
      activities: [
        {
          time: '7:00 AM - 8:00 AM',
          title: 'Breakfast at Hotel',
          description: 'Enjoy breakfast at the hotel or partake in any arrangements provided by the company.'
        },
        {
          time: 'Full Day',
          title: 'Full Day Excursion to Hiroshima',
          description: 'Visit Peace Park, Memorial Museum and Atomic Bomb Dome at Hiroshima. Hiroshima Peace Memorial Park, Memorial Museum, and Atomic Bomb Dome are profound symbols of the impact of nuclear warfare and the enduring hope for global peace. Located in Hiroshima, Japan, the park was established to honor the victims of the atomic bomb dropped on the city on August 6, 1945, and to advocate for the abolition of nuclear weapons. The Atomic Bomb Dome, originally the Hiroshima Prefectural Industrial Promotion Hall, is the most iconic structure in the park. Left in its ruined state, it serves as a stark reminder of the destruction caused by the bomb and stands as a powerful symbol of resilience and peace. Designated as a UNESCO World Heritage site, it is a place of reflection and a poignant reminder of the need for nuclear disarmament. The Hiroshima Peace Memorial Museum, located within the park, provides a comprehensive and moving account of the events leading up to, during, and after the bombing. Exhibits include personal artifacts, photographs, and testimonies from survivors, offering a deeply human perspective on the tragedy. The museum aims to educate visitors about the horrors of nuclear warfare and to promote a message of peace. The park itself is a serene space, featuring various memorials and monuments, such as the Cenotaph for A-bomb Victims and the Children\'s Peace Monument. It offers a place for contemplation and prayer, with thousands of paper cranes left by visitors symbolizing wishes for peace. Visiting Hiroshima Peace Memorial Park, Memorial Museum, and Atomic Bomb Dome provides a powerful, emotional experience that underscores the importance of striving for a world free from the threat of nuclear war.'
        },
        {
          time: 'Evening',
          title: 'Return to Osaka',
          description: 'Return to Osaka Hotel and overnight in Osaka.'
        }
      ]
    },
    {
      title: 'Day 08',
      activities: [
        {
          time: 'Departure',
          title: 'Transfer to Kansai Airport, Osaka',
          description: 'Transfer to Kansai Airport, Osaka to catch the return flight back.'
        }
      ]
    }
  ];

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private seoService: SeoService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/japantour');
    
    // SEO Metadata
    this.titleService.setTitle('Japan Tour Package - 8 Days Tokyo Hakone Kyoto Hiroshima Osaka | Wizzride');
    this.metaService.updateTag({
      name: 'description',
      content: 'Experience Japan in its Most Mystical Autumn Season. 8 Days Tour of Tokyo - Hakone - Mt. Fuji - Kyoto - Hiroshima - Osaka. Tour Start Date: 31st August, 2024. Limited Seats Only. Cost To Cost Deal.'
    });
    this.metaService.updateTag({
      name: 'title',
      content: 'Japan Tour Package - 8 Days Tokyo Hakone Kyoto Hiroshima Osaka | Wizzride'
    });
    this.metaService.updateTag({
      name: 'keywords',
      content: 'Japan tour, Japan tour package, Tokyo tour, Kyoto tour, Hiroshima tour, Osaka tour, Japan travel, Japan holiday package, Mount Fuji tour, Japan autumn tour'
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Japan Tour Package - 8 Days Tokyo Hakone Kyoto Hiroshima Osaka | Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: 'Experience Japan in its Most Mystical Autumn Season. 8 Days Tour of Tokyo - Hakone - Mt. Fuji - Kyoto - Hiroshima - Osaka. Tour Start Date: 31st August, 2024.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/japantour' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/Wizzride-Japan-Holiday-Package.png' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Japan Tour Package - 8 Days Tokyo Hakone Kyoto Hiroshima Osaka | Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Experience Japan in its Most Mystical Autumn Season. 8 Days Tour of Tokyo - Hakone - Mt. Fuji - Kyoto - Hiroshima - Osaka.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/Wizzride-Japan-Holiday-Package.png' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // BreadcrumbList JSON-LD
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
          "name": "Japan Tour",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/japantour"
          }
        }
      ]
    });

    // Organization JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": ["Organization", "TravelAgency"],
      "name": "Wizzride Technologies Pvt Ltd",
      "alternateName": "Wizzride",
      "url": "https://www.wizzride.com",
      "logo": "https://www.wizzride.com/assets/images/icons/logo2.webp",
      "description": "Book Wizzride online cab services and explore travel destinations. Experience Japan with our comprehensive 8-day tour package.",
      "foundingDate": "2017",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+917478493874",
        "contactType": "reservations",
        "areaServed": "IN",
        "availableLanguage": ["en", "Hindi"]
      },
      "sameAs": [
        "https://www.facebook.com/wizzride",
        "https://www.instagram.com/wizzride",
        "https://www.linkedin.com/company/in/wizzride-technologies-private-limited-33b0871a0/",
        "https://twitter.com/wizzride"
      ]
    });

    // TouristTrip JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": "Japan Tour Package - 8 Days",
      "description": "Experience Japan in its Most Mystical Autumn Season. 8 Days Tour of Tokyo - Hakone - Mt. Fuji - Kyoto - Hiroshima - Osaka.",
      "tourBookingPage": "https://wizzride.com/japantour",
      "itinerary": {
        "@type": "ItemList",
        "numberOfItems": 8,
        "itemListElement": this.itineraryDays.map((day, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": day.title
        }))
      },
      "offers": {
        "@type": "Offer",
        "price": "175000",
        "priceCurrency": "INR",
        "availability": "https://schema.org/LimitedAvailability"
      }
    });
  }

  private addJsonLd(schemaObject: any): void {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  ngAfterViewInit(): void {
    // Initialize scroll animations
    this.initIntersectionObserver();
  }

  private initIntersectionObserver(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = this.elementRef.nativeElement.querySelectorAll('section');
    sections.forEach((el: Element) => {
      observer.observe(el);
    });
  }

  scrollToEnquiry(): void {
    const element = document.getElementById('enquiry-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onEnquirySubmit(): void {
    if (this.enquiryFormData.fullName && this.enquiryFormData.contactNo && this.enquiryFormData.emailId && this.enquiryFormData.fromCity) {
      // TODO: Implement enquiry submission logic
      console.log('Enquiry submitted:', this.enquiryFormData);
      alert('Thank you for your enquiry! We will contact you soon.');
      // Reset form
      this.enquiryFormData = {
        fullName: '',
        contactNo: '',
        emailId: '',
        fromCity: '',
        message: ''
      };
    }
  }

  // Activity Image Slider Methods
  getActivityImageIndex(dayTitle: string, activityTitle: string): number {
    const key = `${dayTitle}-${activityTitle}`;
    return this.activityImageIndices[key] || 0;
  }

  nextActivityImage(dayTitle: string, activityTitle: string, totalImages: number): void {
    const key = `${dayTitle}-${activityTitle}`;
    const currentIndex = this.activityImageIndices[key] || 0;
    this.activityImageIndices[key] = (currentIndex + 1) % totalImages;
  }

  prevActivityImage(dayTitle: string, activityTitle: string, totalImages: number): void {
    const key = `${dayTitle}-${activityTitle}`;
    const currentIndex = this.activityImageIndices[key] || 0;
    this.activityImageIndices[key] = (currentIndex - 1 + totalImages) % totalImages;
  }

  goToActivityImage(dayTitle: string, activityTitle: string, index: number): void {
    const key = `${dayTitle}-${activityTitle}`;
    this.activityImageIndices[key] = index;
  }

  // Read More/Less Methods
  isExpanded(index: number): boolean {
    return this.expandedMoments[index] || false;
  }

  toggleMoment(index: number): void {
    this.expandedMoments[index] = !this.expandedMoments[index];
  }

  getTruncatedStory(story: string): string {
    if (story.length <= this.maxStoryLength) {
      return story;
    }
    return story.substring(0, this.maxStoryLength) + '...';
  }

  shouldShowReadMore(story: string): boolean {
    return story.length > this.maxStoryLength;
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}
