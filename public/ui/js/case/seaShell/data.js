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
							name: '阿里巴巴',
							children:[
								{name:'淘宝FED', url:'http://taobaofed.org/'},
								{name:'一淘UX', url:'http://ux.etao.com/'},
								{name:'阿里中间件', url:'http://jm.taobao.org/'},
								{name:'阿里巴巴国际站UED', url:'http://www.aliued.com/'},
								{name:'阿里巴巴中文站UED', url:'http://www.aliued.cn/'}
							]
						},
						{
							name: '百度',
							children:[
								{name:'百度MUX', url:'http://mux.baidu.com/'},
								{name:'百度FEX', url:'http://fex.baidu.com/'},
								{name:'ecomfe', url:'http://ecomfe.github.io/'},
								{name:'百度UED', url:'http://ued.baidu.com/'}
							]
						},
						{name:'JDC', url:'http://jdc.jd.com/'},
						{name:'奇虎75Team', url:'http://www.75team.com/'},
						{name:'携程UED', url:'http://ued.ctrip.com/'},
						{name:'网易UEDC', url:'http://uedc.163.com/'},
						{name:'新浪UED', url:'http://ued.sina.com/'}
					]
				},
				//}}}
				//Blog{{{
				{
					name: '个人博客、社区',
					children:[
						{name:'博客园', url:'http://www.cnblogs.com/'},
						{name:'DIV', url:'http://div.io/'},
						{name:'掘金', url:'http://gold.xitu.io/welcome'},
						{name:'伯乐在线', url:'http://web.jobbole.com/'},
						{name:'众成翻译', url:'http://www.zcfy.cc/'},
						{name:'码农头条', url:'http://hao.caibaojian.com/'},
						{name:'Segmentfault news', url:'https://segmentfault.com/news'},
						{name:'awesomes', url:'https://www.awesomes.cn/'},
						{name:'Geek.CSDN', url:'http://geek.csdn.net/'},
						{name:'WEB骇客', url:'http://www.webhek.com/'},
						{name:'matrix67', url:'http://www.matrix67.com/'},
						{name:'阮一峰', url:'http://www.ruanyifeng.com/blog/', target:"_blank"},
						{name:'八度空间', url:'http://www.cnblogs.com/lateink/'},
						{name:'vamei', url:'http://www.cnblogs.com/vamei/'},
						{name:"ANLY", url:'http://blog.lmj.wiki/'},
						{name:"gaohaoyang", url:'https://gaohaoyang.github.io/'},
						{name:'reygreen1', url:'http://reygreen1.github.io/'},
						{name:'张鑫旭', url:'http://www.zhangxinxu.com'},
						{name:'coco1s', url:'http://www.cnblogs.com/coco1s'},
						{name:'w3cplus', url:'http://www.w3cplus.com/'},
						{name:'36kr', url:'http://www.36kr.com/'},
						{name:'welefen', url:'http://www.welefen.com/'},
						{name:'IBM-CN', url:'https://www.ibm.com/developerworks/cn/'},
						{name:'月光博客', url:'http://www.williamlong.info/'},
						{name:'前端观察', url:'http://www.qianduan.net/'},
						{name:'百度学院', url:'http://bit.baidu.com/'},
						{name:'Typeof', url:'http://typeof.net'},
						{name:'cloudgamer', url:'http://www.cnblogs.com/cloudgamer/'},
						{name:'ziyunfei', url:'http://www.cnblogs.com/ziyunfei/'},
						{name:'imququ', url:'https://imququ.com/'},
						{name:'hacker-scripts', url:'https://github.com/NARKOZ/hacker-scripts'},
						{name:'HTML580', url:'http://www.html580.com/'}
					]
				},
				//}}}
				//UI{{{
				{
					name: 'Web-UI',
					children:[
						{name:'javascript', url:'http://www.javascripting.com/'},
						{name:'Material', url:'http://www.material-ui.com/#/'},
						{name:'Pure', url:'https://github.com/yahoo/pure'},
						{name:'AntDesign', url:'https://ant.design/'},
						{name:'AntV', url:'http://antv.alipay.com/', target:'_blank'},
						{name:'G2', url:'https://g2.alipay.com/'},
						{name:'raphael', url:'http://dmitrybaranovskiy.github.io/raphael/reference.html'},
						{name:'ZRender', url:'http://ecomfe.github.io/zrender/'},
						{name:'KuteJS', url:'http://thednp.github.io/kute.js/css.html'},
						{name:'Fit', url:'http://fit.baidu.com/components/pc/menu'},
						{name:'CSSPIN', url:'https://github.com/webkul/csspin'},
						{name:'qunee', url:'http://qunee.com/'},
						{name:'mobx', url:'https://mobxjs.github.io/mobx/index.html'},
						{name:'SUI', url:'http://m.sui.taobao.org/'},
						{name:'LayUI', url:'http://www.layui.com/'},
						{name:'React-web', url:'https://github.com/taobaofed/react-web'},
						{name:'Polymer', url:'https://github.com/Polymer/polymer'},
						{name:'Dragula', url:'https://github.com/bevacqua/dragula'},
						{name:'zi-han', url:'http://www.zi-han.net/'},
						{name:'AdminLTE', url:'https://github.com/almasaeed2010/AdminLTE'},
						{name:'FitVidsJS', url:'http://fitvidsjs.com/'},
						{name:'Kendo-UI', url:'http://www.telerik.com/kendo-ui'},
						{name:'HT', url:'http://www.hightopo.com/demos/index.html'}
					]
				},
				//}}}
				//Standard&Tools{{{
				{
					name: '协议、文档、标准',
					children:[
						{name:'CSS Reference', url:'http://cssreference.io/'},
						{name:'ES6', url:'http://es6.ruanyifeng.com/'},
						{name:'VUE cheatsheet', url:'https://vuejs-tips.github.io/cheatsheet/'},
						{name:'VUE SSR', url:'https://ssr.vuejs.org/en/'},
						{name:'svgjs', url:'http://svgjs.com/'},
						{name:'MathJS', url:'http://mathjs.org/'},
						{name:'w3help', url:'http://www.w3help.org/'},
						{name:'awesome', url:'https://github.com/lnishan/awesome-competitive-programming'},
						{name:'GraphQL', url:'https://github.com/chentsulin/awesome-graphql'},
						{name:'PostCSS', url:'http://postcss.org/'},
						{name:'Rrontend Directory', url:'https://frontend.directory/p'},
						{name:'webpack2中文文档', url:'http://www.css88.com/doc/webpack2/'},
						{name:'cssTriggers', url:'https://csstriggers.com/'},
						{name:'Docsify', url:'https://docsify.js.org/#/'},
						{name:'JS标准参考中文', url:'http://javascript.ruanyifeng.com/'},
						{name:'csstriggers', url:'https://csstriggers.com/'},
						{name:'es2017', url:'https://frontendmasters.gitbooks.io/front-end-handbook-2017/content/'},
						{name:'CSharp', url:'https://www.microsoft.com/net/tutorials/csharp/getting-started'},
						{name:'CSharp Video', url:'https://mva.microsoft.com/en-us/training-courses/c-fundamentals-for-absolute-beginners-16169?l=Lvld4EQIC_2706218949'},
						{name:'es6-es7', url:'http://exploringjs.com/es2016-es2017/index.html'},
						{name:'Google API Design', url:'https://cloud.google.com/apis/design/'},
						{name:'grid-flex', url:'http://www.xingbofeng.com/css-grid-flex/'},
						{name:'IETransformsTranslator', url:'http://www.useragentman.com/IETransformsTranslator/'},
						{name:'Swift', url:'http://wiki.jikexueyuan.com/project/swift/'},
						{name:'hexo', url:'https://hexo.io/zh-cn/docs/'},
						{name:'JSON', url:'http://www.json.org/'},
						{name:'Git Magic', url:'http://www-cs-students.stanford.edu/~blynn/gitmagic/intl/zh_cn/ch09.html'},
						{name:'Git cmd', url:'https://shfshanyue.github.io/cheat-sheets/git'},
						{name:'egg', url:'https://eggjs.org/'},
						{name:'AlloyTouch', url:'http://alloyteam.github.io/AlloyTouch/index.html'},
						{name:'Gitmoji', url:'https://github.com/carloscuesta/gitmoji'},
						{name:'WXOpen', url:'https://mp.weixin.qq.com/'},
						{name:'小程序', url:'https://mp.weixin.qq.com/debug/wxadoc/dev/'}
					]
				},
				{
					name: '组织、工具、书籍',
					children:[
						{name:'DefinitelyTyped', url:'https://github.com/DefinitelyTyped/DefinitelyTyped'},
						{name:'TypeScript', url:'https://basarat.gitbooks.io/typescript/content/'},
						{name:'TypeScript入门教程', url:'https://ts.xcatliu.com/'},
						{name:'React Guide', url:'http://huziketang.com/books/react/'},
						{name:'Colors', url:'https://github.com/mrmrs/colors'},
						{name:'Know it all', url:'https://know-it-all.io/'},
						{name:'Shell Search', url:'https://jaywcjlove.github.io/linux-command/'},
						{name:'ituring', url:'http://www.ituring.com.cn/'},
						{name:'JavascripToo', url:'http://www.javascriptoo.com/'},
						{name:'HTML5Rock', url:'http://www.html5rocks.com/zh/resources'},
						{name:'Email-ToolBox', url:'http://email-toolbox.com/'},
						{name:'Programming-Books', url:'https://github.com/vhf/free-programming-books'},
						{name:'Javascript-Guide', url:'https://github.com/airbnb/javascript'},
						{name:'Front-End-Collect', url:'https://github.com/foru17/front-end-collect'},
						{name:'Google', url:'http://translate.google.cn/'},
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
						{name:'JSDom', url:'https://github.com/tmpvar/jsdom'},
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
						{name:'Sizzy', url:'http://sizzy.co/'},
						{name:'截图工具', url:'https://www.snipaste.com/index.html'},
						{name:'Less', url:'https://github.com/groenewege/vim-less', target:'_blank'},
						{name:'Vim Zencoding', url:'https://github.com/mattn/zencoding-vim', target:'_blank'},
						{name:'HTML5轮廓工具', url:'http://gsnedders.html5.org/'},
						{name:'Trello', url:'https://trello.com'},
						{name:'ProcessOn', url:'https://www.processon.com/'},
						{name:'马克飞象', url:'https://maxiang.io/'},
						{name:'Dexpot', url:'http://dexpot.de/'},
						{name:'有道笔记', url:'https://note.youdao.com'},
						{name:'百度浏览器', url:'http://tongji.baidu.com/data/browser'}
					]
				},
				//}}}
				//Tech{{{
				{
					name: 'Tech',
					children:[
						{name:'SinaAppEngine', url:'http://sae.sina.com.cn/'},
						{name:'MSDN', url:'http://msdn.microsoft.com/en-us/library/ms683218%28VS.85%29.aspx'},
						{name:'Google Developers', url:'https://developers.google.com/academy/apis/commerce/?hl=zh-cn'},
						{name:'Google Developers CN', url:'https://developers.google.cn/'},
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
						{name:'JQuery', url: 'http://jquery.com/'},
						{name:'Underscore', url: 'https://github.com/documentcloud/underscore/'},
						{name:'Backbone', url: 'https://github.com/documentcloud/backbone/'},
						{name:'iscroll', url:'http://iscrolljs.com/'},
						{name:'x-tag', url:'http://x-tag.github.io/overview'},
						{name:'SnapSVG', url:'http://snapsvg.io/'},
						{name:'JSDoc', url:'https://github.com/jsdoc3/jsdoc'},
						{name:'WindJS', url: 'http://windjs.org/cn/'},
						{name:'Impress', url: 'http://bartaz.github.io/impress.js/#/bored'},
						{name:'MessengerJS', url: 'http://biqing.github.io/MessengerJS/'}
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
						{name: 'NodeJS官网', url: 'http://nodejs.org/'},
						{name: 'npmjs', url: 'https://www.npmjs.com/'}
					]
				}
			]
		}
		//}}}
		//{{{C&Cpp
		// {
		// 	name:'C&Cpp',
		// 	children:[
		// 		{
		// 			name: 'Share',
		// 			children: [
		// 				{name: '一分C++文档', url: 'http://classfoo.com/'}
		// 			]
		// 		}
		// 	]
		// }
		//}}}
	];
});
/* vim: set fdm=marker : */
