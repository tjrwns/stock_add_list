(function(){
	var fs = require( "fs" );
	var execSync = require('child_process').execSync;

	window.stockCodes = JSON.parse( fs.readFileSync( "allStockCode.json" ).toString() );
	
	window.addEventListener('DOMContentLoaded', function(){

		var a = window.document.createElement("div");
			a.id = "_tmp_"
			a.style.height ="200px"
			a.style.backgroundColor = "#ff0000"

		var b = window.document.body;
			b.appendChild( a );

		var c = window.document.getElementById( "_tmp_" );
		window.MSGS = {};

		var URLS = {
			targetListPage : "http://www.fantastock.co.kr/bbs/board.php?bo_table=free_list20"
			, targetPage : ""
			, slackToMe : "https://hooks.slack.com/services/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"
			, slackToStock : "https://hooks.slack.com/services/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"
		};

		var getTagetPage = function( cbFunction ){
			
			var xhr = new XMLHttpRequest();
				xhr.open("GET" , URLS.targetListPage );
				xhr.onreadystatechange = function() {
					if( xhr.readyState == 4 && xhr.status == 200 )
					{
						var page_innerHTML = xhr.responseText.match(/<table[^>]*>([\w|\W]*)<\/table>/im)[0];
												
						c.innerHTML = page_innerHTML;
						
						var _tdom = window.document.getElementsByClassName( "bo_notice" );
						var _tbody = window.document.getElementsByTagName( "tbody" )[ 0 ]
						var k = 0,kLen = _tdom.length,ko;
						for(;k<kLen;++k){
							ko = window.document.getElementsByClassName( "bo_notice" )[ 0 ];
							_tbody.removeChild( ko );
						}
						URLS.targetPage = window.document.getElementsByClassName( "td_subject" )[ 0 ].children[0].children[0].href;			
						c.innerHTML = "";
						cbFunction();
					}
				}
				xhr.send();
		}

		var pad = function(n, width){
			n = n + '';
			return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
		};

		var getNowYYYYMMDD_HHMMSS = function(){
			var date = new Date();
			
			var YYYY = date.getFullYear();
			var MM = pad( date.getMonth() + 1, 2 );
			var DD = pad( date.getDate(), 2 );
			var H = pad( date.getHours(), 2 );
			var M = pad( date.getMinutes(), 2 );
			var S = pad( date.getSeconds(), 2 );

			return YYYY + "-" + MM + "-" + DD + " " + H + ":" + M + ":" + S;
		};

		var loadPage = function(targetEl, url, cbFunction ){
			var xhr = new XMLHttpRequest();
				xhr.open("GET" , url );
				xhr.onreadystatechange = function() {
					if( xhr.readyState == 4 && xhr.status == 200 )
					{
						var page_innerHTML = xhr.responseText.match(/<section id="bo_vc"[^>]*>([\w|\W]*)<\/section>/im)[0]
											.replace( /김용재소장님의  댓글/gi, "" )
											//.replace( /<header style="z-index[^>]*>([\w|\W]*)<\/header>/gi, "" );
							
						targetEl.innerHTML = page_innerHTML;
						cbFunction();
					}
				}
				xhr.send();
		};

		var FN00 = function(){

			var _el = window.document.getElementsByTagName( "article" )
			var i = 0,iLen = _el.length,io;
			
			for(;i<iLen;++i){
				io = _el[ i ]
				if( io.id.indexOf("c_") == -1 ) continue;
				
				var j = 0,jLen = io.children[ 1 ].children.length,jo;
				for(;j<jLen;++j){
					var r = "";
					jo = io.children[ 1 ].children[ j ];
					
					var z = 0,zLen = jo.children.length,zo;
					for(;z<zLen;++z){
						
						zo = jo.children[ z ]
						var d = zo.textContent.trim();
						
						if( d != "" && d.indexOf( "평균" ) == -1 && d.indexOf( "종가매도" ) == -1 && d.indexOf( "보유중인 종목은 손절가와 목표가" ) == -1 ){
							if( d.indexOf( "▶ 현재시간 9시" ) != -1 || d.indexOf( "현재가" ) != -1 )
							{
								if( d.indexOf( "▶ 현재시간 9시" ) != -1 )
								{
									var _tArr = d.split( " " );
									var key = _tArr[ _tArr.length - 1];
									console.log( key + " - " + window.stockCodes[ key ])
									execSync('test.ahk ' + window.stockCodes[ key ]);
								}

								r += d 
								if( !window.MSGS[ io.id ] )
								{
									window.MSGS[ io.id ] = { text : "", isSend : 0 };
								}
							}
							if( d.indexOf( "목표가" ) != -1 && d.indexOf( "손절가" ) != -1 && d.indexOf( "1차" ) != -1 )
							{
								r += d + "원";
								if( !window.MSGS[ io.id ] )
								{
									window.MSGS[ io.id ] = { text : "", isSend : 0 };
								}
							}
						}
					}
					if( r != "" ) window.MSGS[ io.id ].text += r + " - ";
					else continue;
				}
			}
			
			var now = getNowYYYYMMDD_HHMMSS();

			var msg = "";
				msg += "\n\n==============================\n\n";
				msg += now
				msg += "\n\n==============================\n\n";
			
			var s,so,msg_cnt = 0;
			for( s in window.MSGS ){
				so = window.MSGS[ s ];
				
				if( !so.isSend )
				{
					msg += so.text + "\n";
					so.isSend = 1;
					++msg_cnt;
				}
			}

			if( msg_cnt != 0 ) toSlack( URLS.slackToStock, msg );
			
			if( Object.keys( window.MSGS ).length < 6 )
			{
				console.log( "아직메세지 전체를 수신하지 않았음" + getNowYYYYMMDD_HHMMSS() );
				
				var now = new Date();
				var HH = now.getHours();
				if( HH == 9 ) interval = 10000;
				else interval = 60000;
				console.log( interval )
				setTimeout(function(){
					loadPage( c, URLS.targetPage , function(){ FN00(); });
				},interval)
			}
			else
			{
				toSlack( URLS.slackToStock, "전체메세지 수신 완료!" )
			}
		}

		var toSlack = function( url, message){

			var payload = { "text" : message };

			var xhr = new XMLHttpRequest();
			xhr.open("POST", url );
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send( JSON.stringify(payload) )

			console.log("Msg Send Complete - " + payload.text );

		};

		getTagetPage(function(){
			loadPage( c, URLS.targetPage , FN00 )
		})
	})
})()