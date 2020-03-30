chrome.app.runtime.onLaunched.addListener(init);

function init() {
    console.log('App launch');
    startWebserver('127.0.0.1', 8085, 'SR', null);



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

