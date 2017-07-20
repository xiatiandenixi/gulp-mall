//详情页假数据
var data= {
      "score": "4",
      "evalCount": 6,
      "subhead": null,
      "course": "使用步骤：1.注册，请填写正确的注册信息。2，登录，输入正确的用户名密码。3，创建角色，为相关人员创建角色。4，分配权限，根据角色分配不同的权限。\n使用步骤：1.注册，请填写正确的注册信息。2，登录，输入正确的用户名密码。3，创建角色，为相关人员创建角色。4，分配权限，根据角色分配不同的权限。\n使用步骤：1.注册，请填写正确的注册信息。2，登录，输入正确的用户名密码。3，创建角色，为相关人员创建角色。4，分配权限，根据角色分配不同的权限。",
      "remark": "小贷业务系统是专门为满足小额信贷公司业务管理与业务经营需要，为小额信贷公司从贷款申请受理到贷款结清、风险控制到客户服务这一过程中所发生的交易记录、费用审批、交易跟踪、财务结算、合同管理、风险管理以及流程管理等事务而开发的一套核心业务系统。\n系统包括信贷全生命周期的管理，包括贷前、贷中、贷后的审批作业系统、账务、催收、征信、支付清算，实现从申请到结清的整个过程管理，",
      "merchandiseName": "小贷业务系统",
      "resourceAttachIds": "dir1;dir2",
      "spts": {
          "30人": [
              {
                  "price": 30,
                  "timeLimt": "1"
              },
              {
                  "price": 90,
                  "timeLimt": "3"
              },
              {
                  "price": 120,
                  "timeLimt": "4"
              },
               {
                  "price": 120,
                  "timeLimt": "5"
              }
          ],
          "50人": [
              {
                  "price": 50,
                  "timeLimt": "2"
              },
              {
                  "price": 150,
                  "timeLimt": "5"
              }
          ]
      }
  };

//评论页假数据
var disData= {
    "page": 1,
    "pageSize": 10, 
    "items": [
        {
            "creationtime": "2017-02-01 17:00", 
            "user_name": "请求没得到，现在提供假数据",
            "remark": "very good",
            "score": "5"
        },
        {
            "creationtime": "2017-02-01 17:00",
            "user_name": "zhangsan",
            "remark": "very good",
            "score": "5"
        },
        {
            "creationtime": "2017-04-06 10:00",
            "user_name": "zhangsan",
            "remark": "nice",
            "score": "4"
        },
        {
            "creationtime": "2017-06-05 14:00",
            "user_name": "zhangsan",
            "remark": "nice",
            "score": "4"
        },
        {
            "creationtime": "2017-06-11 09:00",
            "user_name": "zhangsan",
            "remark": "very very good",
            "score": "5"
        }
    ]
};
//获取主页点击详情传回来的id
var id = location.search.split("=")[1] || "1";
var detailUrl = "/app/getDetail";
var pageUrl="/app/getEvaluations";
  ajax({
       url: detailUrl,
       type: "get",
       callback: function(data) {
            // alert(1);
            var tem = $("#tem").html();
            var imgArrs=data[0].data.resourceAttachIds.split(",");
            var html = ejs.render(tem,{data:data[0],imgArrs:imgArrs});
            $("#product").html(html);
            console.log(data[0].success);
        if(data[0].success){
             // alert(id);
              if(id==7||id==11){
                 $(".providers").hide();
                 $(".remark").hide();
                 $("#curSummary").css("height","0px");
                 $("#curSummary").hide();
                 $("#testId_01").show();
                 $("#testId_02").show();
              }

                // 存规格名称
              var persons=[];
              // 存年限
              var norms=[];
              console.log(data[0]);
              for(p in data[0].data.spts){
                norms.push(data[0].data.spts[p]);
              }


              console.log(norms);
              $("#curSummary").html(data[0].data.course);
             // 用于拼接字符串
              var itemHtml="";
              var itemString="";
              if(norms.length){
                itemHtml+='<strong>￥<i id="defaultPrice">'+ norms[0][0].price +'</i></strong>' +
                  '<div style="clear:both;"></div>' +
                  '<div class="pay">' +
                  '<ul class="norms">';
              }
                      
              for(var item in data[0].data.spts){
                  itemHtml+='<li>'  +item + '</li>';
              };

              itemHtml+='</ul><div style="clear:both;"></div><div class="listMonth">';
              for(var item in data[0].data.spts){
                var itemArray = data[0].data.spts[item];
                if(itemArray&&itemArray.length){
                  itemHtml+='<div class="times">';
                  for (var j = 0; j < itemArray.length; j++) {
                     var itemn = itemArray[j];
                     itemHtml+='<span price=' + itemn.price + '>' + itemn.timeLimt + '</span>';
                  }
                  itemHtml+='</div>';
                }
              };
              // if(data.data.sellingMode==4||norms.length==0){
              //   itemHtml+=`<div style="clear:both;"></div>
              //   <div class="buy"><em id="addFa" class="on">添加收藏</em></div>
              //   </div>`;
              // }else{
              //   itemHtml+=`<div style="clear:both;"></div>
              //   <div class="buy"><em id="addFa">添加收藏</em><em id="buyNow" class="on">立即购买</em></div>
              //   </div>`; 
              // }
           

               if(data[0].data.sellingMode==4||norms.length==0){
                itemHtml+='<div style="clear:both;"></div>' +
                  '<div id="priceNegotiable">' +
                    '<p><span>价格:</span><em>价格面议</em></p>' +
                    '<p><span>联系电话：</span><em>' + data[0].data.contactWay + '</em></p>' +
                  '</div>' +
                '</div>';
              }else{
                itemHtml+='<div style="clear:both;"></div>' + 
               ' <div class="buy"><em id="addFa" style="display:none">添加收藏</em><em id="buyNow" class="on">立即购买</em></div>' +
                '</div>'; 
              }
              // console.log(itemHtml);
              $(".money").html(itemHtml);
              run(data);
              console.log("sucess");
              console.log(data[0])
          }
  }},{"id":id});
