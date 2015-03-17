/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function run () {
    // https://bitbucket.org/surenrao/xml2json
    $.get('data/doc2773027.xml', 
        function(xml){ 
            var json = $.xml2json(xml).CadastralBlocks;
//            var node = new PrettyJSON.view.Node({
//                el: $('#data'),
//                data: json
//            });
            $("#data").html('<code>'+JSON.stringify(json)+'</code>'); 
            console.log(json);
        });
}
