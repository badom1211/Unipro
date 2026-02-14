(function($) {
    "use strict";
    $(document).ready(function() {
        if (typeof ScrollTrigger === 'undefined') {
            $(".tc-sticky-item").stick_in_parent();
            $(".tc-sticky-inparent").stick_in_parent();
            $(".tc-sticky-sidebar").stick_in_parent();
        }
    });
})(jQuery);