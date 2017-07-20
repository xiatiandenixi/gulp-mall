;
(function ($, window) {
  /* ==== aside  click or css toggle start ==== */
  $(".layout aside dl").each(function (index, element) {
    if (!$(this).children("dd").length) {
      $(this).children("dt").children("i.fa").remove()
    }
  })

  $(".layout aside dl").on("click", "dt", function () {
    $(this).siblings("dd").toggle(); 
   if ($(this).siblings("dd").css("display") == "none") {
     $(this).children("i.fa")
      .removeClass("fa-caret-down")
      .addClass("fa-caret-right");
      return
   }

    /*  ==== dl add css l-aside start ==== */

    $(this).parent().addClass("l-aside")
      .siblings().removeClass("l-aside")
      .children("dd").removeClass("active");

    /* ~~~~ dl add css l-aside end ~~~~ */
    
    /* dt i:last-child change to right or down start */
    $(this).children("i.fa")
      .removeClass("fa-caret-right")
      .addClass("fa-caret-down");
    $(this).parent().siblings().children("dd").hide();
    $(this).parent().siblings().children("dt")
      .children("i.fa").removeClass("fa-caret-down").addClass("fa-caret-right");
    /* dt i:last-child change to right or down end */
  }) 

  $(".layout aside dd").click(function () {
      console.log($(this).index())     
     // if ($(this).index() == 1) {
      // window.location.reload()  
    // }   
    $(this).addClass("active").siblings().removeClass("active");
    $(this).parent().addClass("l-aside").siblings()
      .removeClass("l-aside").children().removeClass("active")
  })

  /* ~~~~~~~~~ aside  click or css toggle end ~~~~~~~~~~*/


  /*================= URL variable state ================== */
  var MarketList = "/app/getMarketList"
  var receiveNext = "/app/postGotoAppList"

  var appNext = "/app/postGotoBaseInfo"

  var appPrev = "/app/getMarketByMer";

  var basicNext = "/app/postGotoSptInfo"

  var basicPrev = "/app/getAppsByMer"

  var saleNext = "/app/postFinish"

  var salePrev = "/app/getGotoBaseInfo"


  var basicInfo = "/app/getGotoBaseInfo";

  var urlObj = {
    "receive": receiveNext,
    "select": appNext,
    "basicInfo": basicNext,
    "saleRule": saleNext,
  }

  var urlPrev = {
    "receive": MarketList,
    "select": appPrev,
    "basicInfo": basicPrev,
    "saleRule": salePrev,
  }

  var UrlFile = ":8080/oss/api/filebypath";

  /* ~~~~~~~~~~~~~~~~~~ URL variable end ~~~~~~~~~~~~~~~~~~~~ */
  var params = {}
  var getTpl = App.loadTemplate("getApp", './getApp.ejs');
  var receiveTpl = App.loadTemplate("receive", "./receive.ejs")
  var saleTpl = App.loadTemplate("saleRule", "./saleRule.ejs")
  var selectTpl = App.loadTemplate("selectApp", "./selectApp.ejs")
  var baseTpl = App.loadTemplate("baseTpl", "./baseInfo.ejs")
  var submitTpl = App.loadTemplate("submitInfo", "./submitInfo.ejs")
  var tplObj = {
      "receive": receiveTpl,
      "select": selectTpl,
      "basicInfo": baseTpl,
      "saleRule": saleTpl,
      "submitTpl": submitTpl
    }
    /* ====================== hash route ======================== */
  App.routeMap["#getApp"] = function () {
      $("#page").hide();      
      $("aside dl").eq(0).addClass("l-aside").siblings().removeClass("l-aside");
      $("aside dl").eq(0).children("dt").children("i.fa")
        .removeClass("fa-caret-right").addClass("fa-caret-down");
      $("aside dl").eq(0).children("dd").show().eq(0).addClass("active").siblings().removeClass("active")
      /* ===== getApp is beginning ===== */
      $.when(getTpl).then(function(tpl){
        $(".product").html(tpl)
         /*  ====== current step ======== */
            var linkHash = window.location.hash.split("?")[1];
            var showIndex;
            if (!linkHash) {
              showIndex = 0;
              nextStep(MarketList, receiveTpl, {}, fnObj.receive)
            } else {
              var tmpLink = App.decodeParams(linkHash);
              var basicLink = 1;
              showIndex =  parseInt(tmpLink.step) == 4 ? 1 : parseInt(tmpLink.step);
              if (tmpLink.market == "4" && showIndex == 1) {
                showIndex = 2;
                basicLink = 2
              }
              var linkParams = $(".grounding .first-app").eq(showIndex).attr("data-tpl");
              showIndex -= basicLink
              var linkCurrent = $(".grounding .first-app").eq(showIndex).attr("data-tpl");             
              nextStep(urlPrev[linkParams], tplObj[linkCurrent], tmpLink, fnObj[linkCurrent])                           
            }
            /* ========= init onload  page ========= */
            function nextStep(url, tpl, params, callback) {
              var method = false;
              if (url.indexOf("post") != -1) {
                var method = true;
              }
              /* ////////   inside ajax begin  */
              ajax({
                  url: url,
                  tpl: tpl,
                  type: method ? "post" : false,
                  contentType: method ? "application/json" : false,
                  /* /////////    inside ajax  callback begin  */
                  callback: function (data, tpl) {
                      var result = data[0].data;
                      if (!data[0].success) {
                        App.comform("","你填写的信息格式有误 请核实","error")
                        console.log(data[0])
                        return
                      }
                      console.log("every fn")
                      console.log(data[0])
                      var html = ejs.render(tpl, {
                        "data": data[0].data,
                        "fileUrl": fileUrl
                      })
                      var currentIndex = $(".show-app").index();
                      if (showIndex > currentIndex) {                                             
                         for(var i = 0; i <= showIndex - 1; i++) {
                          if (i == showIndex) {
                            break;
                          }
                          $(".selected ol li").eq(i).removeClass("leave").addClass("finish")
                        }                        
                        if (showIndex == $(".first-app").length - 1) {                         
                          $(".selected ol li").eq(currentIndex).removeClass("edit").addClass("finish")
                          $(".grounding .first-app").eq(showIndex).html(html).addClass("show-app").siblings().removeClass("show-app");
                          /* this is last page  go to first link start */
                          $(".keepOn").click(function () {
                              $(".grounding .first-app").eq(showIndex).removeClass("show-app")
                              $(".selected ol").children("li").removeClass("finish").addClass("leave")
                              showIndex = 0
                              nextStep(MarketList, receiveTpl, {}, fnObj.receive)
                            })
                            /* this is last page  go to first link start */
                          return
                        }
                        if (currentIndex == -1) {
                          $(".selected ol li").eq(showIndex).addClass("edit").siblings().removeClass("edit");
                          $(".grounding .first-app").eq(showIndex).html(html).addClass("show-app").siblings().removeClass("show-app");
                        } else {
                          $(".selected ol li").eq(currentIndex).removeClass("edit").addClass("finish")
                          $(".selected ol li").eq(showIndex).removeClass("leave").addClass("edit")
                          $(".grounding .first-app").eq(showIndex).html(html).addClass("show-app").siblings().removeClass("show-app");
                        }                       
                      }
                      if (showIndex < currentIndex) {                         
                          if (showIndex == 0 && data[0].data.mer.market == 4) {
                             $(".selected ol li").eq(showIndex + 1).removeClass("finish").addClass("leave")
                          }                                    
                        $(".selected ol li").eq(currentIndex).removeClass("edit").addClass("leave")
                        $(".selected ol li").eq(showIndex).removeClass("finish").addClass("edit")
                        $(".grounding .first-app").eq(showIndex).html(html).addClass("show-app").siblings().removeClass("show-app");
                      }
                      callback(0, result)


                      /*========================================= step button click is start ========================================== */
                      $("#" + $(".show-app").attr("data-tpl") + " button").on("click", function (e) {
                        var stepIndex = $(".show-app").index();
                        var tmp = $(".show-app .step-btn button").length - 1;
                        var Info;
                        var currentUrl = $(".show-app").attr("data-tpl");
                        var nature;
                        /*         prev step       */
                        if ($(this).index() == 0 && tmp > 0) {
                          stepIndex -= 1;
                          Info = callback(1, result)
                          if (!Info) {                   
                            return
                          }
                          console.log("this prev step")
                          console.log(Info)
                          var prevToggle;
                          if (result.mer) {
                            if (result.mer.market == "4") {
                              prevToggle = true;
                            }
                          }
                          if (result.market == "4" || prevToggle) {
                            if (stepIndex == 1) {
                              stepIndex = 0;
                            }
                          }
                          nature = $(".first-app").eq(stepIndex).attr("data-tpl");
                          nextStep(urlPrev[currentUrl], tplObj[nature], Info, fnObj[nature])
                          $(this).off("click")

                        }
                        /*      look                */
                        if (tmp >= 2 && $(this).html() == "预览") {
                          window.open("../detail.html")                         
                        }
                        /*           next step                        */
                        if (tmp == 0 || $(this).index() == tmp) {
                          Info = callback(2, result)
                          if (!Info) {                                                     
                            return
                          }
                          console.log("this next step")
                          console.log(Info)
                          stepIndex += 1;
                          /* =====  skip  to  fourth page ==== */                       
                          if (tmp == 0 && Info.marketId == "4") {
                            stepIndex = 2
                          }
                          /* -----  skip  to  fourth page ---- */
                          nature = $(".first-app").eq(stepIndex).attr("data-tpl");
                          nextStep(urlObj[currentUrl], tplObj[nature], Info, fnObj[nature])                        
                          $(this).off("click")

                        }
                        showIndex = stepIndex

                      })

                      /*========================================= step button click is ending ========================================== */

                    }
                    /* ////////   inside ajax   callback end    */
                }, params)
                /* ////////    inside ajax end    */
            }
      })
      /*    ----- getApp is end ------   */

    }
    /* ~~~~~~~~~~~~~~~~~~~~ hash route end ~~~~~~~~~~~~~~~~~~~~~~*/








})($, window)
