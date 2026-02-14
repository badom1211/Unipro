(function ($) {
    "use strict";

    function tcElementsButton($scope, $) {
        // Existing button hover functionality
        $('.e-parent .elementor-widget-tcgelements-button').parent().on('mouseenter', function () {
            $(this).find('.btn-text-selector-type-container').addClass('tc-button-text-container-active');
        }).on('mouseleave', function () {
            $(this).find('.btn-text-selector-type-container').removeClass('tc-button-text-container-active');
        });

        $scope.parent().on('mouseenter', function () {
            $scope.find('.btn-selector-type-container').addClass('tc-button-container-active');
        }).on('mouseleave', function () {
            $scope.find('.btn-selector-type-container').removeClass('tc-button-container-active');
        });

        $scope.parent().parent().on('mouseenter', function () {
            $scope.find('.btn-selector-type-parent-container').addClass('tc-button-container-active');
        }).on('mouseleave', function () {
            $scope.find('.btn-selector-type-parent-container').removeClass('tc-button-container-active');
        });

        // Parent n level hover
        const element = $scope.find('.tcgelements-button');
        if (element.attr('data-parent-level') !== undefined) {
            let parentLevel = parseInt(element.data('parent-level')) || 1;
            let $parentTarget = $scope;
            for (let i = 0; i < parentLevel; i++) {
                $parentTarget = $parentTarget.parent();
            }
            $parentTarget.on('mouseenter', function () {
                $scope.find('.btn-selector-type-parent-n').addClass('tc-button-container-active');
            }).on('mouseleave', function () {
                $scope.find('.btn-selector-type-parent-n').removeClass('tc-button-container-active');
            });
        }

        // Scroll to top functionality
        $scope.find('.tcgelements-scroll-top').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if ($('body').hasClass('elementor-editor-active') || $('body').hasClass('elementor-editor-preview')) {
                $('.elementor-editor-active, .elementor-editor-preview').animate({ scrollTop: 0 }, 800);
                return false;
            }

            scrollToTop();
            return false;
        });

        function scrollToTop() {
            if (window.pageYOffset <= 10) return;

            if (window.ScrollSmoother && window.ScrollSmoother.get()) {
                window.ScrollSmoother.get().scrollTo(0, true, "power2.out");
                return;
            }

            if (window.gsap && window.ScrollToPlugin) {
                gsap.registerPlugin(ScrollToPlugin);
                gsap.killTweensOf(window, "scrollTo");
                gsap.to(window, {
                    duration: 1.2,
                    scrollTo: { y: 0 },
                    ease: "power2.inOut",
                    onComplete: () => window.ScrollTrigger && ScrollTrigger.refresh()
                });
                return;
            }

            if (window.gsap) {
                gsap.killTweensOf(document.documentElement);
                gsap.to(document.documentElement, {
                    duration: 1.2,
                    scrollTop: 0,
                    ease: "power2.inOut",
                    onComplete: () => window.ScrollTrigger && ScrollTrigger.refresh()
                });
                return;
            }

            const containers = ['#smooth-content', '#smooth-wrapper', '.blank-builder', 'html, body'];
            for (let container of containers) {
                const $container = $(container);
                if ($container.length > 0) {
                    $container.animate({ scrollTop: 0 }, 1200);
                    return;
                }
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Enhanced mouse effects handler
        function initMouseEffects() {
            const parallaxStrength = 40;
            let parallaxTargets = [];
            let glowTargets = [];

            function initButtons() {
                // Initialize parallax buttons
                $('.tce-btn-mouse-parallax').each(function () {
                    const $btn = $(this);
                    if (!$btn.data('parallaxInit')) {
                        $btn.data('parallaxInit', true);
                        parallaxTargets.push({
                            $el: $btn,
                            targetX: 0,
                            targetY: 0,
                            currentX: 0,
                            currentY: 0
                        });

                        $btn.css({
                            transition: 'transform 0s',
                            willChange: 'transform'
                        });
                    }
                });

                // Initialize glow buttons
                $('.tce-btn-glow-effect').each(function () {
                    const $btn = $(this);
                    const $glow = $btn.find('.glow');

                    if ($glow.length && !$btn.data('glowInit')) {
                        $btn.data('glowInit', true);

                        const speed = parseFloat($glow.data('speed')) || 0.3;
                        const glowData = {
                            $btn: $btn,
                            $glow: $glow,
                            speed: speed,
                            leaveSpeed: speed + 0.2
                        };

                        glowTargets.push(glowData);
                        initGlowEffect(glowData);
                    }
                });
            }

            function initGlowEffect(glowData) {
                const { $btn, $glow, speed, leaveSpeed } = glowData;

                // Set initial position
                $glow.css({
                    transform: 'translate(-50%, -50%)',
                    transition: 'opacity 0.3s ease'
                });

                $btn.on('mousemove.glowEffect', function (e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    if (window.gsap) {
                        gsap.to($glow[0], {
                            x: x,
                            y: y,
                            duration: speed,
                            ease: "power3.out"
                        });
                    } else {
                        // Fallback for non-GSAP
                        $glow.css({
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                            transition: `transform ${speed}s cubic-bezier(0.215, 0.61, 0.355, 1)`
                        });
                    }
                });

                $btn.on('mouseleave.glowEffect', function () {
                    if (window.gsap) {
                        gsap.to($glow[0], {
                            x: 0,
                            y: 0,
                            duration: leaveSpeed,
                            ease: "power3.out"
                        });
                    } else {
                        // Fallback for non-GSAP
                        $glow.css({
                            transform: 'translate(-50%, -50%)',
                            transition: `transform ${leaveSpeed}s cubic-bezier(0.215, 0.61, 0.355, 1)`
                        });
                    }
                });
            }

            // Mouse move handler for parallax effect
            $(document).on('mousemove', function (e) {
                parallaxTargets.forEach(t => {
                    const rect = t.$el[0].getBoundingClientRect();
                    const btnX = rect.left + rect.width / 2;
                    const btnY = rect.top + rect.height / 2;

                    const distanceX = e.clientX - btnX;
                    const distanceY = e.clientY - btnY;
                    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

                    if (distance < 200) {
                        t.targetX = (distanceX / rect.width) * parallaxStrength;
                        t.targetY = (distanceY / rect.height) * parallaxStrength;
                    } else {
                        t.targetX = 0;
                        t.targetY = 0;
                    }
                });
            });

            // Animation loop for parallax
            function animateParallax() {
                parallaxTargets.forEach(t => {
                    t.currentX += (t.targetX - t.currentX) * 0.1;
                    t.currentY += (t.targetY - t.currentY) * 0.1;
                    t.$el.css('transform', `translate(${t.currentX}px, ${t.currentY}px) scale(1.05)`);
                });
                requestAnimationFrame(animateParallax);
            }

            // Initialize and start
            setInterval(initButtons, 300);
            animateParallax();
        }

        // Initialize mouse effects
        initMouseEffects();
    }

    // Initialize
    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tcgelements-button.default', tcElementsButton);
    });

    // Fallback initialization
    $(document).ready(function () {
        setTimeout(function () {
            // Scroll to top fallback
            $('.tcgelements-scroll-top:not([data-tcg-bound])').each(function () {
                $(this).attr('data-tcg-bound', 'true').on('click', function (e) {
                    e.preventDefault();

                    if (window.ScrollSmoother && window.ScrollSmoother.get()) {
                        window.ScrollSmoother.get().scrollTo(0, true, "power2.out");
                    } else if (window.gsap && window.ScrollToPlugin) {
                        gsap.registerPlugin(ScrollToPlugin);
                        gsap.to(window, { duration: 1.2, scrollTo: { y: 0 }, ease: "power2.inOut" });
                    } else {
                        $('html, body').animate({ scrollTop: 0 }, 1200);
                    }

                    return false;
                });
            });

            // Initialize glow effects for buttons loaded outside Elementor
            $('.tce-btn-glow-effect:not([data-glow-init])').each(function () {
                const $btn = $(this);
                const $glow = $btn.find('.glow');

                if ($glow.length) {
                    $btn.attr('data-glow-init', 'true');

                    const speed = parseFloat($glow.data('speed')) || 0.3;

                    $btn.on('mousemove', function (e) {
                        const rect = this.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width / 2;
                        const y = e.clientY - rect.top - rect.height / 2;

                        if (window.gsap) {
                            gsap.to($glow[0], {
                                x: x,
                                y: y,
                                duration: speed,
                                ease: "power3.out"
                            });
                        }
                    });

                    $btn.on('mouseleave', function () {
                        if (window.gsap) {
                            gsap.to($glow[0], {
                                x: 0,
                                y: 0,
                                duration: speed + 0.2,
                                ease: "power3.out"
                            });
                        }
                    });
                }
            });
        }, 1000);
    });

})(jQuery);