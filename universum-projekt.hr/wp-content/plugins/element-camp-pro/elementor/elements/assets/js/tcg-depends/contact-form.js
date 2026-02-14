

/**
 * Start contact form widget script
 */

(function ($, elementor) {

    'use strict';

    var widgettcgContactForm = function ($scope, $) {

        var $contactForm = $scope.find('.tcg-contact-form .without-recaptcha');

        // Validate tel type input field
        var $inputFieldTel = $scope.find('.tcg-contact-form input[type="tel"]');
        $inputFieldTel.on('input', function(e) {
            this.value = this.value.replace(/[^0-9\+]/g, ''); // Allow only numbers and the plus sign
        });


        if (!$contactForm.length) {
            return;
        }

        $contactForm.submit(function (e) {
            sendContactForm($contactForm);
            return false;
        });

        return false;

    };

    function contactFormNotification(data) {
        $('input[value="tcg_contact_form"]').after(`<div class="tcg-contact-form-notification ${data.type}">${data.message}</div>`);
    }

    function clearContactFormNotification() {
        $('.tcg-contact-form-notification').remove();
    }

    // ...existing code...

function sendContactForm($contactForm) {
    console.log('sendContactForm called');

    clearContactFormNotification();

    $.ajax({
        url: $contactForm.attr('action'),
        type: 'POST',
        data: $contactForm.serialize(),
        beforeSend: function () {
            console.log('AJAX request is about to be sent');
            contactFormNotification({
                type: 'warning',
                message: 'Sending message please wait...'
            });
        },
        success: function (data) {
            console.log('AJAX request successful');
            console.log('Response data:', data);

            var jsonData = data;

            console.log('Parsed JSON data:', jsonData);

            var redirectURL = jsonData.redirect_url,
                isExternal = jsonData.is_external,
                resetStatus = jsonData.reset_status;

            clearContactFormNotification();
            contactFormNotification({
                type: jsonData.success ? 'success' : 'warning',
                message: jsonData.message
            });

            if (redirectURL && redirectURL !== 'no') {
                window.open(redirectURL, isExternal);
            }

            if (resetStatus && resetStatus !== 'no') {
                $contactForm[0].reset();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('AJAX request failed:', textStatus, errorThrown);
            contactFormNotification({
                type: 'warning',
                message: 'An error occurred while sending your message. Please try again later.'
            });
        }
    });
    return false;
}

// ...existing code...

    // google invisible captcha
    function tcgGIC() {

        return new Promise(function (resolve, reject) {

            if (grecaptcha === undefined) {
                contactFormNotification({
                    type: 'warning',
                    message: 'Invisible captcha not defined!'
                });
                reject();
            }

            var response = grecaptcha.getResponse();

            if (!response) {
                contactFormNotification({
                    type: 'warning',
                    message: 'Could not get invisible captcha response!'
                });
                reject();
            }

            var $contactForm = $('textarea.g-recaptcha-response').filter(function () {
                return $(this).val() === response;
            }).closest('form.tcg-contact-form-form');

            var contactFormAction = $contactForm.attr('action');

            if (contactFormAction && contactFormAction !== '') {
                sendContactForm($contactForm);
            } else {
                // console.log($contactForm);
            }

            grecaptcha.reset();

        }); //end promise

    }

    //Contact form recaptcha callback, if needed
    window.tcgGICCB = tcgGIC;

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tcg-contact-form.default', widgettcgContactForm);
    });


}(jQuery, window.elementorFrontend));

/**
 * End contact form widget script
 */