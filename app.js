/* ==========================================================================
   TAJ EVENTS & DECORS - JAVASCRIPT
   Interactivity, Lightbox, Filter, Slider, Form Validation, & Scroll FX
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Sticky & Scrolled Header ---
  const header = document.querySelector('header');
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight Active Link on Scroll
    highlightNavLink();
  });

  // --- 2. Mobile Nav Menu Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Animate hamburger lines
      const spans = hamburger.querySelectorAll('span');
      if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.backgroundColor = 'rgba(253, 251, 247, 0.98)';
        navMenu.style.padding = '2rem';
        navMenu.style.borderBottom = '1px solid rgba(197, 160, 89, 0.2)';
        navMenu.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.05)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        navMenu.style.display = '';
      }
    });
  }

  // Close Mobile Menu on Link Click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger && hamburger.classList.contains('active')) {
        hamburger.click();
      }
    });
  });

  // Highlight active link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  function highlightNavLink() {
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.add('active');
      } else {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.remove('active');
      }
    });
  }

  // --- 3. Gallery Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || filterValue === itemCategory) {
          item.classList.remove('hidden');
          // Smooth fade-in
          item.style.animation = 'scaleIn 0.5s ease forwards';
        } else {
          item.classList.add('hidden');
          item.style.animation = '';
        }
      });
    });
  });

  // --- 4. Lightbox (Modal Preview) ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxCaption = document.getElementById('lightbox-caption');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const mediaType = item.getAttribute('data-type');
      const title = item.querySelector('.gallery-item-title').textContent;
      const tag = item.querySelector('.gallery-item-tag').textContent;
      
      lightboxCaption.textContent = `${tag} | ${title}`;
      
      if (mediaType === 'image') {
        const imgPath = item.getAttribute('data-src');
        lightboxImg.src = imgPath;
        lightboxImg.style.display = 'block';
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = '';
      } else if (mediaType === 'video') {
        const videoPath = item.getAttribute('data-src');
        lightboxVideo.src = videoPath;
        lightboxVideo.style.display = 'block';
        lightboxImg.style.display = 'none';
        lightboxImg.src = '';
        lightboxVideo.load();
        lightboxVideo.play().catch(err => console.log("Auto play prevented", err));
      }
      
      lightbox.classList.add('active');
    });
  });

  // Close Lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxVideo.pause();
    // Clear sources after fade transition ends
    setTimeout(() => {
      lightboxImg.src = '';
      lightboxVideo.src = '';
    }, 400);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      // Close only if clicking outside the media element
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
  }

  // Keyboard support (Escape key)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // --- 5. Testimonial Carousel ---
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function startSlideShow() {
    stopSlideShow();
    slideInterval = setInterval(nextSlide, 5000); // Change testimonial every 5 seconds
  }

  function stopSlideShow() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.getAttribute('data-index'));
      showSlide(targetIndex);
      startSlideShow(); // Reset interval
    });
  });

  // Initialize carousel if elements exist
  if (slides.length > 0) {
    showSlide(0);
    startSlideShow();
  }

  // --- 6. Booking Inquiry Form Handler ---
  const bookingForm = document.getElementById('booking-form');
  const formStatus = document.getElementById('form-status');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate form submission animation
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'SUBMITTING...';
      
      // Perform simple validation check
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const date = document.getElementById('event-date').value;
      const type = document.getElementById('event-type').value;

      if (!name || !email || !phone || !date || !type) {
        showStatus('Please fill in all required fields.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      // Simulate a network request (1.5 seconds)
      setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Show success status
        showStatus(`Thank you, ${name}! Your consultation request for a ${type} has been sent successfully. We will contact you within 24 hours.`, 'success');
        
        // Reset form
        bookingForm.reset();
      }, 1500);
    });
  }

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    
    if (type === 'success') {
      formStatus.className = 'form-status success';
    } else {
      formStatus.className = 'form-status error';
      formStatus.style.backgroundColor = 'rgba(217, 83, 79, 0.1)';
      formStatus.style.color = '#d9534f';
      formStatus.style.border = '1px solid rgba(217, 83, 79, 0.2)';
    }

    // Scroll status message into view
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // --- 7. Newsletter Submission Alert ---
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (email) {
        alert(`Thank you for subscribing! Exquisite updates and styling brochures will be sent to: ${email}`);
        emailInput.value = '';
      }
    });
  }

  // --- 8. Intersection Observer for Fade/Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, {
      threshold: 0.15, // Trigger when 15% of element is visible
      rootMargin: '0px 0px -50px 0px' // Slightly offset bottom viewport
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if observer not supported
    revealElements.forEach(element => element.classList.add('active'));
  }

});
