;
(function ($, window) {
  /* ============== hash route ============= */   
  /* url states  */
  var getCategorys = "/category/getCategorys";
  var getKind = "/voltage/getVoltages";
  var basicNext = "/app/postGotoSptInfo";
  var imgFile = fileUrl + "/download?attachId="
  var UserPhoneUrl = "/user/getUserPhone";
  var picDir;
  var bannerImg;
  var ImgArr = [];
  var delFileUrl="/file/delFile?attachId=";
  var  contactToggle = true;  
  /* end */
  /* variablel defined */
  /*===company eidt=== */
  /* 定义基本信息数据格式 */
  var basicInformation = {
      "ids": [],     
      "showSubtitles": '',
      "summarize": '',
      "editor": '',
      "contact": '',
      "picDir": '',
      "categoryId": '',
      "contact": '',
    }
    /* variable end */
  fnObj["basicInfo"] = function (isFlags, result) {    


    /* prev step */
    if (isFlags == 1) { 
      return {       
        "merId": result.id || result.mer.id,       
      }      
    }
    /* next step */
    if (isFlags == 2) {              
       /*  image */      
        if (!picDir || !bannerImg || !ImgArr.length) {         
              toastr.info("请上传图片")
              return           
       }      
      /* ===详情===*/
      var isInput = true, isSummarize = true, isEditor =true;      
      var inputs = $(".right-fill .ipt");
      if ($("#showSubtitles").val().length > 90) {
         isInput = false; 
      } 
      inputs.each(function (index, item) {
        if ($(this).val().trim() == "") {  
          $(this).addClass("test-empty").removeClass("test-length");
          isInput = false; 
        }
        basicInformation[$(this).attr("id")] = $(this).val();     
      })     
      if ($("#summarize").val() == ''|| $("#summarize").val().length > 990) {  
        $("#summarize").blur();
        isSummarize=false;
      }else{        
        isSummarize=true;
      }
       if (editor.getPlainTxt().trim() == '' || editor.getPlainTxt().length > 990) {         
         isEditor = false;        
      }else{
        isEditor = true;
        basicInformation.editor = editor.getContent();
      }     
      if (!contactToggle) {
       App.comform("","请输入正确的手机号码","error")
        return
      }     
      if (isInput==true && isSummarize==true && isEditor==true) {
        var merIds = result.mer ? result.mer.id : "";       
        var baseObj = {
          "voltageId": $(".kind-parent").val(),
          "subVoltageId": $(".kind-sub").val(),
          "merId": result.id || merIds,         
          "subhead": basicInformation.showSubtitles.trim(),
          "remark": $("#summarize").val().trim(),
          "course": basicInformation.editor.trim(),
          // "logoImg": picDir ? picDir : $("#imgid").attr("data-attachId"),
          // "bannerImg": bannerImg ? bannerImg : $(".bannerImg").attr("data-attachId") ,
          // "resourceAttachIds": !!ImgArr.length ? ImgArr.join(',') : $(".imgs").attr("data-attachId") ,
          "logoImg": picDir,
          "bannerImg": bannerImg ,
          "resourceAttachIds": ImgArr.join(','),
          "contactWay": basicInformation.contact        
        }
         picDir = "";
         bannerImg = "";
        ImgArr = [];
        contactToggle = true;      
        /* if (result.market == "4" || merToggle) {

          baseObj.categoryId = $(".right-fill li:eq(0) select").val();

        } */
        return baseObj      

      }

    

      /* 详情完 */

    }
    if (!isFlags) {       
        if (result.mer.bannerImg) {
          bannerImg = result.mer.bannerImg;
        }
        if (result.mer.logoImg) {
          picDir = result.mer.logoImg;
        }
       if (result.mer.resourceAttachIds) {
            ImgArr = result.mer.resourceAttachIds.split(",");
          }
      /*          this is ueditor begin        */   
      if(window.editor && Object.prototype.toString.call(window.editor.destroy) === '[object Function]') {      
        window.editor.destroy();
      }
      window.editor= UM.getEditor("editor", {
      toolbar: [' undo redo | image emotion  | bold italic underline | forecolor backcolor |',
        ' justifyleft justifycenter justifyright | insertorderedlist insertunorderedlist '
      ],
      autoHeightEnabled: true,
      autoFloatEnabled: false
    }); 
       editor.ready(function(){
        if (result.mer.course != "") {
          editor.setContent(result.mer.course) 
        }             
    })   
    editor.addListener("blur", function(){              
      if (editor.getPlainTxt().trim() == '') {
       $(".text-edit").parent().addClass("test-empty").removeClass("test-length");       
        return
      }
       $('.text-edit').parent().removeClass("test-empty");
      if (editor.getPlainTxt().length > 900) {
        $(".text-edit").parent().addClass('test-length');
        return
      } 
      $(".text-edit").parent().removeClass('test-length');     
    })
    /*    -------- this ueditor ending --------       */  
      /*                      ==== this is six images ====                 */
       $(".imgs").delegate( "i", "click", function(){ 
              var delId = $(this).parent().attr("data-id");
              var that = $(this).parent();
              ajax({
                url: delFileUrl + delId,
                callback: function(data,tpl) {              
            if(data[0].success) {
                     var delIndex;
                  for(var i = 0; i < ImgArr.length; i++) {
                    if (ImgArr[i] == delId) {
                      delIndex = i
                    }
                  }                  
                  ImgArr.splice(delIndex, 1)                                
                  that.remove();                 
                  if ($(".imgs dt").length == 0 || !ImgArr.length) {                                      
                    $(".uploadImg #uploadCarousel").html("点击上传图片")
                    $(".img-active #defaultCarousel").css({"display": "inline-block"})                   
                  }
            }                 
                }})
            })

            $(".imgs").delegate("dt","mouseenter",function(){
              $(this).children("i").show();          
          })

      /*                     ---- this is six images ----                 */           

        gainKind({parentId: -1});
        function gainKind(categoryId) {
          ajax({
            url: getKind,
            callback: function (data) {             
              var tmpData = data[0].data;
              var html = '';
              tmpData.forEach(function(element, index) {
                html += "<option value =" + data[0].data[index].id + ">" + data[0].data[index].voltage_name + "</option>";                
              });
              if (categoryId.parentId == -1) {
                $(".basic-message .kind-parent").html(html);
                var parentId = $(".kind-parent option").eq(0).val();
                var voltageId = result.voltageId;
                if (voltageId) {
                  parentId = voltageId;                  
                }                
                $(".kind-parent option").each(function(index, element){
                  if ($(this).val() == parentId) {
                    $(this).attr("selected","selected");
                  }
                })
                $(".basic-message .kind-parent").change(function(){
                  parentId = $(this).val();
                  gainKind({parentId: parentId})
                })
                gainKind({parentId: parentId});

              }else {

                $(".basic-message .kind-sub").html(html);             
                if (!$(".kind-sub option").length) {
                  $(".kind-sub").html('<option value="">无</option>')
                  return
                }
                var subId = result.subVoltageId;               
                if (subId) {
                   $(".kind-sub option").each(function(index,element){
                    if ($(this).val() == subId) {
                      $(this).attr("selected","selected")                      
                    }
                  })
                }
              }             
            }
          },categoryId)
        };
      var merToggle;
      if (result.mer) {
        if (result.mer.market == 4) {
            merToggle = true;
        }
      }    
       /* ------ return result into html ------ */     
    /* 显示副标题输入框校验 */   
    $("#showSubtitles").blur(function(){     
      var inputValue=$(this).val().trim();
       if (inputValue.length > 990) {
        $(this).parent().addClass('test-length').removeClass('test-empty');
        return
      }      
      if(inputValue==''){
        $(this).parent().addClass("test-empty").removeClass("test-length");       
         $(this).css("border","1px solid #D50000");
         $(this).attr("placeholder","");
         $(this).attr("issent","false");      
      }else{
            $(this).parent().removeClass('test-empty');
            basicInformation.showSubtitles = inputValue;
            $(this).attr("issent","true");          
      }
    });  
  /* 手机验证 */ 
  $("#contact").blur(function(){
    var that=this;
    var inputValue=$(this).val().trim();
    if(inputValue==''){
       $(this).parent().addClass("test-empty").removeClass("test-length");      
       $(this).css("border","1px solid #D50000");
       $(this).attr("placeholder","");
       $(this).attr("issent","false");    
    }else{
        contactToggle = false;
        var regStr = /^1[34578]\d{9}$/;
        if(!regStr.test(inputValue)){
           $(this).parent().removeClass('test-empty').addClass('test-telephone');         
           $(this).css("border","1px solid #D50000");
           $(this).attr("placeholder","");
           $(this).attr("issent","false");     
        }else{
          $(this).parent().removeClass('test-empty test-telephone');
          contactToggle = true;
          basicInformation.contact=inputValue;
          $(that).attr("issent","true");     
       }
    }
  });
     /*  输入框获取焦点改变下划线样式  */
    $(".right-fill .ipt").focus(function(){
      $(this).css("border","1px solid #1BA8ED");
    })  
     /* 显示概述输入框校验 */
    $("#summarize").focus(function(){    
      $(this).css("border","1px solid #1BA8ED");
    })
    $("#summarize").blur(function(){
      var inputValue=$(this).val().trim();
      if (inputValue.length > 990) {
        $(this).parent().addClass('test-length').removeClass('test-empty');
        return
      }
      $(this).parent().removeClass('test-length');
      if(inputValue==''){
        $(this).parent().addClass('test-empty').removeClass('test-length');         
         $(this).css("border","1px solid #D50000");
         $(this).attr("placeholder","");
         $(this).attr("issent","false");  
      }else{
            $(this).parent().removeClass('test-empty');
            $(this).parent().removeClass('test-length');
            basicInformation.summarize=inputValue;
            $(this).css("border","1px solid #1BA8ED");
            $(this).attr("issent","true"); 
        
      }
    });

      $("#field").change(function () {
        basicInformation.categoryId = $(this).val();
      })  
      /* 图片路径  */
      var FilePath = '';
      /* upload file is about logo  */
      $('#logo-upload').click(function (e) {
        var formData = new FormData();
      
         uploadMore(formData, function (data) {          
          $("#imgid")[0].src = imgFile + data.data.attachId;
          picDir = data.data.attachId;
      })     
      });

      /* upload banner img */
      $("#uploadBanner").click(function () {
        var formData = new FormData();

        uploadMore(formData, function (data) {        
          bannerImg = data.data.attachId;         
          $(".bannerImg img").attr("src", imgFile + data.data.attachId);
        })
      })      
      /* upload carousel img */
      $("#uploadCarousel").click(function () {        
        var formData = new FormData();        
        uploadMore(formData, function (data) {
          $(".img-active #defaultCarousel").css({"display": "none"})         
          if (ImgArr.length < 6) {
             $(".uploadImg #uploadCarousel").html("继续上传")                                                              
            ImgArr.push(data.data.attachId)           
            $(".six-img dl").addClass("img-active")
            $(".six-img dl").removeClass("img") 
             var html = 
               ' <dt data-id=' + data.data.attachId + '>' +
                 ' <img src=' + imgFile + data.data.attachId +' alt="">' +
                  '<i class="fa fa-minus-circle del" ></i>' +
               ' </dt>'; 
            $(".imgs").append(html);
            if (ImgArr.length == 6) {
               $("#uploadCarousel").html("上传完毕")
            }
                
          }else{
            $("#uploadCarousel").html("只能上传六张图片")
            animated($("#uploadCarousel"),"shake")
            setTimeout(function(){
              $("#uploadCarousel").html("点击上传图片")
            },1000)

          }
        })
      })

      function uploadMore(formData, callFn) {
        $("#upload").click();        
        $("#upload").off('change').on('change', function () {      
          var Url =  "/file/upload";
          formData.append("file", $("#upload")[0].files[0]);
          uploadFile({
            url: Url,
            type: "post",
            processData: false,
            callback: function(data){
              if (data[0].success) {
                 callFn(data[0])
              $("#upload").attr("type","text");
              $("#upload").attr("type","file"); 
              }
            }            
          },formData,function(){

            App.comform("","上传图片失败,请重试","upload")

          })      
        });
      }     
    }
  }

  /* ~~~~~~~~~~~ hash route end ~~~~~~~~~~~ */

})($, window)

function receive() {

}
