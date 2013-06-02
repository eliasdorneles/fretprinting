
var fretboardComponent = {
    activate:function(event){
        alert('hello');
    },
    two:function(){
        alert('hello');
    }


}

var createFretboard = function (n_strings, inlay_repr, dot_mark, show_numbers) {
    var createFret = function (numStrings, repr) {
        // a common fret is represented by '-' or undefined
        // '.' is a dotted fret with one dot '.'
        // ':' is a double dotted fret
        var isDotted = repr == '.' || repr == ':';
        var doubleDotted = repr == ':';
        if (isDotted) {
            var place = doubleDotted ? 1 : (numStrings / 2 - 1) | 0; // cast-to-int HACK!
        }
        // for N strings, we need to draw N-1 cell boxes
        var numBoxes = numStrings - 1;
        var fret_html = "<tr>";
        for (var i = 0; i < numBoxes; i++) {
            if (isDotted && i == place) {
                fret_html += "<td>" + dot_mark + "</td>";
                place = doubleDotted ? (numBoxes - 2) : place;
            } else {
                fret_html += '<td>&nbsp;</td>';
            }
        }
        fret_html += "</tr>";
        return fret_html;
    }
    var fret_for_repr = {
        '-': createFret(n_strings),
        '.': createFret(n_strings, '.'),
        ':': createFret(n_strings, ':')
    }
    var createNumberBox = function (number, visible) {
        return '<td class="fretnumber" style="visibility: ' + (visible ? 'visible' : 'hidden') + '">' + number + '</td>';
    }
    var fretboard_elem = $('<table class="fretboard"></table>');

    // create a fretboard
    for (var i = 0; i < inlay_repr.length; i++) {
        var fretType = inlay_repr[i];
        var $fret = $(fret_for_repr[fretType]);
        $fret.prepend(createNumberBox(i + 1, show_numbers));
        fretboard_elem.append($fret);
    }
    return fretboard_elem;
}
// handle url parameters
function get_url_parameters() {
    var params = {};
    var index_params = window.location.href.indexOf('#');
    if (index_params > 0) {
        var hashes = window.location.href.slice(index_params + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            var hash = hashes[i].split('=');
            params[hash[0]] = hash[1];
        }
    }
    return params;
}
function create_link(link_params) {
    var href = window.location.href;
    if (href.indexOf('#') > 0) {
        href = href.substring(0, href.indexOf('#'));
    }
    href += '#';
    for (var key in link_params) {
        href += key + '=' + link_params[key] + '&';
    }
    href = href.substring(0, href.length - 1);
    return href;
}
function update_form_with_url_params() {
    var params = get_url_parameters();
    // TODO: validate input?
    for (var key in params) {
        if (key == 'show_numbers') {
            $('#' + key).prop('checked', params[key] == 'true');
        } else {
            if (key) {
                $('#' + key).val(params[key]);
            }
        }
    }
}
var generateAllFretboards = function () {
    var how_many = $('#how_many').val();
    var dot_mark = '&#x25cf;'; // the dot mark character
    var inlay_variation = $('#inlay_variation').val();
    var num_strings = $('select#num_strings').val();
    var frets_per_diagram = $('select#frets_per_diagram').val();
    var show_numbers = $('#show_numbers').is(':checked');
    var size_diagram = $('select#size_diagram').val();
    var margin = $('select#fretboard_margin').val();

    var link_params = {
        how_many: how_many,
        inlay_variation: inlay_variation,
        size_diagram: size_diagram,
        num_strings: num_strings,
        frets_per_diagram: frets_per_diagram,
        show_numbers: show_numbers,
        fretboard_margin: margin
    };
    var href = create_link(link_params);
    $('#input_link_this').val(href);


    // This gets the fretboard representation ready with the right size
    //     '-----' is a fretboard with 5 frets and no marks
    //     '--.--:' is a fretboard with 6 frets, a dot in the third fret and double dots in the last fret
    var fretboardRepr = inlay_variation.substr(0, frets_per_diagram);

    // empty container and redraw fretboards
    var $main = $('#main');
    $main.empty();
    var $fretboard = createFretboard(num_strings, fretboardRepr, dot_mark, show_numbers);
    for (var i = 0; i < how_many; i++) {
        $('#main').append(createFretboard(num_strings, inlay_variation, dot_mark, show_numbers));
    }
    // adjust size
    var css_size_style = {
        'Tiny': { width: '18px', height: '24px'},
        'Small': { width: '22px', height: '30px'},
        'Medium': { width: '28px', height: '38px'},
        'Large': { width: '36px', height: '50px'},
        'X-Large': { width: '40px', height: '56px'}
    }
    $('.fretboard tr td').css(css_size_style[size_diagram]);
    $('.fretboard').css('margin', margin + 'cm');
}
$(function () {
    // this will load on dom-ready
    function fill_options(elem, options, defval) {
        // setup a select dropdown with options and default value
        $.each(options, function () {
            var html = $('<option value="' + this + '">' + this + '</option>');
            if (this == defval) {
                html.attr('selected', '1');
            }
            elem.append(html);
        });
    }

    function list_range(start, end) {
        // create a list from a range
        var arr = [];
        for (var i = start; i <= end; i += 1) {
            arr.push(i);
        }
        return arr;
    }

    // setup controls with defaults
    fill_options($('select#how_many'), list_range(1, 30), 3);
    fill_options($('select#frets_per_diagram'), list_range(4, 16), 14);
    fill_options($('select#num_strings'), list_range(4, 8), 6);
    fill_options($('select#size_diagram'), ['Tiny', 'Small', 'Medium', 'Large', 'X-Large'], 'Medium');
    fill_options($('select#fretboard_margin'), [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3.0], 0.8);
    $('select#inlay_variation').append('<option value="----------------">No Inlay</option>');
    $('select#inlay_variation').append('<option value="--.-.-.-.--:--.-" selected>Variation 1</option>');
    $('select#inlay_variation').append('<option value="--.-.-.--.-:--.-">Variation 2</option>');

    $('.print-action').click(function (e) {
        e.preventDefault();
        window.print();
    });

    $('#help_btn').click(function () {
        $('#help').show('fast');
    });
    $('.help_close_btn').click(function () {
        $('#help').hide('fast');
    });
    $('.settings-panel input').change(generateAllFretboards);
    $('.settings-panel select').change(generateAllFretboards);

    $('#toggleAdvanced').toggle(function () {
        $(this).addClass('active');
        $('.advanced').show();
    }, function () {
        $(this).removeClass('active');
        $('.advanced').hide();
    });


    $('#input_link_this').click(function () {
        $(this).select();
    });

    $('.getting-started-btn').click(function (e) {
        scrollTo(0, 1011);
        e.preventDefault();
        return false;
    })

    // generate with defaults
    update_form_with_url_params();
    generateAllFretboards();
    $(document).keyup(function (e) {
        // hotkeys
        var ESCAPE = 27;
        if (e.keyCode == ESCAPE) {
            $('#help').hide();
        }
    });
});

$(document).ready(function () {
    // isso provavelmente deveria estar ali em cima,
    // onde jah tem mais coisa carregando no dom-ready :)
    var body = $(document.body);

    body.on('activate',".activatable", function(ev)
    {
        var activatable = $(this);
        var listHolder = activatable.closest(".activatable-container");

        listHolder.find(".activatable").removeClass("active");
        activatable.addClass("active");
    });

    body.on('click','.preset', function ()
    {
        var preset = $(this);
        var presetContainer = $(this).closest('.activatable');
        var href = preset.attr('href');

        presetContainer.trigger('activate');

        window.location.href = href;
        update_form_with_url_params();
        generateAllFretboards();
    });
});