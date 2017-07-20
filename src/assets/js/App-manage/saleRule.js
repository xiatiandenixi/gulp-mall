;
(function ($, window) {

  var Table;
  var rateObj = {};
  var isFree = "1";
  var freeDay;
  var rateArr = [];


  fnObj["saleRule"] = function (isFlags, result) {


    if (isFlags == 1) {
          
      return {       
        "merId": result.mer.id
      }
    }
    if (isFlags == 2) {
      if (result.mer.market == 4) {
        return {
          "isFree": "0",
          "sellingMode": "2",
          "merId": result.mer.id.toString() || "",
          "spts": [],
          "freeTimeLimit": ""
        }
      }
      periodData()              
      /* ===  0 周期式  1 按次数 2 面议 === */
      var sellingMode = "0"
      var spts = Table;
      if ($(".sell").css("display") == "block") {        
        sellingMode = "1"
        spts = rateArr
        var temp;
        $(".sell input").each(function (index, element) {
          if (!$(this).val().trim()) {
            temp = index
          }
        })
        if (temp || temp == 0) {
          return
        }
      }else{
         $(".period input").each(function(index,element){
          if ($(this).val() <= 0 || !$(this).val() ) {
            return
          }
        }) 
      }
       if (typeof freeDay == "undefined") {
        return
      }
      return {
        "isFree": isFree,
        "spts": spts,
        "sellingMode": sellingMode,
        "freeTimeLimit": freeDay.toString(),
        "merId": result.mer.id.toString() || "",
      }
    }

    if (!isFlags) {
      /* ======================================销售规格 周期与次数的切换 ================================*/
      console.log($(".grounding .sale-size").height());
      if (result.mer.market == 4) {
        $(".grounding .sale-size").css({paddingBottom: "200px"})
        return
      }
      $(".grounding .sale-size").css({paddingBottom: "30px"})
      $(".sell").css({ display: "none" })
      $(".free-day").css({ marginTop: "20px" })
      $(".sale-select select").on("change", function () {
          if ($(this).val() == "1") {
             $(".grounding .sale-size").css({paddingBottom: "30px"})           
            // $(".grounding .sale-size").css({height: "632px"})
            $(".free-day i").addClass("active");
            $(".free-day input").removeAttr("disabled");
            $(".free-day").css({display: "inline-block"});
            $(".period").css({ display: "block" });
            $(".sell").css({ display: "none" });
            $(".interview").css({display: "none"});
            // $(".free-day").css({ marginTop: "20px" })
          } 
           if ($(this).val() == "2") {
             $(".free-day i").addClass("active")
            $(".free-day input").removeAttr("disabled");           
              $(".period").css({ display: "none" })
             $(".sell").css({ display: "block" }) 
             $(".interview").css({display: "none"})            
          }
          if ($(this).val() == "0") {
            $(".grounding .sale-size").css({paddingBottom: "200px"})            
             // $(".grounding .sale-size").css({height: "300px"})
             $(".period").css({ display: "none" })
             $(".sell").css({ display: "none" })
             $(".interview").css({display: "block"})            
            /* $(".free-day").css({ marginTop: "0px" })
             $(".free-day i").removeClass("active")
             $(".free-day input").attr("disabled","disabled"); */
            $(".free-day").css({display: "none"})           

            
          }
        })
        /*=== 点击预览关闭 ===*/
      $(".preview button").on("click", function () {
          $(".preview").css({ display: "none" })
          $(".box").css({ display: "none" })
        })
        /* ===销售价格次数增加与删除部分===*/
      $(".sell").on("click", "i", function () {
          if ($(this).index() == 1) {
            var str =   ' <li>' +
                             '<input type="number"> 元 ' +
                            ' <input type="number">次' +
                             '<i></i>' +
                           '</li> ';
            $(".sell ul").append(str)
            return
          }
          if ($(".sell li").length > 1) {
            $(".sell li").eq($(this).parent().index()).remove()
          }
        })
        /*  ==== end ====  */
        /*  ==== 按周期部分 点击不同规格 === */
      $(".period li").on("click", "i", function () {
          $(this).toggleClass("active")
            // var liIndex = $(this).parent().index();
            // var isRemove = $(this)
          createTable($(this))

        })
        /*  ===end=== */
      if (!result.spts.length) {
        createTable();
      }
      $(".period table").delegate("input","blur",function(){       
        if (!$(this).val().trim()) {
           $(this).css({"borderColor": "rgb(213, 0, 0)"})
           return;
        }
        $(this).css({"borderColor": " rgb(27, 168, 237)"})
      })
      /*   ==== 按次数中 input的change事件  === */
      $(".sell").on("change", "input", function () {
        var ipt = $(this).val().trim();
        if (!ipt || parseInt($(this).val().trim()) < 0) {
          $(this).val('')
          return
        }
        rateObj[$(this).index()] = ipt;
        var tmp = {};
        for (var k in rateObj) {
          if (k == "1") {
            tmp["time"] = rateObj[k]
          } else {
            tmp["price"] = rateObj[k]
          }
        }
        rateArr[$(this).parent().index()] = tmp;
      })

      $(".free-day").delegate("input","blur", function () {
        if (!$(this).val().trim() || parseInt($(this).val().trim()) <= 0) {
          $(this).val('')
          $(".free-day p.info-null").remove();
          $(this).css({"borderColor": "rgb(213, 0, 0)"})
          $(this).after("<p class='info-null'>请输入数值</p>");         
          return
        }
         $(this).css({"borderColor": " rgb(27, 168, 237)"})
        $(".free-day p.info-null").remove();        
        freeDay = $(this).val().trim();
      })

      $(".free-day i").on("click", function () {
        $(this).toggleClass("active")
        if ($(this).hasClass("active")) {
          isFree = "1"
          $(".free-day input").removeAttr("disabled").css({"borderColor": "#ccc"})
        } else {
          isFree = "0"
          freeDay = '';
          $(".free-day input").val('')
          $(".free-day input").attr("disabled", true)
        }
      })
      
      /* ======================================销售规格 周期与次数的切换 end================================*/

    }



    /* 获取周期表格的数据 并进行处理 */
    function periodData() {
      var arrTr = []
      $(".period tr").each(function (element, index) {
        var objTr = {};
        var time;
        switch ($(this).children().eq(1).html()) {
          case "一个月":
            time = "0-1-0";
            break;
          case "三个月":
            time = "0-3-0";
            break;
          case "一年":
            time = "1-0-0";
            break;
        }
        var len = $(this).children().eq(0).html()
        var iptVal = $(this).children().eq(2).children("input").val().trim();
        objTr.sptBilling = $(this).children().eq(0).html().split("人")[0];
        objTr.timeLimit = time;
        if (!iptVal) {

          $(this).children().eq(2).children("input").css({"borderColor": "rgb(213, 0, 0)"});
          // $(this).children().eq(2).children("input").val(300)
        }
        objTr.price = $(this).children().eq(2).children("input").val();
        arrTr.push(objTr);
      })
      Table = arrTr;
    }
    /* === end === */
    /*  ===根据选择不同规格 动态生成表格=== */
    function createTable(ele) {
      var size = [];
      var time = [];
      $(".period li i").each(function (element, index) {
          if ($(this).hasClass("active")) {
            if ($(this).parent().index() == 0) {
              size.push($(this).next().html())
            } else {
              time.push($(this).next().html())
            }
          }
        })
        /*=== 根据数据生成表格=== */
      var html = '';
      if (!!size.length && !!time.length) {
        if (!ele) {
          $(".period table").html("")
          for (var i = 0; i < size.length; i++) {
            for (var j = 0; j < time.length; j++) {        
               html +=  '<tr>' +
                                   '  <td>' + size[i] + '</td>' +
                                     '<td>' + time[j] + '</td>' +
                                     '<td><input type="number" min= 1  placeholder="请输入价格"><span>元</span></td>' +
                                 '</tr>';
            }
          }
          $(".period table").html(html)
        } else {
          if (ele.hasClass("active")) {
            var dataObj = {};
          $(".period input").each(function(index,element){
            if ($(this).val() > 0) {
              var person =  $(this).parent().siblings("td:eq(0)").html();
              var iptVal = $(this).val();
              dataObj[person] = iptVal;
            }      
            
          })
          var resetIpt = 0; ;
             $(".period table").html("")
            for (var i = 0; i < size.length; i++) {
              for (var j = 0; j < time.length; j++) {
                for(var k in dataObj){
                  if (k == size[i]) {
                    resetIpt = k;
                  }
                }
                if (!resetIpt) {
                   html +=  '<tr>' +
                                   '  <td>' + size[i] + '</td>' +
                                     '<td>' + time[j] + '</td>' +
                                     '<td><input type="number" min= 1  placeholder="请输入价格"><span>元</span></td>' +
                                 '</tr>'
                }else{
                   html +=  '<tr>' +
                                   '  <td>' + size[i] + '</td>' +
                                     '<td>' + time[j] + '</td>' +
                 ' <td><input type="number" min= 1 value=' + dataObj[resetIpt] + ' placeholder="请输入价格"><span>元</span></td>' +
              '</tr>';
                  resetIpt = 0;
                }              
              }
            }
            $(".period table").html(html)
          } else {
            var sizeIndex, timeIndex;
            $(".period table td").each(function (index, element) {
              if (ele.next().html() == $(this).html()) {                
                for(var i = 0; i < size.length; i++){
                  if ($(this).html() == size[i]) {
                    sizeIndex = i;
                  }
                }
                for(var i = 0; i < time.length; i++){
                  if ($(this).html() == time[i]) {
                    timeIndex = i;
                  }
                }                              
                $(this).parent().remove()
              }
            })
             
             // size.splice(sizeIndex, 1)
             // time.splice(timeIndex, 1) 
             // console.log(size)
             //  console.log(time)
          }          
        }



      } else {
        $(".period table").html("<tr><td style='background: #fff; color: red;'>数据为空</td></tr>")

      }

    }
    /* ===end === */




  }
})($, window)
