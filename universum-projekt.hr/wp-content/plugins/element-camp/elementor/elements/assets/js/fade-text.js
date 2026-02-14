(function ($) {
    "use strict";

    function initFadeTextAnimation($scope) {
        const fadeTextElements = $scope.find('.tcgelements-heading.tce-fade-text');

        if (!fadeTextElements.length) return;

        fadeTextElements.each(function() {
            const element = $(this)[0];
            const autoTrigger = element.dataset.fadeAuto === 'yes';

            // Split text into spans for each character
            let text = element.textContent.trim();
            element.innerHTML = text.split("").map(char =>
                `<span class="char" style="display:inline-block; opacity:0">${char === " " ? "&nbsp;" : char}</span>`
            ).join("");

            const chars = element.querySelectorAll('.char');

            if (autoTrigger) {
                // Check if preloader exists
                const hasPreloader = $('.loader-wrap').length > 0;

                $(window).on('load', function() {
                    // Use delay only if preloader exists
                    const delay = hasPreloader ? 1000 : 400;

                    setTimeout(() => {
                        if (typeof gsap !== 'undefined') {
                            gsap.fromTo(chars,
                                { y: 100, opacity: 0 },
                                {
                                    y: 0,
                                    opacity: 1,
                                    duration: 0.8,
                                    stagger: {
                                        each: 0.04,
                                        from: "center"
                                    },
                                    ease: "power2.out"
                                }
                            );
                        }
                    }, delay);
                });
            }
        });
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction(
            'frontend/element_ready/tcgelements-heading.default',
            initFadeTextAnimation
        );
    });

})(jQuery);