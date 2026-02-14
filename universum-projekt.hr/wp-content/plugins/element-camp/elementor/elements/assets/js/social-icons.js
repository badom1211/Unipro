(function ($) {
    "use strict";
    function tcElementsSocialIcons($scope, $) {
        $(document).ready(function () {

            // Get the current widget element
            const $widget = $scope.find('.elementor-widget-tcgelements-social-icons').length ?
                $scope.find('.elementor-widget-tcgelements-social-icons') :
                $scope;

            // CONTAINER (SELF) - Default behavior
            $widget.each(function () {
                const $currentWidget = $(this);
                const $socialIcons = $currentWidget.find('.social-icons-selector-type-container');

                if ($socialIcons.length) {
                    $currentWidget.on('mouseenter', function () {
                        $socialIcons.addClass('tc-social-icons-container-active');
                    }).on('mouseleave', function () {
                        $socialIcons.removeClass('tc-social-icons-container-active');
                    });
                }
            });

            // PARENT CONTAINER
            $widget.each(function () {
                const $currentWidget = $(this);
                const $socialIcons = $currentWidget.find('.social-icons-selector-type-parent');

                if ($socialIcons.length) {
                    $currentWidget.parent().on('mouseenter', function () {
                        $socialIcons.addClass('tc-social-icons-container-active');
                    }).on('mouseleave', function () {
                        $socialIcons.removeClass('tc-social-icons-container-active');
                    });
                }
            });

            // PARENT PARENT CONTAINER (GRANDPARENT)
            $widget.each(function () {
                const $currentWidget = $(this);
                const $socialIcons = $currentWidget.find('.social-icons-selector-type-parent-parent');

                if ($socialIcons.length) {
                    $currentWidget.parent().parent().on('mouseenter', function () {
                        $socialIcons.addClass('tc-social-icons-container-active');
                    }).on('mouseleave', function () {
                        $socialIcons.removeClass('tc-social-icons-container-active');
                    });
                }
            });

            // PARENT N CONTAINER (Dynamic parent level)
            $widget.each(function () {
                const $currentWidget = $(this);
                const $socialIcons = $currentWidget.find('.social-icons-selector-type-parent-n');

                if ($socialIcons.length) {
                    const parentLevel = parseInt($socialIcons.data('parent-level')) || 1;
                    let $targetParent = $currentWidget;

                    // Navigate up the specified number of parent levels
                    for (let i = 0; i < parentLevel; i++) {
                        $targetParent = $targetParent.parent();
                        if ($targetParent.length === 0) {
                            console.warn('Social Icons: Cannot find parent at level ' + (i + 1));
                            break;
                        }
                    }

                    if ($targetParent.length) {
                        $targetParent.on('mouseenter', function () {
                            $socialIcons.addClass('tc-social-icons-container-active');
                        }).on('mouseleave', function () {
                            $socialIcons.removeClass('tc-social-icons-container-active');
                        });
                    }
                }
            });

            // Keep existing Parallax Script exactly as is
            const link = document.querySelectorAll('.tcgelements-social-icons .tcgelements-hover-this');
            const animateit = function (e) {
                const hoverAnim = this.querySelector('.tcgelements-social-icons .tcgelements-hover-anim');
                if (!hoverAnim) return;

                const { offsetX: x, offsetY: y } = e,
                    { offsetWidth: width, offsetHeight: height } = this,
                    move = 25,
                    xMove = x / width * (move * 2) - move,
                    yMove = y / height * (move * 2) - move;
                hoverAnim.style.transform = `translate(${xMove}px, ${yMove}px)`;
                if (e.type === 'mouseleave') hoverAnim.style.transform = '';
            };
            const editCursor = e => {
                const { clientX: x, clientY: y } = e;
            };
            link.forEach(b => b.addEventListener('mousemove', animateit));
            link.forEach(b => b.addEventListener('mouseleave', animateit));
            window.addEventListener('mousemove', editCursor);
        });
    };

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tcgelements-social-icons.default', tcElementsSocialIcons);
    });

})(jQuery);