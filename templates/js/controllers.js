var App = angular.module('FretsApp', []);

App.filter('dotmark', function () {
    return function (numStrings, index, repr) {
        // Algorithm for placing the dot marks according to the inlay variation
        if (repr == '-') {
            // just a regular fret
            return ' ';
        }
        var places = [];
        if (repr == ':') {
            // that's a double dotted fret
            places = [1, 3];
        } else if (repr == '.') {
            // a simple dotted fret
            var midString = (numStrings / 2 - 1);
            places = [midString | 0]; // cast-to-int HACK!
        }
        if (places.indexOf(index) > -1) {
            return '●';
        }
        return ' ';
    };
});

function FretboardsCntl($scope, $location, $window) {

    var getUrlParams = function (search) {
        return {
            howMany: search.howMany ? parseInt(search.howMany) : undefined,
            numFrets: search.numFrets ? parseInt(search.numFrets) : undefined,
            numStrings: search.numStrings ? parseInt(search.numStrings) : undefined,
            margin: search.margin ? parseFloat(search.margin) : undefined,
            showNumbers: (search.showNumbers != undefined) ? (search.showNumbers == 'true') : undefined,
            inlay: search.inlay,
            size: search.size
        }
    };
    $scope.range = function (start, end, step) {
        step = (step == undefined) ? 1 : step;
        var list = [];
        for (i = start; i <= end; i += step) {
            list.push(i)
        }
        return list;
    }

    $scope.marginOptions = [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3.0];
    $scope.inlayOptions = {
        'No Inlay': '----------------',
        'Variation 1': '--.-.-.-.--:--.-',
        'Variation 2': '--.-.-.--.-:--.-'
    }

    $scope.sizeOptions = {
        'Tiny': {
            style: { width: '18px', height: '24px' }
        },
        'Small': {
            style: { width: '22px', height: '30px' }
        },
        'Medium': {
            style: { width: '28px', height: '38px' }
        },
        'Large': {
            style: { width: '36px', height: '50px' }
        },
        'X-Large': {
            style: { width: '40px', height: '56px' }
        }
    };

    function setupFretboards(params) {
        $scope.howMany = params.howMany || 3;
        $scope.showNumbers = params.showNumbers != undefined ? params.showNumbers : true;
        $scope.numStrings = params.numStrings || 6;
        $scope.numFrets = params.numFrets || 14;
        $scope.margin = params.margin || 0.8;
        $scope.inlay = $scope.inlayOptions[params.inlay || 'Variation 1'];
        $scope.size = $scope.sizeOptions[params.size || 'Medium'];
    }

    var params = getUrlParams($location.search());
    setupFretboards(params);

    $scope.presets = [
        {
            name: 'Guitar',
            preset: {
                howMany: 3,
                inlay: 'Variation 1',
                size: 'Medium',
                numStrings: 6,
                numFrets: 14,
                showNumbers: true,
                margin: 0.8
            }
        },
        {
            name: 'Chord Boxes',
            preset: {
                howMany: 9,
                inlay: 'No Inlay',
                size: 'Large',
                numStrings: 6,
                numFrets: 5,
                showNumbers: false,
                margin: 0.2
            }
        } ,
        {
            name: 'Guitar (small)',
            preset: {
                howMany: 8,
                inlay: 'Variation 1',
                size: 'Small',
                numStrings: 6,
                numFrets: 16,
                showNumbers: true,
                margin: 0.2
            }
        } ,
        {
            name: 'Bass',
            preset: {
                howMany: 4,
                inlay: 'Variation 1',
                size: 'Large',
                numStrings: 4,
                numFrets: 14,
                showNumbers: true,
                margin: 0.4
            }
        },
        {
            name: 'Bass 5 Strings',
            preset: {
                howMany: 3,
                inlay: 'Variation 1',
                size: 'Large',
                numStrings: 5,
                numFrets: 14,
                showNumbers: false,
                margin: 0.4
            }
        }
    ];

    $scope.activatePreset = function (preset, index) {
        $scope.selectedPresetIndex = index;
        setupFretboards(preset);
    }

    $scope.fretboardRepr = function () {
        // This gets a fretboard representation ready with just about the right size
        //     '-----' is a fretboard with 5 frets and no marks
        //     '--.--:' is a fretboard with 6 frets, a dot in the third fret and double dots in the last fret
        var inlay = $scope.inlay;
        var representation = inlay.substr(0, $scope.numFrets);
        return  representation.split('');
    }

    $scope.numbersStyle = function () {
        return {
            visibility: $scope.showNumbers ? 'visible' : 'hidden'
        };
    }
    $scope.boardStyle = function () {
        return {
            margin: $scope.margin + 'cm'
        };
    }
    $scope.getStarted = function () {
        scrollTo(0, 1011);
    }
    $scope.print = function () {
        $window.print();
    }
}