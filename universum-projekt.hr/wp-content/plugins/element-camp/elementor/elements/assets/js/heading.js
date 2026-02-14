(function ($) {
    "use strict";
    function tcElementsHeading($scope, $) {
        $(document).ready(function () {
            handleDoubleBackground($scope);

            // parent
            $('.e-parent .elementor-widget-tcgelements-heading,.e-con .elementor-widget-tcgelements-heading').each(function () {
                $scope.parent().on('mouseenter', function () {
                    $scope.find('.heading-selector-type-container').addClass('tc-heading-container-active');
                }).on('mouseleave', function () {
                    $scope.find('.heading-selector-type-container').removeClass('tc-heading-container-active');
                });
            });

            // parent parent
            $('.e-parent .elementor-widget-tcgelements-heading').each(function () {
                $scope.parent().parent().on('mouseenter', function () {
                    $scope.find('.heading-selector-type-parent-container').addClass('tc-heading-container-active');
                }).on('mouseleave', function () {
                    $scope.find('.heading-selector-type-parent-container').removeClass('tc-heading-container-active');
                });
            });

            // parent n
            $('.e-parent .elementor-widget-tcgelements-heading').each(function () {
                const element = $(this).find('.tcgelements-heading-text')
                if (element.attr('data-parent-level') !== undefined) {
                    let parentLevel = parseInt($(this).find('.tcgelements-heading-text').data('parent-level')) || 1;
                    let $parentTarget = $(this);
                    for (let i = 0; i < parentLevel; i++) {
                        $parentTarget = $parentTarget.parent();
                    }
                    $parentTarget.on('mouseenter', function () {
                        $(this).find('.heading-selector-type-parent-n').addClass('tc-heading-container-active');
                    }).on('mouseleave', function () {
                        $(this).find('.heading-selector-type-parent-n').removeClass('tc-heading-container-active');
                    });
                }
            });
        });
    };

    function handleDoubleBackground($scope) {
        const $headingElement = $scope.find('.tcgelements-heading.double-bg');

        if ($headingElement.length > 0) {
            try {
                const firstBgData = JSON.parse($headingElement.attr('data-first-bg-full') || '{}');
                const secondBgData = JSON.parse($headingElement.attr('data-second-bg-full') || '{}');

                const firstBg = generateBackgroundCSS(firstBgData);
                const secondBg = generateBackgroundCSS(secondBgData);

                if (firstBg || secondBg) {
                    const combinedBackground = combineBackgrounds(firstBg, secondBg);
                    const currentBackgroundClip = $headingElement.css('background-clip') || $headingElement.css('-webkit-background-clip');

                    const cssProps = { 'background': combinedBackground };

                    if (currentBackgroundClip === 'text') {
                        cssProps['background-clip'] = 'text';
                        cssProps['-webkit-background-clip'] = 'text';
                        cssProps['-webkit-text-fill-color'] = 'transparent';
                    }

                    $headingElement.css(cssProps);
                }
            } catch (error) {
                console.error('Error parsing background data:', error);
            }
        }
    }

    function combineBackgrounds(firstBg, secondBg) {
        if (!firstBg && !secondBg) return null;
        if (!firstBg) return secondBg;
        if (!secondBg) return firstBg;

        const firstIsGradient = firstBg.includes('linear-gradient');
        const secondIsGradient = secondBg.includes('linear-gradient');

        if (!firstIsGradient && secondIsGradient) {
            // Convert solid color to gradient for better blending
            const gradientAngle = secondBg.match(/linear-gradient\((\d+(?:\.\d+)?)deg/)?.[1] || '0';
            const convertedFirst = `linear-gradient(${gradientAngle}deg, ${firstBg} 0%, ${firstBg} 100%)`;
            return `${convertedFirst}, ${secondBg}`;
        } else if (firstIsGradient && !secondIsGradient) {
            // Convert solid color to gradient for better blending
            const gradientAngle = firstBg.match(/linear-gradient\((\d+(?:\.\d+)?)deg/)?.[1] || '0';
            const convertedSecond = `linear-gradient(${gradientAngle}deg, ${secondBg} 0%, ${secondBg} 100%)`;
            return `${firstBg}, ${convertedSecond}`;
        }

        return `${firstBg}, ${secondBg}`;
    }

    function generateBackgroundCSS(bgData) {
        if (!bgData.background || bgData.background === '') return null;

        switch (bgData.background) {
            case 'classic':
                return bgData.background_color || bgData.color;
            case 'gradient':
                return generateStandardGradient(bgData);
            case 'tcg_gradient':
                return generateTcgGradient(bgData);
            case 'tcg_gradient_4':
                return generateTcgGradient4(bgData);
            default:
                return null;
        }
    }

    function generateStandardGradient(bgData) {
        const angle = bgData.gradient_angle?.size || bgData.angle?.size || 90;
        const colorA = bgData.gradient_color || bgData.color;
        const colorB = bgData.gradient_color_b || bgData.color_b;

        if (!colorA || !colorB) return null;

        const stopA = bgData.gradient_color_a_stop?.size || bgData.color_stop?.size || 0;
        const stopB = bgData.gradient_color_b_stop?.size || bgData.color_b_stop?.size || 100;

        return `linear-gradient(${angle}deg, ${colorA} ${stopA}%, ${colorB} ${stopB}%)`;
    }

    function generateTcgGradient(bgData) {
        const angle = bgData.tcg_gradient_angle?.size;
        if (!angle || !bgData.color || !bgData.color_b || !bgData.color_c) return null;

        const stopA = bgData.color_stop?.size || 0;
        const stopB = bgData.color_b_stop?.size || 50;
        const stopC = bgData.color_c_stop?.size || 100;

        return `linear-gradient(${angle}deg, ${bgData.color} ${stopA}%, ${bgData.color_b} ${stopB}%, ${bgData.color_c} ${stopC}%)`;
    }

    function generateTcgGradient4(bgData) {
        const angle = bgData.tcg_gradient_angle?.size;
        if (!angle || !bgData.color || !bgData.color_b || !bgData.color_c || !bgData.color_d) return null;

        const stopA = bgData.color_stop?.size || 0;
        const stopB = bgData.color_b_stop?.size || 25;
        const stopC = bgData.color_c_stop?.size || 50;
        const stopD = bgData.color_d_stop?.size || 100;

        return `linear-gradient(${angle}deg, ${bgData.color} ${stopA}%, ${bgData.color_b} ${stopB}%, ${bgData.color_c} ${stopC}%, ${bgData.color_d} ${stopD}%)`;
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tcgelements-heading.default', tcElementsHeading);
    });

})(jQuery);