;(function () {
    'use strict';

    var video = document.getElementById('video');

    var changeTab = function () {
        var registerTab = document.getElementById('register-tab');
        var loginTab = document.getElementById('login-tab');
        loginTab.hidden = true;
        $('#register-button').click(function(){
            registerTab.hidden = false;
            loginTab.hidden = true;
        })
        $('#login-button').click(function(){
            registerTab.hidden = true;
            loginTab.hidden = false;
        })
    }

    var accessCamera = function () {
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                video.src = window.URL.createObjectURL(stream);
                video.play();
            });
        }

    }

    var convertCanvasToImage = function (canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/jpeg");
        return image;
    };

    var dataURItoByteArray = function (dataURI){
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var uInt8Array = new Uint8Array(arrayBuffer);

        for (var i = 0; i < byteString.length; i++) {
            uInt8Array[i] = byteString.charCodeAt(i);
        }

        return uInt8Array;
    };

    var dataURItoBlob = function (dataURI){
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var uInt8Array = new Uint8Array(arrayBuffer);

        for (var i = 0; i < byteString.length; i++) {
            uInt8Array[i] = byteString.charCodeAt(i);
        }

        var bufferBlob = new Blob([arrayBuffer], { "type": mimeString });
        return bufferBlob;
    };

    var registerPhotoTrigger = function () {
        var canvas = document.getElementById('register-canvas');
        var context = canvas.getContext('2d');

        document.getElementById("register-snap").addEventListener("click", function() {
            context.drawImage(video, 0, 0, 277, 240);
            var image = convertCanvasToImage(canvas);
            var blob = dataURItoByteArray(image.src);
            
            // var url = window.location.origin + '/api/register?name=' + document.getElementById("fullname").value;
            var url = 'https://drwho.azurewebsites.net/' + '/api/register?name=' + document.getElementById("fullname").value;
            $.ajax({
                type: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                data: blob,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    alert('등록 성공!');
                },
                error: function (data) {
                    alert('등록 실패...');
                }
            });
        });
    };
    var takePhotoTrigger = function () {
        var canvas = document.getElementById('login-canvas');
        var context = canvas.getContext('2d');
        var facelist={};

        document.getElementById("login-snap").addEventListener("click", function() {
            document.getElementById("foundnames").innerHTML = "";

            context.drawImage(video, 0, 0, 277, 240);
            var image = convertCanvasToImage(canvas);
            var blob = dataURItoByteArray(image.src);

            // var url = window.location.origin + '/api/query';
            var url = 'https://drwho.azurewebsites.net/api/query';
            $.ajax({
                type: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                data: blob,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    for (var i = 0; i < data.length; i ++) {
                        document.getElementById("foundnames").innerHTML = document.getElementById("foundnames").innerHTML + data[i] + "<br>";
                    }
                },
                error: function (data) {
                    alert('질의 실패...');
                }
            });
        });
    }

    var mobileMenuOutsideClick = function() {
        $(document).click(function (e) {
            var container = $("#gtco-offcanvas, .js-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                $('.js-nav-toggle').addClass('nav-white');

                if ( $('body').hasClass('offcanvas') ) {

                    $('body').removeClass('offcanvas');
                    $('.js-nav-toggle').removeClass('active');

                }
            }
        });
    };

    var formTab = function() {
        $('.tab-menu a').on('click', function(event){
            var $this = $(this),
                data = $this.data('tab');

            $('.tab-menu li').removeClass('active');
            $this.closest('li').addClass('active')

            $('.tab .tab-content-inner').removeClass('active');
            $this.closest('.tab').find('.tab-content-inner[data-content="'+data+'"]').addClass('active');

            event.preventDefault();

        });
    };

    var burgerMenu = function() {
        $('body').on('click', '.js-nav-toggle', function(event){
            var $this = $(this);
            if ( $('body').hasClass('overflow offcanvas') ) {
                $('body').removeClass('overflow offcanvas');
            } else {
                $('body').addClass('overflow offcanvas');
            }
            $this.toggleClass('active');
            event.preventDefault();
        });
    };

    var contentWayPoint = function() {
        var i = 0;

        $('.animate-box').waypoint( function( direction ) {

            if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function(){

                    $('body .animate-box.item-animate').each(function(k){
                        var el = $(this);
                        setTimeout( function () {
                            var effect = el.data('animate-effect');
                            if ( effect === 'fadeIn') {
                                el.addClass('fadeIn animated-fast');
                            } else if ( effect === 'fadeInLeft') {
                                el.addClass('fadeInLeft animated-fast');
                            } else if ( effect === 'fadeInRight') {
                                el.addClass('fadeInRight animated-fast');
                            } else {
                                el.addClass('fadeInUp animated-fast');
                            }

                            el.removeClass('item-animate');
                        },  k * 200, 'easeInOutExpo' );
                    });

                }, 100);

            }

        } , { offset: '85%' } );
    };


    var dropdown = function() {
        $('.has-dropdown').mouseenter(function(){
            var $this = $(this);
            $this
                .find('.dropdown')
                .css('display', 'block')
                .addClass('animated-fast fadeInUpMenu');
        }).mouseleave(function(){
            var $this = $(this);
            $this
                .find('.dropdown')
                .css('display', 'none')
                .removeClass('animated-fast fadeInUpMenu');
        });

    };

    // Loading page
    var loaderPage = function() {
        $(".loader").fadeOut("slow");
    };

    var counter = function() {
        $('.js-counter').countTo({
             formatter: function (value, options) {
          return value.toFixed(options.decimals);
        },
        });
    };

    var counterWayPoint = function() {
        if ($('#gtco-counter').length > 0 ) {
            $('#gtco-counter').waypoint( function( direction ) {

                if( direction === 'down' && !$(this.element).hasClass('animated') ) {
                    setTimeout( counter , 400);
                    $(this.element).addClass('animated');
                }
            } , { offset: '90%' } );
        }
    };

    $(function(){
        mobileMenuOutsideClick();
        formTab();
        burgerMenu();
        contentWayPoint();
        dropdown();
        loaderPage();
        counterWayPoint();
        accessCamera();
        takePhotoTrigger();
        registerPhotoTrigger();
        changeTab();
    });


}());