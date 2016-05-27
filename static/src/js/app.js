$(function () {
    let $sendButton = $(".EmailModal__send-button");
    let $closeButton = $(".EmailModal__close-button");
    let $formPopup = $(".EmailModal");
    let $formOverlay = $(".EmailModal__overlay");
    let $formPopupPopup = $(".EmailModal__popup");
    let $formInputs = $(".EmailModal__input");
    let $popupTitle = $formPopup.find(".EmailModal__title");
    let $thankYou = $formPopup.find(".EmailModal__thank-you");
    let $error = $formPopup.find(".EmailModal__error");

    // attach button handlers
    $("[name=button-contact-sales]").on ("click", function (e) {
        showFormPopup ();

        e.preventDefault();
    });

    function showFormPopup () {
        $("body").css("overflow", "hidden");
        $thankYou.hide();
        $error.hide();
        $formPopup.addClass ("show");

        // attach send button handler
        $sendButton.on ("click", sendHandler);

        // attach enter key handler
        $formInputs.keypress(function(e) {
            if(e.which == 13) {
                sendHandler(e);
            }
        });

        // attach close button handler
        $closeButton.on ("click", function () {
            hideFormPopup ();
        });

        // click outside
        $formOverlay.on ('click', function () {
            hideFormPopup ();
        });

        // click outside
        $formPopupPopup.on ('click', function (e) {
            e.stopPropagation();
        });

        function sendHandler(e) {
            var name = $formInputs.filter ("[name=name]").val();
            var email = $formInputs.filter ("[name=email]").val();
            var msg = $formInputs.filter ("[name=message]").val();

            if (name && email && validateEmail(email)) {

                saveToServer({
                    name: name,
                    email: email,
                    msg: msg
                    //package: package
                }, function () {
                    $thankYou.show();
                }, function () {
                    $error.show();
                });

            } else {
                if (!name) {
                    shakeInput ($formInputs.filter ("[name=name]"));
                } else {
                    shakeInput ($formInputs.filter ("[name=email]"));
                }
            }

            e.preventDefault();
        }
    }

    function hideFormPopup () {
        $("body").css("overflow-y", "scroll");
        $formPopup.removeClass ("show");

        // detach handlers
        $sendButton.off();
        $closeButton.off();
    }

    function saveToServer (object, successCallback, errorCallback) {
        $.ajax({
            method: "POST",
            url: "/sendmail.php",
            data: object
        })
        .done(successCallback)
        .error(errorCallback);
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function shakeInput($input) {
        $input
            .removeClass('input-shake')
            .addClass('input-shake')
            .on('webkitAnimationEnd oAnimationEnd', function(){
                $(this).removeClass('input-shake');
            });
    }
});
