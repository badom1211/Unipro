(function ($) {
    "use strict";

    function elementcamp_scroll_trigger_image($scope, $) {
        const ScrollTriggerAnimations = $scope.find('.tce-scroll-trigger-scale').get();

        if (ScrollTriggerAnimations.length > 0) {
            ScrollTriggerAnimations.forEach(function (animationElement) {
                $(animationElement).css('transition-duration', '0s');
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: animationElement,
                        scrub: true,
                        pin: true,
                        start: "40% 50%",
                        end: "+=100%",
                    }
                })
                    .to($(animationElement).find(".elementor-image"), {
                        clipPath: 'inset(0% 0%)',
                        scale: 1,
                        ease: 'Linear.easeNone'
                    });
            });
        }
    }

    // Initialize the script on both frontend and editor
    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tcgelements-image.default', elementcamp_scroll_trigger_image);
    });

})(jQuery);