function run(data){ 
  //存数据进行操作
  var datas={};
  //拼接字符串挂在的dom,临时加落空类。
  $(".norms li:first").addClass("on");
  $(".times:first").addClass("on");
  $(".times span:first").addClass("on");
  $(".times:last span:first").addClass("on");

  
  // 计算价钱
  $(".norms li").click(function(){
    var index = $(this).index();
    $(".times").eq(index).addClass("on").siblings().removeClass("on").children("span").eq(0).addClass("on").siblings().removeClass("on");
    $(this).addClass("on").siblings().removeClass("on");
    $(".firstPrice").addClass("on").siblings().removeClass("on");
    $("#defaultPrice").html($(".times").eq(index).children("span").eq(0).attr("price"));
  })

  //鼠标放上去样式
   $(".norms li").hover(function(){
      if(!$(this).hasClass("on")){
        $(this).css({"border":"1px solid #666","color":"#666"});
      }
    },function(){
      if(!$(this).hasClass("on")){
       $(this).css({"border":"1px solid #999","color":"#999"});
      }
   });


  $(".times span").click(function(){
    $(this).addClass("on").siblings().removeClass("on");
    $("#defaultPrice").html($(this).attr("price"));
  })

   $(".times span").hover(function(){
      if(!$(this).hasClass("on")){
        $(this).css({"border":"1px solid #666","color":"#666"});
      }
    },function(){
      if(!$(this).hasClass("on")){
       $(this).css({"border":"1px solid #999","color":"#999"});
      }
   });

  // 提交按钮
   $("#addFa").on("click",function(){
    $(this).addClass("on").siblings().removeClass("on");
  })
   // 立即购买按钮
   $("#buyNow").on("click",function(){
     $(this).addClass("on").siblings().removeClass("on");
     /* === 定义一个变量 === */
          var obj = {};
          // obj.name = $(".service h3").eq(0).html();
          /* === 获取人数规格 === */
          obj.size = $(".norms .on").html();
          /* === 获取周期 === */
          obj.period = $(".listMonth .on span.on").html();
          // obj.price = $("#defaultPrice").html();
          var result = data[0].data.spts;           
           for(var i = 0; i< result[obj.size].length; i++) {                   
                  if (obj.period == result[obj.size][i].timeLimt) {
                    /* === 跳转到订单页面 === */
                    window.location.href = "order.html?id="+result[obj.size][i].id
                    
                  }
              }       
         
        })
 
// 轮播图
 jq('#demo1').banqh({
  box:"#demo1",//总框架
  pic:"#ban_pic1",//大图框架
  pnum:"#ban_num1",//小图框架
  prev_btn:"#prev_btn1",//小图左箭头
  next_btn:"#next_btn1",//小图右箭头
  pop_prev:"#prev2",//弹出框左箭头
  pop_next:"#next2",//弹出框右箭头
  prev:"#prev1",//大图左箭头
  next:"#next1",//大图右箭头
  pop_div:"#demo2",//弹出框框架
  pop_pic:"#ban_pic2",//弹出框图片框架
  pop_xx:".pop_up_xx",//关闭弹出框按钮
  mhc:".mhc",//朦灰层
  autoplay:true,//是否自动播放
  interTime:5000,//图片自动切换间隔
  delayTime:400,//切换一张图片时间
  pop_delayTime:400,//弹出框切换一张图片时间
  order:0,//当前显示的图片（从0开始）
  picdire:true,//大图滚动方向（true为水平方向滚动）
  mindire:true,//小图滚动方向（true为水平方向滚动）
  min_picnum:5,//小图显示数量
  pop_up:true//大图是否有弹出框
})
 
$(".tab>.tab-item").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    var index = $(this).index();
    $(".products>.main").eq(index).addClass("selected").siblings().removeClass("selected");
})

