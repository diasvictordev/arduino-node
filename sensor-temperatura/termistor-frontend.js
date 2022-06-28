function atualizar() {
    $("#temperatura").html('...');
    $.ajax({
    type: "POST", contentType: "text/plain",
    url: window.location + "obter/temperatura",
    success: function(dados) { 
        $("#temperatura").html(dados);
        window.setTimeout(atualizar, 10000);
    }
 });
 }
    $(document).ready(function() { 
        atualizar();
    });