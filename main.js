//function onButtonClick() {
//var kehaiquote = $("#input").val();
//console.log(kehaiquote);
//}


var kehaiquote  = "6501/T";
  $("#button").click(function(){
      var kehaiquote = $("#input").val();
      console.log(kehaiquote);
      
      var parameters =  $.param({
        F: "ja_stk_dtl_qtn",
        // callback: "kehai", // callback関数
        quote: kehaiquote,
         });
  
    //気配取得APIリクエストURL
      var kehai_url = apiurl + parameters; 
        console.log(kehai_url);
    //APIコール    
   get_kehai= $.ajax({
         url: kehai_url,
         type:'GET',
         dataType:'json'
      })
                          // Ajaxリクエストが成功した時発動 $.ajaxはデフォルトでPromisfieng 
       //.then(kijuntiriquest(kehaiquote))
   
    var parameters2 =  $.param({
        F: "ja_stk_dtl_prc",
        // callback: "kehai", // callback関数
        quote: kehaiquote,
         });
  
    //価格取得APIリクエストURL
      var kijunti_url = apiurl + parameters2; 
        console.log(kijunti_url);
    //APIコール    
    get_kijunti= $.ajax({
         url: kijunti_url,
         type:'GET',
         dataType:'json'
      })
      //2つのAjaxのリクエストが終わったら実行する
         $.when(get_kehai, get_kijunti).done(function (kehai_result, kijunti_result) {
                        // console.log(kehai_result[0]) 
                          var cputime =kehai_result[0].cputime;
                          console.log("cputime:"+cputime);
                            $(".kehaiquote").html("<p>" +kehaiquote+ "</p>");
                            $("#main").html("<div>処理時間 "+cputime+"</div>");
                            kehaihyouji(kehai_result[0],kijunti_result[0],kehaiquote);
                    })
                    // Ajaxリクエストが失敗した時発動
        .fail( (data) => {
                        alert("データ取得でエラーが発生しました。");
                        console.log(data);
                        console.log("a");
                        
                    })
                    // Ajaxリクエストが成功・失敗どちらでも発動
        .always( (data) => {
                    });
  
  });   
 

  //気配表示　dataは気配APIの戻り値  data2は価格APIの戻り値 kehaiquoteはユーザーの入力値
  function kehaihyouji(data,data2,kehaiquote) {
    $(".canvas").html("");
      if (data.section1.hitcount == 1){
    var width = 420; // グラフの幅
    var height = 600; // グラフの高さ
    
    //気配データの配列を用意
    var kehai=data.section1.data[kehaiquote];
       for (var key in kehai){
         kehai[key]=kehai[key].replace(/,/g, "");// コンマを取る
         kehai[key]=parseFloat(kehai[key]);//Number型へ変換(小数点を含むためParseIntでなくParseFloat)
         if( isNaN( kehai[key] ) ) {
            kehai[key]="";
        //ストップ高・ストップ安銘柄はNaNで値が返却されるため、""に
      }}
   //基準値データを用意
    var kijunti = data2.section1.data[kehaiquote].DSP;
    kijunti =kijunti.replace(/,/g, "");
    kijunti =parseFloat(kijunti);
      if( isNaN( kijunti) ) {
            kijunti="";
        //NaNで値が返却されるときは""に
      }
      
     console.log(kijunti);  
  
    var kaikehai=[];
    var urikehai=[];
    var kaikakaku=[];
    var urikakaku=[];
    console.log(kehai);
      for(var i=1;i<11;i++){
        kaikehai["GBV"+i]=kehai["GBV"+i]; 
        kaikakaku["GBP"+i]=kehai["GBP"+i]
        urikakaku["GAP"+i]=kehai["GAP"+i]
        urikehai["GAV"+i]=kehai["GAV"+i]
      };
      var kakaku=$.extend({},kaikakaku,urikakaku);
      var mkehai=$.extend({},kaikehai,urikehai);
      console.log(kehai);
      console.log(kaikehai);
      console.log(kaikakaku);
      console.log(urikehai);
      console.log(urikakaku);
      console.log(mkehai);
      console.log(kakaku);

    var oukehai =[];
        oukehai["QOV"]=kehai["QOV"];
        oukehai["QUV"]=kehai["QUV"];
    var nariyukikehai=[];
        nariyukikehai["AAV"]=kehai["AAV"];
        nariyukikehai["ABV"]=kehai["ABV"];
    console.log(oukehai);
    console.log(nariyukikehai);
    
    //kaisclale
    var kaixscale =d3.scaleLinear()
	    .domain([0, d3.max(Object.values(mkehai))])
	    .range([0,180])
	  //urixsclale  
	  var urixscale =d3.scaleLinear()
	    .domain([0, d3.max(Object.values(mkehai))])
	    .range([180,0])
	 //overunderscale
  	 var ouxscale =d3.scaleLinear()
	     .domain([0, d3.max(Object.values(oukehai))])
	     .range([0,180])
	   var narixscale =d3.scaleLinear()
	     .domain([0, d3.max(Object.values(nariyukikehai))])
	     .range([0,180])  
	     
	        
     var svg= d3.select('.canvas')
              .append("svg")
                .attr("width", width)
                .attr("height", height)
	   
	   //買い気配の描画       
	   var g=svg.selectAll('g')
	            .data(Object.values(kaikehai))
	              .enter()
	              
      	      g.append('rect')
      	         .attr('fill','#F9E3E1')
      	         .attr('x',235+'px')
      	         .attr('y',function(d,i){
      	              return 300+30*i+'px';
      	                })
      	         .attr('width', function(d) {
      	                return kaixscale(d) ;
                         })
                 .attr('height',29+'px')  	
              g.append('text')
                 .attr('x',function(d) {
      	                return 370+'px';
                         })
                 .attr('y',function(d,i){
      	            return 30*i+318+'px';
      	            })
      	         .attr('text-anchor','right')
      	         .text(function(d){
      	                return(d);
      	           }); 
	   
	   //買い価格柱の描画            
	 	 var g2=svg.selectAll('g2')
	            .data(Object.values(kaikakaku))
	              .enter();           
	         g2.append('text')
                 .attr('x',function(d) {
      	                return 205+'px';
                         })
                 .attr('y',function(d,i){
      	            return 318+30*i+'px';
      	            })
      	         .attr('class',function(d){
      	           if(d > kijunti){
      	             return "pillarup";
      	           }else if(d < kijunti){
      	             return "pillardown";
      	           }else{
      	             return "pillarnormal";
      	           }
      	           
      	         })
      	         .attr('text-anchor','middle')
      	         .text(function(d){
      	                return(d);
      	           });
      	   //売り価格柱の描画            
	 	 var g3=svg.selectAll('g3')
	            .data(Object.values(urikakaku))
	              .enter();             
	         g3.append('text')
                 .attr('x',function(d) {
      	                return 205+'px';
                         })
                 .attr('y',function(d,i){
      	            return 288-30*i+'px';
      	            })
      	          .attr('class',function(d){
      	           if(d > kijunti){
      	             return "pillarup";
      	           }else if(d < kijunti){
      	             return "pillardown";
      	           }else{
      	             return "pillarnormal";
      	           }
      	           })
      	         .attr('text-anchor','middle')
      	         .text(function(d){
      	                return(d);
      	           });	           
   
   //売り気配の描画   	           
    var g4=svg.selectAll('g4')
	            .data(Object.values(urikehai))
	              .enter()	           
      
      g4.append('rect')
	         .attr('fill','#DAF1DD')
	         .attr('x',function(d) {
	                return urixscale(d)+'px' ;
                   })
	         .attr('y',function(d,i){
	              return 268-30*i+'px';
	                })
	         .attr('width', function(d) {
	                return 180-urixscale(d)+'px' ;
                   })
           .attr('height',29+'px')  	
        g4.append('text')
           .attr('x',function(d) {
	                return 4+'px';
                   })
           .attr('y',function(d,i){
	            return 288-30*i+'px';
	            })
	         .text(function(d){
	                return(d);
	           });
    
      }
      else{
        //データ取得がうまくいかなかったとき
       $(".canvas").append("入力された値が銘柄コードではないようです。");  
      }
  }
  

       
