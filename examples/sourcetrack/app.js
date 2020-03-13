/* eslint-disable */
class ViewModelElement {
    constructor(options) {
        this.options = Object.assign({}, options);
        let ele = document.querySelector("#" + this.options.id);

        ele.onchange = symbolTest.try;
        if (this.options.type == "input") {
            ele.onkeyup = symbolTest.try;
        }
    }
    dataKey() {
        return this.options.dataKey;
    }
    val(v) {
        if (v) {
            let ele = document.querySelector("#" + this.options.id);
            ele.value = v;
        } else {
            let val = undefined;
            let ele = document.querySelector("#" + this.options.id);
            if (["text", "string"].indexOf(this.options.dataType) >= 0) {
                val = ele.value;
            } else if (["bool", "boolean"].indexOf(this.options.dataType) >= 0) {
                if (ele.value) {
                    let bv = ele.value.toLowerCase();
                    if (bv == "true") val = true;
                    if (bv == "false") val = false;
                }

            } else if (["number"].indexOf(this.options.dataType) >= 0) {
                val = parseFloat(ele.value);
                if (isNaN(val)) val = undefined;
            }

            if (val == undefined && this.options.dataDefault != undefined) {

                return this.options.dataDefault;
            } else {
                if (this.options.dataUndefined && this.options.dataUndefined == val) {
                    return undefined;
                }
                return val;
            }
        }
    }
}
var symbolTest = {
    viewModels: [],
    create: function() {
        var sel = this.viewModels.filter(d => { let v = d.val(); return v != undefined ? true : false; });
        var option = sel.reduce((prev, curr) => { prev[curr.dataKey()] = curr.val(); return prev }, {});
        if (option.sic && option.sic.length > 0) {
            var symbol = new ms.Symbol(option.sic, option);

            option.code = symbol.toDataURL();
            return symbolTest.template(option.code);
        }
    },
    template: function(result) {
        return '<img class="symbol-sm" src="' + result + '"/>';
    },
    try: function() {
        let output = symbolTest.create();
        if (output) {
            let div = document.querySelector("#symbolResult");
            div.innerHTML = output;
        }
    }
};
window.onload = function() {
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "size", id: "symbolSize", type: "input", dataType: "number", dataDefault: 200 }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "sic", id: "symbolCode", type: "input", dataType: "text" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "uniqueDesignation", id: "symbolLabel", type: "input", dataType: "text" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "fill", id: "symbolFill", type: "select", dataType: "bool" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "frame", id: "symbolFrame", type: "select", dataType: "bool" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "monoColor", id: "symbolMonoColor", type: "select", dataType: "text", dataUndefined: "none" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "icon", id: "symbolIcon", type: "select", dataType: "bool" }));
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