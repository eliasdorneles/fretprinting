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

function FretboardsCntl($scope) {

    $scope.range = function (start, end, step) {
        step = (step == undefined) ? 1 : step;
        var list = [];
        for (i = start; i <= end; i += step) {
            list.push(i)
        }
        return list;
    }

    $scope.howMany = 3;
    $scope.showNumbers = true;
    $scope.numStrings = 6;
    $scope.numFrets = 14;

    $scope.margin = 0.8;
    $scope.marginOptions = [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3.0];

    var inlayOptions = [
        {
            name: 'No Inlay',
            inlay: '----------------'
        },
        {
            name: 'Variation 1',
            inlay: '--.-.-.-.--:--.-'
        },
        {
            name: 'Variation 2',
            inlay: '--.-.-.--.-:--.-'
        }
    ]
    $scope.inlayVariation = inlayOptions[1]; // default variation 1
    $scope.inlayOptions = inlayOptions;

    var sizeOptions = [
        {
            name: 'Tiny',
            style: { width: '18px', height: '24px' }
        },
        {
            name: 'Small',
            style: { width: '22px', height: '30px' }
        },
        {
            name: 'Medium',
            style: { width: '28px', height: '38px' }
        },
        {
            name: 'Large',
            style: { width: '36px', height: '50px' }
        },
        {
            name: 'X-Large',
            style: { width: '40px', height: '56px' }
        }
    ];
    $scope.size = sizeOptions[2]; // default medium
    $scope.sizeOptions = sizeOptions;


    $scope.fretboardRepr = function () {
        // This gets a fretboard representation ready with just about the right size
        //     '-----' is a fretboard with 5 frets and no marks
        //     '--.--:' is a fretboard with 6 frets, a dot in the third fret and double dots in the last fret
        var inlay = $scope.inlayVariation.inlay;
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
}