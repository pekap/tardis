(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

$(function () {
    var $sendButton = $(".EmailModal__send-button");
    var $closeButton = $(".EmailModal__close-button");
    var $formPopup = $(".EmailModal");
    var $formOverlay = $(".EmailModal__overlay");
    var $formPopupPopup = $(".EmailModal__popup");
    var $formInputs = $(".EmailModal__input");
    var $popupTitle = $formPopup.find(".EmailModal__title");
    var $thankYou = $formPopup.find(".EmailModal__thank-you");
    var $error = $formPopup.find(".EmailModal__error");

    // attach button handlers
    $("[name=button-contact-sales]").on("click", function (e) {
        showFormPopup();

        e.preventDefault();
    });

    function showFormPopup() {
        $("body").css("overflow", "hidden");
        $thankYou.hide();
        $error.hide();
        $formPopup.addClass("show");

        // attach send button handler
        $sendButton.on("click", sendHandler);

        // attach enter key handler
        $formInputs.keypress(function (e) {
            if (e.which == 13) {
                sendHandler(e);
            }
        });

        // attach close button handler
        $closeButton.on("click", function () {
            hideFormPopup();
        });

        // click outside
        $formOverlay.on('click', function () {
            hideFormPopup();
        });

        // click outside
        $formPopupPopup.on('click', function (e) {
            e.stopPropagation();
        });

        function sendHandler(e) {
            var name = $formInputs.filter("[name=name]").val();
            var email = $formInputs.filter("[name=email]").val();
            var msg = $formInputs.filter("[name=message]").val();

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
                    shakeInput($formInputs.filter("[name=name]"));
                } else {
                    shakeInput($formInputs.filter("[name=email]"));
                }
            }

            e.preventDefault();
        }
    }

    function hideFormPopup() {
        $("body").css("overflow-y", "scroll");
        $formPopup.removeClass("show");

        // detach handlers
        $sendButton.off();
        $closeButton.off();
    }

    function saveToServer(object, successCallback, errorCallback) {
        $.ajax({
            method: "POST",
            url: "/sendmail.php",
            data: object
        }).done(successCallback).error(errorCallback);
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function shakeInput($input) {
        $input.removeClass('input-shake').addClass('input-shake').on('webkitAnimationEnd oAnimationEnd', function () {
            $(this).removeClass('input-shake');
        });
    }
});

},{}]},{},[1]);
