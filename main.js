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
        $.each(data.section1.data[kehaiquote],function(key,val){
      console.log("key: "+key+" value: "+val);
      $("table tbody").append("<tr class="+key+"><td>" + key + "</td><td>" + val + "</td></tr>");
     });
     }
      else{
       $("table tbody").append("入力された値が銘柄コードではないようです。");  
      }
  }
    
    
    
    var test ={
  "color_list": [ "red", "green", "blue" ],
  "num_list": [ 123, 456, 789 ],
  "mix_list": [ "red", 456, null, true ],
  "array_list": [ [ 12, 23 ], [ 34, 45 ], [ 56, 67 ] ],
  "object_list": [
    { "name": "Tanaka", "age": 26 },
    { "name": "Suzuki", "age": 32 }
  ]
}

  // リクエストが成功するとここが実行される。
  // JSONからオブジェクトに変換されたものがdataに入る。
  //console.log(data)
   // var kehai =data.res
  
   // if (kehai.status == "0"){
   //   console.log(kehai.status)