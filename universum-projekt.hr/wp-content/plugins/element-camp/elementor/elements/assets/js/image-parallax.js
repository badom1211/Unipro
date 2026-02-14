(function ($) {
    "use strict";

    function elementcamp_image_parallax($scope, $) {
        var body = document.getElementsByTagName("body")[0];

        // Check if the body element exists
        if (!body) {
            console.error('Body element not found.');
            return;
        }

        // Remove any existing mousemove listeners to prevent duplicates
        if (body.parallaxHandler) {
            body.removeEventListener("mousemove", body.parallaxHandler);
        }

        // Create the parallax handler function
        body.parallaxHandler = function(event) {
            parallaxed(event);
        };

        // Add the mousemove event listener
        body.addEventListener("mousemove", body.parallaxHandler);

        function parallaxed(e) {
            var parallaxElements = document.getElementsByClassName("tcgelements-image tce-mouse-parallax");

            for (var i = 0; i < parallaxElements.length; i++) {
                var element = parallaxElements[i];

                // Get speed from data attribute with fallback to 0.3 for backward compatibility
                var speed = parseFloat(element.getAttribute("data-parallax-speed")) || 0.3;

                // Calculate movement based on mouse position and speed
                var amountMovedX = (e.clientX * -speed) / 8;
                var amountMovedY = (e.clientY * -speed) / 8;

                // Apply the transform
                element.style.transform = 'translate(' + amountMovedX + 'px,' + amountMovedY + 'px)';
            }
        }
    }

    // Alternative approach using CSS custom properties (more performant)
    function elementcamp_image_parallax_css($scope, $) {
        var body = document.getElementsByTagName("body")[0];

        if (!body) {
            console.error('Body element not found.');
            return;
        }

        // Remove any existing mousemove listeners to prevent duplicates
        if (body.parallaxHandlerCSS) {
            body.removeEventListener("mousemove", body.parallaxHandlerCSS);
        }

        body.parallaxHandlerCSS = function(event) {
            var parallaxElements = document.querySelectorAll(".tcgelements-image.tce-mouse-parallax");

            parallaxElements.forEach(function(element) {
                var speed = parseFloat(element.getAttribute("data-parallax-speed")) || 0.3;
                var amountMovedX = (event.clientX * -speed) / 8;
                var amountMovedY = (event.clientY * -speed) / 8;

                // Using CSS custom properties for better performance
                element.style.setProperty('--mouse-x', amountMovedX + 'px');
                element.style.setProperty('--mouse-y', amountMovedY + 'px');
            });
        };

        body.addEventListener("mousemove", body.parallaxHandlerCSS);
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tcgelements-image.default', elementcamp_image_parallax);
    });

    function cleanup() {
        var body = document.getElementsByTagName("body")[0];
        if (body && body.parallaxHandler) {
            body.removeEventListener("mousemove", body.parallaxHandler);
            delete body.parallaxHandler;
        }
        if (body && body.parallaxHandlerCSS) {
            body.removeEventListener("mousemove", body.parallaxHandlerCSS);
            delete body.parallaxHandlerCSS;
        }
    }

    // Optional: Add cleanup when page unloads
    $(window).on('beforeunload', cleanup);

})(jQuery);