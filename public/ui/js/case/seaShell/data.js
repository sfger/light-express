define(function(){
	return [
		//{{{BookMark
		{
			name: '收藏',
			children:[
				//TeamBlog{{{
				{
					name: '团队博客',
					children:[
						{
							name: '腾讯',
							children:[
								{name:'腾讯Web前端 AlloyTeam', url:'http://www.alloyteam.com/'},
								{name:'TGideas游戏设计', url:'http://tgideas.qq.com/'},
								{name:'WSD 用户体验', url:'http://mxd.tencent.com/'},
								{name:'CDC用户研究与体验设计中心', url:'http://cdc.tencent.com/'}
							]
						},
						{
							name: '淘宝',
							children:[
								{name:'淘宝FED', url:'http://taobaofed.org/'},
								{name:'淘测试', url:'http://www.taobaotest.com/'},
								{name:'淘宝搜索技术团队', url:'http://www.searchtb.com/'},
								{name:'一淘UX', url:'http://ux.etao.com/'}
							]
						},
						{
							name: '阿里巴巴',
							children:[
								{name:'阿里中间件', url:'http://jm.taobao.org/'},
								{name:'阿里巴巴国际站UED', url:'http://www.aliued.com/'},
								{name:'阿里巴巴中文站UED', url:'http://www.aliued.cn/'}
							]
						},
						{
							name: '百度',
							children:[
								{name:'百度MUX', url:'http://mux.baidu.com/'},
								{name:'百度UFO', url:'http://www.baiduux.com/'},
								{name:'百度UED', url:'http://ued.baidu.com/'}
							]
						},
						{name:'奇虎75Team', url:'http://www.75team.com/'},
						{name:'携程UED', url:'http://ued.ctrip.com/'},
						{name:'网易UEDC', url:'http://uedc.163.com/'},
						{name:'新浪UED', url:'http://ued.sina.com/'}
					]
				},
				//}}}
				//社区{{{
				// {
				// 	name: '社区'
				// 	children:[
				// 	]
				// },
				//}}}
				//Blog{{{
				{
					name: '个人博客、社区',
					children:[
						{name:'博客园', url:'http://www.cnblogs.com'},
						{name:'掘金', url:'http://gold.xitu.io/welcome'},
						{name:'众成翻译', url:'http://www.zcfy.cc/'},
						{name:'阮一峰', url:'http://www.ruanyifeng.com/blog/', target:"_blank"},
						{name:'张鑫旭', url:'http://www.zhangxinxu.com'},
						{name:'w3cplus', url:'http://www.w3cplus.com/'},
						{name:'36kr', url:'http://www.36kr.com/'},
						{name:'welefen', url:'http://www.welefen.com/'},
						{name:'IBM-CN', url:'https://www.ibm.com/developerworks/cn/'},
						{name:'月光博客', url:'http://www.williamlong.info/'},
						{name:'前端观察', url:'http://www.qianduan.net/'},
						{name:'大前端', url:'http://www.daqianduan.com/'},
						{name:'酷壳', url:'http://coolshell.cn/'},
						{name:'Typeof', url:'http://typeof.net'},
						{name:'cloudgamer', url:'http://www.cnblogs.com/cloudgamer/'},
						{name:'ziyunfei', url:'http://www.cnblogs.com/ziyunfei/'},
						{name:'imququ', url:'https://imququ.com/'},
						{name:'ipresst', url:'http://www.ipresst.com/'},
						{name:'hacker-scripts', url:'https://github.com/NARKOZ/hacker-scripts'},
						{name:'js8', url:'http://js8.in/'},
						{name:'HTML580', url:'http://www.html580.com/'},
						{name:'CSSASS', url:'http://www.cssass.com/blog/'}
					]
				},
				//}}}
				//Standard&Tools{{{
				{
					name: '协议、文档、标准',
					children:[
						{name:'ES6', url:'http://es6.ruanyifeng.com/'},
						{name:'MathJS', url:'http://mathjs.org/'},
						{name:'w3help', url:'http://www.w3help.org/'},
						{name:'JS标准参考中文', url:'http://javascript.ruanyifeng.com/'},
						{name:'JSON', url:'http://www.json.org/'}
					]
				},
				{
					name: '组织、工具、书籍',
					children:[
						{name:'JavascripToo', url:'http://www.javascriptoo.com/'},
						{name:'HTML5Rock', url:'http://www.html5rocks.com/zh/resources'},
						{name:'Email-ToolBox', url:'http://email-toolbox.com/'},
						{name:'Programming-Books', url:'https://github.com/vhf/free-programming-books'},
						{name:'Javascript-Guide', url:'https://github.com/airbnb/javascript'},
						{name:'Front-End-Collect', url:'https://github.com/foru17/front-end-collect'},
						{name:'BestBooks', url:'http://bestcbooks.com/'}
					]
				},
				//}}}
				//Software{{{
				{
					name: '软件',
					children:[
						{
							name:'Vim',
							children:[
								{name:'Vim官网', url:'http://www.vim.org/'},
								{name:'Vim官网代理', url:'http://vim.wendal.net/'},
								{name:'GitHub vim-scripts', url:'https://github.com/vim-scripts?tab=repositories'},
								{name:'vimer', url:'http://www.vimer.cn/'}
							]
						},
						{name:'GIMP', url:'http://www.gimp.org'},
						{name:'PHP', url:'http://www.php.net'},
						{name:'Scala', url:'http://www.scala-lang.org'},
						{name:'Fiddler', url:'http://www.fiddler2.com/fiddler2/'},
						{name:'BitBucket', url:'https://bitbucket.org/'},
						{
							name: '系统软件',
							children:[
								{name:'驱动精灵', url:'http://www.drivergenius.com'},
								{name:'DiskGenius', url:'http://www.diskgenius.cn/'}
							]
						},
						{
							name: '版本管理',
							children:[
								{name:'Git', url:'http://msysgit.github.com/'},
								{name:'Github', url:'http://windows.github.com/'},
								{name:'TortoiseSVN', url:'http://tortoisesvn.net/'},
								{name:'Win32SVN', url:'http://subversion.apache.org/packages.html#windows'}
							]
						}
					]
				},
				//}}}
				//Tools{{{
				{
					name: '小工具',
					children:[
						{name:'Emmet', url:'http://docs.emmet.io/'},
						{name:'Less', url:'https://github.com/groenewege/vim-less', target:'_blank'},
						{name:'Vim Zencoding', url:'https://github.com/mattn/zencoding-vim', target:'_blank'},
						// {name:'Linr', url:'http://hi.baidu.com/vickeychen'},
						{name:'HTML5轮廓工具', url:'http://gsnedders.html5.org/'},
						{name:'Trello', url:'https://trello.com'},
						{name:'ProcessOn', url:'https://www.processon.com/'},
						{name:'马克飞象', url:'https://maxiang.io/'},
						{name:'Dexpot', url:'http://dexpot.de/'},
						{name:'有道笔记', url:'https://note.youdao.com'}
					]
				},
				//}}}
				//Tech{{{
				{
					name: 'Tech',
					children:[
						{name:'SinaAppEngine', url:'http://sae.sina.com.cn/'},
						{name:'MSDN', url:'http://msdn.microsoft.com/en-us/library/ms683218%28VS.85%29.aspx'},
						{name:'Google Developers', url:'https://developers.google.com/academy/apis/commerce/?hl=zh-cn', target:'_blank'},
						{name:'谷歌流量分析', url:'https://www.google.com/analytics/web/?hl=zh-CN', target:'_blank'},
						{name:'Java document', url:'http://docs.oracle.com/javase/6/docs/api/overview-summary.html'},
						{name:'Codeplex', url:'http://www.codeplex.com/'}
					]
				},
				//}}}
				//Search{{{
				{
					name: '搜索、百科与词典',
					children:[
						{name:'Baidu', url:'http://www.baidu.com'},
						{name:'SoSo', url:'http://www.soso.com'},
						{name:'Google', url:'https://www.google.com', target:'_blank'},
						{name:'Wikipedia', url:'http://www.wikipedia.org/'}
					]
				},
				//}}}
				//Video{{{
				{
					name: '视频',
					children:[
						{name:'优酷', url:'http://www.youku.com'},
						{name:'PPS', url:'http://www.pps.tv'},
						{name:'土豆', url:'http://www.tudou.com/'},
						{name:'网易视频', url:'http://v.163.com/'},
						{name:'迅雷视频', url:'http://www.xunlei.com/'},
						{name:'风云直播', url:'http://www.fengyunzhibo.com/'}
					]
				}
				//}}}
			]
		},
		//}}}
		//{{{JavaScript
		{
			name:'JavaScript',
			children:[
				{
					name: '应用',
					children: [
						{name: 'JQuery', url: 'http://jquery.com/'},
						{name: 'Underscore', url: 'https://github.com/documentcloud/underscore/'},
						{name: 'Backbone', url: 'https://github.com/documentcloud/backbone/'},
						{name: 'seajs', url: 'http://seajs.org/'},
						{name: 'WindJS', url: 'http://windjs.org/cn/'},
						{name: 'Impress', url: 'http://bartaz.github.io/impress.js/#/bored'},
						{name: 'MessengerJS', url: 'http://biqing.github.io/MessengerJS/'}
					]
				},
				{
					name: 'Share',
					children: [
						{name: 'Dron', url:'http://ucren.com/blog/'},
						{name: 'Franky', url: 'http://www.cnblogs.com/_franky'},
						{name: '司徒正美', url: 'http://www.cnblogs.com/rubylouvre'},
						{name: 'Gray Zhang', url: 'http://otakustay.com/'},
						{name: 'JKisJK', url: 'http://www.cnblogs.com/jkisjk'},
						{name: 'cloudgamer', url: 'http://www.cnblogs.com/cloudgamer/'}
					]
				}
			]
		},
		//}}}
		//{{{NodeJS
		{
			name:'NodeJS',
			children:[
				{
					name: '应用',
					children: [
						{name: 'Curl', url: 'https://github.com/cujojs/curl', target:"_blank"}
					]
				},
				{
					name: 'Share',
					children: [
						{name: 'NodeJS官网', url: 'http://nodejs.org/'}
					]
				}
			]
		},
		//}}}
		//{{{C&Cpp
		{
			name:'C&Cpp',
			children:[
				{
					name: 'Share',
					children: [
						{name: '一分C++文档', url: 'http://classfoo.com/'}
					]
				}
			]
		}
		//}}}
	];
});
/* vim: set fdm=marker : */
