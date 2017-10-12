
$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var mincpu = parseInt( $('#mincpu').val(), 0 );
        var minram = parseFloat( $('#minram').val(), 0 );
        var cpus = parseInt( data[2] ) || 0; // use data for the age column
        var ram = parseFloat( data[4] ) || 0; // use data for the age column
        
        if ( cpus >= mincpu && ram >= minram )
        {
            return true;
        }
        return false;
    }
);

$(document).ready(function(){
    var table = $('#displayTable').DataTable( 
        {
            'paging':   false,
            'order': [[ 1, 'asc' ]]
        }
    );

    $('#mincpu, #minram').keyup( function() {
        table.draw();
    });
});
