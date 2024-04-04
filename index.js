document.addEventListener("DOMContentLoaded", function () {
  // move Intro Marquee to the bottom of the view
  const introMarqueeBox = document.querySelector(".intro-heading");
  const introMarqueeTop =
    window.innerHeight - introMarqueeBox.offsetHeight - 60;
  introMarqueeBox.style.top = introMarqueeTop + "px";
  // registrap GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, CustomEase);
  // setup ScrollSmoother
  ScrollSmoother.create({
    content: ".smooth-content",
    smooth: 1,
    effects: true,
    smoothTouch: 0.1,
    normalizeScroll: true,
  });
  // Intro animation
  let lottieContainer = document.querySelectorAll(".animation");
  if (lottieContainer) {
    // prepare Intro animation parameters
    let playhead = { frame: 1 };
    const st = {
      trigger: ".animation",
      start: "top top",
      endTrigger: ".end-lottie",
      end: `bottom top+=${document.querySelector(".animation").offsetHeight}`,
      renderer: "svg",
      target: ".animation",
      scrub: 1,
      pin: true,
    };
    const target = gsap.utils.toArray(".animation")[0];
    // load Lottie animation
    const animation = lottie.loadAnimation({
      container: target,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "https://uploads-ssl.webflow.com/660aee73a584ecf388b55a2f/660d2f539e3474924b48030b_intro-lottie.json",
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    });
    animation.addEventListener("DOMLoaded", function () {
      const playOnScroll = function () {
        gsap.fromTo(
          playhead,
          { frame: animation.totalFrames - 1 },
          {
            frame: 1,
            ease: "none",
            onUpdate: () => {
              //console.log("playhead.frame", playhead.frame);
              animation.goToAndStop(playhead.frame, true);
            },
            scrollTrigger: st,
          }
        );
        return () => animation.destroy && animation.destroy();
      };
      // play forward animation on page load and activate ScrollTrigger after completed
      gsap.to(playhead, {
        frame: animation.totalFrames - 1,
        ease: CustomEase.create(
          "custom",
          "M0,0 C0,0 0.128,0.152 0.163,0.183 0.205,0.22 0.339,0.409 0.373,0.453 0.413,0.505 0.464,0.567 0.489,0.607 0.513,0.646 0.572,0.703 0.602,0.732 0.634,0.764 0.644,0.799 0.675,0.835 0.712,0.878 0.72,0.88 0.759,0.91 0.804,0.944 0.811,0.943 0.863,0.962 0.923,0.983 1,1 1,1 "
        ),
        onUpdate: () => {
          //console.log("playhead.frame", playhead.frame);
          animation.goToAndStop(playhead.frame, true);
        },
        duration: 1.2,
        onComplete: () => {
          document.querySelector(".hidden-in-intro").style.display = "block";
          playOnScroll();
        },
      });
    });
    // Intro Marquee animation
    const marqueeWidthTotal =
      document.querySelector(".running-heading").scrollWidth;

    // duplicate Marquee content
    const introMarquee = document.querySelector("#intro-marquee");
    console.log({ introMarquee });

    const marqueeContent = introMarquee.firstElementChild;
    console.log({ marqueeContent });

    const marqueeContentClone = marqueeContent.cloneNode(true);
    introMarquee.append(marqueeContentClone);

    gsap.fromTo(
      ".running-heading",
      { x: window.innerWidth },
      {
        x: -(marqueeWidthTotal - window.innerWidth),
        duration: 8,
        ease: "none",
        repeat: -1,
      }
    );
  }
});
function debounce(f) {
  var timer;
  return function (e) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(f, 300, e);
  };
}
// reload page on screen resize
window.addEventListener(
  "resize",
  debounce(function (e) {
    window.location.reload();
  })
);
