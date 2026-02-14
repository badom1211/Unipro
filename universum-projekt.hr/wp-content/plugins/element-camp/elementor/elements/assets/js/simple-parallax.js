(function ($) {
    "use strict";

    function elementcamp_image_simple_parallax($scope, $) {
        // Wait for document to be fully ready
        $(document).ready(function() {
            // Check if SimpleParallax exists
            if (typeof simpleParallax === 'undefined') {
                console.log('SimpleParallax library not loaded');
                return;
            }

            const parallaxContainer = $scope.find('.tce-simple-parallax');

            if (parallaxContainer.length === 0) {
                return;
            }

            // Make sure images are loaded before initializing
            const parallaxImages = parallaxContainer[0].querySelectorAll('img');

            if (parallaxImages.length === 0) {
                return;
            }

            // Wait for images to load
            let loadedImages = 0;
            parallaxImages.forEach(img => {
                if (img.complete) {
                    loadedImages++;
                } else {
                    img.addEventListener('load', () => {
                        loadedImages++;
                        if (loadedImages === parallaxImages.length) {
                            initParallax();
                        }
                    });
                }
            });

            if (loadedImages === parallaxImages.length) {
                initParallax();
            }

            function initParallax() {
                try {
                    new simpleParallax(parallaxImages, {
                        scale: 1.3,
                        delay: 0.4,
                        transition: 'cubic-bezier(0.25, 1, 0.5, 1)'
                    });
                } catch (error) {

                }
            }
        });
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tcgelements-image.default', elementcamp_image_simple_parallax);
    });

})(jQuery);