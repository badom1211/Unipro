(function ($) {
    "use strict";

    function elementcamp_image($scope, $) {
        const $images = $scope.find('.tcgelements-image');
        if (!$images.length) return;

        $images.each(function (index) {
            const $imageElement = $(this);
            const uniqueNs = `.tcg-${Date.now()}-${index}`; // Unique event namespace

            const $widget = $imageElement.closest('.elementor-widget');
            const $container = $widget.closest('.e-con');
            const $parentContainer = $container.parent().closest('.e-con');

            // Remove existing events for THIS widget only
            $container.off(`mouseenter${uniqueNs} mouseleave${uniqueNs}`);
            $parentContainer.off(`mouseenter${uniqueNs} mouseleave${uniqueNs}`);

            const activate = () => $imageElement.addClass('tcgelements-image-container-active');
            const deactivate = () => $imageElement.removeClass('tcgelements-image-container-active');

            if ($imageElement.hasClass('selector-type-container')) {
                $container.on(`mouseenter${uniqueNs}`, activate)
                    .on(`mouseleave${uniqueNs}`, deactivate);
            }

            if ($imageElement.hasClass('selector-type-parent-container')) {
                $parentContainer.on(`mouseenter${uniqueNs}`, activate)
                    .on(`mouseleave${uniqueNs}`, deactivate);
            }

            if ($imageElement.hasClass('selector-type-parent-parent-container')) {
                const $parentParentContainer = $parentContainer.parent().closest('.e-con');
                $parentParentContainer.off(`mouseenter${uniqueNs} mouseleave${uniqueNs}`)
                    .on(`mouseenter${uniqueNs}`, activate)
                    .on(`mouseleave${uniqueNs}`, deactivate);
            }

            if ($imageElement.hasClass('selector-type-parent-n')) {
                const parentLevel = parseInt($imageElement.attr('data-parent-level')) || 1;
                let $parentTarget = $widget;
                for (let i = 0; i < parentLevel; i++) {
                    $parentTarget = $parentTarget.parent();
                    if (!$parentTarget.length) break;
                }
                if ($parentTarget.length) {
                    $parentTarget.off(`mouseenter${uniqueNs} mouseleave${uniqueNs}`)
                        .on(`mouseenter${uniqueNs}`, activate)
                        .on(`mouseleave${uniqueNs}`, deactivate);
                }
            }

            if ($imageElement.hasClass('selector-type-image')) {
                $container.on(`mouseenter${uniqueNs}`, activate)
                    .on(`mouseleave${uniqueNs}`, deactivate);
            }
        });
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tcgelements-image.default', elementcamp_image);
    });

})(jQuery);