$(document).ready(function(){
    /* Change navbar with scroll */
    var navbar_selector = $('.agm-navbar');
    var body_selector = $('body');

    $(window).scroll(function() {
        if ($(document).scrollTop() > 120) {
            navbar_selector.addClass('shrink animated fadeInDown');
            navbar_selector.addClass('navbar-fixed-top');
            navbar_selector.removeClass('navbar-static-top');
            body_selector.addClass('navbar-fixed-mode');

        } else {
            navbar_selector.removeClass('shrink animated fadeInDown');
            navbar_selector.addClass('navbar-static-top');
            navbar_selector.removeClass('navbar-fixed-top');
            body_selector.removeClass('navbar-fixed-mode');
        }
    });

    var potfolio_more_link = $('.portfolio-item-more');
    potfolio_more_link.on('click', function(e){
        $(this).parent().parent().toggleClass('open');
        e.preventDefault();
    });
});
