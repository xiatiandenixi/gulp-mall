;(function(){
   
    var UserPhoneUrl = "/user/getUserPhone";
    var AreasUrl = "/area/getAreas";
    var postUserUrl = "/user/postUser";
    var codeUrl="/user/getCheckCode";

    var uuidUrl=domain+"/captcha/captcha.jpg?imageCodeKey=";

    var isPhone;

    var isFail=false;

    var uuid;

    var isSure=false;

    var isUse=true;
   //用于存注册提交的数据
    var submitObject={
        "userPhone":"",
        "checkCode":"",
        "userPassword":"",
        "userCompany":"",
        "userAreaProvince":"",
        "userAreaCity":"",
        "userDetailAddress":"",
        "userRealName":""
    };


    // 点击头部按钮进入登录页面
    $(".logHead h1").click(function(){
      window.location.href="../../index.html";
    })

    // 点击头部登录按钮进入登录页面
    $(".loginIn").click(function(){
      window.location.href="login.html";
    })
    // 输入框获取焦点改变下划线样式
    $(".textBox p input").focus(function(){
      $(this).css("border","1px solid #1BA8ED");
    })
     //输入框失去焦点改变下划线样式
    $(".textBox p input").blur(function(){
      $(this).css("border","1px solid #ddd");
    })

    // 点击错误提示信息时隐藏错误信息,并输入框获取焦点
    $(".textBox p span").click(function(){
       $(this).hide();
       $(this).prev().focus();
    })

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
        var regStr = /^[0-9a-zA-Z_\u4e00-\u9fa5]{2,16}$/;
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






  // 手机号校验
  $("#phone").focus(function(){
    $(".showPhone").hide();
  })
  $("#phone").blur(function(){
    var that=this;
    var inputValue=$(this).val().trim();
    if(inputValue==''){
       $(".showPhone").html('手机号不能为空！').show();
       $(this).css("border","1px solid #D50000");
       $(this).attr("placeholder","");
       isFail=true;
    }else{
        var regStr = /^1[34578]\d{9}$/;
        if(!regStr.test(inputValue)){
           $(".showPhone").html('请正确输入11位手机号！').show(); 
           $(this).css("border","1px solid #D50000");
           $(this).attr("placeholder","");
           isPhone=false;
           isFail=true;
        }else{
          // 发送请求确认手机号是否存在
               ajax({
                   url: UserPhoneUrl,
                   type: "get",
                   callback: function(datas) {
                    if(!datas[0].data.isExist){
                     submitObject.userPhone=inputValue;
                     isFail=false;
                     $(".getCode").removeClass("on").attr("disabled",false);
                          // 发送验证码
                     $(".getCode").click(function(){
                    var that=this;
                    if($("#imageCode").val()){
                        ajax({
                           url: codeUrl,
                           type: "get",
                           callback: function(datas) {
                            // console.log(datas);
                             if(datas[0].success){
                                if(datas[0].data.checkCode){
                                  $("#code").val(datas[0].data.checkCode);
                                  submitObject.checkCode=datas[0].data.checkCode;
                                  $(".showcode").hide();
                                  isFail=false;

                                    $(that).prop("disabled",true).css("background-color","#999");
                                    var second=60;
                                    var str="重新发送";
                                    var timer=setInterval(function(){
                                      second--;
                                      $(".getCode").html(str+"("+second+"s)");
                                      if(second<=0){
                                        clearInterval(timer); 
                                        $(".getCode").prop("disabled",false).css("background-color","#1BA8ED").html(str);
                                      }
                                    },1000);

                                }
                              }else{
                                $(".showImageCode").show().html('图片验证码错误！');
                                $("#imageCode").css("border","1px solid #D50000").attr("placeholder","");
                                uuid=getUuid();
                                $("#verifyImg").attr("src",uuidUrl+uuid);
                              }

                        }},{
                             "userPhone":inputValue,
                             "picCaptcha":$("#imageCode").val(),
                             "imageCodeKey": uuid
                        });
                   }else{
                        $("#imageCode").blur();
                   }
                 
                 })
                    }else{
                       $(".showPhone").show().html('手机号已存在！'); 
                       $(that).css("border","1px solid #D50000");
                       $(that).attr("placeholder","");
                       isFail=true;
                    }
                }},{"userPhone":inputValue});
     
       }
    }
  });



           

  
  // 点击图片验证码切换图片
  $("#verifyImg").click(function(){
    uuid=getUuid();   
    $("#verifyImg").attr("src",uuidUrl+uuid);
  })


    //验证码校验
      $("#code").focus(function(){
        $(".showCode").hide();
      })
      $("#code").blur(function(){
        var inputValue=$(this).val().trim();
        if(inputValue==''){
          $(".showCode").show().html('验证码不能为空！');
          $(this).css("border","1px solid #D50000");
          $(this).attr("placeholder","");
          isFail=true;
        }
        // else if(args == "false"){
        //     $(".showCode").show().html('验证码错误！');
        //     $(this).css("border","1px solid #D50000");
        //     $(this).attr("placeholder","");
        //     isFail=true;
        // }
        else{
            submitObject.checkCode=inputValue;
            isFail=false;
        }
      });



      //图形验证码校验
    $("#imageCode").focus(function(){
      $(".showImageCode").hide();
    })

     $("#imageCode").blur(function(){
        var inputValue=$(this).val().trim();
        if(inputValue==''){
          $(".showImageCode").show().html('图片验证码不能为空！');
          $(this).css("border","1px solid #D50000");
          $(this).attr("placeholder","");
          isFail=true;
          }
     });

  


 

   // 设置密码校验
  $("#setPassword").focus(function(){
    $(".showPassOne").hide();
  })

  $("#setPassword").blur(function(){
    var inputValue=$(this).val().trim();
    if(inputValue==''){
      $(".showPassOne").show().html('密码不能为空！');
      $(this).css("border","1px solid #D50000");
      $(this).attr("placeholder","");
      isFail=true;
    }else{
        var regStr = /^[0-9a-zA-Z_]{6,16}$/;
        if(!regStr.test(inputValue)){
          $(".showPassOne").css("display","inline-block").html("密码由6-16位字母、数字、汉字组成,区分大小写");
          $(this).css("border","1px solid #D50000");
          $(this).attr("placeholder","");
          isFail=true;
        }else{
           // submitObject.userPassword=inputValue;
           isSure=true;
           isFail=false;
        }
    }
  });


  //确认密码校验
  $("#surePassword").focus(function(){
    $(".showPassTwo").hide();
  })
  $("#surePassword").blur(function(){
    var inputValue=$(this).val().trim();
    if(inputValue=='' || $("#setPassword").val() != $(this).val()){
      $(".showPassTwo").css("display","inline-block");
      $(this).css("border","1px solid #D50000");
      $(this).attr("placeholder","");
      isFail=true;
    }else{
        if(isSure){
          // console.log(CryptoJS.SHA256(inputValue).toString());
          submitObject.userPassword=CryptoJS.SHA256(inputValue).toString();
          isFail=false;
        }
    }
  });


  //企业名称校验
  $("#company").focus(function(){
    $(".showCompany").hide();
  })
  $("#company").blur(function(){
    var inputValue=$(this).val().trim();
    if(inputValue==''){
       $(".showCompany").show().html('企业名称不能为空！');
       $(this).css("border","1px solid #D50000");
       $(this).attr("placeholder","");
       isFail=true;
    }else{
        var regStr =/^[0-9a-zA-Z_\u4e00-\u9fa5]{2,40}$/;
        if(!regStr.test(inputValue)){
          $(".showCompany").show().html('企业名称由2-40位字母、数字、汉字组成');
          $(this).css("border","1px solid #D50000");
          $(this).attr("placeholder","");
          isFail=true;
        }else{
          submitObject.userCompany=inputValue;
          isFail=false;
        }
    }
  });

  //办公地址校验
  $("#address").focus(function(){
    $(".showAdress").hide();
  })
  $("#address").blur(function(){
    var inputValue=$(this).val().trim();
    if(inputValue==''){
       $(".showAdress").show().html('街道名称不能为空！');
       $(this).css("border","1px solid #D50000");
       $(this).attr("placeholder","");
       isFail=true;
    }else{
        var regStr = /^.{3,40}$/;
        if(!regStr.test(inputValue)){
          $(".showAdress").show().html('街道名称由2-40位字符组成！');
          $(this).css("border","1px solid #D50000");
          $(this).attr("placeholder","");
          isFail=true;
        }else{
           submitObject.userDetailAddress=inputValue;
           isFail=false;
        }
    }
  });


 //提交按钮 所有输入不为空校验 成功后数据发给后台
  $(".signUp").click(function(e){
    var isEmpty=false;
    var inputs=$("input");
    inputs.each(function(index,item){
      if(!item.value){
        isEmpty=true;
        $(item).next().show();
        $(this).attr("placeholder","");
        $(this).css("border","1px solid #D50000");
      }
    })
    if($("#province").val()==''){
       $(".showProvice").show();
    }
    if($("#city").val()==''){
       $(".showCity").show();
    }
    
    //判断输入有没有空，没空就发起请求，向后台发数据
    if(isEmpty==false&&isFail==false&&isUse==true){
      // console.log(submitObject.userAreaCity);
      isUse=false;
      console.log(submitObject);
        ajax({
              url:postUserUrl,
              type:'post',
              contentType: "application/json",
              callback: function(datas){  
                  if(datas[0].success==true){
                    window.location.href="registerSuccess.html";
                  }else{
                    console.log(datas[0]);
                    toastr.error(datas[0].error.errorMessage);
                    isUse=true;
                  }
           }},{
              "userPhone":submitObject.userPhone,
              "checkCode":submitObject.checkCode,
              "userPassword":submitObject.userPassword,
              "userCompany":submitObject.userCompany,
              "userAreaProvince":submitObject.userAreaProvince,
              "userAreaCity":submitObject.userAreaCity,
              "userDetailAddress":submitObject.userDetailAddress,
              "userRealName":submitObject.userRealName
           });



    }
  })


   // 同意协议,注册按钮可用
  var isAgree=false;
  $(".textBox .agree i").click(function(){
    $(this).toggleClass("on");
    isAgree=!isAgree;
    if(isAgree){
      $(".textBox .signUp").prop("disabled",false).css("background","#D50000");
    }else{
      $(".textBox .signUp").prop("disabled",true).css("background","#999");
    }
  });           

 //市区数据获取数据获取
 $("#province").change(function(){
    $(".showProvice").hide();
    var province=$(this).val();
    submitObject.userAreaProvince=province;
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

 $("#city").change(function(){
    $(".showCity").hide();
    submitObject.userAreaCity=$(this).val();
 })

 $(".agreeSign em").click(function(){
   $(".agreement").show();
   $(".agreementContent").show();
 })

 $(".agreement").click(function(){
   $(this).hide();
   $(".agreementContent").hide();
 })

$(".agreementClose i").click(function(){
   $(".agreement").hide();
   $(".agreementContent").hide();
 })
 
 $(".agreementContent").click(function(){
   return false;
 })


//当点开注册页面首先将省份数据请求回来
$(document).ready(function(){
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
       }},{"parentId":"-1"});


      // 页面刷新获取uuid
     window.getUuid=function getUuid() {       
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the     clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
     
        var uuid = s.join("");
        return uuid;
    }; 
    uuid=getUuid();
    $("#verifyImg").attr("src",uuidUrl+uuid);


});




})();

   
