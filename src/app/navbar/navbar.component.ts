import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface NavigationItem {
  name: string;
  hasDropdown: boolean;
  link?: string;
  dropdownItems?: { name: string; link: string }[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchQuery: string = '';
  isMobileMenuOpen = false;
  isSearchOpen = false;
  activeDropdown: string | null = null;
  activeMobileAccordion: string | null = null; // Separate accordion state for mobile
  
  // Mobile navbar scroll behavior
  lastScrollTop = 0;
  isNavbarVisible = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  // Desktop Navigation items
  desktopNavigationItems: NavigationItem[] = [
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
      link: '/applyforjob',
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
        { name: 'Investor Center', link: '/applyforjob/partnerwithus/investor' }
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
  ];

  // Mobile Navigation items - can have different items from desktop
  mobileNavigationItems: NavigationItem[] = [
    {
      name: 'Booking',
      hasDropdown: true,
     dropdownItems: [
        { name: 'Shared', link: '/shared' },
        { name: 'Reserved', link: '/reserved' },
        { name: 'Flight', link: '/flight' }
     ]
    },
    {
      name: 'Explore ',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Top Destinations', link: '/destinations' },
        { name: 'Blogs', link: '/blogs' },
       
      ]
    },
        {
      name: 'Our Services',
      hasDropdown: false,
      link: '/ourservices'
    },
    
    {
      name: 'Passes & Permits',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Sikkim Inner Line Permit', link: '/sikkim_permit_guide' },
        { name: 'Arunachal Inner Line Permit', link: '/inner-line-permit/arunachal-inner-line-permit' },
        { name: 'Nagaland Inner Line Permit', link: '/inner-line-permit/nagaland-inner-line-permit' }
     ]
     
    },
    {
      name: 'Company',
      hasDropdown: true,
      dropdownItems: [
        { name: 'About Us', link: '/aboutcompany' },
        { name: 'Careers', link: '/applyforjob' },
        { name: 'Collaborate', link: '/applyforjob/partnerwithus/influencer' },
        { name: 'Sell Your Car', link: '/sellyourcar' }
      ]
    },
    {
      name: 'Support',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Cancel Ticket', link: '/cancelticket' },
        { name: 'Contact Us', link: '/contactus' }
      ]
    },
     {
      name: 'Sell Your Car',
      hasDropdown: false,
      link: '/sellyourcar'
    },
  
  ];

  // Toggle mobile menu
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (!this.isMobileMenuOpen) {
      this.activeMobileAccordion = null;
    }
  }

  // Desktop dropdown handlers
  toggleDropdown(itemName: string): void {
    this.activeDropdown = this.activeDropdown === itemName ? null : itemName;
  }

  closeDropdown(): void {
    this.activeDropdown = null;
  }

  handleDesktopClick(item: NavigationItem, event: Event): void {
    if (item.hasDropdown) {
      if (item.link) {
        // Has parent link, allow navigation
        return;
      } else {
        // No parent link, just toggle dropdown
        event.preventDefault();
        this.toggleDropdown(item.name);
      }
    }
  }

  // Mobile accordion handlers
  toggleMobileAccordion(itemName: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.activeMobileAccordion = this.activeMobileAccordion === itemName ? null : itemName;
  }

  isMobileAccordionOpen(itemName: string): boolean {
    return this.activeMobileAccordion === itemName;
  }

  handleMobileItemClick(item: NavigationItem, event: Event): void {
    if (item.hasDropdown) {
      // Toggle accordion
      this.toggleMobileAccordion(item.name, event);
    } else {
      // Navigate and close menu
      this.closeMobileMenu();
    }
  }

  handleMobileDropdownItemClick(link?: string): void {
    if (link) {
      this.router.navigate([link]);
    }
    this.closeMobileMenu();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.activeMobileAccordion = null;
  }

  closeMobileDrawer(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('mobile-nav-drawer')) {
      this.closeMobileMenu();
    }
  }

  // Search handlers
  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen && isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const input = document.querySelector('.sliding-search-input') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 300);
    }
  }

  closeSearch(): void {
    this.isSearchOpen = false;
  }

  onSearchBlur(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      if (!document.querySelector('.sliding-search:hover') && !document.querySelector('.search-btn:hover')) {
        this.isSearchOpen = false;
      }
    }, 200);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Search term:', this.searchQuery.trim());
      // Implement your search logic here
    }
  }

  // Host listeners
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar') && !target.closest('.mobile-nav-drawer')) {
      this.activeDropdown = null;
      this.isMobileMenuOpen = false;
      this.activeMobileAccordion = null;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (isPlatformBrowser(this.platformId) && window.innerWidth > 768) {
      this.isMobileMenuOpen = false;
      this.activeDropdown = null;
      this.activeMobileAccordion = null;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId) || window.innerWidth > 768) {
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const bookingSection = document.getElementById('wr-mobile-booking');
    
    if (scrollTop <= 50) {
      this.isNavbarVisible = true;
      this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      return;
    }
    
    let isInBookingSection = false;
    if (bookingSection) {
      const rect = bookingSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      isInBookingSection = rect.top < windowHeight + 200 && rect.bottom > -200;
    }

    const scrollDifference = scrollTop - this.lastScrollTop;
    
    if (isInBookingSection) {
      this.isNavbarVisible = true;
    } else {
      if (scrollDifference > 5) {
        this.isNavbarVisible = true;
      } else if (scrollDifference < -5) {
        this.isNavbarVisible = false;
      }
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