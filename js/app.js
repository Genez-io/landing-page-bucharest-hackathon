var notification = document.getElementById('custom-notification');
notification.style.display = 'none';

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
  var intervalID = setInterval(function () {
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

// Start of Newsletter
const newsLetterEmailInput = document.getElementById("newsletter-email-input")
const newsLetterBtn = document.getElementById("newsletter-btn")
const checkbox1 = document.getElementById('checkbox1-newsletter');
const checkbox2 = document.getElementById('checkbox2-newsletter');

// Function to check if all conditions are met to enable the button
function checkConditions() {
  const isEmailValid = newsLetterEmailInput.value.trim() !== '';
  const isCheckbox1Checked = checkbox1.checked;
  const isCheckbox2Checked = checkbox2.checked;

  // Add or remove the 'disabled' class based on conditions
  if (isEmailValid && isCheckbox1Checked && isCheckbox2Checked) {
    newsLetterBtn.classList.remove('disabled');
  } else {
    newsLetterBtn.classList.add('disabled');
  }
}

newsLetterEmailInput.addEventListener('input', checkConditions);
checkbox1.addEventListener('change', checkConditions);
checkbox2.addEventListener('change', checkConditions);

function showNotification() {
  notification.style.display = 'block';
  setTimeout(function () {
    notification.style.display = 'none';
  }, 5000); // Hide the notification after 5 seconds
}

newsLetterBtn.addEventListener("click", () => {
  const email = newsLetterEmailInput.value;

  const data = {
    email_address: email,
  };

  const url = "https://ahkxlexqszfsqoe33tl5im4b4y0umhdv.lambda-url.us-east-1.on.aws/HubSpotService/listMembers"

  fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      showNotification();
      newsLetterEmailInput.value = "";
      checkbox1.checked = false;
      checkbox2.checked = false;
    })
    .catch((error) => {
      console.error("Error:", error);
      newsLetterEmailInput.value = "";
      checkbox1.checked = false;
      checkbox2.checked = false;
    });
})
// End of Newsletter