;
(function ($, window) {

    var text = "<p>小贷业务系统是专门为满足小额信贷公司业务管理与业务经营需要，为小额信贷公司从贷款申请受理到贷款结清、风险控制到客户服务这一过程中所发生的交易记录、费用审批、交易跟踪、财务结算、合同管理、风险管理以及流程管理等事务而开发的一套核心业务系统。系统包括信贷全生命周期的管理，包括贷前、贷中、贷后的审批作业系统、账务、催收、征信、支付清算，实现从申请到结清的整个过程管理...</p><button>了解详情</button>"
    // $(".layout .service li ").eq(0).addClass("active-service").html(text);
    $(".layout .service li ").on("mouseenter", function () {
        $(this).addClass("active-service");;
        // if ($(this).children("p").html().length > 200) {
            var tmp = text.substr(0, 150)
            $(this).children("p").html(tmp + "....")
        // }
    });
    $('.layout .service li').on("mouseleave", function () {
        $(".layout .service li ").removeClass("active-service")
    });
    // this is banner swiper plugin  in order to write information 
    var swiper = new Swiper('.banner .swiper-container', {
        speed: 0,
        // resize: false,  
        easing: 'linear',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        pagination: '.swiper-pagination',
        autoplay: true,
        loop: true,
        grabCursor: true,
        paginationType: 'bullets',
        paginationClickable: true
    });
    var step = 0;
    var previewSwiper = new Swiper('.preview .swiper-container', {
        visibilityFullFit: true,
        slidesPerView: 'auto',
        onlyExternal: true,
        width: 300,
        onSlideClick: function (e) {
            updateNavPosition('', previewSwiper.clickedSlideIndex);
        }
    })
    $('.preview .arrow-left').on('click', function (e) {
        e.preventDefault()
        previewSwiper.swipePrev()
        step -= 1;
        updateNavPosition(step)
    })
    $('.preview .arrow-right').on('click', function (e) {
        e.preventDefault()
        previewSwiper.swipeNext()
        step += 1;
        updateNavPosition(step)
    })


    function updateNavPosition(step1, value) {

        if (step1 == "") {
            step1 = 0
        }

        var tmp = previewSwiper.clickedSlideIndex;
        if (!previewSwiper.clickedSlideIndex) {
            tmp = 0;
        }

        var result = tmp + step1;
        if (result > previewSwiper.slides.length - 7) {
            step1 = previewSwiper.slides.length - 7;
            result = previewSwiper.slides.length - 7;
        }

        if (result < 0) {
            step1 = 0;
            result = 0;
        }

        step = step1;

        $('.preview .active-nav').removeClass('active-nav')
        var activeNav = $('.preview .swiper-slide').eq(result).addClass('active-nav')

        if (!activeNav.hasClass('swiper-slide-visible')) {
            if (previewSwiper.activeIndex < activeNav.index()) {
                previewSwiper.swipeTo(activeNav.index() - 3)
            } else {
                previewSwiper.swipeTo(activeNav.index())
            }
        }

    }

    
    // $(".tab>.tab-item").click(function(){
    //     $(this).addClass("active").siblings().removeClass("active");
    //     var index = $(this).index();
    //     $(".solutionContents>.main").eq(index).addClass("selected").siblings().removeClass("selected");
    // })


   
    $(".tab>.tab-item").hover(function(){
        $(this).addClass("active").siblings().removeClass("active");
        var index = $(this).index();
        $(".solutionContents>.main").eq(index).addClass("selected").siblings().removeClass("selected");
    },function(){
        // $("p").css("background-color","pink");
    });
 

})($, window)
