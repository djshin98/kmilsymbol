/* eslint-disable */

var basic = require("./mil_basic");
var emergency = require("./mil_emergency");
var operAct = require("./mil_operAct");
var safe = require("./mil_safe");
var signal = require("./mil_signal");
var weather = require("./mil_weather");

var codeTypes = [
    { code: "S", desc: "기본군대부호", standard: basic },
    { code: "G", desc: "작전활동부호", standard: operAct },
    { code: "W", desc: "기상 및 해양부호", standard: weather },
    { code: "I", desc: "신호정보부호", standard: signal },
    { code: "O", desc: "안정화작전부호", standard: safe },
    { code: "E", desc: "비상관리부호", standard: emergency }
]

class CodeType {
    constructor(opt) {
        this.activeType;
        this.init(opt.id);
    }
    init(id) {
        let ele = document.querySelector("#" + id);
        let str;
        codeTypes.forEach(d => {
            str += '<option value="' + d.code + '">' + d.desc + '</option>';
        });
        ele.innerHTML = str;
        ele.onchange = function() {

        };
    }
}
class SIDC {
    constructor(sidc) {
        this.extra = "";
        if (!sidc || sidc.length == 0) { sidc = "---------------"; } else if (sidc.length < 15) {
            sidc += "-".repeat(15 - sidc.length);
        } else if (sidc.length > 15) {
            this.extra = sidc.substring(15);
            sidc = sidc.substring(0, 15);
        }
        this.codeType = sidc[0];
        this.affiliation = sidc[1];
        this.battlefield = sidc[2];
        this.status = sidc[3];
        this.modifier = sidc.substring(4, 10); //6
        this.echelon = sidc.substring(10, 12); //2
        this.nation = sidc.substring(12, 14);
        this.mission = sidc[14];
    }
    toCode() {
        return this.codeType + this.affiliation + this.battlefield +
            this.status + this.modifier + this.echelon + this.nation + this.mission;
    }
}

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

function changeMobility(code) {
    let ele = document.getElementById("symbolCode");
    let sidc = new SIDC(ele.value);
    sidc.echelon = code;
    ele.value = sidc.toCode();
    symbolTest.try();
}

function changeModifier(code) {
    let ele = document.getElementById("symbolCode");
    let val = ele.value;
    let sidc = new SIDC(val);
    sidc.modifier = code;
    ele.value = sidc.toCode();
    symbolTest.try();
}

function makeTree(arr) {
    str = "";
    arr.forEach(d => {

        if (d.children && d.children.length > 0) {
            str += '<li ><span class="caret"><div onclick="changeModifier(\'' + d.modifier + '\')">' + d.desc_kor + '</div></span>';
            str += '<ul class="nested">';
            str += makeTree(d.children);
            str += '</ul>';
            str += '</li>';
        } else {
            str += '<li ><div onclick="changeModifier(\'' + d.modifier + '\')">' + d.desc_kor + '</div></li>';
        }
    });
    return str;
}
window.onload = function() {
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "size", id: "symbolSize", type: "input", dataType: "number", dataDefault: 50 }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "sic", id: "symbolCode", type: "input", dataType: "text" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "uniqueDesignation", id: "symbolLabel", type: "input", dataType: "text" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "fill", id: "symbolFill", type: "select", dataType: "bool" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "frame", id: "symbolFrame", type: "select", dataType: "bool" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "monoColor", id: "symbolMonoColor", type: "select", dataType: "text", dataUndefined: "none" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "icon", id: "symbolIcon", type: "select", dataType: "bool" }));

    let codeSel = new CodeType({ id: "codetype" });
    let str = '<ul class="tree-wrapper">';
    str += makeTree(functionIdentifier);
    str += "</ul>";
    document.getElementById("treeModifier").innerHTML = str;

    str = '<ul class="tree-wrapper">';
    Object.keys(size1112).forEach(d => {
        str += '<li><span class="caret">' + d + '</span>';
        str += '<ul class="nested">';
        size1112[d].forEach(item => {
            str += '<li onclick="changeMobility(\'' + item.code + '\')">' + item.desc + '</li>';
        });
        str += '</ul>';
        str += '</li>';
    });
    str += "</ul>";

    document.getElementById("treeMobility").innerHTML = str;

    var toggler = document.getElementsByClassName("caret");
    Array.from(toggler).forEach((d) => {
        d.addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    });

    document.getElementById("affiliation").onchange = (e) => {
        let val = document.getElementById("affiliation").value;
        let ele = document.getElementById("symbolCode");
        let sidc = new SIDC(ele.value);
        sidc.affiliation = val;
        ele.value = sidc.toCode();
        symbolTest.try();
    }
    document.getElementById("battlefield").onchange = (e) => {
        let val = document.getElementById("battlefield").value;
        let ele = document.getElementById("symbolCode");
        let sidc = new SIDC(ele.value);
        sidc.battlefield = val;
        ele.value = sidc.toCode();
        symbolTest.try();
    }
    document.getElementById("status").onchange = (e) => {
        let val = document.getElementById("status").value;
        let ele = document.getElementById("symbolCode");
        let sidc = new SIDC(ele.value);
        sidc.status = val;
        ele.value = sidc.toCode();
        symbolTest.try();
    }
    document.getElementById("mission").onchange = (e) => {
        let val = document.getElementById("mission").value;
        let ele = document.getElementById("symbolCode");
        let sidc = new SIDC(ele.value);
        sidc.mission = val;
        ele.value = sidc.toCode();
        symbolTest.try();
    }
}