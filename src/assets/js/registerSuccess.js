;(function(){
  // 点击前往首页进行跳转
  $("#index").click(function(){
     window.location.href="../../index.html";
  })
   // 点击头部登录按钮进入登录页面
  $(".loginIn").click(function(){
    window.location.href="login.html";
  })
 // 点击直接登录按钮跳转到登录界面
  $(".points span").click(function(){
    window.location.href="login.html";
  })
  // 点击注册按钮跳转到注册页面
  $(".register").click(function(){
    window.location.href="register.html";
  })
  // 点击个人中心进入个人信息页面
  $("#personal").click(function(){
     window.location.href="manageAccount.html";
  })
})()
