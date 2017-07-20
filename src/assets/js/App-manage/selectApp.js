;
(function ($, window) {

  /* variable defined */
  var obj = {}
  obj.module = [];
  var smallobj = {};
  var flagobj = {};

  /* url state */
  var UrlCreateApp = "/app/postCreateApp";
  var getCategorys = "/category/getCategorys";
  fnObj["select"] = function (isFlags, result) {
    /* variable define */
    var saveId;
    /* variable url state */
    var appList = "/app/getAppList";
    if (isFlags == 1) {
      return {
        "merId": result.merId || result.mer.id      
      }
    }
    if (isFlags == 2) {
      if (!$(".field select").val()) {
        $(".field p").remove();
        $(".field select").css({
          "borderColor": "red"
        })
        $(".field div").after("<p class='tips'>请选择领域</p>");
        setTimeout(function () {
          $(".field select").css({
            "borderColor": "rgb(169, 169, 169)"
          })
          $(".field p").remove();
        }, 3000)
      }
      if (!$(".app-list .checkbox-alive").length || $(".field select").val() == "") {
        return false
      }
      saveId = [];
      $(".app-list .checkbox-alive").each(function (element, index) {
        saveId.push($(this).attr("data-id"));
      });      
      return {
        "categoryId": $(".field select").val(),
        "appIds": saveId,
        "merId": result.merId || result.mer.id,
      }
    }
    /* ===================== DoM Operate  begin ====================== */
    if (!isFlags) {
     $().ready(function() {     
       $("#validate-url").validate( {
        errorPlacement: function(error, element) {
           $(element).parent().siblings("li").children("em").remove();
           $(element).siblings("em").remove();
          if (!element.val().trim()) {
            $(element).next("i").after('<em class="error-info">这是必填字段</em>')
          }else{
            $(element).next("i").after('<em class="error-info">请输入有效网址</em>')
          }                     
        },
         success: function(em,input) {
           $(input).siblings("em").remove();
         }    
       }
        );

     })     
    
      /* ==== click create App open new dialog begin ==== */
      $(".exist-app>button").on("click", function () {
          $(".create-app").css({ display: "block" });
          $(".box").css({ display: "block" });
          $("#preview").css({display: "none"});
          appListData({ "categoryId": $(".parent-select").val() })
          $(".field option").each(function (index, element) {
            if ($(this).val() == $(".parent-select").val()) {
              $(this).attr("selected", "selected")
            }
          })
        })
        /* ==============  ensure cancle close start ============ */
      $(".create-app .btn>button,.create-app .close").on("click", function (e) {         
          if (!$(this).hasClass("disable-btn")) {
            /*===点击确定按钮的判断==="*/
            if ($(this).parent().hasClass("btn")) {
              var temp;
              $(".create-app input").each(function (index, element) {
                if (!$(".create-app input").eq(index).val().trim()) {
                  $(this).css({borderColor: "rgb(213, 0, 0)"})
                  temp = index
                }
              })
              if (temp || temp == 0) {
                App.comform("","信息填写不完整",'info');
                return
              }
              obj.categoryId = $(".parent-select").val()
              obj.subCategoryId = $(".children-select").val() == "" ? "" : $(".children-select").val() ;
              $(".field option").each(function (index, element) {
                  if ($(this).val() == $(".parent-select").val()) {
                    $(this).attr("selected", "selected")
                  }
                })
                /* ===== submit data  ===== */
              ajax({
                  url: UrlCreateApp,
                  type: "post",
                  contentType: "application/json",
                  callback: function (data, tpl) {                   
                    if (data[0].success) {
                      $(".toggle-disable button").eq(1).removeClass("disable-btn");
                      var tmp = '<li class= "checkbox-alive" data-id=' + data[0].data.id + '>' +
                                  '<i></i>' +
                                  '<span for="" title='+ data[0].data.appName +'>' + data[0].data.appName + '</span>' +
                                '</li>';                         
                      if (!$(".app-list li").length) {
                        $(".app-list ul p").remove();
                        $(".app-list ul").html(tmp)
                      } else {
                        $(".app-list li").eq(0).before(tmp)
                      }
                      $(".create-app input").each(function (index, element) {
                        $(".create-app input").eq(index).val('');
                      })
                    }
                    $(".create-app").css({ display: "none" });
                    $(".box").css({ display: "none" })
                  }
                }, obj)
              return;
                /* ~~~~~~~~~  submit data end ~~~~~~~~~ */
            }
          }
          $(".create-app").css({ display: "none" });
          $(".box").css({ display: "none" })
        })
        /* ~~~~~~~~~~~~~~  ensure cancle close end ~~~~~~~~~~~~~~ */
      $(".create-app").delegate("input.test-input","blur",function(){
       if ($(this).val().length > 90) {
          $(this).parent().addClass("test-length").removeClass("test-empty");
          return         
         }
          $(this).parent().removeClass("test-length");
           if (!$(this).eq(0).val().trim()) {
           $(this).parent().addClass("test-empty");
            return
          }
          $(this).parent().removeClass("test-empty");

      })
      $(".create-app").on("change", "input", function (e) {        
        if ($(this).parent().html() == ($(".create-app input").eq(0)).parent().html()) {
          if (!$(".create-app input").eq(0).val().trim()) {
            $(this).css({ "borderColor": "rgb(213, 0, 0)" })
            return
          }  
          $(this).css({ "borderColor": "rgb(27, 168, 237)" })
          obj.appName = $(".create-app input").eq(0).val().trim();
        } else {
          var ipt = $(this).val().trim();
          if (!ipt) {
            $(this).css({ "borderColor": "rgb(213, 0, 0)" })
            return
          }
          $(this).css({ "borderColor": "rgb(27, 168, 237)" })
          smallobj[$(this).index()] = ipt;
          var tmp = {};
          for (var k in smallobj) {
            if (k == "1") {
              tmp["moduleName"] = smallobj[k]
            } else {

              tmp["moduleUrl"] = smallobj[k]
            }
          }
          obj.module[$(this).parent().index()] = tmp;
        }
      })
      $(".add-app").on("click", "i", function (e) {
          if ($(this).index() == 0) {
            var str = '<li>' +
                     ' <label for="" style="margin-right: 4px;">小应用名称</label>' +
                      '<input type="text" class="test-input" style="margin-right: 34px">' +
                      '<label for="" style="margin-right: 4px;">接口地址</label>' +
                      '<input type="url" required value="http://" style="margin-right: 34px">' +
                      '<i></i>' +
                    '</li>';
            $(".add-app ul").append(str)
            return
          }
          if ($(".add-app li").length > 1) {
            obj.module.splice($(this).parent().index(), 1)
            $(".add-app li").eq($(this).parent().index()).remove();
          }
        })
        /* ~~~~~~~~~~~~~~~~ click create App open new dialog end ~~~~~~~~~~~~~~~ */
        /* ========= loading category begin ======== */
      getCategory({ "parentId": -1 })

      function getCategory(paramsId) {
        ajax({
          url: getCategorys,
          callback: function (data) {
            var tmpData = data[0].data;
            var html = "<option value=''selected = 'selected'>全部</option>";
            tmpData.forEach(function (element, index) {
              html += "<option value =" + data[0].data[index].id + ">" + data[0].data[index].category_name + "</option>";
            })
            if (paramsId.parentId == -1) {
                $(".field select").html(html);
                $(".parent-select").html(html);
                $(".parent-select option:eq(0)").remove();
                var parentId = $(".parent-select option:eq(0)").val();
                if (result.categoryId) {                              
                  parentId = typeof result.categoryId != "undefined" ? result.categoryId : "";
                  $(".field option").each(function(index,element){
                    if ($(this).val() == parentId) {
                      $(this).attr("selected","selected");
                    }
                  })
                  getCategory({parentId: parentId});
                }else{
                  getCategory({parentId: parentId});
                  parentId = "";
                }
                $(".field select").change(function(){
                  parentId = $(this).val();
                  appListData({ "categoryId": parentId });
                   if (parentId) {
                  $(".field select").css({ "borderColor": "rgb(27, 168, 237)" });
                  return
                }
                $(".field select").css({ "borderColor": "rgb(169, 169, 169)" })

                })
                $(".parent-select").change(function(){
                  parentId = $(this).val();
                  $(".field option").each(function(index, element){
                    if ($(this).val() == parentId) {
                      $(this).attr("selected","selected");
                    }
                  })
                  getCategory({parentId: parentId});
                  appListData({"categoryId": parentId});
                })
                appListData({"categoryId": parentId});
            }else{
              $(".children-select").html(html);
              $(".children-select option:eq(0)").remove();
            }
          }
        }, paramsId)
      }

    
      /*------- loading category end ------- */
    }
    /* -------------------- DOM Operate begin ------------------------ */
    /* ==============  drawing appList begin =============== */
    function appListData(categoryParams) {
      ajax({
        url: appList,
        callback: function (data) {
          var arr = data[0].data;
          var html = '';
          var tmp = [];
          if (!arr.length) {
            $(".app-list ul").html("<p>暂时没有应用 ....</p>");
            animated($('.exist-app button'), "bounceIn")
              // $(".exist-app button").addClass("shake");
            return
          }
          for (var i = 0; i < arr.length; i++) {
            var appMers = result.appMers || result.apps
            if (appMers) {
              for (var j = 0; j < appMers.length; j++) {
                if (arr[i].id == appMers[j].fk_app_id) {
                  tmp.push(i)
                }
              }
            }

            html += ' <li data-id ='+arr[i].id + '>'+
                    '<i></i>'+
                    '<span for="" title='+arr[i].appName+'>' + arr[i].appName + '</span>'+
                  '</li>';
          }
          $(".app-list ul").html(html);
          for (var k = 0; k < tmp.length; k++) {
            $(".toggle-disable button").eq(1).removeClass("disable-btn");
            $(".app-list li").eq(tmp[k]).addClass("checkbox-alive")
          }
          $(".app-list ul").off("click").on("click", "li", function () {
            $(this).toggleClass("checkbox-alive")
            if ($(".show-app").index() == 1) {
              if (!$(".app-list .checkbox-alive").length) {
                $(".toggle-disable button").eq(1).addClass("disable-btn");
                return false
              }
              $(".toggle-disable button").eq(1).removeClass("disable-btn");
            }
          })

        }
      }, categoryParams)

    }


    /* --------------  drawing appList end   ---------------*/

  }

})($, window)
