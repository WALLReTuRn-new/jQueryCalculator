$(document).on('keyup keydown change', '.quantity-input,[data-price="cms-price"]', function (e) {
    e.stopPropagation();

//Fix when user return Slider Fast to Zero
    setTimeout(function () {
        calculateCount();
    }, 100);

});

$(document).on('change', '[data-price="additional-price"]', function (e) {
    e.stopPropagation();
    calculateCount();
});
$(document).on('change', '[data-price="additional-moduls-price"]', function (e) {
    e.stopPropagation();
    calculateCount();

});


$(document).ready(function () {


    calculateCount();

    var currentStep = 0;
    var steps = $('.step');
    var prevButton = $('#prev');
    var nextButton = $('#next');
    var stepContainer = $('.step-container');

    function showStep(stepIndex) {

        $('#EP-Slider .submitbutton input[type="submit"]').hide();

        if (stepIndex === 2) {
            $('#EP-Slider .submitbutton input[type="submit"]').show();
        }

        steps.removeClass('active');
        $(steps[stepIndex]).addClass('active');
        stepContainer.css('height', $(steps[stepIndex]).outerHeight());
    }

    function goToNextStep() {
        if (currentStep < steps.length - 1) {
            $(steps[currentStep]).removeClass('active').animate({opacity: 0}, 300);
            currentStep++;
            showStep(currentStep);
            $(steps[currentStep]).addClass('active').animate({opacity: 1}, 300);
            updateButtonLabels();
        }

        if (currentStep === steps.length - 1) {
            nextButton.hide();
        }

        prevButton.show();
    }

    function goToPrevStep() {
        if (currentStep > 0) {
            $(steps[currentStep]).removeClass('active').animate({opacity: 0}, 300);
            currentStep--;
            showStep(currentStep);
            $(steps[currentStep]).addClass('active').animate({opacity: 1}, 300);
            updateButtonLabels();
        }

        if (currentStep === 0) {
            prevButton.hide();
        }

        nextButton.show();
    }

    function updateButtonLabels() {
        var prevStepName = $(steps[currentStep - 1]).find('h1').text();
        var nextStepName = $(steps[currentStep + 1]).find('h1').text();
        //prevButton.text('Previous: ' + prevStepName);
        //nextButton.text('Next: ' + nextStepName);
        prevButton.text('Previous');
        nextButton.text('Next');
    }

    // Next button click event
    nextButton.click(goToNextStep);

    // Previous button click event
    prevButton.click(goToPrevStep);

    // Show initial step
    showStep(currentStep);
    updateButtonLabels();

    // Check initial step index and show/hide buttons
    if (currentStep === 0) {
        prevButton.hide();
    } else if (currentStep === steps.length - 1) {
        nextButton.hide();
    }








    // Slider change event
    $('input[type="range"]').on('input', function () {
        var sliderId = $(this).attr('id');
        var value = $(this).val();
        $('#quantity-input-' + sliderId.slice(-1)).val(value);
        $('#quantity-input-' + sliderId.slice(-1)).change();
    });

    // Input change event
    $('input[type="number"]').on('input', function () {
        var inputId = $(this).attr('id');
        var value = $(this).val();
        var sliderId = inputId.replace('quantity-input-', '');
        $('#quantity-slider-' + sliderId).val(value);
    });

    // Increment button click event
    $(document).on('click', '.increment-btn', function () {
        var sliderId = $(this).data('slider');
        var currentValue = parseInt($('#quantity-input-' + sliderId).val());
        var maxValue = parseInt($('#quantity-input-' + sliderId).attr('max'));
        if (!isNaN(currentValue) && currentValue < maxValue) {
            var newValue = currentValue + 1;
            $('#quantity-input-' + sliderId).val(newValue);
            $('#quantity-slider-' + sliderId).val(newValue).trigger('input');
        }
    });

    // Decrement button click event
    $(document).on('click', '.decrement-btn', function () {
        var sliderId = $(this).data('slider');
        var currentValue = parseInt($('#quantity-input-' + sliderId).val());
        var minValue = parseInt($('#quantity-input-' + sliderId).attr('min'));
        if (!isNaN(currentValue) && currentValue > minValue) {
            var newValue = currentValue - 1;
            $('#quantity-input-' + sliderId).val(newValue);
            $('#quantity-slider-' + sliderId).val(newValue).trigger('input');
        }
    });
    // Calculate total price when the product checkboxes or quantity change
    $('#checkboxcalc input[type="checkbox"], #quantity').on('keyup keydown change', function () {
        var totalPrice = 0;

        $('#checkboxcalc input[type="checkbox"]:checked').each(function () {
            var productPrice = parseFloat($(this).val());
            totalPrice += productPrice;
        });

        var quantity = parseInt($('#checkboxcalc #quantity').val());
        totalPrice *= quantity;

        if (!isNaN(totalPrice)) {
            $('#checkboxcalc #total').val('$' + totalPrice.toFixed(2));
        }
    });


    // Calculate total price when the product or quantity changes
    $('#product, #quantity').on('keyup keydown change', function () {
        var productPrice = parseFloat($('#product').val());
        var quantity = parseInt($('#quantity').val());
        var totalPrice = productPrice * quantity;

        if (!isNaN(totalPrice)) {
            $('#total').val('$' + totalPrice.toFixed(2));
        }
    });

    var $display = $('#display');
    var expression = '';

    // Button click event handlers
    $('.btn').click(function () {
        var btnValue = $(this).text();



        switch (btnValue) {
            case 'C':
                expression = '';
                break;
            case '⌫':
                expression = expression.slice(0, -1);
                break;
            case '=':
                try {
                    expression = eval(expression);
                } catch (error) {
                    expression = 'Error';
                }
                break;
            default:
                expression += btnValue;
        }

        $display.val(expression);
    });
});

function calculateCount() {

    var landingpageId = $('#quantity-input-1');
    var pagepriceId = $('#quantity-input-2');


    var landingpageprice = parseFloat(landingpageId.val() * landingpageId.attr("data-price"));
    var pageprice = parseFloat(pagepriceId.val() * pagepriceId.attr("data-price"));

    var CMSPrice = parseFloat($('[data-price="cms-price"]:checked').val());



    var sumAditionalPrice = 0;
    $('[data-price="additional-price"]').each(function () {
        if (this.checked === true) {
            sumAditionalPrice += Number(this.value);
        }
    });

    var sumAditionalModulsPrice = 0;
    $('[data-price="additional-moduls-price"]').each(function () {
        if (this.checked === true) {
            sumAditionalModulsPrice += Number(this.value);
        }
    });



    var sum = (landingpageprice) + (pageprice) + CMSPrice + sumAditionalPrice + sumAditionalModulsPrice;

    var countingDisplay = $('#counting-price');

    var getCountingPrice = $('#counting-price');
    getCountingPrice.attr('data-current-price', sum);

    //console.log(getCountingPrice.attr('data-current-price'));

    //countingDisplay.innerText = "0";

    var interval;
    var stepSize = 500.55;
    if (!isNaN(sum) && !isNaN(stepSize) && stepSize > 0) {
        var count = 0;


        interval = setInterval(function () {
            if (count <= sum) {
                countingDisplay.text(count.toFixed(2));
                count += stepSize;
            } else {
                clearInterval(interval);
            }
            if (count > sum) {
                countingDisplay.text(sum.toFixed(2));
                clearInterval(interval);
            }
        }, 0);
    }
    //countingDisplay.innerText = (parseFloat(countingDisplay.innerText) + sum).toFixed(2);



}