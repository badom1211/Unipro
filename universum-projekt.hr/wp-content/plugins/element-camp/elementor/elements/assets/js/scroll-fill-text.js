(function ($) {
    "use strict";

    function tcElementsHeading($scope, $) {
        const scrollFillElement = $scope.find(".tce-scroll-fill");
        if (scrollFillElement.length === 0) {
            return; // Exit early if no scroll fill elements
        }

        if (typeof ScrollTrigger === 'undefined' || typeof SplitText === 'undefined') {
            return; // Exit silently if dependencies are missing
        }

        gsap.registerPlugin(ScrollTrigger);

        const split = new SplitText(scrollFillElement[0], { type: "lines" });

        function animateLines() {
            split.lines.forEach((target) => {
                gsap.to(target, {
                    backgroundPositionX: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: target,
                        scrub: 1,
                        start: "top center",
                        end: "bottom center",
                    },
                });
            });
        }

        animateLines();

        window.addEventListener("resize", () => {
            split.revert();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            split.split();
            animateLines();
        });
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tcgelements-heading.default', tcElementsHeading);
    });

})(jQuery);