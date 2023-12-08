class Slider {
  constructor(container, slideClass, dotsContainerClass, arrowsContainerClass){
    this.container = container
    this.slideClass = slideClass
    this.dots = this.container.querySelector(`.${dotsContainerClass}`).querySelectorAll('.dot')

    this.slides = this.container.querySelectorAll(`.${slideClass}`)
    this.maxSlides = this.slides.length
    this.activeSlide = 0

    this.slides.forEach(slide => {
      slide.querySelector(`.${arrowsContainerClass}`).querySelector('.who-left').addEventListener('click', this.leftSlide)
      slide.querySelector(`.${arrowsContainerClass}`).querySelector('.who-right').addEventListener('click', this.rightSlide)
    })

    this.dots.forEach(dot => dot.addEventListener('click', () => {
      this.activeSlide = parseInt(dot.dataset.num)
      this.setActiveSlide(1)
    }))
  }
  
  leftSlide = () => {
    if(this.activeSlide === 0){
      this.activeSlide = this.maxSlides - 1
    }else {
      this.activeSlide--
    }
    this.setActiveSlide(0)
  }
  
  rightSlide = () => {
    if(this.activeSlide === this.maxSlides - 1){
      this.activeSlide = 0
    }else {
      this.activeSlide++   
    }
    this.setActiveSlide(2)
  }

  setActiveSlide(animation){
    this.removeAllActiveSlidesClass(animation)
    this.slides[this.activeSlide].classList.add(`${this.slideClass}-active`)
    this.dots[this.activeSlide].classList.add('dot-active')
  }

  removeAllActiveSlidesClass(animation){
    let animations = [
      'sliderNext 1.3s ease-in-out',
      'sliderInner 1.3s ease-in-out',
      'sliderPrev 1.3s ease-in-out',
    ]


    this.slides.forEach(slide => {
      slide.style.animation = animations[animation]
      slide.classList.remove(`${this.slideClass}-active`)
    })
    this.dots.forEach(dot => dot.classList.remove('dot-active'))
  }
}

function burgerToggle() {
  let burger = document.querySelector('.burger'),
    navbarList = document.querySelector('.header-list'),
    navbarLinks = navbarList.querySelectorAll('.header-item');

  navbarLinks.forEach(link => {
    link.addEventListener('click', function(){
      document.documentElement.classList.remove('hidden')
    })
  })

  burger.addEventListener('click', function () {

    burger.classList.toggle('burger-toggle')
    navbarList.classList.toggle('header-active')
    document.documentElement.classList.toggle('hidden')

    navbarLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = ``
      } else {
        link.style.animation = `navLinksFade .5s ease forwards ${index / 7 + 0.4}s`
      }
    })
  })
}



document.addEventListener('DOMContentLoaded', function(){
  burgerToggle()
  const slider = new Slider(
    document.querySelector('.who-container'),
    'who-slide',
    'who-dots',
    'who-arrows'
  )
})

