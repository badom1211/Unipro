(function ($) {
    "use strict";

    function initLettersLineAnimation($scope) {
        const lettersLineElements = $scope.find('.tcgelements-heading.tce-letters-line');

        if (!lettersLineElements.length) return;

        // Process text nodes to wrap words and letters
        function processTextNodes(element) {
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.trim() !== '') {
                    textNodes.push(node);
                }
            }

            textNodes.forEach(textNode => {
                const text = textNode.textContent;
                const parent = textNode.parentNode;

                // Split by spaces but keep the spaces
                const words = text.split(/(\s+)/);

                const fragment = document.createDocumentFragment();

                words.forEach(word => {
                    if (word.trim() === "") {
                        // Keep whitespace as text node
                        const space = document.createTextNode(word);
                        fragment.appendChild(space);
                    } else {
                        // Create word span
                        const wordSpan = document.createElement('span');
                        wordSpan.className = 'word';
                        wordSpan.style.display = 'inline-block';
                        wordSpan.style.whiteSpace = 'nowrap';

                        // Split word into letters
                        word.split("").forEach(char => {
                            const span = document.createElement('span');
                            span.className = 'letter';
                            span.style.display = 'inline-block';
                            span.textContent = char;
                            wordSpan.appendChild(span);
                        });

                        fragment.appendChild(wordSpan);
                    }
                });

                parent.replaceChild(fragment, textNode);
            });
        }

        lettersLineElements.each(function (index) {
            const title = this;

            // Skip if already processed
            if (title.dataset.lettersProcessed === "true") return;
            title.dataset.lettersProcessed = "true";

            // If the element is empty, nothing to do
            if (!title.hasChildNodes()) return;

            // Process all text nodes
            processTextNodes(title);

            // Get animation settings from data attributes
            const duration = parseFloat($(title).data('letters-duration')) || 0.6;
            const stagger = parseFloat($(title).data('letters-stagger')) || 0.03;
            const yOffset = parseFloat($(title).data('letters-y-offset')) || 50;
            const trigger = $(title).data('letters-trigger') || title;
            const startPosition = $(title).data('letters-start') || "top 80%";

            // Apply GSAP animation
            if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
                // Add a small delay to ensure DOM is ready
                setTimeout(() => {
                    gsap.from(title.querySelectorAll(".letter"), {
                        scrollTrigger: {
                            id: `letters-${Date.now()}-${index}`,
                            trigger: trigger,
                            start: startPosition,
                            toggleActions: "play none none reverse"
                        },
                        opacity: 0,
                        y: yOffset,
                        duration: duration,
                        stagger: stagger,
                        ease: "power4.out"
                    });

                    // Refresh ScrollTrigger after animation setup
                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.refresh();
                    }
                }, 100);
            }
        });
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction(
            'frontend/element_ready/tcgelements-heading.default',
            initLettersLineAnimation
        );
    });

})(jQuery);