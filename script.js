// document.addEventListener('DOMContentLoaded', () => {
//   // === Бургер-меню ===
//   const burger = document.querySelector('.header__burger')
//   const mobileMenu = document.querySelector('.mobile-menu')

//   if (burger && mobileMenu) {
//     burger.addEventListener('click', () => {
//       mobileMenu.classList.toggle('is-open')
//       burger.classList.toggle('is-active')
//     })
//   }

//   document.querySelectorAll('.mobile-menu__link').forEach((link) => {
//     link.addEventListener('click', () => {
//       mobileMenu?.classList.remove('is-open')
//       burger?.classList.remove('is-active')
//     })
//   })

//   // ✅ Синхронизация позиции мобильного меню с реальной высотой хедера
//   function syncMobileMenuPosition() {
//     const header = document.querySelector('.header')
//     if (header && mobileMenu) {
//       mobileMenu.style.top = `${header.offsetHeight}px`
//     }
//   }

//   syncMobileMenuPosition()
//   window.addEventListener('resize', syncMobileMenuPosition)

//   // === Карусель дипломов (About) ===
//   const track = document.querySelector('.about__carousel-track')
//   const dots = document.querySelectorAll('.about__dot')
//   const prevBtn = document.querySelector('.about__carousel-prev')
//   const nextBtn = document.querySelector('.about__carousel-next')

//   if (track && dots.length) {
//     function getSlideStep() {
//       const item = track.querySelector('.about__carousel-item')
//       return item ? item.offsetWidth : 0
//     }

//     nextBtn?.addEventListener('click', () => {
//       track.scrollBy({ left: getSlideStep(), behavior: 'smooth' })
//     })

//     prevBtn?.addEventListener('click', () => {
//       track.scrollBy({ left: -getSlideStep(), behavior: 'smooth' })
//     })

//     dots.forEach((dot, index) => {
//       dot.addEventListener('click', () => {
//         track.scrollTo({ left: index * getSlideStep(), behavior: 'smooth' })
//       })
//     })

//     let scrollTimeout
//     track.addEventListener('scroll', () => {
//       clearTimeout(scrollTimeout)
//       scrollTimeout = setTimeout(() => {
//         const step = getSlideStep()
//         if (step === 0) return
//         const index = Math.round(track.scrollLeft / step)
//         dots.forEach((d, i) => d.classList.toggle('about__dot--active', i === index))
//       }, 50)
//     })
//   }

//   // === Повышение квалификации (аккордеон) ===
//   document.querySelectorAll('.about__details').forEach((details) => {
//     const summary = details.querySelector('.about__summary')

//     if (summary) {
//       summary.addEventListener('click', () => {
//         const isOpen = details.classList.toggle('is-open')
//         summary.setAttribute('aria-expanded', isOpen)
//       })
//     }
//   })

//   // === Карусель отзывов ===
//   const reviewsTrack = document.querySelector('.reviews__track')
//   const reviewsDotsContainer = document.querySelector('.reviews__dots')
//   const reviewsPrev = document.querySelector('.reviews__prev')
//   const reviewsNext = document.querySelector('.reviews__next')

//   if (reviewsTrack && reviewsDotsContainer) {
//     function getCardStep() {
//       const card = reviewsTrack.querySelector('.reviews__card')
//       if (!card) return 0
//       const gap = parseFloat(getComputedStyle(reviewsTrack).columnGap) || 16
//       return card.offsetWidth + gap
//     }

//     function getMaxScroll() {
//       return reviewsTrack.scrollWidth - reviewsTrack.clientWidth
//     }

//     function getDotsCount() {
//       const step = getCardStep()
//       if (step === 0) return 1

//       const maxScroll = getMaxScroll()
//       if (maxScroll <= 5) return 1

//       return Math.ceil(maxScroll / step) + 1
//     }

//     function renderDots() {
//       reviewsDotsContainer.innerHTML = ''
//       const count = getDotsCount()

//       for (let i = 0; i < count; i++) {
//         const dot = document.createElement('button')
//         dot.classList.add('reviews__dot')
//         dot.setAttribute('aria-label', `Отзыв ${i + 1}`)
//         if (i === 0) dot.classList.add('reviews__dot--active')

//         dot.addEventListener('click', () => {
//           const maxScroll = getMaxScroll()
//           const target = Math.min(i * getCardStep(), maxScroll)
//           reviewsTrack.scrollTo({ left: target, behavior: 'smooth' })
//         })

//         reviewsDotsContainer.appendChild(dot)
//       }
//     }

