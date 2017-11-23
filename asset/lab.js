define(['zepto'],function(){

    var namespaceURI='http://www.w3.org/1999/XSL/Transform';
	 /****
    <!-- Start
        异步刷新模块
        2017.11.21
     **/
    var createSingleModXSL=function(modPath,calltemp){
        return '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:template match="/root"><div>uii</div>'+calltemp+'</xsl:template></xsl:stylesheet>'
    };
    var xpath2args=function(xpath_str){
        var match=xpath_str.match(/\[([^\[\]]*)\]/);
        var args={};
        if(match){
            var attrs=match[1],
            splt=attrs.split(' and ');
            for(var j=0;j<splt.length;j++){
                var spl=splt[j].split('=');
                args[spl[0].substr(1)]=spl[1].replace(/[\'\"]/g,'')
            }
        }
        return args;
    }

    //var namespaceURI='http://www.w3.org/1999/XSL/Transform';
    var xslt=function(xml,xsl){//
        if(document.implementation && document.implementation.createDocument){
            var xsltProcessor=new XSLTProcessor();
            xsltProcessor.importStylesheet(xsl);
            return xsltProcessor.transformToFragment(xml,document);
        }else{
            //console.log('error')
            return '';
        }
    };

    $.fn.OXRenderData2=function(new_args,fn){//alert(3)
        var $mod=this.closest('.J_OXMod'),
            modIndex=$mod.index(),
            mname=$mod.attr('ox-mod'),
            local_env=true;//'local' == g_env;
        var mainxsl_url=local_env?'demo.xsl':'/oxp/'+document.body.getAttribute('mainxsl')+'.xsl',
            mod_xsl_url=local_env?'mod.xsl':'/oxm/'+ mname +'/_.xsl',
            layout_tagname=local_env?'div':'layout',//后面要统一demo和线上
            loadXML=function(url,fn){
            	$.ajax({
		            url:url,
		            dataType:'xml',
		            success:fn
        		})
            };
            loadXML(mainxsl_url,function(main_xsl){
                //alert(4)
                var layout=main_xsl.getElementsByTagName(layout_tagname)[0],
                    els=layout.getElementsByTagNameNS(namespaceURI,'call-template'),
                    calltemp=els && els[modIndex],
                    paramEls=calltemp && calltemp.getElementsByTagNameNS(namespaceURI,'with-param'),
                    args={};
                if(paramEls && paramEls.length){
                    /**
<xsl:with-param name="dsid">e0ee59439b39fcc3</xsl:with-param>
<xsl:with-param name="forward">ec-product-edit</xsl:with-param>
<xsl:with-param name="_product-list" select="data/product-list[@ADAPTERID='159a8cdb2fb83a629aafb1021' and @test='123']"/>
                    */
                    for(var i=0,pEl; pEl =paramEls[i++];){
                        var select=pEl.getAttribute('select'),
                        text=pEl.textContent,
                        name=pEl.getAttribute('name');
                        if(name.indexOf('_')==0){//只取接口相关的参数，模块参数不管
                            //[NOTICE]这里的前提是一个模块不能依赖多个相同的xsd
                            var ds_name=name.substr(1);
                            var arg=xpath2args(select);

                            //这里就不必区分参数是模块(2)还是querystring(1)了
                            args[ds_name]=$.extend(arg,new_args && new_args[ds_name]);
                            

                            pEl.setAttribute('select','data/'+ ds_name)
                        }
                    }
                };
                var xslDoc// = (new DOMParser()).parseFromString(createSingleModXSL(mod_xsl_url,calltemp && calltemp.outerHTML), "text/xml");
                loadXML(mod_xsl_url,function(modxsl){
                	var calltempNode=(new DOMParser()).parseFromString('<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:template match="/root">'+(calltemp && calltemp.outerHTML)+'</xsl:template></xsl:stylesheet>', "text/xml");
                	modxsl.documentElement.appendChild(calltempNode.documentElement.firstChild);
                	//console.log(1);
                	//debugger
                	//<xsl:template match="/root"><div>uii</div>'+calltemp+'</xsl:template>
                	xslDoc=modxsl;

                })

                //console.log(createSingleModXSL(mod_xsl_url,calltemp && calltemp.outerHTML))

                
                
                $.ajax({
                    url:location.href,
                    dataType:'xml',
                    //data:{args:JSON.stringify(args)},
                    headers:$.extend(
                        $.ajaxSettings.headers,{
                            'OX-REFRESH-DATA':JSON.stringify(args)
                        }
                    ),
                    success:function(xmlDoc){
                        //alert(xslDoc.documentElement.innerHTML)
                        if(xslDoc  && xmlDoc){
                            var doc_frag=xslt(xmlDoc,xslDoc);
                            //alert('doc_frag'+(typeof doc_frag))
                            fn && fn(doc_frag)
                        }else{
                            fn()
                        }
                        //cb();
                    }
                });
                

            }
        );
     
        
    
        return this
    };

    $.fn.OXRefresh=function(param,fn) {
        
        var ATTR='ox-refresh',
        selector='['+ATTR+']',
        refresh='html',
        target=$(selector,this);
        if(target.length){
            refresh=target.attr(ATTR);
        }else{
            selector='div.J_OXMod';
            target=this;
            refresh='html';
        }//

        this.OXRenderData2(param,function (doc_frag) {//console.log('1',doc_frag)
            if(!doc_frag){
                return;
            }

            var new_tar=$(selector,doc_frag)//(selector?$(selector,doc_frag):$(doc_frag));
            //console.log(2)
            var new_el=doc_frag.querySelector('div');
            for(var k in doc_frag){
            	//if(doc_frag[k])
            	//alert(k)
            }
            
            if(refresh=='append'){
                new_tar.children().appendTo(target);
            }else{
                target.html(new_tar.html())
            }
            

        })
    }
     /**
     * 异步刷新模块
     * END ->
     * */

 })
