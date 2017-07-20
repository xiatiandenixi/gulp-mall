;(function($, window){
  var UserPhoneUrl = "/user/getUserPhone";
  var postUserUrl = "/user/postUser";
  //用于存注册提交的数据
  var submitObject={
      "userPhone":"",
      "checkCode":"",
      "Password":""
  };

   // 点击头部注册有礼按钮进入注册页面
  $(".register").click(function(){
    window.location.href="register.html";
  })
 // 点击直接注册按钮跳转到注册界面
  $(".points span").click(function(){
    window.location.href="register.html";
  })

  // 发送验证码
  $(".getCode").click(function(){
    
  })
  
  // 输入框获取焦点改变下划线样式
  $(".textBox p input").focus(function(){
    $(this).css("border-bottom-color","transparent").parent().css("border-bottom","2px solid #1BA8ED");
  })
  //输入框失去焦点改变下划线样式
  $(".textBox p input").blur(function(){
    $(this).css("border-bottom-color","transparent").parent().css("border-bottom","1px solid #ddd"); 
  })
  
  // 手机号校验
  $("#phone").focus(function(){
    $(".showPhone").hide();
  })
  $("#phone").blur(function(){
    var that=this;
    var inputValue=$(this).val().trim();
    if(inputValue==''){
       $(".showPhone").show().html('手机号不能为空！');
       $(this).parent().css("border-bottom","2px solid #D50000");
    }else{
        var regStr = /^1[3|4|5|8][0-9]\d{4,8}$/;
        if(!regStr.test(inputValue)){
           $(".showPhone").show().html('请输入11位手机号！'); 
           $(this).parent().css("border-bottom","2px solid #D50000");
        }else{
          // var url="http://10.4.102.35:8331/user/getUserPhone";
          getAjax({url: UserPhoneUrl,type:'get',data:{
             "userPhone":inputValue
          }},function(datas){
            if(!datas.data.isExist){
              console.log("手机号");
              submitObject.userPhone=inputValue;
              // console.log(submitObject);
            }else{
               $(".showPhone").show().html('手机号已存在！'); 
               $(that).parent().css("border-bottom","2px solid #D50000");
            }
         },function(){
            console.log("失败");
         });     
       }
    }
  });

  //验证码校验
  $("#code").focus(function(){
    $(".showCode").hide();
  })
  $("#code").blur(function(){
    var inputValue=$(this).val().trim();
    if(inputValue==''){
      $(".showCode").show().html('验证码不能为空！');
      $(this).parent().css("border-bottom","2px solid #D50000");
    }else{
      submitObject.checkCode=inputValue;
    }
  });
  

  // 设置密码校验
  $("#Password").focus(function(){
    $(".showPassOne").hide();
  })

  $("#Password").blur(function(){
    var inputValue=$(this).val().trim();
    if(inputValue==''){
      $(".showPassOne").show().html('密码不能为空！');
      $(this).parent().css("border-bottom","2px solid #D50000");
    }else{
        var regStr = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        if(!regStr.test(inputValue)){
          $(".showPassOne").css("display","inline-block").html("密码6-21字母和数字组成！");
          $(this).parent().css("border-bottom","2px solid #D50000");
        }else{
          submitObject.Password=inputValue;
        }
    }
  });
  
// 点击错误提示信息时隐藏错误信息,并输入框获取焦点
$(".textBox p span").click(function(){
   $(this).hide();
   $(this).prev().focus();
})

  //提交按钮 所有输入不为空校验 成功后数据发给后台
  $(".signUp").click(function(e){
    var isEmpty=false;
    var inputs=$("input");
    inputs.each(function(index,item){
      if(!item.value){
        // console.log(item);
        isEmpty=true;
        $(item).next().show();
        $(this).parent().css("border-bottom","2px solid #D50000");
      }
    })
    
    //判断输入有没有空，没空就发起请求，向后台发数据
    if(isEmpty==false){
      // console.log(submitObject);
      // var url="http://10.4.102.35:8331/user/postUser";
      getAjax({url: postUserUrl,type:'post',data:{
          "userPhone":submitObject.userPhone,
          "checkCode":submitObject.checkCode,
          "userPassword":submitObject.Password,
      }},function(datas){
        // console.log(datas);
        if(datas.success==true){
          // alert("注册成功！");
          toastr.error("datas.error.errorMessage");
          // window.location.href="../../index.html";
        }else{
          alert("注册成功!");
          console.log(datas.error.errorMessage);
          toastr.error(datas.error.errorMessage);
        }
      },function(){
        console.log("失败");
      });  
    }
  })

})($, window)
