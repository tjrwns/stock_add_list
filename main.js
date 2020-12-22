const { app, BrowserWindow, remote } = require('electron');
const { Notification } = require('electron');

var createWindow = function() {
	const win = new BrowserWindow({
		width: 1,
		height: 1,
		webPreferences: {
			nodeIntegration: true
//			, contextIsolation: false
		}
	})
	win.maximize();
	win.loadFile('index.html');
	//win.loadURL('file://' + __dirname + '/index.html');
	//win.loadURL('http://www.fantastock.co.kr/bbs/board.php?bo_table=free_list20&wr_id=30539');
	
	// Once did-navigate seems to function fine
	win.webContents.once('did-navigate', function(){

		// THIS WORKS!!! So did-navigate is working!
		console.log("Main view logs this no problem....");
		win.webContents.once('dom-ready', function(){
		// NOT WORKING!!! Why?
//		win.webContents.executeJavaScript(`
//		(function(){
//		var a = window.document.getElementsByTagName( "article" )
//		var FN00 = function(el){
//			console.log( "--------------------start--------------------" )
//			console.log( "--------------------start--------------------" )
//			console.log( "--------------------start--------------------" )
//			var i = 0,iLen = el.length,io;
//			var r = "";
//			for(;i<iLen;++i){
//				io = el[ i ]
//				if( io.id.indexOf("c_") == -1 ) continue;
//				var j = 0,jLen = io.children[ 1 ].children.length,jo;
//				for(;j<jLen;++j){
//				
//					jo = io.children[ 1 ].children[ j ];
//					
//					var z = 0,zLen = jo.children.length,zo;
//					for(;z<zLen;++z){
//						
//						zo = jo.children[ z ]
//						//debugger;
//						//console.log( "---->" + zo.textContent )
//						var d = zo.textContent.trim();
//						
//						if( d != "" && d.indexOf( "평균" ) == -1 && d.indexOf( "종가매도" ) == -1 && d.indexOf( "보유중인 종목은 손절가와 목표가" ) == -1 ){
//							if( d.indexOf( "▶ 현재시간 9시" ) != -1 ) r += d + "\\n"
//							if( d.indexOf( "목표가" ) != -1 && d.indexOf( "손절가" ) != -1 ) r += d + "\\n"
//						}
//					}
//					if( r != "" )
//					{
//						//console.log( io.id + " ------------------------------------------------------- ")
//						//console.log( r )
//						//console.log( io.id + " ------------------------------------------------------- ")
//					}
//				}
//			}
//			
//			toSlack(r);
//
//			console.log( "--------------------end--------------------" )
//			console.log( "--------------------end--------------------" )
//			console.log( "--------------------end--------------------" )
//
//		}
//		function toSlack(message) {
//			const url = 'https://hooks.slack.com/services/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';
//			const data = {
//				text: message
//			};
//
//			const xhr = new XMLHttpRequest();
//			xhr.open("POST", url, false);
//			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
//			xhr.send('payload=' + JSON.stringify(data))
//
//			  console.log("end");
//			  window.close();
//
//		}
//
//		FN00( a )
//		//https://hooks.slack.com/services/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
//		console.log(1111)
//		return;
//		})()
//		`,function(){ win.webContents.executeJavaScript(`console.log("되나요?")` ) })

		})
	});
	console.log(123123123123123123123)
	win.webContents.openDevTools();
	
}

app.whenReady().then(createWindow)

app.on('window-all-closed', function(){
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function(){
	if (BrowserWindow.getAllWindows().length === 0) {
		
		createWindow();
	}
})
