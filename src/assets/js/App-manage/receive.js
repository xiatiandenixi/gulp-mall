;
(function ($, window) {
  window.fnObj = {}

  var MarketList = "/app/getMarketList"

  fnObj["receive"] = function (flag, result) {
    /* ========== flag is control step or dom operate ========  */

    /* === flag = 1 express prev step / flag = 2  next step ==== */   
    if (!flag) {
        var indexs = 0;
        var marketFlag ;
        if (result.mer) {
          if (result.mer.market || result.mer.market == 0) {
            marketFlag = true;
          }
        }            
        if (marketFlag) {          
          ajax({
        url: MarketList,
        callback: function (data) {
          var arr = data[0].data;
          var html = '';          
          arr.forEach(function (element, index) {           
            if (element.id == result.mer.market) {
              indexs = index;
            }
            html += 
                 '<li data-id= ' + element.id +' >' +
                     ' <p>' +
                      '  <img src=' + "../../static/images/grounding/" + element.icon +' alt="" height="50" width="45">' +
                      '</p>' +
                        element.marketName  +
                   ' </li>'
            
          })
          $(".receive ul").html(html);
          $(".appName input").val(result.mer.merchandiseName)
          $(".openService option").each(function(index, element){
              if ($(this).val() == result.mer.openMode) {
                $(this).attr("selected","selected")
                return
              }
          })
         $(".receive .appName , .receive .openService").show()
          $(".receive li").eq(indexs).addClass("active").siblings().removeClass("active");
          $(".receive li").click(function () {
          if ($(this).attr("data-id") == "2" || $(this).attr("data-id") == 3) { 
          toastr.info("此应用没有开通")           
            return 
          }
          $(this).addClass("active").siblings().removeClass("active")
      })        
        }
      })
          return 
        }
          $(".receive .appName ,.receive .openService").show()
          $(".appName input").blur(function(){           
              if (!$(this).val().trim()) {
              $(this).siblings("p.info-p").remove();
              $(this).after("<p class='info-p'>不能为空</p>"); 
                $(".receive input").css({"borderColor": "#DD3730"})
                animated($(".receive input"),"fadeIn")
                return
              }
               $(".appName").removeClass("test-empty");
              if ($(this).val().length > 90) {
                // $(".appName").addClass("test-length").removeClass("test-empty");
                 $(this).siblings("p.info-p").remove();
                 $(this).after("<p class='info-p'>不能超过90个字符</p>");
                // $(this).siblings("em").remove();
                // $(this).after("<em class='tips-length'>不能超过90个字符</em>");
                return
              }
                 $(this).siblings("p.info-p").remove();
              $(this).css({"borderColor": "rgb(27, 168, 237)"})
          })
        $(".receive li").eq(indexs).addClass("active").siblings().removeClass("active");
          $(".receive li").click(function () {
           if ($(this).attr("data-id") == "2" || $(this).attr("data-id") == 3) { 
          toastr.info("此应用没有开通")           
            return 
          }
          $(this).addClass("active").siblings().removeClass("active")
      })
    }
    if (flag == 2) {
      if (!$(".receive input").val().trim()) {        
        animated($(".receive input"),"fadeIn")
        $(".receive input").css({"borderColor": "#DD3730"})
        //  $(".appName p").remove();
        // $(".receive input").after("<p class='tips'>显示不为空</p>")
       $(this).siblings("p.info-p").remove();
       $(this).after("<p class='info-p'>不能为空</p>"); 
        setTimeout(function(){
           $(".receive input").css({"borderColor": "#999)"})
           $(".appName").removeClass("test-empty")
          // $(".appName p").remove();
        },5000)
        return 
      }
        if ($(".appName input").val().length > 90) {
                // $(".appName input").siblings("em").remove();
                // $(".appName input").after("<em class='tips-length'>不能超过90个字符</em>");
                  $(this).siblings("p.info-p").remove();
                 $(this).after("<p class='info-p'>不能超过90个字符</p>"); 
                return
              }     
      return {
        "marketId": $(".receive .active").attr("data-id"),
        "merId": result.mer ? result.mer.id : "",
        "merName": $(".appName input").val(),
        "openMode": $(".openService select").val()
      }

    }

  }


})($, window)
