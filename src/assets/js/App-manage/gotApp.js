;
(function ($, window) {
  var gotUrl = "/merchandise/postQueryOnSale";
  var previewUrl = "/merchandise/getDetail";
  var offlineAppUrl = "/merchandise/postTakeOffShelves"; 
  var gotTpl = App.loadTemplate("gotApp", "./gotApp.ejs");
  var cardTpl = App.loadTemplate("gotcard", "./gotCard.ejs");
  var previewTpl = App.loadTemplate("preview", "./preview.ejs");
  var timeFormat = {
    "0-1-0": "一个月",
    "0-3-0": "三个月",
    "1-0-0": "一年"
  }

  /* ==================== hash route ========================= */
  App.routeMap["#gotApp"] = function () {
    $(".box").css({display: "none"});
       var params = {
    "pageSize": 9,
    "page": 1,
    "sortByName": "desc",
    "sortByTime": "desc",
    "merName": ""
  };
      $("aside dl").eq(0).addClass("l-aside").siblings().removeClass("l-aside");
      $("aside dl").eq(0).children("dt").children("i.fa")
        .removeClass("fa-caret-right").addClass("fa-caret-down");
      $("aside dl").eq(0).children("dd").show().eq(1).addClass("active").siblings().removeClass("active")
      $.when(gotTpl).then(function(tpl){        
            $(".product").html(tpl)
          $(".title input").on("change", function () {
              params.merName = $(this).val().trim();
              moreFn(params);
            })
            /* ================= sortByName or sortByTime click ==================== */
          $(".title dt").on("click", function () {
              params.merName = $("title input").val();
              $(this).toggleClass("toggle-caret");
              if (!$(this).hasClass("toggle-caret")) {
                $(this).children("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                if ($(this).parent().index() == 1) {
                  params.sortByName = "asc"
                } else {
                  params.sortByTime = "asc"
                }
              } else {
                $(this).children("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                if ($(this).parent().index() == 1) {
                  params.sortByName = "desc"
                } else {
                  params.sortByTime = "desc"
                }
              }
              moreFn(params)
            })
            /* ~~~~~~~~~~~~~~~~~~~~~~~~~ sortByName or sortByTime  end ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
          moreFn(params);      
      })
          
    function moreFn(params) {
    pagination({
      url: gotUrl,
      isPage: true,
      type: "post",
      contentType: "application/json",
       tpl: cardTpl,
      callback: function (pageData, tpl) {
        var result = pageData[0].data;
        console.log("gotResult")       
        console.log(result)
        $("#page").show()
        if (result.items.length < params.pageSize) {
          $("#page").css({ "display": "none" })
        }
        if (!result.items.length) {
          $("#page").css({ "display": "none" })
          $("#gotcard").addClass("nofound")
          $("#gotcard").html("未找到该应用...... ")
          return
        }
        $("#gotcard").removeClass("nofound")      
        var html = ejs.render(tpl, {"items": result.items, fileUrl: fileUrl});        
        $("#gotcard").html(html)
        $("#gotcard .btn button").click(function () {
          var id = $(this).parent().attr("data-id");
          /* ==== look detail page ==== */
          if ($(this).index() == 0 && $(this).html() == "查看详情") {            
            ajax({
              url: previewUrl,
              tpl: previewTpl,
              callback: function(data,tpl){               
                   var html = ejs.render(tpl,{
                    "data": data[0].data,
                    "timeFormat": timeFormat
                  })
                  $(".box").html(html)                 
                  $("#preview-course").html(data[0].data.mer.course);
                   // $("body").css({"overflow": "hidden"});                 
                   $("body").css("height: 200%")
                   $(".box").css({display: "block"});
                  $(".preview i").click(function(){
                     $("body").css("height: 100%;")
                    $(".box").css({display: "none"});
                     $("body").css({"overflow": "visible"})                  
                  })                

                  $(".btn-close").click(function(){
                     $("body").css("height: 100%;")
                    $(".box").css({display: "none"});
                     $("body").css({"overflow": "visible"})                  
                  })

              }
            },{id: id})
          }
          /* ---- look detail page ---- */
          /* ==== click became offlineApp ==== */
          if ($(this).index() == 1 && $(this).html() == "下架") {             
            App.comform(function () {
              ajax({
                url: offlineAppUrl,
                type: "post",
                contentType: "application/json",
                callback: function(data){
                 if (data[0].success) {
                   moreFn(params)
                 }                 
                }
              },{id: id})
            }, "下架")
          }
          /* ---- click became offlineApp ---- */

        })

      }   
    }, params)
  }
    }
    /*~~~~~~~~~~~~~~~~~~~~~hash ending ~~~~~~~~~~~~~~~~~~~~~~~~~ */
  

})($, window);
