;
(function ($, window) {
  window.App = {};
  App.ejsTpl = {};
  App.routeMap = {};
  App.loadTemplate = function (id, path) {
    var defer = $.Deferred();
    if (App.ejsTpl[id]) {
      defer.resolve(App.ejsTpl[id]);
    } else {
      $.ajax({
        url: path,
        method: 'get',
        dataType: 'text',
        success: function (res) {
          // console.log('Get template: '+id+' done!');
          App.ejsTpl[id] = res;
          defer.resolve(res);
        },
        error: function (res) {
          console.log('Get template: ' + id + ' error!');
          defer.reject(res);
        }
      });
    }
    return defer
  }
  App.encodeParams = function (data) {
    var params = '';
    Object.keys(data).forEach(function (v) {
      params += '&' + v + '=' + data[v];
    })
    params = params.substr(1);
    return encodeURIComponent(params);
  }
  App.decodeParams = function (str) {
    var tmp = decodeURIComponent(str).split("&");
    var keyValue;
    var params = {};
    tmp.forEach(function (v, i) {
      keyValue = v.split("=");
      if (keyValue[0]) params[keyValue[0]] = keyValue[1];
    })
    return params
  }
  var routeHandle = function () {
    var data = location.hash.split("?");
    var hash = data[0];
    var args = data[1];
    if (args) {
      args = App.decodeParams(args);
    }
    if (App.routeMap[hash]) {
      App.routeMap[hash].call(this, args)
    } else {
      console.log("route" + hash + "is undefined")
    }
  }
  window.addEventListener("hashchange", function () {
    console.log("this hashChange")
    routeHandle();
  }, false)

  App.adjustCurrentHash = function () {
    routeHandle();
  }
  App.comform = function (callback, text, htmlTpl) {

    $("body").css({ "overflow": "hidden" });
    if (!text) {
      text = "删除"
    }
    var html = "";
    if (!htmlTpl) {
      html =
        '<div class="modalFrame" id="modalFrame">' +
        '<div>' +
        '<h4>确定要 ' + text + '吗?</h4>' +
        '<button>确定</button>' +
        '<button>取消</button>' +
        '</div>' +
        '</div>'
      $("body").append(html);
      var modal = document.getElementById("modalFrame");
    } else {
      html =
        '<div class="modalFrame">' +
        '<div>' +
        '<h4>' + text + '</h4>' +
        '<button>ok</button> ' +
        '</div>' +
        ' </div>'
    }
    $("body").append(html);

    animated($(".modalFrame button"), "pulse")
    $(".modalFrame button").click(function () {
      if ($(this).index() == 1 && $(this).html() == "确定") {
        if (typeof callback == "function") {
          callback()
        }

      }
      $("body .modalFrame").remove()
      $("body").css({ "overflow": "visible" })
    })

  }
})($, window);
