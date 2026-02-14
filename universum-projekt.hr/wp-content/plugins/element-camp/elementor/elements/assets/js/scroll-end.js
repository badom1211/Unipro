(function ($) {
    "use strict";

    function elementcamp_split_text($scope, $) {
        const scrollEnd = $scope.find('.tce-scroll-end');
        if (scrollEnd.length) {

            let trigger = scrollEnd.data('scroll-trigger')
                ? $(scrollEnd.data('scroll-trigger'))
                : scrollEnd;

            let start = scrollEnd.data('scroll-start') || "center center";
            let endTrigger = scrollEnd.data('scroll-end-trigger')
                ? $(scrollEnd.data('scroll-end-trigger'))
                : scrollEnd.parent().parent();

            let end = scrollEnd.data('scroll-end') || "bottom bottom";

            // Check if ScrollTrigger is defined
            const initScrollTrigger = function () {
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.create({
                        trigger: trigger,
                        start: start,
                        endTrigger: endTrigger,
                        end: end,
                        pin: true,
                    });
                } else {
                    setTimeout(initScrollTrigger, 100);  // Retry every 100ms until ScrollTrigger is available
                }
            };

            initScrollTrigger();
        }
    }

    // Initialize the script on both frontend and editor
    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tcgelements-heading.default', elementcamp_split_text);
    });

})(jQuery);
