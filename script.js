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

  function setMobileMenuHeight() {
    if (!header || !mobileMenu) return

    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight
    const value = `${Math.round(vh - header.offsetHeight)}px`
    mobileMenu.style.height = value
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
    setMobileMenuHeight()

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

  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu()
    }
  })

  const heroSection = document.querySelector('.hero')
  const heroImage = document.querySelector('.hero__image--full')
  const heroImageCta = document.querySelector('.hero__image-cta')

  function setHeroImageHeight() {
    if (!heroImage) return

    if (window.innerWidth >= MOBILE_BREAKPOINT) {
      heroImage.style.removeProperty('height')
      heroImage.style.removeProperty('max-height')
      return
    }

    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight
    const value = `${Math.round(vh * 0.7)}px`
    heroImage.style.height = value
    heroImage.style.maxHeight = value
  }

  setHeroImageHeight()

  let heroImageIsMobile = window.innerWidth < MOBILE_BREAKPOINT

  const orientationQuery = window.matchMedia('(orientation: portrait)')
  orientationQuery.addEventListener('change', () => {
    setTimeout(setHeroImageHeight, 200)
  })

  function syncMobileMenuPosition() {
    if (header && mobileMenu) {
      mobileMenu.style.top = `${header.offsetHeight}px`
    }
  }

  function getScrollThreshold() {
    const EARLY_OFFSET = 120

    if (heroImageCta) {
      return heroImageCta.getBoundingClientRect().top + window.scrollY - EARLY_OFFSET
    }

    if (heroImage) {
      return heroImage.offsetTop + heroImage.offsetHeight - EARLY_OFFSET
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

    const isMobileNow = window.innerWidth < MOBILE_BREAKPOINT
    if (isMobileNow !== heroImageIsMobile) {
      heroImageIsMobile = isMobileNow
      setHeroImageHeight()
    }
  })

  window.addEventListener('scroll', onWindowScroll, { passive: true })

  header?.addEventListener('transitionend', syncMobileMenuPosition)

  const carouselScrollAnimations = new WeakMap()

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  function getScrollDuration(base = 180) {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    return isMobile ? Math.round(base * 0.6) : base
  }

  function animateScrollTo(el, targetLeft, duration = getScrollDuration(), easing = easeOutCubic) {
    if (!el) return

    const prevFrame = carouselScrollAnimations.get(el)
    if (prevFrame) cancelAnimationFrame(prevFrame)

    const maxScroll = el.scrollWidth - el.clientWidth
    const clampedTarget = Math.max(0, Math.min(targetLeft, maxScroll))

    const startLeft = el.scrollLeft
    const distance = clampedTarget - startLeft

    if (Math.abs(distance) < 1) return

    const prevSnapType = el.style.scrollSnapType
    el.style.scrollSnapType = 'none'

    const startTime = performance.now()

    function step(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      el.scrollLeft = startLeft + distance * easing(progress)

      if (progress < 1) {
        const frameId = requestAnimationFrame(step)
        carouselScrollAnimations.set(el, frameId)
      } else {
        carouselScrollAnimations.delete(el)
        el.style.scrollSnapType = prevSnapType
      }
    }

    const frameId = requestAnimationFrame(step)
    carouselScrollAnimations.set(el, frameId)
  }

  function animateScrollBy(el, deltaLeft, duration = getScrollDuration(), easing = easeOutCubic) {
    if (!el) return
    animateScrollTo(el, el.scrollLeft + deltaLeft, duration, easing)
  }

  // Полноширинные слайды (дипломы) едут дальше за один шаг, чем карточки
  // отзывов — им нужна более длинная и плавная (ease-in-out) анимация,
  // иначе переключение выглядит как рывок.
  function getFullSlideDuration(base = 420) {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    return isMobile ? Math.round(base * 0.75) : base
  }

  // --- Карусель "О враче" (about) ---
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
      animateScrollBy(track, getSlideStep(), getFullSlideDuration(), easeInOutCubic)
    })

    prevBtn?.addEventListener('click', () => {
      animateScrollBy(track, -getSlideStep(), getFullSlideDuration(), easeInOutCubic)
    })

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        animateScrollTo(track, index * getSlideStep(), getFullSlideDuration(), easeInOutCubic)
      })
    })

    // IntersectionObserver вместо debounce на scroll: точка переключается
    // сразу, как только карточка становится видимой, не дожидаясь
    // остановки инерционного скролла на мобильном.
    let aboutCardObserver

    function initAboutCardObserver() {
      if (aboutCardObserver) aboutCardObserver.disconnect()

      const items = Array.from(track.querySelectorAll('.about__carousel-item'))

      aboutCardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = items.indexOf(entry.target)
              if (index === -1) return
              const dotIndex = Math.min(index, dots.length - 1)
              dots.forEach((d, i) => d.classList.toggle('about__dot--active', i === dotIndex))
            }
          })
        },
        {
          root: track,
          threshold: 0.6,
        }
      )

      items.forEach((item) => aboutCardObserver.observe(item))
    }

    initAboutCardObserver()

    let aboutResizeTimeout
    window.addEventListener('resize', () => {
      clearTimeout(aboutResizeTimeout)
      aboutResizeTimeout = setTimeout(initAboutCardObserver, 150)
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

  // --- Карусель отзывов/дипломов (reviews) ---
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

    let reviewsCardObserver

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
          animateScrollTo(reviewsTrack, target)
        })

        reviewsDotsContainer.appendChild(dot)
      }

      initReviewsCardObserver()
    }

    // IntersectionObserver вместо debounce на scroll: точка переключается
    // сразу, как только карточка становится видимой, не дожидаясь
    // остановки инерционного скролла на мобильном.
    function initReviewsCardObserver() {
      if (reviewsCardObserver) reviewsCardObserver.disconnect()

      const cards = Array.from(reviewsTrack.querySelectorAll('.reviews__card'))
      const dotEls = reviewsDotsContainer.querySelectorAll('.reviews__dot')

      reviewsCardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = cards.indexOf(entry.target)
              if (index === -1) return
              const dotIndex = Math.min(index, dotEls.length - 1)
              dotEls.forEach((d, i) => d.classList.toggle('reviews__dot--active', i === dotIndex))
            }
          })
        },
        {
          root: reviewsTrack,
          threshold: 0.6,
        }
      )

      cards.forEach((card) => reviewsCardObserver.observe(card))
    }

    renderDots()

    reviewsNext?.addEventListener('click', () => {
      animateScrollBy(reviewsTrack, getCardStep())
    })

    reviewsPrev?.addEventListener('click', () => {
      animateScrollBy(reviewsTrack, -getCardStep())
    })

    let reviewsResizeTimeout
    window.addEventListener('resize', () => {
      clearTimeout(reviewsResizeTimeout)
      reviewsResizeTimeout = setTimeout(renderDots, 150)
    })

    window.addEventListener('load', renderDots)
  }

  // --- Единая навигация по якорям + подсветка активного пункта ---
  const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link')
  const sections = document.querySelectorAll('section[id]')
  let headerHeight = document.querySelector('.header')?.offsetHeight || 80

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`)
    })
  }

  document.querySelectorAll('.header__logo, .footer__logo').forEach((logo) => {
    logo.addEventListener('click', (e) => {
      e.preventDefault()

      if (mobileMenu?.classList.contains('is-open')) {
        closeMobileMenu()
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })
      history.pushState(null, '', window.location.pathname)

      navLinks.forEach((link) => link.classList.remove('is-active'))
      const checkArrivedTop = () => {
        if (window.scrollY <= 2) {
          handleHeaderScroll()
          return
        }
        requestAnimationFrame(checkArrivedTop)
      }
      requestAnimationFrame(checkArrivedTop)
    })
  })

  let lockedId = null
  let lockReleaseTimeout = null

  function scrollToId(targetId) {
    const cleanId = targetId.replace('#', '')
    const targetEl = document.getElementById(cleanId)
    if (!targetEl) return

    const top = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight

    clearTimeout(lockReleaseTimeout)
    lockedId = cleanId
    setActiveLink(cleanId)

    window.scrollTo({ top, behavior: 'smooth' })
    history.pushState(null, '', `#${cleanId}`)

    const checkArrived = () => {
      if (Math.abs(window.scrollY - top) < 4) {
        lockReleaseTimeout = setTimeout(() => {
          lockedId = null
        }, 150)
        return
      }
      requestAnimationFrame(checkArrived)
    }
    requestAnimationFrame(checkArrived)
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href')
      if (!targetId || !targetId.startsWith('#')) return
      if (!document.getElementById(targetId.slice(1))) return

      e.preventDefault()

      if (link.classList.contains('mobile-menu__link')) {
        closeMobileMenu()
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToId(targetId)
          })
        })
      } else {
        scrollToId(targetId)
      }
    })
  })

  if (sections.length && 'IntersectionObserver' in window) {
    let observer

    function initObserver() {
      if (observer) observer.disconnect()

      observer = new IntersectionObserver(
        (entries) => {
          if (lockedId) return

          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveLink(entry.target.id)
            }
          })
        },
        {
          rootMargin: `-${headerHeight + 1}px 0px -60% 0px`,
          threshold: 0,
        }
      )

      sections.forEach((section) => observer.observe(section))
    }

    initObserver()

    window.addEventListener('resize', () => {
      headerHeight = document.querySelector('.header')?.offsetHeight || 80
      initObserver()
    })
  }
})
