import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, Inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../services/seo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CaptchaService, CaptchaData } from '../services/captcha.service';

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

  // Captcha
  captchaData: CaptchaData = { question: '', answer: 0 };
  userCaptchaAnswer: string = '';

  // Form state
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Hero Video
  heroVideoSrc: string = 'assets/videos/JapanVideo.mp4';
  heroImageFallback: string = 'assets/images/japan.jpg';

  // Activity Image Slider Tracking
  activityImageIndices: { [key: string]: number } = {};

  // Read More/Less tracking for Japan Moments
  expandedMoments: { [key: number]: boolean } = {};
  readonly maxStoryLength = 200; // Characters to show before "Read More"

  // Intersection Observer for animations
  private intersectionObserver: IntersectionObserver | null = null;
  
  // IDs for cleaning up Schema scripts
  private readonly schemaIds = ['japan-tour-breadcrumb', 'japan-tour-org', 'japan-tour-trip'];

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
          description: 'The Tokyo Imperial Palace is the primary residence of the Emperor of Japan, located on the site of the former Edo Castle.  The palace complex is surrounded by walls and moats, covering approximately 1.15 square kilometers (0.44 square miles). The Kyūden (宮殿) is the main building where the Emperor conducts official duties and ceremonies. The East Gardens (東御苑, Higashi-gyoen) are a public area offering a serene escape with traditional Japanese gardens, ponds, bridges, and historic structures. The gardens include areas like Honmaru, Ninomaru, and Sannomaru, with the Ninomaru Garden featuring a pond, islands, and teahouses. The Fujimi yagura offers panoramic views of the palace grounds.',
          images: [
            'assets/images/japan/pexels-photo-5817295.jpeg',
            'assets/images/japan/pexels-photo-5206573.jpeg',
            'assets/images/japan/pexels-photo-14892395.jpeg'
          ]
        },
        {
          time: '12:00 PM - 1:00 PM',
          title: 'Lunch nearby',
          description: 'Enjoy lunch at a nearby restaurant.'
        },
        {
          time:'1:30 PM - 3:00 PM',
          title:'Visit Asakusa and Senso-ji Temple.',
          description:"Asakusa, a historic district in Tokyo, is home to Senso-ji Temple, the city's oldest and most revered Buddhist temple. Established in 628 AD, Senso-ji's origins are tied to a legend where two fishermen, Hinokuma Hamanari and his brother Takenari, discovered a statue of Kannon, the Buddhist goddess of mercy, in the Sumida River. This event led to the founding of the temple, which has since become a significant spiritual center. Senso-ji Temple has played a crucial role in the cultural and religious life of Tokyo. During the Edo period (1603-1868), it was a major pilgrimage site and the surrounding area, Asakusa, flourished as an entertainment district filled with theaters, shops, and bustling markets. The temple's rich history is intertwined with the development of Tokyo, reflecting the city's growth from a small fishing village to a bustling metropolis. The temple complex itself, with its iconic Kaminarimon (Thunder Gate), Nakamise shopping street, and the grand Hondo (main hall), stands as a testament to traditional Japanese architecture and religious devotion. The annual Sanja Matsuri festival, one of Tokyo's largest and most vibrant, is held in honor of the temple's founders and showcases Asakusa's enduring cultural vitality. Senso-ji Temple remains a symbol of resilience and continuity, having been rebuilt multiple times due to fires and bombings, yet continuing to draw millions of visitors seeking spiritual solace and a connection to Tokyo's historical roots.",
          images: [
            'assets/images/japan/pexels-photo-861446.jpeg',
            'assets/images/japan/pexels-photo-13598687.jpeg',
            'assets/images/japan/pexels-photo-13598682.jpeg'
          ]
        },
        {
          time:'3:30 PM - 5:30 PM',
          title:'Visit the Tokyo Skytree.',
          description:"Tokyo Skytree, soaring at 634 meters, is the tallest structure in Japan and one of the tallest towers in the world. Located in the Sumida district, it has become an iconic symbol of Tokyo's skyline since its completion in 2012. Designed primarily as a broadcasting tower, Tokyo Skytree also serves as a major tourist attraction, offering breathtaking panoramic views of the city. The tower features two observation decks: Tembo Deck, at 350 meters, and Tembo Galleria, at 450 meters. The Tembo Deck provides a 360-degree view of Tokyo, where visitors can see landmarks like Mount Fuji on clear days. The Tembo Galleria, known as the world's highest skywalk, offers an exhilarating experience with its spiraling glass corridor. Tokyo Skytree is more than just an observation tower; it houses the Tokyo Solamachi complex, a large shopping and entertainment area with over 300 shops, restaurants, an aquarium, and a planetarium. The tower is also beautifully illuminated at night, with a lighting design that changes according to the season and events, adding to its allure. Tokyo Skytree stands as a testament to modern engineering and design, providing a unique vantage point to appreciate the vast and dynamic cityscape of Tokyo.",
          images: [
            'assets/images/japan/pexels-photo-10237794.webp',
            'assets/images/japan/free-photo-of-wall-of-tokyo-skytree.jpeg',
            'assets/images/japan/free-photo-of-sky-tree.jpeg'
          ]
        },
        {
          time:'6:00 PM - 7:30 PM',
          title:'Shibuya Crossing & Hatchiko Statue.',
          description:"Shibuya Crossing, located in the heart of Tokyo, is one of the busiest pedestrian intersections in the world and a must-see for visitors. Known for its mesmerizing chaos, the crossing sees thousands of people from all directions navigating through the scramble, creating a dynamic and iconic scene emblematic of Tokyo's urban energy. Visiting Shibuya Crossing offers a unique opportunity to experience the vibrant pulse of the city firsthand. The surrounding area is filled with towering neon signs, trendy shops, and bustling cafes, making it a perfect spot for shopping, dining, and people-watching. Adjacent to Shibuya Crossing is the Hachiko Statue, a poignant symbol of loyalty and devotion. The statue commemorates Hachiko, an Akita dog who waited daily at Shibuya Station for his deceased owner for nearly ten years. The story of Hachiko has touched the hearts of many, and his statue stands as a testament to unwavering loyalty and the bond between humans and animals. Visiting the Hachiko Statue offers a moment of reflection amid the hustle and bustle of Shibuya. Together, Shibuya Crossing and the Hachiko Statue encapsulate the essence of Tokyo—its fast-paced, vibrant urban life juxtaposed with touching stories of personal devotion. This combination makes the area a compelling destination for any traveler.",
          images: [
            'assets/images/japan/pexels-photo-5905658.jpeg',
            'assets/images/japan/pexels-photo-3402955.jpeg',
            'assets/images/japan/free-photo-of-hachiko-memorial-statue-in-tokyo-japan.jpeg'
          ]
        },
        {
          time:'7:30 PM - 9:00 PM.',
          title:'Dinner nearby.',
          description:"Have dinner nearby at a restaurant.",
        
        },
        {
          time:'9:00 PM',
          title:'Return to your Hotel',
          description:""
        }
      ]
    },
    {
      title: 'Day 02',
      activities: [
        {
          time:'7:00 AM - 8:00 AM. ',
          title:'Breakfast at Hotel.',
          description:'Enjoy breakfast at the hotel or partake in any arrangements provided by the company.'
        },
        {
          time:'8:00 AM - 10:00 AM. ',
          title:'Visit Tokyo Meiji Shrine.',
          description:"Meiji Shrine, nestled in a lush forest in the heart of Tokyo, is a significant cultural and historical landmark dedicated to Emperor Meiji and Empress Shoken. Constructed in 1920, the shrine honors the emperor who played a pivotal role in transforming Japan from a feudal society into a modern nation-state during the Meiji Restoration (1868-1912). This period marked Japan's emergence as a major global power, characterized by significant political, economic, and social reforms. The shrine is not only a tribute to Emperor Meiji's legacy but also a symbol of Japan's rich cultural heritage. It was built through the collective efforts of citizens who donated time, money, and materials, reflecting the deep respect and admiration they held for the emperor and empress. The expansive forest surrounding the shrine, with over 100,000 trees donated from across Japan, creates a serene and contemplative atmosphere, providing a stark contrast to the bustling metropolis outside its gates. Meiji Shrine serves as an important site for traditional Shinto practices, including weddings and the annual New Year's prayers, drawing millions of visitors each year. The shrine's historical significance lies in its embodiment of Japan's journey through modernization while retaining its cultural and spiritual roots. Visiting Meiji Shrine offers a profound glimpse into the country's history and its enduring traditions, making it a must-visit destination in Tokyo.",
          images: [
            'assets/images/japan/pexels-photo-3800108.jpeg',
            'assets/images/japan/20230613_100938.jpg',
            'assets/images/japan/2021-12-27.jpg'
          ]
        },
        {
          time:'10:00 AM - 12:00 PM ',
          title:'Visit Harajuku.',
          description:"Visiting Harajuku offers a vibrant and eclectic experience that captures the essence of Tokyo's dynamic youth culture and cutting-edge fashion scene. Known globally for its unique street style, Harajuku is the epicenter of avant-garde fashion and creative expression. Takeshita Street, the main artery of Harajuku, is lined with trendy boutiques, quirky shops, and colorful cafes. Here, you can find everything from the latest fashion trends to eccentric accessories and delicious crepes. Harajuku is also home to the serene and historic Meiji Shrine, providing a peaceful retreat from the bustling streets. The contrast between the tranquil shrine and the lively shopping district highlights the unique blend of traditional and modern aspects of Tokyo. In addition to shopping and cultural experiences, Harajuku boasts an array of art galleries and themed cafes, such as the popular Kawaii Monster Cafe. The area is a haven for photographers and street art enthusiasts, with vibrant murals and graffiti adding to its artistic appeal. Visiting Harajuku is a sensory adventure, offering a mix of shopping, culture, and art. Whether you're exploring the latest fashion trends, delving into Tokyo's pop culture, or seeking a peaceful moment at Meiji Shrine, Harajuku provides a multifaceted experience that is quintessentially Tokyo.",
          images: [
            'assets/images/japan/free-photo-of-crowded-takeshita-street-harajuku-in-tokyo-japan.jpeg',
            'assets/images/japan/photo-1542062700-9b61ccbc1696.jpg',
            'assets/images/japan/240_F_686343802_QtNJY7tCzO3rxBr9rb2BzTrdnpusTmmt.jpg'
          ]
        },
        {
          time:'12:00 PM - 1:00 PM',
          title:'Lunch nearby.',
          description:"Have lunch nearby at a restaurant."
        },
        {
          time:'1:30 PM - 3:00 PM ',
          title:'Visit TeamLab Borderless.',
          description:"Visiting teamLab Borderless in Tokyo offers a mesmerizing and immersive experience unlike any other. This digital art museum, created by the innovative art collective teamLab, blurs the boundaries between art and technology, allowing visitors to become an integral part of the art itself. The museum is renowned for its interactive and ever-changing exhibits that create a world of endless possibilities, where digital art installations seamlessly flow and transform around you. One of the main attractions of teamLab Borderless is its immersive environment, where visitors can explore freely without a fixed route. This freedom encourages personal discovery and a unique experience for each visitor. The dynamic installations respond to your presence and movements, creating a deeply engaging and personalized interaction with the art. Highlights include the 'Forest of Resonating Lamps,' a stunning room filled with hanging lamps that change color and intensity as you move through the space, and the 'Crystal World,' where thousands of LED lights create an awe-inspiring, constantly shifting lightscape. teamLab Borderless is not just a visual feast but also a place of wonder and contemplation. It challenges perceptions, evokes emotions, and stimulates creativity. Visiting this extraordinary museum provides a profound and unforgettable experience, making it a must-see destination for anyone in Tokyo.",
          images: [
            'assets/images/japan/photo-1593073637686-cc056c151c1e.jpg',
            'assets/images/japan/photo-1593140991451-790e6b246cd5.jpg',
            'assets/images/japan/photo-1555670600-170aa4c926f6.jpg'
          ]
        },
        {
          time:'4:00 PM - 6:00 PM ',
          title:'Visit Odaiba.',
          description:"Visiting Odaiba offers a unique blend of futuristic attractions, entertainment, and stunning waterfront views, making it a must-see destination in Tokyo. This man-made island in Tokyo Bay is renowned for its modern architecture, expansive shopping malls, and diverse recreational activities. Odaiba is home to several iconic landmarks, such as the life-sized Unicorn Gundam statue, the futuristic Fuji TV Building, and the replica of the Statue of Liberty. These attractions provide great photo opportunities and a glimpse into Japan's pop culture and technological prowess. The area boasts numerous shopping and entertainment complexes like DiverCity Tokyo Plaza and Aqua City, where visitors can enjoy shopping, dining, and various amusements. TeamLab Borderless, an immersive digital art museum, offers a mesmerizing experience that combines art, technology, and interaction, making it a highlight of any visit to Odaiba. Odaiba also features beautiful waterfront parks and beaches, perfect for leisurely strolls and picnics while enjoying panoramic views of the Rainbow Bridge and Tokyo Tower. The Oedo-Onsen Monogatari, a hot spring theme park, offers relaxation with its traditional baths and Edo-period ambiance. Overall, Odaiba's mix of futuristic attractions, cultural experiences, and scenic beauty makes it a versatile and exciting destination for travelers seeking a modern yet relaxing experience in Tokyo.",
          
          images: [
            'assets/images/japan/photo-1558671434-ef7468f42a80.jpg',
            'assets/images/japan/958bi4L1N9s.jpg',
            'assets/images/japan/photo-1567597714138-3bdc30f4f493.jpg'
          ]
        },
        
        {
          time:'6:00 PM - 7:30 PM. ',
          title:'Dinner nearby.',
          description:"Have dinner nearby at a restaurant."
        },
        {
          time:'8:00 PM.',
          title:'Return to your Hotel. ',
          description:""
        }
        
      ]
    },
    {
      title: 'Day 03 Full Day Excursion to Mount Fuji.',
      activities: [
        {
          time:'7:00 AM - 8:00 AM. ',
          title:'Breakfast at Hotel.',
          description:'Enjoy breakfast at the hotel or partake in any arrangements provided by the company.'
        },
        {
          time: '8:00 AM - 10:00 AM.',
          title: 'Travel to Mount Fuji Area.',
          description: 'Traveling from Tokyo to Mount Fuji offers a journey through contrasting landscapes, from the bustling metropolis to the serene countryside. The trip typically involves taking a train to one of the nearby stations like Kawaguchiko or Gotemba, followed by a bus ride or taxi to reach the base of the mountain. Along the way, travelers can enjoy scenic views of rural Japan and, on clear days, catch glimpses of the iconic peak looming in the distance.',
          images: [
           
            'assets/images/japan/free-photo-of-mount-fuji-in-autumn.jpeg',
            'assets/images/japan/pexels-photo-4077937.jpeg'
          ]
        },
        {
          time: '10:00 AM - 1:00 PM',
          title: 'Lake Kawaguchi.',
          description: 'Lake Kawaguchi, one of the Fuji Five Lakes, is renowned for its stunning views of Mount Fuji. It offers serene boat rides with panoramic vistas of the mountain and surrounding forests, making it a popular destination for nature lovers and photographers alike.'
        },
        {
          time: '1:00 PM - 2:00 PM',
          title: 'Lunch Nearby.',
          description: 'Have lunch nearby at a restaurant.'
          
        },
        {
          time: '2:00 PM - 4:00 PM.',
          title: 'Mount Fuji 5th Station.',
          description: "The 5th Station of Mount Fuji, located at an elevation of 2,305 meters, is the most accessible point by road to experience Japan's highest peak. It serves as a starting point for climbers tackling the summit and offers breathtaking views of the surrounding landscapes. Visitors can explore shops, restaurants, and hiking trails, experiencing the beauty and majesty of Mount Fuji up close.",
          
          
        },
        {
          time: '4:00 PM - 6:00 PM.',
          title: 'Head back to Tokyo.',
          description: "Return back to Tokyo from Mount Fuji."
          
        },
        {
          time: '6:30 PM - 8:00 PM.',
          title: 'Dinner in Tokyo & Return to Hotel.',
          description: ""
          
        }
      ]
    },
    {
      title: 'Day 04 Transfer from Tokyo to Kyoto.',
      activities: [
        {
          time: '7:00 AM - 8:00 AM.',
          title: 'Breakfast at Hotel',
          description: 'Enjoy breakfast at the hotel or partake in any arrangements provided by the company.',
          
        },
        {
          time: '8:30 AM - 11:30 AM. ',
          title: "Travel from Tokyo to Kyoto Japan's famous Bullet Train.",
          description: "Japan's Shinkansen, also known as the bullet train, is renowned for its speed, efficiency, and punctuality.  It operates on dedicated tracks, reaching speeds of up to 320 km/h (200 mph), connecting major cities like Tokyo, Osaka, and Kyoto in a matter of hours. The Shinkansen's sleek design, comfortable seating, and onboard amenities make it a preferred choice for travelers exploring Japan's diverse landscapes and cultural attractions.",
          images: [
            'assets/images/japan/free-photo-of-shinkansen-train-arriving-at-a-station.jpeg',
            'assets/images/japan/photo-1695833913339-f2591ac948ef.jpg',
            'assets/images/japan/photo-1627052699797-b1a1b3ebb1bd.jpg'
          ]
          
        },
        {
          time: '11:30 AM - 12:30 PM.',
          title: 'Check-in at Hotel.',
          description: 'Drop off your luggages at the Hotel and check in.',
          
        },
        {
          time: '12:30 PM - 1:30 PM',
          title: 'Lunch at Hotel.',
          description: 'Have lunch near your hotel.',
          
        },
        {
          time: '2:00 PM - 4:00 PM ',
          title: 'Visit Kinkaku-ji (Golden Pavilion)',
          description: "Kinkaku-ji, or the Golden Pavilion, is a Zen Buddhist temple located in Kyoto, Japan. Originally built in 1397 as a retirement villa for shogun Ashikaga Yoshimitsu, it was later converted into a Zen temple following his death. The temple is renowned for its stunning architecture and its top two floors covered entirely in gold leaf, giving it the iconic appearance that reflects beautifully on the surrounding pond. The significance of Kinkaku-ji lies not only in its breathtaking beauty but also in its cultural and historical importance. It represents the pinnacle of Muromachi period (1336-1573) architecture and design, characterized by its harmonious blend of Shinden, Samurai, and Zen temple styles. The temple's reflection on the Mirror Pond (Kyoko-chi) is symbolic of the relationship between heaven and earth, a central concept in Buddhism. Kinkaku-ji is also closely associated with the concept of wabi-sabi, finding beauty in imperfection and transience. Despite being rebuilt after a fire in 1950 (the original structure was burned down by a monk in 1950), the temple continues to evoke a sense of timeless elegance and serenity. As a UNESCO World Heritage site and one of Kyoto's most visited landmarks, Kinkaku-ji attracts millions of visitors annually who come to admire its architecture, stroll through its meticulously landscaped gardens, and experience a moment of tranquility and contemplation in the presence of this cultural treasure.",
          images: [
            'assets/images/japan/photo-1573700947337-61ff53eb00d5.jpg',
            'assets/images/japan/20210912_120801.jpg',
            'assets/images/japan/AF1QipO88HaAgI3AnuuRUDik-hR-DOUZ.jpg'
          ]
        },
        {
          time: '4:30 PM - 6:00 PM. ',
          title: 'Visit Nijo Castle.',
          description: "Nijo Castle (Nijojo) in Kyoto is a UNESCO World Heritage site and a symbol of the power and wealth of the Tokugawa shogunate during the Edo period (1603-1868). Built in 1603 by Tokugawa Ieyasu, the founder of the Tokugawa shogunate, Nijo Castle served as the residence for the shoguns when they visited Kyoto. The castle is renowned for its unique architectural design, featuring two concentric rings of fortifications, the Ninomaru Palace, and the Honmaru Palace. The Ninomaru Palace, in particular, is famous for its 'nightingale floors' (uguisubari), which squeak when walked upon to alert against intruders. The palace interiors are adorned with exquisite sliding doors and intricate wood carvings, showcasing the wealth and power of the Tokugawa shogunate. Beyond its architectural beauty, Nijo Castle holds historical significance as the place where the Tokugawa shogunate formally handed over power to the Meiji Restoration government in 1867. This event marked the end of the samurai era and the beginning of Japan's modernization",
          images: [
            'assets/images/japan/free-photo-of-outer-walls-of-nijo-castle-in-kyoto-japan.jpeg',
            'assets/images/japan/photo-1682849759434-1abb8720049a.jpg',
            'assets/images/japan/photo-1685845284509-2202d6e0e2eb.jpg'
          ]
        },{
          time:'6:30 PM - 8:00 PM.',
          title:' Dinner in Kyoto & Return to Hotel.',
          description:'',
        },
        
        
      ]
    },
    {
      title: 'Day 05 Exploring Kyoto & Transfer to Osaka.',
      activities: [
        {
          time: '7:00 AM - 8:00 AM. ',
          title: 'Breakfast at Hotel.',
          description: 'Enjoy breakfast at the hotel or partake in any arrangements provided by the company.'
        
        },
        {
          time: '8:00 AM - 10:00 AM. ',
          title: 'Visit the famous Fushimi Inari Shrine.',
          description: "Fushimi Inari Shrine, located in Kyoto, Japan, is one of the most iconic and revered Shinto shrines in the country. It is famous for its thousands of vermillion torii gates that form pathways leading into the wooded forest of Mount Inari, creating a stunning and mystical atmosphere. Each torii gate is donated by individuals and businesses, symbolizing their wishes and prayers. The shrine is dedicated to Inari, the Shinto god of rice, prosperity, and business. Foxes (kitsune), believed to be Inari's messengers, can be seen throughout the shrine grounds. Visitors can explore the network of trails that wind up the mountain, passing by smaller shrines and offering breathtaking views of Kyoto from various viewpoints along the way. Fushimi Inari Shrine holds significant cultural and spiritual importance, attracting millions of visitors annually. It is a place where visitors can experience both the tranquility of nature and the vibrancy of Japanese religious culture. The shrine's unique and picturesque setting, combined with its deep cultural heritage, makes it a must-visit destination for anyone traveling to Kyoto.",
          images: [
            'assets/images/japan/free-photo-of-kyoto-perspective.jpeg',
            'assets/images/japan/free-photo-of-fushimi-inari-taisha-shrine-in-japan.jpeg',
            'assets/images/japan/free-photo-of-interior-of-the-fushimi-inari-taisha-temple-in-kyoto-japan.jpeg'
          ]
        },
        {
          time: '10:30 AM - 12:00 PM ',
          title: 'Kiyomizu-dera.',
          description: "Kiyomizu-dera, officially known as Otowa-san Kiyomizu-dera, is a historic Buddhist temple located in the Higashiyama district of Kyoto, Japan. Founded in 778 AD, the temple is part of the Historic Monuments of Ancient Kyoto UNESCO World Heritage site. Its name, Kiyomizu-dera, translates to 'Pure Water Temple,' named after the Otowa Waterfall within the temple grounds. One of the most iconic features of Kiyomizu-dera is its wooden stage, known as the Kiyomizu Stage, that juts out from the main hall 13 meters above the hillside below. The stage offers visitors panoramic views of the city of Kyoto and is particularly stunning during cherry blossom season and autumn foliage. The main hall, known as the Hondo, houses a statue of Kannon Bodhisattva, the Buddhist deity of mercy and compassion. Visitors to the temple can also drink from the Otowa Waterfall using long-handled cups, which is said to grant wishes related to longevity, success in studies, and a fortunate love life. Kiyomizu-dera is surrounded by lush greenery and maple trees, creating a serene and picturesque setting that changes with the seasons. The temple complex includes several other halls and shrines, such as Jishu Shrine dedicated to the deity of love and matchmaking. The temple holds cultural and historical significance as a center of Buddhist practice and as a testament to Japanese architecture and craftsmanship. It has been rebuilt multiple times due to fires and earthquakes, with the current structures dating from the early Edo period (1633). Kiyomizu-dera remains a popular destination for tourists and pilgrims alike, offering a spiritual retreat and a glimpse into Japan's rich cultural heritage.",
          images: [
            'assets/images/japan/free-photo-of-kiyomizu-dera-temple-in-kyoto.jpeg',
            'assets/images/japan/pexels-photo-10889285.jpeg',
            'assets/images/japan/photo-1678107658651-fccc4bdae865.jpg'
          ]
        },
        {
          time: '12:00 PM - 1:00 PM. ',
          title: 'Lunch Nearby.',
          description: ''
        
        },
        {
          time: '1:30 PM - 3:30 PM ',
          title: 'Visit Arashiyama Bamboo Grove.',
          description: "Arashiyama Bamboo Grove, located in the western outskirts of Kyoto, Japan, is a mesmerizing natural attraction known for its towering bamboo groves that create a surreal and tranquil atmosphere. Walking through the grove feels like stepping into another world, where the tall bamboo stalks sway gently in the breeze, casting enchanting patterns of light and shadow. The main path through the grove leads to the entrance of the iconic Tenryu-ji Temple, a UNESCO World Heritage site and one of Kyoto's five great Zen temples. The temple's sprawling garden, designed by the renowned garden designer Muso Soseki, offers a peaceful retreat surrounded by lush greenery and views of the Arashiyama mountains. Visitors can explore various paths and trails that wind through the bamboo grove, providing opportunities for quiet contemplation and photography. The grove is particularly atmospheric early in the morning or late in the afternoon when the sunlight filters through the bamboo, creating a magical ambiance. Arashiyama Bamboo Grove is not only a natural wonder but also holds cultural significance, symbolizing resilience and longevity in Japanese culture. Bamboo is revered for its strength, flexibility, and rapid growth, embodying the spirit of perseverance and adaptation. Beyond the bamboo grove, the Arashiyama area offers other attractions such as the historic Togetsukyo Bridge, scenic boat rides on the Hozu River, and the charming Sagano scenic railway. Together, these attractions make Arashiyama a must-visit destination for travelers seeking natural beauty, cultural heritage, and tranquility in Kyoto.",
          images: [
            'assets/images/japan/pexels-photo-4323662.jpeg',
            'assets/images/japan/photo-1598497646896-7e0d0347195b.jpg',
            'assets/images/japan/free-photo-of-man-walking-down-the-road-in-a-bamboo-forest.jpeg'
          ]
        },
        {
          time: '4:00 PM - 6:00 PM ',
          title: 'Explore the city of Kyoto.',
          description: ''
        
        },
        {
          time: '6:30 PM - 8:00 PM. ',
          title: 'Dinner Nearby & return to your hotel in Kyoto.',
          description: ''
        
        },
      ]
    },
    {
      title: 'Day 06 Transfer from Kyoto to Nara & then to Osaka.',
      activities: [
        {
          time: '7:00 AM - 8:00 AM.',
          title: 'Breakfast at Hotel.',
          description: 'Enjoy breakfast at the hotel or partake in any arrangements provided by the company.',
        },
        {
          time: '09:00 AM - 12:00 PM.  ',
          title: 'Arrive at Nara & visit the Toda-ji temple and the famous Nara Deer Park.',
          description: "Tōdai-ji, located in Nara, Japan, is one of the country's most significant and impressive historical landmarks. Originally constructed in 752 AD, this Buddhist temple is renowned for housing the world's largest bronze statue of the Great Buddha (Daibutsu). The statue, standing at an imposing 15 meters (49 feet) tall, is a breathtaking representation of Vairocana Buddha and attracts millions of visitors annually. The main hall of Tōdai-ji, known as the Daibutsuden (Great Buddha Hall), is the largest wooden building in Japan. Despite being rebuilt twice due to fires, the current structure, completed in 1709, remains a monumental achievement in wooden architecture, showcasing the grandeur and skill of ancient Japanese craftsmanship. Tōdai-ji's historical and cultural significance extends beyond its architectural marvels. It played a crucial role in the spread of Buddhism in Japan and served as the head temple of all provincial Buddhist temples. The temple complex includes various other significant buildings, such as the Nandaimon (Great South Gate), which features two imposing statues of Nio guardians, and the Nigatsu-do and Sangatsu-do halls, known for their cultural treasures and annual rituals. As a UNESCO World Heritage site, Tōdai-ji not only embodies the spiritual and cultural heritage of Japan but also stands as a testament to the country's architectural and artistic achievements. Visiting Tōdai-ji offers a profound glimpse into Japan's rich history and religious traditions, making it an essential destination for travelers.",
          images: [
            'assets/images/japan/free-photo-of-photo-of-todaiji-temple-in-nara-japan.jpeg',
            'assets/images/japan/pexels-photo-1717887.jpeg',
            'assets/images/japan/photo-1522209637010-422a41972d2c.jpg'
          ]
        },
        
        {
          time: '12:00 PM - 1:00 PM. ',
          title: 'Lunch Nearby.',
          description: ''
        },
        {
          time: '1:30 PM - 2:30 PM',
          title: 'Transfer to Osaka City & Checkin at Hotel.',
          description: ''
        },
        {
          time: '4:00 PM - 6:00 PM',
          title: 'Visit Osaka Castle',
          description: 'Osaka Castle is one of Japan\'s most famous landmarks, offering visitors a fascinating glimpse into the country\'s rich history and culture. Originally built in 1583 by Toyotomi Hideyoshi, a key figure in Japan\'s unification, the castle has played a significant role in various historical events, including the Siege of Osaka. The castle\'s striking main tower, surrounded by moats and impressive stone walls, stands as a testament to the architectural ingenuity of the time. Visiting Osaka Castle provides an opportunity to explore its expansive grounds, which include beautifully landscaped gardens, such as the Nishinomaru Garden, offering spectacular views of the castle tower against a backdrop of cherry blossoms in spring. The castle\'s interior has been transformed into a modern museum, showcasing a vast collection of historical artifacts, samurai armor, and informative displays detailing the castle\'s storied past. The observation deck at the top of the main tower offers panoramic views of Osaka, allowing visitors to appreciate the city\'s blend of historical and modern elements. The castle grounds are also a hub for cultural events and festivals, providing a vibrant atmosphere throughout the year. Overall, Osaka Castle is a must-visit destination for history enthusiasts, architecture lovers, and anyone looking to experience the cultural heritage of Japan. Its blend of historical significance, architectural beauty, and cultural activities makes it a highlight of any visit to Osaka.',
          images: [
            'assets/images/japan/pexels-photo-4058519.jpeg',
            'assets/images/japan/pexels-photo-6226339.jpeg',
            'assets/images/japan/free-photo-of-illuminated-osaka-castle-at-night.jpeg'
          ]
        },
        {
          time: '6:00 PM - 8:00 PM',
          title: 'Visit Dotonbori, Osaka',
          description: 'Dotonbori, located in Osaka, is a must-visit destination for anyone traveling to Japan. This vibrant entertainment district is famous for its lively atmosphere, neon lights, and diverse culinary offerings. As you stroll along the Dotonbori Canal, you\'ll be captivated by the bright, animated billboards, including the iconic Glico Running Man and the giant Kani Doraku crab sign, which have become symbols of the area. Dotonbori is a food lover\'s paradise, offering an array of delicious street food and local delicacies. From takoyaki (octopus balls) and okonomiyaki (savory pancakes) to kushikatsu (deep-fried skewers) and fugu (pufferfish), the district is renowned for its diverse and mouth-watering cuisine. The numerous restaurants and food stalls ensure that visitors can indulge in Osaka\'s culinary delights at any time of day. The area is also home to a variety of entertainment options, including theaters, bars, and shops, making it a bustling hub of activity both day and night. The nearby Dotonbori Arcade offers a unique shopping experience with its eclectic mix of stores. Visiting Dotonbori allows travelers to experience the vibrant energy and rich culinary culture of Osaka. Whether you\'re savoring local dishes, exploring the bustling streets, or enjoying the dazzling lights along the canal, Dotonbori promises an unforgettable and immersive experience that captures the essence of Osaka\'s lively spirit.',
          images: [
            'assets/images/japan/pexels-photo-2070026.jpeg',
            'assets/images/japan/pexels-photo-4504684.jpeg',
            'assets/images/japan/pexels-photo-8050487.jpeg'
          ]
        },
        {
          time: '8:00 PM',
          title: 'Return to Hotel',
          description: 'Return to your hotel in Osaka.'
        }
      ]
    },
    {
      title: 'Day 07 Full Day excursion to Hiroshima.',
      activities: [
        {
          time: '7:00 AM - 8:00 AM',
          title: 'Breakfast at Hotel',
          description: 'Enjoy breakfast at the hotel or partake in any arrangements provided by the company.'
        },
        {
          time: 'Full Day',
          title: 'Visit Peace park, Memorial Museum and Atomic Bomb dome at Hiroshima.',
          description:"Hiroshima Peace Memorial Park, Memorial Museum, and Atomic Bomb Dome are profound symbols of the impact of nuclear warfare and the enduring hope for global peace. Located in Hiroshima, Japan, the park was established to honor the victims of the atomic bomb dropped on the city on August 6, 1945, and to advocate for the abolition of nuclear weapons. The Atomic Bomb Dome, originally the Hiroshima Prefectural Industrial Promotion Hall, is the most iconic structure in the park. Left in its ruined state, it serves as a stark reminder of the destruction caused by the bomb and stands as a powerful symbol of resilience and peace. Designated as a UNESCO World Heritage site, it is a place of reflection and a poignant reminder of the need for nuclear disarmament. The Hiroshima Peace Memorial Museum, located within the park, provides a comprehensive and moving account of the events leading up to, during, and after the bombing. Exhibits include personal artifacts, photographs, and testimonies from survivors, offering a deeply human perspective on the tragedy. The museum aims to educate visitors about the horrors of nuclear warfare and to promote a message of peace. The park itself is a serene space, featuring various memorials and monuments, such as the Cenotaph for A-bomb Victims and the Children's Peace Monument. It offers a place for contemplation and prayer, with thousands of paper cranes left by visitors symbolizing wishes for peace. Visiting Hiroshima Peace Memorial Park, Memorial Museum, and Atomic Bomb Dome provides a powerful, emotional experience that underscores the importance of striving for a world free from the threat of nuclear war.",
          images: [
            'assets/images/japan/free-photo-of-hiroshima-peace-memorial.jpeg',
            'assets/images/japan/photo-1699444114670-6b36a988ec38.jpg',
            'assets/images/japan/photo-1697604733264-81a69ee2315e.jpg'
          ]
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
    @Inject(PLATFORM_ID) private platformId: Object,
    private elementRef: ElementRef,
    private http: HttpClient,
    private captchaService: CaptchaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Generate captcha
    this.captchaData = this.captchaService.generateCaptcha();
    
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
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/Wizzride-Japan-Holiday-Package.png' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Japan Tour Package - 8 Days Tokyo Hakone Kyoto Hiroshima Osaka | Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Experience Japan in its Most Mystical Autumn Season. 8 Days Tour of Tokyo - Hakone - Mt. Fuji - Kyoto - Hiroshima - Osaka.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/Wizzride-Japan-Holiday-Package.png' });
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
    }, 'japan-tour-breadcrumb');

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
    }, 'japan-tour-org');

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
    }, 'japan-tour-trip');
  }

  // ✅ Utility: inject LD+JSON scripts safely
  // UPDATED: Allows SSR (removed isPlatformBrowser check) and prevents duplicates
  private addJsonLd(schemaObject: any, scriptId: string): void {
    if (!this.document) return;

    // Remove existing script with same ID to prevent duplicates
    const existingScript = this.document.getElementById(scriptId);
    if (existingScript) {
      this.renderer.removeChild(this.document.head, existingScript);
    }

    const script = this.renderer.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize scroll animations only on browser
      this.initIntersectionObserver();
    }
  }

  // New method: Added missing logic to handle Intersection Observer safely
  private initIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Safety check for IntersectionObserver (Browser API)
    if ('IntersectionObserver' in window) {
      try {
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };

        this.intersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
            }
          });
        }, observerOptions);

        // Assuming there are elements with class 'animate-on-scroll' or generic sections
        // Fallback to sections if no specific class is used in template yet
        const elements = this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll, section');
        elements.forEach((el: Element) => {
          this.intersectionObserver?.observe(el);
        });
      } catch (e) {
        console.warn('Error initializing intersection observer:', e);
      }
    }
  }

  scrollToEnquiry(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const element = this.document.getElementById('enquiry-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onEnquirySubmit(): void {
    // Clear previous messages
    this.successMessage = '';
    this.errorMessage = '';

    // Validate captcha first
    if (!this.captchaService.validateCaptcha(this.userCaptchaAnswer, this.captchaData.answer)) {
      this.errorMessage = 'Incorrect answer! Please solve the math problem correctly.';
      this.userCaptchaAnswer = '';
      this.captchaData = this.captchaService.generateCaptcha();
      return;
    }

    // Validate form fields
    if (!this.enquiryFormData.fullName || !this.enquiryFormData.fullName.trim()) {
      this.errorMessage = 'Please enter your full name.';
      return;
    }

    if (!this.enquiryFormData.contactNo || !this.enquiryFormData.contactNo.trim()) {
      this.errorMessage = 'Please enter your contact number.';
      return;
    }

    if (!this.enquiryFormData.emailId || !this.enquiryFormData.emailId.trim()) {
      this.errorMessage = 'Please enter your email ID.';
      return;
    }

    if (!this.enquiryFormData.fromCity || !this.enquiryFormData.fromCity.trim()) {
      this.errorMessage = 'Please enter your city.';
      return;
    }

    this.isSubmitting = true;

    // Prepare submission data
    const submissionData = {
      title: `Japan Tour Enquiry - ${this.enquiryFormData.fullName}`,
      content: this.enquiryFormData.message || 'No message provided',
      status: 'publish',
      acf: {
        full_name: this.enquiryFormData.fullName,
        contact_number: this.enquiryFormData.contactNo,
        email_id: this.enquiryFormData.emailId,
        from_city: this.enquiryFormData.fromCity,
        message: this.enquiryFormData.message || '',
        submission_date: new Date().toISOString(),
        tour_type: 'Japan Tour'
      }
    };

    console.log('Submitting Japan tour enquiry:', submissionData);

    // Submit to WordPress
    this.http.post('https://cms.wizztest.com/wp-json/wp/v2/japan_tour_enquiries', submissionData)
      .subscribe({
        next: (response: any) => {
          console.log('Japan tour enquiry submitted successfully:', response);
          this.isSubmitting = false;
          
          // Prepare form data for thank you page (SEO-friendly, no query params)
          const formData = {
            title: 'Thank You for Your Japan Tour Enquiry!',
            message: 'Your enquiry has been submitted successfully.',
            subtitle: 'We have received your interest in our Japan Tour package and will contact you soon with more details and a personalized quote based on your location.',
            formType: 'japantour',
            additionalInfo: 'Our team typically responds within 24-48 hours. We look forward to helping you experience Japan in its most mystical autumn season!',
            redirectUrl: '/japantour',
            redirectText: 'Back to Japan Tour'
          };

          // Store in localStorage as fallback (for page refresh)
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('thankyouFormData', JSON.stringify(formData));
          }

          // Navigate with router state (clean URL, no query params)
          this.router.navigate(['/thankyou-form'], {
            state: { formData: formData }
          });
        },
        error: (error) => {
          console.error('Error submitting Japan tour enquiry:', error);
          this.isSubmitting = false;
          this.errorMessage = 'There was an error submitting your enquiry. Please try again.';
          
          // Clear error message after 5 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
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

  onImageError(event: any): void {
    console.error('Image failed to load:', event.target.src);
    // Set a fallback image
    event.target.src = 'assets/images/japan.jpg';
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
        // Disconnect observer
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        // Remove schema scripts
        this.schemaIds.forEach(id => {
            const script = this.document.getElementById(id);
            if (script) {
                this.renderer.removeChild(this.document.head, script);
            }
        });
    }
  }
}