;(function($,window){
   /* 获取提供商信息审核状态,根据状态显示不同页面 */
  var getAutoPreUrl="/user/getProviderAutoPre";
  /* 上传图片接口 */
  var imgUrl = "/ifbp-bop-web/file";
  /* 上传图片返回的图片ID */
  var currentImgId=" ";
  /* 获取省市区数据接口 */
  var AreasUrl = "/area/getAreas";
  /* 删除图片接口 */
  var defileUrl="/file/delFile";

  /* 获取提供商信息模板 */
  var providersAuditTpl = App.loadTemplate("providersAuditTpl","../providersAudit.ejs");

  /* 提供商审核按钮,向后台发送数据 */
  var postProviderAutoUrl="/user/postProviderAuto";
  /* ====================== hash route =========================== */
  App.routeMap["#providersAudit"] = function () {
     $("aside dl").eq(2).addClass("l-aside").siblings().removeClass("l-aside");
     $("#page").hide();
      /*  请求基本信息数据 */
      ajax({
          url: getAutoPreUrl,
          type: "get",
          tpl: providersAuditTpl,
          callback: function(data, tpl) {
            var totalData=data[0].data;
            var imgId=totalData.businessLicenseImg;
            var status=+(totalData.listDevStatus);
            var html = ejs.render(tpl,{"data": totalData});
            $(".product").html(html); 
             if(totalData.businessLicenseImg){
                $(".imgFile img").attr('src', imgUrl + "/download?attachId="+totalData.businessLicenseImg);
             }else{
                $(".imgFile img").attr('src', "../../static/images/error/basicImg.png");
             } 

             currentImgId=totalData.businessLicenseImg;
             var currentProvince=totalData.userAreaProvince;

             /* 取出省份数据 */
             ajax({
               url: AreasUrl,
               type: "get",
               callback: function(data) {
                  var str = '<option value="">请选择</option>';
                    data[0].data.forEach(function(item){
                      str += '<option value="'+item.id+'" id='+item.id+'>'+item.name+'</option>';
                    });
                  $("#province").html( str);
                  /* 取出市区数据 */
                  ajax({
                   url: AreasUrl,
                   type: "get",
                   callback: function(data) {                    
                      if(data[0].data){
                         var str = '<option value="">请选择</option>';
                         data[0].data.forEach(function(item){
                          str += '<option value="'+item.id+'">'+item.name+'</option>';
                         });
                      }
                     $("#city").html(str);
                      var inputValue={};
                      for(var item in totalData){
                        if(item=="businessLicenseImg"){
                          continue;
                        }
                        inputValue[item]=totalData[item]
                      }
                     $("#commentForm").setForm(inputValue);
                  }},{"parentId":currentProvince});
             }},{"parentId":"-1"});


            var status=1;
            switch(status)
              {
              case 0:
                  $("#authentication img").css("display","none");
                  /* $("#authentication img").attr("src","../../static/images/audit/audit.png"); */
                  $(".content p input").attr("disabled",true).css({"background":"#fff","border-color":"#f6f6f6","box-shadow":"none"});
                  $(".content select").attr("disabled",true).css({"background":"#fff","border-color":"#f6f6f6","appearance":"none","width":"80px"});
                  $("#industry").css("width","120px");
                  $(".content p i").css("display","none");
                  $(".contentBgc .Request").css("display","none");
                  $("#videoFile span").css("display","none");     
                break;
              case 1:  
                  $("#authentication img").attr("src","../../static/images/audit/authenticated.png"); 
                  $(".content p input").attr("disabled",true).css({"background":"#fff","border-color":"#f6f6f6","box-shadow":"none"});
                  $(".content select").attr("disabled",true).css({"background":"#fff","border-color":"#f6f6f6","appearance":"none","width":"80px"});
                  $("#industry").css("width","120px");
                  $(".content p i").css("display","none");
                  $(".contentBgc .Request").css("display","none");
                  $("#videoFile span").css("display","none");  
                break;
              case 2:
                  $("#authentication img").attr("src","../../static/images/audit/authfaild.png");
                break;
              case 3:
                  $("#authentication img").css("display","none");
                break;
            }



           /*  省市区选择 */
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

          
            $("#registrationDate").jeDate({
                isinitVal: false,
                ishmsVal: false,
                isTime: false,
                minDate: '2016-06-16',
                maxDate: $.nowDate(0),
                format:"YYYY-MM-DD",
                zIndex:3000
            })

 
         
          $('body').delegate('.videoFile span', 'click', function(e){
             $("#upload").click(); 
          });

         
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

            /*  封装更改留用
               ajax({
                url: Url,
                type: "post",
                contentType: "application/json",
                tpl: gettingTpl,
                callback(data, tpl) {
                  var html = ejs.render(tpl,{"items": data[0].data.items,"appStatus": appStatus});
                  $(".product").html(html)
              }},params); */
          });
           
          /* 取消图片上传 */
         $('body').delegate('.uploadImg i', 'click', function(e){          
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

          /* 错误信息处理 */
          $('body').delegate(".basicContent p em", 'click', function(e){
             $(this).hide(); 
             $(this).prev().focus();
          });


           /* 输入验证 */
          $().ready(function() {
              $("#commentForm").validate();
          });

          $("#saveBtn").click(function(){
            if($("#commentForm").valid()){

                /* console.log($("#commentForm").serializeJson("id:"+userId+";businessLicenseImg:"+currentImgId)); */
                ajax({
                  url:postProviderAutoUrl,
                  type:'post',
                  contentType: "application/json",
                  callback:function(datas){                  
                    if(datas[0].success){
                       location.reload()

                    }
                }},$("#commentForm").serializeJson("businessLicenseImg:"+currentImgId));
            }
          });



      }});


 
}
  App.adjustCurrentHash()
  /* ~~~~~~~~~~~~~~~~~~~~~~ hash end ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
})($,window)
