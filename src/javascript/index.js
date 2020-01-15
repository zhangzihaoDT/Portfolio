import "../sass/style.scss";
import "../sass/main.scss";
import * as d3 from "d3";
import SimpleBreakpoints from "simple-breakpoints";
import browser from "browser-js";
import * as SmoothScroll from "smooth-scroll";

const $window = d3.select("window"),
  $body = document.querySelector("body"),
  $header = document.querySelector("#header"),
  $footer = document.querySelector("#footer"),
  $main = document.querySelector("#main"),
  settings = {
    // Parallax background effect?
    parallax: true,

    // Parallax factor (lower = more intense, higher = less intense).
    parallaxFactor: 20
  };

// Breakpoints.
const breakpoints = new SimpleBreakpoints({
  mobile: 480,
  tablet: 736,
  small_desktop: 980,
  large_desktop: 1280
});

// Play initial animations on page load.
$window.on("load", function() {
  window.setTimeout(function() {
    $body.removeClass("is-preload");
  }, 100);
});

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

if (breakpoints.isSmallDesktop() || breakpoints.isLargeDesktop()) {
  $header.appendChild($footer);
} else if (breakpoints.isMobile() || breakpoints.isTablet()) {
  insertAfter($footer, $main);
}
// Header.

// Parallax background.

// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
if (browser.name == "ie" || browser.mobile) settings.parallax = false;

if (settings.parallax) {
  if (breakpoints.isMobile() || breakpoints.isTablet()) {
    console.log("mobile");
  }

  if (breakpoints.isSmallDesktop() || breakpoints.isLargeDesktop()) {
    console.log("desktop");
    $header.style.backgroundPosition = "left 0px";

    window.onscroll = function() {
      $header.style.backgroundPosition =
        "left " +
        -1 * (parseInt(window.scrollY) / settings.parallaxFactor) +
        "px";
    };
  }

  $window.on("load", function() {
    $window.triggerHandler("scroll");
  });
}

new SmoothScroll('a[href*="#"]', {
  speed: 500,
  ignore: 'a[href="#openModal"]',
  speedAsDuration: true
});
