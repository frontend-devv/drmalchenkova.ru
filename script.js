document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.header__burger')
  const mobileMenu = document.querySelector('.mobile-menu')
  const header = document.querySelector('.header')

  const MOBILE_BREAKPOINT = 768

  let scrollPosition = 0
  let suppressHeaderScroll = false

  function lockBodyScroll() {
    scrollPosition = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition}px`
    document.body.style.width = '100%'
  }

  function unlockBodyScroll() {
    const prevScrollBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'auto'

    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    window.scrollTo(0, scrollPosition)

    document.documentElement.style.scrollBehavior = prevScrollBehavior
  }

  function withoutTransition(el, callback) {
    if (!el) {
      callback()
      return
    }
    el.classList.add('no-transition')
    callback()
    void el.offsetHeight
    el.classList.remove('no-transition')
  }

  function releaseScrollSuppressionSoon() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        suppressHeaderScroll = false
      })
    })
  }

  function openMobileMenu() {
    suppressHeaderScroll = true
    header?.classList.add('menu-open')
    mobileMenu?.classList.add('is-open')
    burger?.classList.add('is-active')
    burger?.setAttribute('aria-expanded', 'true')
    burger?.setAttribute('aria-label', 'Закрыть меню')
    lockBodyScroll()
    syncMobileMenuPosition()

    releaseScrollSuppressionSoon()
  }

  function closeMobileMenu() {
    suppressHeaderScroll = true

    mobileMenu?.classList.remove('is-open')
    burger?.classList.remove('is-active')
    burger?.setAttribute('aria-expanded', 'false')
    burger?.setAttribute('aria-label', 'Открыть меню')
    unlockBodyScroll()

    withoutTransition(header, () => {
      header?.classList.remove('menu-open')
      handleHeaderScroll()
    })

    releaseScrollSuppressionSoon()
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpening = !mobileMenu.classList.contains('is-open')

      if (isOpening) {
        openMobileMenu()
      } else {
        closeMobileMenu()
      }
    })
  }

  document.querySelectorAll('.mobile-menu__link').forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu()
    })
  })

  const heroSection = document.querySelector('.hero')
  const heroImage = document.querySelector('.hero__image--full')
  const heroImageCta = document.querySelector('.hero__image-cta')

  let heroImageWidth = window.innerWidth

  function setHeroImageHeight() {
    if (!heroImage) return

    if (window.innerWidth >= MOBILE_BREAKPOINT) {
      heroImage.style.removeProperty('height')
      heroImage.style.removeProperty('max-height')
      return
    }

    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight
    const value = `${Math.round(vh * 0.6)}px`
    heroImage.style.height = value
    heroImage.style.maxHeight = value
  }

  setHeroImageHeight()

  function syncMobileMenuPosition() {
    if (header && mobileMenu) {
      mobileMenu.style.top = `${header.offsetHeight}px`
    }
  }

  function getScrollThreshold() {
    if (heroImageCta) {
      return heroImageCta.getBoundingClientRect().top + window.scrollY
    }

    if (heroImage) {
      return heroImage.offsetTop + heroImage.offsetHeight
    }

    return heroSection ? heroSection.offsetHeight : 20
  }

  function handleHeaderScroll() {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT

    if (isMobile) {
      const threshold = getScrollThreshold()

      if (window.scrollY > threshold) {
        header.classList.add('is-scrolled')
      } else {
        header.classList.remove('is-scrolled')
      }
    } else {
      header.classList.remove('is-scrolled')
    }

    syncMobileMenuPosition()
  }

  function onWindowScroll() {
    if (suppressHeaderScroll) return
    handleHeaderScroll()
  }

  syncMobileMenuPosition()
  handleHeaderScroll()

  window.addEventListener('resize', () => {
    handleHeaderScroll()

    if (window.innerWidth >= MOBILE_BREAKPOINT && mobileMenu?.classList.contains('is-open')) {
      closeMobileMenu()
    }

    if (window.innerWidth !== heroImageWidth) {
      heroImageWidth = window.innerWidth
      setHeroImageHeight()
    }
  })

  window.addEventListener('orientationchange', () => {
    setTimeout(setHeroImageHeight, 150)
  })

  window.addEventListener('scroll', onWindowScroll, { passive: true })

  header?.addEventListener('transitionend', syncMobileMenuPosition)

  const track = document.querySelector('.about__carousel-track')
  const dots = document.querySelectorAll('.about__dot')
  const prevBtn = document.querySelector('.about__carousel-prev')
  const nextBtn = document.querySelector('.about__carousel-next')

  if (track && dots.length) {
    function getSlideStep() {
      const item = track.querySelector('.about__carousel-item')
      return item ? item.offsetWidth : 0
    }

    nextBtn?.addEventListener('click', () => {
      track.scrollBy({ left: getSlideStep(), behavior: 'smooth' })
    })

    prevBtn?.addEventListener('click', () => {
      track.scrollBy({ left: -getSlideStep(), behavior: 'smooth' })
    })

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        track.scrollTo({ left: index * getSlideStep(), behavior: 'smooth' })
      })
    })

    let scrollTimeout
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const step = getSlideStep()
        if (step === 0) return
        const index = Math.round(track.scrollLeft / step)
        dots.forEach((d, i) => d.classList.toggle('about__dot--active', i === index))
      }, 50)
    })
  }

  document.querySelectorAll('.about__details').forEach((details) => {
    const summary = details.querySelector('.about__summary')

    if (summary) {
      summary.addEventListener('click', () => {
        const isOpen = details.classList.toggle('is-open')
        summary.setAttribute('aria-expanded', isOpen)
      })
    }
  })

  const reviewsTrack = document.querySelector('.reviews__track')
  const reviewsDotsContainer = document.querySelector('.reviews__dots')
  const reviewsPrev = document.querySelector('.reviews__prev')
  const reviewsNext = document.querySelector('.reviews__next')

  if (reviewsTrack && reviewsDotsContainer) {
    function getCardStep() {
      const card = reviewsTrack.querySelector('.reviews__card')
      if (!card) return 0
      const gap = parseFloat(getComputedStyle(reviewsTrack).columnGap) || 16
      return card.offsetWidth + gap
    }

    function getMaxScroll() {
      return reviewsTrack.scrollWidth - reviewsTrack.clientWidth
    }

    function getDotsCount() {
      const step = getCardStep()
      if (step === 0) return 1

      const maxScroll = getMaxScroll()
      if (maxScroll <= 5) return 1

      return Math.ceil(maxScroll / step) + 1
    }

    function renderDots() {
      reviewsDotsContainer.innerHTML = ''
      const count = getDotsCount()

      for (let i = 0; i < count; i++) {
        const dot = document.createElement('button')
        dot.classList.add('reviews__dot')
        dot.setAttribute('aria-label', `Отзыв ${i + 1}`)
        if (i === 0) dot.classList.add('reviews__dot--active')

        dot.addEventListener('click', () => {
          const maxScroll = getMaxScroll()
          const target = Math.min(i * getCardStep(), maxScroll)
          reviewsTrack.scrollTo({ left: target, behavior: 'smooth' })
        })

        reviewsDotsContainer.appendChild(dot)
      }
    }

    renderDots()

    reviewsNext?.addEventListener('click', () => {
      reviewsTrack.scrollBy({ left: getCardStep(), behavior: 'smooth' })
    })

    reviewsPrev?.addEventListener('click', () => {
      reviewsTrack.scrollBy({ left: -getCardStep(), behavior: 'smooth' })
    })

    let reviewsScrollTimeout
    reviewsTrack.addEventListener('scroll', () => {
      clearTimeout(reviewsScrollTimeout)
      reviewsScrollTimeout = setTimeout(() => {
        const step = getCardStep()
        if (step === 0) return

        const dots = reviewsDotsContainer.querySelectorAll('.reviews__dot')
        let index = Math.round(reviewsTrack.scrollLeft / step)
        index = Math.min(index, dots.length - 1)

        dots.forEach((d, i) => d.classList.toggle('reviews__dot--active', i === index))
      }, 50)
    })

    let reviewsResizeTimeout
    window.addEventListener('resize', () => {
      clearTimeout(reviewsResizeTimeout)
      reviewsResizeTimeout = setTimeout(renderDots, 150)
    })

    window.addEventListener('load', renderDots)
  }

  const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link')
  const sections = document.querySelectorAll('section[id]')

  let headerHeight = document.querySelector('.header')?.offsetHeight || 80

  function updateActiveNav() {
    const scrollPos = window.scrollY + headerHeight + 50
    let currentId = null

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.id
      }
    })

    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`)
    })
  }

  let ticking = false

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNav()
        ticking = false
      })
      ticking = true
    }
  })

  window.addEventListener('resize', () => {
    headerHeight = document.querySelector('.header')?.offsetHeight || 80
  })

  updateActiveNav()
})
