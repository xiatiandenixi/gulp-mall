;(function($,window){
  var providersUrl = "/trade/getProviderOrders";
  var provideDetailUrl="/trade/getProviderOrderDetail";
  var providersTpl = App.loadTemplate("providers","./providers.ejs");
  var providersTableTpl = App.loadTemplate("providers","./providersTable.ejs");
  var provideDetailTpl = App.loadTemplate("provideDetail","./provideDetail.ejs");
  var params={
      "page":1,
      "pageSize":6,
      "orderNo":"",
      "merName":"",
      "creationtime":"",
      "tenant":"",
      "listStatus":"",
      "openStatus":""
  }

  /* ====================== hash route =========================== */
  App.routeMap["#providers"] = function () {
    $('box').css({display: "none"});
     $("aside dl").eq(1).addClass("l-aside").siblings().removeClass("l-aside");
   ajax({
      url: providersUrl,
      type: "get",
      tpl: providersTpl,
      callback: function(data, tpl) {
        if (data[0].success === false){
          alert(data[0].error.errorMessage);
          return;
        }
        if (!data[0].data) {
          return;         
        }
        var html = ejs.render(tpl,{"items": data[0].data.items});
        $(".product").html(html)

        // 选择的日期(插件)
        $("#providersDate").jeDate({
            isinitVal:false,
            ishmsVal:false,
            minDate: '2016-06-16 23:59:59',
            maxDate: $.nowDate({DD:0}),
            format:"YYYY-MM-DD hh:mm:ss",
            zIndex:3000
        })
        // 搜索按钮查询
      $("#providers .query").click(function(){
         pagination({
            url: providersUrl,
            type: "get",
            isPage: true,
            tpl: providersTableTpl,
            callback: function(data ,tpl) {
              console.log(data[0].data);
                var html = ejs.render(tpl,{data:data[0].data,openStatus:
                {"1":"已开通","0":"未开通"},listStatus:
                {"1":"已支付","0":"未支付"}});
                $(".tableItem tbody").html(html);
                 if (!data[0].data.items.length) {
                  $("#page").css({ "opacity": "0" });        
                 };
            }
          },{
             "page":1,
             "pageSize":6,
             "merName":$("#applyName").val(),
             "listStatus":$("#payStatus").val(),
             "creationtime":$("#providersDate").val(),
             "orderNo":$("#orderNumber").val(),
             "tenant":$("#purchaser").val(),
             "openStatus":$("#openingStatus").val()
            });           
      })

      
       $('body').delegate("#providers .userId", 'click', function(e){
             // alert($(this).attr("merId"));
             // alert($(this).attr("orderFormNo"));
             ajax({
              url: provideDetailUrl,
              type: "get",
              tpl: provideDetailTpl,
              callback: function(data ,tpl) {
                  console.log(data);
                  var html = ejs.render(tpl,{data:data[0].data,openStatus:
                  {"1":"已开通","0":"未开通"},listStatus:
                  {"1":"已支付","0":"未支付"}});
                  $("#mount").html(html).show();
              }
            },{
               "orderNo":$(this).attr("orderFormNo"),
               "merId":parseInt($(this).attr("merId"))
              });

       });

       $('body').delegate(".popup .close", 'click', function(e){
          $("#mount").hide();
       })




        pagination({
        url: providersUrl,
        type: "get",
        isPage: true,
        contentType: "application/json",
        tpl: providersTableTpl,
        callback: function(data ,tpl) {
             console.log(data[0].data.items.length);
            var html = ejs.render(tpl,{data:data[0].data,openStatus:
            {"1":"已开通","0":"未开通"},listStatus:
            {"1":"已支付","0":"未支付"}});
            $(".tableItem tbody").html(html);
             if (!data[0].data.items.length) {
               $("#page").css({"opacity": "0" });        
             };
        }
      },{
         "page":1,
         "pageSize":6,
         "merName":$("#applyName").val(),
         "listStatus":$("#payStatus").val(),
         "creationtime":$("#providersDate").val(),
         "orderNo":$("#orderNumber").val(),
         "tenant":$("#purchaser").val(),
         "openStatus":$("#openingStatus").val()
        });

      }},params);




   
     

   }
  // App.adjustCurrentHash();
   

/* Window 枚举 购买期限 */
window.timeLimitStatus={"0-0-7":"一周","0-0-14":"两周","0-1-0":"一个月","0-3-0":"三个月","0-6-0":"半年",
"1-0-0":"一年","2-0-0":"两年","3-0-0":"三年","4-0-0":"四年"};


  /* ~~~~~~~~~~~~~~~~~~~~~~ hash end ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
})($,window)
