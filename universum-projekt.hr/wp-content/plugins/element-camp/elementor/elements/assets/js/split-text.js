(function ($) {
    "use strict";

    function elementcamp_split_text($scope, $) {
        const splits = $scope.find('.tce-split-txt').get();
        if (splits.length > 0) {
            splits.forEach((div) => {
                const text = div.textContent;
                div.innerHTML = '';
                for (let i = 0; i < text.length; i++) {
                    const span = document.createElement('span');
                    span.textContent = text[i];
                    div.appendChild(span);
                }

                const spans = $(div).find('span').get();
                const duration = $(div).data('split-duration');
                const defaultColor = $(div).data('split-color');
                const defaultFilter = $(div).data('split-filter');
                const defaultTrigger = $(div).parent();

                const color = $('body').hasClass('tcg-dark-mode') && $(div).data('split-color-dark')
                    ? $(div).data('split-color-dark')
                    : defaultColor;

                const filter = $('body').hasClass('tcg-dark-mode') && $(div).data('split-filter-dark')
                    ? $(div).data('split-filter-dark')
                    : defaultFilter;

                const trigger = $(div).data('split-trigger')
                    ? $($(div).data('split-trigger'))
                    : defaultTrigger;

                const start = $(div).data('split-start') || "top 80%";
                const end = $(div).data('split-end') || "100%";

                spans.forEach((span, i) => {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: trigger[0],
                            start,
                            end,
                            scrub: true,
                        },
                    });

                    tl.to(span, {
                        color,
                        filter,
                        duration,
                        delay: i * 0.8,
                    }).to(span, {
                        color: "transparent",
                        filter: "drop-shadow(0px 0px 30px rgba(255, 255, 255, 0))",
                        duration,
                    });
                });
            });
        }
    }

    // Initialize the script on both frontend and editor
    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tcgelements-heading.default', elementcamp_split_text);
    });

})(jQuery);
