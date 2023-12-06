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

burgerToggle()