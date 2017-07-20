  // 请求基本信息接口
  var autoPreUrl="/user/getProviderAutoPre";
  // 修改基本信息接口
  var postGotoAppListUrl="/user/postUserBaseInfo";
  // 上传图片接口
  var imgUrl = "/ifbp-bop-web/file";
  // 上传图片返回的图片ID
  var currentImgId=" ";
  // 获取省市区数据接口
  var AreasUrl = "/area/getAreas";
  // 删除图片接口
  var defileUrl="/file/delFile";

  var isUse=true;
  /* ==== aside  click or css toggle start ==== */
  $(".layout aside dl").each(function(index, element){
    if (!$(this).children("dd").length) {
      $(this).children("dt").children("i.fa").remove()
    }
  })

  $(".layout aside dl").on("click","dt",function(){   
    $(this).siblings("dd").toggle();

    /*  ==== dl add css l-aside start ==== */

    $(this).parent().toggleClass("l-aside")
    .siblings().removeClass("l-aside")
    .children("dd").removeClass("active");

    /* ~~~~ dl add css l-aside end ~~~~ */

    /* dt i:last-child change to right or down start */

    $(this).children("i.fa")
      .toggleClass("fa-caret-right")
      .toggleClass("fa-caret-down");
       $(this).parent().siblings().children("dd").hide();
       $(this).parent().siblings().children("dt")
       .children("i.fa").removeClass("fa-caret-down").addClass("fa-caret-right"); 
   /* dt i:last-child change to right or down end */
  })

  $(".layout aside dd").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    $(this).parent().addClass("l-aside").siblings()
      .removeClass("l-aside").children().removeClass("active")
  })
