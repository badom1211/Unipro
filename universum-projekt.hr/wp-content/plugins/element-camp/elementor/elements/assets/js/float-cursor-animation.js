(function ($) {
    "use strict";

    function elementcamp_float_cursor($scope, $) {
        const floatCursorContainers = document.querySelectorAll('.tcgelements-float-cursor-container');
        const isRTL = $('body').css('direction') === 'rtl';

        floatCursorContainers.forEach(container => {
            const floatCursor = container.querySelector('.tcgelements-float-cursor');
            let mouseX = 0, mouseY = 0;
            let isMoving = false;

            // When mouse enters the container
            container.addEventListener('mouseenter', () => {
                floatCursor.style.opacity = '1';
                floatCursor.style.transform = 'scale(1)';
                $(container.closest('.elementor-widget-tcgelements-image')).css('z-index', '20').css('position', 'relative');
            });

            // When mouse moves within the container
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                mouseX = isRTL ? rect.right - e.clientX - 75 : e.clientX - rect.left - 75;
                mouseY = e.clientY - rect.top - 75;
                isMoving = true;
            });

            // Update cursor position using requestAnimationFrame for smoother performance
            function updateCursor() {
                if (isMoving) {
                    floatCursor.style.left = isRTL ? 'auto' : `${mouseX}px`;
                    floatCursor.style.right = isRTL ? `${mouseX}px` : 'auto';
                    floatCursor.style.top = `${mouseY}px`;
                    isMoving = false;
                }
                requestAnimationFrame(updateCursor);
            }

            updateCursor();  // Start the update loop

            // When mouse leaves the container
            container.addEventListener('mouseleave', () => {
                floatCursor.style.opacity = '0';
                floatCursor.style.transform = 'scale(0)';
                $(container.closest('.elementor-widget-tcgelements-image')).css('z-index', '').css('position', '');
            });
        });
    }

    // Initialize the script on both frontend and editor
    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/global', elementcamp_float_cursor);
    });

})(jQuery);