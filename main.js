define(
  [
    'react',
    'plus',
    'titter',
    'login',
    'getScripts',
    'promise',
    'client',
    'jquery',
    'bootstrap',
    'showdown'
  ],
  function(React, plus, CreateTitter, Login, getScripts) {
/**  
 * This file provided by Facebook is for non-commercial testing and evaluation purposes only.  
 * Facebook reserves all rights not expressly granted.  
 *       
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN    
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION  
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  
 */      
  
var importUrl = 'http://wrio.s3-website-us-east-1.amazonaws.com/';
var cssUrl = 'http://webrunes.github.io/';
var theme = 'Default-WRIO-Theme';
//var themeImportUrl='https://raw.githubusercontent.com/webRunes/';
var themeImportUrl='http://webrunes.github.io/Default-WRIO-Theme/widget/';



var wrio = {};
wrio.storageKey = 'plusLdModel';
wrio.storageHubUrl = importUrl;
var $accordion = $('<ul class="nav navbar-nav" id="nav-accordion"></ul>');
var wrioNamespace = window.wrio || {};
var updatedStorageHtml=""; 
var storeageKeys=[];
var href =window.location.href; 
var is_list=false;
var is_airticlelist=false;
var is_hashUrl=false;
var is_cover=false;

 (function(){
     'use strict';
	 
	  $('body').on('click','#myoffcanvas',function() {
		 $('.row-offcanvas').toggleClass('active');
	     $('.row-offcanvas-menu').toggleClass('active');
	  });
	 
	 // for plus tab
	  $('body').on('click','.plusIcon',function() {
		  $('.active').removeClass('active');
		  $('.removeParent').removeClass('collapsed');
		  $('.parentNodeA').removeClass('collapsed');
		  $('.new').addClass('active');
		  defaultList();
	  });
	  // for plus tab
	  
	  
	  // right menu click
	   $('body').on('click','.listView',function() {
	      var url=$(this).attr('data-url');
          $('.listView').removeClass('active');
		  $(".listView").parent().removeClass("active");
	      $(this).addClass('active');
		  $(".active").parent().addClass("active");
		 getListJson(url);
      });
	  
	  $('body').on('click','.articleView',function() {
	      var url=$(this).attr('data-url');
          $(".listView").parent().removeClass("active");
		  $('.itemListWrp').css('display','none');
		  $("section").parent("article").css('display','block');
          $('#titter_frame_container').css('display','block');		  
		  
      });
	  // right menu click
	 
 var addBootstrapLink = function(){
         var link = document.createElement('link');
         link.rel = 'stylesheet';
         link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css';
         document.head.appendChild(link);

         link = document.createElement('link');
         link.rel = 'stylesheet';
         link.href = cssUrl + theme + '/css/webrunes.css';
         document.head.appendChild(link);

         link = document.createElement('link');
         link.rel = 'shortcut icon';
         link.href = cssUrl + theme + '/ico/favicon.ico';
         document.head.appendChild(link);
     };
	 addBootstrapLink();
 })();

var converter = new Showdown.converter();

var finalJson;
var finalJsonArray = [];
var finalListJsonArray = [];
var itemListArray = [];
var finalMenuJsonArray = [];

var getFinalJSON = function(json,hasPart){
	if(hasPart==undefined){
		hasPart = false;
	}
	$.each(json,function(i,item){	
		comment = this;
		var is_article = false;
		if(comment['@type']=='Article'){
			is_article = true;
			is_airticlelist=true;
		}
		
		
		// for menu
		if(comment['@type']=='Article'){
			  name=comment['name'];
			  url="";
			  rowMenu = {"name": name,"url":url,"class":"articleView"}
			  finalMenuJsonArray.push(rowMenu);	
		}else if(comment['@type']=='ItemList'){
		        if(comment['itemListElement']!=undefined){
				   for(var i=0;i < comment['itemListElement'].length;i++){
						 name= comment['itemListElement'][i].name;
						 url= comment['itemListElement'][i].url;
						 rowMenu = {"name": name,"url":url,"class":"listView"}
					     finalMenuJsonArray.push(rowMenu);	
					}
				}
		}
		//end menu array
		
		// for list
	    if(comment['itemListElement']!=undefined){
			is_list = true;
				for(var i=0;i < comment['itemListElement'].length;i++){
			     name= comment['itemListElement'][i].name;
				 author= comment['itemListElement'][i].author;
				 about= comment['itemListElement'][i].about;
				 url= comment['itemListElement'][i].url;
				 image= comment['itemListElement'][i].image;
		        rowList = {
					"name": name,
					"author": comment['name'],
					"about": about,
					"url": url,
					"image": image
				}
			  finalListJsonArray.push(rowList);	
			}
		}
		// for list
		

		var articlebody = comment['articleBody'];
		if(comment['articleBody']==undefined){
			articlebody = '';
		}
		var newArticle='';
		for(var i=0;i < articlebody.length;i++){
			if(i>0){
			}
			newArticle +=  '<p>' + articlebody[i]  + '</p>';
		}
		
		row = {
			"is_article": is_article,
			"articlename": comment['name'],
			"articleBody": newArticle,
			"url": '',//comment['url']
			"hasPart": hasPart
		}
		finalJsonArray.push(row);
		//console.log((finalJsonArray).length);
		if(comment.hasPart!=undefined){
			if((comment.hasPart).length > 0){
				hasParts = comment.hasPart;	
				getFinalJSON(hasParts,true);
			}
		}
	});
	return finalJsonArray;
}

var CreateDomLeft = React.createClass({displayName: "CreateDomLeft",
  render: function() {    
    return (
      React.createElement("div", {className: "col-xs-12 col-sm-3 col-md-2"}, React.createElement("div", {className: "navbar navbar-inverse main navbar-fixed-top row-offcanvas-menu"}, React.createElement("div", {className: "navbar-header tooltip-demo", id: "topMenu"}, React.createElement("ul", {className: "nav menu pull-right"}, React.createElement("li", {title: "", "data-placement": "bottom", "data-toggle": "tooltip", "data-original-title": "Call IA"}, React.createElement("a", {className: "btn btn-link btn-sm", href: "#"}, React.createElement("span", {className: "glyphicon glyphicon-comment"}))), React.createElement("li", {title: "", "data-placement": "bottom", "data-toggle": "tooltip", "data-original-title": "Logout"}, React.createElement("a", {className: "btn btn-link btn-sm", href: "#"}, React.createElement("span", {className: "glyphicon glyphicon-lock"}))), React.createElement("li", {title: "", "data-placement": "bottom", "data-toggle": "tooltip", "data-original-title": "Full screen"}, React.createElement("a", {className: "btn btn-link btn-sm", href: "#"}, React.createElement("span", {className: "glyphicon glyphicon-fullscreen"}))), React.createElement("li", {title: "", "data-placement": "bottom", "data-toggle": "tooltip", "data-original-title": "Open/close menu"}, React.createElement("a", {"data-target": ".navbar-collapse", "data-toggle": "collapse", className: "btn btn-link btn-sm visible-xs collapsed", href: "#"}, React.createElement("span", {className: "glyphicon glyphicon-align-justify"}))), React.createElement("li", {title: "", "data-placement": "bottom", "data-toggle": "tooltip", "data-original-title": "Show/hide the sidebar"}, React.createElement("a", {"data-toggle": "offcanvas", id: "myoffcanvas", className: "btn btn-link btn-sm visible-xs", href: "#"}, React.createElement("span", {className: "glyphicon glyphicon-transfer"})))), React.createElement("a", {title: "", "data-placement": "right", "data-toggle": "tooltip", className: "navbar-brand", href: "webrunes-contact.htm", "data-original-title": "Contact us"}, " ")), React.createElement("div", {className: "navbar-collapse in"}, React.createElement("div", {className: "navbar-header", id: "leftMenuwrp"}, React.createElement(CreateLeftCommentMenus, null)))))
    );
  }
});

var CreateLeftCommentMenus = React.createClass({displayName: "CreateLeftCommentMenus",
  loadCommentsFromServer: function() {
    
	
	     var reactObj = this;
		 
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
      // for plus tab
     // var url = importUrl + 'Default-WRIO-Theme/widget/defaultList.htm';
	  var url= themeImportUrl + 'defaultList.htm';
	  
      var jsonItemArray = [];
	  $.get(url, function(result){
        jQuery('<div/>', {
        id: 'foo',
        css:{
          display:'none'
        },
        html: result
      }).appendTo('body');
           //defaultPlusList=$('script#defaultPlusList').html();
		   defaultPlusList=$("#foo [type^='application/ld+json']" ).html();
		   $('#foo').remove();
	       defaultPlusListJson = JSON.parse(defaultPlusList);	  
		   plusItemList=defaultPlusListJson.itemListElement;
	       localStorage.setItem("plusTabItem", JSON.stringify( plusItemList ));  //set plus tab item
	  }); // for plus tab
  
     plus.updatePlusStorage(); 
	 this.loadCommentsFromServer();
  },
  render: function() {
    return (  	
			React.createElement(CreateLeftItemMenu, {data: this.state.data})		
    );
  }           
}); 

var CreateLeftItemMenu = React.createClass({displayName: "CreateLeftItemMenu",
  render: function(data) {
      var rawMarkup = converter.makeHtml(this.props.data.toString());
	  return (    
		React.createElement("section", {dangerouslySetInnerHTML: {__html: rawMarkup}})
    );
  }
}); 


var CreateDomRight = React.createClass({displayName: "CreateDomRight",
  render: function() {
    return (
      React.createElement("div", {className: "col-xs-6 col-sm-4 col-md-3 sidebar-offcanvas", id: "sidebar"}, 
      React.createElement("div", {className: "sidebar-margin"}, React.createElement(CreateArticleMenus, null)))
    );
  }
});

// for right menu
var CreateArticleMenus = React.createClass({displayName: "CreateArticleMenus",
  loadCommentsFromServer: function() {
	if(is_airticlelist==false){
	    this.setState({data: []});
		getListJson(href); 
	}else{
	   this.setState({data: finalMenuJsonArray});
    }
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  render: function() {
    return (
            React.createElement(CreateArticleItemMenu, {data: this.state.data})
    );
  }
});


var CreateArticleItemMenu = React.createClass({displayName: "CreateArticleItemMenu",
  render: function() {
	   var commentItemMenus = this.props.data.map(function(comment, index) {
       var commentMenustring = comment.name.replace(/\s/g, '_');
       var href = comment.url ? comment.url : '#' + commentMenustring;
	   var listURl = '#' + commentMenustring;
	   var menuClass =comment.class;
	  
		  return (
				  React.createElement("li", {key: index}, React.createElement("a", {href: listURl, className: menuClass, "data-url": href}, comment.name))  
		  );
	  });        
	  
	  return (    
      	React.createElement("ul", {className: "nav nav-pills nav-stacked"}, 
        commentItemMenus
        )
    );
  }
});

// for right menu

var CreateCommentMenus = React.createClass({displayName: "CreateCommentMenus",
  loadCommentsFromServer: function() {
	this.setState({data: finalJson});
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  render: function() {
    return (
            React.createElement(CreateItemMenu, {data: this.state.data})
    );
  }
});

var CreateItemMenu = React.createClass({displayName: "CreateItemMenu",
  render: function() {
	  var commentMenus = this.props.data.map(function(comment, index) {
      var commentMenustring = comment.articlename.replace(/\s/g, '_');
      var href = comment.url ? comment.url : '#' + commentMenustring;
		  return (
				  React.createElement("li", {key: index}, React.createElement("a", {href: href}, comment.articlename))   
		  );
	  });        
	  
	  return (    
      	React.createElement("ul", {className: "nav nav-pills nav-stacked"}, 
        commentMenus
        )
    );
  }
});


var CreateDomCenter = React.createClass({displayName: "CreateDomCenter",
  render: function() {
    return (
      React.createElement("div", {className: "content col-xs-12 col-sm-5 col-md-7", id: "centerWrp"}, 
        React.createElement("div", {className: "margin"}, 
          React.createElement(Login, {importUrl: importUrl, theme: theme}), 
          React.createElement(CreateItemList, null), 
          React.createElement(CreateArticleList, {url: "comments.json"}), 
          React.createElement(CreateTitter, {scripts: window.complete_script})
        )
      )
    );
  }
});

// for list
var CreateItemList = React.createClass({displayName: "CreateItemList",
  loadCommentsFromServer: function() {
	
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
   // for list tab
    if(is_list==true){
	   localStorage.setItem("myListItem", JSON.stringify(finalListJsonArray ));  //set plus tab item
	  // getlist();
	}
	// for list tab
	this.loadCommentsFromServer();
  },
  render: function() {
    return (  
            React.createElement(CreateList, {data: this.state.data})
   );
  }
});

var CreateList = React.createClass({displayName: "CreateList",
  render: function() {
      var rawMarkup = converter.makeHtml(this.props.data.toString());
	  if(rawMarkup=="") return false;
      return (        		        
		React.createElement("section", {dangerouslySetInnerHTML: {__html: rawMarkup}})
      );
  }
});
// for list


var Main = React.createClass({displayName: "Main",
  render: function() {
    window.complete_script = getScripts();
    finalJson = getFinalJSON(complete_script);
    checkUrl(); // for check # url 
    return (
      React.createElement("div", {id: "content", className: "container-liquid"}, 
      React.createElement("div", {className: "row row-offcanvas row-offcanvas-right"}, 
	  React.createElement(CreateDomLeft, null), 
      React.createElement(CreateDomCenter, null), 
      React.createElement(CreateDomRight, null)
      )
      )
    );
  }
});

var CreateArticleList = React.createClass({displayName: "CreateArticleList",
  loadCommentsFromServer: function() {
	this.setState({data: finalJson});
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  render: function() {
    return (
    	React.createElement(CreateArticle, {data: this.state.data})
    );
  }
});

var printJson = function(json){
	 var commentNodes = json.map(function(comment, index) {
		if(comment.is_article==false) return false;
      return (
        React.createElement(CreatArticleEl, {articlename: comment.articlename, key: index, hasPart: comment.hasPart}, 
          comment.articleBody
        )
      );
    });
	
    return (
      	React.createElement("article", null, 
        commentNodes
        )
    );
}

var CreateArticle = React.createClass({displayName: "CreateArticle",
  render: function() {
	return printJson(this.props.data);
  }
});

var CreatArticleEl = React.createClass({displayName: "CreatArticleEl",
  loadArticleFromServer: function(title,children,hasPart,rawMarkup) {
	var url = 'https://webrunes.github.io/' + theme + '/widget/article.htm';	// Article Path  
  var CreatArticleID = title.replace(/\s/g, '_'); // Article ID
  $.ajax({
      url: url,
      dataType: 'html',
     // data: { haspart : title },
      success: function(data) {
     //alert(data);
		 if(hasPart==true){
				if(rawMarkup==""){
						var html='<h2 id="{this.props.articleid}">{this.props.articlename}</h2>';
				}else{
						var html=data.replace('<header class="col-xs-12"><h1 id="{this.props.articleid}">{this.props.articlename}</h1></header>','<h2 id={this.props.articleid}>{this.props.articlename}</h2>');
				}
		  }else{
				var html=data;
		  }
		  var res = html.replace(/{this.props.articlename}/g,title);
      res = res.replace(/{this.props.articleid}/g,CreatArticleID);
		   res = res.replace("{description}",children);
		   res = res.replace(/<p>/g,'<div class="paragraph"><div class="col-xs-12 col-md-6"><p itemprop="description">');
		   res = res.replace(/p>/g,'</p></div><div class="col-xs-12 col-md-6"><aside><span class="glyphicon glyphicon-comment" data-toggle="tooltip" data-placement="right" title="Not yet available"></span></aside></div></div>');
		   this.setState({data: res});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
	  var rawMarkup = converter.makeHtml(this.props.children.toString());
    this.loadArticleFromServer(this.props.articlename,this.props.children,this.props.hasPart,rawMarkup);
  },
  render: function() {
     return data =  React.createElement("section", {dangerouslySetInnerHTML: {__html: this.state.data}}
     );
  }
});


var Comment = React.createClass({displayName: "Comment",
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("h2", {className: "commentAuthor"}, 
          this.props.author
        ), 
        React.createElement("span", {dangerouslySetInnerHTML: {__html: rawMarkup}})
      )
    );
  }
});

var CommentBox = React.createClass({displayName: "CommentBox",
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comments.push(comment);
    this.setState({data: comments}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: comment,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      React.createElement("div", {className: "commentBox"}, 
        React.createElement("h1", null, "Comments"), 
        React.createElement(CommentList, {data: this.state.data}), 
        React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
      )
    );
  }
});

var CommentList = React.createClass({displayName: "CommentList",
  render: function() {
    var commentNodes = this.props.data.map(function(comment, index) {
      return (
        React.createElement(Comment, {author: comment.author, key: index}, 
          comment.text
        )
      );
    });
    return (
      React.createElement("div", {className: "commentList"}, 
        commentNodes
      )
    );
  }
});

var CommentForm = React.createClass({displayName: "CommentForm",
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
  },
  render: function() {
    return (
      React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", placeholder: "Your name", ref: "author"}), 
        React.createElement("input", {type: "text", placeholder: "Say something...", ref: "text"}), 
        React.createElement("input", {type: "submit", value: "Post"})
      )
    );
  }
});


// get default List on click of plus tab
function defaultList(){
     plusArray= JSON.parse(localStorage.getItem('plusTabItem'));
      //var url = importUrl + 'Default-WRIO-Theme/widget/itemList.htm';
	  
	  var url= themeImportUrl + 'itemList.htm';
	  
		
	if ( !$('.plusActive').hasClass('plusList')) {  // for check default list available or not
   	 $.ajax({
			   url: url,
			   dataType: 'html',
			   success: function(data) {
			   var tHtml="";  
		   	   if(plusArray!=undefined){ 
					for(var i=0; i< plusArray.length; i++){
					   var plusHtml = data.replace("{title}", plusArray[i].name);
						 plusHtml = plusHtml.replace("{sub_title}",plusArray[i].name);
						 plusHtml = plusHtml.replace("{about}",plusArray[i].about);
						 plusHtml = plusHtml.replace("{image}", plusArray[i].image);
						 plusHtml = plusHtml.replace("{url}", plusArray[i].url);
						 
						 plusHtml = plusHtml.replace("{created_date}","22 Jun 2013");
						 plusHtml = plusHtml.replace("{rating}", "244");
						 plusHtml = plusHtml.replace("{readers}", "1,634");
						 plusHtml = plusHtml.replace("{access}", "Free");
						 tHtml=tHtml+plusHtml ;
					}
		    	 }
				 $('#centerWrp').html(tHtml);
				 $('#plusWrp').addClass('plusActive');
				}
		 });
		 	
	 } // if end 
 }  // for plus tab
 
 
 // for list
function getListJson(listurl){

       var url=listurl;
	   if(url.indexOf("?cover") != -1){
	    	is_cover=true;
	   }
	   var jsonItemArray = [];
	  $.get(url, function(result){
	         var rHtml = result.replace('<script type="text/javascript" src="http://wrio.s3-website-us-east-1.amazonaws.com/WRIO-InternetOS/WRIO.js"></script>', '');
	   
	   jQuery('<div/>', {
        id: 'foo1',
        css:{
          display:'none'
        },
        html: rHtml
      }).appendTo('body');
           defaultPlusList=$("#foo1 [type^='application/ld+json']" ).html();
		   $('#foo1').remove();
	       defaultPlusListJson = JSON.parse(defaultPlusList);	  
		   itemListArray=defaultPlusListJson.itemListElement;
		   getlist(itemListArray);
		   
		   if(is_list==true){
		    //  var htmlList=getlist();
		   }
	  });	
}
 
 
// get List  for list 
function getlist(itemListArray){
      
	            var url = themeImportUrl + 'itemList.htm'; 
				var coverHtml='<div class="{status}"><div style="background: url({contentUrl}) center center" class="img"></div><div class="carousel-caption"><div class="carousel-text"><h2>{name}</h2><ul class="features">{text}</ul></div></div></div>';
			   var contentdiv='<li><span class="glyphicon glyphicon-ok"></span>{content}</li>';					
			   var coverHeader='<ul class="breadcrumb"><li class="active">Cover</li></ul><div data-ride="carousel" class="carousel slide" id="cover-carousel"><div class="carousel-inner">';
			   var coverFooter='</div><a data-slide="prev" href="#cover-carousel" class="left carousel-control"><span class="glyphicon glyphicon-chevron-left"></span></a><a data-slide="next" href="#cover-carousel" class="right carousel-control"><span class="glyphicon glyphicon-chevron-right"></span></a></div>';
	  
	  $.ajax({
			   url: url,
			   dataType: 'html',
			   success: function(data) {
			   var tHtml="";  
		   	   if(itemListArray!="" && itemListArray!=undefined){ 
					for(var i=0; i< itemListArray.length; i++){
					      if(is_cover!=true){
							 var listHtml = data.replace("{title}", itemListArray[i].name);
							 listHtml = listHtml.replace("{sub_title}",itemListArray[i].name);
							 listHtml = listHtml.replace("{about}",itemListArray[i].about);
							// listHtml = listHtml.replace("{image}", itemListArray[i].image);
							
							 listHtml = listHtml.replace("{image}","http://wrio.s3-website-us-east-1.amazonaws.com/Default-WRIO-Theme/img/no-photo-200x200.png");
							 listHtml = listHtml.replace("{url}", itemListArray[i].url);
							 
							 listHtml = listHtml.replace("{created_date}","22 Jun 2013");
							 listHtml = listHtml.replace("{rating}", "244");
							 listHtml = listHtml.replace("{readers}", "1,634");
							 listHtml = listHtml.replace("{access}", "Free");
							 tHtml=tHtml+listHtml ;
						
						 }else{  // for cover structure
						      
								 var listHtml = coverHtml.replace("{name}", itemListArray[i].name);
								 var text=""; 
								 if(itemListArray[i].text != undefined){
									
									 for(var j=0; j< itemListArray[i].text.length; j++){
										  li=itemListArray[i].text[j];
										  var allcont = contentdiv.replace("{content}",li);          
										  text=text + allcont; 
									 }	
									 
								 }
									
		                    
			                 listHtml = listHtml.replace("{contentUrl}",itemListArray[i].contentUrl);
							  listHtml = listHtml.replace("{text}",text);	

							   if(i==0){
							     listHtml = listHtml.replace("{status}",'item active');	
							   }else{
							      listHtml = listHtml.replace("{status}",'item');
							   }
							   tHtml=tHtml+listHtml;	
								
						  }
					}
		    	 }
				 
				if(is_cover==true){
				    tHtml=coverHeader+tHtml+coverFooter;
				    is_cover=false;
				}
				 
				    is_append=false;
				    if(tHtml!="") {  
					$('.itemListWrp').css('display','block');
					   if($(".itemListWrp").length==0){
					      tHtml='<div class="itemListWrp">'+tHtml+'</div>';
					      is_append=true;
					   }
					   
					   if(is_airticlelist==false){
					      $("section").parent("article").css('display','block');
                          $('#titter_frame_container').css('display','block');
						}else{
					       $("section").parent("article").css('display','none');
                           $('#titter_frame_container').css('display','none');
					   }
					}
					
				  if($(".paragraph").length==0){ 
					      if(is_append==true){
						    $('#centerWrp').append(tHtml);
						    $('#titter_frame_container').remove();
							$('#titter-id').remove();
			         	    $('#titter-template').remove();
						  }else{
						    $('.itemListWrp').html(tHtml);
						    $('#titter_frame_container').remove();
							$('#titter-id').remove();
			         	    $('#titter-template').remove();
						  }	
				  }else{
				          if(is_append==true){
						       $('#centerWrp').append(tHtml);
						  }else{
						       $('.itemListWrp').html(tHtml);
						  }	 
				  }                                       
				  
				}
		 });
 }
 // for list  


// function for check url
function checkUrl(){
     if(href!= undefined ){
       href = href.replace('index.html', '');  // for remove index.html
       href = href.replace('index.htm', '');  // for remove index.htm
     }
	 if(href!= undefined && href.substr(-1) == '/') {
		href  = href.substring(0,href.length - 1);   // for remove "/" from string "30-04-15"
	 }
       //console.log(finalMenuJsonArray);
	  
     // for remove # from url
     hashName='';
	 if(href.indexOf("#") != -1){
	   var hrefArray = href.split("#"); 
	   url=hrefArray['0']?hrefArray['0']:'';
	   hashName=hrefArray['1']?hrefArray['1']:'';
       is_hashUrl=true;
	}
	   hashUrl="";
	   for (i=0;i<finalMenuJsonArray.length;i++){
	              if(finalMenuJsonArray[i].name==hashName){
				      hashUrl=finalMenuJsonArray[i].url;
				     getListJson(hashUrl); 
				  }     
	   }  
	   	  
}
// end fn


  return React.createFactory(Main);
});
