import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchQuery: string = '';
  isMobileMenuOpen = false;
  isSearchOpen = false;
  activeDropdown: string | null = null;
  mobileClickCount: { [key: string]: number } = {};
  
  // Mobile navbar scroll behavior
  lastScrollTop = 0;
  isNavbarVisible = true;
  hasReachedBookingSection = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Desktop Navigation items with dropdowns
  navigationItems = [
    {
      name: 'About Us',
      hasDropdown: true,
      link: '/aboutcompany',
      dropdownItems: [
        { name: 'About the Company ', link: '/aboutcompany' },
        { name: 'Our Vision ', link: '/aboutcompany/ourvision' },
        { name: 'Our Commitment ', link: '/aboutcompany/ourcommittment' },
        { name: 'Our Philosophy ', link: '/aboutcompany/ourworkphilosophy' }
      ]
    },
    // {
    //   name: 'Services',
    //   hasDropdown: true,
    //   dropdownItems: [
    //     { name: 'Shared Cabs', link: '/services/shared-cabs' },
    //     { name: 'Reserved Cabs', link: '/services/reserved-cabs' },
    //     { name: 'Flight Booking', link: '/services/flights' },
    //     { name: 'Airport Transfers', link: '/services/airport' }
    //   ]
    // },
    {
      name: 'Contact Us',
      hasDropdown: false,
      link: '/contactus'
    },
    {
      name: 'Careers',
      hasDropdown: true,
      link:'/applyforjob',
      dropdownItems: [
        { name: 'Join our Corporate Team ', link: '/applyforjob' },
        { name: 'Apply for Driver Job ', link: '/applyforjob/driverjob' },
        { name: 'Attach Your Car ', link: '/applyforjob/partnerwithus/car-attachment' },
        { name: 'Become an Agent', link: '/applyforjob/partnerwithus/agent' }
      ]
    },
    {
      name: 'Cancel Ticket',
      hasDropdown: false,
      link: '/cancelticket'
    },
    
    {
      name: 'Collaborate',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Influencer', link: '/applyforjob/partnerwithus/influencer' },
        { name: 'M.I.C.E. Events', link: '/ourservices/corporatepackages' },
        { name: 'Private Events', link: '/applyforjob/partnerwithus/corporate-events' },
        { name: 'Investor Center ', link: '/applyforjob/partnerwithus/investor' },
      ]
    },
    {
      name: 'Blogs',
      hasDropdown: false,
      link: '/blogs'
    },
    // {
    //   name: 'Social',
    //   hasDropdown: false,
    //   link: '/newsandannouncements'
   
    // },
    {
      name: 'Sell Your Car',
      hasDropdown: false,
      link: '/sellyourcar'
    }
  ];

  // Mobile Navigation items (separate array for mobile-specific menu items)
  mobileNavigationItems = [
    {
      name: 'About Us',
      hasDropdown: true,
      link: '/aboutcompany',
      dropdownItems: [
        { name: 'About the Company', link: '/aboutcompany' },
        { name: 'Our Vision', link: '/aboutcompany/ourvision' },
        { name: 'Our Commitment', link: '/aboutcompany/ourcommittment' },
        { name: 'Our Philosophy', link: '/aboutcompany/ourworkphilosophy' }
      ]
    },
    {
      name: 'Contact Us',
      hasDropdown: false,
      link: '/contactus'
    },
    {
      name: 'Careers',
      hasDropdown: true,
      link:'/applyforjob',
      dropdownItems: [
        { name: 'Join our Corporate Team', link: '/applyforjob' },
        { name: 'Apply for Driver Job', link: '/applyforjob/driverjob' },
        { name: 'Attach Your Car', link: '/applyforjob/partnerwithus/car-attachment' },
        { name: 'Become an Agent', link: '/applyforjob/partnerwithus/agent' }
      ]
    },
    {
      name: 'Cancel Ticket',
      hasDropdown: false,
      link: '/cancelticket'
    },
    {
      name: 'Collaborate',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Influencer', link: '/applyforjob/partnerwithus/influencer' },
        { name: 'M.I.C.E. Events', link: '/ourservices/corporatepackages' },
        { name: 'Private Events', link: '/applyforjob/partnerwithus/corporate-events' },
        { name: 'Investor Center', link: '/applyforjob/partnerwithus/investor' },
      ]
    },
    {
      name: 'Blogs',
      hasDropdown: false,
      link: '/blogs'
    },
    {
      name: 'Sell Your Car',
      hasDropdown: false,
      link: '/sellyourcar'
    }
    // Add more mobile-specific menu items here as needed
    // Example:
    // {
    //   name: 'Download App',
    //   hasDropdown: false,
    //   link: '/download-app'
    // },
    // {
    //   name: 'Offers',
    //   hasDropdown: false,
    //   link: '/offers'
    // }
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.activeDropdown = null;
    this.mobileClickCount = {};
  }

  toggleDropdown(itemName: string) {
    this.activeDropdown = this.activeDropdown === itemName ? null : itemName;
  }

  closeDropdown() {
    this.activeDropdown = null;
  }

  handleDesktopClick(item: any, event: Event) {
    if (item.hasDropdown) {
      // If there's a parent link, navigate to it
      if (item.link) {
        // Don't prevent default, let the link work
        return;
      } else {
        // No parent link, just toggle dropdown
        event.preventDefault();
        this.toggleDropdown(item.name);
      }
    }
  }

  handleMobileClick(item: any, event: Event) {
    if (item.hasDropdown) {
      event.preventDefault();
      const clickCount = this.mobileClickCount[item.name] || 0;
      this.mobileClickCount[item.name] = clickCount + 1;

      if (clickCount === 0) {
        // First click - open dropdown
        this.activeDropdown = item.name;
      } else {
        // Second click - navigate to main link
        this.activeDropdown = null;
        this.mobileClickCount[item.name] = 0;
        if (item.link && isPlatformBrowser(this.platformId)) {
          window.location.href = item.link;
        }
      }
    }
  }

  handleMobileDrawerClick(item: any, event: Event) {
    if (item.hasDropdown) {
      event.preventDefault();
      this.toggleDropdown(item.name);
    }
  }

  closeMobileDrawer(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('mobile-nav-drawer')) {
      this.isMobileMenuOpen = false;
      this.activeDropdown = null;
    }
  }

  closeMobileMenuOnClick() {
    this.isMobileMenuOpen = false;
    this.activeDropdown = null;
    this.mobileClickCount = {};
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen && isPlatformBrowser(this.platformId)) {
      // Focus the input after a short delay to allow the animation
      setTimeout(() => {
        const input = document.querySelector('.sliding-search-input') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 300);
    }
  }

  closeSearch() {
    this.isSearchOpen = false;
  }

  onSearchBlur() {
    // Close search after a short delay to allow for clicking the close button
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      if (!document.querySelector('.sliding-search:hover') && !document.querySelector('.search-btn:hover')) {
        this.isSearchOpen = false;
      }
    }, 200);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
    
      console.log('Ready for API implementation - search term:', this.searchQuery.trim());
      
      
    } else {
      console.log('⚠️ Empty search query - no action taken');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar') && !target.closest('.mobile-nav-drawer')) {
      this.activeDropdown = null;
      this.isMobileMenuOpen = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (isPlatformBrowser(this.platformId) && window.innerWidth > 768) {
      this.isMobileMenuOpen = false;
      this.activeDropdown = null;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId) || window.innerWidth > 768) {
      return; // Only for mobile
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const bookingSection = document.getElementById('wr-mobile-booking');
    
    // Always show navbar at the top of the page
    if (scrollTop <= 50) {
      this.isNavbarVisible = true;
      this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      return;
    }
    
    // Check if we're currently in the booking section area (within viewport or slightly above)
    let isInBookingSection = false;
    if (bookingSection) {
      const rect = bookingSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Consider booking section if it's visible in viewport or within 200px above/below
      isInBookingSection = rect.top < windowHeight + 200 && rect.bottom > -200;
    }

    // Determine scroll direction
    const scrollDifference = scrollTop - this.lastScrollTop;
    
    // If we're currently in booking section area, always show navbar
    if (isInBookingSection) {
      this.isNavbarVisible = true;
    } else {
      // Hide navbar when scrolling up, show when scrolling down
      if (scrollDifference > 5) {
        // Scrolling down
        this.isNavbarVisible = true;
      } else if (scrollDifference < -5) {
        // Scrolling up
        this.isNavbarVisible = false;
      }
      // If scroll difference is small, keep current state
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  isMobileView(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return window.innerWidth <= 768;
    }
    return false;
  }
}
