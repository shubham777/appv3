'use strict';

// core module
var rentbingo = (function(){ 
    var
        events = [],
        isMobile = { //  mobile detection utility
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        },
        init = function() {
            for (var e in events){
                events[e]();
            }
        },
        refresh = function() {
           $(window).trigger('debouncedresize.slitslider').trigger('resize');
        };
    return {
        events: events,
        isMobile: isMobile,
        init: init,
        refresh: refresh
    };
})();
// end core module





$(document).ready(function() {
    // loading overlay
    $('body').queryLoader2({
        barColor: '#222',
        backgroundColor: '#fff',
        percentage: false,
        barHeight: 1

    });
    $('#load').fadeOut().remove();



    $('.dropdown-menu input, .dropdown-menu label').click(function(e) {
        e.stopPropagation();
    });











    // init Theme functions
    rentbingo.init();

}).on('click','.navbar-toggle',function() {
    // toggle navigation
    $('.navbar-collapse').toggleClass('in');

}).on('click','.navbar-collapse.in',function(e) {
    // close navigation on click
    if( $(e.target).is('a') ) {
        $('.navbar-collapse').toggleClass('in');
    }
});

$(window).resize(function () {
    if ($(window).width() > 768) {
        $('.collapse').removeClass('in');
    }
});
