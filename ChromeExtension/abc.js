function init() {
    console.log('App launch');

    var url = document.getElementById('server-url').value;
    var port = document.getElementById('server-port').value;

    debugger;
    startWebserver(url, port, 'SR', null);



    function startWebserverDirectoryEntry(host,port,entry) {
      directoryServer = new WSC.WebApplication({host:host,
                                                port:port,
                                                renderIndex:true,
                                                entry:entry
                                               })
      directoryServer.start()
    }
  
    //directory must be a subdirectory of the package
    function startWebserver(host,port,directory,settings){
      chrome.runtime.getPackageDirectoryEntry(function(packageDirectory){
  
        console.log('packageDirectory - ' + packageDirectory);
        var data1 = packageDirectory.getDirectory(directory,{create: false},function(webroot){
  
          console.log('webroot - ' + webroot);
          debugger;
  
          var fs = new WSC.FileSystem(webroot)
          var handlers = [['/data.*', AdminDataHandler],
                          ['.*', WSC.DirectoryEntryHandler.bind(null, fs)]]
          adminServer = new WSC.WebApplication({host:host,
                                                port:port,
                                                handlers:handlers,
                                                renderIndex:true,
                                                auth:{ username: "a",
                                                       password: "a" }
                                               })
          adminServer.start()
        }, function(e) { 

          console.log('error g');
          console.log(e);
        });
  
      });
      // console.log('data1');
      // console.log(data1);
    }
}

window.onload = function () {
    debugger;
    document.querySelector("#server-start").addEventListener("click", function() {


        var url = document.getElementById('server-url').value;
        var port = document.getElementById('server-port').value;

        var srWcServer = { Url: url, Port: port };

        chrome.storage.sync.set({'srWcServerInfo': srWcServer});
        chrome.runtime.sendMessage('demo');

        //   chrome.storage.sync.get(['srWcServerInfo'], function(result) {
        //     console.log('Value currently is ' + result.srWcServerInfo);
        //     console.log('Value currently is ' + result);
        //   });
    } );
};