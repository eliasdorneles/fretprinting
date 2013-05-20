var createFretboard = function (n_strings, inlay_repr, dot_mark, show_numbers) {
    var fret = function (num_str, dotted, two) {
        if (dotted) {
            var place = two ? 1 : (num_str / 2 - 1) | 0; // cast-to-int HACK!
        }
        var fret_html = "<tr>";
        for (var i = 0; i < num_str - 1; i++) {
            if (dotted && i == place) {
                fret_html += "<td>" + dot_mark + "</td>";
                place = two ? num_str - 3 : place;
            } else {
                fret_html += i == num_str - 2 ? '<td class="laststr">&nbsp;</td>' : '<td>&nbsp;</td>';
            }
        }
        fret_html += "</tr>";
        return fret_html;
    }
    var fret_for_repr = {
        '-': fret(n_strings),
        '.': fret(n_strings, true),
        ':': fret(n_strings, true, true)
    }
    var fretboard_elem = $('<table class="fretboard"></table>');
    var numbers_style = show_numbers ? '' : ' style="visibility:hidden"';
    for (var i = 0; i < inlay_repr.length; i++) {
        var e = $(fret_for_repr[inlay_repr[i]]);
        if (i == inlay_repr.length - 1) {
            e.attr('class', 'lastfret');
        }
        e.prepend('<td class="fretnumber"' + numbers_style + '>' + (i + 1) + '</td>');
        fretboard_elem.append(e);
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
            $('#' + key).attr('checked', params[key] == 'true');
        } else {
            if (key) {
                console.log('set ' + key + ':' + params[key]);
                $('#' + key).val(params[key]);
            }
        }
    }
}
var generate = function () {
    var how_many = $('#how_many').val();
    var dot_mark = '&#x25cf;';
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

    if (frets_per_diagram < inlay_variation.length) {
        inlay_variation = inlay_variation.substr(0, frets_per_diagram);
    }

    // empty container
    $('#main').empty();
    // draw fretboards
    for (var i = 0; i < how_many; i++) {
        $('#main').append(createFretboard(num_strings, inlay_variation, dot_mark, show_numbers));
    }
    // adjust size
    var css_size_style = {
        'Tiny': { width: '18px', height: '24px'},
        'Small': { width: '22px', height: '30px'},
        'Medium': { width: '28px', height: '38px'},
        'Large': { width: '36px', height: '50px'},
        'X-Large': { width: '40px', height: '56px'},
    }
    $('.fretboard tr td').css(css_size_style[size_diagram]);
    $('.fretboard').css('margin', margin + 'cm');
}
$(function () {
    var translations = [
        ['Tiny', 'Bem Pequeno'],
        ['Small', 'Pequeno'],
        ['Medium', 'Médio'],
        ['Large', 'Grande'],
        ['X-Large', 'Bem Grande'],
    ];

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
    $('#print_btn').click(function () {
        window.print();
    });
    $('#help_btn').click(function () {
        $('#help').show('fast');
    });
    $('.help_close_btn').click(function () {
        $('#help').hide('fast');
    });
    $('#interface form input').change(generate);
    $('#interface form select').change(generate);

    $('#toggleLanguage').toggle(function () {
        var $this = $(this);
        $this.html('English version');
        $('.eng').hide();
        $('.pt').show();
    }, function () {
        var $this = $(this);
        $this.html('Versão em Português');
        $('.eng').show();
        $('.pt').hide();
    });
    $('#toggleAdvanced').toggle(function () {
        $(this).addClass('active');
        $('.advanced').show();
    }, function () {
        $(this).removeClass('active');
        $('.advanced').hide();
    });
    $('.preset').click(function () {
        var href = $(this).attr('href');
        window.location.href = href;
        update_form_with_url_params();
        generate();
    });
    $('#input_link_this').click(function () {
        $(this).select();
    });

    // generate for defaults
    update_form_with_url_params();
    generate();
    $(document).keyup(function (e) {
        // hotkeys
        var ESCAPE = 27;
        if (e.keyCode == ESCAPE) {
            $('#help').hide();
        }
    });
});