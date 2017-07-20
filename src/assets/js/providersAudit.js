;(function(){
   //获取提供商信息审核状态,根据状态显示不同页面
  var getAutoPreUrl="/user/getProviderAutoPre";
  // 上传图片接口
  var imgUrl = "/ifbp-bop-web/file";
  // 上传图片返回的图片ID
  var currentImgId=" ";
  // 获取省市区数据接口
  var AreasUrl = "/area/getAreas";
  // 删除图片接口
  var defileUrl="/file/delFile";

  // 获取提供商信息模板
  var providersAuditTpl = App.loadTemplate("providersAuditTpl","providersAudit.ejs");

  // 提供商审核按钮,向后台发送数据
  var postProviderAutoUrl="/user/postProviderAuto";

  var isUse=true;
  // 匹配对应路由
 window.onload=function(){
      // 请求基本信息数据
      ajax({
          url: getAutoPreUrl,
          type: "get",
          tpl: providersAuditTpl,
          callback: function(data, tpl) {
            var totalData=data[0].data;
            // console.log(totalData.approveReason);
            var imgId=totalData.businessLicenseImg;
            var status=+(totalData.listDevStatus);
            var html = ejs.render(tpl,{"data": totalData});
            $("#providerMount").html(html); 


             if(totalData.businessLicenseImg){
                $(".imgFile img").attr('src', imgUrl + "/download?attachId="+totalData.businessLicenseImg);
             }else{
                $(".imgFile img").attr('src', "../static/images/error/basicImg.png");
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
                     // $("#companyWebsite").val("http://");
                     if($("#companyWebsite").val()==""){
                        $("#companyWebsite").val("http://");
                      }
                     // var userAreaCity={
                     //  "userAreaCity":totalData["userAreaCity"]
                     // };
                     // console.log(userAreaCity);
                     // $("#commentForm").setForm(userAreaCity);
                  }},{"parentId":currentProvince});
             }},{"parentId":"-1"});


            // var status=2;
            switch(status)
              {
              case 0:
                  $("#authentication img").attr("src","../static/images/audit/audit.png");
                  // $(".content p input").attr("disabled",true).css({"background":"#fff","border-color":"transparent","box-shadow":"none"});
                  // $(".content select").attr("disabled",true).css({"background":"#fff","border-color":"transparent","appearance":"none","width":"80px"});
                  $(".content p input").attr("disabled",true).css({"background":"#fff","border-color":"#f6f6f6","box-shadow":"none"});
                  $(".content select").attr("disabled",true).css({"background":"#fff","border-color":"#f6f6f6","appearance":"none","width":"80px"});
                  $("#industry").css("width","120px");
                  $(".content p i").css("display","none");
                  $(".contentBgc .Request").css("display","none");
                  $("#videoFile span").css("display","none");     
                break;
              case 1:  
                  $("#authentication img").attr("src","../static/images/audit/authenticated.png");
                  $(".content p input").attr("disabled",true).css({"background":"#fff","border-color":"#f6f6f6","box-shadow":"none"});
                  $(".content select").attr("disabled",true).css({"background":"#fff","border-color":"#f6f6f6","appearance":"none","width":"80px"});
                  $("#industry").css("width","120px");
                  $(".content p i").css("display","none");
                  $(".contentBgc .Request").css("display","none");
                  $("#videoFile span").css("display","none");  
                break;
              case 2:
                  $("#authentication img").attr("src","../static/images/audit/authfaild.png");
                  if(totalData.approveReason){
                    $("#failureCause").show().css("height","50px");
                  } 
                break;
              case 3:
                  $("#authentication img").css("display","none");
                  $("#auditPhone").attr("disabled", true).css({ "background": "#fff", "border-color": "#fff", "box-shadow": "none" });
                break;
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


           //姓名输入框校验
          $("#userName").focus(function(){
            $(".showName").hide();
          })
          $("#userName").blur(function(){
            var inputValue=$(this).val().trim();
            if(inputValue==''){
               $(".showName").show().html('姓名不能为空！');
               $(this).css("border","1px solid #D50000");
               $(this).attr("placeholder","");
               isFail=true;     
            }else{
                var regStr = /[0-9a-zA-Z_\u4e00-\u9fa5]{2,15}/;
                if(!regStr.test(inputValue)){
                  $(".showName").show().html('姓名由2-16位字母、数字、汉字组成!');
                  $(this).css("border","1px solid #D50000");
                  $(this).attr("placeholder","");
                  isFail=true;
                }else{
                  submitObject.userRealName=inputValue;
                  isFail=false;
                }
            }
          });



          $("#saveBtn").click(function () {
          if ($("#commentForm").valid()&&isUse==true) {
            isUse=false;
            // console.log($("#commentForm").serializeJson("id:"+userId+";businessLicenseImg:"+currentImgId));
            
            // alert($(".imgFile img").attr('src'));
            if($(".imgFile img").attr('src')=='../static/images/error/basicImg.png'){
              toastr.warning("请上传营业执照！");
              isUse=true;
            }else{
                ajax({
                  url: postProviderAutoUrl,
                  type: 'post',
                  contentType: "application/json",
                  callback: function callback(datas) {
                    // console.log(datas);
                    if (datas[0].success) {
                      location.reload();
                    }
                  } }, $("#commentForm").serializeJson("businessLicenseImg:" + currentImgId));
            }
          }
        });


                    
      }},{});
  }

})();
