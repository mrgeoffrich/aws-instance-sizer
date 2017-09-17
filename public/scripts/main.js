$(document).ready(function(){
    $('#displayTable').DataTable( {
        'paging':   false,
        'order': [[ 1, 'asc' ]],
        'searching': false
    });
});