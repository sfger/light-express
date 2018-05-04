<%
var list = [
	{'name':'CSS'       , 'url':'#/css'},
	{'name':'UI'        , 'url':'#/ui'},
	{'name':'Article'   , 'url':'#/article'},
	{'name':'Books'     , 'url':'#/books'},
	{'name':'View Book' , 'url':'#/books/view/1'},
	{'name':'Link'      , 'url':'./ui/html/demos/complex/seaShell.html'}
];
%>
<div class="imgc home-page">
	<div class="imge navi-box">
		<h1>Share From Water</h1>
		<% list.forEach(function(one){ %>
		<a href="<%= one['url'] %>"><%= one['name'] %>&#187;</a>
		<% }); %>
	</div>
	<!--[if lt IE 8]><p class="iecp"></p><![endif]-->
</div>
