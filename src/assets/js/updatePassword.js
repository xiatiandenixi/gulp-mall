  
  var getUserUrl ="/user/getUser";
  // 获取验证码
  var getResetPwdCheckCodeUrl="/user/getResetPwdCheckCode";
  // 第一页下一步操作接口
  var postResetPwdCheckCodeUrl="/user/postResetPwdCheckCode";
  // 新旧密码对比接口
  var postResetPwdDo="/user/postResetPwdDo";

  var timer;

  /* ====================== hash route ======================== */
  // 获取基本信息模板
  var updatePasswordTpl = App.loadTemplate("updatePasswordTpl","updatePassword.ejs");
  $("#passwd").click(function(){
    clearInterval(timer);
  });
  // 匹配对应路由
  App.routeMap["#passwd"] = function () {  
      $("aside dl").eq(1).addClass("l-aside").siblings().removeClass("l-aside");
      $("aside dl").eq(1).children("dt").children("i.fa")
      .removeClass("fa-caret-right").addClass("fa-caret-down");
      $("aside dl").eq(1).children("dd").show().eq(1).addClass("active").siblings().removeClass("active"); 

      // 请求基本信息数据
      ajax({
          url: getUserUrl,
          type: "get",
          tpl: updatePasswordTpl,
          callback: function(data, tpl) {
            console.log(data);
            // 验证码
             var CheckCode;
             // 旧密码
             var oldPwd="";
             // 新密码
             var newPwd="";


             var html = ejs.render(tpl,{"data":data[0].data});
             $(".mountItem").html(html);

             // 输入框获取焦点改变下划线样式
              $(".updateMain p input").focus(function(){
                $(this).css("border","1px solid #1BA8ED");
              })
               //输入框失去焦点改变下划线样式
              $(".updateMain p input").blur(function(){
                $(this).css("border","1px solid #ddd");
              })
               // 点击错误提示信息时隐藏错误信息,并输入框获取焦点
              $(".updateMain p span").click(function(){
                 $(this).hide();
                 $(this).prev().focus();
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
                  CheckCode=inputValue;
                }else{
                  $(this).css("border","1px solid #1BA8ED");
                  CheckCode=inputValue;
                }
              });

          
              // 发送验证码
              $(".getCode").click(function(){
                var that=this;
                   ajax({
                     url: getResetPwdCheckCodeUrl,
                     type: "get",
                     callback: function(data) {
                        var currentData=data[0].data;
                        CheckCode=currentData.checkCode;
                        if(CheckCode){
                          $("#code").val(CheckCode).css("border","1px solid #1BA8ED").attr("placeholder","");
                          $(".showCode").hide();
                          $(that).prop("disabled",true).css("background-color","#999");
                          var second=60;
                          var str="重新发送";
                          timer=setInterval(function(){
                            second--;
                            $(".getCode").html(str+"("+second+"s)");
                            if(second<=0){
                              clearInterval(timer); 
                              $(".getCode").prop("disabled",false).css("background-color","#1BA8ED").html(str);
                            }
                          },1000);

                      } 

                   }},{});

              })


                 // 第一页下一步按钮操作
               $(".updateContentFirst .signUp").click(function(){
                  ajax({
                        url: postResetPwdCheckCodeUrl,
                        type: "post",
                        contentType: "application/json",
                        callback: function (data) {
                          console.log(data);
                          if(data[0].success==true){
                              $(".updatePasswordFirst .firstItem").removeClass("edit").addClass("finish");
                              $(".updatePasswordFirst .secondItem").addClass("edit");
                              $(".updateContentFirst").hide();
                              $(".updateContentSecond").show();
                          }else{
                              toastr.error(data[0].error.errorMessage);        
                          }
                          
                        }
                      }, {"checkCode":CheckCode});  
             });



            // 第二页 输入框处理 旧密码
            $(".updateContentSecond p input").focus(function(){
               $(this).next().hide();
             })
             $("#oldPassword").blur(function(){
                var inputValue=$(this).val().trim();
                if(inputValue==''){
                  $(this).next().show().html('输入不能为空！');
                  $(this).css("border","1px solid #D50000").attr("placeholder","").attr("ispass","false");
                }else{
                  oldPwd=inputValue;
                  $(this).css("border","1px solid #1BA8ED").attr("ispass","true");
                }
            });

             // 新密码校验
              $("#newPassword").blur(function(){
                var inputValue=$(this).val().trim();
                if(inputValue==''){
                  $(this).next().show().html('密码不能为空！');
                  $(this).css("border","1px solid #D50000").attr("placeholder","").attr("ispass","false");
                }else{
                    var regStr = /[0-9a-zA-Z_]{6,16}/;
                    if(!regStr.test(inputValue)){
                      $(this).next().css("display","inline-block").html("字母、数字或者英文符号，最短8位，区分大小写");
                      $(this).css("border","1px solid #D50000").attr("placeholder","").attr("ispass","false");
                    }else{
                       $(this).css("border","1px solid #1BA8ED").attr("ispass","true");
                    }
                }
            });

            //确认新密码校验
            $("#surePassword").blur(function(){
              var inputValue=$(this).val().trim();
              if(inputValue=='' || $("#newPassword").val() != $(this).val()){
                $(this).next().show().html('两次密码输入不一致！');
                $(this).css("border","1px solid #D50000").attr("placeholder","").attr("ispass","false");
              }else{
                  $(this).css("border","1px solid #1BA8ED").attr("ispass","true");
                  newPwd=inputValue;
              }
            });


            

             $(".updateContentSecond .signUpSecond").click(function(){
                var ispass=true;
                var currentInput=$(".updateContentSecond p input")
                currentInput.blur();
                currentInput.each(function(index,item){
                      if($(item).attr("ispass")=="false"){
                        ispass=false;
                      }
                 })
                if(ispass){
                   console.log(CryptoJS.SHA256(oldPwd).toString());
                   console.log(CryptoJS.SHA256(newPwd).toString());
                   if(newPwd==oldPwd){
                       toastr.error("新旧密码不能相同！"); 
                   }else{
                      ajax({
                        url: postResetPwdDo,
                        type: "post",
                        contentType: "application/json",
                        callback: function (data) {
                          console.log(data);
                          if(data[0].success==true){
                              $(".updatePasswordFirst .firstItem").removeClass("edit").addClass("finish");
                              $(".updatePasswordFirst .secondItem").removeClass("edit").addClass("finish");
                              $(".updatePasswordFirst .thirdItem").addClass("edit");
                              $(".updateContentSecond").hide();
                              $(".updateContentThird").show();
                          }else{
                              toastr.error(data[0].error.errorMessage);        
                          }
                          
                        }
                    }, {"oldPwd": CryptoJS.SHA256(oldPwd).toString(),"newPwd": CryptoJS.SHA256(newPwd).toString()}); 
                   }
                  
                }

             })


             $(".goBack").click(function(){
               location.reload();
             })




       
              


             


                               




















        
      }},{});


  }


  App.adjustCurrentHash();
  /* ~~~~~~~~~~~~~~~~~~~~ hash route end ~~~~~~~~~~~~~~~~~~~~~~*/
