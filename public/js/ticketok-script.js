
$(function() {
    // Tabs
    const tabs = document.querySelectorAll('.ticketok-tabs .tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.tab);
            if (target) target.classList.add('active');
        });
    });

    // Slider
    // const slider = document.getElementById('airlineSlider');
    // const leftBtn = document.querySelector('.slider-btn.left');
    // const rightBtn = document.querySelector('.slider-btn.right');

    // if (slider) {
    //     if (leftBtn) leftBtn.onclick = () => slider.scrollBy({ left: -220, behavior: 'smooth' });
    //     if (rightBtn) rightBtn.onclick = () => slider.scrollBy({ left: 220, behavior: 'smooth' });
    // }

    var slideCount = $('.airline-card').length;
	var slideWidth = $('.airline-card').width();
	var slideHeight = $('.airline-card').height();
	var sliderUlWidth = slideCount * slideWidth;

	$('.airline-slider-wrapper').css({ width: slideWidth, height: slideHeight });

	$('#airlineSlider').css({ width: sliderUlWidth, marginLeft: - slideWidth });

    $('#airlineSlider .airline-card:last-child').prependTo('#airlineSlider');


    function moveLeft() {
        $('#airlineSlider').animate({
            left: + slideWidth
        }, 200, function () {
            $('#airlineSlider .airline-card:last-child').prependTo('#airlineSlider');
            $('#airlineSlider').css('left', '');
        });
    };

    function moveRight() {
        $('#airlineSlider').animate({
            left: - slideWidth
        }, 200, function () {
            $('#airlineSlider .airline-card:first-child').appendTo('#airlineSlider');
            $('#airlineSlider').css('left', '');
        });
    };


    $('.slider-btn.left').click(function () {
        moveLeft();
    });

    $('.slider-btn.right').click(function () {
        moveRight();
    });
    
    setInterval(moveRight, 3000);
    //  setTimeout(moveLeft(), 1000); /* works only on load for the first slider...research later*/
});
