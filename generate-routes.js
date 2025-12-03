const fs = require('fs');
const https = require('https');
const http = require('http');

// Static routes extracted from app.routes.ts
const staticRoutes = [
  '/',
  '/home',
  '/booking-results',
  '/checkout',
  '/thankyou',
  '/aboutcompany',
  '/aboutcompany/ourvision',
  '/aboutcompany/ourcommittment',
  '/aboutcompany/ourworkphilosophy',
  '/contactus',
  '/applyforjob',
  '/applyforjob/driverjob',
  '/applyforjob/partnerwithus',
  '/ourservices/corporatepackages',
  '/ourservices/intercityrides',
  '/ourservices/localrides',
  '/ourservices/holidaystours',
  '/ourservices/packagedelivery',
  '/ourservices/holidaystours/WizzTour-North-East-India-Holiday-Planner',
  '/ourservices/holidaystours/Wizzride-International-Holiday-Planner',
  '/ourservices',
  '/cancellationpolicy',
  '/cancellationpolicy/termsandconditions',
  '/cancellationpolicy/privacypolicy',
  '/cancellationpolicy/useragreement',
  '/frequentlyaskedquestions',
  '/destinations',
  '/cancelticket',
  '/destinations/gangtok',
  '/destinations/namchi',
  '/destinations/yuksom',
  '/destinations/lachung',
  '/destinations/tsomgo_lake',
  '/destinations/pelling',
  '/destinations/nathula_pass',
  '/destinations/rumtek_monastery',
  '/destinations/zuluk',
  '/destinations/rangpo',
  '/destinations/darjeeling',
  '/destinations/tigerhill',
  '/destinations/ghoom-monastery',
  '/destinations/batasia-loop',
  '/destinations/himalayan-zoological-park',
  '/destinations/happy-valley-tea-estate',
  '/destinations/kurseong',
  '/destinations/kalimpong',
  '/destinations/ravangla',
  '/destinations/kaziranga-national-park',
  '/destinations/majuli-island',
  '/destinations/guwahati',
  '/destinations/kamakhya',
  '/destinations/sivasagar',
  '/destinations/tezpur',
  '/destinations/shillong',
  '/destinations/cherrapunji',
  '/destinations/mawsynram',
  '/destinations/dawki',
  '/destinations/umiam-lake',
  '/destinations/laitlum',
  '/destinations/tawang',
  '/destinations/zirovalley',
  '/destinations/namdaphanationalpark',
  '/destinations/itanagar',
  '/destinations/bhalukpong',
  '/destinations/bomdila',
  '/destinations/kohima',
  '/destinations/dimapur',
  '/destinations/mokokchung',
  '/destinations/mon',
  '/destinations/khonomagreenvillage',
  '/destinations/dzukouvalley',
  '/airports/guwahatiairport',
  '/airports/bagdograairport',
  '/airports/shillongairport',
  '/airports/pakyongairport',
  '/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Sikkim_Reserved_Cab_Service',
  '/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Darjeeling_Reserved_Cab_Service',
  '/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Kalimpong_Reserved_Cab_Service',
  '/ourservices/Luxury-Reserved-Cabs/Guwahati_Airport_To_Shillong_Reserved_Cab_Service',
  '/ourservices/Luxury-Reserved-Cabs/IIM-Shillong-to-Guwahati-Airport',
  '/ourservices/Luxury-Reserved-Cabs/Guwahati_To_Tezpur_Reserved_Cab_Service',
  '/ourservices/Luxury-Reserved-Cabs/Shillong_To_Tezpur_Reserved_Cab_Service',
  '/ourservices/Luxury-Shared-Cabs/Siliguri_To_Gangtok_Shared_Cab_Service',
  '/ourservices/Luxury-Shared-Cabs/Siliguri_To_SMIT_Shared_Cab_Service',
  '/ourservices/Luxury-Shared-Cabs/Siliguri_To_Rangpo_Shared_Cab_Service',
  '/ourservices/Luxury-Shared-Cabs/Siliguri_To_Darjeeling_Shared_Cab_Service',
  '/ourservices/Luxury-Shared-Cabs/Siliguri_To_Kurseong_Shared_Cab_Service',
  '/ourservices/Luxury-Shared-Cabs/Siliguri_To_Kalimpong_Shared_Cab_Service',
  '/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_to_Gangtok_Shared_Cab_Service',
  '/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Darjeeling_Shared_Cab_Service',
  '/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Kalimpong_Shared_Cab_Service',
  '/ourservices/Luxury-Shared-Cabs/guwahati-to-shillong',
  '/ourservices/flight-booking/bagdogratobengaluru',
  '/ourservices/flight-booking/bagdogratodelhi',
  '/ourservices/flight-booking/bagdogratodibrugarh',
  '/ourservices/flight-booking/bagdogratoguwahati',
  '/ourservices/flight-booking/bagdogratokolkata',
  '/ourservices/flight-booking/bagdogratomumbai',
  '/ourservices/flight-booking/guwahatitoagartala',
  '/ourservices/flight-booking/guwahatitodelhi',
  '/ourservices/flight-booking/guwahatitodibrugarh',
  '/ourservices/flight-booking/guwahatitoimphal',
  '/ourservices/flight-booking/guwahatitokolkata',
  '/ourservices/flight-booking/pakyongtodelhi',
  '/ourservices/flight-booking/pakyongtokolkata',
  '/ourservices/flight-booking',
  '/inner-line-permit/arunachal-inner-line-permit',
  '/inner-line-permit/nagaland-inner-line-permit',
  '/sikkim_permit_guide',
  '/blogs',
  '/newsandannouncements',
  '/flightfinalsection',
  '/sellyourcar',
  '/vehicle-registration-form',
  '/destinations/wards-lake-shillong',
  '/japantour',
  '/ourservices/Luxury-Shared-Cabs/Guwahati_To_Shillong_Shared_Cab_Service',
  '/destinations/aritarlake',
  '/destinations/babamandir'
];

