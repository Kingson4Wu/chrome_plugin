必须属性：name、version、manifest_version
1、name 顾名思义就是你的插件的名称；

2、version 指你的插件的版本号；

3、manifest_version 指定清单文件格式的版本，在Chrome18之后，应该都是2，所以这个值直接设定为2就OK了；

推荐属性：description、icons、default_locale 
1、description 插件描述，简单介绍插件用途；

2、icons 插件图标，需准备16*16（扩展信息栏）、48*48（扩展管理页面）、128*128（用在安装过程中）的三个图标文件，建议为PNG格式，因为PNG对透明的支持最好；

3、default_locale 国际化支持，支持何种语言的浏览器，虽然官方推荐，不过我没用；

background
这是一个比较重要的属性，如果你需要运行一些后台脚本，比如监听用户在扩展信息栏按下你的插件图标，或者你要监听用户新建tab页，这个时候你就需要有一个background的页面。background你可以指定一个HTML页面（如我的插件），也可以指定一个JS文件，如：


{
  "name": "My extension",
  ...
  "background": {
    "scripts": ["background.js"]
  },
  ...
}

<https://developer.chrome.com/extensions/background_pages.html>
<http://blog.jobbole.com/46608/>
<http://www.cnblogs.com/ambar/archive/2011/06/19/write-the-first-chrome-extension.html>

***

接口	|表现	|介绍
page action	|地址栏图标，点击打开新tab页面或内容注入|	适用于只对少数页面有意义的特征（比如RSS订阅）。
browser action	|工具栏图标，点击打开一个popup层或新tab页面|	适用于多数页面有意义的特征（比如我常用代码格式化工具jsbeautifier）。
app	|应用程序列表，点击打开内置tab页面或任意域名的新网页|	为了获得最佳体验（比如全屏、桌面快捷方式、任务栏图标），或者兼容其他浏览器（部署到自己的服务器上，比如'wordsquared.com'应用）。

***

page action、browser action与content scripts的区分

你的目录对应的是浏览器中的 'chrome-extension://{extensionId}/'根目录。

content scripts是page action将注入到特定页面中的脚本，permissions授权它可以在哪些条件下执行。

options page是扩展的设置页面。

对于扩展，background page 定义的html页面必须的并且是最重要的。在浏览器开启后，扩展本身在这个后台页面上运行。

backgroun page可以使用所有的chrome.* api，在它之外的扩展页面需要使用 chrome.extension.getBackgroundPage() 来与它通讯；而浏览器中页面不能访问它，只有content scripts可以通过chrome.extension.sendRequest()与它通讯。

***

Snippets
如何保持打开的tab唯一

var option_url = chrome.extension.getURL('options/index.html');
chrome.tabs.getAllInWindow(null,function(tabs){
    var option_tab = tabs.filter(function(t) { return t.url === option_url });
    if(option_tab.length){
        // 已经打开，直接激活
        chrome.tabs.update(option_tab[0].id,{selected:true});
    }else{
        chrome.tabs.create({url:option_url,selected:true})
    }
});
回到指定窗口的指定tab:

// todo: 保存一个tab引用，或者仅仅是tabId和windowId
var tab = foo;
chrome.windows.get(tab.windowId,function(win) {
  chrome.windows.update(win.id,{focused:true});
  chrome.tabs.update(tab.id,{selected:true});	
})
前台tab页面通知backgroundPage:

var key = 'some_method',parameters = {};
chrome.extension.sendRequest({ report : key, parameters : parameters }, callback);
backgroundPage通知tab页面方式，脚本注入：

// 执行一个文件
chrome.tabs.executeScript(tabId, { file: 'foo.js' });
// 一段代码
chrome.tabs.executeScript(tabId, { code: 'alert(1)'} );
// 另，插入CSS方法，参数与上面类似
chrome.tabs.insertCSS(tabId, { file: 'foo.css' });
通过localStorage存储扩展配置

localStorage['member'] = JSON.stringify({username:'ambar'})
往特定tab页中的扩展发送一个请求：

// 第二个参数完全自定义
chrome.tabs.sendRequest(tab.id, { foo:true, any_other_params:'' });
桌面通知有两种格式：HTML和纯文件，具体API

// html式，可以简单的用查询变量传递参数
var notify_html = function(icon,title,message) {
    var encode = encodeURIComponent;
    var notification = webkitNotifications.createHTMLNotification(
        chrome.extension.getURL(
            'html/notification.html?message='+encode(message)
            +'&title='+encode(title)
            +'&icon='+encode(icon)
        )
    );
    
    notification.show();
};

// 文本格式，可以设置一个图标和标题
var notify_plain = function(icon,title,message) {
    var notification = webkitNotifications.createNotification(
        chrome.extension.getURL('notification.png')
        ,title
        ,message
    );
    notification.show();
    // 显示完之后5秒关闭
    notification.ondisplay = function(e) {
        setTimeout(function() { notification.cancel(); }, 5000);
    }
}