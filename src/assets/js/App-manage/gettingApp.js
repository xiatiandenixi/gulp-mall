;
(function ($, window) {

  var appStatus = [
    { "text": "未上架", "button": "编辑上架" },
    { "text": "", "button": "审核中" },
    { "text": "", "button": "" },
    { "text": "审核不通过", "button": "重新上架" },
    { "text": "已下架", "button": "重新上架" }
  ]

  var gettingUrl = "/merchandise/postQueryForSale";
  var gettingDelUrl = "/merchandise/postDeleteMerchandise";  

  var gettingTpl = App.loadTemplate("gettingApp", "./gettingApp.ejs");
  var cardTpl = App.loadTemplate("gettingCard","./gettingCard.ejs");
  /* ====================== hash route =========================== */
  App.routeMap["#gettingApp"] = function () {
    $(".box").css({display: "none"});
    var params = {    
    "pageSize": 9,
    "page": 1,
    "merName": "",
    "listStatus": ""   
  };   
    $("aside dl").eq(0).addClass("l-aside").siblings().removeClass("l-aside");
    $("aside dl").eq(0).children("dt").children("i.fa")
      .removeClass("fa-caret-right").addClass("fa-caret-down");
    $("aside dl").eq(0).children("dd").show().eq(2).addClass("active").siblings().removeClass("active")
    $.when(gettingTpl).then(function(tpl){
      var html = ejs.render(tpl, {"appStatus": appStatus})
      $(".product").html(html)
       $(".title .search input").change(function(){                      
            params.merName = $(this).val();
            gettingAppPage(params)
          })     
       $(".getting-select select").change(function(){
        params.listStatus = $(this).val()         
          gettingAppPage(params)
       })
       gettingAppPage(params)
    })    
    function gettingAppPage (params) {
       pagination({
        url: gettingUrl,
        type: "post",
        contentType: "application/json",
        isPage: true,
        tpl: cardTpl,
        callback: function (data, tpl) {          
           $("#page").show();          
             if (data[0].data.totalCount < params.pageSize) {
          $("#page").css({ "display": "none" })
        }
        if (!data[0].data.items.length) {
          $("#page").css({ "display": "none" })
          $("#gettingcard").addClass("nofound")
          $("#gettingcard").html("未找到该应用...... ")
          return
        } 
         $("#gettingcard").removeClass("nofound")        
          var html = ejs.render(tpl, { 
            "items": data[0].data.items, 
            "appStatus": appStatus,
            "fileUrl": fileUrl
             });
          $("#gettingcard").html(html)         
          $("#gettingcard .look-detail").click(function () {
            if ($(this).parent().hasClass("disable-edit")) {
              animated($(this), "shake")
              return
            }
            var result = data[0].data.items[$(this).parent().parent().index()]          
            var obj = {};
            switch (result.step) {
              case "1":
                obj = {
                  "merId": result.id,
                  "openMode": result.openMode,
                  "merName": result.merName,                  
                };
                break;
              case "2":
                if (result.market == "4") {
                  obj = {
                    "merId": result.id,
                    "openMode": result.openMode,
                    "merName": result.merName
                  }
                } else {
                  obj = {
                    "categoryId": result.categoryId ,
                    "appIds": result.appIds ,
                    "merId": result.id 
                  }
                }
                ;break;
              case "3":
                obj = {
                  "merId": result.id
                }
                ;break;
              case "4":
                  obj = {
                  "merId": result.id,
                  "openMode": result.openMode,
                  "merName": result.merName,                  
                };
                ;break;
            }
            obj.step = result.step;
            obj.market = result.market;
            window.location.hash = "#getApp?" + App.encodeParams(obj)
          })
          $("#gettingcard .btn i").click(function(){
           var id = $(this).parent().parent().attr("data-id");
            App.comform(function(){
              ajax({
                url: gettingDelUrl,
                type: "post",
                contentType: "application/json",
                callback: function(data){                 
                  if (data[0].success) {
                    gettingAppPage(params)
                  }
                }
              },{id: id})

           })

          })
        }
      },
      params)
    }

  }






  /* ~~~~~~~~~~~~~~~~~~~~~~ hash end ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
})($, window)
