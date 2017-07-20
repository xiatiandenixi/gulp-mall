;
(function($,window){
    /*  订单模块 */
/* === 详情页跳转下订单页 === */


// var orderUrl = "http://10.4.102.35:8331/"
var id = window.location.search.split("=")[1] || 1;
var geturl =  "/merchandise/getMerSpt/"+ id;
var posturl =  "/trade/postOrderInfo";

/* === 渲染页面 === */
  ajax({
    url: geturl,
    callback: function(data){        
    var tem = $("#tem").html();
    var html = ejs.render(tem,data[0]);
    $("#order").html(html);
    var fkDevId = parseInt(data[0].data.fkDevId);
    var price = parseInt($(".confirm strong").html())
    var str = '';
    var result = data[0].data

    /* ===确定 或 取消 下订单 === */

    $(".confirm").on("click","button",function(){

     if($(this).hasClass("sure")){

     var datas = []
     $(".order tbody tr").each(function(index,element){    
      var trlen = $(this).children();
      var obj = {}
      obj.fkMerchandiseSptId = parseInt($(this).attr("data-id"));
      obj.price = parseInt(trlen.eq(3).html().split("元")[0])
      datas[index] = obj
    })
     if ($(".order textarea").val().length > 200) {
      toastr.info('备注信息太长,最多输入200字');
      return;
     }   
     // setTimeout(function(){
     //   $("#waiting").hide();
     //   $(".put").show();
     // },500) 
    /* === 确定下单 参数的发送 ===*/
    ajax({
      url: posturl,
      type: "post",
      contentType: "application/json",
      callback: function(data){
          if (data[0].success==true) {
            $("#waiting").show();
            $(".set-opacity").show()
            setTimeout(function () {
              $("#waiting").hide();
              $(".put").show();
            }, 300);
          }else{
            toastr.warning(data[0].error.errorMessage);
          }          
      }
    },{
        "fkDevId": fkDevId, 
        "remark": $(".order textarea").val(),
         "price": price,
        "details": datas
      })  
    

    /* === 购买成功之后弹出的对话框 === */
    $(".put").on("click","button",function(){
      /* === 继续购买 === */
      if ($(this).hasClass("sure")) {
        window.location.href = "cloud.html#all"
        return
      }
      window.location.href = "cloud.html#all"
    })
  /* === 确定购买 === */   
    return
  }
   App.comform(function(){
    setTimeout(function(){
      window.location.href = "cloud.html#all";
    },300) 
  },"取消订单")

  // var key = comfirm("您确定要取消订单吗？")
  // if (key) {
  //   setTimeout(function(){
  //     window.location.href = "cloud.html#all";
  //   },1000)    
  // }
})
    }
  })
















// getAjax({
//     url: geturl,
//     type: "get"
//     },function(data){
     
//    ////////
//   },function(){
//     console.log("error")    
//   })


})($,window)