/* ~~~~~~~~~ aside  click or css toggle end ~~~~~~~~~~*/



  /* ====================== hash route ======================== */
  // 获取基本信息模板
  var setInformationTpl = App.loadTemplate("setInformationTpl","setInformation.ejs");
  // 匹配对应路由
  App.routeMap["#basics"] = function () {    
      $("aside dl").eq(0).addClass("l-aside").siblings().removeClass("l-aside");
      $("aside dl").eq(0).children("dt").children("i.fa")
      .removeClass("fa-caret-right").addClass("fa-caret-down");
      $("aside dl").eq(0).children("dd").show().eq(0).addClass("active").siblings().removeClass("active"); 
      // 请求基本信息数据
      ajax({
          url: autoPreUrl,
          type: "get",
          tpl: setInformationTpl,
          callback: function(data, tpl) {
             var totalData=data[0].data;
             var html = ejs.render(tpl,{"data": totalData});
             $(".mountItem").html(html);
             // alert(totalData.businessLicenseImg);
             if(totalData.businessLicenseImg){
                $(".imgFile img").attr('src', imgUrl + "/download?attachId="+totalData.businessLicenseImg);
             }else{
                $(".imgFile img").attr('src', "../../static/images/error/basicImg.png");
             } 

             currentImgId=totalData.businessLicenseImg;
             var currentProvince=totalData.userAreaProvince;

             // 取出省份数据
             ajax({
               url: AreasUrl,
               type: "get",
               callback: function(data) {
                  var str = '<option value="">请选择</option>';
                    data[0].data.forEach(function(item){
                      str += '<option value="'+item.id+'" id='+item.id+'>'+item.name+'</option>';
                    });
                  $("#province").html( str);
                  // 取出市区数据
                  ajax({
                   url: AreasUrl,
                   type: "get",
                   callback: function(data) {
                      // console.log(data[0].data);
                      if(data[0].data){
                         var str = '<option value="">请选择</option>';
                         data[0].data.forEach(function(item){
                          str += '<option value="'+item.id+'">'+item.name+'</option>';
                         });
                      }
                     $("#city").html(str);
                      var inputValue={};
                      console.log(totalData);
                      for(var item in totalData){
                        if(item=="businessLicenseImg"){
                          continue;
                        }
                        inputValue[item]=totalData[item]
                      }
                     $("#commentForm").setForm(inputValue);
                      if($("#companyWebsite").val()==""){
                        $("#companyWebsite").val("http://");
                      }
                  }},{"parentId":currentProvince});
             }},{"parentId":"-1"});

          
          // 根据审核状态决定页面是否可编辑
          if(totalData.listDevStatus=="0"){
            $("#commentForm p input").attr("disabled",true).css({"background":"#fff","border-color":"#f6f6f6","box-shadow":"none"});
            $("#commentForm select").attr("disabled",true).css({"background":"#fff","border-color":"#f6f6f6","appearance":"none"});
            $("#saveBtn").css("display","none");
            $("#videoFile span").css("display","none");
            $("#disableInfo").css("display","block").html("信息认证审核中，不能修改");
          }else if(totalData.listDevStatus=="1"){
            $("#commentForm p input").attr("disabled",true).css({"background":"#fff","border-color":"#f6f6f6","box-shadow":"none"});
            $("#commentForm select").attr("disabled",true).css({"background":"#fff","border-color":"#f6f6f6","appearance":"none"});
            $("#saveBtn").css("display","none");
            $("#videoFile span").css("display","none");
            $("#disableInfo").css("display","block").html("信息已认证通过，不能修改");
          }



           // 省市区选择
           $("#province").change(function(){
                var province=$(this).val();
                ajax({
                   url: AreasUrl,
                   type: "get",
                   callback: function(data) {
                      console.log(data[0].data);
                      if(data[0].data){
                         var str = '<option value="">请选择</option>';
                         data[0].data.forEach(function(item){
                          str += '<option value="'+item.id+'">'+item.name+'</option>';
                         });
                      }
                     $("#city").html(str);
                }},{"parentId":province});

           })

           // 选择日期初始化
            $("#registrationDate").jeDate({
                isinitVal: false,
                ishmsVal: false,
                isTime: false,
                minDate: '2016-06-16',
                maxDate: $.nowDate(0),
                format:"YYYY-MM-DD",
                zIndex:3000
            })

 
          // 点击按钮上传图片
          $('body').delegate('.uploadImg span', 'click', function(e){
             $("#upload").click(); 
          });

          // 图片上传
          $('body').delegate('#upload', 'change', function(e){
              var Url=imgUrl + "/upload";
              var formData = new FormData();
              formData.append("file",$("#upload")[0].files[0]);
              
              $.ajax({ 
              url : Url, 
              type : 'POST', 
              dataType:"json",
              data : formData, 
              processData : false, 
              contentType : false,
              success : function(data) { 
                $(".uploadImg i").css("opacity",1);
                currentImgId=parseInt(data.data.attachId);
                FilePath=imgUrl + "/download?attachId="+currentImgId;
                $(".imgFile img").attr('src', imgUrl + "/download?attachId="+currentImgId);
              }, 
              error : function(responseStr) { 
                  console.log("error");
              } 
              });

              // 封装更改留用
              //  ajax({
              //   url: Url,
              //   type: "post",
              //   contentType: "application/json",
              //   tpl: gettingTpl,
              //   callback(data, tpl) {
              //     var html = ejs.render(tpl,{"items": data[0].data.items,"appStatus": appStatus});
              //     $(".product").html(html)
              // }},params);
          });
           
          // 取消图片上传
          $('body').delegate('.uploadImg i', 'click', function(e){ 
          // alert(currentImgId);  
             ajax({
             url: defileUrl,
             type: "get",
             callback: function(data) {
                if(data[0].success){
                   $(".uploadImg i").css("opacity",0);
                   $(".imgFile img").attr('src', "../../static/images/error/basicImg.png");
                   currentImgId="";
                }
             }},{"attachId":currentImgId});
          });

          // 错误信息处理
          $('body').delegate(".basicContent p em", 'click', function(e){
             $(this).hide(); 
             $(this).prev().focus();
          });


           //输入验证
          $().ready(function() {
              $("#commentForm").validate();
          });


          $("#saveBtn").click(function(){
            console.log( $("#commentForm").serializeJson("userPhone:"+$("#basicPhone").val()+";businessLicenseImg:"+currentImgId) );
            if($("#commentForm").valid()&&isUse==true){
              isUse=false;
              ajax({
                url: postGotoAppListUrl,
                type: "post",
                contentType: "application/json",
                callback: function(data) {
                   if(data[0].success==true){
                      location.reload();
                   }else{
                    isUse=true;
                    toastr.error(data[0].error);
                   }                  
              }},$("#commentForm").serializeJson("userPhone:"+$("#basicPhone").val()+";businessLicenseImg:"+currentImgId));
            }
          });
             
      }},{});
  }

  /* ~~~~~~~~~~~~~~~~~~~~ hash route end ~~~~~~~~~~~~~~~~~~~~~~*/
