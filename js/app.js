//  Window scroll sticky class add
function windowScroll() {
  const navbar = document.getElementById("navbar");
  if (
    document.body.scrollTop >= 50 ||
    document.documentElement.scrollTop >= 50
  ) {
    navbar.classList.add("nav-sticky");
  } else {
    navbar.classList.remove("nav-sticky");
  }
}

const navLinks = document.querySelectorAll(".nav-item");
const menuToggle = document.getElementById("navbarCollapse");
navLinks.forEach(l => {
  l.addEventListener("click", () => {
    const bsCollapse = new bootstrap.Collapse(menuToggle);
    bsCollapse.toggle();
  });
});

window.addEventListener("scroll", ev => {
  ev.preventDefault();
  windowScroll();
});

// Smooth scroll
var scroll = new SmoothScroll("#navbar-navlist a", {
  speed: 50,
  offset: 60
});

// Navbar Active Class

var spy = new Gumshoe("#navbar-navlist a", {
  // Active classes
  navClass: "active", // applied to the nav list item
  contentClass: "active", // applied to the content
  offset: 70
});

function fadeIn() {
  var fade = document.getElementById("error-msg");
  var opacity = 0;
  var intervalID = setInterval(function() {
    if (opacity < 1) {
      opacity = opacity + 0.5;
      fade.style.opacity = opacity;
    } else {
      clearInterval(intervalID);
    }
  }, 200);
}

// client-slider

// client-slider

const sliderJudges = tns({
  container: ".slider-jury",
  loop: true,
  items: 1,
  slideBy: "page",
  nav: true,
  navPosition: "bottom",
  autoplay: false,
  speed: 400,
  autoplayButtonOutput: false,
  mouseDrag: true,
  lazyload: true,
  controlsContainer: "#customize-controls-jury",
  responsive: {
    640: {
      items: 2
    },

    768: {
      items: 4
    }
  }
});

const sliderMentors = tns({
  container: ".slider-mentors",
  loop: true,
  items: 1,
  slideBy: "page",
  nav: true,
  navPosition: "bottom",
  autoplay: false,
  speed: 400,
  autoplayButtonOutput: false,
  mouseDrag: true,
  lazyload: true,
  controlsContainer: "#customize-controls-mentors",
  responsive: {
    640: {
      items: 2
    },

    768: {
      items: 4
    }
  }
});
