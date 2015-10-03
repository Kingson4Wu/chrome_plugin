// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
var bool = true;
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!

 /* if(bool){
  console.log('Turning ' + tab.url + ' blue!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="blue"'
  });
  	bool = false;
  }else{
	chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="white"'
  });
	bool = true;
  }*/
 
  //如何保持打开的tab唯一
  var option_url = chrome.extension.getURL('index.html');
	chrome.tabs.getAllInWindow(null,function(tabs){
    var option_tab = tabs.filter(function(t) { return t.url === option_url });
    if(option_tab.length){
        // 已经打开，直接激活
        chrome.tabs.update(option_tab[0].id,{selected:true});
    }else{
        chrome.tabs.create({url:option_url,selected:true})
    }
});


    var notification = webkitNotifications.createNotification(
        chrome.extension.getURL('images/icon-128.png')
        ,'kxw'
        ,'notification'
    );
    notification.show();
    // 显示完之后5秒关闭
    notification.ondisplay = function(e) {
        setTimeout(function() { notification.cancel(); }, 5000);
    }

});
