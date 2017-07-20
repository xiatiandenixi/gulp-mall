;
(function ($, window) { 
  var appUrl = "/app/getAppsForPage";
  var getCategorys = "/voltage/getVoltages";
  var toggle = true;
  var AppTpl = App.loadTemplate("all", "./cloud.ejs")
  /* ==========  carry params to server ========= */
  var params = {
      "pageSize": 9,
      "page": 1,
      "hot": false,
      "recent": false,
      "categoryId": ""
    }
    /* ~~~~~~~~~ carrry params to server is ending ~~~~~~~~ */

  /* operate page  */
  $(".user .sure").click(function () {
    window.location.href = "providersAudit.html";
  })


  /* ===============  categorys ajax start =============== */

  ajax({
    url: getCategorys,
    callback: function (datas, tpl) {
      var result = datas[0].data;     
      var str = '';
      if (toggle) {
        for (var i = 0; i < result.length; i++) {
          str =          '<div class="categoryParent">' +
                    '<span data-id=' + result[i].id +'><a href="javascript:void(0)" >' + result[i].voltage_name + '</a></span>' +
                    '<ul class="second-menu"></ul>'+                
                  '</div>';
          $(".first-menu").append(str)
        }
        toggle = false
      }

      $(".first-menu span a").click(function () {           
        var id = $(this).parent().attr("data-id");
        var that = $(this).parent().siblings(".second-menu");
        $(".title li").removeClass("all");
        $(".first-menu span").removeClass("all");
        $(this).parent().addClass("all");
        $(this).parent().parent().siblings().children(".second-menu").hide();
        that.toggle();
        if (that.css("display") == "block") {
          ajax({
            url: getCategorys,
            callback: function (data) {             
              var response = data[0].data;              
                 params = {
                  "pageSize": 9,
                  "page": 1,
                  "hot": false,
                  "recent": false,
                 "categoryId": id
                }            
                moreFn(params)
              if (data[0].success) {
                var html = '';
                that.html("");
                for (var i = 0; i < response.length; i++) {
                  html = 
                 '<li data-id=' + response[i].id + '><a href="javascript:void(0)">' + response[i].voltage_name + '</a></li>';
                  that.append(html)
                }
              }
            }
          }, { "parentId": id })
        }
      })      
    }
  }, { "parentId": -1 })

  /* ~~~~~~~~~~ categorys ajax end ~~~~~~~~~~~~ */


  $(".aside-ul").delegate("li", "click", function () {     
    if (!$(this).hasClass("kind")) {
       window.location.reload();
      $(".title li").removeClass("all");
      $(".first-menu span").removeClass("all");
      $(this).addClass("all");
      if ($(this).parent().hasClass("second-menu")) {           
        var id = $(this).attr("data-id");       
         params = {
                  "pageSize": 9,
                  "page": 1,
                  "hot": false,
                  "recent": false,
                 "categoryId": id
                }               
                moreFn(params)       
      }
      return
    }
    $(".first-menu").toggle()
    
  })

  $(".title").delegate(".second-menu > li", "click", function () {     
      $(".title li").removeClass("all");
      $(".first-menu span").removeClass("all");
      $(this).addClass("all");
      if ($(this).parent().hasClass("second-menu")) {           
        var id = $(this).attr("data-id");       
         params = {
                  "pageSize": 9,
                  "page": 1,
                  "hot": false,
                  "recent": false,
                 "categoryId": id
                }               
                moreFn(params)       
      }   
  })


  // moreFn(params) 

  /* ====================== hash route ====================== */
  App.routeMap["#all"] = function () {
    $(".title li").eq(0).addClass("all").siblings().removeClass("all")
    $(".appTitle").html("全部");
    params = {
      "pageSize": 9,
      "page": 1,
      "hot": false,
      "recent": false,
    }
    moreFn(params)
  }
  App.routeMap["#hot"] = function () {
    $(".title li").eq(1).addClass("all").siblings().removeClass("all")
    $(".appTitle").html("热门应用");
    params = {
      "pageSize": 9,
      "page": 1,
      "hot": true,
      "recent": false,
    }
    moreFn(params)
  }

  App.routeMap["#recent"] = function () {
    $(".title li").eq(2).addClass("all").siblings().removeClass("all")
    $(".appTitle").html("最新应用");
    params = {
      "pageSize": 9,
      "page": 1,
      "hot": false,
      "recent": true,
    }
    moreFn(params)
  }

  function moreFn(parameter) {
    pagination({
      url: appUrl,
      "isPage": true,
      callback: function (response, tpl) {
        var data = {
          data1: response[0].data.items,
          fileUrl: fileUrl
        };
        if (!response[0].data.items.length) {
          $("#product").html($("#tem").html());
          $("#page").css({ "display": "none" })
          return;
        }
        if (response[0].data.items.length < params.pageSize) {
          $("#page").css({ "display": "none" })
        }
        $("#page").css({ "display": "block" })
        var html = ejs.render(tpl, data);
        $("#product").html(html); 
        var stars = $('.ols .star').length;
        for (var i = 0; i < stars; i++) {
          var tmpId = $('.ols .star').eq(i).attr('id');
          raty(tmpId);
        }
        $("#product li").on("mouseenter", function () {
          $(this).children(".favorite").css({ display: "inline-block" })
           $(".wrapper").dotdotdot();
        })
        $("#product li").on("mouseleave", function () {
          $(this).children(".favorite").css({ display: "none" })
        })
      },
      tpl: AppTpl
    }, parameter, function () {
      $("#product").html($("#tem").html());
      console.log("it is error")
        // window.location.href = "../404.html"
    })
  }
  App.adjustCurrentHash()

  /* ~~~~~~~~~~~~~~~~~ hash route end ~~~~~~~~~~~~~~~~~~~~ */

})($, window)
