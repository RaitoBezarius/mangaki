function getSheet(elt) {
    entity = $(elt).closest('.data'); // See work_poster
    if(entity.data('category') != 'dummy')
        location.href = '/' + entity.data('category') + '/' + entity.data('id');
}

function vote(elt) {
    entity = $(elt).closest('.data');
    console.log(entity);
    console.log($(elt));
    work_id = entity.data('id');
    choice = $(elt).data('choice');
    pos = entity.data('pos');
    $.post('/work/' + work_id, {choice: choice}, function(rating) {
        if(rating == '')
            window.location = '/user/signup';
        dejaVu = $('[data-id]').map(function() {return $(this).data('id');}).get();
        if(typeof(sort_mode) != 'undefined' && sort_mode == 'mosaic' && rating)
            loadCard(pos, dejaVu);
        else {
            $(elt).siblings().filter('[data-choice!=' + rating + ']').addClass('not-chosen');
            if(rating == 'none')
                $(elt).addClass('not-chosen');
            else if(rating)
                $(elt).removeClass('not-chosen');
        }
    });
}

function suggestion(mangaki_class) {
    $.post('/' + mangaki_class + '/' + $('#id_work').val(), {
        'work': $('#id_work').val(),
        'problem': $('#id_problem').val(),
        'message': $('#id_message').val()
    }).success(function(data) {
        $('#alert').hide()
        if($('#success').css('display') == 'none')
            $('#success').show();
        $('#success').html('Merci d\'avoir contribué à Mangaki !');
        setTimeout(function() {
            $('#success').hide();
            $('#suggestionModal').modal('hide');
        }, 1000);
    }).error(function(data) {
        $('#success').hide();
        if($('#alert').css('display') == 'none')
            $('#alert').show();
        // for(line in data.responseJSON) {
        $('#alert').text(data.responseJSON['problem']);
        // }
    });
}

function displayWork(pos, work) {
    display_votes = true;
    if(work == undefined) {
        work = {'id': 0, 'category': 'dummy', 'title': 'Chargement…', 'poster': '/static/img/chiro.gif', 'synopsis': ''}
        display_votes = false;
    }
    selector = ':nth-child(' + pos + ')';
    console.log('.manga-sheet' + selector + ' .data');
    work_div = $('.manga-sheet' + selector + ' .data');
    work_div.data('category', work['category']);
    work_div.data('id', work['id']);
    work_div.find('h4 a').text(work['title']);
    work_div.find('h4 a').attr('title', work['synopsis']);
    $('[data-toggle="tooltip"]').tooltip('fixTitle');
    work_div.find('h4 a').attr('href', '/' + work_div.data('category') + '/' + work_div.data('id'));
    work_div.find('.manga-snapshot-image').hide().css('background-image', 'url(' + work['poster'] + ')').fadeIn();
    if(display_votes)
        work_div.find('.manga-votes').fadeIn();
    else
        work_div.find('.manga-votes').fadeOut();
}

function loadCard(pos, dejaVu) {
    if(dejaVu == undefined)
        dejaVu = [];
    displayWork(pos);
    $.getJSON('/data/card/' + category + '/' + pos + '.json?dejavu=' + dejaVu.join(','), function(work) {
        dejaVu = $('[data-id]').map(function() {return $(this).data('id');}).get();
        if(dejaVu.indexOf(work['id']) != -1)
            loadCard(pos, dejaVu);
        else
            displayWork(pos, work);
    });
}