//     renderDots()

//     reviewsNext?.addEventListener('click', () => {
//       reviewsTrack.scrollBy({ left: getCardStep(), behavior: 'smooth' })
//     })

//     reviewsPrev?.addEventListener('click', () => {
//       reviewsTrack.scrollBy({ left: -getCardStep(), behavior: 'smooth' })
//     })

//     let reviewsScrollTimeout
//     reviewsTrack.addEventListener('scroll', () => {
//       clearTimeout(reviewsScrollTimeout)
//       reviewsScrollTimeout = setTimeout(() => {
//         const step = getCardStep()
//         if (step === 0) return

//         const dots = reviewsDotsContainer.querySelectorAll('.reviews__dot')
//         let index = Math.round(reviewsTrack.scrollLeft / step)
//         index = Math.min(index, dots.length - 1)

//         dots.forEach((d, i) => d.classList.toggle('reviews__dot--active', i === index))
//       }, 50)
//     })

//     let reviewsResizeTimeout
//     window.addEventListener('resize', () => {
//       clearTimeout(reviewsResizeTimeout)
//       reviewsResizeTimeout = setTimeout(renderDots, 150)
//     })

//     window.addEventListener('load', renderDots)
//   }

//   // === Подсветка активного пункта меню ===
//   const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link')
//   const sections = document.querySelectorAll('section[id]')

//   // ✅ теперь пересчитывается, а не фиксируется один раз
//   let headerHeight = document.querySelector('.header')?.offsetHeight || 80

//   function updateActiveNav() {
//     const scrollPos = window.scrollY + headerHeight + 50
//     let currentId = null

//     sections.forEach((section) => {
//       const sectionTop = section.offsetTop
//       const sectionHeight = section.offsetHeight

//       if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
//         currentId = section.id
//       }
//     })

//     navLinks.forEach((link) => {
//       link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`)
//     })
//   }

//   let ticking = false

//   window.addEventListener('scroll', () => {
//     if (!ticking) {
//       window.requestAnimationFrame(() => {
//         updateActiveNav()
//         ticking = false
//       })
//       ticking = true
//     }
//   })

//   window.addEventListener('resize', () => {
//     headerHeight = document.querySelector('.header')?.offsetHeight || 80
//   })

//   updateActiveNav()
// })

document.addEventListener('DOMContentLoaded', () => {
  // === Бургер-меню ===
  const burger = document.querySelector('.header__burger')
  const mobileMenu = document.querySelector('.mobile-menu')

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open')
      burger.classList.toggle('is-active')
    })
  }

  document.querySelectorAll('.mobile-menu__link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.remove('is-open')
      burger?.classList.remove('is-active')
    })
  })

  // ✅ Синхронизация позиции мобильного меню с реальной высотой хедера
  function syncMobileMenuPosition() {
    const header = document.querySelector('.header')
    if (header && mobileMenu) {
      mobileMenu.style.top = `${header.offsetHeight}px`
    }
  }

  syncMobileMenuPosition()
  window.addEventListener('resize', syncMobileMenuPosition)

  function setHeroImageHeight() {
    const heroImage = document.querySelector('.hero__image')
    if (!heroImage) return

    // ✅ применяем только на мобильном (совпадает с брейкпоинтом m.tablet, обычно 768px)
    if (window.innerWidth >= 768) {
      heroImage.style.maxHeight = '' // убираем инлайн-стиль, если он остался с мобильного ресайза
      return
    }

    const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight
    heroImage.style.maxHeight = `${viewportHeight * 0.6}px`
  }

  setHeroImageHeight()

  let orientationTimeout
  window.addEventListener('orientationchange', () => {
    clearTimeout(orientationTimeout)
    orientationTimeout = setTimeout(setHeroImageHeight, 200)
  })

  // ✅ добавьте также пересчёт при обычном resize (переход между брейкпоинтами)
  let heroResizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(heroResizeTimeout)
    heroResizeTimeout = setTimeout(setHeroImageHeight, 150)
  })

  // === Карусель дипломов (About) ===
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

  // === Повышение квалификации (аккордеон) ===
  document.querySelectorAll('.about__details').forEach((details) => {
    const summary = details.querySelector('.about__summary')

    if (summary) {
      summary.addEventListener('click', () => {
        const isOpen = details.classList.toggle('is-open')
        summary.setAttribute('aria-expanded', isOpen)
      })
    }
  })

  // === Карусель отзывов ===
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

  // === Подсветка активного пункта меню ===
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
