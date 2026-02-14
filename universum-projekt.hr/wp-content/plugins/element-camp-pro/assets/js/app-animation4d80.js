(function ($) {
    "use strict";

    // Get Device width
    let device_width = window.innerWidth;

    if (device_width > 100) {

        if (window.location !== window.parent.location) {
            // The page is in an iFrames
            return;
        }

        gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TweenMax, ScrollToPlugin);
        gsap.config({ nullTargetWarn: false, });

        /*====================================================================================*/
        //# image Animation

        $('.tc-anim-parallax').attr(`data-speed`, `1.2`);
        $('.tc-anim-parallax').attr(`data-lag`, `0`);

        /*====================================================================================*/
        //# Create the smooth scroller!

        let skewSetter = gsap.quickTo("skewY"),
            clamp = gsap.utils.clamp(-15, 15);
        const smoother = ScrollSmoother.create({
            smooth: 1.3,
            effects: device_width < 1025 ? false : true,
            smoothTouch: false,
            normalizeScroll: false,
            ignoreMobileResize: true,
            onUpdate: self => skewSetter(clamp(self.getVelocity() / -80)),
            onStop: () => skewSetter(0)
        });

        // Select all anchor links with href starting with "#"
        document.querySelectorAll("a[href^='#']").forEach(anchor => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();

                // Ensure the anchor element is captured, even if a child is clicked
                let targetAnchor = e.target.closest("a[href^='#']");

                // Get the target element based on the href attribute of the closest anchor
                let targetElem = document.querySelector(targetAnchor.getAttribute("href"));

                // Scroll only if the target element exists
                if (targetElem) {
                    gsap.to(window, {
                        scrollTo: {
                            y: targetElem,
                            autoKill: false
                        },
                        duration: 1
                    });
                }
            });
        });

        // Scroll to the target section on page load
        $(window).on("load", function () {
            const hash = window.location.hash; // Get the hash from the URL (e.g., "#section2")
            if (hash) {
                waitForElementToExist(hash).then((elm) => {
                    if (elm) {
                        gsap.to(window, {
                            scrollTo: {
                                y: elm,
                                autoKill: false
                            },
                            duration: 1
                        });
                    }
                });
            }
        });

        if ($('.tc-hscroll-container')[0] && device_width > 1025) {

            $('.tc-hscroll-container').each(function () {

                gsap.registerPlugin(ScrollTrigger);

                let sections = gsap.utils.toArray(".panel");

                gsap.to(sections, {
                    xPercent: -100 * (sections.length - 1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".tc-hscroll-container",
                        pin: true,
                        scrub: 1,
                        // snap: 1 / (sections.length - 1),
                        end: () => "+=" + document.querySelector(".tc-hscroll-container").offsetWidth
                    }
                });
            });
        };

        /*====================================================================================*/
        //# correct the layout hight (top plog padding - _animation.scss) when scroll

        ScrollTrigger.create({
            start: 'top -280',
            end: 99999,
            toggleClass: { className: 'main-content--scrolled', targets: '#smooth-wrapper' }
        });

        $(document).ready(function () {
            if ($('.tc-sticky-item')[0]) {
                ScrollTrigger.create({
                    trigger: '.tc-sticky-item',
                    start: 'top top',
                    pin: '.tc-sticky-item',
                    pinSpacing: false
                });
            }

            $('.tc-sticky-inparent').each(function () {
                $(this).css('transition-duration', '0s');
                ScrollTrigger.create({
                    trigger: this,
                    start: 'top top',
                    endTrigger: $(this).parent(),
                    end: 'bottom bottom',
                    pin: true,
                    pinSpacing: false
                });
            });

            $('.tc-sticky-sidebar').each(function () {
                $(this).css('transition-duration', '0s');
                ScrollTrigger.create({
                    trigger: $(this).parent(),
                    start: 'top top',
                    endTrigger: $(this).parent(),
                    end: 'bottom bottom+=300px',
                    pin: $(this),
                    pinSpacing: true
                });
            });

            if ($('.tc-cards-animation')[0] && device_width > 1025) {
                let cards = gsap.utils.toArray(".tc-cards-animation .tc-card-item, .tc-cards-animation .tcg-dynamic-query-item");

                let stickDistance = 0;

                let firstCardST = ScrollTrigger.create({
                    trigger: cards[0],
                    start: "center center"
                });

                let lastCardST = ScrollTrigger.create({
                    trigger: cards[cards.length - 1],
                    start: "bottom bottom"
                });

                cards.forEach((card, index) => {
                    $(card).css('transition-duration', '0s');
                    var scale = 1 - (cards.length - index) * 0.025;
                    let scaleDown = gsap.to(card, { scale: scale, 'transform-origin': '"50% ' + (lastCardST.start + stickDistance) + '"' });

                    ScrollTrigger.create({
                        trigger: card,
                        start: "center center",
                        end: () => lastCardST.start + stickDistance,
                        pin: true,
                        pinSpacing: false,
                        ease: "none",
                        animation: scaleDown,
                        toggleActions: "restart none none reverse"
                    });
                });
            }
        });

        $(document).ready(function () {
            if (device_width >= 1025) {
                let headerHeight;
                if ($('.site-header > div[data-elementor-type="wp-post"] > div')['0']) {
                    let headerPosition = $('.site-header > div[data-elementor-type="wp-post"] > div').data('settings');
                    if ($('header.site-header')[0] && !headerPosition['position']) {
                        headerHeight = $('.site-header > div[data-elementor-type="wp-post"] > div').outerHeight();
                    } else if ($('.default-header')[0]) {
                        headerHeight = $('.default-header').outerHeight();
                    }
                    // if($('#wpadminbar')[0]) {
                    //     headerHeight += 30;
                    // }
                    $('#smooth-content').css('padding-top', headerHeight);
                }
            }
        });

        /*====================================================================================*/
        //# Line Animation

        let splitTitleLines = gsap.utils.toArray(".tc-anim-lines");

        splitTitleLines.forEach(splitTextLine => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: splitTextLine,
                    start: 'top 90%',
                    end: 'bottom 60%',
                    scrub: false,
                    markers: false,
                    toggleActions: 'play none none none'
                }
            });

            const itemSplitted = new SplitText(splitTextLine, { type: "words, lines" });
            gsap.set(splitTextLine, { perspective: 400 });
            itemSplitted.split({ type: "lines" })
            tl.from(itemSplitted.lines, { duration: 1, delay: 0.3, opacity: 0, rotationX: -80, force3D: true, transformOrigin: "top center -50", stagger: 0.1 });
        });

        /*====================================================================================*/
        //# chars Animation

        let headings = gsap.utils.toArray(".tc-anim-char").reverse();
        headings.forEach((heading, i) => {
            let headingIndex = i + 1;
            let mySplitText = new SplitText(heading, { type: "chars" });
            let chars = mySplitText.chars;

            chars.forEach((char, i) => {
                smoother.effects(char, { lag: (i + headingIndex) * 0.1, speed: 1 });
            });
        });

        /*====================================================================================*/
        //# Offcanvas

        let buttonO = document.querySelector(".toggle-right");
        if (buttonO) {
            buttonO.addEventListener("click", (e) => {
                smoother.paused(true);
                //smoother.kill(); //to remove smooth while keep status (style) 
                //smoother.revert();//to remove smooth while Reset status (to original) 
            });

            let buttonX = document.querySelector(".offcanvas-close");
            buttonX.addEventListener("click", (e) => {
                smoother.paused(false);
            });
        }

        /*====================================================================================*/
        /*====================================================================================*/
        //# Smooth Show more button of archive
        let button = document.querySelector(".tcg-show-more:not(.loading)");
        if (button) {
            button.addEventListener("click", (e) => {
                gsap.to(smoother, {
                    scrollTop: smoother.offset(".tcg-show-more:not(.loading)", "center center"),
                    duration: 2,
                    ease: 'back.out'

                })
            });
        }

        //# smooth Switcher
        // Check if the element exists before adding the event listener
        let buttonOsw = document.querySelector("#smooth-btns > .activated");
        if (buttonOsw) {
            buttonOsw.addEventListener("click", (e) => {
                window.location.reload(); // Reload the page
            });
        }


        let buttonXsw = document.querySelector("#smooth-btns > .stop");
        if (buttonXsw) {
            buttonXsw.addEventListener("click", (e) => {
                smoother.kill();
            });
        }


        //# Mouse Switcher
        let buttonOm = document.querySelector("#cursor-btns > .animated");
        if (buttonOm) {
            buttonOm.addEventListener("click", (e) => {
                $('.mouse-cursor').css('display', 'initial');
            });
        }

        let buttonXm = document.querySelector("#cursor-btns > .standerd");
        if (buttonXm) {
            buttonXm.addEventListener("click", (e) => {
                $('.mouse-cursor').css('display', 'none');
            });
        }
    }

    //# Header top padding
    // Find the parent and child elements
    let parent = document.querySelector('body');
    let child1 = parent.querySelector('.header');

    if (child1 != null) {
        // Check if child1 has the class .abs
        if (child1.classList.contains('white-header')) {
            parent.classList.add('white-header');
        }
    }

    function waitForElementToExist(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                subtree: true,
                childList: true,
            });
        });
    }

    waitForElementToExist('.sticky-wrapper').then((elm) => {
        $('.ginput_container_date').each(function () {
            $(this).find('*').on('click', function () {
                if ($("#ui-datepicker-div").length > 0) {
                    $("#ui-datepicker-div").css("position", "absolute");
                }
            });
        });
    });

})(jQuery);
