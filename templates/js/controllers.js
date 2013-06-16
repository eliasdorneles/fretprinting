var App = angular.module('FretsApp', []);

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

    $scope.fretboardRepr = function () {
        // This gets a fretboard representation ready with just about the right size
        //     '-----' is a fretboard with 5 frets and no marks
        //     '--.--:' is a fretboard with 6 frets, a dot in the third fret and double dots in the last fret
        return $scope.inlayVariation.inlay.substr(0, $scope.numFrets);
    }

    var sizeOptions = [
        {
            name: 'Tiny',
            width: '18px',
            height: '24px'
        },
        {
            name: 'Small',
            width: '22px',
            height: '30px'
        },
        {
            name: 'Medium',
            width: '28px',
            height: '38px'
        },
        {
            name: 'Large',
            width: '36px',
            height: '50px'
        },
        {
            name: 'X-Large',
            width: '40px',
            height: '56px'
        }
    ];
    $scope.size = sizeOptions[2]; // default medium
    $scope.sizeOptions = sizeOptions;
}