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

class CoverFlow {
  constructor() {
      this.OVERLAP = 0.25;
      this.ROTATION = 45;
      this.DELAY = 250;
      this.SWIPE = 75;
      this.content = [...document.querySelectorAll('div.content')];
      this.index = Math.floor(this.content.length / 2);

      this.init();
  }

  action_flip(show) {
      let current = this.content[this.index];
      let shown = current.classList.contains('selected');
      let change = false;

      if (show && !shown) {
          change = true;
          current.classList.add('selected');
          current.style.transform = `rotateY(180deg) rotateZ(90deg) scale(${window.innerWidth <= 420 ? 1 : 1.2})`;
      } else if (shown && !show) {
          change = true;
          current.style.transform = 'rotateY(0deg)';
          setTimeout(() => { current.classList.remove('selected') }, this.DELAY);
      }

      return change;
  }

  action_prev() {
      if (this.index) {
          this.index--;
          this.action_flow();
      }
  }

  action_next() {
      if (this.content.length > (this.index + 1)) {
          this.index++;
          this.action_flow();
      }
  }

  action_goto(i) {
      if (this.index !== i) {
          this.index = i;
          this.action_flow();
      }
  }

  action_flow() {
      this.content.forEach((c, i) => {
          let transform = '';
          let zindex = '';
          let offset = c.clientWidth * this.OVERLAP;

          if (i < this.index) {
              transform = `translateX(-${offset * (this.index - i)}%) rotateY(${this.ROTATION}deg)`;
              zindex = i;
          } else if (i === this.index) {
              transform = 'rotateY(0deg) translateZ(140px)';
              zindex = this.content.length;
          } else {
              transform = `translateX(${offset * (i - this.index)}%) rotateY(-${this.ROTATION}deg)`;
              zindex = this.content.length - i;
          }

          c.style.transform = transform;
          c.style.zIndex = zindex;
          c.classList.remove('current');
      });

      setTimeout(() => { this.content[this.index].classList.add('current') }, this.DELAY);
  }

  state(event, context) {
    const eventHandlers = {
        'left': () => this.action_flip(false) || this.action_prev(),
        'right': () => this.action_flip(false) || this.action_next(),
        'select': () => context === this.index ? this.action_flip(true) : (this.action_flip(false) || this.action_goto(context)),
        'submit': () => this.action_flip(true),
        'dismiss': () => this.action_flip(false)
    };

    const handler = eventHandlers[event];
    if (handler) {
        handler();
    }
  }


  events() {
      document.addEventListener('keydown', event => {
          const EVENTS = {
              ArrowLeft: 'left',
              ArrowRight: 'right',
              Enter: 'submit',
              Backspace: 'dismiss',
              Escape: 'dismiss'
          };

          this.state(EVENTS[event.key]);
      });

      document.addEventListener('mouseup', event => {
          if (event.target.classList.contains('coverflow')) this.state('dismiss');
      });

      let touched = 0;

      document.addEventListener('touchstart', event => {
          touched = event.changedTouches[0].screenX;
      });

      document.addEventListener('touchend', event => {
          let moved = touched - event.changedTouches[0].screenX;
          if (moved < 0 && Math.abs(moved) > this.SWIPE) this.state('left');
          if (moved > 0 && Math.abs(moved) > this.SWIPE) this.state('right');
      });

      addEventListener('resize', () => this.action_flow());
  }

  init() {
      this.content.forEach((c, i) => {
          c.onclick = () => this.state('select', i);
          c.style.zIndex = this.index === i ? 1 : 0;
      });

      setTimeout(() => this.action_flow(), this.DELAY);
      this.events();
  }
}

new CoverFlow();

function modal(){
  let modal = document.querySelector('.modal');

  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', function(e){
      e.preventDefault()

      modal.classList.add('modal-active')
      modal.style.animation = 'sliderInner .9s ease-in-out forwards'    
    })
  });

  document.querySelector('.close').addEventListener('click', async function(e){
    e.preventDefault()

    
    modal.style.animation = 'sliderOut .9s ease-in-out forwards'  
    await sleep(1300)
    modal.classList.remove('modal-active')
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function addChars(descriptionHtml, content) {
  for (let i = 0; i < content.length; i++) {
    descriptionHtml.innerHTML += content[i]
    await sleep(i / 1.5);
  }
}

async function animationHeroDescription(content){
  let description = document.querySelector('.main-description');
  let contentToView = content || description.innerText
  description.innerHTML = ``
  await addChars(description, contentToView);
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
  animationHeroDescription()
  burgerToggle()
  const slider = new Slider(
    document.querySelector('.who-container'),
    'who-slide',
    'who-dots',
    'who-arrows'
  )
  document.querySelector('.arrow-up').addEventListener('click', function(){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    
  })
  const coverFlow = new CoverFlow();

  modal()
})

