(function ($) {
    "use strict";

    function tcFunkyLettersAnimation($scope, $) {
        $scope.find(".tce-funky-letters").each(function() {
            const title = this;
            const text = title.textContent;
            title.textContent = "";

            // Create span for each letter
            [...text].forEach(letter => {
                const span = document.createElement("span");
                span.textContent = letter;
                title.appendChild(span);
            });

            // Create GSAP timeline
            const tl = gsap.timeline({
                repeat: -1,
                repeatDelay: 1
            });

            tl.to(title.querySelectorAll("span"), {
                opacity: 1,
                scaleY: 1,
                duration: 0.8,
                ease: "back.out(2)",
                stagger: 0.05
            })
                .to(title.querySelectorAll("span"), {
                    opacity: 0,
                    scaleY: 0.5,
                    duration: 0.5,
                    ease: "power2.in",
                    stagger: 0.05
                }, "+=2");
        });
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tcgelements-heading.default', tcFunkyLettersAnimation);
    });

})(jQuery);