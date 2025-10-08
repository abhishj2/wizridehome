import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  // Navigation items with dropdowns
  navigationItems = [
    {
      name: 'About Us',
      hasDropdown: true,
      link: '/aboutcompany',
      dropdownItems: [
        { name: 'About the Company ', link: '/aboutcompany' },
        { name: 'Our Vision ', link: '/aboutcompany/ourvision' },
        { name: 'Our Commitent ', link: '/aboutcompany/ourcommittment' },
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
        { name: 'Attach Your Car ', link: '/applyforjob/partnerwithus' },
        { name: 'Become an Agent', link: '/applyforjob/partnerwithus' }
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
        { name: 'Influencer', link: '/influencerapply' },
        { name: 'M.I.C.E. Events', link: '/ourservices/corporatepackagesr' },
        { name: 'Private Events', link: '/applyforjob/partnerwithus' },
        { name: 'Investor Center ', link: '/applyforjob/partnerwithus' },
      ]
    },
    {
      name: 'Social',
      hasDropdown: true,
      dropdownItems: [
        { name: 'News & Announcements', link: '/newsandannouncements' },
        { name: 'Related Blogs', link: '/blogs' }
        
      ]
    },
    {
      name: 'Sell Your Car',
      hasDropdown: false,
      link: '/sellyourcar'
    }
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
        if (item.link) {
          window.location.href = item.link;
        }
      }
    }
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen) {
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
    if (!target.closest('.navbar')) {
      this.activeDropdown = null;
      this.isMobileMenuOpen = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth > 768) {
      this.isMobileMenuOpen = false;
      this.activeDropdown = null;
    }
  }
}
