define(['oxjs'],function(OXJS){

	
	return {
		init:function($mod){
			var currentIndex=0,
			TO,
			win=$(window).on('scroll',function() {
				TO && clearTimeout(TO);
				TO=setTimeout(function(){
					if(document.body.scrollHeight - win.height() -win.scrollTop() < 200){
						//console.log('got')
						$mod.OXRefresh({ 
							"lbs-products":{
								pageIndex: ++currentIndex
							}
						})
					}
				},200)
				
			})			
		}
	}
})
