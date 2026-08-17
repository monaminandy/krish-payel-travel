let scrollTopBtn = document.getElementById("scrollTopBtn");

window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
}

scrollTopBtn.onclick = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav_links")

hamburger.addEventListener("click", () =>{
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

document.querySelectorAll(".link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}))

const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration: 1000
}

// header container
ScrollReveal().reveal(".header_container h1", scrollRevealOption)

ScrollReveal().reveal(".header_container h4", {
    ...scrollRevealOption,
    delay: 500,
})

ScrollReveal().reveal(".header_container .btn", {
    ...scrollRevealOption,
    delay: 1000,
})

const images = [
    'url("assets/header.jpg")',
    'url("assets/header-1.jpg")',
    'url("assets/header-2.jpg")',
    'url("assets/header-3.jpg")',
    'url("assets/header-4.jpg")',
    'url("assets/header-5.jpg")',
];
let currentIndex = 0;
let nextIndex = 1;
const bgLayer1 = document.getElementById('bg-layer-1');
const bgLayer2 = document.getElementById('bg-layer-2');

// Function to change the background image with a crossfade effect
function changeBackgroundImage() {
    // Set the next image on the hidden layer
    if (nextIndex % 2 === 0) {
        bgLayer1.style.backgroundImage = `
            linear-gradient(to top, var(--primary-color), transparent),
            ${images[currentIndex]}
        `;
        bgLayer1.style.opacity = 1;
        bgLayer2.style.opacity = 0;
    } else {
        bgLayer2.style.backgroundImage = `
            linear-gradient(to top, var(--primary-color), transparent),
            ${images[currentIndex]}
        `;
        bgLayer2.style.opacity = 1;
        bgLayer1.style.opacity = 0;
    }

    // Move to the next image in the array
    currentIndex = (currentIndex + 1) % images.length;
    nextIndex++;
}

// Change image every 5 seconds
setInterval(changeBackgroundImage, 5000);

// Initial background image set
bgLayer1.style.backgroundImage = `
    linear-gradient(to top, var(--primary-color), transparent),
    ${images[0]}
`;

//about

ScrollReveal().reveal(".about_container .section_header",scrollRevealOption)
ScrollReveal().reveal(".about_container .section_subheader",{
    ...scrollRevealOption,
    delay: 500,
})

ScrollReveal().reveal(".about_container .about_flex",{
    ...scrollRevealOption,
    delay: 1000,
})

ScrollReveal().reveal(".about_container .btn",{
    ...scrollRevealOption,
    delay: 1200,
})

document.getElementById("read-more-btn").addEventListener("click", function() {
    var moreText = document.getElementById("more-text");
    var btnText = document.getElementById("read-more-btn");

    if (moreText.style.display === "none") {
        moreText.style.display = "inline";
        btnText.innerHTML = "Read Less";
    } else {
        moreText.style.display = "none";
        btnText.innerHTML = "Read More";
    }
});

// discover

ScrollReveal().reveal(".discover_card",{
    ...scrollRevealOption,
    interval: 500,
})

ScrollReveal().reveal(".discover_card_content",{
    ...scrollRevealOption,
    interval: 500,
    delay: 200
})


//blogs

ScrollReveal().reveal(".blogs_card", {
    duration: 500,
    interval: 200
})

document.querySelectorAll('.blogs_card').forEach(container => {
    container.addEventListener('mouseenter', () => {
        container.querySelector('img').classList.add('hover-enlarge');
    });

    container.addEventListener('mouseleave', () => {
        container.querySelector('img').classList.remove('hover-enlarge');
    });
});

//journals
ScrollReveal().reveal(".journals_card",{
    ...scrollRevealOption,
    interval: 500,
    delay: 200
})

// form

const form = document.querySelector('form');
const fullName = document.getElementById("name")
const email = document.getElementById("email")
const phone = document.getElementById("phone")
const subject = document.getElementById("subject")
const message = document.getElementById("message")



function sendEmail() {

    const bodyMessage = `Full Name : ${fullName.value}<br> Email: ${email.value}<br> Phone Number: ${phone.value}<br> Message: ${message.value}`
    Email.send({
        SecureToken : "1671f5c7-dfc7-48d1-85f0-495da7c7a527",
        // Host : "smtp.elasticemail.com",
        // Username : "krishnendusetter@gmail.com",
        // Password : "1E4F6CF9C4A44EB5BFFA8AE26E2374480A98",
        To : 'krishnendusetter@gmail.com',
        From : "krishnendusetter@gmail.com",
        Subject : subject.value,
        Body : bodyMessage
    }).then(
      message => {
        if (message == "OK") {
            Swal.fire({
                title: "Success!",
                text: "Message sent successfully!",
                icon: "success"
              });
        }
      }
    );
}

function checkInputs(){
    const items = document.querySelectorAll('.item');

    for (const item of items){
        if (item.value == ""){
            item.classList.add("error");
            item.parentElement.classList.add("error");
        }

        if (items[1].value != ""){
            checkEmail();
        }

        items[1].addEventListener("keyup", () => {
            checkEmail();
        })

        item.addEventListener("keyup", () => {
            if (item.value != ""){
                item.classList.remove("error");
                item.parentElement.classList.remove("error");
            }
            else{
                item.classList.add("error");
                item.parentElement.classList.add("error");
            }
        })
    }
}

function checkEmail(){
    const emailRegex = /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/;

    const errorTxtEmail = document.querySelector(".error-txt.email");


    if (!email.value.match(emailRegex)){
        email.classList.add("error");
        email.parentElement.classList.add("error");

        if (email.value != '') {
            errorTxtEmail.innerHTML = 'Enter a valid email address';
        }
        else{
            errorTxtEmail.innerHTML = "Email Address can't be blank";
        }
    }
    else{
        email.classList.remove("error");
        email.parentElement.classList.remove("error");
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    checkInputs();

    if (!fullName.classList.contains("error") && !email.classList.contains("error") && !subject.classList.contains("error") && !phone.classList.contains("error") && !message.classList.contains("error")){
        sendEmail();
        form.reset();
        return false;
    }

});

//carousel

$('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    autoplay:true,
    autoplayTimeout:2500,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        1000:{
            items:3
        }
    }
})

//map 
//map section_subheader
ScrollReveal().reveal(".map", {
    duration: 500,
    interval: 200
})


