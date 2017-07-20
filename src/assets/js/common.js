/* this is common part code */
(function($, window){
    window.logout="/ifbp-bop-web/logout?service="+window.location.href;
   /* ==== set input search width when focus start ==== */
   
  $(".login a").click(function(){
    if ($(this).html() == "登录") {
      loginto()
    }
  }) 
 
 
  $(".withDraw").attr("href",logout);

  $(".setAccount").attr("href","manageAccount.html#basics");

  /* ~~~~ set input search width when focus end   ~~~~ */


/* =========== according to cookie change login status start =========== */
  if (!$.cookie("_A_P_userName")) {
    $(".layout .login").show()
    $(".personalInfor").hide()
  }else{
    $(".layout .login").hide()
    $(".personalInfor").show()
  }
   $(".personalInfor h4").click(function(){  
     
      if ($(this).hasClass("showUser")) {
       $(this).removeClass("showUser")
        $(this).children("i").addClass("fa-angle-up").removeClass("fa-angle-down");
         $(".personalInfor .account").show()
          $(".account .on a").click(function(){
            console.log($(this).attr("href"))
            if ($(this).attr("href") == "javascript:void(0)") {
               $(this).attr("href","login/manageAccount.html#basics")
            }        
      })
         return
      }      
       $(this).addClass("showUser")
      $(this).children("i").addClass("fa-angle-down").removeClass("fa-angle-up");
      $(".personalInfor .account").hide()
      
    })
  
  $(".personalInfor h4 span").html($.cookie("_A_P_userName")?$.cookie("_A_P_userName"):"未登录！");
/* ~~~~~~~~~~ according to cookie change login status end ~~~~~~~~~~ */
  window.animated = function(element,animate) {       
        element.removeClass().addClass(animate + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass();
    });
  }
  

})($,window)
