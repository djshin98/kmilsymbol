/* eslint-disable */
var symbolTest = {
    create: function(scope) {
        var size = scope.size || 200;
        var symbol = new ms.Symbol(scope.sic, {
            size: size,
            uniqueDesignation: scope.uniqueDesignation
        });
        scope.code = symbol.toDataURL();
        return symbolTest.template(scope.code);
    },
    template: function(result) {
        return '<img class="symbol-sm" src="' + result + '"/>';
    },
    try: function() {
        var size = document.querySelector("#symbolSize");
        var code = document.querySelector("#symbolCode");
        var desc = document.querySelector("#symbolLabel");
        var scope = {
            size: size.value,
            sic: code.value,
            uniqueDesignation: desc.value
        };
        if (scope.sic && scope.sic.length > 0) {
            let output = symbolTest.create(scope);
            let div = document.querySelector("#symbolResult");
            div.innerHTML = output;

        }
    }
};
window.onload = function() {
    var size = document.querySelector("#symbolSize");
    size.onchange = symbolTest.try;
    size.onkeyup = symbolTest.try;

    var code = document.querySelector("#symbolCode");
    code.onchange = symbolTest.try;
    code.onkeyup = symbolTest.try;

    var desc = document.querySelector("#symbolLabel");
    desc.onchange = symbolTest.try;
    desc.onkeyup = symbolTest.try;
}


/*
angular
    .module("symbolTestApp", [])
    .directive("milsymbol", [
        "$log",
        function($log) {
            function createSymbolCode(scope) {
                var size = scope.size || 20;
                var symbol = new ms.Symbol(scope.sic, {
                    size: size,
                    uniqueDesignation: scope.uniqueDesignation
                });
                scope.code = symbol.toDataURL();
                return symbol;
            }

            function link(scope, element, attrs) {
                var mysymbol = createSymbolCode(scope);
                scope.code = mysymbol.toDataURL();

                scope.$watch("sic", function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        mysymbol = createSymbolCode(scope);
                    }
                });
                scope.$watch("uniqueDesignation", function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        mysymbol.setOptions({ uniqueDesignation: scope.uniqueDesignation });
                        scope.code = mysymbol.toDataURL();
                    }
                });

                scope.$watch("size", function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        mysymbol.setOptions({ size: scope.size });
                        scope.code = mysymbol.toDataURL();
                    }
                });
            }

            return {
                restrict: "E",
                replace: true,
                scope: {
                    sic: "@sic",
                    size: "@size",
                    uniqueDesignation: "@"
                },
                template: function(element, attrs) {
                    return '<img class="symbol-sm" ng-src="{{code}}"/>';
                },
                link: link
            };
        }
    ])
    .controller("ListSymbolsController", [
        "$scope",
        function($scope) {
            $scope.symbols = [
                "SFG*UCDSS-*****",
                "SNG*UCDSS-*****",
                "SHG*UCDSS-*****",
                "SUG*UCDSV-*****",
                "SFG*UCDSV-*****",
                "SNG*UCDSV-*****",
                "SHG*UCDSV-*****",
                "SUG*UCDM--*****",
                "SFG*UCDM--*****",
                "SNG*UCDM--*****",
                "SHG*UCDM--*****",
                "SUG*UCDML-*****",
                "SFG*UCDML-*****",
                "SNG*UCDML-*****",
                "SHG*UCDML-*****",
                "SUG*UCDMLA*****",
                "SFG*UCDMLA*****",
                "SNG*UCDMLA*****",
                "SHG*UCDMLA*****"
            ];
        }
    ])
    .controller("SymbolController", [
        "$scope",
        function($scope) {
            $scope.symbolSize = 40;
            $scope.sidc = "SFG-UCI----D";
            $scope.uniqueDesignation = "";
        }
    ]);
    */