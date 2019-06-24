$(document).ready(function(){
    var _ww = $(window).width();
    var device;
    $(document).on('click', '#sp_navigation', function(event) {
        event.preventDefault();
        $('#sp_menu').toggleClass('activate');
        $('#site_navigation').stop().slideToggle();
    });
    $('.archive_title').on('click',function(e) {
	    e.preventDefault();
		if(device === "s") $(this).next('.archive_list').slideToggle();
    });
	init();
	function init(){resize();};
	function resize(){
	    var _ww = $(window).width();
	    if ( _ww > 940 ) {
	        $('#site_navigation').attr('style','');
	        $('.archive_list').css({'display':'block'});
	        device = "p";
	    }else{
		    $('.archive_list').css({'display':'none'});
		    device = "s";
	    }
	}
	$(window).on('resize',function() {resize();});
});
