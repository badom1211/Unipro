
/*==============================================================
                         Ajax read more posts
==============================================================*/

jQuery(document).ready(function ($) {

    revealPosts();

    /* Ajax read more posts*/
    $(document).on('click', '.tcg-show-more:not(.loading)', function () {

        var that = $(this);
        var page = that.data('page');
        var newPage = page + 1;
        var ajaxurl = that.data('url');

        that.addClass('loading').find('.text').slideUp(0);
        that.find('.icon').addClass('spin');

        $.ajax({

            url: ajaxurl,
            type: 'post',
            data: {
                page: page,
                action: 'tcg_load_more'

            },
            error: function (response) {
                console.log(response);
            },
            success: function (response) {

                if (response == 0) {
                    $('.tcg-posts').append("<p class ='text-center  fz-12'><i class='fa-solid fa-chart-simple'></i> You've reached the end of the list!</p>");
                    that.slideUp(320);
                } else {

                    setTimeout(function () {

                        that.data('page', newPage);
                        $('.tcg-posts').append(response);

                        that.removeClass('loading').find('.text').slideDown(320);
                        that.find('.icon').removeClass('spin');

                        revealPosts();

                    }, 500);
                }
            }

        });

    });

    /* Helper function*/
    function revealPosts() {

        var posts = $('article:not(.reveal)');
        var i = 0;

        setInterval(function () {

            if (i >= posts.length) return false;

            var el = posts[i];
            $(el).addClass('reveal');

            i++

        }, 100);

    }

    /*==============================================================
                             Front switcher control
    ==============================================================*/

    var isShow = false;

    $(".fixed-controls .toggel-icon").on("click", function () {
        isShow = !isShow; // Toggle the state

        if (isShow) {
            $(".fixed-controls").addClass("show");
        } else {
            $(".fixed-controls").removeClass("show");
        }
    });

    $(".fixed-controls .btns a").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
    });


    // cursor

    $("#cursor-btns .standerd").on("click", function () {
        $(".cursor-outer").addClass("cutom_cursor");
    });

    if ($(".mouse-custom").hasClass("cutom_cursor")) {
        $("#cursor-btns .standerd").on("click", function () {
            $(".cursor-outer").removeClass("cutom_cursor");
        });
    }

    /*==============================================================
                             Cursor animation
    ==============================================================*/

    function mousecursor() {
        if ($("body")) {
            const e = document.querySelector(".cursor-inner"),
                t = document.querySelector(".cursor-outer");
            let n, i = 0,
                o = !1;

            // Set the transition effect on cursor elements
            e.style.transition = "transform 0.4s ease-out, background-color 0.15s ease-out"; // Adjust the duration for inner cursor
            t.style.transition = "transform 0.6s ease-out, border-color 0.15s ease-out"; // Adjust the duration for outer cursor
            t.style.borderWidth = "2px"; // Set initial border width

            // Function to get the background color, considering parent elements
            function getEffectiveBackgroundColor(element) {
                let bgColor = window.getComputedStyle(element).backgroundColor;
                while (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
                    element = element.parentElement;
                    if (!element) break;
                    bgColor = window.getComputedStyle(element).backgroundColor;
                }
                return bgColor;
            }

            function updateCursorPosition(s) {
                o || (t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)"), 
                e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
                n = s.clientY; 
                i = s.clientX;

                // Get the element under the cursor
                const elem = document.elementFromPoint(s.clientX, s.clientY);
                if (elem) {
                    const bgColor = getEffectiveBackgroundColor(elem);
                    if (bgColor) {
                        const rgb = bgColor.match(/\d+/g);
                        if (rgb) {
                            const r = parseInt(rgb[0]);
                            const g = parseInt(rgb[1]);
                            const b = parseInt(rgb[2]);
                            
                            // Calculate the luminance
                            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

                            // Set cursor border color and background color based on luminance
                            if (luminance < 128) { // Dark background
                                t.style.borderColor = "#999"; // Light border
                                e.style.backgroundColor = "#999"; // Light background for inner cursor
                            } else { // Light background
                                t.style.borderColor = "#5f5f5f"; // Dark border
                                e.style.backgroundColor = "#5f5f5f"; // Dark background for inner cursor
                            }
                        }
                    }
                }
            }

            // Use requestAnimationFrame for smoother updates
            window.onmousemove = function (s) {
                requestAnimationFrame(() => updateCursorPosition(s));
            };

            $("body").on("mouseenter", "a, .cursor-pointer", function () {
                e.classList.add("cursor-hover"), t.classList.add("cursor-hover");
            });

            $("body").on("mouseleave", "a, .cursor-pointer", function () {
                $(this).is("a") && $(this).closest(".cursor-pointer").length || 
                (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"));
            });

            e.style.visibility = "visible";
            t.style.visibility = "visible";
        }
    }

    if ($(".mouse-cursor").length) {
        mousecursor();
    }


    /*==============================================================
                         Mega Menu Hover
    ==============================================================*/
    $(document).ready(function () {
        const megaMenus = document.querySelectorAll('li.megamenu');
        let timeout;
        let activeMenu;
    
        megaMenus.forEach(megaMenu => {
            const megaNavItem = megaMenu.querySelector('.tcg-mega-nav-item');
    
            megaMenu.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                if (activeMenu && activeMenu !== megaMenu) {
                    activeMenu.classList.remove('active');
                }
                megaMenu.classList.add('active');
                activeMenu = megaMenu;
            });
    
            megaMenu.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    megaMenu.classList.remove('active');
                    activeMenu = null;
                }, 300); // Adjust delay as needed
            });
    
            if (megaNavItem) {
                megaNavItem.addEventListener('mouseenter', () => {
                    clearTimeout(timeout);
                });
    
                megaNavItem.addEventListener('mouseleave', () => {
                    timeout = setTimeout(() => {
                        megaMenu.classList.remove('active');
                        activeMenu = null;
                    }, 300); // Adjust delay as needed
                });
            }
        });
    });
    
    /*==============================================================
                         URL Dark Mode
    ==============================================================*/

    function checkdarkmode() {
        var result = null,
            tmp = [];
        location.search
            .substr(1)
            .split("&")
            .forEach(function (item) {
                tmp = item.split("=");
                if (tmp[0] === 'mode') result = decodeURIComponent(tmp[1]);
            });
        if (result == 'dark') {
            $('body').addClass('tcg-dark-mode');
        } else {
            return;
        };
    }
    checkdarkmode();

});