// Function to fetch data from API
function fetchFromAPI(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Function to generate dynamic routes
async function generateDynamicRoutes() {
  const dynamicRoutes = [];
  
  try {
    // Fetch blog posts for dynamic blog routes
    console.log('Fetching blog posts...');
    try {
      const blogs = await fetchFromAPI('https://cms.wizztest.com/wp-json/wp/v2/posts?per_page=100');
      if (Array.isArray(blogs)) {
        blogs.forEach(blog => {
          if (blog.slug) {
            dynamicRoutes.push(`/blog/${blog.slug}`);
          }
        });
        console.log(`Found ${blogs.length} blog posts`);
      }
    } catch (error) {
      console.warn('Could not fetch blog posts:', error.message);
      // Add some example blog routes if API fails
      dynamicRoutes.push('/blog/example-blog-post-1');
      dynamicRoutes.push('/blog/example-blog-post-2');
    }
    
    // Fetch vehicles for dynamic vehicle routes
    console.log('Fetching vehicles...');
    try {
      const vehicles = await fetchFromAPI('https://cms.wizztest.com/wp-json/wp/v2/buy_sell_cars?per_page=100&status=publish');
      if (Array.isArray(vehicles)) {
        vehicles.forEach(vehicle => {
          if (vehicle.id) {
            dynamicRoutes.push(`/vehicle-details/${vehicle.id}`);
          }
        });
        console.log(`Found ${vehicles.length} vehicles`);
      }
    } catch (error) {
      console.warn('Could not fetch vehicles:', error.message);
      // Add some example vehicle routes if API fails
      for (let i = 1; i <= 10; i++) {
        dynamicRoutes.push(`/vehicle-details/${i}`);
      }
    }
    
    // Flight list types (common types)
    const flightTypes = ['FLIGHT'];
    flightTypes.forEach(type => {
      dynamicRoutes.push(`/flightlist/${type}`);
    });
    
    // Result page routes (example combinations)
    // Note: These are highly dynamic based on actual order IDs, amounts, and types
    // You may want to fetch these from your database/API
    const resultTypes = ['booking', 'payment', 'confirmation'];
    for (let i = 1; i <= 5; i++) {
      resultTypes.forEach(type => {
        dynamicRoutes.push(`/result/order${i}/1000${i}/${type}`);
      });
    }
    
  } catch (error) {
    console.error('Error generating dynamic routes:', error);
  }
  
  return dynamicRoutes;
}

// Main function to generate routes.txt
async function generateRoutesFile() {
  console.log('Generating routes.txt...');
  
  // Get dynamic routes
  const dynamicRoutes = await generateDynamicRoutes();
  
  // Combine all routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  
  // Remove duplicates and sort
  const uniqueRoutes = [...new Set(allRoutes)].sort();
  
  // Write to file
  const routesContent = uniqueRoutes.join('\n');
  fs.writeFileSync('routes.txt', routesContent);
  
  console.log(`\n✅ Successfully generated routes.txt`);
  console.log(`   Total routes: ${uniqueRoutes.length}`);
  console.log(`   Static routes: ${staticRoutes.length}`);
  console.log(`   Dynamic routes: ${dynamicRoutes.length}`);
  console.log(`\n   File saved to: ${process.cwd()}/routes.txt`);
}

// Run the script
generateRoutesFile().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