//统计条,评论几个星所占人数的百分比,ue说不要了，暂时放着
var bar = new ProgressBar.Line(container, {
        strokeWidth: 3,
        easing: 'linear',
        duration: 1400,
        color: '#f17e87',
        trailColor: '#fff',
        trailWidth: 3,
    });
bar.animate(.3); 
var bar1 = new ProgressBar.Line(container1, {
        strokeWidth: 3,
        easing: 'linear',
        duration: 1400,
        color: '#f17e87',
        trailColor: '#fff',
        trailWidth: 3,
        //svgStyle: {width: '100%', height: '100%'}
    });
bar1.animate(.4); 
var bar2 = new ProgressBar.Line(container2, {
        strokeWidth: 3,
        easing: 'linear',
        duration: 1400,
        color: '#f17e87',
        trailColor: '#fff',
        trailWidth: 3,
        //svgStyle: {width: '100%', height: '100%'}
    });
bar2.animate(.5); 
var bar3 = new ProgressBar.Line(container3, {
        strokeWidth: 3,
        easing: 'linear',
        duration: 1400,
        color: '#f17e87',
        trailColor: '#fff',
        trailWidth: 3,
        //svgStyle: {width: '100%', height: '100%'}
    });
bar3.animate(.8); 
var bar4 = new ProgressBar.Line(container4, {
        strokeWidth: 3,
        easing: 'linear',
        duration: 1400,
        color: '#f17e87',
        trailColor: '#fff',
        trailWidth: 3,
        //svgStyle: {width: '100%', height: '100%'}
    });
bar4.animate(.2); 
//挂载星星
var count=1;
 for(var i = 0; i < 9; i++){
      var stars="star";
      stars=stars+count;
      // console.log(stars);
      raty(stars);
      count++;          
  };

// 分页查询
    pagination({
        url: pageUrl,
        type: "get",
        isPage: true,
        callback: function(datas) {
          console.log(datas);
          console.log("评论数据");
          if(datas[0].data.items.length){
          var discussHtml="";
           for(var i=0;i<datas[0].data.items.length;i++){
                discussHtml+= '<div class="discuss">' +
               ' <div class="userDiscuss">' +
                  '<h3>' + datas[0].data.items[i].user_name + '</h3>' +
                 ' 评分<span class="starScore"><i id="star8" data-score="3"></i><em>' + datas[0].data.items[i].score + '</em>分</span>' +
                  '<span>' + datas[0].data.items[i].creationtime + '</span>' +
                 ' <p>' + datas[0].data.items[i].remark + '</p>' +
               ' </div>' +
                '<div class="reply">' +
                  '<p>服务商回复：</p>' +
                  '<span>感谢您的支持，我们会再接再厉哦！</span>' +
                '</div>' +
             ' </div>';
            };
           $("#cri").html(discussHtml);
          }
        }
        },{
          "page":1,
          "pageSize":6,
          id: id
      }); 



  

};
