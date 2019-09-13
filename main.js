//function onButtonClick() {
//var kehaiquote = $("#input").val();
//console.log(kehaiquote);
//}


var kehaiquote  = "6501/T";
   
 
  $("#button").click(function(){
      var kehaiquote = $("#input").val();
      console.log(kehaiquote);
    //var kehaiquote  = "6501/T"
      
      var parameters =  $.param({
        F: "ja_stk_dtl_qtn",
        // callback: "kehai", // callback関数
        quote: kehaiquote,
         });
  
      var kehai_url = apiurl + parameters; 
        console.log(kehai_url);
    $.ajax({
         url: kehai_url,
         type:'GET',
         dataType:'json'
         //success: function(data) {
           //console.log(data);
             //   $("#main").append("<p>データ"+data+"!</p>");
         //}
        
      })
       .done( (data) => {
                        //console.log(data);
                          var cputime =data.cputime;
                          console.log("cputime:"+cputime);
                            $(".kehaiquote").html("<p>" +kehaiquote+ "</p>");
                            $("#main").html("<div>処理時間 "+cputime+"</div>");
                            kehaihyouji(data,kehaiquote);
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
  
  
  function kehaihyouji(data,kehaiquote) {
    $("table tbody").html("");
      if (data.section1.hitcount == 1){
        //$.each(data.section1.data[kehaiquote],function(key,val){
     // console.log("key: "+key+" value: "+val);
      //$("table tbody").append("<tr class="+key+"><td>" + key + "</td><td>" + val + "</td></tr>");
     //});
     
     //d3.js　.append svg
    var width = 400; // グラフの幅
    var height = 600; // グラフの高さ
    
    //データの配列を用意
    var kehai=data.section1.data[kehaiquote];
    var kaikehai=[];
    var urikehai=[];
    var kaikakaku=[];
    var urikakaku=[];
      for(var i=1;i<11;i++){
        kaikehai["GBV"+i]=kehai["GBV"+i].replace(/,/g, ""); //連想配列  コンマを取る
        kaikehai["GBV"+i] =parseInt(kaikehai["GBV"+i]);//Number型へ変換
        kaikakaku["GAP"+i]=kehai["GAP"+i].replace(/,/g, ""); //連想配列  コンマを取る
        kaikakaku["GAP"+i] =parseInt(kaikakaku["GAP"+i]);//Number型へ変換
        urikakaku["GBP"+i]=kehai["GBP"+i].replace(/,/g, ""); //連想配列  コンマを取る
        urikakaku["GBP"+i] =parseInt(urikakaku["GBP"+i]);//Number型へ変換
        urikehai["GAV"+i]=kehai["GAV"+i].replace(/,/g, ""); //連想配列  コンマを取る
        urikehai["GAV"+i] =parseInt(urikehai["GAV"+i]);//Number型へ変換
      };
      var kakaku=$.extend({},kaikakaku,urikakaku);
      var mkehai=$.extend({},kaikehai,urikehai);
      console.log(kaikehai);
      console.log(kaikakaku);
      console.log(urikehai);
      console.log(urikakaku);
      console.log(mkehai);
      console.log(kakaku);
    
    //kaisclale
    var kaixscale =d3.scaleLinear()
	    .domain([0, d3.max(Object.values(mkehai))])
	    .range([0,180])
	  //urixsclale  
	  var urixscale =d3.scaleLinear()
	    .domain([0, d3.max(Object.values(mkehai))])
	    .range([180,0])
	
     var svg= d3.select('.canvas')
              .append("svg")
                .attr("width", width)
                .attr("height", height)
	   
	   //買い気配の描画       
	   var g=svg.selectAll('g')
	            .data(Object.values(kaikehai))
	              .enter()
	              
      	      g.append('rect')
      	         .attr('fill','red')
      	         .attr('x',225+'px')
      	         .attr('y',function(d,i){
      	              return 300+30*i+'px';
      	                })
      	         .attr('width', function(d) {
      	                return kaixscale(d) ;
                         })
                 .attr('height',29+'px')  	
              g.append('text')
                 .attr('x',function(d) {
      	                return 350+'px';
                         })
                 .attr('y',function(d,i){
      	            return 30*i+318+'px';
      	            })
      	         .text(function(d){
      	                return(d);
      	           }); 
	   
	   //価格柱の描画            
	 	 var g2=svg.selectAll('g2')
	            .data(Object.values(kakaku))
	              .enter()              
	         g2.append('text')
                 .attr('x',function(d) {
      	                return 195+'px';
                         })
                 .attr('y',function(d,i){
      	            return 18+30*i+'px';
      	            })
      	         .text(function(d){
      	                return(d);
      	           });
   
   //売り気配の描画   	           
    var g3=svg.selectAll('g3')
	            .data(Object.values(urikehai))
	              .enter()	           
      
      g3.append('rect')
	         .attr('fill','green')
	         .attr('x',function(d) {
	                return urixscale(d)+'px' ;
                   })
	         .attr('y',function(d,i){
	              return 30*i+'px';
	                })
	         .attr('width', function(d) {
	                return 180-urixscale(d)+'px' ;
                   })
           .attr('height',29+'px')  	
        g3.append('text')
           .attr('x',function(d) {
	                return 4+'px';
                   })
           .attr('y',function(d,i){
	            return 30*i+18+'px';
	            })
	         .text(function(d){
	                return(d);
	           });
    
      }
      else{
        //データ取得がうまくいかなかったとき
       $("table tbody").append("入力された値が銘柄コードではないようです。");  
      }
  }