  $("#button").click(function(){
    //入力フォームの10個の銘柄取得
      var perquote = new Array();
      for(var i = 0; i < 10; i++){
        perquote[i]=$("#input"+i).val();
      }
      console.log(perquote);
    
     //パラメータ配列作成
      var parameters =  new Array();
      var parameters2=  new Array();
      for(i = 0; i<perquote.length;i++){
        
        //個別銘柄の指標取得API
        parameters[i]= $.param({
        F: "ja_stk_dtl_idx",
        quote: perquote[i],
         });
         
        //個別銘柄のヒストリカル取得API
        parameters2[i]= $.param({
        F: "ja_stk_dtl_hist_d",
        quote: perquote[i],
         });  
      }
      console.log(parameters);
      console.log(parameters2);
  
    //個別銘柄の指標取得APIリクエストURL
      var shihyou_url  = new Array();
      var shihyou_url2 = new Array();
      for(i = 0; i < parameters.length; i++){
        shihyou_url[i]=apiurl +parameters[i];
        shihyou_url2[i]=apiurl +parameters2[i];
      }
        console.log(shihyou_url);
        console.log(shihyou_url2);
    //APIコール
     var shihyou_data  =new Array();
     
     for (var i = 0; i < shihyou_url.length; i++) {
      shihyou_data[i]=$.ajax({ // $.ajaxの戻り値を配列に格納
        url: shihyou_url[i],
        type: 'GET',
        dataType:'json'
    });
      shihyou_data[10+i]=$.ajax({ // $.ajaxの戻り値を配列に格納
        url: shihyou_url2[i],
        type: 'GET',
        dataType:'json'
    });
    
}
    
    //shihyou_dataのajaxがすべてdoneしたときに発動する
    $.when.apply($,shihyou_data).done(function () {
      //PER,ROE,発行済み時価総額の配列を用意(データはリアル更新？前日終値ベースではない)
      //時価総額=発行済み時価総額×現値で算出する。これは時価総額を取得するAPIを使うと、IFの種類が増えてしまうため
      var roel =new Array(); //単位は% x軸
      var rper =new Array(); //単位は倍 y軸
      var shrk =new Array(); //単位は株
      var dpp  =new Array(); //単位は円
      var mktp =new Array(); //単位は円
      
      for(var i = 0; i < perquote.length; i++){
        if(shihyou_data[i].responseJSON.status == 0){
          roel[i] =shihyou_data[i].responseJSON.section1.data[perquote[i]].ROEL;
          roel[i].slice(0,-2);
          roel[i] =parseFloat(roel[i]);
          
          rper[i] =shihyou_data[i].responseJSON.section1.data[perquote[i]].RPER;
          rper[i].slice(0,-2);
          rper[i] =parseFloat(rper[i]);
          
          shrk[i] =shihyou_data[i].responseJSON.section1.data[perquote[i]].SHRK;
          shrk[i].slice(0,-2);
          shrk[i] =shrk[i].replace(/,/g, "");
          shrk[i] =parseFloat(shrk[i]);
          
          dpp[i]  =shihyou_data[10+i].responseJSON.section1.data[perquote[i]].DPP;
          dpp[i] =parseFloat(dpp[i]);
          
          mktp[i] =shrk[i]*dpp[i];
          
          //時価総額100万円以下は四捨五入する
          mktp[i]=Math.round(mktp[i]/1000000)*1000000;
          
            if(isNaN(roel[i])){
                roel[i]=20;
            }
          }
      }  
        
        
        console.log(roel);
        console.log(rper);
        console.log(shrk);
        console.log(dpp);
        console.log(mktp);
        
      //D3にenterするためにデータを結合 
       var dataset =new Array();
          for (var i = 0; i < shihyou_url.length; i++){
            dataset[i]=[perquote[i],roel[i],rper[i],mktp[i]];
          }
      console.log(dataset);
      
      //datasetを時価総額順にsort
      dataset.sort(function(a, b) {
         if (a[3] > b[3]) {
          console.log(a[3]);
          console.log(b[3]);
            return -1;
        } else {
            return 1;
        }
      });
      
      //スケールを用意  
      var roexscale = d3.scaleLinear()
          .domain([0, d3.max(Object.values(roel))])
	        .range([0,900]);
	        
	    var peryscale = d3.scaleLinear()
          .domain([0, d3.max(Object.values(rper))])
	        .range([600,0]);    
     	
     	var mktprscale = d3.scaleLinear()
          .domain([0, d3.max(Object.values(mktp))])
	        .range([0,200]);   
      
      
      //D3.jsでbubble chart表示  
      $(".canvas").html("");  
          var width = 1000; // グラフの幅
          var height = 690; // グラフの高さ
          var svg= d3.select('.canvas')
              .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("style", "position:relative");
        //tooltripを定義        
          var tooltip = d3.select(".canvas").append("div").attr("class", "tooltip");
          
          var innersvg =svg
                .append("svg")
                .attr("width", width-30)
                .attr("height", height-30)
                .attr("style", "position:absolute")
                .attr("style", "top:30")
                .attr("style", "left:30");
                 
          var g=innersvg.selectAll('g')
	            .data(dataset)
	              .enter();
        
           g.append('circle')
             .attr('cx',function(d) { 
               //、30px右にずらす
               console.log(d[1]);
               return roexscale(d[1])+30; })
               
             .attr('cy',function(d) { 
                 //60px下にずらす
               return peryscale(d[2])+60; })
             .attr('r',function(d) { 
               return mktprscale(d[3]); })
               
             .attr('fill',function(d,i){
               return d3.schemeSet3[i];
             })
             .attr('class', 'circle')
             
        //mouseoverしたときtooltripで情報を出す     
              .on("mouseover", function(d) {
                tooltip
                  .style("visibility", "visible")
                  .html("銘柄コード : " + d[0] + "<br>ROE : " + d[1] + "%<br>PER:"+ d[2] +"倍<br>時価総額:"+ d[3]/100000000+"億円");
    })
              .on("mousemove", function(d) {
                tooltip
                  .style("top", (d3.event.pageY - 20) + "px")
                  .style("left", (d3.event.pageX + 10) + "px");
    })
              .on("mouseout", function(d) {
                tooltip.style("visibility", "hidden");
    });
    
    //バブルチャートに銘柄コードを出す。
            g.append('text') 
              .text(function(d){
	                return(d[0]);
	             })
               
                .attr('x',function(d) { 
               return roexscale(d[1])+30+"px"; })
                .attr('y',function(d) { 
               return peryscale(d[2])+60+"px"; })
               
                .attr('fill','black');
   //軸の描画
     var axisx = d3.axisBottom(roexscale);
           var axisy = d3.axisLeft(peryscale);
           var padding = 30;
           svg.append("g")
            .attr("transform", "translate(" + (padding) + "," + (height-30) + ")")
            .call(axisx);
            
          
          svg.append("g")
            .attr("transform", "translate("+ padding+",60)")
            .call(axisy);
            
            
     //軸のラベル       
          svg.append("text")
            .text("PER(倍)")
            .attr('x',5)
            .attr('y',45)
            .attr('style','font-size:16px');
        
          svg.append("text")
            .text("ROE(%)")
            .attr('x',940)
            .attr('y',670)
            .attr('style','font-size:14px');
            
    });
    
  });