(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
/* eslint-disable */

var basic = require("./mil_basic");
var emergency = require("./mil_emergency");
var operAct = require("./mil_operAct");
var safe = require("./mil_safe");
var signal = require("./mil_signal");
var weather = require("./mil_weather");

var codeTypes = [
    { code: "S", desc: "S:기본군대부호", standard: basic },
    { code: "G", desc: "G:작전활동부호", standard: operAct },
    //{ code: "W", desc: "W:기상 및 해양부호", standard: weather },
    { code: "I", desc: "I:신호정보부호", standard: signal },
    { code: "O", desc: "O:안정화작전부호", standard: safe },
    { code: "E", desc: "E:비상관리부호", standard: emergency }
]

function makeSIDCSelect(id, field, obj) {
    let a = document.getElementById(id);
    let txt = "";
    obj.forEach(d => {
        txt += '<option value="' + d.code + '">' + d.desc + '</option>';
    });
    a.innerHTML = txt;
    document.getElementById(id).onchange = (e) => {
        let val = document.getElementById(id).value;
        let ele = document.getElementById("symbolCode");
        let sidc = new SIDC(ele.value);
        sidc.codeType = global.selectedCodeType;
        sidc[field] = val;
        ele.value = sidc.toCode();
        symbolTest.try();
    }
}


global.changeMobility = function(code) {
    let ele = document.getElementById("symbolCode");
    let sidc = new SIDC(ele.value);
    sidc.codeType = global.selectedCodeType;
    sidc.echelon = code;
    ele.value = sidc.toCode();
    symbolTest.try();
}

global.changeModifier = function(code, type, affiliation, battlefield, status) {
        let ele = document.getElementById("symbolCode");
        let val = ele.value;
        let sidc = new SIDC(val);
        sidc.codeType = type;
        if (type != '' && type != '*' && type != '-') document.getElementById("codetype").value = sidc.codeType;
        sidc.affiliation = affiliation;
        if (affiliation != '' && affiliation != '*' && affiliation != '-') {
            document.getElementById("affiliation").value = sidc.affiliation;
        } else {
            sidc.affiliation = document.getElementById("affiliation").value;
        }
        sidc.battlefield = battlefield;
        if (battlefield != '' && battlefield != '*' && battlefield != '-') {
            document.getElementById("battlefield").value = sidc.battlefield;
        } else {
            sidc.battlefield = document.getElementById("battlefield").value;
        }
        sidc.status = status;
        if (status != '' && status != '*' && status != '-') {
            document.getElementById("status").value = sidc.status;
        } else {
            sidc.status = document.getElementById("status").value;
        }
        sidc.modifier = code;
        ele.value = sidc.toCode();
        symbolTest.try();
    }
    //{ id: "1.6.4", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "B-----", desc_kor: "특수작전지원부대", desc_eng: "Sof,unit,support" },
function tooltipModifier(d) {
    return d.type + d.affiliation + d.battlefield + d.status;
}

function _makeModifierTree(id, arr) {
    let str = '<ul class="tree-wrapper">';
    arr.forEach(d => {
        let param = '\'' + d.modifier + '\',\'' + d.type + '\',\'' + d.affiliation + '\',\'' + d.battlefield + '\',\'' + d.status + '\'';
        if (d.children && d.children.length > 0) {
            str += '<li ><span class="caret"><div class="tooltip" onclick="changeModifier(' + param + ')">' + d.desc_kor + '<span class="tooltiptext">' + tooltipModifier(d) + '</span></div></span>';
            str += '<ul class="nested">';
            str += _makeModifierTree(id, d.children);
            str += '</ul>';
            str += '</li>';
        } else {
            str += '<li ><div class="tooltip" onclick="changeModifier(' + param + ')">' + d.desc_kor + '<span class="tooltiptext">' + tooltipModifier(d) + '</span></div></li>';
        }
    });
    str += "</ul>";
    return str;
}

function makeModifierTree(id, arr) {

    document.getElementById(id).innerHTML = _makeModifierTree(id, arr);
}

function makeUnitTree(id, arr) {

    let str = '<ul class="tree-wrapper">';
    Object.keys(arr).forEach(d => {
        str += '<li><span class="caret">' + d + '</span>';
        str += '<ul class="nested">';
        arr[d].forEach(item => {
            str += '<li onclick="changeMobility(\'' + item.code + '\')">' + item.desc + '</li>';
        });
        str += '</ul>';
        str += '</li>';
    });
    str += "</ul>";

    document.getElementById(id).innerHTML = str;
}
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
            let codeType = codeTypes.find(d => { return d.code == ele.value ? true : false; });
            if (codeType) {
                makeSIDCSelect("affiliation", "affiliation", codeType.standard.affiliation);
                makeSIDCSelect("battlefield", "battlefield", codeType.standard.battlefield);
                makeSIDCSelect("status", "status", codeType.standard.status);
                makeSIDCSelect("mission", "mission", codeType.standard.mission);
                makeModifierTree("treeModifier", codeType.standard.identifier);
                makeUnitTree("treeMobility", codeType.standard.unit);

                var toggler = document.getElementsByClassName("caret");
                Array.from(toggler).forEach((d) => {
                    d.addEventListener("click", function() {
                        this.parentElement.querySelector(".nested").classList.toggle("active");
                        this.classList.toggle("caret-down");
                    });
                });

                global.selectedCodeType = codeType.code;
            }
        };
        ele.onchange();
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


window.onload = function() {
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "size", id: "symbolSize", type: "input", dataType: "number", dataDefault: 50 }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "sic", id: "symbolCode", type: "input", dataType: "text" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "uniqueDesignation", id: "symbolLabel", type: "input", dataType: "text" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "fill", id: "symbolFill", type: "select", dataType: "bool" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "frame", id: "symbolFrame", type: "select", dataType: "bool" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "monoColor", id: "symbolMonoColor", type: "select", dataType: "text", dataUndefined: "none" }));
    symbolTest.viewModels.push(new ViewModelElement({ dataKey: "icon", id: "symbolIcon", type: "select", dataType: "bool" }));

    global.selectedCodeTypeObj = new CodeType({ id: "codetype" });




}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./mil_basic":2,"./mil_emergency":3,"./mil_operAct":4,"./mil_safe":5,"./mil_signal":6,"./mil_weather":7}],2:[function(require,module,exports){
/* eslint-disable */



var affiliation_Basic = [
    { code: "P", desc: "식별보류(P / 황색)" },
    { code: "U", desc: "미식별(U / 황색)" },
    { code: "F", desc: "아군(F / 청색)" },
    { code: "N", desc: "중립(N / 녹색)" },
    { code: "H", desc: "적(H / 적색)" },
    { code: "A", desc: "아군간주(A / 청색)" },
    { code: "S", desc: "적군간주(S / 적색)" },
    { code: "G", desc: "훈련 식별보류(G / 황색)" },
    { code: "W", desc: "훈련 미식별(W / 황색)" },
    { code: "D", desc: "훈련 아군(D / 청색)" },
    { code: "L", desc: "훈련 중립(L / 녹색)" },
    { code: "M", desc: "훈련아군간주(M / 청색)" },
    { code: "J", desc: "훈련 의심적(J / 적색)" },
    { code: "K", desc: "훈련 가상적(K / 적색)" }
];

var battlefield_Basic = [
    { code: "P", desc: "우주(P)" },
    { code: "A", desc: "공중(A)" },
    { code: "G", desc: "지상(G)" },
    { code: "S", desc: "해상(S)" },
    { code: "U", desc: "해중(U)" },
    { code: "F", desc: "기동부대(F)" },
    { code: "X", desc: "기타(외형없음:X)" },
    { code: "Z", desc: "미식별(Z)" }
];

var status_Basic = [
    { code: "A", desc: "예상/계획(A)" },
    { code: "P", desc: "현재(P)" },
    { code: "C", desc: "현재 / 정상(C)" },
    { code: "D", desc: "현재 / 손상된(D)" },
    { code: "X", desc: "현재 / 파괴된(X)" },
    { code: "F", desc: "현재 / 최대가동(F)" }
];

var mission_Basic = [
    { code: "A", desc: "공중(A)" },
    { code: "B", desc: "전자(B)" },
    { code: "C", desc: "민간(C)" },
    { code: "G", desc: "지상(G)" },
    { code: "N", desc: "해군(N)" },
    { code: "S", desc: "전략군(S)" }
];

var unit_Basic = {
    "-": [
        { code: "--", desc: " NULL " },
        { code: "-A", desc: " TEAM / CREW 조 / 병사 " },
        { code: "-B", desc: " SQURD 분대 " },
        { code: "-C", desc: " SECTION 반 " },
        { code: "-D", desc: " PLATOON/DETACHMENT 소대 / 분견대 " },
        { code: "-E", desc: " COMPANY / BATTERY / TROOP 중대 / 포대 / 기갑 " },
        { code: "-F", desc: " BATTALION/SQUADRON 대대 / 비행대대 " },
        { code: "-G", desc: " REGIMENT / GROUP 연대 / 단 " },
        { code: "-H", desc: " BRIGADE 여단 " },
        { code: "-I", desc: " DIVISION 사단 " },
        { code: "-J", desc: " CORPS / MEF 군단 " },
        { code: "-K", desc: " ARMY 야전군 " },
        { code: "-L", desc: " ARMY GROUP / FRONT 집단군 " },
        { code: "-M", desc: " REGION 지역군 " },
        { code: "-N", desc: " COMMAND 사령부" }
    ],
    "A": [
        { code: "A-", desc: " HEADQUARTERS(HQ) 지휘소 " },
        { code: "AA", desc: " HQ TEAM / CREW 조 / 병사 지휘소 " },
        { code: "AB", desc: " HQ SQUAD 분대 지휘소 " },
        { code: "AC", desc: " HQ SECTION 반 지휘소 " },
        { code: "AD", desc: " HQ PLATOON/DETACHMENT 소대/분견대 지휘소 " },
        { code: "AE", desc: " HQ COMPANY / BATTERY / TROOP 중대 / 포대 / 기갑 지휘소 " },
        { code: "AF", desc: " HQ BATTALION / SQUADRON 대대/비행대대 지휘소 " },
        { code: "AG", desc: " HQ REGIMENT / GROUP 연대 / 단 지휘소 " },
        { code: "AH", desc: " HQ BRIGADE 여단 지휘소 " },
        { code: "AI", desc: " HQ DIVISION 사단 지휘소 " },
        { code: "AJ", desc: " HQ CORPS / MEF 군단 지휘소 " },
        { code: "AK", desc: " HQ ARMY 야전군 지휘소 " },
        { code: "AL", desc: " HQ ARMY GROUP / FRONT 집단군 지휘소 " },
        { code: "AM", desc: " HQ REGION 지역군 지휘소 " },
        { code: "AN", desc: " HQ COMMAND 사령부 지휘소" }
    ],
    "B": [
        { code: "B-", desc: " TASK FORCE(TF) HQ 기동부대 " },
        { code: "BA", desc: " TF HQ TEAM / CREW 기동부대 조 / 병사 지휘소 " },
        { code: "BB", desc: " TF HQ SQUAD 기동부대 분대 지휘소 " },
        { code: "BC", desc: " TF HQ SECTION 기동부대 반 지휘소 " },
        { code: "BD", desc: " TF HQ PLATOON / DETACHMENT 기동부대 소대 / 분견대 지휘소 " },
        { code: "BE", desc: " TF HQ COMPANY / BATTERY / TROOP 기동부대 중대 / 포대 / 기갑 지휘소 " },
        { code: "BF", desc: " TF HQ BATTALION / SQUADRON 기동부대 대대 / 비행대대 지휘소 " },
        { code: "BG", desc: " TF HQ REGIMENT / GROUP 기동부대 연대 / 단 지휘소 " },
        { code: "BH", desc: " TF HQ BRIGADE 기동부대 여단 지휘소 " },
        { code: "BI", desc: " TF HQ DIVISION 기동부대 사단 지휘소 " },
        { code: "BJ", desc: " TF HQ CORPS/MEF 기동부대 군단 지휘소 BIK TF HQ ARMY 기동부대 야전군 지휘소 " },
        { code: "BL", desc: " TF HQ ARMY GROUP / FRONT 기동부대 집단군 지휘소 " },
        { code: "BM", desc: " TF HQ REGION 기동부대 지역군 지휘소 " },
        { code: "BN", desc: " TF HQ COMMAND 기동부대 사령부 지휘소" }
    ],
    "C": [
        { code: "C-", desc: " FEINT DUMMY(FD) HQ 가장/가상 지휘소 " },
        { code: "CA", desc: " FD HQ TEAM / CREW 가장 / 가상 조 / 병사 지휘소 " },
        { code: "CB", desc: " FD HQ SQUAD 가장 / 가상 분대 지휘소 " },
        { code: "CC", desc: " FD HQ SECTION 가장 / 가상 반 지휘소 " },
        { code: "CD", desc: " FD HQ PLATOON / DETACHMENT 가장 / 가상 소대 / 분견대 지휘소 " },
        { code: "CE", desc: " FD HQ COMPANY / BATTERY / TROOP 가장 / 가상 중대 / 포대 / 기갑 지휘소 " },
        { code: "CF", desc: " FD HQ BATTALION / SQUADRON 가장 / 가상 대대 / 비행대대 지휘소 " },
        { code: "CG", desc: " FD HQ REGIMENT / GROUP 가장 / 가상 연대 / 단 지휘소 " },
        { code: "CH", desc: " FD HQ BRIGADE 가장 / 가상 여단 지휘소 " },
        { code: "CI", desc: " FD HQ DIVISION 가장 / 가상 사단 지휘소 " },
        { code: "CJ", desc: " FD HQ CORPS / MEF 가상 / 가장 군단 지휘소 " },
        { code: "CK", desc: " FD HQ ARMY 가장 / 가상 야전군 지휘소 " },
        { code: "CL", desc: " FD HQ ARMY GROUP / FRONT 가장 / 가상 집단군 지휘소 " },
        { code: "CM", desc: " FD HQ REGION 가장 / 가상 지역군 지휘소 " },
        { code: "CN", desc: " FD HQ COMMAND 가장 / 가상 사령부 지휘소" }
    ],
    "D": [
        { code: "D-", desc: " FEINTDUMMY / TASK FORCE(FD / TF)HQ 가장 / 가상 기동부대 지휘소 " },
        { code: "DA", desc: " FD / TF TEAM / CREW 가장 / 가상 기동부대 조 / 병사 지휘소 " },
        { code: "DB", desc: " FD / TF HQ SQUAD 가장 / 가상 기동부대 분대 지휘소 " },
        { code: "DC", desc: " FD/TF SECTION 가장 / 가상 기동부대 반 지휘소 " },
        { code: "DD", desc: " FD / TF HQ PLATOON / DETACHMENT 가장 / 가상 기동부대 소대 / 분견대 지휘소 " },
        { code: "DE", desc: " FD / TF COMPANY / BATTERY / TROOP 가장 / 가상 기동부대 중대 / 포대 / 기갑 지휘소 " },
        { code: "DF", desc: " FD/TF HQ BATTALION / SQUADRON 가장 / 가상 기동부대 대대 / 비행대대 지휘소 " },
        { code: "DG", desc: " FD / TF REGIMENT / GROUP 가장 / 가상 기동부대 연대/단 지휘소 " },
        { code: "DH", desc: " FD / TF HQ BRIGADE 가장 / 가상 기동부대 여단 지휘소 " },
        { code: "DI", desc: " FD / TF DIVISION 가장 / 가상 기동부대 사단 지휘소 " },
        { code: "DJ", desc: " FD/TF HQ CORPS / MEF 가장 / 가상 기동부대 군단 지휘소 " },
        { code: "DK", desc: " FD / TF ARMY 가장 / 가상 기동부대 야전군 지휘소 " },
        { code: "DL", desc: " FD / TF HQ ARMY GROUP / FRONT 가장 / 가상 기동부대 집단군 지휘소 " },
        { code: "DM", desc: " FD / TF REGION 가장 / 가상 기동부대 지역군 지휘소 " },
        { code: "DN", desc: " FD / TF HQ COMMAND 가장 /가상 기동부대 사령부 지휘소" }
    ],
    "E": [
        { code: "E-", desc: " TASK FORCE(TF) 기동부대 " },
        { code: "EA", desc: " TF TEAM / CREW 기동부대 조 / 병사 " },
        { code: "EB", desc: " TF SQUAD 기동부대 분대 " },
        { code: "EC", desc: " TF SECTION 기동부대 반 " },
        { code: "ED", desc: " TF PLATOON / DETACHMENT 기동부대 소대 / 분견대 " },
        { code: "EE", desc: " TF COMPANY / BATTERY / TROOP 기동부대 중대 / 포대 / 기갑 " },
        { code: "EF", desc: " TF BATTALION / SQUADRON 기동부대 대대 / 비행대대 " },
        { code: "EG", desc: " TF REGIMENT / GROUP 기동부대 연대 / 단 " },
        { code: "EH", desc: " TF BRIGADE 기동부대 여단 " },
        { code: "EI", desc: " TF DIVISION 기동부대 사단 " },
        { code: "EJ", desc: " TF CORPS / MEF 기동부대 군단 " },
        { code: "EK", desc: " TF ARMY 기동부대 야전군 " },
        { code: "EL", desc: " TF ARMY GROUP / FRONT 기동부대 집단군 " },
        { code: "EM", desc: " TF REGION 기동부대 지역군 " },
        { code: "EN", desc: " TF COMMAND 기동부대 사령부" }
    ],
    "F": [
        { code: "F-", desc: " FEINT DUMMY(FD) 가장 / 가상 " },
        { code: "FA", desc: " 'FD TEAM / CREW 가장 / 가상 조 / 병사 " },
        { code: "FB", desc: " 'FD SQUAD 가장 / 가상 분대 " },
        { code: "FC", desc: " 'FD SECTION 가장 / 가상 반 " },
        { code: "FD", desc: " FD PLATOON / DETACHMENT 가장 / 가상 소대 / 분견대 " },
        { code: "FE", desc: " FD COMPANY / BATTERY / TROOP 가장 / 가상 중대 / 포대/기갑 " },
        { code: "FF", desc: " FD BATTALION / SQUADRON 가장 / 가상 대대 / 비행대대 " },
        { code: "FG", desc: " FD REGIMENT / GROUP 가장 / 가상 연대 / 단 " },
        { code: "FH", desc: " FD BRIGADE 가장 / 가상 여단 " },
        { code: "FI", desc: " FD DIVISION 가장 / 가상 사단 " },
        { code: "FJ", desc: " FD CPR[S/MEF 가장 / 가상 군단 " },
        { code: "FK", desc: " FD ARMY 가장 / 가상 야전군 " },
        { code: "FL", desc: " FD ARMY GROUP / FRONT 가장 / 가상 집단군 " },
        { code: "FM", desc: " FD REGION 가장 / 가상 지역군 " },
        { code: "FN", desc: " FD COMMAND 가장 / 가상 사령부" }
    ],
    "G": [
        { code: "G-", desc: " FEINT DUMMY / TASK FORCE(FD / TF) 가장 / 가상 기동부대 " },
        { code: "GA", desc: " FD / TF TEAM / CREW 가장 / 가상 기동부대 조 / 병사 " },
        { code: "GB", desc: " FD / TF SQUAD 가장 / 가상 기동부대 분대 " },
        { code: "GC", desc: " FD / TF SECTION 가장 / 가상 기동부대 반 " },
        { code: "GD", desc: " FD / TF PLATOON / DETACHMENT 가장 / 가상 기동부대 소대 / 분견대 " },
        { code: "GE", desc: " FD/TF COMPANY / BATTERY / TROOP 가장 / 가상 기동부대 중대 / 포대 / 기갑 " },
        { code: "GF", desc: " FD / TF BATTALION / SQUADRON 가장 / 가상 기동부대 대대 / 비행대대 " },
        { code: "GG", desc: " FD / TF REGIMENT / GROUP 가장 / 가상 기동부대 연대 / 단 " },
        { code: "GH", desc: " FD/TF BRIGADE 가장/가상 기동부대 여단 " },
        { code: "GI", desc: " FD / TF DIVISION 가장 / 가상 기동부대 사단 " },
        { code: "GJ", desc: " FD / TF CORPS / MEF 가장 / 가상 기동부대 군단 " },
        { code: "GK", desc: " FD / TF ARMY 가장 / 가상 기동부대 야전군 " },
        { code: "GL", desc: " FD/TF ARMY GROUP/FRONT 가장/가상 기동부대 집단군 " },
        { code: "GM", desc: " FD / TF REGION 가장 / 가상 기동부대 지역군 " },
        { code: "GN", desc: " FD / TF COMMAND 가장 / 가상 기동부대 사령부" }
    ],
    "H": [
        { code: "H-", desc: " INSTALLAION 시설 " },
        { code: "HB", desc: " FEINT DUMMY INSTALLATION 가장 / 가상 시설" }
    ],
    "M": [
        { code: "MO", desc: " MOBILITY WHEELED / LIMITED CROSS COUNTRY 차륜식 " },
        { code: "MP", desc: " MOBILITY CROSS COUNTRY 야지횡단 차륜식 " },
        { code: "MQ", desc: " MOBILITY TRACKED 궤도식 " },
        { code: "MR", desc: " MOBILITY WHEELED AND TRACKED COMBINATION 차륜 궤도식 " },
        { code: "MS", desc: " MOBILITY TOWED 견인식 " },
        { code: "MT", desc: " MOBILITY RAIL 철도식 " },
        { code: "MU", desc: " BOBILITY OVER THE SNOW 설상 이동식 " },
        { code: "MV", desc: " MOBILITY SLED 썰매이동식 " },
        { code: "MW", desc: " MOBILITY PACK ANIMALS 동물견인식 " },
        { code: "MX", desc: " MOBILITY BARGE 선박이동식 " },
        { code: "MY", desc: " MOBILITY AMPHIBIOUS 수륙양용식" }
    ],
    "N": [
        { code: "NS", desc: " TOWED ARRAY (SHORT) 견인 소나 열 (단) " },
        { code: "NL", desc: " TOWED ARRAY (LONG) 견인 소나 열 (장)" }
    ]
};

var functionIdentifier_Basic = [
    { id: "0", type: "S", affiliation: "*", battlefield: "Z", status: "*", modifier: "------", desc_kor: "미식별", desc_eng: "Unknown" },
    {
        id: "1",
        type: "S",
        affiliation: "-",
        battlefield: "-",
        status: "-",
        modifier: "------",
        desc_kor: "기본군대부호",
        desc_eng: "Warfighting,symbols",
        children: [{
                id: "1.1",
                type: "S",
                affiliation: "*",
                battlefield: "P",
                status: "*",
                modifier: "------",
                desc_kor: "우주항적",
                desc_eng: "Space,track",
                children: [
                    { id: "1.1.1", type: "S", affiliation: "*", battlefield: "P", status: "*", modifier: "S-----", desc_kor: "위성", desc_eng: "Satellite" },
                    { id: "1.1.2", type: "S", affiliation: "*", battlefield: "P", status: "*", modifier: "V-----", desc_kor: "우주비행선", desc_eng: "Crewed,space,vehicle" },
                    { id: "1.1.3", type: "S", affiliation: "*", battlefield: "P", status: "*", modifier: "T-----", desc_kor: "우주정거장", desc_eng: "Space,station" },
                    { id: "1.1.4", type: "S", affiliation: "*", battlefield: "P", status: "*", modifier: "L-----", desc_kor: "우주로켓", desc_eng: "Space,launch,vehicle" }
                ]
            },
            {
                id: "1.2",
                type: "S",
                affiliation: "*",
                battlefield: "A",
                status: "*",
                modifier: "------",
                desc_kor: "공중항적",
                desc_eng: "Air,track",
                children: [{
                        id: "1.2.1",
                        type: "S",
                        affiliation: "*",
                        battlefield: "A",
                        status: "*",
                        modifier: "M-----",
                        desc_kor: "공중항적(군용)",
                        desc_eng: "Military",
                        children: [{
                                id: "1.2.1.1",
                                type: "S",
                                affiliation: "*",
                                battlefield: "A",
                                status: "*",
                                modifier: "MF----",
                                desc_kor: "고정익(군용)",
                                desc_eng: "Fixed,wing",
                                children: [
                                    { id: "1.2.1.1.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFB---", desc_kor: "폭격기", desc_eng: "Bomber" },
                                    {
                                        id: "1.2.1.1.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "A",
                                        status: "*",
                                        modifier: "MFF---",
                                        desc_kor: "전투기",
                                        desc_eng: "Fighter",
                                        children: [
                                            { id: "1.2.1.1.2.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFFI--", desc_kor: "요격기", desc_eng: "Interceptor" },
                                            { id: "1.2.1.1.2.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFFA--", desc_kor: "요격기", desc_eng: "Interceptor" }
                                        ]
                                    },
                                    { id: "1.2.1.1.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFT---", desc_kor: "훈련기", desc_eng: "Trainer" },
                                    { id: "1.2.1.1.4", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFA---", desc_kor: "공격기", desc_eng: "Attack/strike" },
                                    { id: "1.2.1.1.5", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFL---", desc_kor: "수직이착륙기", desc_eng: "V/STOL" },
                                    {
                                        id: "1.2.1.1.6",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "A",
                                        status: "*",
                                        modifier: "MFK---",
                                        desc_kor: "공중급유기",
                                        desc_eng: "Tanker",
                                        children: [
                                            { id: "1.2.1.1.6.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFKB--", desc_kor: "공중급유기(Boom)", desc_eng: "Tanker,boom-only" },
                                            { id: "1.2.1.1.6.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFKD--", desc_kor: "공중급유기(Drogue)", desc_eng: "Tanker,drogue-only" }
                                        ]
                                    },
                                    {
                                        id: "1.2.1.1.7",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "A",
                                        status: "*",
                                        modifier: "MFC---",
                                        desc_kor: "수송기",
                                        desc_eng: "Cargo,airlift,(transport)",
                                        children: [
                                            { id: "1.2.1.1.7.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFCL--", desc_kor: "수송기(경)", desc_eng: "Cargo,airlift,(light)" },
                                            { id: "1.2.1.1.7.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFCM--", desc_kor: "수송기(중)", desc_eng: "Cargo,airlift,(medium)" },
                                            { id: "1.2.1.1.7.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFCH--", desc_kor: "수송기(대)", desc_eng: "Cargo,airlift,(heavy)" }
                                        ]
                                    },
                                    { id: "1.2.1.1.8", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFJ---", desc_kor: "전자전기", desc_eng: "Electronic,countermeasures,(ECM/jammer)" },
                                    { id: "1.2.1.1.9", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFO---", desc_kor: "의무후송기", desc_eng: "Medical,evacuation,(MEDEVAC)" },
                                    {
                                        id: "1.2.1.1.10",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "A",
                                        status: "*",
                                        modifier: "MFR---",
                                        desc_kor: "수색정찰기",
                                        desc_eng: "Reconnaissance",
                                        children: [
                                            { id: "1.2.1.1.10.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFRW--", desc_kor: "수색정찰기(공중조기경보)", desc_eng: "Airborne,early,warning,(AEW)" },
                                            { id: "1.2.1.1.10.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFRZ--", desc_kor: "수색정찰기(전자감시)", desc_eng: "Electronic,surveillance,measures" },
                                            { id: "1.2.1.1.10.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFRX--", desc_kor: "수색정찰기(사진)", desc_eng: "Photographic" }
                                        ]
                                    },
                                    {
                                        id: "1.2.1.1.11",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "A",
                                        status: "*",
                                        modifier: "MFP---",
                                        desc_kor: "초계기",
                                        desc_eng: "Patrol",
                                        children: [
                                            { id: "1.2.1.1.11.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFPN--", desc_kor: "대함초계기", desc_eng: "Antisurface,warfare,(ASUW)" },
                                            { id: "1.2.1.1.11.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFPM--", desc_kor: "대기뢰초계기", desc_eng: "Mine,countermeasures" },
                                            { id: "1.2.1.1.11.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFPU--", desc_kor: "대잠초계기", desc_eng: "Antisubmarine,patrol" }
                                        ]
                                    },
                                    {
                                        id: "1.2.1.1.12",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "A",
                                        status: "*",
                                        modifier: "MFU---",
                                        desc_kor: "다목적기",
                                        desc_eng: "Utility",
                                        children: [
                                            { id: "1.2.1.1.12.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFUL--", desc_kor: "다목적기(경)", desc_eng: "Utility,(light)" },
                                            { id: "1.2.1.1.12.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFUM--", desc_kor: "다목적기(중)", desc_eng: "Utility,(medium)" },
                                            { id: "1.2.1.1.12.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFUH--", desc_kor: "다목적기(대)", desc_eng: "Utility,(heavy)" }
                                        ]
                                    },
                                    { id: "1.2.1.1.13", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFY---", desc_kor: "통신항공기", desc_eng: "Communications" },
                                    { id: "1.2.1.1.14", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFH---", desc_kor: "탐색구조기", desc_eng: "Combat,search,and,rescue,(CSAR)" },
                                    { id: "1.2.1.1.15", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFD---", desc_kor: "공중지휘기", desc_eng: "Airborne,command,post,(C2)" },
                                    {
                                        id: "1.2.1.1.16",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "A",
                                        status: "*",
                                        modifier: "MFQ---",
                                        desc_kor: "무인 항공기",
                                        desc_eng: "Drone,(RPV/UAV)",
                                        children: [
                                            { id: "1.2.1.1.16.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQA--", desc_kor: "무인 공격기", desc_eng: "Attack" },
                                            { id: "1.2.1.1.16.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQB--", desc_kor: "무인 폭격기", desc_eng: "Bomber" },
                                            { id: "1.2.1.1.16.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQC--", desc_kor: "무인 수송기", desc_eng: "Cargo" },
                                            { id: "1.2.1.1.16.4", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQD--", desc_kor: "무인 공중 사령기", desc_eng: "Airborne,command,post" },
                                            { id: "1.2.1.1.16.5", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQF--", desc_kor: "무인 전투기", desc_eng: "Fighter" },
                                            { id: "1.2.1.1.16.6", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQH--", desc_kor: "무인 탐색구조기", desc_eng: "Search,and,rescue,(CSAR)" },
                                            { id: "1.2.1.1.16.7", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQJ--", desc_kor: "무인 전파방해기", desc_eng: "Electronic,countermeasures,(jammer)" },
                                            { id: "1.2.1.1.16.8", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQK--", desc_kor: "무인 공중급유기", desc_eng: "Tanker" },
                                            { id: "1.2.1.1.16.9", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQL--", desc_kor: "무인 수직 단거리 이착륙기", desc_eng: "V/STOL" },
                                            { id: "1.2.1.1.16.10", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQM--", desc_kor: "무인 특수작전기", desc_eng: "Special,operations,forces,(SOF)" },
                                            { id: "1.2.1.1.16.11", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQI--", desc_kor: "무인 대기뢰기", desc_eng: "Mine,countermeasures" },
                                            { id: "1.2.1.1.16.12", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQN--", desc_kor: "무인 대수상전 초계기", desc_eng: "Antisurface,warfare,(ASUW)" },
                                            { id: "1.2.1.1.16.13", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQP--", desc_kor: "무인 초계기", desc_eng: "Patrol" },
                                            {
                                                id: "1.2.1.1.16.14",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "A",
                                                status: "*",
                                                modifier: "MFQR--",
                                                desc_kor: "무인 수색정찰기",
                                                desc_eng: "Reconnaissance",
                                                children: [
                                                    { id: "1.2.1.1.16.14.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQRW-", desc_kor: "무인 조기경보기", desc_eng: "Airborne,early,warning,(AEW)" },
                                                    { id: "1.2.1.1.16.14.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQRZ-", desc_kor: "무인 전탐기", desc_eng: "Electronic,surveillance,measures" },
                                                    { id: "1.2.1.1.16.14.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQRX-", desc_kor: "무인 촬영기", desc_eng: "Photographic" }
                                                ]
                                            },
                                            { id: "1.2.1.1.16.15", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQS--", desc_kor: "무인 대잠전 초계기", desc_eng: "Antisubmarine,warfare,(ASW)" },
                                            { id: "1.2.1.1.16.16", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQT--", desc_kor: "무인 훈련기", desc_eng: "Trainer" },
                                            { id: "1.2.1.1.16.17", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQU--", desc_kor: "무인 다목적기", desc_eng: "Utility" },
                                            { id: "1.2.1.1.16.18", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQY--", desc_kor: "무인 통신기", desc_eng: "Communications" },
                                            { id: "1.2.1.1.16.19", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFQO--", desc_kor: "무인 의무후송기", desc_eng: "Medevac" }
                                        ]
                                    },
                                    { id: "1.2.1.1.17", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFS---", desc_kor: "대잠항공기(함재기)", desc_eng: "Antisubmarine,warfare,(ASW),carrier,based" },
                                    { id: "1.2.1.1.18", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MFM---", desc_kor: "특수작전기", desc_eng: "Special,operations,forces,(SOF)" }
                                ]
                            },
                            {
                                id: "1.2.1.2",
                                type: "S",
                                affiliation: "*",
                                battlefield: "A",
                                status: "*",
                                modifier: "MH----",
                                desc_kor: "회전익",
                                desc_eng: "Rotary,wing",
                                children: [
                                    { id: "1.2.1.2.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MH--", desc_kor: "공격헬기", desc_eng: "Attack" },
                                    { id: "1.2.1.2.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHS---", desc_kor: "대잠헬기", desc_eng: "Antisubmarin" },
                                    {
                                        id: "1.2.1.2.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "A",
                                        status: "*",
                                        modifier: "MHU---",
                                        desc_kor: "다목적헬기",
                                        desc_eng: "Utility",
                                        children: [
                                            { id: "1.2.1.2.3.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHUL--", desc_kor: "다목적헬기(경)", desc_eng: "Utility,(light)" },
                                            { id: "1.2.1.2.3.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHUM--", desc_kor: "다목적헬기(중)", desc_eng: "Utility,(medium)" },
                                            { id: "1.2.1.2.3.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHUH--", desc_kor: "다목적헬기(대)", desc_eng: "Utility,(heavy)" }
                                        ]
                                    },
                                    { id: "1.2.1.2.4", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHI---", desc_kor: "대기뢰헬기", desc_eng: "Mine,countermeasures" },
                                    { id: "1.2.1.2.5", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHH---", desc_kor: "탐색구조헬기", desc_eng: "Combat,search,and,rescue,(CSAR)" },
                                    { id: "1.2.1.2.6", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHR---", desc_kor: "수색정찰헬기", desc_eng: "Reconnaissance" },
                                    { id: "1.2.1.2.7", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHQ---", desc_kor: "무인조정헬기", desc_eng: "Drone,(RPV/UA)" },
                                    {
                                        id: "1.2.1.2.8",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "A",
                                        status: "*",
                                        modifier: "MHC---",
                                        desc_kor: "수송헬기",
                                        desc_eng: "Cargo,airlift,(transport)",
                                        children: [
                                            { id: "1.2.1.2.8.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHCL--", desc_kor: "수송헬기(경)", desc_eng: "Cargo,airlift,(light)" },
                                            { id: "1.2.1.2.8.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHCM--", desc_kor: "수송헬기(중)", desc_eng: "Cargo,airlift,(medium)" },
                                            { id: "1.2.1.2.8.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHCH--", desc_kor: "수송헬기(대)", desc_eng: "Cargo,airlift,(heavy)" }
                                        ]
                                    },
                                    { id: "1.2.1.2.9", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHT---", desc_kor: "훈련헬기", desc_eng: "Trainer" },
                                    { id: "1.2.1.2.10", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHO---", desc_kor: "의무후송헬기", desc_eng: "Medevac" },
                                    { id: "1.2.1.2.11", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHM---", desc_kor: "기동부대헬기", desc_eng: "Special,operations,forces,(SOF)" },
                                    { id: "1.2.1.2.12", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHD---", desc_kor: "공수지휘헬기", desc_eng: "Airborne,command,post,(C2)" },
                                    { id: "1.2.1.2.13", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHK---", desc_kor: "공중급유헬기", desc_eng: "Tanker" },
                                    { id: "1.2.1.2.14", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MHJ---", desc_kor: "전파교란헬기", desc_eng: "Electronic,countermeasures,(ECM/jammer)" }
                                ]
                            },
                            { id: "1.2.1.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "ML----", desc_kor: "풍선기구(군용)", desc_eng: "Lighter,than,air" },
                            { id: "1.2.1.4", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "MV----", desc_kor: "VIP", desc_eng: "Very,important,person,(VIP)" },
                            { id: "1.2.1.5", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "ME----", desc_kor: "호위", desc_eng: "Escort" }
                        ]
                    },
                    {
                        id: "1.2.2",
                        type: "S",
                        affiliation: "*",
                        battlefield: "A",
                        status: "*",
                        modifier: "W-----",
                        desc_kor: "공중화기",
                        desc_eng: "Weapon",
                        children: [{
                                id: "1.2.2.1",
                                type: "S",
                                affiliation: "*",
                                battlefield: "A",
                                status: "*",
                                modifier: "WM----",
                                desc_kor: "유도탄(공중)",
                                desc_eng: "Missile,in,flight",
                                children: [{
                                        id: "1.2.2.1.1",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "A",
                                        status: "*",
                                        modifier: "WMS---",
                                        desc_kor: "지대(함)유도탄",
                                        desc_eng: "Surface,launched,missile",
                                        children: [
                                            { id: "1.2.2.1.1.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "WMSS--", desc_kor: "지(함)대지(함)유도탄", desc_eng: "Surface-to-surface,missile,(SSM)" },
                                            { id: "1.2.2.1.1.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "WMS-", desc_kor: "지(함)대공유도탄", desc_eng: "Surface-to-air,missile,(SAM)" },
                                            { id: "1.2.2.1.1.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "WMSU--", desc_kor: "대잠유도탄", desc_eng: "Surface-to-subsurface,missile" },
                                            { id: "1.2.2.1.1.4", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "WMSB--", desc_kor: "탄도탄 요격 유도탄", desc_eng: "Antiballistic,missile,(ABM)" }
                                        ]
                                    },
                                    {
                                        id: "1.2.2.1.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "A",
                                        status: "*",
                                        modifier: "WM--",
                                        desc_kor: "공대유도탄",
                                        desc_eng: "Air,launched,missile",
                                        children: [
                                            { id: "1.2.2.1.2.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "WMAS--", desc_kor: "공대지(함)유도탄", desc_eng: "Air-to-surface,missile,(ASM)" },
                                            { id: "1.2.2.1.2.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "WMA-", desc_kor: "공대공유도탄", desc_eng: "Air-to-air,missile,(AAM)" },
                                            { id: "1.2.2.1.2.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "WMAP--", desc_kor: "공대 우주 유도탄", desc_eng: "Air-to-space,missile" }
                                        ]
                                    },
                                    {
                                        id: "1.2.2.1.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "A",
                                        status: "*",
                                        modifier: "WMU---",
                                        desc_kor: "잠대지(함) 유도탄",
                                        desc_eng: "Subsurface-to-surface,missile,(S/SSM)",
                                        children: [
                                            { id: "1.2.2.1.3.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "WMCM--", desc_kor: "순항유도탄", desc_eng: "Cruise,missile" }
                                        ]
                                    },
                                    { id: "1.2.2.1.4", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "WMB---", desc_kor: "탄도유도탄", desc_eng: "Ballistic,missile" },
                                    { id: "1.2.2.1.5", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "WML---", desc_kor: "지상공격유도탄", desc_eng: "Ground,attack,missile" }
                                ]
                            },
                            { id: "1.2.2.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "WD----", desc_kor: "유인유도탄", desc_eng: "Decoy" },
                            { id: "1.2.2.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "WB----", desc_kor: "폭탄", desc_eng: "Bomb" }
                        ]
                    },
                    {
                        id: "1.2.3",
                        type: "S",
                        affiliation: "*",
                        battlefield: "A",
                        status: "*",
                        modifier: "C-----",
                        desc_kor: "공중항적(민간)",
                        desc_eng: "Civil,aircraft",
                        children: [
                            { id: "1.2.3.1", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "CF----", desc_kor: "고정익(민간)", desc_eng: "Fixed,wing" },
                            { id: "1.2.3.2", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "CH----", desc_kor: "회전익(민간)", desc_eng: "Rotary,wing" },
                            { id: "1.2.3.3", type: "S", affiliation: "*", battlefield: "A", status: "*", modifier: "CL----", desc_kor: "풍선기구(민간)", desc_eng: "Lighter,than,air" }
                        ]
                    }
                ]
            },
            {
                id: "1.3",
                type: "S",
                affiliation: "*",
                battlefield: "G",
                status: "*",
                modifier: "------",
                desc_kor: "지상항적",
                desc_eng: "Ground,track",
                children: [{
                        id: "1.3.1",
                        type: "S",
                        affiliation: "*",
                        battlefield: "G",
                        status: "*",
                        modifier: "U-----",
                        desc_kor: "부대",
                        desc_eng: "Unit",
                        children: [{
                                id: "1.3.1.1",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "UC----",
                                desc_kor: "전투",
                                desc_eng: "Combat",
                                children: [{
                                        id: "1.3.1.1.1",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UCD---",
                                        desc_kor: "방공",
                                        desc_eng: "Air,defense",
                                        children: [{
                                                id: "1.3.1.1.1.1",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCDS--",
                                                desc_kor: "단거리방공",
                                                desc_eng: "Short,range",
                                                children: [
                                                    { id: "1.3.1.1.1.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDSC-", desc_kor: "채퍼럴방공", desc_eng: "Chaparral" },
                                                    { id: "1.3.1.1.1.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDSS-", desc_kor: "스팅거방공", desc_eng: "Stinger" },
                                                    { id: "1.3.1.1.1.1.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDSV-", desc_kor: "발칸방공", desc_eng: "Vulcan" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.1.1.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCDM--",
                                                desc_kor: "방공유도탄",
                                                desc_eng: "Air,defense,missile",
                                                children: [{
                                                        id: "1.3.1.1.1.2.1",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UCDML-",
                                                        desc_kor: "방공유도탄(경)",
                                                        desc_eng: "Air,defense,missile,light",
                                                        children: [
                                                            { id: "1.3.1.1.1.2.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDMLA", desc_kor: "방공유도탄(경-차량화)", desc_eng: "Air,defense,missile,motorized,(Avenger)" }
                                                        ]
                                                    },
                                                    { id: "1.3.1.1.1.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDMM-", desc_kor: "방공유도탄(중)", desc_eng: "Air,defense,missile,medium" },
                                                    { id: "1.3.1.1.1.2.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDMH-", desc_kor: "방공유도탄(대)", desc_eng: "Air,defense,missile,heavy" },
                                                    {
                                                        id: "1.3.1.1.1.2.4",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UCDH--",
                                                        desc_kor: "방공(고고도)",
                                                        desc_eng: "H/MAD",
                                                        children: [
                                                            { id: "1.3.1.1.1.2.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDHH-", desc_kor: "호크방공", desc_eng: "Hawk" },
                                                            { id: "1.3.1.1.1.2.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDHP-", desc_kor: "패트리어트방공", desc_eng: "Patriot" },
                                                            { id: "1.3.1.1.1.2.4.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDHN-", desc_kor: "나이키방공", desc_eng: "Nike" }
                                                        ]
                                                    }
                                                ]
                                            },
                                            { id: "1.3.1.1.1.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDG--", desc_kor: "대공포", desc_eng: "Gun,unit" },
                                            { id: "1.3.1.1.1.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDC--", desc_kor: "복합(포/유도탄)", desc_eng: "Composite" },
                                            { id: "1.3.1.1.1.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDT--", desc_kor: "방공표적획득", desc_eng: "Targeting,unit" },
                                            { id: "1.3.1.1.1.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCDO--", desc_kor: "전구유도탄방어", desc_eng: "Theater,missile,defense,unit" }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.1.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UC--",
                                        desc_kor: "기갑",
                                        desc_eng: "Armor",
                                        children: [{
                                                id: "1.3.1.1.2.1",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCAT--",
                                                desc_kor: "기갑(궤도)",
                                                desc_eng: "Armor,track",
                                                children: [
                                                    { id: "1.3.1.1.2.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAT", desc_kor: "기갑(궤도-공수)", desc_eng: "Armor,track,airborne" },
                                                    {
                                                        id: "1.3.1.1.2.1.2",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UCATW-",
                                                        desc_kor: "기갑(궤도-상륙)",
                                                        desc_eng: "Armor,track,amphibious",
                                                        children: [
                                                            { id: "1.3.1.1.2.1.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCATWR", desc_kor: "기갑(궤도-상륙정비)", desc_eng: "Armor,track,amphibious,recovery" }
                                                        ]
                                                    },
                                                    { id: "1.3.1.1.2.1.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCATL-", desc_kor: "기갑(궤도-경)", desc_eng: "Armor,track,,Light" },
                                                    { id: "1.3.1.1.2.1.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCATM-", desc_kor: "기갑(궤도-중)", desc_eng: "Armor,track,,Medium" },
                                                    { id: "1.3.1.1.2.1.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCATH-", desc_kor: "기갑(궤도-대)", desc_eng: "Armor,track,,Heavy" },
                                                    { id: "1.3.1.1.2.1.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCATR-", desc_kor: "기갑(궤도-정비)", desc_eng: "Armor,track,,Recovery" },
                                                    { id: "1.3.1.1.2.1.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCATD-", desc_kor: "기갑(궤도-방공)", desc_eng: "Armor,track,,Air,defense" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.1.2.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCAW--",
                                                desc_kor: "기갑(차륜)",
                                                desc_eng: "Armor,,wheeled",
                                                children: [
                                                    { id: "1.3.1.1.2.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAWS-", desc_kor: "기갑(차륜-강습)", desc_eng: "Armor,,wheeled,air,assault" },
                                                    { id: "1.3.1.1.2.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAWA-", desc_kor: "기갑(차륜-공수)", desc_eng: "Armor,,wheeled,airborne" },
                                                    {
                                                        id: "1.3.1.1.2.2.3",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UCAWW-",
                                                        desc_kor: "기갑(차륜-상륙)",
                                                        desc_eng: "Armor,,wheeled,amphibious",
                                                        children: [
                                                            { id: "1.3.1.1.2.2.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAWWR", desc_kor: "기갑(차륜-상륙구조)", desc_eng: "Armor,,wheeled,amphibious,recovery" }
                                                        ]
                                                    },
                                                    { id: "1.3.1.1.2.2.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAWL-", desc_kor: "기갑(차륜-경)", desc_eng: "Armor,,wheeled,light" },
                                                    { id: "1.3.1.1.2.2.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAWM-", desc_kor: "기갑(차륜-중)", desc_eng: "Armor,,wheeled,medium" },
                                                    { id: "1.3.1.1.2.2.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAWH-", desc_kor: "기갑(차륜-대)", desc_eng: "Armor,,wheeled,heavy" },
                                                    { id: "1.3.1.1.2.2.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAWR-", desc_kor: "기갑(차륜-정비)", desc_eng: "Armor,,wheeled,recovery" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.1.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UCAA--",
                                        desc_kor: "대전차",
                                        desc_eng: "Antiarmor",
                                        children: [
                                            { id: "1.3.1.1.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAAD-", desc_kor: "대전차(하차)", desc_eng: "Antiarmor,dismounted" },
                                            { id: "1.3.1.1.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAAL-", desc_kor: "대전차(경)", desc_eng: "Antiarmor,light" },
                                            { id: "1.3.1.1.3.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAAM-", desc_kor: "대전차(공수)", desc_eng: "Antiarmor,airborne" },
                                            { id: "1.3.1.1.3.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAAS-", desc_kor: "대전차(강습)", desc_eng: "Antiarmor,air,assault" },
                                            { id: "1.3.1.1.3.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAAU-", desc_kor: "대전차(산악)", desc_eng: "Antiarmor,mountain" },
                                            { id: "1.3.1.1.3.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAAC-", desc_kor: "대전차(빙상)", desc_eng: "Antiarmor,arctic" },
                                            {
                                                id: "1.3.1.1.3.7",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCAAA-",
                                                desc_kor: "대전차기갑",
                                                desc_eng: "Antiarmor,armored",
                                                children: [
                                                    { id: "1.3.1.1.3.7.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAAAT", desc_kor: "대전차기갑(궤도)", desc_eng: "Antiarmor,armored,tracked" },
                                                    { id: "1.3.1.1.3.7.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAAAW", desc_kor: "대전차기갑(차륜)", desc_eng: "Antiarmor,armored,wheeled" },
                                                    { id: "1.3.1.1.3.7.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAAAS", desc_kor: "대전차기갑(강습)", desc_eng: "Antiarmor,armored,air,assault" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.1.3.8",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCAAO-",
                                                desc_kor: "대전차차량화",
                                                desc_eng: "Antiarmor,motorized",
                                                children: [
                                                    { id: "1.3.1.1.3.8.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCAAOS", desc_kor: "대전차차량화(강습)", desc_eng: "Antiarmor,motorized,air,assault" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.1.4",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UCV---",
                                        desc_kor: "항공",
                                        desc_eng: "Aviation",
                                        children: [{
                                                id: "1.3.1.1.4.1",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCVF--",
                                                desc_kor: "고정익항공",
                                                desc_eng: "Fixed,wing",
                                                children: [
                                                    { id: "1.3.1.1.4.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVFU-", desc_kor: "다목적고정익항공", desc_eng: "Utility,fixed,wing" },
                                                    { id: "1.3.1.1.4.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVFA-", desc_kor: "공격고정익항공", desc_eng: "Attack,fixed,wing" },
                                                    { id: "1.3.1.1.4.1.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVFR-", desc_kor: "수색정찰고정익항공", desc_eng: "Recon,fixed,wing" },
                                                    { id: "1.3.1.1.4.1.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVFT-", desc_kor: "고정익항공훈련", desc_eng: "Trainer,fixed,wing" },
                                                    { id: "1.3.1.1.4.1.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVFP-", desc_kor: "초계고정익항공", desc_eng: "Patrol,fixed,wing" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.1.4.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCVR--",
                                                desc_kor: "회전익항공",
                                                desc_eng: "Rotary,wing",
                                                children: [
                                                    { id: "1.3.1.1.4.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVRA-", desc_kor: "공격헬기", desc_eng: "Attack,rotary,wing" },
                                                    { id: "1.3.1.1.4.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVRS-", desc_kor: "수색정찰헬기", desc_eng: "Scout,rotary,wing" },
                                                    { id: "1.3.1.1.4.2.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVRW-", desc_kor: "대잠헬기", desc_eng: "Antisubmarine,warfare,rotary,wing" },
                                                    {
                                                        id: "1.3.1.1.4.2.4",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UCVRU-",
                                                        desc_kor: "다목적헬기",
                                                        desc_eng: "Utility,rotary,wing",
                                                        children: [
                                                            { id: "1.3.1.1.4.2.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVRUL", desc_kor: "다목적헬기(경)", desc_eng: "Light,utility,rotary,wing" },
                                                            { id: "1.3.1.1.4.2.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVRUM", desc_kor: "다목적헬기(중)", desc_eng: "Medium,utility,rotary,wing" },
                                                            { id: "1.3.1.1.4.2.4.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVRUH", desc_kor: "다목적헬기(대)", desc_eng: "Heavy,utility,rotary,wing" }
                                                        ]
                                                    },
                                                    { id: "1.3.1.1.4.2.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVRUC", desc_kor: "지휘통제헬기", desc_eng: "C2,rotary,wing" },
                                                    { id: "1.3.1.1.4.2.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVRUE", desc_kor: "의무후송헬기", desc_eng: "Medevac,rotary,wing" },
                                                    { id: "1.3.1.1.4.2.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVRM-", desc_kor: "대기뢰헬기", desc_eng: "Mine,countermeasure,rotary,wing" }
                                                ]
                                            },
                                            { id: "1.3.1.1.4.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVS--", desc_kor: "탐색구조헬기", desc_eng: "Search,and,rescue" },
                                            { id: "1.3.1.1.4.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVC--", desc_kor: "복합(고정/회전익)", desc_eng: "Composite" },
                                            { id: "1.3.1.1.4.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVV--", desc_kor: "수직이착륙기", desc_eng: "Vertical,and/or,short,takeoff,and,landing,aircraft,(V/STOL)" },
                                            {
                                                id: "1.3.1.1.4.6",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCVU--",
                                                desc_kor: "무인항공기",
                                                desc_eng: "Unmanned,aircraft",
                                                children: [
                                                    { id: "1.3.1.1.4.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVUF-", desc_kor: "무인항공기(고정익)", desc_eng: "Unmanned,aircraft,fixed,wing" },
                                                    { id: "1.3.1.1.4.6.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCVUR-", desc_kor: "무인항공기(회전익)", desc_eng: "Unmanned,aircraft,rotary,wing" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.1.5",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UCI---",
                                        desc_kor: "보병",
                                        desc_eng: "Infantry",
                                        children: [
                                            { id: "1.3.1.1.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCIL--", desc_kor: "보병(경)", desc_eng: "Infantry,light" },
                                            { id: "1.3.1.1.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCIM--", desc_kor: "차량화보병", desc_eng: "Infantry,motorized" },
                                            { id: "1.3.1.1.5.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCIO--", desc_kor: "산악보병", desc_eng: "Infantry,mountain" },
                                            { id: "1.3.1.1.5.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCIA--", desc_kor: "공수보병", desc_eng: "Infantry,airborne" },
                                            { id: "1.3.1.1.5.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCIS--", desc_kor: "강습보병", desc_eng: "Infantry,air,assault" },
                                            { id: "1.3.1.1.5.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCIZ--", desc_kor: "기계화보병", desc_eng: "Infantry,mechanized" },
                                            { id: "1.3.1.1.5.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCIN--", desc_kor: "해군보병", desc_eng: "Infantry,naval" },
                                            { id: "1.3.1.1.5.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCII--", desc_kor: "전투차량화보병", desc_eng: "Infantry,fighting,vehicle" },
                                            { id: "1.3.1.1.5.9", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCIC--", desc_kor: "빙상보병", desc_eng: "Infantry,arctic" },
                                            { id: "1.3.1.1.5.10", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCIP--", desc_kor: "상륙보병", desc_eng: "Infantry,amphibious" },
                                            { id: "1.3.1.1.5.11", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCIB--", desc_kor: "특공", desc_eng: "Infantry,special,force" }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.1.6",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UCE---",
                                        desc_kor: "공병",
                                        desc_eng: "Engineer",
                                        children: [{
                                                id: "1.3.1.1.6.1",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCEC--",
                                                desc_kor: "전투공병",
                                                desc_eng: "Engineer,combat",
                                                children: [
                                                    { id: "1.3.1.1.6.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCECS-", desc_kor: "강습공병", desc_eng: "Engineer,combat,air,assault" },
                                                    { id: "1.3.1.1.6.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCECA-", desc_kor: "공수공병", desc_eng: "Engineer,combat,airborne" },
                                                    { id: "1.3.1.1.6.1.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCECC-", desc_kor: "한대전투공병", desc_eng: "Engineer,combat,arctic" },
                                                    { id: "1.3.1.1.6.1.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCECL-", desc_kor: "전투공병(경)", desc_eng: "Engineer,combat,Light,(Sapper)" },
                                                    { id: "1.3.1.1.6.1.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCECM-", desc_kor: "전투공병(중)", desc_eng: "Engineer,combat,Medium" },
                                                    { id: "1.3.1.1.6.1.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCECH-", desc_kor: "전투공병(대)", desc_eng: "Engineer,combat,Heavy" },
                                                    { id: "1.3.1.1.6.1.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCECT-", desc_kor: "기계화공병", desc_eng: "Engineer,combat,Mechanized,(Track)" },
                                                    { id: "1.3.1.1.6.1.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCECW-", desc_kor: "차량화공병", desc_eng: "Engineer,combat,Motorized" },
                                                    { id: "1.3.1.1.6.1.9", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCECO-", desc_kor: "산악공병", desc_eng: "Engineer,combat,Mountain" },
                                                    { id: "1.3.1.1.6.1.10", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCECR-", desc_kor: "수색정찰공병", desc_eng: "Engineer,combat,Recon" },
                                                    { id: "1.3.1.1.6.1.11", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCECV-", desc_kor: "도하공병", desc_eng: "Engineer,combat,Water,crossing" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.1.6.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCEN--",
                                                desc_kor: "건설공병",
                                                desc_eng: "Engineer,construction",
                                                children: [
                                                    { id: "1.3.1.1.6.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCENN-", desc_kor: "해군건설공병", desc_eng: "Engineer,naval,construction" },
                                                    { id: "1.3.1.1.6.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCENA-", desc_kor: "공군건설공병", desc_eng: "Engineer,air,force,construction" },
                                                    { id: "1.3.1.1.6.2.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCENB-", desc_kor: "도하 및 교량가설", desc_eng: "Engineer,construction,,Water,crossing/Bridge" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.1.7",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UCF---",
                                        desc_kor: "포병(야전)",
                                        desc_eng: "Field,artillery",
                                        children: [{
                                                id: "1.3.1.1.7.1",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCFH--",
                                                desc_kor: "포",
                                                desc_eng: "Howitzer/Gun",
                                                children: [
                                                    { id: "1.3.1.1.7.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFHE-", desc_kor: "자주포", desc_eng: "Self-propelled" },
                                                    { id: "1.3.1.1.7.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFHS-", desc_kor: "강습(포병)", desc_eng: "Air,assault" },
                                                    { id: "1.3.1.1.7.1.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFHA-", desc_kor: "공수(포병)", desc_eng: "Airborne" },
                                                    { id: "1.3.1.1.7.1.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFHC-", desc_kor: "빙상(포병)", desc_eng: "Arctic" },
                                                    { id: "1.3.1.1.7.1.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFHO-", desc_kor: "산악(포병)", desc_eng: "Mountain" },
                                                    { id: "1.3.1.1.7.1.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFHL-", desc_kor: "포(경)", desc_eng: "Light" },
                                                    { id: "1.3.1.1.7.1.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFHM-", desc_kor: "포(중)", desc_eng: "Medium" },
                                                    { id: "1.3.1.1.7.1.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFHH-", desc_kor: "포(대)", desc_eng: "Heavy" },
                                                    { id: "1.3.1.1.7.1.9", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFHX-", desc_kor: "상륙포병", desc_eng: "Amphibious" },
                                                    { id: "1.3.1.1.7.1.10", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFHI-", desc_kor: "기계화포병(보병부대)", desc_eng: "Mechanized,(Infantry)" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.1.7.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCFR--",
                                                desc_kor: "로켓",
                                                desc_eng: "Rocket",
                                                children: [{
                                                        id: "1.3.1.1.7.2.1",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UCFRS-",
                                                        desc_kor: "단연장로켓발사기",
                                                        desc_eng: "Single,rocket,,Launcher",
                                                        children: [
                                                            { id: "1.3.1.1.7.2.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFRSS", desc_kor: "단연장로켓발사기(자주식)", desc_eng: "Single,rocket,,Self-propelled" },
                                                            { id: "1.3.1.1.7.2.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFRSR", desc_kor: "단연장로켓발사기(차량)", desc_eng: "Single,rocket,,Truck" },
                                                            { id: "1.3.1.1.7.2.1.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFRST", desc_kor: "단연장로켓발사기(견인)", desc_eng: "Single,rocket,,Towed" }
                                                        ]
                                                    },
                                                    {
                                                        id: "1.3.1.1.7.2.2",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UCFRM-",
                                                        desc_kor: "다련장로켓발사기",
                                                        desc_eng: "Multiple,rocket,,Launcher",
                                                        children: [
                                                            { id: "1.3.1.1.7.2.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFRMS", desc_kor: "다련장로켓발사기(자주식)", desc_eng: "Multiple,rocket,,Self-propelled" },
                                                            { id: "1.3.1.1.7.2.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFRMR", desc_kor: "다련장로켓발사기(차량)", desc_eng: "Multiple,rocket,,Truck" },
                                                            { id: "1.3.1.1.7.2.2.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFRMT", desc_kor: "다련장로켓발사기(견인)", desc_eng: "Multiple,rocket,,Towed" }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.1.7.3",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCFT--",
                                                desc_kor: "포병표적획득",
                                                desc_eng: "Target,acquisition",
                                                children: [
                                                    { id: "1.3.1.1.7.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFTR-", desc_kor: "포병표적획득(레이다)", desc_eng: "Radar" },
                                                    { id: "1.3.1.1.7.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFTS-", desc_kor: "포병표적획득(음향)", desc_eng: "Sound" },
                                                    { id: "1.3.1.1.7.3.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFTF-", desc_kor: "포병표적획득(광학)", desc_eng: "Flash,(Optical)" },
                                                    {
                                                        id: "1.3.1.1.7.3.4",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UCFTC-",
                                                        desc_kor: "관측반",
                                                        desc_eng: "Colt/fist",
                                                        children: [
                                                            { id: "1.3.1.1.7.3.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFTCD", desc_kor: "관측반(하차)", desc_eng: "Dismounted,colt/Fist" },
                                                            { id: "1.3.1.1.7.3.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFTCM", desc_kor: "관측반(궤도화)", desc_eng: "Tracked,colt/Fist" }
                                                        ]
                                                    },
                                                    { id: "1.3.1.1.7.3.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFTA-", desc_kor: "함포항공연락", desc_eng: "Anglico" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.1.7.4",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCFM--",
                                                desc_kor: "박격포",
                                                desc_eng: "Mortar",
                                                children: [
                                                    { id: "1.3.1.1.7.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFMS-", desc_kor: "박격포(자주궤도식)", desc_eng: "Self-propelled,(SP),tracked,mortar" },
                                                    { id: "1.3.1.1.7.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFMW-", desc_kor: "박격포(자주차륜식)", desc_eng: "Sp,wheeled,mortar" },
                                                    {
                                                        id: "1.3.1.1.7.4.3",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UCFMT-",
                                                        desc_kor: "박격포(견인)",
                                                        desc_eng: "Towed,mortar",
                                                        children: [
                                                            { id: "1.3.1.1.7.4.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFMTA", desc_kor: "박격포(견인-공수)", desc_eng: "Towed,airborne,mortar" },
                                                            { id: "1.3.1.1.7.4.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFMTS", desc_kor: "박격포(견인-강습)", desc_eng: "Towed,air,assault,mortar" },
                                                            { id: "1.3.1.1.7.4.3.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFMTC", desc_kor: "박격포(견인-빙상)", desc_eng: "Towed,arctic,mortar" },
                                                            { id: "1.3.1.1.7.4.3.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFMTO", desc_kor: "박격포(견인-산악)", desc_eng: "Towed,mountain,mortar" }
                                                        ]
                                                    },
                                                    { id: "1.3.1.1.7.4.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFML-", desc_kor: "박격포(상륙)", desc_eng: "Amphibious,mortar" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.1.7.5",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCFS--",
                                                desc_kor: "포병측지",
                                                desc_eng: "Artillery,survey",
                                                children: [
                                                    { id: "1.3.1.1.7.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFSS-", desc_kor: "포병측지(강습)", desc_eng: "Air,assault" },
                                                    { id: "1.3.1.1.7.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFSA-", desc_kor: "포병측지(공수)", desc_eng: "Airborne" },
                                                    { id: "1.3.1.1.7.5.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFSL-", desc_kor: "포병측지(경)", desc_eng: "Light" },
                                                    { id: "1.3.1.1.7.5.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFSO-", desc_kor: "포병측지(산악)", desc_eng: "Mountain" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.1.7.6",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCFO--",
                                                desc_kor: "기상관측",
                                                desc_eng: "Meteorological",
                                                children: [
                                                    { id: "1.3.1.1.7.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFOS-", desc_kor: "기상관측(강습)", desc_eng: "Air,assault,meteorological" },
                                                    { id: "1.3.1.1.7.6.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFOA-", desc_kor: "기상관측(공수)", desc_eng: "Airborne,meteorological" },
                                                    { id: "1.3.1.1.7.6.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFOL-", desc_kor: "기상관측(경)", desc_eng: "Light,meteorological" },
                                                    { id: "1.3.1.1.7.6.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCFOO-", desc_kor: "기상관측(산악)", desc_eng: "Mountain,meteorological" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.1.8",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UCR---",
                                        desc_kor: "수색정찰",
                                        desc_eng: "Reconnaissance",
                                        children: [
                                            { id: "1.3.1.1.8.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRH--", desc_kor: "수색정찰(기병)", desc_eng: "Reconnaissance,,Horse" },
                                            {
                                                id: "1.3.1.1.8.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCRV--",
                                                desc_kor: "수색정찰(기갑)",
                                                desc_eng: "Reconnaissance,,Cavalry",
                                                children: [
                                                    { id: "1.3.1.1.8.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRVA-", desc_kor: "수색정찰(기갑-장갑화)", desc_eng: "Reconnaissance,,Cavalry,armored" },
                                                    { id: "1.3.1.1.8.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRVM-", desc_kor: "수색정찰(기갑-차량화)", desc_eng: "Reconnaissance,,Cavalry,motorized" },
                                                    { id: "1.3.1.1.8.2.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRVG-", desc_kor: "수색정찰(기갑-지상)", desc_eng: "Reconnaissance,,Cavalry,ground" },
                                                    { id: "1.3.1.1.8.2.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRVO-", desc_kor: "수색정찰(기갑-공중)", desc_eng: "Reconnaissance,,Cavalry,air" }
                                                ]
                                            },
                                            { id: "1.3.1.1.8.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRC--", desc_kor: "수색정찰(빙상)", desc_eng: "Reconnaissance,,Arctic" },
                                            { id: "1.3.1.1.8.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRS--", desc_kor: "수색정찰(강습)", desc_eng: "Reconnaissance,,Air,assault" },
                                            { id: "1.3.1.1.8.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRA--", desc_kor: "수색정찰(공수)", desc_eng: "Reconnaissance,,Airborne" },
                                            { id: "1.3.1.1.8.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRO--", desc_kor: "수색정찰(산악)", desc_eng: "Reconnaissance,,Mountain" },
                                            { id: "1.3.1.1.8.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRL--", desc_kor: "수색정찰(경)", desc_eng: "Reconnaissance,,Light" },
                                            {
                                                id: "1.3.1.1.8.8",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCRR--",
                                                desc_kor: "수색정찰(해병)",
                                                desc_eng: "Reconnaissance,,Marine",
                                                children: [
                                                    { id: "1.3.1.1.8.8.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRRD-", desc_kor: "수색정찰(해병-사단)", desc_eng: "Reconnaissance,,Marine,division" },
                                                    { id: "1.3.1.1.8.8.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRRF-", desc_kor: "수색정찰(해병대-원정군)", desc_eng: "Reconnaissance,,Marine,force" },
                                                    { id: "1.3.1.1.8.8.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRRL-", desc_kor: "수색정찰(해병-경무장)", desc_eng: "Reconnaissance,,Marine,light,armored,reconnaissnace,(LAR)" }
                                                ]
                                            },
                                            { id: "1.3.1.1.8.9", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRX--", desc_kor: "수색정찰(광역수색)", desc_eng: "Reconnaissance,,Long,range,surveillance,(LRS)" },
                                            { id: "1.3.1.1.8.10", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCRB--", desc_kor: "수색정찰(기구정찰)", desc_eng: "Reconnaissance,,Lighter,than,air,surveillance" }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.1.9",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UCM---",
                                        desc_kor: "유도탄(지대지)",
                                        desc_eng: "Missile,(Surf-Surf)",
                                        children: [
                                            { id: "1.3.1.1.9.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCMT--", desc_kor: "유도탄(전술)", desc_eng: "Missile,(Surf-Surf),tactical" },
                                            { id: "1.3.1.1.9.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCMS--", desc_kor: "유도탄(전략)", desc_eng: "Missile,(Surf-Surf),strategic" }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.1.10",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UCS---",
                                        desc_kor: "경비부대",
                                        desc_eng: "Internal,security,forces",
                                        children: [
                                            { id: "1.3.1.1.10.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCSW--", desc_kor: "경비부대(강변)", desc_eng: "Riverine" },
                                            {
                                                id: "1.3.1.1.10.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UCSG--",
                                                desc_kor: "경비지상군",
                                                desc_eng: "Ground",
                                                children: [
                                                    { id: "1.3.1.1.10.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCSGD-", desc_kor: "경비지상군(하차)", desc_eng: "Dismounted,ground" },
                                                    { id: "1.3.1.1.10.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCSGM-", desc_kor: "경비지상군(차량화)", desc_eng: "Motorized,ground" },
                                                    { id: "1.3.1.1.10.2.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCSGA-", desc_kor: "경비지상군(기계화)", desc_eng: "Mechanized,ground" }
                                                ]
                                            },
                                            { id: "1.3.1.1.10.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCSM--", desc_kor: "경비지상군(기갑화)", desc_eng: "Wheeled,mechanized" },
                                            { id: "1.3.1.1.10.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCSR--", desc_kor: "경비부대(철도)", desc_eng: "Railroad" },
                                            { id: "1.3.1.1.10.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCSA--", desc_kor: "경비부대(항공)", desc_eng: "Aviation" }
                                        ]
                                    },
                                    { id: "1.3.1.1.11", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UCO---", desc_kor: "관측 및 감시", desc_eng: "Observation,and,surveillance" }
                                ]
                            },
                            {
                                id: "1.3.1.2",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "UU----",
                                desc_kor: "전투지원",
                                desc_eng: "Combat,support",
                                children: [{
                                        id: "1.3.1.2.1",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UUA---",
                                        desc_kor: "화학",
                                        desc_eng: "Combat,support,cbrn",
                                        children: [{
                                                id: "1.3.1.2.1.1",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UUAC--",
                                                desc_kor: "화학전",
                                                desc_eng: "Chemical",
                                                children: [{
                                                        id: "1.3.1.2.1.1.1",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UUACC-",
                                                        desc_kor: "연막/제독",
                                                        desc_eng: "Smoke/Decon",
                                                        children: [
                                                            { id: "1.3.1.2.1.1.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUACCK", desc_kor: "연막/제독(기계화)", desc_eng: "Mechanized,smoke/Decon" },
                                                            { id: "1.3.1.2.1.1.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUACCM", desc_kor: "연막/제독(차량화)", desc_eng: "Motorized,smoke/Decon" }
                                                        ]
                                                    },
                                                    {
                                                        id: "1.3.1.2.1.1.2",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UUACS-",
                                                        desc_kor: "연막",
                                                        desc_eng: "Smoke",
                                                        children: [
                                                            { id: "1.3.1.2.1.1.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUACSM", desc_kor: "연막(차량화)", desc_eng: "Motorized,smoke" },
                                                            { id: "1.3.1.2.1.1.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUACSA", desc_kor: "연막(장갑)", desc_eng: "Armor,smoke" }
                                                        ]
                                                    },
                                                    {
                                                        id: "1.3.1.2.1.1.3",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UUACR-",
                                                        desc_kor: "화학(정찰)",
                                                        desc_eng: "Chemical,recon",
                                                        children: [
                                                            { id: "1.3.1.2.1.1.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUACRW", desc_kor: "화학정찰(기갑)", desc_eng: "Chemical,wheeled,armored,vehicle" },
                                                            { id: "1.3.1.2.1.1.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUACRS", desc_kor: "화학정찰(기갑-정찰감시)", desc_eng: "Chemical,wheeled,armored,vehicle,reconnaissance,surveillance" }
                                                        ]
                                                    }
                                                ]
                                            },
                                            { id: "1.3.1.2.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUAN--", desc_kor: "방사능전", desc_eng: "Nuclear" },
                                            {
                                                id: "1.3.1.2.1.3",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UUAB--",
                                                desc_kor: "생물학전",
                                                desc_eng: "Biological",
                                                children: [
                                                    { id: "1.3.1.2.1.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUABR-", desc_kor: "생물학정찰(장비착용)", desc_eng: "Recon,equipped" }
                                                ]
                                            },
                                            { id: "1.3.1.2.1.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUAD--", desc_kor: "제독", desc_eng: "Decontamination" },
                                            { id: "1.3.1.2.1.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUAW--", desc_kor: "대량살상무기(대응)팀", desc_eng: "Weapon,Mass,Destruction(WMD)" },
                                            { id: "1.3.1.2.1.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUAR--", desc_kor: "화생방(신속대응)팀", desc_eng: "Chemical,Biological,Nuclear,Rapid,Response,Team(CRRT)" }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.2.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UUM---",
                                        desc_kor: "정보",
                                        desc_eng: "Military,intelligence",
                                        children: [
                                            { id: "1.3.1.2.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMA--", desc_kor: "정보(공중감시)", desc_eng: "Aerial,exploitation" },
                                            {
                                                id: "1.3.1.2.2.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UUMS--",
                                                desc_kor: "정보(신호정보-도청)",
                                                desc_eng: "Signal,intelligence,(SIGINT)",
                                                children: [{
                                                    id: "1.3.1.2.2.2.1",
                                                    type: "S",
                                                    affiliation: "*",
                                                    battlefield: "G",
                                                    status: "*",
                                                    modifier: "UUMSE-",
                                                    desc_kor: "전자전",
                                                    desc_eng: "Electronic,warfare",
                                                    children: [
                                                        { id: "1.3.1.2.2.2.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMSEA", desc_kor: "전자전(기갑)", desc_eng: "Armored,wheeled,vehicle" },
                                                        { id: "1.3.1.2.2.2.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMSED", desc_kor: "전파방향탐지", desc_eng: "Direction,finding" },
                                                        { id: "1.3.1.2.2.2.1.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMSEI", desc_kor: "전파도청", desc_eng: "Intercept" },
                                                        { id: "1.3.1.2.2.2.1.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMSEJ", desc_kor: "전파교란", desc_eng: "Jamming" },
                                                        { id: "1.3.1.2.2.2.1.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMSET", desc_kor: "전자전전구", desc_eng: "Theater" },
                                                        { id: "1.3.1.2.2.2.1.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMSEC", desc_kor: "전자전군단", desc_eng: "Corps" },
                                                        { id: "1.3.1.2.2.2.1.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMSEF", desc_kor: "전파탐지", desc_eng: "Radiolocation" }
                                                    ]
                                                }]
                                            },
                                            { id: "1.3.1.2.2.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMC--", desc_kor: "정보(방첩)", desc_eng: "Counterintelligence" },
                                            {
                                                id: "1.3.1.2.2.4",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UUMR--",
                                                desc_kor: "정보(감시)",
                                                desc_eng: "Surveillance",
                                                children: [
                                                    { id: "1.3.1.2.2.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMRG-", desc_kor: "정보지상감시레이다", desc_eng: "Ground,surveillance,radar" },
                                                    {
                                                        id: "1.3.1.2.2.4.2",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "UUMRS-",
                                                        desc_kor: "감시센서",
                                                        desc_eng: "Sensor",
                                                        children: [
                                                            { id: "1.3.1.2.2.4.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMRSS", desc_kor: "감시센서(제어)", desc_eng: "Sensor,scm" }
                                                        ]
                                                    },
                                                    { id: "1.3.1.2.2.4.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMRX-", desc_kor: "감시소", desc_eng: "Ground,station,module" },
                                                    { id: "1.3.1.2.2.4.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMMO-", desc_kor: "정보(기상)", desc_eng: "Meteorological" }
                                                ]
                                            },
                                            { id: "1.3.1.2.2.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMO--", desc_kor: "정보작전", desc_eng: "Operations" },
                                            { id: "1.3.1.2.2.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMT--", desc_kor: "정보(선전전술)", desc_eng: "Tactical,exploit" },
                                            { id: "1.3.1.2.2.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMQ--", desc_kor: "정보(심문)", desc_eng: "Interrogation" },
                                            { id: "1.3.1.2.2.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUMJ--", desc_kor: "합동정보본부", desc_eng: "Joint,intelligence,center" }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.2.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UUL---",
                                        desc_kor: "법시행부대",
                                        desc_eng: "Law,enforcement,unit",
                                        children: [
                                            { id: "1.3.1.2.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UULS--", desc_kor: "해안경비", desc_eng: "Shore,patrol" },
                                            { id: "1.3.1.2.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UULM--", desc_kor: "헌병", desc_eng: "Military,police" },
                                            {
                                                id: "1.3.1.2.3.3",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UULC--",
                                                desc_kor: "민간경찰",
                                                desc_eng: "Civilian,law,enforcement",
                                                children: [
                                                    { id: "1.3.1.2.3.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UULCE-", desc_kor: "통신", desc_eng: "Communication" },
                                                    { id: "1.3.1.2.3.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UULCN-", desc_kor: "해양경찰", desc_eng: "Martime,police" },
                                                    { id: "1.3.1.2.3.3.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UULCA-", desc_kor: "항공경찰", desc_eng: "Aviation,police" },
                                                    { id: "1.3.1.2.3.3.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UULCC-", desc_kor: "전투경찰", desc_eng: "Combat,police" },
                                                    { id: "1.3.1.2.3.3.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UULCM-", desc_kor: "기동대", desc_eng: "Task,force" },
                                                    { id: "1.3.1.2.3.3.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UULCP-", desc_kor: "방범기동대", desc_eng: "Neighborhood,guard" },
                                                    { id: "1.3.1.2.3.3.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UULCG-", desc_kor: "경비대", desc_eng: "Guard" }
                                                ]
                                            },
                                            { id: "1.3.1.2.3.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UULF--", desc_kor: "기무부대", desc_eng: "Security,police,(Air)" },
                                            { id: "1.3.1.2.3.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UULD--", desc_kor: "중앙정보부", desc_eng: "Central,intelligence,division,(CID)" }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.2.4",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UUS---",
                                        desc_kor: "통신",
                                        desc_eng: "Signal,unit",
                                        children: [
                                            { id: "1.3.1.2.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSA--", desc_kor: "통신구역", desc_eng: "Area" },
                                            {
                                                id: "1.3.1.2.4.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UUSC--",
                                                desc_kor: "통신형성패키지",
                                                desc_eng: "Communication,configured,package",
                                                children: [
                                                    { id: "1.3.1.2.4.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSCL-", desc_kor: "통신형성패키지(대)", desc_eng: "Large,communication,configured,package,(LCCP)" }
                                                ]
                                            },
                                            { id: "1.3.1.2.4.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSO--", desc_kor: "통신지휘작전", desc_eng: "Command,operations" },
                                            { id: "1.3.1.2.4.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSF--", desc_kor: "통신전송", desc_eng: "Forward,communications" },
                                            {
                                                id: "1.3.1.2.4.5",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UUSM--",
                                                desc_kor: "다중채널",
                                                desc_eng: "Multiple,subscriber,element",
                                                children: [
                                                    { id: "1.3.1.2.4.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSMS-", desc_kor: "확장단말(소)", desc_eng: "Small,extension,node" },
                                                    { id: "1.3.1.2.4.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSML-", desc_kor: "확장단말(대)", desc_eng: "Large,extension,node" },
                                                    { id: "1.3.1.2.4.5.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSMN-", desc_kor: "단말 본부", desc_eng: "Node,center" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.2.4.6",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "UUSR--",
                                                desc_kor: "무선통신소",
                                                desc_eng: "Radio,unit",
                                                children: [
                                                    { id: "1.3.1.2.4.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSRS-", desc_kor: "전술위성", desc_eng: "Tactical,satellite" },
                                                    { id: "1.3.1.2.4.6.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSRT-", desc_kor: "전신타자", desc_eng: "Teletype,center" },
                                                    { id: "1.3.1.2.4.6.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSRW-", desc_kor: "중계소", desc_eng: "Relay" }
                                                ]
                                            },
                                            { id: "1.3.1.2.4.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSS--", desc_kor: "통신지원", desc_eng: "Signal,support" },
                                            { id: "1.3.1.2.4.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSW--", desc_kor: "교환대", desc_eng: "Telephone,switch" },
                                            { id: "1.3.1.2.4.9", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUSX--", desc_kor: "전자탐지", desc_eng: "Electronic,ranging" },
                                            { id: "1.3.1.2.4.10", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUB---", desc_kor: "민사", desc_eng: "Civil" }
                                        ]
                                    },
                                    { id: "1.3.1.2.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUI---", desc_kor: "정보전부대", desc_eng: "Information,warfare,unit" },
                                    { id: "1.3.1.2.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUP---", desc_kor: "상륙지원", desc_eng: "Landing,support" },
                                    { id: "1.3.1.2.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUE---", desc_kor: "폭발물처리", desc_eng: "Explosive,ordnance,disposal" },
                                    { id: "1.3.1.2.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UUW---", desc_kor: "기상", desc_eng: "Weather" }
                                ]
                            },
                            {
                                id: "1.3.1.3",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "US----",
                                desc_kor: "전투근무지원",
                                desc_eng: "Combat,service,support",
                                children: [{
                                        id: "1.3.1.3.1",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "USA---",
                                        desc_kor: "행정",
                                        desc_eng: "Administrative,(Admin)",
                                        children: [
                                            { id: "1.3.1.3.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAT--", desc_kor: "행정(전구)", desc_eng: "Admin,theater" },
                                            { id: "1.3.1.3.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAC--", desc_kor: "행정(군단)", desc_eng: "Admin,corps" },
                                            {
                                                id: "1.3.1.3.1.3",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USAJ--",
                                                desc_kor: "법무",
                                                desc_eng: "Judge,advocate,general,(JAG)",
                                                children: [
                                                    { id: "1.3.1.3.1.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAJT-", desc_kor: "법무(전구)", desc_eng: "Jag,theater" },
                                                    { id: "1.3.1.3.1.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAJC-", desc_kor: "법무(군단)", desc_eng: "Jag,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.1.4",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USAO--",
                                                desc_kor: "우편",
                                                desc_eng: "Postal",
                                                children: [
                                                    { id: "1.3.1.3.1.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAOT-", desc_kor: "우편(전구)", desc_eng: "Postal,theater" },
                                                    { id: "1.3.1.3.1.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAOC-", desc_kor: "우편(군단)", desc_eng: "Postal,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.1.5",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USAF--",
                                                desc_kor: "경리",
                                                desc_eng: "Finance",
                                                children: [
                                                    { id: "1.3.1.3.1.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAFT-", desc_kor: "경리(전구)", desc_eng: "Finance,theater" },
                                                    { id: "1.3.1.3.1.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAFC-", desc_kor: "경리(군단)", desc_eng: "Finance,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.1.6",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USAS--",
                                                desc_kor: "인사",
                                                desc_eng: "Personnel,services",
                                                children: [
                                                    { id: "1.3.1.3.1.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAST-", desc_kor: "인사(전구)", desc_eng: "Personnel,theater" },
                                                    { id: "1.3.1.3.1.6.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USASC-", desc_kor: "인사(군단)", desc_eng: "Personnel,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.1.7",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USAM--",
                                                desc_kor: "영현",
                                                desc_eng: "Mortuary/Graves,registry",
                                                children: [
                                                    { id: "1.3.1.3.1.7.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAMT-", desc_kor: "영현(전구)", desc_eng: "Mortuary/Graves,registry,theater" },
                                                    { id: "1.3.1.3.1.7.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAMC-", desc_kor: "영현(군단)", desc_eng: "Mortuary/Graves,registry,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.1.8",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USAR--",
                                                desc_kor: "군종",
                                                desc_eng: "Religious/Chaplain",
                                                children: [
                                                    { id: "1.3.1.3.1.8.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USART-", desc_kor: "군종(전구)", desc_eng: "Religious/Chaplain,theater" },
                                                    { id: "1.3.1.3.1.8.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USARC-", desc_kor: "군종(군단)", desc_eng: "Religious/Chaplain,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.1.9",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USAP--",
                                                desc_kor: "공무",
                                                desc_eng: "Public,affairs",
                                                children: [
                                                    { id: "1.3.1.3.1.9.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAPT-", desc_kor: "공무(전구)", desc_eng: "Public,affairs,theater" },
                                                    { id: "1.3.1.3.1.9.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAPC-", desc_kor: "공무(군단)", desc_eng: "Public,affairs,corps" },
                                                    {
                                                        id: "1.3.1.3.1.9.3",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "USAPB-",
                                                        desc_kor: "공무(방송)",
                                                        desc_eng: "Public,affairs,broadcast",
                                                        children: [
                                                            { id: "1.3.1.3.1.9.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAPBT", desc_kor: "공무(전구 방송)", desc_eng: "Public,affairs,broadcast,theater" },
                                                            { id: "1.3.1.3.1.9.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAPBC", desc_kor: "공무(군단 방송)", desc_eng: "Public,affairs,broadcast,corps" }
                                                        ]
                                                    },
                                                    {
                                                        id: "1.3.1.3.1.9.4",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "USAPM-",
                                                        desc_kor: "공무(합동정보국)",
                                                        desc_eng: "Public,affairs,joint,information,bureau,(JIB)",
                                                        children: [
                                                            { id: "1.3.1.3.1.9.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAPMT", desc_kor: "공무(전구 합동정보국)", desc_eng: "Public,affairs,jib,theater" },
                                                            { id: "1.3.1.3.1.9.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAPMC", desc_kor: "공무(군단 합동정보국)", desc_eng: "Public,affairs,jib,corps" }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.1.10",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USAX--",
                                                desc_kor: "보충부대",
                                                desc_eng: "Replacement,holding,unit,(RHU)",
                                                children: [
                                                    { id: "1.3.1.3.1.10.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAXT-", desc_kor: "보충부대(전구)", desc_eng: "RHU,theater" },
                                                    { id: "1.3.1.3.1.10.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAXC-", desc_kor: "보충부대(군단)", desc_eng: "RHU,corps" },
                                                    { id: "1.3.1.3.1.10.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAXP-", desc_kor: "훈련소", desc_eng: "Recruit,training,center" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.1.11",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USAL--",
                                                desc_kor: "노무",
                                                desc_eng: "Labor",
                                                children: [
                                                    { id: "1.3.1.3.1.11.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USALT-", desc_kor: "노무(전구)", desc_eng: "Labor,theater" },
                                                    { id: "1.3.1.3.1.11.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USALC-", desc_kor: "노무(군단)", desc_eng: "Labor,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.1.12",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USAW--",
                                                desc_kor: "사기복지",
                                                desc_eng: "Morale,,welfare,,recreation,(MWR)",
                                                children: [
                                                    { id: "1.3.1.3.1.12.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAWT-", desc_kor: "사기복지(전구)", desc_eng: "MWR,theater" },
                                                    { id: "1.3.1.3.1.12.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAWC-", desc_kor: "사기복지(군단)", desc_eng: "MWR,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.1.13",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USAQ--",
                                                desc_kor: "병참",
                                                desc_eng: "Quartermaster,(Supply)",
                                                children: [
                                                    { id: "1.3.1.3.1.13.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAQT-", desc_kor: "병참(전구)", desc_eng: "Quartermaster,(Supply),theater" },
                                                    { id: "1.3.1.3.1.13.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAQC-", desc_kor: "병참(군단)", desc_eng: "Quartermaster,(Supply),corps" }
                                                ]
                                            },
                                            { id: "1.3.1.3.1.14", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAA--", desc_kor: "병기", desc_eng: "Weapon" },
                                            { id: "1.3.1.3.1.15", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAB--", desc_kor: "예비군", desc_eng: "Reserved" },
                                            { id: "1.3.1.3.1.16", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USAE--", desc_kor: "포로", desc_eng: "Prisoner,of,War(POW)" }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.3.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "USM---",
                                        desc_kor: "의무",
                                        desc_eng: "Medical",
                                        children: [
                                            { id: "1.3.1.3.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USMT--", desc_kor: "의무(전구)", desc_eng: "Medical,theater" },
                                            { id: "1.3.1.3.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USMC--", desc_kor: "의무(군단)", desc_eng: "Medical,corps" },
                                            {
                                                id: "1.3.1.3.2.3",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USMM--",
                                                desc_kor: "의무대",
                                                desc_eng: "Medical,treatment,facility",
                                                children: [
                                                    { id: "1.3.1.3.2.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USMMT-", desc_kor: "의무대(전구)", desc_eng: "Medical,treatment,facility,theater" },
                                                    { id: "1.3.1.3.2.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USMMC-", desc_kor: "의무대(군단)", desc_eng: "Medical,treatment,facility,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.2.4",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USMV--",
                                                desc_kor: "수의",
                                                desc_eng: "Medical,veterinary",
                                                children: [
                                                    { id: "1.3.1.3.2.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USMVT-", desc_kor: "수의(전구)", desc_eng: "Medical,veterinary,theater" },
                                                    { id: "1.3.1.3.2.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USMVC-", desc_kor: "수의(군단)", desc_eng: "Medical,veterinary,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.2.5",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USMD--",
                                                desc_kor: "치과",
                                                desc_eng: "Medical,dental",
                                                children: [
                                                    { id: "1.3.1.3.2.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USMDT-", desc_kor: "치과(전구)", desc_eng: "Medical,dental,theater" },
                                                    { id: "1.3.1.3.2.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USMDC-", desc_kor: "치과(군단)", desc_eng: "Medical,dental,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.2.6",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USMP--",
                                                desc_kor: "의무(신경과)",
                                                desc_eng: "Medical,psychological",
                                                children: [
                                                    { id: "1.3.1.3.2.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USMPT-", desc_kor: "의무신경과(전구)", desc_eng: "Medical,psychological,theater" },
                                                    { id: "1.3.1.3.2.6.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USMPC-", desc_kor: "의무신경과(군단)", desc_eng: "Medical,psychological,corps" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.3.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "USS---",
                                        desc_kor: "보급-군수",
                                        desc_eng: "Supply",
                                        children: [
                                            { id: "1.3.1.3.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USST--", desc_kor: "보급(전구)", desc_eng: "Supply,theater" },
                                            { id: "1.3.1.3.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USSC--", desc_kor: "보급(군단)", desc_eng: "Supply,corps" },
                                            {
                                                id: "1.3.1.3.3.3",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USS1--",
                                                desc_kor: "보급1종(식량)",
                                                desc_eng: "Supply,class,I",
                                                children: [
                                                    { id: "1.3.1.3.3.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS1T-", desc_kor: "보급1종(전구)", desc_eng: "Supply,class,I,theater" },
                                                    { id: "1.3.1.3.3.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS1C-", desc_kor: "보급1종(군단)", desc_eng: "Supply,class,I,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.3.4",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USS2--",
                                                desc_kor: "보급2종(물자)",
                                                desc_eng: "Supply,class,II",
                                                children: [
                                                    { id: "1.3.1.3.3.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS2T-", desc_kor: "보급2종(전구)", desc_eng: "Supply,class,II,theater" },
                                                    { id: "1.3.1.3.3.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS2C-", desc_kor: "보급2종(군단)", desc_eng: "Supply,class,II,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.3.5",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USS3--",
                                                desc_kor: "보급3종(유류)",
                                                desc_eng: "Supply,class,III",
                                                children: [
                                                    { id: "1.3.1.3.3.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS3T-", desc_kor: "보급3종(전구)", desc_eng: "Supply,class,III,theater" },
                                                    { id: "1.3.1.3.3.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS3C-", desc_kor: "보급3종(군단)", desc_eng: "Supply,class,III,corps" },
                                                    {
                                                        id: "1.3.1.3.3.5.3",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "USS3A-",
                                                        desc_kor: "보급3종(항공)",
                                                        desc_eng: "Supply,class,III,aviation",
                                                        children: [
                                                            { id: "1.3.1.3.3.5.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS3AT", desc_kor: "보급3종(항공전구)", desc_eng: "Supply,class,III,aviation,theater" },
                                                            { id: "1.3.1.3.3.5.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS3AC", desc_kor: "보급3종(항공군단)", desc_eng: "Supply,class,III,aviation,corps" }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.3.6",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USS4--",
                                                desc_kor: "보급4종(자재)",
                                                desc_eng: "Supply,class,IV",
                                                children: [
                                                    { id: "1.3.1.3.3.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS4T-", desc_kor: "보급4종(전구)", desc_eng: "Supply,class,IV,theater" },
                                                    { id: "1.3.1.3.3.6.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS4C-", desc_kor: "보급4종(군단)", desc_eng: "Supply,class,IV,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.3.7",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USS5--",
                                                desc_kor: "보급5종(탄약)",
                                                desc_eng: "Supply,class,V",
                                                children: [
                                                    { id: "1.3.1.3.3.7.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS5T-", desc_kor: "보급5종(전구)", desc_eng: "Supply,class,V,theater" },
                                                    { id: "1.3.1.3.3.7.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS5C-", desc_kor: "보급5종(군단)", desc_eng: "Supply,class,V,corps" },
                                                    { id: "1.3.1.3.3.7.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS5M-", desc_kor: "로켓 및 유도탄 탄약", desc_eng: "Supply,rocket/missile,munition" },
                                                    { id: "1.3.1.3.3.7.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS5I-", desc_kor: "보병탄약", desc_eng: "Supply,infantry,munition" },
                                                    { id: "1.3.1.3.3.7.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS5S-", desc_kor: "특수탄약", desc_eng: "Supply,special,munition" },
                                                    { id: "1.3.1.3.3.7.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS5L-", desc_kor: "포병탄약", desc_eng: "Supply,artillery,munition" },
                                                    { id: "1.3.1.3.3.7.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS5A-", desc_kor: "항공탄약", desc_eng: "Supply,aviation,munition" },
                                                    { id: "1.3.1.3.3.7.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS5N-", desc_kor: "해군탄약", desc_eng: "Supply,martime,munition" },
                                                    { id: "1.3.1.3.3.7.9", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS5H-", desc_kor: "화학탄약", desc_eng: "Supply,chemical,munition" },
                                                    { id: "1.3.1.3.3.7.10", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS5R-", desc_kor: "탄약보급 정비부대", desc_eng: "Maintenance,supply,munition" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.3.8",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USS6--",
                                                desc_kor: "보급6종(PX)",
                                                desc_eng: "Supply,class,VI",
                                                children: [
                                                    { id: "1.3.1.3.3.8.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS6T-", desc_kor: "보급6종(전구)", desc_eng: "Supply,class,VI,theater" },
                                                    { id: "1.3.1.3.3.8.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS6C-", desc_kor: "보급6종(군단)", desc_eng: "Supply,class,VI,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.3.9",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USS7--",
                                                desc_kor: "보급7종(장비)",
                                                desc_eng: "Supply,class,VII",
                                                children: [
                                                    { id: "1.3.1.3.3.9.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS7T-", desc_kor: "보급7종(전구)", desc_eng: "Supply,class,VII,theater" },
                                                    { id: "1.3.1.3.3.9.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS7C-", desc_kor: "보급7종(군단)", desc_eng: "Supply,class,VII,corps" },
                                                    { id: "1.3.1.3.3.9.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS7I-", desc_kor: "C4I장비 보급", desc_eng: "Supply,C4I,equipments" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.3.10",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USS8--",
                                                desc_kor: "보급8종(의료)",
                                                desc_eng: "Supply,class,VIII",
                                                children: [
                                                    { id: "1.3.1.3.3.10.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS8T-", desc_kor: "보급8종(전구)", desc_eng: "Supply,class,VIII,theater" },
                                                    { id: "1.3.1.3.3.10.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS8C-", desc_kor: "보급8종(군단)", desc_eng: "Supply,class,VIII,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.3.11",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USS9--",
                                                desc_kor: "보급9종(수리부속)",
                                                desc_eng: "Supply,class,IX",
                                                children: [
                                                    { id: "1.3.1.3.3.11.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS9T-", desc_kor: "보급9종(전구)", desc_eng: "Supply,class,IX,theater" },
                                                    { id: "1.3.1.3.3.11.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USS9C-", desc_kor: "보급9종(군단)", desc_eng: "Supply,class,IX,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.3.12",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USSX--",
                                                desc_kor: "보급10종(비군사적물자)",
                                                desc_eng: "Supply,class,X",
                                                children: [
                                                    { id: "1.3.1.3.3.12.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USSXT-", desc_kor: "보급10종(전구)", desc_eng: "Supply,class,X,theater" },
                                                    { id: "1.3.1.3.3.12.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USSXC-", desc_kor: "보급10종(군단)", desc_eng: "Supply,class,X,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.3.13",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USSL--",
                                                desc_kor: "보급(세탁/목욕)",
                                                desc_eng: "Supply,laundry/Bath",
                                                children: [
                                                    { id: "1.3.1.3.3.13.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USSLT-", desc_kor: "보급(세탁/목욕-전구)", desc_eng: "Supply,laundry/Bath,theater" },
                                                    { id: "1.3.1.3.3.13.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USSLC-", desc_kor: "보급(세탁/목욕-군단)", desc_eng: "Supply,laundry/Bath,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.3.14",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USSW--",
                                                desc_kor: "급수지원",
                                                desc_eng: "Supply,water",
                                                children: [
                                                    { id: "1.3.1.3.3.14.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USSWT-", desc_kor: "급수지원(전구)", desc_eng: "Supply,water,theater" },
                                                    { id: "1.3.1.3.3.14.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USSWC-", desc_kor: "급수지원(군단)", desc_eng: "Supply,water,corps" },
                                                    {
                                                        id: "1.3.1.3.3.14.3",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "USSWP-",
                                                        desc_kor: "급수지원(정화)",
                                                        desc_eng: "Supply,water,purification",
                                                        children: [
                                                            { id: "1.3.1.3.3.14.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USSWPT", desc_kor: "급수지원(정화-전구)", desc_eng: "Supply,water,purification,theater" },
                                                            { id: "1.3.1.3.3.14.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USSWPC", desc_kor: "급수지원(정화-군단)", desc_eng: "Supply,water,purification,corps" }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.3.4",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "UST---",
                                        desc_kor: "수송",
                                        desc_eng: "Transportation",
                                        children: [
                                            { id: "1.3.1.3.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTT--", desc_kor: "수송(전구)", desc_eng: "Transportation,theater" },
                                            { id: "1.3.1.3.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTC--", desc_kor: "수송(군단)", desc_eng: "Transportation,corps" },
                                            {
                                                id: "1.3.1.3.4.3",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USTM--",
                                                desc_kor: "이동통제본부",
                                                desc_eng: "Movement,control,center,(MCC)",
                                                children: [
                                                    { id: "1.3.1.3.4.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTMT-", desc_kor: "이동통제본부(전구)", desc_eng: "Mcc,theater" },
                                                    { id: "1.3.1.3.4.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTMC-", desc_kor: "이동통제본부(군단)", desc_eng: "Mcc,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.4.4",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USTR--",
                                                desc_kor: "철도수송",
                                                desc_eng: "Railhead",
                                                children: [
                                                    { id: "1.3.1.3.4.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTRT-", desc_kor: "철도수송(전구)", desc_eng: "Railhead,theater" },
                                                    { id: "1.3.1.3.4.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTRC-", desc_kor: "철도수송(군단)", desc_eng: "Railhead,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.4.5",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USTS--",
                                                desc_kor: "해상수송",
                                                desc_eng: "SPOD/SPOE",
                                                children: [
                                                    { id: "1.3.1.3.4.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTST-", desc_kor: "해상수송(전구)", desc_eng: "SPOD/SPOE,theater" },
                                                    { id: "1.3.1.3.4.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTSC-", desc_kor: "해상수송(군단)", desc_eng: "SPOD/SPOE,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.4.6",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USTA--",
                                                desc_kor: "항공수송",
                                                desc_eng: "APOD/APOE",
                                                children: [
                                                    { id: "1.3.1.3.4.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTAT-", desc_kor: "항공수송(전구)", desc_eng: "APOD/APOE,theater" },
                                                    { id: "1.3.1.3.4.6.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTAC-", desc_kor: "항공수송(군단)", desc_eng: "APOD/APOE,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.4.7",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USTI--",
                                                desc_kor: "유도탄수송",
                                                desc_eng: "Missile",
                                                children: [
                                                    { id: "1.3.1.3.4.7.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTIT-", desc_kor: "유도탄수송(전구)", desc_eng: "Missile,theater" },
                                                    { id: "1.3.1.3.4.7.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTIC-", desc_kor: "유도탄수송(군단)", desc_eng: "Missile,corps" }
                                                ]
                                            },
                                            { id: "1.3.1.3.4.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USTU--", desc_kor: "보급수송", desc_eng: "Supply,transportation" }
                                        ]
                                    },
                                    {
                                        id: "1.3.1.3.5",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "USX---",
                                        desc_kor: "정비",
                                        desc_eng: "Maintenance",
                                        children: [
                                            { id: "1.3.1.3.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXT--", desc_kor: "정비(전구)", desc_eng: "Maintenance,theater" },
                                            { id: "1.3.1.3.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXC--", desc_kor: "정비(군단)", desc_eng: "Maintenance,corps" },
                                            {
                                                id: "1.3.1.3.5.3",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USXH--",
                                                desc_kor: "정비대",
                                                desc_eng: "Maintenance,heavy",
                                                children: [
                                                    { id: "1.3.1.3.5.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXHT-", desc_kor: "정비대(전구)", desc_eng: "Maintenance,heavy,theater" },
                                                    { id: "1.3.1.3.5.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXHC-", desc_kor: "정비대(군단)", desc_eng: "Maintenance,heavy,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.5.4",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USXR--",
                                                desc_kor: "정비(복구)",
                                                desc_eng: "Maintenance,recovery",
                                                children: [
                                                    { id: "1.3.1.3.5.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXRT-", desc_kor: "정비(복구-전구)", desc_eng: "Maintenance,recovery,theater" },
                                                    { id: "1.3.1.3.5.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXRC-", desc_kor: "정비(복구-군단)", desc_eng: "Maintenance,recovery,corps" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.5.5",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USXO--",
                                                desc_kor: "정비-병기",
                                                desc_eng: "Ordnance",
                                                children: [
                                                    { id: "1.3.1.3.5.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXOT-", desc_kor: "정비-병기(전구)", desc_eng: "Ordnance,theater" },
                                                    { id: "1.3.1.3.5.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXOC-", desc_kor: "정비-병기(군단)", desc_eng: "Ordnance,corps" },
                                                    {
                                                        id: "1.3.1.3.5.5.3",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "USXOM-",
                                                        desc_kor: "정비-유도탄",
                                                        desc_eng: "Ordnance,missile",
                                                        children: [
                                                            { id: "1.3.1.3.5.5.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXOMT", desc_kor: "정비-유도탄(전구)", desc_eng: "Ordnance,missile,theater" },
                                                            { id: "1.3.1.3.5.5.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXOMC", desc_kor: "정비-유도탄(군단)", desc_eng: "Ordnance,missile,corps" }
                                                        ]
                                                    },
                                                    { id: "1.3.1.3.5.5.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXOA-", desc_kor: "정비-항공무기", desc_eng: "Aviation,weapon" }
                                                ]
                                            },
                                            {
                                                id: "1.3.1.3.5.6",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USXE--",
                                                desc_kor: "정비-전자광학",
                                                desc_eng: "Electro-optical",
                                                children: [
                                                    { id: "1.3.1.3.5.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXET-", desc_kor: "정비-전자광학(전구)", desc_eng: "Electro-optical,theater" },
                                                    { id: "1.3.1.3.5.6.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXEC-", desc_kor: "정비-전자광학(군단)", desc_eng: "Electro-optical,corps" }
                                                ]
                                            },
                                            { id: "1.3.1.3.5.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXQ--", desc_kor: "정비-통신", desc_eng: "Communication" },
                                            {
                                                id: "1.3.1.3.5.8",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "USXA--",
                                                desc_kor: "정비-항공",
                                                desc_eng: "Aviation",
                                                children: [
                                                    { id: "1.3.1.3.5.8.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXAE-", desc_kor: "정비-항공전자", desc_eng: "Avionic" }
                                                ]
                                            },
                                            { id: "1.3.1.3.5.9", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXN--", desc_kor: "정비-함정", desc_eng: "Ship" },
                                            { id: "1.3.1.3.5.10", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXD--", desc_kor: "정비-방공포병", desc_eng: "Air,defense,artillery" },
                                            { id: "1.3.1.3.5.11", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXS--", desc_kor: "보급정비", desc_eng: "Supply" },
                                            { id: "1.3.1.3.5.12", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXM--", desc_kor: "의무보급정비", desc_eng: "Medical,supply" },
                                            { id: "1.3.1.3.5.13", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USXP--", desc_kor: "정비-특전장비", desc_eng: "Special,force,equipment" }
                                        ]
                                    },
                                    { id: "1.3.1.3.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USI---", desc_kor: "전산", desc_eng: "Computer" },
                                    { id: "1.3.1.3.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USP---", desc_kor: "인쇄", desc_eng: "Presswork" },
                                    { id: "1.3.1.3.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "USG---", desc_kor: "지도제작", desc_eng: "Cartographic" }
                                ]
                            },
                            { id: "1.3.1.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UH----", desc_kor: "지휘통제소", desc_eng: "Special,C2,headquarters,component" }
                        ]
                    },
                    {
                        id: "1.3.2",
                        type: "S",
                        affiliation: "*",
                        battlefield: "G",
                        status: "*",
                        modifier: "E-----",
                        desc_kor: "지상장비",
                        desc_eng: "Ground,track,equipment",
                        children: [{
                                id: "1.3.2.1",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "EW----",
                                desc_kor: "화기",
                                desc_eng: "Weapon",
                                children: [{
                                        id: "1.3.2.1.1",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EWM---",
                                        desc_kor: "유도탄 발사기",
                                        desc_eng: "Missile,launcher",
                                        children: [{
                                                id: "1.3.2.1.1.1",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EWMA--",
                                                desc_kor: "방공유도탄 발사기",
                                                desc_eng: "Air,defense,(AD),missile,launcher",
                                                children: [{
                                                        id: "1.3.2.1.1.1.1",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "EWMAS-",
                                                        desc_kor: "방공유도탄(단거리) 발사기",
                                                        desc_eng: "Short,range,AD,missile,launcher",
                                                        children: [
                                                            { id: "1.3.2.1.1.1.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMASR", desc_kor: "방공유도탄(단거리) 이동식 발사기", desc_eng: "Transporter,launcher,and,radar,(TLAR)" },
                                                            { id: "1.3.2.1.1.1.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMASE", desc_kor: "방공유도탄(단거리) 이동식 직립 발사기", desc_eng: "Transporter,erector,launcher,and,radar,(TELAR)" }
                                                        ]
                                                    },
                                                    {
                                                        id: "1.3.2.1.1.1.2",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "EWMAI-",
                                                        desc_kor: "방공유도탄(중거리) 발사기",
                                                        desc_eng: "Intermediate,range,ad,missile,launcher",
                                                        children: [
                                                            { id: "1.3.2.1.1.1.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMAIR", desc_kor: "방공유도탄(중거리) 이동식 발사기", desc_eng: "Transporter,launcher,and,radar,(TLAR)" },
                                                            { id: "1.3.2.1.1.1.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMAIE", desc_kor: "방공유도탄(중거리) 이동식 직립 발사기", desc_eng: "Transporter,erector,launcher,and,radar,(TELAR)" }
                                                        ]
                                                    },
                                                    {
                                                        id: "1.3.2.1.1.1.3",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "EWMAL-",
                                                        desc_kor: "방공유도탄(장거리) 발사기",
                                                        desc_eng: "Long,range,ad,missile,launcher",
                                                        children: [
                                                            { id: "1.3.2.1.1.1.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMALR", desc_kor: "방공유도탄(장거리) 이동식 발사기", desc_eng: "Transporter,launcher,and,radar,(TLAR)" },
                                                            { id: "1.3.2.1.1.1.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMALE", desc_kor: "방공유도탄(장거리) 이동식 직립 발사기", desc_eng: "Transporter,erector,launcher,and,radar,(TELAR)" }
                                                        ]
                                                    },
                                                    {
                                                        id: "1.3.2.1.1.1.4",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "EWMAT-",
                                                        desc_kor: "방공유도탄(전구)",
                                                        desc_eng: "Ad,missile,launcher,theater",
                                                        children: [
                                                            { id: "1.3.2.1.1.1.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMATR", desc_kor: "방공유도탄(전구) 이동식 발사기", desc_eng: "Transporter,launcher,and,radar,(TLAR)" },
                                                            { id: "1.3.2.1.1.1.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMATE", desc_kor: "방공유도탄(전구) 이동식 직립 발사기", desc_eng: "Transporter,erector,launcher,and,radar,(TELAR)" }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.1.1.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EWMS--",
                                                desc_kor: "지대지유도탄 발사기",
                                                desc_eng: "Surf-surf,(ss),missile,launcher",
                                                children: [
                                                    { id: "1.3.2.1.1.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMSS-", desc_kor: "지대지유도탄(단거리) 발사기", desc_eng: "Short,range,ss,missile,launcher" },
                                                    { id: "1.3.2.1.1.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMSI-", desc_kor: "지대지유도탄(중거리) 발사기", desc_eng: "Intermediate,range,ss,missile,launcher" },
                                                    { id: "1.3.2.1.1.2.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMSL-", desc_kor: "지대지유도탄(장거리) 발사기", desc_eng: "Long,range,ss,missile,launcher" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.1.1.3",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EWMT--",
                                                desc_kor: "대전차유도탄 발사기",
                                                desc_eng: "Missile,launcher,antitank,(AT)",
                                                children: [
                                                    { id: "1.3.2.1.1.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMTL-", desc_kor: "대전차유도탄(경) 발사기", desc_eng: "Missile,launcher,at,light" },
                                                    { id: "1.3.2.1.1.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMTM-", desc_kor: "대전차유도탄(중) 발사기", desc_eng: "Missile,launcher,at,medium" },
                                                    { id: "1.3.2.1.1.3.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWMTH-", desc_kor: "대전차유도탄(대) 발사기", desc_eng: "Missile,launcher,at,heavy" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.1.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EWS---",
                                        desc_kor: "단연장로켓 발사기",
                                        desc_eng: "Single,rocket,launcher",
                                        children: [
                                            { id: "1.3.2.1.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWSL--", desc_kor: "단연장로켓(경) 발사기", desc_eng: "Single,rocket,launcher,light" },
                                            { id: "1.3.2.1.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWSM--", desc_kor: "단연장로켓(중) 발사기", desc_eng: "Single,rocket,launcher,medium" },
                                            { id: "1.3.2.1.2.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWSH--", desc_kor: "단연장로켓(대) 발사기", desc_eng: "Single,rocket,launcher,heavy" }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.1.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EWX---",
                                        desc_kor: "다련장로켓 발사기",
                                        desc_eng: "Multiple,rocket,launcher",
                                        children: [
                                            { id: "1.3.2.1.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWXL--", desc_kor: "다련장로켓(경) 발사기", desc_eng: "Multiple,rocket,launcher,light" },
                                            { id: "1.3.2.1.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWXM--", desc_kor: "다련장로켓(중) 발사기", desc_eng: "Multiple,rocket,launcher,medium" },
                                            { id: "1.3.2.1.3.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWXH--", desc_kor: "다련장로켓(대) 발사기", desc_eng: "Multiple,rocket,launcher,heavy" }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.1.4",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EWT---",
                                        desc_kor: "대전차로켓 발사기",
                                        desc_eng: "Antitank,rocket,launcher",
                                        children: [
                                            { id: "1.3.2.1.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWTL--", desc_kor: "대전차로켓(경) 발사기", desc_eng: "Antitank,rocket,launcher,light" },
                                            { id: "1.3.2.1.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWTM--", desc_kor: "대전차로켓(중) 발사기", desc_eng: "Antitank,rocket,launcher,medium" },
                                            { id: "1.3.2.1.4.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWTH--", desc_kor: "대전차로켓(대) 발사기", desc_eng: "Antitank,rocket,launcher,heavy" }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.1.5",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EWR---",
                                        desc_kor: "소총/자동무기",
                                        desc_eng: "Rifle/Automatic,weapon",
                                        children: [
                                            { id: "1.3.2.1.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWRR--", desc_kor: "소총", desc_eng: "Rifle" },
                                            { id: "1.3.2.1.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWRL--", desc_kor: "기관총(중)", desc_eng: "Light,machine,gun" },
                                            { id: "1.3.2.1.5.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWRH--", desc_kor: "기관총(대)", desc_eng: "Heavy,machine,gun" }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.1.6",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EWZ---",
                                        desc_kor: "유탄 발사기",
                                        desc_eng: "Grenade,launcher",
                                        children: [
                                            { id: "1.3.2.1.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWZL--", desc_kor: "유탄 발사기(경)", desc_eng: "Grenade,launcher,light" },
                                            { id: "1.3.2.1.6.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWZM--", desc_kor: "유탄 발사기(중)", desc_eng: "Grenade,launcher,medium" },
                                            { id: "1.3.2.1.6.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWZH--", desc_kor: "유탄 발사기(대)", desc_eng: "Grenade,launcher,heavy" }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.1.7",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EWO---",
                                        desc_kor: "박격포",
                                        desc_eng: "Mortar",
                                        children: [
                                            { id: "1.3.2.1.7.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWOL--", desc_kor: "박격포(경)", desc_eng: "Mortar,light" },
                                            { id: "1.3.2.1.7.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWOM--", desc_kor: "박격포(중)", desc_eng: "Mortar,medium" },
                                            { id: "1.3.2.1.7.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWOH--", desc_kor: "박격포(대)", desc_eng: "Mortar,heavy" }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.1.8",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EWH---",
                                        desc_kor: "곡사포",
                                        desc_eng: "Howitzer",
                                        children: [{
                                                id: "1.3.2.1.8.1",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EWHL--",
                                                desc_kor: "곡사포(경)",
                                                desc_eng: "Howitzer,light",
                                                children: [
                                                    { id: "1.3.2.1.8.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWHLS-", desc_kor: "곡사포(경-자주식)", desc_eng: "Howitzer,light,self-propelled" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.1.8.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EWHM--",
                                                desc_kor: "곡사포(중)",
                                                desc_eng: "Howitzer,medium",
                                                children: [
                                                    { id: "1.3.2.1.8.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWHMS-", desc_kor: "곡사포(중-자주식)", desc_eng: "Howitzer,medium,self-propelled" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.1.8.3",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EWHH--",
                                                desc_kor: "곡사포 (대)",
                                                desc_eng: "Howitzer,heavy",
                                                children: [
                                                    { id: "1.3.2.1.8.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWHHS-", desc_kor: "곡사포(대-자주식)", desc_eng: "Howitzer,heavy,self-propelled" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.1.9",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EWG---",
                                        desc_kor: "대전차포",
                                        desc_eng: "Antitank,gun",
                                        children: [
                                            { id: "1.3.2.1.9.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWGL--", desc_kor: "대전차포(경)", desc_eng: "Antitank,gun,light" },
                                            { id: "1.3.2.1.9.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWGM--", desc_kor: "대전차포(중)", desc_eng: "Antitank,gun,medium" },
                                            { id: "1.3.2.1.9.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWGH--", desc_kor: "대전차포(대)", desc_eng: "Antitank,gun,heavy" },
                                            { id: "1.3.2.1.9.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWGR--", desc_kor: "무반동포", desc_eng: "Antitank,gun,recoilless" }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.1.10",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EWD---",
                                        desc_kor: "평사포",
                                        desc_eng: "Direct,fire,gun",
                                        children: [{
                                                id: "1.3.2.1.10.1",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EWDL--",
                                                desc_kor: "평사포(경)",
                                                desc_eng: "Direct,fire,gun,light",
                                                children: [
                                                    { id: "1.3.2.1.10.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWDLS-", desc_kor: "평사포(경-자주식)", desc_eng: "Direct,fire,gun,light,self-propelled" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.1.10.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EWDM--",
                                                desc_kor: "평사포(중)",
                                                desc_eng: "Direct,fire,gun,medium",
                                                children: [
                                                    { id: "1.3.2.1.10.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWDMS-", desc_kor: "평사포(중-자주식)", desc_eng: "Direct,fire,gun,medium,self-propelled" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.1.10.3",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EWDH--",
                                                desc_kor: "평사포(대)",
                                                desc_eng: "Direct,fire,gun,heavy",
                                                children: [
                                                    { id: "1.3.2.1.10.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWDHS-", desc_kor: "평사포(대-자주식)", desc_eng: "Direct,fire,gun,heavy,self-propelled" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.1.11",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EWA---",
                                        desc_kor: "대공포",
                                        desc_eng: "Air,defense,gun",
                                        children: [
                                            { id: "1.3.2.1.11.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWAL--", desc_kor: "대공포(경)", desc_eng: "Air,defense,gun,light" },
                                            { id: "1.3.2.1.11.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWAM--", desc_kor: "대공포(중)", desc_eng: "Air,defense,gun,medium" },
                                            { id: "1.3.2.1.11.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EWAH--", desc_kor: "대공포(대)", desc_eng: "Air,defense,gun,heavy" }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "1.3.2.2",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "EV----",
                                desc_kor: "지상차량",
                                desc_eng: "Ground,vehicle",
                                children: [{
                                        id: "1.3.2.2.1",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EVA---",
                                        desc_kor: "장갑차량",
                                        desc_eng: "Armored,vehicle",
                                        children: [{
                                                id: "1.3.2.2.1.1",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVAT--",
                                                desc_kor: "탱크",
                                                desc_eng: "Tank",
                                                children: [{
                                                        id: "1.3.2.2.1.1.1",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "EVATL-",
                                                        desc_kor: "탱크(경)",
                                                        desc_eng: "Tank,light",
                                                        children: [
                                                            { id: "1.3.2.2.1.1.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVATLR", desc_kor: "탱크(경-정비)", desc_eng: "Tank,light,recovery" }
                                                        ]
                                                    },
                                                    {
                                                        id: "1.3.2.2.1.1.2",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "EVATM-",
                                                        desc_kor: "탱크(중)",
                                                        desc_eng: "Tank,medium",
                                                        children: [
                                                            { id: "1.3.2.2.1.1.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVATMR", desc_kor: "탱크(중-정비)", desc_eng: "Tank,medium,recovery" }
                                                        ]
                                                    },
                                                    {
                                                        id: "1.3.2.2.1.1.3",
                                                        type: "S",
                                                        affiliation: "*",
                                                        battlefield: "G",
                                                        status: "*",
                                                        modifier: "EVATH-",
                                                        desc_kor: "탱크(대)",
                                                        desc_eng: "Tank,heavy",
                                                        children: [
                                                            { id: "1.3.2.2.1.1.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVATHR", desc_kor: "탱크(대-정비)", desc_eng: "Tank,heavy,recovery" }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.2.1.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVAA--",
                                                desc_kor: "수송장갑차",
                                                desc_eng: "Armored,personnel,carrier",
                                                children: [
                                                    { id: "1.3.2.2.1.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVAAR-", desc_kor: "수송장갑차(정비)", desc_eng: "Armored,personnel,carrier,recovery" }
                                                ]
                                            },
                                            { id: "1.3.2.2.1.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVAI--", desc_kor: "장갑보병장갑차", desc_eng: "Armored,infantry" },
                                            { id: "1.3.2.2.1.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVAC--", desc_kor: "지휘통제장갑차", desc_eng: "C2V/ACV" },
                                            { id: "1.3.2.2.1.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVAS--", desc_kor: "전투근무지원차량", desc_eng: "Combat,service,support,vehicle" },
                                            { id: "1.3.2.2.1.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVAL--", desc_kor: "경장갑화차량", desc_eng: "Light,armored,vehicle" },
                                            {
                                                id: "1.3.2.2.1.7",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVAP--",
                                                desc_kor: "상륙용장갑차",
                                                desc_eng: "Amphibious,armored,vehicle",
                                                children: [
                                                    { id: "1.3.2.2.1.7.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVAPP-", desc_kor: "상륙용장갑차(병력수송)", desc_eng: "Amphibious,armored,vehicle" },
                                                    { id: "1.3.2.2.1.7.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVAPH-", desc_kor: "상륙용장갑차(곡사포)", desc_eng: "Amphibious,armored,vehicle(Howitzer)" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.2.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EVU---",
                                        desc_kor: "다목적차량",
                                        desc_eng: "Utility,vehicle",
                                        children: [
                                            { id: "1.3.2.2.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVUB--", desc_kor: "버스", desc_eng: "Bus" },
                                            {
                                                id: "1.3.2.2.2.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVUS--",
                                                desc_kor: "승합",
                                                desc_eng: "Semi",
                                                children: [
                                                    { id: "1.3.2.2.2.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVUSL-", desc_kor: "승합(경)", desc_eng: "Semi,light" },
                                                    { id: "1.3.2.2.2.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVUSM-", desc_kor: "승합(중)", desc_eng: "Semi,medium" },
                                                    { id: "1.3.2.2.2.2.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVUSH-", desc_kor: "승합(대)", desc_eng: "Semi,heavy" }
                                                ]
                                            },
                                            { id: "1.3.2.2.2.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVUL--", desc_kor: "트럭", desc_eng: "Limited,cross-country,truck" },
                                            { id: "1.3.2.2.2.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVUX--", desc_kor: "야지횡단트럭", desc_eng: "Cross-country,truck" },
                                            { id: "1.3.2.2.2.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVUR--", desc_kor: "야지횡단수상트럭", desc_eng: "Water,craft" },
                                            {
                                                id: "1.3.2.2.2.6",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVUT--",
                                                desc_kor: "견인트럭",
                                                desc_eng: "Tow,truck",
                                                children: [
                                                    { id: "1.3.2.2.2.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVUTL-", desc_kor: "견인트럭(경)", desc_eng: "Tow,truck,light" },
                                                    { id: "1.3.2.2.2.6.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVUTH-", desc_kor: "견인트럭(대)", desc_eng: "Tow,truck,heavy" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.2.2.7",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVUA--",
                                                desc_kor: "구급차",
                                                desc_eng: "Ambulance",
                                                children: [
                                                    { id: "1.3.2.2.2.7.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVUAA-", desc_kor: "장갑구급차", desc_eng: "Armored,ambulance" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.2.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EVE---",
                                        desc_kor: "공병차량",
                                        desc_eng: "Engineer,vehicle",
                                        children: [
                                            { id: "1.3.2.2.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVEB--", desc_kor: "교량건설차량", desc_eng: "Bridge" },
                                            { id: "1.3.2.2.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVEE--", desc_kor: "도로건설차량", desc_eng: "Earthmover" },
                                            { id: "1.3.2.2.3.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVEC--", desc_kor: "공병차량", desc_eng: "Construction,vehicle" },
                                            {
                                                id: "1.3.2.2.3.4",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVEM--",
                                                desc_kor: "지뢰매설차량",
                                                desc_eng: "Mine,laying,vehicle",
                                                children: [
                                                    { id: "1.3.2.2.3.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVEMV-", desc_kor: "지뢰매설차량(장갑)", desc_eng: "Armored,carrier,with,volcano" },
                                                    { id: "1.3.2.2.3.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVEML-", desc_kor: "지뢰매설차량(트럭)", desc_eng: "Truck,mounted,with,volcano" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.2.3.5",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVEA--",
                                                desc_kor: "지뢰제거차량",
                                                desc_eng: "Mine,clearing,vehicle",
                                                children: [
                                                    { id: "1.3.2.2.3.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVEAA-", desc_kor: "지뢰제거차량(장갑)", desc_eng: "Armored,mounted,mine,clearing,vehicle" },
                                                    { id: "1.3.2.2.3.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVEAT-", desc_kor: "지뢰제거차량(트레일러)", desc_eng: "Trailer,mounted,mine,clearing,vehicle" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.2.3.6",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVED--",
                                                desc_kor: "불도저",
                                                desc_eng: "Dozer",
                                                children: [
                                                    { id: "1.3.2.2.3.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVEDA-", desc_kor: "장갑화 불도저", desc_eng: "Armored,dozer" }
                                                ]
                                            },
                                            { id: "1.3.2.2.3.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVES--", desc_kor: "장갑강습공병차량", desc_eng: "Armored,assault" },
                                            { id: "1.3.2.2.3.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVER--", desc_kor: "장갑정찰공병차량", desc_eng: "Armored,engineer,recon,vehicle,(AERV)" },
                                            { id: "1.3.2.2.3.9", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVEH--", desc_kor: "굴착기", desc_eng: "Backhoe" },
                                            { id: "1.3.2.2.3.10", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVEF--", desc_kor: "페리 수송차량", desc_eng: "Ferry,transporter" }
                                        ]
                                    },
                                    { id: "1.3.2.2.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVT---", desc_kor: "기관차", desc_eng: "Train,locomotive" },
                                    {
                                        id: "1.3.2.2.5",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EVC---",
                                        desc_kor: "민간 차량",
                                        desc_eng: "Civilian,vehicle",
                                        children: [{
                                                id: "1.3.2.2.5.1",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVCA--",
                                                desc_kor: "승용차",
                                                desc_eng: "Automobile",
                                                children: [
                                                    { id: "1.3.2.2.5.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCAL-", desc_kor: "승용차(소형)", desc_eng: "Compact,automobile" },
                                                    { id: "1.3.2.2.5.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCAM-", desc_kor: "승용차(중형)", desc_eng: "Midsize,automobile" },
                                                    { id: "1.3.2.2.5.1.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCAH-", desc_kor: "승용차(세단)", desc_eng: "Sedan,automobile" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.2.5.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVCO--",
                                                desc_kor: "트럭(개방적재함)",
                                                desc_eng: "Open-bed,truck",
                                                children: [
                                                    { id: "1.3.2.2.5.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCOL-", desc_kor: "픽업", desc_eng: "Pickup,open-bed,truck" },
                                                    { id: "1.3.2.2.5.2.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCOM-", desc_kor: "트럭(개방적재함)(경)", desc_eng: "Small,open-bed,truck" },
                                                    { id: "1.3.2.2.5.2.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCOH-", desc_kor: "트럭(개방적재함)(대)", desc_eng: "Large,open-bed,truck" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.2.5.3",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVCM--",
                                                desc_kor: "다인승 차량",
                                                desc_eng: "Multiple,passenger,vehicle",
                                                children: [
                                                    { id: "1.3.2.2.5.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCML-", desc_kor: "다인승 밴", desc_eng: "Van,multiple,passenger,vehicle" },
                                                    { id: "1.3.2.2.5.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCMM-", desc_kor: "다인승 버스(경)", desc_eng: "Small,bus,multiple,passenger,vehicle" },
                                                    { id: "1.3.2.2.5.3.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCMH-", desc_kor: "다인승 버스(대)", desc_eng: "Large,bus,multiple,passenger,vehicle" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.2.5.4",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVCU--",
                                                desc_kor: "다목적 차량",
                                                desc_eng: "Utility,vehicle",
                                                children: [
                                                    { id: "1.3.2.2.5.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCUL-", desc_kor: "스포트용 다목적 차량", desc_eng: "(SUV),Sport,utility,vehicle,(SUV),,utility,vehicle" },
                                                    { id: "1.3.2.2.5.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCUM-", desc_kor: "다목적 차량(소형 적재함)", desc_eng: "Small,box,truck,,utility,vehicle" },
                                                    { id: "1.3.2.2.5.4.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCUH-", desc_kor: "다목적 차량(대형 적재함)", desc_eng: "Large,box,truck,,utility,vehicle" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.2.5.5",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVCJ--",
                                                desc_kor: "지프형 차량",
                                                desc_eng: "Jeep,type,vehicle",
                                                children: [
                                                    { id: "1.3.2.2.5.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCJL-", desc_kor: "지프형 차량(경)", desc_eng: "Small/Light,jeep,type,vehicle" },
                                                    { id: "1.3.2.2.5.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCJM-", desc_kor: "지프형 차량(중)", desc_eng: "Medium,jeep,type,vehicle" },
                                                    { id: "1.3.2.2.5.5.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCJH-", desc_kor: "지프형 차량(대)", desc_eng: "Large/Heavy,jeep,type,vehicle" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.2.5.6",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVCT--",
                                                desc_kor: "트랙터 운반 트럭(트레일러 박스)",
                                                desc_eng: "Tractor,trailer,truck,with,box,trailer",
                                                children: [
                                                    { id: "1.3.2.2.5.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCTL-", desc_kor: "트랙터 운반 트럭(트레일러 박스)(경)", desc_eng: "Small/Light,box,trailer,,tractor,trailer,truck" },
                                                    { id: "1.3.2.2.5.6.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCTM-", desc_kor: "트랙터 운반 트럭(트레일러 박스)(중)", desc_eng: "Medium,box,trailer,,tractor,trailer,truck" },
                                                    { id: "1.3.2.2.5.6.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCTH-", desc_kor: "트랙터 운반 트럭(트레일러 박스)(대)", desc_eng: "Large/Heavy,box,trailer,,tractor,trailer,truck" }
                                                ]
                                            },
                                            {
                                                id: "1.3.2.2.5.7",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVCF--",
                                                desc_kor: "트랙터 운반 트럭(평상형)",
                                                desc_eng: "Tractor,trailer,truck,with,flatbed,trailer",
                                                children: [
                                                    { id: "1.3.2.2.5.7.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCFL-", desc_kor: "트랙터 운반 트럭(평상형)(경)", desc_eng: "Small/Light,flatbed,trailer,,tractor,trailer,truck" },
                                                    { id: "1.3.2.2.5.7.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCFM-", desc_kor: "트랙터 운반 트럭(평상형)(중)", desc_eng: "Medium,flatbed,trailer,,tractor,trailer,truck" },
                                                    { id: "1.3.2.2.5.7.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVCFH-", desc_kor: "트랙터 운반 트럭(평상형)(대)", desc_eng: "Large/Heavy,flatbed,trailer,,tractor,trailer,truck" }
                                                ]
                                            },
                                            { id: "1.3.2.2.5.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVM---", desc_kor: "운반용 동물", desc_eng: "Pack,animal(s)" },
                                            {
                                                id: "1.3.2.2.5.9",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "EVS---",
                                                desc_kor: "유도탄 지원 차량",
                                                desc_eng: "Missile,support,vehicle",
                                                children: [
                                                    { id: "1.3.2.2.5.9.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVST--", desc_kor: "유도탄 지원 차량(적재)", desc_eng: "Missile,support,vehicle,transloader" },
                                                    { id: "1.3.2.2.5.9.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVSR--", desc_kor: "유도탄 지원 차량(운송)", desc_eng: "Missile,support,vehicle,transporter" },
                                                    { id: "1.3.2.2.5.9.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVSC--", desc_kor: "유도탄 지원 차량(크레인/적재장치)", desc_eng: "Missile,support,vehicle,crane/Loading,device" },
                                                    { id: "1.3.2.2.5.9.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVSP--", desc_kor: "유도탄 지원 차량(추진체 운송)", desc_eng: "Missile,support,vehicle,propellant,transporter" },
                                                    { id: "1.3.2.2.5.9.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EVSW--", desc_kor: "유도탄 지원 차량(탄두 운송)", desc_eng: "Missile,support,vehicle,warhead,transporter" }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "1.3.2.3",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "ES----",
                                desc_kor: "감지기",
                                desc_eng: "Sensor",
                                children: [
                                    { id: "1.3.2.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "ESR---", desc_kor: "레이다", desc_eng: "Radar" },
                                    { id: "1.3.2.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "ESE---", desc_kor: "감지기(고정)", desc_eng: "Emplaced,sensor" }
                                ]
                            },
                            {
                                id: "1.3.2.4",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "EX----",
                                desc_kor: "특수장비",
                                desc_eng: "Special,equipment",
                                children: [
                                    { id: "1.3.2.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXI---", desc_kor: "폭발물(IED)", desc_eng: "Improvised,explosive,device" },
                                    { id: "1.3.2.4.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXL---", desc_kor: "레이저", desc_eng: "Laser" },
                                    { id: "1.3.2.4.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXN---", desc_kor: "화생방장비", desc_eng: "Cbrn,equipment" },
                                    { id: "1.3.2.4.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXF---", desc_kor: "화염방사기", desc_eng: "Flame,thrower" },
                                    {
                                        id: "1.3.2.4.5",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EXM---",
                                        desc_kor: "지뢰",
                                        desc_eng: "Land,mines",
                                        children: [
                                            { id: "1.3.2.4.5.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXMC--", desc_kor: "크레모아", desc_eng: "Claymore" },
                                            { id: "1.3.2.4.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXML--", desc_kor: "지뢰(상해)", desc_eng: "Less,than,lethal" }
                                        ]
                                    },
                                    {
                                        id: "1.3.2.4.6",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "EXC---",
                                        desc_kor: "통신장비",
                                        desc_eng: "Communications,equipment",
                                        children: [
                                            { id: "1.3.2.4.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCB--", desc_kor: "교환기", desc_eng: "Switchboard" },
                                            { id: "1.3.2.4.6.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCD--", desc_kor: "다중집선기", desc_eng: "Multiplex,aggregator" },
                                            { id: "1.3.2.4.6.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCR--", desc_kor: "라우터", desc_eng: "Router" },
                                            { id: "1.3.2.4.6.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCE--", desc_kor: "전술다중장비(단말)", desc_eng: "Tactical,multiplex,equipment(Terminal)" },
                                            { id: "1.3.2.4.6.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCG--", desc_kor: "전술다중장비(중계)", desc_eng: "Tactical,multiplex,equipment(Repeater)" },
                                            { id: "1.3.2.4.6.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCA--", desc_kor: "이동무선기지국", desc_eng: "Mobile,subscriber,base,station" },
                                            { id: "1.3.2.4.6.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCM--", desc_kor: "전술용이동통신장비", desc_eng: "Tactical,moblie,communication,equipment" },
                                            { id: "1.3.2.4.6.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCH--", desc_kor: "위성통신장비", desc_eng: "Satellite,communication,equipment" },
                                            { id: "1.3.2.4.6.9", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCI--", desc_kor: "전투무선장비(단말)", desc_eng: "Combat,radio,equipment(Terminal)" },
                                            { id: "1.3.2.4.6.10", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCJ--", desc_kor: "전투무선장비(중계)", desc_eng: "Combat,radio,equipment(Repeater)" },
                                            { id: "1.3.2.4.6.11", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCK--", desc_kor: "망관리장비", desc_eng: "Network,management,equipment" },
                                            { id: "1.3.2.4.6.12", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCP--", desc_kor: "전화기", desc_eng: "Field,phone" },
                                            { id: "1.3.2.4.6.13", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCF--", desc_kor: "모사전송기", desc_eng: "Facsimile,equipment" },
                                            { id: "1.3.2.4.6.14", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCC--", desc_kor: "컴퓨터", desc_eng: "Computer" },
                                            { id: "1.3.2.4.6.15", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCL--", desc_kor: "광 전송장비", desc_eng: "Optical,transmission,equipment" },
                                            { id: "1.3.2.4.6.16", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "EXCS--", desc_kor: "스위치", desc_eng: "Switch" }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "1.3.3",
                        type: "S",
                        affiliation: "*",
                        battlefield: "G",
                        status: "*",
                        modifier: "I-----",
                        desc_kor: "시설",
                        desc_eng: "Installation",
                        children: [{
                                id: "1.3.3.1",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "IR----",
                                desc_kor: "원료생산/저장",
                                desc_eng: "Raw,material,production/Storage",
                                children: [
                                    { id: "1.3.3.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IRM---", desc_kor: "광산", desc_eng: "Mine" },
                                    { id: "1.3.3.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IRP---", desc_kor: "석유/가스/기름", desc_eng: "Petroleum/Gas/Oil" },
                                    {
                                        id: "1.3.3.1.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "IRN---",
                                        desc_kor: "화생방시설",
                                        desc_eng: "CBRN",
                                        children: [
                                            { id: "1.3.3.1.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IRNB--", desc_kor: "화생방시설(생물학전)", desc_eng: "Biological" },
                                            { id: "1.3.3.1.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IRNC--", desc_kor: "화생방시설(화학전)", desc_eng: "Chemical" },
                                            { id: "1.3.3.1.3.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IRNN--", desc_kor: "화생방시설(방사능전)", desc_eng: "Nuclear" }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "1.3.3.2",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "IP----",
                                desc_kor: "처리설비",
                                desc_eng: "Processing,facility",
                                children: [
                                    { id: "1.3.3.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IPD---", desc_kor: "제독시설", desc_eng: "Decontamination" }
                                ]
                            },
                            { id: "1.3.3.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IE----", desc_kor: "장비제조", desc_eng: "Equipment,manufacture" },
                            {
                                id: "1.3.3.4",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "IU----",
                                desc_kor: "다목적시설",
                                desc_eng: "Service,,research,,utility,facility",
                                children: [
                                    { id: "1.3.3.4.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IUR---", desc_kor: "기술연구소", desc_eng: "Technological,research,facility" },
                                    {
                                        id: "1.3.3.4.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "IUT---",
                                        desc_kor: "전화국",
                                        desc_eng: "Telecommunications,facility",
                                        children: [
                                            { id: "1.3.3.4.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IUTA--", desc_kor: "방송시설", desc_eng: "Broadcasting,facility" }
                                        ]
                                    },
                                    {
                                        id: "1.3.3.4.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "IUE---",
                                        desc_kor: "발전소",
                                        desc_eng: "Electric,power,facility",
                                        children: [
                                            { id: "1.3.3.4.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IUEN--", desc_kor: "핵발전소", desc_eng: "Nuclear,plant" },
                                            { id: "1.3.3.4.3.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IUED--", desc_kor: "수력발전소", desc_eng: "Dam" },
                                            { id: "1.3.3.4.3.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IUEF--", desc_kor: "화력발전소", desc_eng: "Fossil,fuel" },
                                            { id: "1.3.3.4.3.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IUEW--", desc_kor: "풍력/조력발전소", desc_eng: "Wind/Tidal,plant" },
                                            { id: "1.3.3.4.3.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IUEE--", desc_kor: "열병합발전소", desc_eng: "Cogeneration,plant" }
                                        ]
                                    },
                                    { id: "1.3.3.4.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IUP---", desc_kor: "급수시설", desc_eng: "Public,water,services" },
                                    { id: "1.3.3.4.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IUN---", desc_kor: "전력시설", desc_eng: "Power,supply,facility" },
                                    { id: "1.3.3.4.6", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IL----", desc_kor: "재머", desc_eng: "Jammer" }
                                ]
                            },
                            {
                                id: "1.3.3.5",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "IM----",
                                desc_kor: "군수공장",
                                desc_eng: "Military,materiel,facility",
                                children: [{
                                        id: "1.3.3.5.1",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "IMF---",
                                        desc_kor: "핵시설",
                                        desc_eng: "Nuclear,energy",
                                        children: [
                                            { id: "1.3.3.5.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IMFA--", desc_kor: "원자로", desc_eng: "Atomic,energy,reactor" },
                                            {
                                                id: "1.3.3.5.1.2",
                                                type: "S",
                                                affiliation: "*",
                                                battlefield: "G",
                                                status: "*",
                                                modifier: "IMFP--",
                                                desc_kor: "핵물질생산",
                                                desc_eng: "Nuclear,material,production",
                                                children: [
                                                    { id: "1.3.3.5.1.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IMFPW-", desc_kor: "핵물질생산(무기등급)", desc_eng: "Weapons,grade" }
                                                ]
                                            },
                                            { id: "1.3.3.5.1.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IMFS--", desc_kor: "핵물질저장", desc_eng: "Nuclear,material,storage" }
                                        ]
                                    },
                                    { id: "1.3.3.5.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IMA---", desc_kor: "군수공장(항공기)", desc_eng: "Aircraft,production,and,assembly" },
                                    { id: "1.3.3.5.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IME---", desc_kor: "군수공장(탄약/폭약)", desc_eng: "Ammunition,and,explosives,production" },
                                    { id: "1.3.3.5.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IMG---", desc_kor: "군수공장(병기)", desc_eng: "Armament,production" },
                                    { id: "1.3.3.5.5", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IMV---", desc_kor: "군수공장(차량)", desc_eng: "Military,vehicle,production" },
                                    {
                                        id: "1.3.3.5.6",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "IMN---",
                                        desc_kor: "군수공장(공병장비)",
                                        desc_eng: "Engineering,equipment,production",
                                        children: [
                                            { id: "1.3.3.5.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IMNB--", desc_kor: "군수공장(공병장비-교량)", desc_eng: "Bridge" }
                                        ]
                                    },
                                    { id: "1.3.3.5.7", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IMC---", desc_kor: "군수공장(화생방전)", desc_eng: "Chemical,and,biological,warfare,production" },
                                    { id: "1.3.3.5.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IMS---", desc_kor: "군수공장(조선)", desc_eng: "Ship,construction" },
                                    { id: "1.3.3.5.9", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IMM---", desc_kor: "군수공장(유도탄/우주장비)", desc_eng: "Missile,and,space,system,production" },
                                    { id: "1.3.3.5.10", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IMD---", desc_kor: "군수물자공장", desc_eng: "War,supplies,factory" }
                                ]
                            },
                            {
                                id: "1.3.3.6",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "IG----",
                                desc_kor: "국가중요시설",
                                desc_eng: "Government,leadership",
                                children: [
                                    { id: "1.3.3.6.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IGA---", desc_kor: "대사관 및 영사관", desc_eng: "Embassy" }
                                ]
                            },
                            {
                                id: "1.3.3.7",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "IB----",
                                desc_kor: "군용기지",
                                desc_eng: "Military,base/Facility",
                                children: [{
                                        id: "1.3.3.7.1",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "IBA---",
                                        desc_kor: "공항/공군기지",
                                        desc_eng: "Airport/Airbase",
                                        children: [
                                            { id: "1.3.3.7.1.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IBAP--", desc_kor: "공항", desc_eng: "Airport" },
                                            { id: "1.3.3.7.1.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IBAR--", desc_kor: "비행장", desc_eng: "Airfield" },
                                            { id: "1.3.3.7.1.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IBAE--", desc_kor: "비상활주로", desc_eng: "Emergency,runway" },
                                            { id: "1.3.3.7.1.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IBAH--", desc_kor: "헬기장", desc_eng: "Heliport" }
                                        ]
                                    },
                                    {
                                        id: "1.3.3.7.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "IBN---",
                                        desc_kor: "항구/해군기지",
                                        desc_eng: "Seaport/Naval,base",
                                        children: [
                                            { id: "1.3.3.7.2.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IBND--", desc_kor: "해안방어유도탄기지", desc_eng: "해안방어유도탄기지" }
                                        ]
                                    },
                                    {
                                        id: "1.3.3.7.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "G",
                                        status: "*",
                                        modifier: "IBG---",
                                        desc_kor: "육군기지",
                                        desc_eng: "육군기지",
                                        children: [
                                            { id: "1.3.3.7.3.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IBGA--", desc_kor: "갱도포병기지", desc_eng: "갱도포병기지" }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "1.3.3.8",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "IT----",
                                desc_kor: "수송설비",
                                desc_eng: "Transport,facility",
                                children: [
                                    { id: "1.3.3.8.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "ITA---", desc_kor: "조차장", desc_eng: "Switchyard" }
                                ]
                            },
                            {
                                id: "1.3.3.9",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "IX----",
                                desc_kor: "의료설비",
                                desc_eng: "Medical,facility",
                                children: [
                                    { id: "1.3.3.9.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IXH---", desc_kor: "병원", desc_eng: "Hospital" }
                                ]
                            },
                            { id: "1.3.3.10", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IC----", desc_kor: "전산시설", desc_eng: "Data,center" },
                            { id: "1.3.3.11", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IN----", desc_kor: "인쇄창", desc_eng: "Printing,house" },
                            { id: "1.3.3.12", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IA----", desc_kor: "지도창", desc_eng: "Mapping,house" },
                            {
                                id: "1.3.3.13",
                                type: "S",
                                affiliation: "*",
                                battlefield: "G",
                                status: "*",
                                modifier: "ID----",
                                desc_kor: "문화재",
                                desc_eng: "Cultural,Properties",
                                children: [
                                    { id: "1.3.3.13.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IDN---", desc_kor: "국보", desc_eng: "National,Treasure" },
                                    { id: "1.3.3.13.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IDT---", desc_kor: "보물", desc_eng: "Treasure" }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: "1.4",
                type: "S",
                affiliation: "*",
                battlefield: "S",
                status: "*",
                modifier: "------",
                desc_kor: "수상항적",
                desc_eng: "Sea,surface,track",
                children: [{
                        id: "1.4.1",
                        type: "S",
                        affiliation: "*",
                        battlefield: "S",
                        status: "*",
                        modifier: "C-----",
                        desc_kor: "전투함",
                        desc_eng: "Combatant",
                        children: [{
                                id: "1.4.1.1",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "CL----",
                                desc_kor: "함정",
                                desc_eng: "함정",
                                children: [
                                    { id: "1.4.1.1.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CLCV--", desc_kor: "항공모함", desc_eng: "Carrier" },
                                    { id: "1.4.1.1.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CLBB--", desc_kor: "전함", desc_eng: "Battleship" },
                                    { id: "1.4.1.1.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CLCC--", desc_kor: "순양함", desc_eng: "Cruiser" },
                                    {
                                        id: "1.4.1.1.4",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "S",
                                        status: "*",
                                        modifier: "CLDD--",
                                        desc_kor: "구축함",
                                        desc_eng: "Destroyer",
                                        children: [
                                            { id: "1.4.1.1.4.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CLDDH-", desc_kor: "헬기탑재구축함", desc_eng: "Destroyer(Helicopter)" },
                                            { id: "1.4.1.1.4.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CLDDG-", desc_kor: "유인유도탄구축함", desc_eng: "Destroyer(Decoy)" },
                                            { id: "1.4.1.1.4.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CLDDX-", desc_kor: "중차기구축함", desc_eng: "Destroyer" }
                                        ]
                                    },
                                    {
                                        id: "1.4.1.1.5",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "S",
                                        status: "*",
                                        modifier: "CLFF--",
                                        desc_kor: "호위함",
                                        desc_eng: "Frigate/Corvette",
                                        children: [
                                            { id: "1.4.1.1.5.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CLFFX-", desc_kor: "차기호위함", desc_eng: "Frigate/Corvette" }
                                        ]
                                    },
                                    {
                                        id: "1.4.1.1.6",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "S",
                                        status: "*",
                                        modifier: "CLLL--",
                                        desc_kor: "연안전투함",
                                        desc_eng: "Littoral,combatant",
                                        children: [
                                            { id: "1.4.1.1.6.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CLLLAS", desc_kor: "대잠전 임무 패키지", desc_eng: "Antisubmarine,warfare,mission,package" },
                                            { id: "1.4.1.1.6.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CLLLMI", desc_kor: "기뢰전 임무 패키지", desc_eng: "Mine,warfare,mission,package" },
                                            { id: "1.4.1.1.6.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CLLLSU", desc_kor: "수상전 임무 패키지", desc_eng: "Surface,warfare,(SUW),mission,package" }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "1.4.1.2",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "CA----",
                                desc_kor: "상륙전함",
                                desc_eng: "Amphibious,warfare,ship",
                                children: [
                                    { id: "1.4.1.2.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CALA--", desc_kor: "공격함", desc_eng: "Assault,vessel" },
                                    {
                                        id: "1.4.1.2.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "S",
                                        status: "*",
                                        modifier: "CALS--",
                                        desc_kor: "상륙함",
                                        desc_eng: "Landing,ship",
                                        children: [
                                            { id: "1.4.1.2.2.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CALSH-", desc_kor: "대형수송함", desc_eng: "Transport,ship(Large)" },
                                            { id: "1.4.1.2.2.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CALST-", desc_kor: "상륙함", desc_eng: "Landing,ship,tank" },
                                            { id: "1.4.1.2.2.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CALSF-", desc_kor: "고속상륙정", desc_eng: "Landing,ship(High,speed)" },
                                            { id: "1.4.1.2.2.4", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CALSM-", desc_kor: "상륙함(중)", desc_eng: "Landing,ship,medium" }
                                        ]
                                    },
                                    { id: "1.4.1.2.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CALC--", desc_kor: "상륙정", desc_eng: "Landing,craft" }
                                ]
                            },
                            {
                                id: "1.4.1.3",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "CM----",
                                desc_kor: "기뢰전함",
                                desc_eng: "Mine,warfare,vessel",
                                children: [{
                                        id: "1.4.1.3.1",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "S",
                                        status: "*",
                                        modifier: "CMML--",
                                        desc_kor: "기뢰부설함",
                                        desc_eng: "Minelayer",
                                        children: [
                                            { id: "1.4.1.3.1.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CMMLS-", desc_kor: "기뢰부설함", desc_eng: "Minelayer" },
                                            { id: "1.4.1.3.1.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CMMLL-", desc_kor: "기뢰부설정", desc_eng: "Minelayer" }
                                        ]
                                    },
                                    {
                                        id: "1.4.1.3.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "S",
                                        status: "*",
                                        modifier: "CMMS--",
                                        desc_kor: "소해함",
                                        desc_eng: "Minesweeper",
                                        children: [
                                            { id: "1.4.1.3.2.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CMMSH-", desc_kor: "소해함", desc_eng: "Minesweeper" }
                                        ]
                                    },
                                    {
                                        id: "1.4.1.3.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "S",
                                        status: "*",
                                        modifier: "CMMH--",
                                        desc_kor: "기뢰탐색함",
                                        desc_eng: "Minehunter",
                                        children: [
                                            { id: "1.4.1.3.3.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CMMHC-", desc_kor: "기뢰탐색함", desc_eng: "Minehunter" }
                                        ]
                                    },
                                    { id: "1.4.1.3.4", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CMMA--", desc_kor: "대기뢰함지원함", desc_eng: "Mcm,support" }
                                ]
                            },
                            {
                                id: "1.4.1.4",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "CP----",
                                desc_kor: "초계함",
                                desc_eng: "Patrol",
                                children: [
                                    { id: "1.4.1.4.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CPSB--", desc_kor: "대잠전초계함", desc_eng: "Antisubmarine,warfare" },
                                    {
                                        id: "1.4.1.4.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "S",
                                        status: "*",
                                        modifier: "CPSU--",
                                        desc_kor: "대수상전초계함",
                                        desc_eng: "Antisurface,warfare",
                                        children: [
                                            { id: "1.4.1.4.2.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CPSUM-", desc_kor: "초계함(대함유도탄)", desc_eng: "Antiship,missile,patrol,craft" },
                                            { id: "1.4.1.4.2.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CPSUT-", desc_kor: "초계함(어뢰)", desc_eng: "Torpedo,patrol,craft" },
                                            { id: "1.4.1.4.2.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CPSUG-", desc_kor: "초계함(포)", desc_eng: "Gun,patrol,craft" }
                                        ]
                                    },
                                    {
                                        id: "1.4.1.4.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "S",
                                        status: "*",
                                        modifier: "CPSP--",
                                        desc_kor: "고속정",
                                        desc_eng: "Patrol,killer",
                                        children: [
                                            { id: "1.4.1.4.3.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CPSPX-", desc_kor: "차기고속정", desc_eng: "Patrol,killer,experimental" }
                                        ]
                                    }
                                ]
                            },
                            { id: "1.4.1.5", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CH----", desc_kor: "공기부양정", desc_eng: "Hovercraft" },
                            {
                                id: "1.4.1.6",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "S-----",
                                desc_kor: "위치",
                                desc_eng: "Station",
                                children: [
                                    { id: "1.4.1.6.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "SP----", desc_kor: "전초함", desc_eng: "Patrol,ship" },
                                    { id: "1.4.1.6.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "SA----", desc_kor: "대잠함", desc_eng: "Anti,submarine,ship" }
                                ]
                            },
                            {
                                id: "1.4.1.7",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "G-----",
                                desc_kor: "해군그룹",
                                desc_eng: "Navy,group",
                                children: [
                                    { id: "1.4.1.7.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "GT----", desc_kor: "기동함대(TF)", desc_eng: "Navy,task,force" },
                                    { id: "1.4.1.7.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "GG----", desc_kor: "기동전단(TG)", desc_eng: "Navy,task,group" },
                                    { id: "1.4.1.7.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "GU----", desc_kor: "기동전대(TU)", desc_eng: "Navy,task,unit" },
                                    { id: "1.4.1.7.4", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "GC----", desc_kor: "호송단대", desc_eng: "Convoy" }
                                ]
                            },
                            { id: "1.4.1.8", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CD----", desc_kor: "수상유인", desc_eng: "Surface,decoy" },
                            {
                                id: "1.4.1.9",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "CU----",
                                desc_kor: "무인수상선(USV)",
                                desc_eng: "Unmanned,surface,vehicle",
                                children: [
                                    { id: "1.4.1.9.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CUM---", desc_kor: "무인수상선(대기뢰초계)", desc_eng: "Mine,countermeasures,surface,drone" },
                                    { id: "1.4.1.9.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CUS---", desc_kor: "무인수상선(대잠전)", desc_eng: "Antisubmarine,warfare,surface,drone" },
                                    { id: "1.4.1.9.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CUN---", desc_kor: "무인수상선(대수상전)", desc_eng: "Antisurface,warfare,surface,drone" },
                                    { id: "1.4.1.9.4", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "CUR---", desc_kor: "원격 다중임무 무인 수상선", desc_eng: "Remote,multimission,vehicle" }
                                ]
                            }
                        ]
                    },
                    {
                        id: "1.4.2",
                        type: "S",
                        affiliation: "*",
                        battlefield: "S",
                        status: "*",
                        modifier: "N-----",
                        desc_kor: "지원함",
                        desc_eng: "Noncombatant",
                        children: [
                            { id: "1.4.2.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NR----", desc_kor: "잠수함지원함", desc_eng: "Underway,replenishment" },
                            {
                                id: "1.4.2.2",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "NF----",
                                desc_kor: "해상지원함",
                                desc_eng: "Fleet,support",
                                children: [
                                    { id: "1.4.2.2.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NFL---", desc_kor: "보조함", desc_eng: "보조함" },
                                    { id: "1.4.2.2.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NFM---", desc_kor: "동원선박", desc_eng: "동원선박" },
                                    { id: "1.4.2.2.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NFO---", desc_kor: "유조함", desc_eng: "유조함" },
                                    { id: "1.4.2.2.4", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NFT---", desc_kor: "수상구조함", desc_eng: "수상구조함" },
                                    { id: "1.4.2.2.5", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NFR---", desc_kor: "잠수함구조함", desc_eng: "잠수함구조함" },
                                    { id: "1.4.2.2.6", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NFS---", desc_kor: "잠수정모함", desc_eng: "잠수정모함" },
                                    { id: "1.4.2.2.7", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NFU---", desc_kor: "군수지원정", desc_eng: "군수지원정" },
                                    {
                                        id: "1.4.2.2.8",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "S",
                                        status: "*",
                                        modifier: "NFP---",
                                        desc_kor: "경비정",
                                        desc_eng: "경비정",
                                        children: [
                                            { id: "1.4.2.2.8.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NFPR--", desc_kor: "RIB", desc_eng: "RIB" },
                                            { id: "1.4.2.2.8.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NFPA--", desc_kor: "육경정", desc_eng: "육경정" },
                                            { id: "1.4.2.2.8.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NFPY--", desc_kor: "연안경비정", desc_eng: "연안경비정" },
                                            { id: "1.4.2.2.8.4", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NFPS--", desc_kor: "대동호", desc_eng: "대동호" }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "1.4.2.3",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "NI----",
                                desc_kor: "정보함",
                                desc_eng: "Intelligence",
                                children: [
                                    { id: "1.4.2.3.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NIN---", desc_kor: "해양정보함", desc_eng: "해양정보함" }
                                ]
                            },
                            { id: "1.4.2.4", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NS----", desc_kor: "지원항(전진기지", desc_eng: "YPK),Service,and,support,harbor" },
                            { id: "1.4.2.5", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NM----", desc_kor: "병원선", desc_eng: "Hospital,ship" },
                            { id: "1.4.2.6", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NH----", desc_kor: "공기부양정(비전투)", desc_eng: "Hovercraft" },
                            {
                                id: "1.4.2.7",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "NN----",
                                desc_kor: "위치(비전투)",
                                desc_eng: "Station",
                                children: [
                                    { id: "1.4.2.7.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NNR---", desc_kor: "구조함", desc_eng: "Rescue" }
                                ]
                            }
                        ]
                    },
                    {
                        id: "1.4.3",
                        type: "S",
                        affiliation: "*",
                        battlefield: "S",
                        status: "*",
                        modifier: "X-----",
                        desc_kor: "민간선박",
                        desc_eng: "Non-military",
                        children: [{
                                id: "1.4.3.1",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "XM----",
                                desc_kor: "상선",
                                desc_eng: "Merchant",
                                children: [
                                    { id: "1.4.3.1.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XMC---", desc_kor: "화물선", desc_eng: "Cargo" },
                                    { id: "1.4.3.1.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XMR---", desc_kor: "트레일러선", desc_eng: "Roll,on/Roll,off" },
                                    { id: "1.4.3.1.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XMO---", desc_kor: "유조선", desc_eng: "Oiler/Tanker" },
                                    { id: "1.4.3.1.4", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XMTU--", desc_kor: "예인선", desc_eng: "Tug" },
                                    { id: "1.4.3.1.5", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XMF---", desc_kor: "페리", desc_eng: "Ferry" },
                                    { id: "1.4.3.1.6", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XMP---", desc_kor: "여객선", desc_eng: "Passenger" },
                                    { id: "1.4.3.1.7", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XMH---", desc_kor: "위험물질운반선", desc_eng: "Hazardous,materials,(HazMat)" },
                                    { id: "1.4.3.1.8", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XMTO--", desc_kor: "견인선", desc_eng: "Towing,vessel" }
                                ]
                            },
                            {
                                id: "1.4.3.2",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "XF----",
                                desc_kor: "어선",
                                desc_eng: "Fishing",
                                children: [
                                    { id: "1.4.3.2.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XFDF--", desc_kor: "유망어선", desc_eng: "Drifter" },
                                    { id: "1.4.3.2.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XFDR--", desc_kor: "준설선", desc_eng: "Dredge" },
                                    { id: "1.4.3.2.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XFTR--", desc_kor: "저인망어선", desc_eng: "Trawler" }
                                ]
                            },
                            { id: "1.4.3.3", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XR----", desc_kor: "레저용 선박", desc_eng: "Leisure,craft" },
                            { id: "1.4.3.4", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XL----", desc_kor: "해경선", desc_eng: "Law,enforcement,vessel" },
                            { id: "1.4.3.5", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XH----", desc_kor: "공기부양정", desc_eng: "Hovercraft" },
                            { id: "1.4.3.6", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XG----", desc_kor: "관공선", desc_eng: "관공선" },
                            {
                                id: "1.4.3.7",
                                type: "S",
                                affiliation: "*",
                                battlefield: "S",
                                status: "*",
                                modifier: "XA----",
                                desc_kor: "고속 레크리에이션 선박",
                                desc_eng: "Fast,recreactional,craft",
                                children: [
                                    { id: "1.4.3.7.1", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XAR---", desc_kor: "경장갑공기정(RHIB)", desc_eng: "Rigid-hull,inflatable,boat" },
                                    { id: "1.4.3.7.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XAS---", desc_kor: "쾌속정", desc_eng: "Speed,boat" }
                                ]
                            },
                            { id: "1.4.3.8", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XP----", desc_kor: "개인용 선박", desc_eng: "Personal,watercraft" }
                        ]
                    },
                    { id: "1.4.4", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "O-----", desc_kor: "자함항적", desc_eng: "Own,track" }
                ]
            },
            {
                id: "1.5",
                type: "S",
                affiliation: "*",
                battlefield: "U",
                status: "*",
                modifier: "------",
                desc_kor: "수중항적",
                desc_eng: "Subsurface,track",
                children: [{
                        id: "1.5.1",
                        type: "S",
                        affiliation: "*",
                        battlefield: "U",
                        status: "*",
                        modifier: "S-----",
                        desc_kor: "잠수함",
                        desc_eng: "Submarine",
                        children: [
                            { id: "1.5.1.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SN----", desc_kor: "핵잠수함", desc_eng: "Nuclear,propulsion" },
                            {
                                id: "1.5.1.2",
                                type: "S",
                                affiliation: "*",
                                battlefield: "U",
                                status: "*",
                                modifier: "SC----",
                                desc_kor: "재래식잠수함",
                                desc_eng: "Conventional,propulsion",
                                children: [
                                    { id: "1.5.1.2.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SCF---", desc_kor: "재래식잠수함(수상)", desc_eng: "Surfaced,conventional,propulsion,submarine" },
                                    { id: "1.5.1.2.2", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SCA---", desc_kor: "재래식잠수함(공격)", desc_eng: "Attack,submarine,(SS)" },
                                    { id: "1.5.1.2.3", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SCM---", desc_kor: "재래식잠수함(유도탄)(종류미상)", desc_eng: "Missile,submarine,(Type,unknown)" },
                                    { id: "1.5.1.2.4", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SCG---", desc_kor: "재래식잠수함(SSG)(유도미사일)", desc_eng: "Guided,missile,submarine,(SSG)" },
                                    { id: "1.5.1.2.5", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SCB---", desc_kor: "재래식잠수함(SSB)(탄도미사일)", desc_eng: "Ballistic,missile,submarine,(SSB)" }
                                ]
                            },
                            {
                                id: "1.5.1.3",
                                type: "S",
                                affiliation: "*",
                                battlefield: "U",
                                status: "*",
                                modifier: "SO----",
                                desc_kor: "기타잠수함",
                                desc_eng: "Other,submersible",
                                children: [{
                                        id: "1.5.1.3.1",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "U",
                                        status: "*",
                                        modifier: "SU----",
                                        desc_kor: "무인잠수정",
                                        desc_eng: "Unmanned,underwater,vehicle,(UUV)",
                                        children: [
                                            { id: "1.5.1.3.1.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SUM---", desc_kor: "대기뢰무인잠수정", desc_eng: "Mine,warfare,subsurface,drone" },
                                            { id: "1.5.1.3.1.2", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SUS---", desc_kor: "대잠무인잠수정", desc_eng: "Antisubmarine,warfare,subsurface,drone" },
                                            { id: "1.5.1.3.1.3", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SUN---", desc_kor: "대수상전무인잠수정", desc_eng: "Antisurface,warfare,subsurface,drone" }
                                        ]
                                    },
                                    { id: "1.5.1.3.2", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SM----", desc_kor: "잠수정", desc_eng: "Midget,submarine" },
                                    { id: "1.5.1.3.3", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SOF---", desc_kor: "기타잠수함(수상)", desc_eng: "Surfaced,other,submersible" }
                                ]
                            },
                            {
                                id: "1.5.1.4",
                                type: "S",
                                affiliation: "*",
                                battlefield: "U",
                                status: "*",
                                modifier: "SS----",
                                desc_kor: "위치",
                                desc_eng: "Station",
                                children: [
                                    { id: "1.5.1.4.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SSA---", desc_kor: "대잠전 잠수함", desc_eng: "ASW,submarine" }
                                ]
                            },
                            { id: "1.5.1.5", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SF----", desc_kor: "잠수함(수상)", desc_eng: "Surfaced,submarine" },
                            { id: "1.5.1.6", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SB----", desc_kor: "잠수함(해저)", desc_eng: "Bottomed,submarine" },
                            { id: "1.5.1.7", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SR----", desc_kor: "잠수함(확실)", desc_eng: "Certain,submarine" },
                            {
                                id: "1.5.1.8",
                                type: "S",
                                affiliation: "*",
                                battlefield: "U",
                                status: "*",
                                modifier: "SX----",
                                desc_kor: "비잠수함",
                                desc_eng: "Nonsubmarine",
                                children: [
                                    { id: "1.5.1.8.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SNF---", desc_kor: "핵잠수함(수상)", desc_eng: "Surfaced,nuclear,propulsion,submarine" },
                                    { id: "1.5.1.8.2", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SNA---", desc_kor: "핵잠수함(SSN)(공격)", desc_eng: "Attack,submarine,(SSN)" },
                                    { id: "1.5.1.8.3", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SNM---", desc_kor: "핵잠수함(유도탄)(종류미상)", desc_eng: "Missile,submarine,(Type,unknown)" },
                                    { id: "1.5.1.8.4", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SNG---", desc_kor: "핵잠수함(SSGN)(유도미사일)", desc_eng: "Guided,missile,submarine,(SSGN)" },
                                    { id: "1.5.1.8.5", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SNB---", desc_kor: "핵잠수함(SSBN)(탄도미사일)", desc_eng: "Ballistic,missile,submarine,(SSBN)" }
                                ]
                            },
                            { id: "1.5.1.9", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "S1----", desc_kor: "잠수함 가능", desc_eng: "1,Possible,submarine,1" },
                            { id: "1.5.1.10", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "S2----", desc_kor: "잠수함 가능", desc_eng: "2,Possible,submarine,2" },
                            { id: "1.5.1.11", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "S3----", desc_kor: "잠수함 가능", desc_eng: "3,Possible,submarine,3" },
                            { id: "1.5.1.12", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "S4----", desc_kor: "잠수함 가능", desc_eng: "4,Possible,submarine,4" },
                            { id: "1.5.1.13", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SL----", desc_kor: "잠수함 추정", desc_eng: "Probable,submarine" },
                            { id: "1.5.1.14", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "SK----", desc_kor: "스노클링 잠수함", desc_eng: "Snorkeling,submarine" }
                        ]
                    },
                    {
                        id: "1.5.2",
                        type: "S",
                        affiliation: "*",
                        battlefield: "U",
                        status: "*",
                        modifier: "W-----",
                        desc_kor: "수중화기",
                        desc_eng: "Underwater,weapon",
                        children: [{
                                id: "1.5.2.1",
                                type: "S",
                                affiliation: "*",
                                battlefield: "U",
                                status: "*",
                                modifier: "WT----",
                                desc_kor: "어뢰",
                                desc_eng: "Torpedo",
                                children: [
                                    { id: "1.5.2.1.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WB----", desc_kor: "폭뢰", desc_eng: "Depth,bomb" }
                                ]
                            },
                            {
                                id: "1.5.2.2",
                                type: "S",
                                affiliation: "*",
                                battlefield: "U",
                                status: "*",
                                modifier: "WM----",
                                desc_kor: "기뢰",
                                desc_eng: "Sea,mine",
                                children: [
                                    { id: "1.5.2.2.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMD---", desc_kor: "기뢰(처리된)", desc_eng: "Sea,mine,neutralized" },
                                    {
                                        id: "1.5.2.2.2",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "U",
                                        status: "*",
                                        modifier: "WMG---",
                                        desc_kor: "해저기뢰",
                                        desc_eng: "Sea,mine,(Ground)",
                                        children: [
                                            { id: "1.5.2.2.2.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMGD--", desc_kor: "해저기뢰(처리된)", desc_eng: "Sea,mine,(Ground),neutralized" },
                                            { id: "1.5.2.2.2.2", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMGX--", desc_kor: "해저기뢰(훈련용)", desc_eng: "Ground,(Bottom),exercise,mine" },
                                            { id: "1.5.2.2.2.3", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMGE--", desc_kor: "해저기뢰 유사 에코(MILEC)", desc_eng: "Ground,(Bottom),mine-like,echo,(MILEC)" },
                                            { id: "1.5.2.2.2.4", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMGC--", desc_kor: "해저기뢰 유사 접촉(MILCO)", desc_eng: "Ground,(Bottom),mine-like,contact,(MILCO)" },
                                            { id: "1.5.2.2.2.5", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMGR--", desc_kor: "해저기뢰 재포착 불가", desc_eng: "Ground,(Bottom),negative,reacquisition" },
                                            { id: "1.5.2.2.2.6", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMGO--", desc_kor: "해저기뢰 유사 접촉(비기뢰)", desc_eng: "Ground,(Bottom),non-mine,mine-like,contact" }
                                        ]
                                    },
                                    {
                                        id: "1.5.2.2.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "U",
                                        status: "*",
                                        modifier: "WMM---",
                                        desc_kor: "계류기뢰",
                                        desc_eng: "Sea,mine,(Moored)",
                                        children: [
                                            { id: "1.5.2.2.3.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMMD--", desc_kor: "계류기뢰(처리된)", desc_eng: "Sea,mine,(Moored),neutralized" },
                                            { id: "1.5.2.2.3.2", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMMX--", desc_kor: "계류기뢰(훈련용)", desc_eng: "Moored,exercise,mine" },
                                            { id: "1.5.2.2.3.3", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMME--", desc_kor: "계류기뢰 유사 에코(MILEC)", desc_eng: "Moored,mine-like,echo" },
                                            { id: "1.5.2.2.3.4", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMMC--", desc_kor: "계류기뢰 유사 접촉(MILCO)", desc_eng: "Moored,mine-like,contact" },
                                            { id: "1.5.2.2.3.5", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMMR--", desc_kor: "계류기뢰 재포착 불가", desc_eng: "Moored,negative,reacquisition" },
                                            { id: "1.5.2.2.3.6", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMMO--", desc_kor: "계류기뢰 유사 접촉(비기뢰)", desc_eng: "Moored,non-mine,mine-like,object" }
                                        ]
                                    },
                                    {
                                        id: "1.5.2.2.4",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "U",
                                        status: "*",
                                        modifier: "WMF---",
                                        desc_kor: "부유기뢰",
                                        desc_eng: "Sea,mine,(Floating)",
                                        children: [
                                            { id: "1.5.2.2.4.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMFD--", desc_kor: "부유기뢰(처리된)", desc_eng: "Sea,mine,(Floating),neutralized" },
                                            { id: "1.5.2.2.4.2", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMFX--", desc_kor: "부유기뢰(훈련용)", desc_eng: "Floating,exercise,mine" },
                                            { id: "1.5.2.2.4.3", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMFE--", desc_kor: "부유기뢰 유사 에코(MILEC)", desc_eng: "Floating,mine-like,echo,(MILEC)" },
                                            { id: "1.5.2.2.4.4", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMFC--", desc_kor: "부유기뢰 유사 접촉(MILCO)", desc_eng: "Floating,mine-like,contact,(MILCO)" },
                                            { id: "1.5.2.2.4.5", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMFR--", desc_kor: "부유기뢰 재포착 불가", desc_eng: "Floating,negative,reacquisition" },
                                            { id: "1.5.2.2.4.6", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMFO--", desc_kor: "부유기뢰 유사 접촉(비기뢰)", desc_eng: "Floating,non-mine,mine-like,contact" }
                                        ]
                                    },
                                    {
                                        id: "1.5.2.2.5",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "U",
                                        status: "*",
                                        modifier: "WMO---",
                                        desc_kor: "기타기뢰",
                                        desc_eng: "Sea,mine,(Other,position)",
                                        children: [
                                            { id: "1.5.2.2.5.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMOD--", desc_kor: "기타기뢰(처리된)", desc_eng: "Sea,mine,(Other,position),neutralized" }
                                        ]
                                    },
                                    {
                                        id: "1.5.2.2.6",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "U",
                                        status: "*",
                                        modifier: "WMA---",
                                        desc_kor: "안테나기뢰",
                                        desc_eng: "General,mine,anchor",
                                        children: [
                                            { id: "1.5.2.2.6.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMAD--", desc_kor: "안테나기뢰(처리된)", desc_eng: "General,mine,anchor,neutralized" }
                                        ]
                                    },
                                    {
                                        id: "1.5.2.2.7",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "U",
                                        status: "*",
                                        modifier: "WMS---",
                                        desc_kor: "부동색기뢰",
                                        desc_eng: "Rising,mine",
                                        children: [
                                            { id: "1.5.2.2.7.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMSD--", desc_kor: "부동색기뢰(처리된)", desc_eng: "Rising,neutralized,mine" },
                                            { id: "1.5.2.2.7.2", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMSX--", desc_kor: "부동색기뢰(훈련용)", desc_eng: "Rising,exercise,mine" }
                                        ]
                                    },
                                    { id: "1.5.2.2.8", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMX---", desc_kor: "기타기뢰(훈련용)", desc_eng: "General,exercise,mine" },
                                    { id: "1.5.2.2.9", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WME---", desc_kor: "기타기뢰 유사 에코(MILEC)", desc_eng: "General,mine-like,echo,(MILEC)" },
                                    { id: "1.5.2.2.10", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMC---", desc_kor: "기타기뢰 유사 접촉(MILCO)", desc_eng: "General,mine-like,contact,(MILCO)" },
                                    { id: "1.5.2.2.11", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMR---", desc_kor: "기타기뢰 재포착 불가", desc_eng: "General,negative,reacquisition" },
                                    {
                                        id: "1.5.2.2.12",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "U",
                                        status: "*",
                                        modifier: "WMB---",
                                        desc_kor: "기타기뢰 방해물",
                                        desc_eng: "General,obstructor",
                                        children: [
                                            { id: "1.5.2.2.12.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMBD--", desc_kor: "기타기뢰(처리된) 방해물", desc_eng: "General,neutralized,obstructor" }
                                        ]
                                    },
                                    { id: "1.5.2.2.13", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WMN---", desc_kor: "기타기뢰 유사 접촉(비기뢰)", desc_eng: "General,non-mine,mine-like,object" }
                                ]
                            }
                        ]
                    },
                    {
                        id: "1.5.3",
                        type: "S",
                        affiliation: "*",
                        battlefield: "U",
                        status: "*",
                        modifier: "WD----",
                        desc_kor: "수중유인(교란)",
                        desc_eng: "Underwater,decoy",
                        children: [{
                            id: "1.5.3.1",
                            type: "S",
                            affiliation: "*",
                            battlefield: "U",
                            status: "*",
                            modifier: "WDM---",
                            desc_kor: "기뢰유인",
                            desc_eng: "Sea,mine,decoy",
                            children: [
                                { id: "1.5.3.1.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WDMG--", desc_kor: "해저기뢰유인", desc_eng: "Ground,(Bottom),decoy" },
                                { id: "1.5.3.1.2", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "WDMM--", desc_kor: "계류기뢰유인", desc_eng: "Moored,decoy" }
                            ]
                        }]
                    },
                    {
                        id: "1.5.4",
                        type: "S",
                        affiliation: "*",
                        battlefield: "U",
                        status: "*",
                        modifier: "N-----",
                        desc_kor: "비잠수함",
                        desc_eng: "Non-submarine",
                        children: [
                            { id: "1.5.4.1", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "ND----", desc_kor: "잠수부", desc_eng: "Diver" }
                        ]
                    },
                    { id: "1.5.5", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "E-----", desc_kor: "환경보고지점", desc_eng: "Environmental,report,location" },
                    { id: "1.5.6", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "V-----", desc_kor: "잠수보고지점", desc_eng: "Dive,report,location" },
                    { id: "1.5.7", type: "S", affiliation: "*", battlefield: "U", status: "*", modifier: "X-----", desc_kor: "불발탄지역", desc_eng: "Unexploded,ordnance,area" }
                ]
            },
            {
                id: "1.6",
                type: "S",
                affiliation: "*",
                battlefield: "F",
                status: "*",
                modifier: "------",
                desc_kor: "기동부대",
                desc_eng: "Special,operations,forces,(SOF),unit",
                children: [{
                        id: "1.6.1",
                        type: "S",
                        affiliation: "*",
                        battlefield: "F",
                        status: "*",
                        modifier: "A-----",
                        desc_kor: "기동부대(항공)",
                        desc_eng: "SOF,unit,aviation",
                        children: [{
                                id: "1.6.1.1",
                                type: "S",
                                affiliation: "*",
                                battlefield: "F",
                                status: "*",
                                modifier: "AF----",
                                desc_kor: "기동부대(고정익)",
                                desc_eng: "SOF,unit,fixed,wing",
                                children: [
                                    { id: "1.6.1.1.1", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "AFA---", desc_kor: "기동부대(공격고정익)", desc_eng: "SOF,unit,attack" },
                                    { id: "1.6.1.1.2", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "AFK---", desc_kor: "기동부대(재급유고정익)", desc_eng: "SOF,unit,refuel" },
                                    {
                                        id: "1.6.1.1.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "F",
                                        status: "*",
                                        modifier: "AFU---",
                                        desc_kor: "기동부대(다목적고정익)",
                                        desc_eng: "SOF,unit,utility",
                                        children: [
                                            { id: "1.6.1.1.3.1", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "AFUL--", desc_kor: "기동부대(다목적고정익-경)", desc_eng: "SOF,unit,utility,(Light)" },
                                            { id: "1.6.1.1.3.2", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "AFUM--", desc_kor: "기동부대(다목적고정익-중)", desc_eng: "SOF,unit,utility,(Medium)" },
                                            { id: "1.6.1.1.3.3", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "AFUH--", desc_kor: "기동부대(다목적고정익-대)", desc_eng: "SOF,unit,utility,(Heavy)" }
                                        ]
                                    }
                                ]
                            },
                            { id: "1.6.1.2", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "AV----", desc_kor: "기동부대(수직이착륙기)", desc_eng: "SOF,unit,V/STOL" },
                            {
                                id: "1.6.1.3",
                                type: "S",
                                affiliation: "*",
                                battlefield: "F",
                                status: "*",
                                modifier: "AH----",
                                desc_kor: "기동부대(회전익)",
                                desc_eng: "SOF,unit,rotary,wing",
                                children: [
                                    { id: "1.6.1.3.1", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "AHH---", desc_kor: "기동부대(탐색구조헬기)", desc_eng: "SOF,unit,combat,search,and,rescue" },
                                    { id: "1.6.1.3.2", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "AHA---", desc_kor: "기동부대(공격헬기)", desc_eng: "SOF,unit,attack" },
                                    {
                                        id: "1.6.1.3.3",
                                        type: "S",
                                        affiliation: "*",
                                        battlefield: "F",
                                        status: "*",
                                        modifier: "AHU---",
                                        desc_kor: "기동부대(다목적헬기)",
                                        desc_eng: "SOF,unit,utility",
                                        children: [
                                            { id: "1.6.1.3.3.1", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "AHUL--", desc_kor: "기동부대(다목적헬기-경)", desc_eng: "SOF,unit,utility,(Light)" },
                                            { id: "1.6.1.3.3.2", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "AHUM--", desc_kor: "기동부대(다목적헬기-중)", desc_eng: "SOF,unit,utility,(Medium)" },
                                            { id: "1.6.1.3.3.3", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "AHUH--", desc_kor: "기동부대(다목적헬기-대)", desc_eng: "SOF,unit,utility,(Heavy)" }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "1.6.2",
                        type: "S",
                        affiliation: "*",
                        battlefield: "F",
                        status: "*",
                        modifier: "N-----",
                        desc_kor: "해군특수작전",
                        desc_eng: "SOF,unit,SOF,unit,naval",
                        children: [
                            { id: "1.6.2.1", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "NS----", desc_kor: "특전작전팀", desc_eng: "SOF,unit,seal" },
                            { id: "1.6.2.2", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "NU----", desc_kor: "수중 폭파팀", desc_eng: "SOF,unit,underwater,demolition,team" },
                            { id: "1.6.2.3", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "NB----", desc_kor: "특수작전용 보트", desc_eng: "SOF,unit,special,boat" },
                            { id: "1.6.2.4", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "NN----", desc_kor: "특수작전용 잠수함", desc_eng: "SOF,unit,special,SSNR" }
                        ]
                    },
                    {
                        id: "1.6.3",
                        type: "S",
                        affiliation: "*",
                        battlefield: "F",
                        status: "*",
                        modifier: "G-----",
                        desc_kor: "지상 특수작전용",
                        desc_eng: "SOF,unit,ground",
                        children: [
                            { id: "1.6.3.1", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "GS----", desc_kor: "특수전부대", desc_eng: "SOF,unit,special,forces" },
                            { id: "1.6.3.2", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "GR----", desc_kor: "공수특전", desc_eng: "SOF,unit,ranger" },
                            {
                                id: "1.6.3.3",
                                type: "S",
                                affiliation: "*",
                                battlefield: "F",
                                status: "*",
                                modifier: "GP----",
                                desc_kor: "기동부대(심리작전)",
                                desc_eng: "SOF,unit,psychological,operations,(PSYOP)",
                                children: [
                                    { id: "1.6.3.3.1", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "GPA---", desc_kor: "기동부대(심리작전-항공)", desc_eng: "SOF,unit,fixed,wing,aviation" }
                                ]
                            },
                            { id: "1.6.3.4", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "GC----", desc_kor: "기동부대(민사)", desc_eng: "SOF,unit,civil,affairs" }
                        ]
                    },
                    { id: "1.6.4", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "B-----", desc_kor: "특수작전지원부대", desc_eng: "Sof,unit,support" },
                    { id: "1.6.5", type: "S", affiliation: "*", battlefield: "F", status: "*", modifier: "U-----", desc_kor: "합동특수작전", desc_eng: "합동특수작전" }
                ]
            }
        ]
    }
];

module.exports = {
    code: "S",
    affiliation: affiliation_Basic,
    battlefield: battlefield_Basic,
    status: status_Basic,
    unit: unit_Basic,
    mission: mission_Basic,
    identifier: functionIdentifier_Basic
};
},{}],3:[function(require,module,exports){
/* eslint-disable */
var battlefield_Emergency = [
    { code: "I", desc: "사고" },
    { code: "N", desc: "자연사건" },
    { code: "O", desc: "작전" },
    { code: "F", desc: "기반시설" },
    { code: "P", desc: "개인" },
    { code: "G", desc: "비군사 조직 혹은 단체" },
    { code: "R", desc: "강간" }
];

var status_Emergency = [
    { code: "A", desc: "예상/계획" },
    { code: "P", desc: "현재" }
];

var mission_Emergency = [
    { code: "A", desc: "공중(A)" },
    { code: "B", desc: "전자(B)" },
    { code: "C", desc: "민간(C)" },
    { code: "G", desc: "지상(G)" },
    { code: "N", desc: "해군(N)" },
    { code: "S", desc: "전략군(S)" }
];

var unit_Emergency = {
    "H": [
        { code: "H-", desc: " INSTALLAION 시설 " }
    ],
    "M": [
        { code: "MO", desc: " MOBILITY WHEELED / LIMITED CROSS COUNTRY 차륜식 " },
        { code: "MP", desc: " MOBILITY CROSS COUNTRY 야지횡단 차륜식 " },
        { code: "MQ", desc: " MOBILITY TRACKED 궤도식 " },
        { code: "MR", desc: " MOBILITY WHEELED AND TRACKED COMBINATION 차륜 궤도식 " },
        { code: "MS", desc: " MOBILITY TOWED 견인식 " },
        { code: "MT", desc: " MOBILITY RAIL 철도식 " },
        { code: "MU", desc: " BOBILITY OVER THE SNOW 설상 이동식 " },
        { code: "MV", desc: " MOBILITY SLED 썰매이동식 " },
        { code: "MW", desc: " MOBILITY PACK ANIMALS 동물견인식 " },
        { code: "MX", desc: " MOBILITY BARGE 선박이동식 " },
        { code: "MY", desc: " MOBILITY AMPHIBIOUS 수륙양용식" }
    ]
};
var functionIdentifier_Emergency = [{
    id: "6",
    type: "E",
    affiliation: "-",
    battlefield: "-",
    status: "-",
    modifier: "------",
    desc_kor: "비상관리",
    desc_eng: "Emergency,management,symbols",
    children: [{
            id: "6.1",
            type: "E",
            affiliation: "-",
            battlefield: "I",
            status: "-",
            modifier: "------",
            desc_kor: "사고",
            desc_eng: "Incident",
            children: [{
                    id: "6.1.1",
                    type: "E",
                    affiliation: "*",
                    battlefield: "I",
                    status: "*",
                    modifier: "A-----",
                    desc_kor: "소란",
                    desc_eng: "Civil,disturbance,incident",
                    children: [
                        { id: "6.1.1.1", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "D-----", desc_kor: "데모", desc_eng: "Civil,demonstration" },
                        { id: "6.1.1.2", type: "O", affiliation: "*", battlefield: "I", status: "*", modifier: "R-----", desc_kor: "난민", desc_eng: "Civil,displaced,population" },
                        { id: "6.1.1.3", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "AC----", desc_kor: "폭동", desc_eng: "Civil,rioting" }
                    ]
                },
                {
                    id: "6.1.2",
                    type: "E",
                    affiliation: "*",
                    battlefield: "I",
                    status: "*",
                    modifier: "B-----",
                    desc_kor: "범죄활동",
                    desc_eng: "Criminal,activity,incident",
                    children: [
                        { id: "6.1.2.1", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "BA----", desc_kor: "폭파위협", desc_eng: "Bomb,threat" },
                        { id: "6.1.2.2", type: "O", affiliation: "*", battlefield: "V", status: "*", modifier: "B-----", desc_kor: "폭탄", desc_eng: "Bomb" },
                        { id: "6.1.2.3", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "BC----", desc_kor: "폭파", desc_eng: "Explosion" },
                        { id: "6.1.2.4", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "BD----", desc_kor: "도난", desc_eng: "Looting" },
                        { id: "6.1.2.5", type: "O", affiliation: "*", battlefield: "V", status: "*", modifier: "P-----", desc_kor: "독살", desc_eng: "Poisoning" },
                        { id: "6.1.2.6", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "BF----", desc_kor: "총격", desc_eng: "Shooting" }
                    ]
                },
                {
                    id: "6.1.3",
                    type: "E",
                    affiliation: "*",
                    battlefield: "I",
                    status: "*",
                    modifier: "C-----",
                    desc_kor: "화재",
                    desc_eng: "Fire,incident",
                    children: [
                        { id: "6.1.3.1", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "CA----", desc_kor: "분쟁", desc_eng: "Hot,spot" },
                        { id: "6.1.3.2", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "CB----", desc_kor: "비주거지화재", desc_eng: "Non-residential,fire" },
                        { id: "6.1.3.3", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "CC----", desc_kor: "발화점", desc_eng: "Origin,(of,fire)" },
                        { id: "6.1.3.4", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "CD----", desc_kor: "주거지화재", desc_eng: "Residential,fire" },
                        { id: "6.1.3.5", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "CE----", desc_kor: "학교화재", desc_eng: "School,fire" },
                        { id: "6.1.3.6", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "CF----", desc_kor: "연막", desc_eng: "Smoke" },
                        { id: "6.1.3.7", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "CG----", desc_kor: "특수처리필요화재", desc_eng: "Special,needs,fire" },
                        { id: "6.1.3.8", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "CH----", desc_kor: "번갯불", desc_eng: "Wild,fire" }
                    ]
                },
                {
                    id: "6.1.4",
                    type: "E",
                    affiliation: "*",
                    battlefield: "I",
                    status: "*",
                    modifier: "D-----",
                    desc_kor: "위험물 사건",
                    desc_eng: "Hazardous,material,incident",
                    children: [
                        { id: "6.1.4.1", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DA----", desc_kor: "화학물질", desc_eng: "Chemical,agent" },
                        { id: "6.1.4.2", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DB----", desc_kor: "부식성물질", desc_eng: "Corrosive,material" },
                        { id: "6.1.4.3", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DC----", desc_kor: "습식위험물", desc_eng: "Hazardous,when,wet" },
                        { id: "6.1.4.4", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DD----", desc_kor: "폭발물", desc_eng: "Explosive" },
                        { id: "6.1.4.5", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DE----", desc_kor: "인화물질(기체)", desc_eng: "Flammable,gas" },
                        { id: "6.1.4.6", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DF----", desc_kor: "인화물질(액체)", desc_eng: "Flammable,liquid" },
                        { id: "6.1.4.7", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DG----", desc_kor: "인화물질(고체)", desc_eng: "Flammable,solid" },
                        { id: "6.1.4.8", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DH----", desc_kor: "불연성가스", desc_eng: "Non-flammable,gas" },
                        { id: "6.1.4.9", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DI----", desc_kor: "유기산화물", desc_eng: "Organic,peroxide" },
                        { id: "6.1.4.10", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DJ----", desc_kor: "산화제", desc_eng: "Oxidizer" },
                        { id: "6.1.4.11", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DK----", desc_kor: "방사성물질", desc_eng: "Radioactive,material" },
                        { id: "6.1.4.12", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DL----", desc_kor: "자연발화성물질", desc_eng: "Spontaneously,combustible" },
                        { id: "6.1.4.13", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DM----", desc_kor: "독가스", desc_eng: "Toxic,gas" },
                        { id: "6.1.4.14", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DN----", desc_kor: "독극물/전염물", desc_eng: "Toxic,and,infectious" },
                        { id: "6.1.4.15", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "DO----", desc_kor: "불발탄", desc_eng: "Unexploded,ordnance" }
                    ]
                },
                {
                    id: "6.1.5",
                    type: "E",
                    affiliation: "*",
                    battlefield: "I",
                    status: "*",
                    modifier: "E-----",
                    desc_kor: "항공사건",
                    desc_eng: "Air,incident",
                    children: [
                        { id: "6.1.5.1", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "EA----", desc_kor: "항공사고", desc_eng: "Air,accident" },
                        { id: "6.1.5.2", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "HA----", desc_kor: "항공납치", desc_eng: "Air,hijacking" }
                    ]
                },
                {
                    id: "6.1.6",
                    type: "E",
                    affiliation: "*",
                    battlefield: "I",
                    status: "*",
                    modifier: "F-----",
                    desc_kor: "해양사건",
                    desc_eng: "Marine,incident",
                    children: [
                        { id: "6.1.6.1", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "FA----", desc_kor: "해양사고", desc_eng: "Marine,accident" },
                        { id: "6.1.6.2", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "HV----", desc_kor: "해양납치", desc_eng: "Marine,hijacking" }
                    ]
                },
                {
                    id: "6.1.7",
                    type: "E",
                    affiliation: "*",
                    battlefield: "I",
                    status: "*",
                    modifier: "G-----",
                    desc_kor: "철도사건",
                    desc_eng: "Rail,incident",
                    children: [
                        { id: "6.1.7.1", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "GA----", desc_kor: "철도사고", desc_eng: "Rail,accident" },
                        { id: "6.1.7.2", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "GB----", desc_kor: "철도납치", desc_eng: "Rail,hijacking" }
                    ]
                },
                {
                    id: "6.1.8",
                    type: "E",
                    affiliation: "*",
                    battlefield: "I",
                    status: "*",
                    modifier: "H-----",
                    desc_kor: "차량사건",
                    desc_eng: "Vehicle,incident",
                    children: [
                        { id: "6.1.8.1", type: "E", affiliation: "*", battlefield: "I", status: "*", modifier: "HA----", desc_kor: "차량사고", desc_eng: "Vehicle,accident" },
                        { id: "6.1.8.2", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "HT----", desc_kor: "차량납치", desc_eng: "Vehicle,hijacking" }
                    ]
                }
            ]
        },
        {
            id: "6.2",
            type: "E",
            affiliation: "-",
            battlefield: "N",
            status: "-",
            modifier: "------",
            desc_kor: "자연사건",
            desc_eng: "Natural,events",
            children: [{
                    id: "6.2.1",
                    type: "E",
                    affiliation: "*",
                    battlefield: "N",
                    status: "*",
                    modifier: "A-----",
                    desc_kor: "지질",
                    desc_eng: "Geologic",
                    children: [
                        { id: "6.2.1.1", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "AA----", desc_kor: "여진", desc_eng: "Aftershock" },
                        { id: "6.2.1.2", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "AB----", desc_kor: "사태", desc_eng: "Avalanche" },
                        { id: "6.2.1.3", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "AC----", desc_kor: "진앙", desc_eng: "Earthquake,epicenter" },
                        { id: "6.2.1.4", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "AD----", desc_kor: "산사태", desc_eng: "Landslide" },
                        { id: "6.2.1.5", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "AE----", desc_kor: "침하", desc_eng: "Subsidence" },
                        { id: "6.2.1.6", type: "W", affiliation: "A", battlefield: "S", status: "-", modifier: "WSVE--", desc_kor: "화산폭발", desc_eng: "Volcanic,eruption" },
                        { id: "6.2.1.7", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "AG----", desc_kor: "화산위협", desc_eng: "Volcanic,threat" }
                    ]
                },
                {
                    id: "6.2.2",
                    type: "E",
                    affiliation: "*",
                    battlefield: "N",
                    status: "*",
                    modifier: "B-----",
                    desc_kor: "기상",
                    desc_eng: "Hydro-meteorological",
                    children: [
                        { id: "6.2.2.1", type: "W", affiliation: "A", battlefield: "S", status: "-", modifier: "WSD-LI", desc_kor: "가랑비", desc_eng: "Drizzle" },
                        { id: "6.2.2.2", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "BB----", desc_kor: "가뭄", desc_eng: "Drought" },
                        { id: "6.2.2.3", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "BC----", desc_kor: "홍수", desc_eng: "Flood" },
                        { id: "6.2.2.4", type: "W", affiliation: "A", battlefield: "S", status: "-", modifier: "WSFGSO", desc_kor: "안개", desc_eng: "Fog" },
                        { id: "6.2.2.5", type: "W", affiliation: "A", battlefield: "S", status: "-", modifier: "WSGRL-", desc_kor: "우박", desc_eng: "Hail" },
                        { id: "6.2.2.6", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "BF----", desc_kor: "전도", desc_eng: "Inversion" },
                        { id: "6.2.2.7", type: "W", affiliation: "A", battlefield: "S", status: "-", modifier: "WSR-LI", desc_kor: "비", desc_eng: "Rain" },
                        { id: "6.2.2.8", type: "W", affiliation: "A", battlefield: "S", status: "-", modifier: "WSDSLM", desc_kor: "풍진", desc_eng: "Sand,dust,storm" },
                        { id: "6.2.2.9", type: "W", affiliation: "A", battlefield: "S", status: "-", modifier: "WSS-LI", desc_kor: "눈", desc_eng: "Snow" },
                        { id: "6.2.2.10", type: "W", affiliation: "A", battlefield: "S", status: "-", modifier: "WSTMH-", desc_kor: "뇌우", desc_eng: "Thunder,storm" },
                        { id: "6.2.2.11", type: "W", affiliation: "A", battlefield: "S", status: "-", modifier: "WST-FC", desc_kor: "토네이도", desc_eng: "Tornado" },
                        { id: "6.2.2.12", type: "W", affiliation: "A", battlefield: "S", status: "-", modifier: "WSTSS-", desc_kor: "열대폭풍", desc_eng: "Tropical,cyclone" },
                        { id: "6.2.2.13", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "BM----", desc_kor: "쓰나미", desc_eng: "Tsunami" }
                    ]
                },
                {
                    id: "6.2.3",
                    type: "E",
                    affiliation: "*",
                    battlefield: "N",
                    status: "*",
                    modifier: "C-----",
                    desc_kor: "감염",
                    desc_eng: "Infestation",
                    children: [
                        { id: "6.2.3.1", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "CA----", desc_kor: "조류감염", desc_eng: "Bird,infestation" },
                        { id: "6.2.3.2", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "CB----", desc_kor: "곤충감염", desc_eng: "Insect,infestation" },
                        { id: "6.2.3.3", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "CC----", desc_kor: "세균감염", desc_eng: "Microbial,infestation" },
                        { id: "6.2.3.4", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "CD----", desc_kor: "파충류감염", desc_eng: "Reptile,infestation" },
                        { id: "6.2.3.5", type: "E", affiliation: "*", battlefield: "N", status: "*", modifier: "CE----", desc_kor: "설치류감염", desc_eng: "Rodent,infestation" }
                    ]
                }
            ]
        },
        {
            id: "6.3",
            type: "E",
            affiliation: "-",
            battlefield: "O",
            status: "-",
            modifier: "------",
            desc_kor: "작전",
            desc_eng: "Operations",
            children: [{
                    id: "6.3.1",
                    type: "E",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "A-----",
                    desc_kor: "응급수술",
                    desc_eng: "Emergency,medical,operation",
                    children: [
                        { id: "6.3.1.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "AA----", desc_kor: "응급수술부대", desc_eng: "Emergency,medical,operation,unit" },
                        { id: "6.3.1.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "AB----", desc_kor: "응급수술장비", desc_eng: "Emergency,medical,operation,equipment" },
                        { id: "6.3.1.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "AC----", desc_kor: "응급수술시설", desc_eng: "Emergency,medical,operation,installation" },
                        { id: "6.3.1.4", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "AD----", desc_kor: "구급의료기사 대기장소", desc_eng: "EMT,station,location" },
                        { id: "6.3.1.5", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "AE----", desc_kor: "구급차", desc_eng: "Ambulance" },
                        { id: "6.3.1.6", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "AF----", desc_kor: "의무후송헬기", desc_eng: "Medical,evacuation,helicopter" },
                        { id: "6.3.1.7", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "AG----", desc_kor: "보건시설", desc_eng: "Health,department,facility" },
                        { id: "6.3.1.8", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IXH---", desc_kor: "병원", desc_eng: "Hospital" },
                        { id: "6.3.1.9", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "NM----", desc_kor: "병원선", desc_eng: "Hospital,ship" },
                        { id: "6.3.1.10", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "AJ----", desc_kor: "외래환자의료시설", desc_eng: "Medical,facilities,out,patient" },
                        { id: "6.3.1.11", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "AK----", desc_kor: "영안실", desc_eng: "Morgue" },
                        { id: "6.3.1.12", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "AL----", desc_kor: "약국", desc_eng: "Pharmacy" },
                        { id: "6.3.1.13", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "AM----", desc_kor: "부상자분류", desc_eng: "Triage" }
                    ]
                },
                {
                    id: "6.3.2",
                    type: "E",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "B-----",
                    desc_kor: "응급작전",
                    desc_eng: "Emergency,operation",
                    children: [
                        { id: "6.3.2.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "BA----", desc_kor: "응급작전부대", desc_eng: "Emergency,operation,unit" },
                        { id: "6.3.2.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "BB----", desc_kor: "응급작전장비", desc_eng: "Emergency,operation,equipment" },
                        { id: "6.3.2.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "BC----", desc_kor: "응급작전시설", desc_eng: "Emergency,operation,installation" },
                        { id: "6.3.2.4", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "BD----", desc_kor: "응급수집후송지점", desc_eng: "Emergency,collection,evacuation,point" },
                        { id: "6.3.2.5", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "BE----", desc_kor: "응급사건지휘소", desc_eng: "Emergency,incident,command,center" },
                        { id: "6.3.2.6", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "BF----", desc_kor: "응급작전센터", desc_eng: "Emergency,operations,center" },
                        { id: "6.3.2.7", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "BG----", desc_kor: "응급정보센터", desc_eng: "Emergency,public,information,center" },
                        { id: "6.3.2.8", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "BH----", desc_kor: "응급쉘터", desc_eng: "Emergency,shelter" },
                        { id: "6.3.2.9", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "BI----", desc_kor: "응급숙영지", desc_eng: "Emergency,staging,area" },
                        { id: "6.3.2.10", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "BJ----", desc_kor: "응급팀", desc_eng: "Emergency,team" },
                        { id: "6.3.2.11", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "BK----", desc_kor: "응급급수센터", desc_eng: "Emergency,water,distribution,center" },
                        { id: "6.3.2.12", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "BL----", desc_kor: "응급배식센터", desc_eng: "Emergency,food,distribution,center" }
                    ]
                },
                {
                    id: "6.3.3",
                    type: "E",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "C-----",
                    desc_kor: "소방작전",
                    desc_eng: "Fire,fighting,operation",
                    children: [
                        { id: "6.3.3.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "CA----", desc_kor: "소방작전부대", desc_eng: "Fire,fighting,operation,unit" },
                        { id: "6.3.3.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "CB----", desc_kor: "소방작전장비", desc_eng: "Fire,fighting,operation,equipment" },
                        { id: "6.3.3.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "CC----", desc_kor: "소화전", desc_eng: "Fire,hydrant" },
                        { id: "6.3.3.4", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "CD----", desc_kor: "추가급수지점", desc_eng: "Other,water,supply,location" },
                        { id: "6.3.3.5", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "CE----", desc_kor: "소방서", desc_eng: "Fire,station" }
                    ]
                },
                {
                    id: "6.3.4",
                    type: "E",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "D-----",
                    desc_kor: "법집행작전",
                    desc_eng: "Law,enforcement,operation",
                    children: [
                        { id: "6.3.4.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DA----", desc_kor: "법집행작전부대", desc_eng: "Law,enforcement,operation,unit" },
                        { id: "6.3.4.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DB----", desc_kor: "법집행작전장비", desc_eng: "Law,enforcement,operation,equipment" },
                        { id: "6.3.4.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DC----", desc_kor: "법집행작전시설", desc_eng: "Law,enforcement,operation,installation" },
                        {
                            id: "6.3.4.4",
                            type: "E",
                            affiliation: "*",
                            battlefield: "O",
                            status: "*",
                            modifier: "DD----",
                            desc_kor: "ATF(미국 주류·담배·화기 단속국)",
                            desc_eng: "Bureau,of,Alcohol,,Tobacco,,Firearms,and,Explosives,(ATF)",
                            children: [
                                { id: "6.3.4.4.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DDA---", desc_kor: "ATF 부대", desc_eng: "ATF,unit" },
                                { id: "6.3.4.4.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DDB---", desc_kor: "ATF 장비", desc_eng: "ATF,equipment" },
                                { id: "6.3.4.4.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DDC---", desc_kor: "ATF 시설", desc_eng: "ATF,installation" }
                            ]
                        },
                        {
                            id: "6.3.4.5",
                            type: "E",
                            affiliation: "*",
                            battlefield: "O",
                            status: "*",
                            modifier: "DE----",
                            desc_kor: "국경순찰",
                            desc_eng: "Border,patrol",
                            children: [
                                { id: "6.3.4.5.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DEA---", desc_kor: "국경순찰부대", desc_eng: "Border,patrol,unit" },
                                { id: "6.3.4.5.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DEB---", desc_kor: "국경순찰장비", desc_eng: "Border,patrol,equipment" },
                                { id: "6.3.4.5.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DEC---", desc_kor: "국경순찰시설", desc_eng: "Border,patrol,installation" }
                            ]
                        },
                        {
                            id: "6.3.4.6",
                            type: "E",
                            affiliation: "*",
                            battlefield: "O",
                            status: "*",
                            modifier: "DF----",
                            desc_kor: "세관업무",
                            desc_eng: "Customs,service",
                            children: [
                                { id: "6.3.4.6.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DFA---", desc_kor: "세관업무부대", desc_eng: "Customs,service,unit" },
                                { id: "6.3.4.6.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DFB---", desc_kor: "세관업무장비", desc_eng: "Customs,service,equipment" },
                                { id: "6.3.4.6.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DFC---", desc_kor: "세관업무시설", desc_eng: "Customs,service,installation" }
                            ]
                        },
                        {
                            id: "6.3.4.7",
                            type: "E",
                            affiliation: "*",
                            battlefield: "O",
                            status: "*",
                            modifier: "DG----",
                            desc_kor: "DEA(마약단속국)",
                            desc_eng: "Drug,Enforcement,Administration(DEA)",
                            children: [
                                { id: "6.3.4.7.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DGA---", desc_kor: "DEA부대", desc_eng: "DEA,unit" },
                                { id: "6.3.4.7.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DGB---", desc_kor: "DEA장비", desc_eng: "DEA,equipment" },
                                { id: "6.3.4.7.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DGC---", desc_kor: "DEA시설", desc_eng: "DEA,installation" }
                            ]
                        },
                        {
                            id: "6.3.4.8",
                            type: "E",
                            affiliation: "*",
                            battlefield: "O",
                            status: "*",
                            modifier: "DH----",
                            desc_kor: "DOJ(미국법무부)",
                            desc_eng: "Department,of,Justice,(DOJ)",
                            children: [
                                { id: "6.3.4.8.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DHA---", desc_kor: "DOJ부대", desc_eng: "DOJ,unit" },
                                { id: "6.3.4.8.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DHB---", desc_kor: "DOJ장비", desc_eng: "DOJ,equipment" },
                                { id: "6.3.4.8.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DHC---", desc_kor: "DOJ시설", desc_eng: "DOJ,installation" }
                            ]
                        },
                        {
                            id: "6.3.4.9",
                            type: "E",
                            affiliation: "*",
                            battlefield: "O",
                            status: "*",
                            modifier: "DI----",
                            desc_kor: "FBI(미국연방수사국)",
                            desc_eng: "Federal,Bureau,of,Investigation,(FBI)",
                            children: [
                                { id: "6.3.4.9.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DIA---", desc_kor: "FBI부대", desc_eng: "FBI,unit" },
                                { id: "6.3.4.9.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DIB---", desc_kor: "FBI장비", desc_eng: "FBI,equipment" },
                                { id: "6.3.4.9.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DIC---", desc_kor: "FBI시설", desc_eng: "FBI,installation" }
                            ]
                        },
                        {
                            id: "6.3.4.10",
                            type: "E",
                            affiliation: "*",
                            battlefield: "O",
                            status: "*",
                            modifier: "DJ----",
                            desc_kor: "민간경찰",
                            desc_eng: "Police",
                            children: [
                                { id: "6.3.4.10.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "UULC--", desc_kor: "경찰", desc_eng: "Police,unit" },
                                { id: "6.3.4.10.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DJB---", desc_kor: "경찰장비", desc_eng: "Police,equipment" },
                                { id: "6.3.4.10.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DJC---", desc_kor: "경찰시설", desc_eng: "Police,installation" }
                            ]
                        },
                        { id: "6.3.4.11", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DK----", desc_kor: "죄수", desc_eng: "Prison" },
                        {
                            id: "6.3.4.12",
                            type: "E",
                            affiliation: "*",
                            battlefield: "O",
                            status: "*",
                            modifier: "DL----",
                            desc_kor: "첩보기관",
                            desc_eng: "Secret,service",
                            children: [
                                { id: "6.3.4.12.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DLA---", desc_kor: "첩보기관부대", desc_eng: "Secret,service,unit" },
                                { id: "6.3.4.12.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DLB---", desc_kor: "첩보기관장비", desc_eng: "Secret,service,equipment" },
                                { id: "6.3.4.12.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DLC---", desc_kor: "첩보기관시설", desc_eng: "Secret,service,installation" }
                            ]
                        },
                        {
                            id: "6.3.4.13",
                            type: "E",
                            affiliation: "*",
                            battlefield: "O",
                            status: "*",
                            modifier: "DM----",
                            desc_kor: "TSA(미국국토안보국)",
                            desc_eng: "Transportation,Security,Administration,(TSA)",
                            children: [
                                { id: "6.3.4.13.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DMA---", desc_kor: "TSA부대", desc_eng: "TSA,unit" },
                                { id: "6.3.4.13.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DMB---", desc_kor: "TSA장비", desc_eng: "TSA,equipment" },
                                { id: "6.3.4.13.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DMC---", desc_kor: "TSA시설", desc_eng: "TSA,installation" }
                            ]
                        },
                        {
                            id: "6.3.4.14",
                            type: "E",
                            affiliation: "*",
                            battlefield: "O",
                            status: "*",
                            modifier: "DN----",
                            desc_kor: "해경",
                            desc_eng: "Coast,guard",
                            children: [
                                { id: "6.3.4.14.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DNA---", desc_kor: "해경부대", desc_eng: "Coast,guard,unit" },
                                { id: "6.3.4.14.2", type: "S", affiliation: "*", battlefield: "S", status: "*", modifier: "XL----", desc_kor: "해경장비", desc_eng: "Coast,guard,equipment" },
                                { id: "6.3.4.14.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DNC---", desc_kor: "해경시설", desc_eng: "Coast,guard,installation" }
                            ]
                        },
                        {
                            id: "6.3.4.15",
                            type: "E",
                            affiliation: "*",
                            battlefield: "O",
                            status: "*",
                            modifier: "DO----",
                            desc_kor: "미연방보안관",
                            desc_eng: "US,marshals,service",
                            children: [
                                { id: "6.3.4.15.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DOA---", desc_kor: "미연방보안관부대", desc_eng: "US,marshals,service,unit" },
                                { id: "6.3.4.15.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DOB---", desc_kor: "미연방보안관장비", desc_eng: "US,marshals,service,equipment" },
                                { id: "6.3.4.15.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "DOC---", desc_kor: "미연방보안관시설", desc_eng: "US,marshals,service,installation" }
                            ]
                        }
                    ]
                },
                {
                    id: "6.3.5",
                    type: "S",
                    affiliation: "*",
                    battlefield: "G",
                    status: "*",
                    modifier: "ES----",
                    desc_kor: "감지기",
                    desc_eng: "Sensor",
                    children: [
                        { id: "6.3.5.1", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "EA----", desc_kor: "생체감지기", desc_eng: "Biological,sensor" },
                        { id: "6.3.5.2", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "EB----", desc_kor: "화학감지기", desc_eng: "Chemical,sensor" },
                        { id: "6.3.5.3", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "EC----", desc_kor: "침임감지기", desc_eng: "Intrusion,sensor" },
                        { id: "6.3.5.4", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "ED----", desc_kor: "핵감지기", desc_eng: "Nuclear,sensor" },
                        { id: "6.3.5.5", type: "E", affiliation: "*", battlefield: "O", status: "*", modifier: "EE----", desc_kor: "방사능감지기", desc_eng: "Radiological,sensor" }
                    ]
                }
            ]
        },
        {
            id: "6.4",
            type: "E",
            affiliation: "-",
            battlefield: "F",
            status: "-",
            modifier: "------",
            desc_kor: "기반시설",
            desc_eng: "Infrastructure",
            children: [{
                    id: "6.4.1",
                    type: "E",
                    affiliation: "*",
                    battlefield: "F",
                    status: "*",
                    modifier: "A-----",
                    desc_kor: "농업 및 식량 기반시설",
                    desc_eng: "Agriculture,and,food,infrastructure",
                    children: [
                        { id: "6.4.1.1", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "AA----", desc_kor: "농업연구소", desc_eng: "Agricultural,laboratory" },
                        { id: "6.4.1.2", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "AB----", desc_kor: "가축사육장", desc_eng: "Animal,feedlot" },
                        { id: "6.4.1.3", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "AC----", desc_kor: "식량배급상가", desc_eng: "Commercial,food,distribution,center" },
                        { id: "6.4.1.4", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "AD----", desc_kor: "농장/목장", desc_eng: "Farm/Ranch" },
                        { id: "6.4.1.5", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "AE----", desc_kor: "식량생산센터", desc_eng: "Food,production,center" },
                        { id: "6.4.1.6", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "AF----", desc_kor: "식량판매", desc_eng: "Food,retail" },
                        { id: "6.4.1.7", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "AG----", desc_kor: "식량창고", desc_eng: "Grain,storage" }
                    ]
                },
                {
                    id: "6.4.2",
                    type: "E",
                    affiliation: "*",
                    battlefield: "F",
                    status: "*",
                    modifier: "B-----",
                    desc_kor: "은행/금융/보험 기반시설",
                    desc_eng: "Banking,finance,and,insurance,infrastructure",
                    children: [
                        { id: "6.4.2.1", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "BA----", desc_kor: "현금인출기", desc_eng: "ATM" },
                        { id: "6.4.2.2", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "BB----", desc_kor: "은행/금융/보험 기반시설", desc_eng: "Bank" },
                        { id: "6.4.2.3", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "BC----", desc_kor: "금괴저장고", desc_eng: "Bullion,storage" },
                        { id: "6.4.2.4", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "BD----", desc_kor: "연방준비은행", desc_eng: "Federal,reserve,bank" },
                        { id: "6.4.2.5", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "BE----", desc_kor: "금융거래", desc_eng: "Financial,exchange" },
                        { id: "6.4.2.6", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "BF----", desc_kor: "기타금융서비스", desc_eng: "Financial,services,other" }
                    ]
                },
                {
                    id: "6.4.3",
                    type: "E",
                    affiliation: "*",
                    battlefield: "F",
                    status: "*",
                    modifier: "C-----",
                    desc_kor: "상업 기반시설",
                    desc_eng: "Commercial,infrastructure",
                    children: [
                        { id: "6.4.3.1", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "CA----", desc_kor: "화학공장", desc_eng: "Chemical,plant" },
                        { id: "6.4.3.2", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "CB----", desc_kor: "총기생산", desc_eng: "Firearms,manufacturer" },
                        { id: "6.4.3.3", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "CC----", desc_kor: "총기판매", desc_eng: "Firearms,retailer" },
                        { id: "6.4.3.4", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "CD----", desc_kor: "위험물생산", desc_eng: "Hazardous,material,production" },
                        { id: "6.4.3.5", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "CE----", desc_kor: "위험물저장", desc_eng: "Hazardous,material,storage" },
                        { id: "6.4.3.6", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "CF----", desc_kor: "공업용지", desc_eng: "Industrial,site" },
                        { id: "6.4.3.7", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "CG----", desc_kor: "매립지", desc_eng: "Landfill" },
                        { id: "6.4.3.8", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "CH----", desc_kor: "제약시설", desc_eng: "Pharmaceutical,manufacturer" },
                        { id: "6.4.3.9", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "CI----", desc_kor: "유독성폐기물처리지역", desc_eng: "Contaminated,hazardous,waste,site" },
                        { id: "6.4.3.10", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "CJ----", desc_kor: "유해물질 배출시설", desc_eng: "Toxic,release,inventory" }
                    ]
                },
                {
                    id: "6.4.4",
                    type: "E",
                    affiliation: "*",
                    battlefield: "F",
                    status: "*",
                    modifier: "D-----",
                    desc_kor: "교육 기반시설",
                    desc_eng: "Educational,facilities,infrastructure",
                    children: [
                        { id: "6.4.4.1", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "DA----", desc_kor: "대학", desc_eng: "College,university" },
                        { id: "6.4.4.2", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "DB----", desc_kor: "학교화재", desc_eng: "School" }
                    ]
                },
                {
                    id: "6.4.5",
                    type: "S",
                    affiliation: "*",
                    battlefield: "G",
                    status: "*",
                    modifier: "IUE---",
                    desc_kor: "발전소",
                    desc_eng: "Energy,facilities,infrastructure",
                    children: [
                        { id: "6.4.5.1", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "EA----", desc_kor: "발전소", desc_eng: "Generation,station" },
                        { id: "6.4.5.2", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "EB----", desc_kor: "화력발전소(천연가스)", desc_eng: "Natural,gas,facility" },
                        { id: "6.4.5.3", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IUEN--", desc_kor: "핵발전소", desc_eng: "Nuclear,facility" },
                        { id: "6.4.5.4", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IRP---", desc_kor: "화력발전소(석유)", desc_eng: "Petroleum,facility" },
                        { id: "6.4.5.5", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "EE----", desc_kor: "화력발전소(프로판)", desc_eng: "Propane,facility" }
                    ]
                },
                { id: "6.4.6", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "F-----", desc_kor: "정부시설", desc_eng: "Government,site,infrastructure" },
                {
                    id: "6.4.7",
                    type: "E",
                    affiliation: "*",
                    battlefield: "F",
                    status: "*",
                    modifier: "G-----",
                    desc_kor: "군사시설",
                    desc_eng: "Military,infrastructure",
                    children: [
                        { id: "6.4.7.1", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "GA----", desc_kor: "무기고", desc_eng: "Military,armory" },
                        { id: "6.4.7.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IB----", desc_kor: "군용기지", desc_eng: "Military,base" }
                    ]
                },
                {
                    id: "6.4.8",
                    type: "E",
                    affiliation: "*",
                    battlefield: "F",
                    status: "*",
                    modifier: "H-----",
                    desc_kor: "우편 기반시설",
                    desc_eng: "Postal,service,infrastructure",
                    children: [
                        { id: "6.4.8.1", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "HA----", desc_kor: "우편집중국", desc_eng: "Postal,distribution,center" },
                        { id: "6.4.8.2", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "HB----", desc_kor: "우체국", desc_eng: "Post,office" }
                    ]
                },
                {
                    id: "6.4.9",
                    type: "E",
                    affiliation: "*",
                    battlefield: "F",
                    status: "*",
                    modifier: "I-----",
                    desc_kor: "공공 기반시설",
                    desc_eng: "Public,venues,infrastructure",
                    children: [
                        { id: "6.4.9.1", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "IA----", desc_kor: "폐쇄형 시설", desc_eng: "Enclosed,facility" },
                        { id: "6.4.9.2", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "IB----", desc_kor: "개방형 시설", desc_eng: "Open,facility" },
                        { id: "6.4.9.3", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "IC----", desc_kor: "레크리에이션 지역", desc_eng: "Recreational,area" },
                        { id: "6.4.9.4", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "ID----", desc_kor: "종교단체", desc_eng: "Religious,institution" }
                    ]
                },
                {
                    id: "6.4.10",
                    type: "E",
                    affiliation: "*",
                    battlefield: "F",
                    status: "*",
                    modifier: "J-----",
                    desc_kor: "특수복지시설",
                    desc_eng: "Special,needs,infrastructure",
                    children: [
                        { id: "6.4.10.1", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "JA----", desc_kor: "장애인복지시설", desc_eng: "Adult,day,care" },
                        { id: "6.4.10.2", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "JB----", desc_kor: "아동복지시설", desc_eng: "Child,day,care" },
                        { id: "6.4.10.3", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "JC----", desc_kor: "노인복지시설", desc_eng: "Elder,care" }
                    ]
                },
                {
                    id: "6.4.11",
                    type: "E",
                    affiliation: "*",
                    battlefield: "F",
                    status: "*",
                    modifier: "K-----",
                    desc_kor: "통신기반시설",
                    desc_eng: "Telecommunications,infrastructure",
                    children: [
                        { id: "6.4.11.1", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IUT---", desc_kor: "전화국", desc_eng: "Telecommunications,facility" },
                        { id: "6.4.11.2", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "KB----", desc_kor: "통신탑", desc_eng: "Telecommunications,tower" }
                    ]
                },
                {
                    id: "6.4.12",
                    type: "S",
                    affiliation: "*",
                    battlefield: "G",
                    status: "*",
                    modifier: "IT----",
                    desc_kor: "수송 기반시설",
                    desc_eng: "Transportation,infrastructure",
                    children: [
                        { id: "6.4.12.1", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "LA----", desc_kor: "항공관제시설", desc_eng: "Air,traffic,control,facility" },
                        { id: "6.4.12.2", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IBA---", desc_kor: "공항", desc_eng: "Airport" },
                        { id: "6.4.12.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BCB---", desc_kor: "교량", desc_eng: "Bridge" },
                        { id: "6.4.12.4", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "LD----", desc_kor: "버스정거장", desc_eng: "Bus,station" },
                        { id: "6.4.12.5", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "LE----", desc_kor: "페리터미널", desc_eng: "Ferry,terminal" },
                        { id: "6.4.12.6", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "LF----", desc_kor: "헬기장", desc_eng: "Helicopter,landing,site" },
                        { id: "6.4.12.7", type: "W", affiliation: "O", battlefield: "S", status: "-", modifier: "ML----", desc_kor: "갑문", desc_eng: "Lock" },
                        { id: "6.4.12.8", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "LH----", desc_kor: "보수시설", desc_eng: "Maintenance,facility" },
                        { id: "6.4.12.9", type: "S", affiliation: "*", battlefield: "G", status: "*", modifier: "IBN---", desc_kor: "항구", desc_eng: "Port" },
                        { id: "6.4.12.10", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "LJ----", desc_kor: "철도역", desc_eng: "Rail,station" },
                        { id: "6.4.12.11", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "LK----", desc_kor: "휴게소", desc_eng: "Rest,stop" },
                        { id: "6.4.12.12", type: "W", affiliation: "O", battlefield: "S", status: "-", modifier: "HPBA--", desc_kor: "선박정박지", desc_eng: "Ship,anchorage" },
                        { id: "6.4.12.13", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "LM----", desc_kor: "통행료징수시설", desc_eng: "Toll,facility" },
                        { id: "6.4.12.14", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PO----", desc_kor: "교통통제소", desc_eng: "Traffic,control,point,(TCP)" },
                        { id: "6.4.12.15", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "LO----", desc_kor: "교통검문소", desc_eng: "Traffic,inspection,facility" },
                        { id: "6.4.12.16", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "LP----", desc_kor: "터널", desc_eng: "Tunnel" }
                    ]
                },
                {
                    id: "6.4.13",
                    type: "S",
                    affiliation: "*",
                    battlefield: "G",
                    status: "*",
                    modifier: "IUP---",
                    desc_kor: "급수시설",
                    desc_eng: "Water,supply,infrastructure",
                    children: [
                        { id: "6.4.13.1", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "MA----", desc_kor: "제어밸브", desc_eng: "Control,valve" },
                        { id: "6.4.13.2", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "MB----", desc_kor: "댐", desc_eng: "DAM" },
                        { id: "6.4.13.3", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "MC----", desc_kor: "하수방출구", desc_eng: "Discharge,outfall" },
                        { id: "6.4.13.4", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "MD----", desc_kor: "지하수우물", desc_eng: "Ground,water,well" },
                        { id: "6.4.13.5", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "ME----", desc_kor: "펌프장", desc_eng: "Pumping,station" },
                        { id: "6.4.13.6", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "MF----", desc_kor: "저수지", desc_eng: "Reservoir" },
                        { id: "6.4.13.7", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "MG----", desc_kor: "저장탑", desc_eng: "Storage,tower" },
                        { id: "6.4.13.8", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "MH----", desc_kor: "지표수취수구", desc_eng: "Surface,water,intake" },
                        { id: "6.4.13.9", type: "E", affiliation: "*", battlefield: "F", status: "*", modifier: "MI----", desc_kor: "하수처리시설", desc_eng: "Wastewater,treatment,facility" }
                    ]
                }
            ]
        }
    ]
}];


var { affiliation, mission } = require("./mil_basic");

module.exports = {
    code: "E",
    affiliation: affiliation,
    battlefield: battlefield_Emergency,
    status: status_Emergency,
    unit: unit_Emergency,
    mission: mission,
    identifier: functionIdentifier_Emergency
};
},{"./mil_basic":2}],4:[function(require,module,exports){
/* eslint-disable */

var battlefield_OperAct = [
    { code: "T", desc: "임무" },
    { code: "G", desc: "C2 일반작전" },
    { code: "M", desc: "기동 및 방어" },
    { code: "F", desc: "화력지원" },
    { code: "S", desc: "전투근무지원" },
    { code: "O", desc: "기타" }
];

var status_OperAct = [
    { code: "A", desc: "예상/계획" },
    { code: "S", desc: "의심" },
    { code: "P", desc: "현재" },
    { code: "K", desc: "인식" }
];

var unit_OperAct = {
    "-": [
        { code: "--", desc: " NULL " },
        { code: "-A", desc: " TEAM / CREW 조 / 병사 " },
        { code: "-B", desc: " SQURD 분대 " },
        { code: "-C", desc: " SECTION 반 " },
        { code: "-D", desc: " PLATOON/DETACHMENT 소대 / 분견대 " },
        { code: "-E", desc: " COMPANY / BATTERY / TROOP 중대 / 포대 / 기갑 " },
        { code: "-F", desc: " BATTALION/SQUADRON 대대 / 비행대대 " },
        { code: "-G", desc: " REGIMENT / GROUP 연대 / 단 " },
        { code: "-H", desc: " BRIGADE 여단 " },
        { code: "-I", desc: " DIVISION 사단 " },
        { code: "-J", desc: " CORPS / MEF 군단 " },
        { code: "-K", desc: " ARMY 야전군 " },
        { code: "-L", desc: " ARMY GROUP / FRONT 집단군 " },
        { code: "-M", desc: " REGION 지역군 " },
        { code: "-N", desc: " COMMAND 사령부" }
    ]
};

var mission_OperAct = [
    { code: "X", desc: "제어표시" }
];
var functionIdentifier_OperAct = [{
    id: "2",
    type: "G",
    affiliation: "*",
    battlefield: "-",
    status: "-",
    modifier: "------",
    desc_kor: "작전활동부호",
    desc_eng: "Tactical,graphics",
    children: [{
            id: "2.1",
            type: "G",
            affiliation: "*",
            battlefield: "T",
            status: "*",
            modifier: "------",
            desc_kor: "임무",
            desc_eng: "Tasks",
            children: [
                { id: "2.1.1", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "B-----", desc_kor: "저지", desc_eng: "Block" },
                { id: "2.1.2", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "H-----", desc_kor: "개척", desc_eng: "Breach" },
                { id: "2.1.3", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "Y-----", desc_kor: "우회", desc_eng: "Bypass" },
                { id: "2.1.4", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "C-----", desc_kor: "유인", desc_eng: "Canalize" },
                { id: "2.1.5", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "X-----", desc_kor: "장애물제거", desc_eng: "Clear" },
                { id: "2.1.6", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "J-----", desc_kor: "견제", desc_eng: "Contain" },
                {
                    id: "2.1.7",
                    type: "G",
                    affiliation: "*",
                    battlefield: "T",
                    status: "*",
                    modifier: "K-----",
                    desc_kor: "반격(CATK)",
                    desc_eng: "Counterattack,(CATK)",
                    children: [
                        { id: "2.1.7.1", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "KF----", desc_kor: "반격(화기집중)", desc_eng: "Counterattack,by,fire" }
                    ]
                },
                { id: "2.1.8", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "L-----", desc_kor: "지연", desc_eng: "Delay" },
                { id: "2.1.9", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "D-----", desc_kor: "격멸", desc_eng: "Destroy" },
                { id: "2.1.10", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "T-----", desc_kor: "와해", desc_eng: "Disrupt" },
                { id: "2.1.11", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "F-----", desc_kor: "고착", desc_eng: "Fix" },
                {
                    id: "2.1.12",
                    type: "G",
                    affiliation: "*",
                    battlefield: "T",
                    status: "*",
                    modifier: "A-----",
                    desc_kor: "주공후속",
                    desc_eng: "Follow,and,assume",
                    children: [
                        { id: "2.1.12.1", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "AS----", desc_kor: "후속지원", desc_eng: "Follow,and,support" }
                    ]
                },
                { id: "2.1.13", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "I-----", desc_kor: "차단", desc_eng: "Interdict" },
                { id: "2.1.14", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "E-----", desc_kor: "고립", desc_eng: "Isolate" },
                { id: "2.1.15", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "N-----", desc_kor: "무력화", desc_eng: "Neutralize" },
                { id: "2.1.16", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "O-----", desc_kor: "점령", desc_eng: "Occupy" },
                { id: "2.1.17", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "P-----", desc_kor: "돌파", desc_eng: "Penetrate" },
                { id: "2.1.18", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "R-----", desc_kor: "진지교대", desc_eng: "Relief,in,place,(RIP)" },
                { id: "2.1.19", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "Q-----", desc_kor: "점령유지", desc_eng: "Retain" },
                { id: "2.1.20", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "M-----", desc_kor: "철퇴", desc_eng: "Retirement" },
                { id: "2.1.21", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "S-----", desc_kor: "확보", desc_eng: "Secure" },
                {
                    id: "2.1.22",
                    type: "G",
                    affiliation: "*",
                    battlefield: "T",
                    status: "*",
                    modifier: "U-----",
                    desc_kor: "경계",
                    desc_eng: "Security",
                    children: [
                        { id: "2.1.22.1", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "US----", desc_kor: "차장", desc_eng: "Screen" },
                        { id: "2.1.22.2", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "UG----", desc_kor: "경비", desc_eng: "Guard" },
                        { id: "2.1.22.3", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "UC----", desc_kor: "엄폐", desc_eng: "Cover" },
                        { id: "2.1.22.4", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "UP----", desc_kor: "방호", desc_eng: "방호" }
                    ]
                },
                { id: "2.1.23", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "Z-----", desc_kor: "탈취", desc_eng: "Seize" },
                {
                    id: "2.1.24",
                    type: "G",
                    affiliation: "*",
                    battlefield: "T",
                    status: "*",
                    modifier: "W-----",
                    desc_kor: "철수",
                    desc_eng: "Withdraw",
                    children: [
                        { id: "2.1.24.1", type: "G", affiliation: "*", battlefield: "T", status: "*", modifier: "WP----", desc_kor: "철수(강압)", desc_eng: "Withdraw,under,pressure" }
                    ]
                }
            ]
        },
        {
            id: "2.2",
            type: "G",
            affiliation: "*",
            battlefield: "G",
            status: "*",
            modifier: "------",
            desc_kor: "지휘통제 및 일반작전",
            desc_eng: "Command,and,control,and,general,maneuver",
            children: [{
                    id: "2.2.1",
                    type: "G",
                    affiliation: "*",
                    battlefield: "G",
                    status: "*",
                    modifier: "G-----",
                    desc_kor: "일반",
                    desc_eng: "General",
                    children: [{
                            id: "2.2.1.1",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "GP----",
                            desc_kor: "점",
                            desc_eng: "Points",
                            children: [{
                                    id: "2.2.1.1.1",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "GPU---",
                                    desc_kor: "수중전",
                                    desc_eng: "Under,sea,warfare",
                                    children: [{
                                            id: "2.2.1.1.1.1",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "G",
                                            status: "*",
                                            modifier: "GPUU--",
                                            desc_kor: "수중",
                                            desc_eng: "Underwater",
                                            children: [
                                                { id: "2.2.1.1.1.1.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUUD-", desc_kor: "잠수함최종위치", desc_eng: "Datum" },
                                                { id: "2.2.1.1.1.1.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUUB-", desc_kor: "잠수함 접촉", desc_eng: "Brief,contact" },
                                                { id: "2.2.1.1.1.1.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUUL-", desc_kor: "잠수함 소실", desc_eng: "Lost,contact" },
                                                { id: "2.2.1.1.1.1.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUUS-", desc_kor: "침몰위치", desc_eng: "Sinker" }
                                            ]
                                        },
                                        {
                                            id: "2.2.1.1.1.2",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "G",
                                            status: "*",
                                            modifier: "GPUY--",
                                            desc_kor: "소노부이",
                                            desc_eng: "Sonobuoy",
                                            children: [
                                                { id: "2.2.1.1.1.2.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUYP-", desc_kor: "소노부이(패턴중심)", desc_eng: "Pattern,center" },
                                                { id: "2.2.1.1.1.2.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUYD-", desc_kor: "소노부이(지향성저주파분석기록기)", desc_eng: "Directional,frequency,analyzing,and,recording,(DIFAR)" },
                                                { id: "2.2.1.1.1.2.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUYL-", desc_kor: "소노부이(저주파분석및기록)", desc_eng: "Low,frequency,analyzing,and,recording,(LOFAR)" },
                                                { id: "2.2.1.1.1.2.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUYC-", desc_kor: "소노부이(능동소노부이체계)", desc_eng: "Command,active,sonobuoy,system,(CASS)" },
                                                { id: "2.2.1.1.1.2.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUYS-", desc_kor: "소노부이(지향성능동소노부이체계)", desc_eng: "Directional,command,active,sonobuoy,system,(DICASS)" },
                                                { id: "2.2.1.1.1.2.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUYB-", desc_kor: "소노부이(수온측정기)", desc_eng: "Bathythermograph,transmitting,(BT)" },
                                                { id: "2.2.1.1.1.2.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUYA-", desc_kor: "소노부이(음향부표)", desc_eng: "Anm" },
                                                { id: "2.2.1.1.1.2.8", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUYV-", desc_kor: "소노부이(수직지향성주파수분석기록기", desc_eng: "),Vertical,line,array,difar,(VLAD)" },
                                                { id: "2.2.1.1.1.2.9", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUYT-", desc_kor: "소노부이(공중전달가능음향통신)", desc_eng: "Atac" },
                                                { id: "2.2.1.1.1.2.10", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUYR-", desc_kor: "소노부이(범위만)", desc_eng: "Range,only,(RO)" },
                                                { id: "2.2.1.1.1.2.11", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUYK-", desc_kor: "소노부이(킹핀)", desc_eng: "Kingpin" },
                                                { id: "2.2.1.1.1.2.12", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUYX-", desc_kor: "소노부이(폐기)", desc_eng: "Sonobuoy-expired" }
                                            ]
                                        },
                                        {
                                            id: "2.2.1.1.1.3",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "G",
                                            status: "*",
                                            modifier: "GPUS--",
                                            desc_kor: "수중전(탐색)",
                                            desc_eng: "Search",
                                            children: [
                                                { id: "2.2.1.1.1.3.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUSA-", desc_kor: "수중전(탐색해역)", desc_eng: "Search,area" },
                                                { id: "2.2.1.1.1.3.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUSD-", desc_kor: "수중전(잠항해점)", desc_eng: "Dip,position" },
                                                { id: "2.2.1.1.1.3.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPUSC-", desc_kor: "수중전(탐색중심)", desc_eng: "Search,center" }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: "2.2.1.1.2",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "GPR---",
                                    desc_kor: "참조점",
                                    desc_eng: "Reference,point",
                                    children: [
                                        { id: "2.2.1.1.2.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPRN--", desc_kor: "해군참조점", desc_eng: "Navigational,reference,point" },
                                        { id: "2.2.1.1.2.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPRS--", desc_kor: "특수참조점(함포지원참조점)", desc_eng: "Special,point" },
                                        { id: "2.2.1.1.2.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPRD--", desc_kor: "데이타링크참조점", desc_eng: "Dlrp" },
                                        { id: "2.2.1.1.2.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPRP--", desc_kor: "계획이동지점", desc_eng: "Point,of,intended,movement,(PIM)" },
                                        { id: "2.2.1.1.2.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPRM--", desc_kor: "출동집결지", desc_eng: "Marshall,point" },
                                        { id: "2.2.1.1.2.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPRW--", desc_kor: "경로점", desc_eng: "Waypoint" },
                                        { id: "2.2.1.1.2.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPRC--", desc_kor: "항로 식별점", desc_eng: "Corridor,tab" },
                                        { id: "2.2.1.1.2.8", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPRB--", desc_kor: "선회 대기점", desc_eng: "선회,대기점" },
                                        { id: "2.2.1.1.2.9", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPRE--", desc_kor: "노드 통신소", desc_eng: "Node,Signal,Unit" },
                                        { id: "2.2.1.1.2.10", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPRI--", desc_kor: "관심지점", desc_eng: "Point,of,interest" }
                                    ]
                                },
                                {
                                    id: "2.2.1.1.3",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "GPW---",
                                    desc_kor: "무기",
                                    desc_eng: "Weapon",
                                    children: [
                                        { id: "2.2.1.1.3.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPWA--", desc_kor: "조준점", desc_eng: "Aim,point" },
                                        { id: "2.2.1.1.3.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPWD--", desc_kor: "낙하지점", desc_eng: "Drop,point" },
                                        { id: "2.2.1.1.3.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPWE--", desc_kor: "진입점", desc_eng: "Entry,point" },
                                        { id: "2.2.1.1.3.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPWG--", desc_kor: "지상원점", desc_eng: "Ground,zero" },
                                        { id: "2.2.1.1.3.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPWM--", desc_kor: "유도탄탐지점", desc_eng: "Msl,detect,point" },
                                        { id: "2.2.1.1.3.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPWI--", desc_kor: "탄착지점", desc_eng: "Impact,point" },
                                        { id: "2.2.1.1.3.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPWP--", desc_kor: "예상타격지점", desc_eng: "Predicted,impact,point" }
                                    ]
                                },
                                { id: "2.2.1.1.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPF---", desc_kor: "진형참조점", desc_eng: "Formation" },
                                {
                                    id: "2.2.1.1.5",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "GPH---",
                                    desc_kor: "항만(일반)",
                                    desc_eng: "Harbor,(General)",
                                    children: [
                                        { id: "2.2.1.1.5.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPHQ--", desc_kor: "Q점", desc_eng: "Point,Q" },
                                        { id: "2.2.1.1.5.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPHA--", desc_kor: "A점", desc_eng: "Point,A" },
                                        { id: "2.2.1.1.5.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPHY--", desc_kor: "Y점", desc_eng: "Point,Y" },
                                        { id: "2.2.1.1.5.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPHX--", desc_kor: "X점", desc_eng: "Point,X" }
                                    ]
                                },
                                {
                                    id: "2.2.1.1.6",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "GPO---",
                                    desc_kor: "항로",
                                    desc_eng: "Route",
                                    children: [
                                        { id: "2.2.1.1.6.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPOZ--", desc_kor: "상봉점", desc_eng: "Rendezvous" },
                                        { id: "2.2.1.1.6.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPOD--", desc_kor: "전환점", desc_eng: "Diversions" },
                                        { id: "2.2.1.1.6.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPOW--", desc_kor: "변침점", desc_eng: "Waypoint" },
                                        { id: "2.2.1.1.6.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPOP--", desc_kor: "예정항로", desc_eng: "PIM" },
                                        { id: "2.2.1.1.6.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPOR--", desc_kor: "R점", desc_eng: "Point,R" }
                                    ]
                                },
                                {
                                    id: "2.2.1.1.7",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "GPA---",
                                    desc_kor: "항공통제",
                                    desc_eng: "Air,control",
                                    children: [
                                        { id: "2.2.1.1.7.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAP--", desc_kor: "전투공중초계(CAP)", desc_eng: "Combat,air,patrol,(CAP)" },
                                        { id: "2.2.1.1.7.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAW--", desc_kor: "공중조기경보(AEW)", desc_eng: "Airborne,early,warning,(AEW)" },
                                        { id: "2.2.1.1.7.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAK--", desc_kor: "급유기대기점", desc_eng: "Tanking" },
                                        { id: "2.2.1.1.7.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAA--", desc_kor: "대잠전(고정익)", desc_eng: "Antisubmarine,warfare,,fixed,wing" },
                                        { id: "2.2.1.1.7.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAH--", desc_kor: "대잠전(회전익)", desc_eng: "Antisubmarine,warfare,,rotary,wing" },
                                        { id: "2.2.1.1.7.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAB--", desc_kor: "SUCAP(고정익)", desc_eng: "SUCAP,-,Fixed,wing" },
                                        { id: "2.2.1.1.7.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAC--", desc_kor: "SUCAP(회전익)", desc_eng: "SUCAP,-,Rotary,wing" },
                                        { id: "2.2.1.1.7.8", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAD--", desc_kor: "MIW(고정익)", desc_eng: "MIW,-,Fixed,wing" },
                                        { id: "2.2.1.1.7.9", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAE--", desc_kor: "MIW(회전익)", desc_eng: "MIW,-,Rotary,wing" },
                                        { id: "2.2.1.1.7.10", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAS--", desc_kor: "타격최초지점", desc_eng: "Strike,IP" },
                                        { id: "2.2.1.1.7.11", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAT--", desc_kor: "전술공중항법장비", desc_eng: "Tacan" },
                                        { id: "2.2.1.1.7.12", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAO--", desc_kor: "TOMCAT", desc_eng: "Tomcat" },
                                        { id: "2.2.1.1.7.13", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAR--", desc_kor: "구조", desc_eng: "Rescue" },
                                        { id: "2.2.1.1.7.14", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAL--", desc_kor: "급유", desc_eng: "Replenish" },
                                        { id: "2.2.1.1.7.15", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAF--", desc_kor: "무인항법장치", desc_eng: "Unmanned,aerial,system,(UAS/UA)" },
                                        { id: "2.2.1.1.7.16", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAG--", desc_kor: "VTUA", desc_eng: "VTUA" },
                                        { id: "2.2.1.1.7.17", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAI--", desc_kor: "궤도", desc_eng: "Orbit" },
                                        { id: "2.2.1.1.7.18", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAJ--", desc_kor: "궤도(F8)", desc_eng: "Orbit,-,Figure,eight" },
                                        { id: "2.2.1.1.7.19", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAM--", desc_kor: "궤도(경주로)", desc_eng: "Orbit,-,Race,track" },
                                        { id: "2.2.1.1.7.20", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPAN--", desc_kor: "궤도(랜덤, 폐쇄)", desc_eng: "Orbit,-,Random,,closed" }
                                    ]
                                },
                                {
                                    id: "2.2.1.1.8",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "GPP---",
                                    desc_kor: "활동지점(일반)",
                                    desc_eng: "Action,points,(General)",
                                    children: [
                                        { id: "2.2.1.1.8.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPPK--", desc_kor: "확인점", desc_eng: "Check,point" },
                                        { id: "2.2.1.1.8.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPPC--", desc_kor: "접촉점", desc_eng: "Contact,point" },
                                        { id: "2.2.1.1.8.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPPO--", desc_kor: "협조점", desc_eng: "Coordination,point" },
                                        { id: "2.2.1.1.8.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPPD--", desc_kor: "결심점", desc_eng: "Decision,point" },
                                        { id: "2.2.1.1.8.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPPL--", desc_kor: "연결점", desc_eng: "Linkup,point" },
                                        { id: "2.2.1.1.8.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPPP--", desc_kor: "초월점", desc_eng: "Passage,point" },
                                        { id: "2.2.1.1.8.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPPR--", desc_kor: "재집결점", desc_eng: "Rally,point" },
                                        { id: "2.2.1.1.8.8", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPPE--", desc_kor: "분진점", desc_eng: "Release,point" },
                                        { id: "2.2.1.1.8.9", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPPS--", desc_kor: "출발점", desc_eng: "Start,point" },
                                        { id: "2.2.1.1.8.10", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPPA--", desc_kor: "자진신고점", desc_eng: "Amnesty,point" },
                                        { id: "2.2.1.1.8.11", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPPW--", desc_kor: "경로점", desc_eng: "Waypoint" }
                                    ]
                                },
                                {
                                    id: "2.2.1.1.9",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "GPC---",
                                    desc_kor: "해상통제점",
                                    desc_eng: "Sea,surface,control,station",
                                    children: [{
                                            id: "2.2.1.1.9.1",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "G",
                                            status: "*",
                                            modifier: "GPCU--",
                                            desc_kor: "무인수상선통제점",
                                            desc_eng: "Unmanned,surface,vehicle,(USV),control,station",
                                            children: [
                                                { id: "2.2.1.1.9.1.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPCUR-", desc_kor: "무인수상선(원격 다중임무)통제점", desc_eng: "Remote,multimission,vehicle,(RMV),usv,control,station" },
                                                { id: "2.2.1.1.9.1.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPCUA-", desc_kor: "무인수상선(대잠전)통제점", desc_eng: "USV,-,antisubmarine,warfare,control,station" },
                                                { id: "2.2.1.1.9.1.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPCUS-", desc_kor: "무인수상선(수상전)통제점", desc_eng: "USV,-,surface,warfare,control,station" },
                                                { id: "2.2.1.1.9.1.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPCUM-", desc_kor: "무인수상선(대기뢰전)통제점", desc_eng: "USV,-,mine,warfare,control,station" }
                                            ]
                                        },
                                        { id: "2.2.1.1.9.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPCA--", desc_kor: "대잠전통제점", desc_eng: "ASW,control,station" },
                                        { id: "2.2.1.1.9.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPCS--", desc_kor: "수상전통제점", desc_eng: "SUW,control,station" },
                                        { id: "2.2.1.1.9.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPCM--", desc_kor: "대기뢰전통제점", desc_eng: "MIW,control,station" },
                                        { id: "2.2.1.1.9.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPCP--", desc_kor: "소초통제점", desc_eng: "Picket,control,station" },
                                        { id: "2.2.1.1.9.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPCR--", desc_kor: "접합통제점", desc_eng: "Rendezvous,control,point" },
                                        { id: "2.2.1.1.9.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPCC--", desc_kor: "구조통제점", desc_eng: "Rescue,control,point" },
                                        { id: "2.2.1.1.9.8", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPCE--", desc_kor: "보급통제점", desc_eng: "Replenishment,control,point" },
                                        { id: "2.2.1.1.9.9", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPCN--", desc_kor: "비전투통제점", desc_eng: "Noncombatant,control,station" }
                                    ]
                                },
                                {
                                    id: "2.2.1.1.10",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "GPB---",
                                    desc_kor: "수중통제점",
                                    desc_eng: "Subsurface,control,station",
                                    children: [{
                                            id: "2.2.1.1.10.1",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "G",
                                            status: "*",
                                            modifier: "GPBU--",
                                            desc_kor: "무인수중선통제점",
                                            desc_eng: "Unmanned,underwater,vehicle,(UUV),control,station",
                                            children: [
                                                { id: "2.2.1.1.10.1.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPBUA-", desc_kor: "무인수중선통제점(대잠전)", desc_eng: "UUV,-,antisubmarine,warfare,control,station" },
                                                { id: "2.2.1.1.10.1.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPBUS-", desc_kor: "무인수중선통제점(수상전)", desc_eng: "UUV,-,surface,warfare,control,station" },
                                                { id: "2.2.1.1.10.1.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPBUM-", desc_kor: "무인수중선통제점(대기뢰전)", desc_eng: "UUV,-,mine,warfare,control,station" }
                                            ]
                                        },
                                        {
                                            id: "2.2.1.1.10.2",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "G",
                                            status: "*",
                                            modifier: "GPBS--",
                                            desc_kor: "잠수함통제점",
                                            desc_eng: "Submarine,control,station",
                                            children: [
                                                { id: "2.2.1.1.10.2.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPBSA-", desc_kor: "대잠전잠수함통제점", desc_eng: "Asw,submarine,control,station" }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: "2.2.1.1.11",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "GPD---",
                                    desc_kor: "해안통제점",
                                    desc_eng: "Beach,control,station",
                                    children: [{
                                            id: "2.2.1.1.11.1",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "G",
                                            status: "*",
                                            modifier: "GPDB--",
                                            desc_kor: "해안 표식기",
                                            desc_eng: "Beach,Sign",
                                            children: [
                                                { id: "2.2.1.1.11.1.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPDBL-", desc_kor: "해안 표식기(좌)", desc_eng: "Beach,Sign(left)" },
                                                { id: "2.2.1.1.11.1.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPDBC-", desc_kor: "해안 표식기(중앙)", desc_eng: "Beach,Sign(center)" },
                                                { id: "2.2.1.1.11.1.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPDBR-", desc_kor: "해안 표식기(우)", desc_eng: "Beach,Sign(right)" }
                                            ]
                                        },
                                        {
                                            id: "2.2.1.1.11.2",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "G",
                                            status: "*",
                                            modifier: "GPDL--",
                                            desc_kor: "양륙 표식기",
                                            desc_eng: "Landing,Sign",
                                            children: [
                                                { id: "2.2.1.1.11.2.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPDLA-", desc_kor: "양륙 표식기(1종)", desc_eng: "Landing,Sign(Class,1)" },
                                                { id: "2.2.1.1.11.2.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPDLC-", desc_kor: "양륙 표식기(3종)", desc_eng: "Landing,Sign(Class,3)" },
                                                { id: "2.2.1.1.11.2.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPDLE-", desc_kor: "양륙 표식기(5종)", desc_eng: "Landing,Sign(Class,5)" },
                                                { id: "2.2.1.1.11.2.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPDLH-", desc_kor: "양륙 표식기(8종)", desc_eng: "Landing,Sign(Class,8)" },
                                                { id: "2.2.1.1.11.2.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPDLW-", desc_kor: "양륙 표식기(식수)", desc_eng: "Landing,Sign(Drinking,Water)" },
                                                { id: "2.2.1.1.11.2.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPDLM-", desc_kor: "양륙 표식기(차륜차량)", desc_eng: "Landing,Sign(Motor)" },
                                                { id: "2.2.1.1.11.2.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPDLO-", desc_kor: "양륙 표식기(궤도차량)", desc_eng: "Landing,Sign(Orbit)" },
                                                { id: "2.2.1.1.11.2.8", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GPDLJ-", desc_kor: "양륙 표식기(10종)", desc_eng: "Landing,Sign(Class,10)" }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "2.2.1.2",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "GL----",
                            desc_kor: "선",
                            desc_eng: "Lines",
                            children: [
                                { id: "2.2.1.2.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GLB---", desc_kor: "경계", desc_eng: "Boundaries" },
                                { id: "2.2.1.2.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GLF---", desc_kor: "전선, 부대진출선", desc_eng: "Forward,line,of,own,troops,(FLOT)" },
                                { id: "2.2.1.2.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GLC---", desc_kor: "접촉선", desc_eng: "Line,of,contact" },
                                { id: "2.2.1.2.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GLP---", desc_kor: "통제선", desc_eng: "Phase,line" },
                                { id: "2.2.1.2.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GLL---", desc_kor: "등화관제선", desc_eng: "Light,line" },
                                { id: "2.2.1.2.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GLA---", desc_kor: "적 함정소실", desc_eng: "적,함정소실" },
                                { id: "2.2.1.2.8", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GLE---", desc_kor: "해안두보선", desc_eng: "해안두보선" },
                                { id: "2.2.1.2.28", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GL2---", desc_kor: "적군 전방배치선", desc_eng: "적군,전방배치선" },
                                { id: "2.2.1.2.29", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GL3---", desc_kor: "전투이양선(BHL)", desc_eng: "전투이양선(BHL)" },
                                { id: "2.2.1.2.30", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GL4---", desc_kor: "지상군 전방 전투지경선(FB)", desc_eng: "지상군,전방,전투지경선(FB)" },
                                {
                                    id: "2.2.1.2.31",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "GL5---",
                                    desc_kor: "통신망",
                                    desc_eng: "Network",
                                    children: [
                                        { id: "2.2.1.2.31.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GL5L--", desc_kor: "유선통신망", desc_eng: "Line,Network" },
                                        { id: "2.2.1.2.31.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GL5W--", desc_kor: "무선통신망", desc_eng: "Wireless,Network" },
                                        { id: "2.2.1.2.31.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GL5A--", desc_kor: "부대통신소", desc_eng: "Unit,communication,station" },
                                        { id: "2.2.1.2.31.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GL5B--", desc_kor: "중계소", desc_eng: "Relay,station" },
                                        { id: "2.2.1.2.31.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GL5C--", desc_kor: "전술용유선망도", desc_eng: "Tactical,cable,net,plan" },
                                        { id: "2.2.1.2.31.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GL5D--", desc_kor: "전술용무선망도", desc_eng: "Tactical,radio,net,plan" },
                                        {
                                            id: "2.2.1.2.31.7",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "G",
                                            status: "*",
                                            modifier: "GL5E--",
                                            desc_kor: "전령경로",
                                            desc_eng: "Messenger,Route",
                                            children: [
                                                { id: "2.2.1.2.31.7.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GL5EM-", desc_kor: "주전령경로", desc_eng: "Main,Messenger,Route" },
                                                { id: "2.2.1.2.31.7.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GL5EA-", desc_kor: "예비전령경로", desc_eng: "Alternate,Messenger,Route" }
                                            ]
                                        }
                                    ]
                                },
                                { id: "2.2.1.2.32", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GL6---", desc_kor: "주민이동로", desc_eng: "Moving,Line" }
                            ]
                        },
                        {
                            id: "2.2.1.3",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "GA----",
                            desc_kor: "지역",
                            desc_eng: "Areas",
                            children: [
                                { id: "2.2.1.3.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GAG---", desc_kor: "일반지역", desc_eng: "General,area" },
                                { id: "2.2.1.3.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GAA---", desc_kor: "집결지", desc_eng: "Assembly,area" },
                                { id: "2.2.1.3.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GAE---", desc_kor: "교전지역", desc_eng: "Engagement,area" },
                                { id: "2.2.1.3.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GAF---", desc_kor: "요새지역", desc_eng: "Fortified,area" },
                                { id: "2.2.1.3.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GAD---", desc_kor: "투하지역", desc_eng: "Drop,zone" },
                                { id: "2.2.1.3.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GAX---", desc_kor: "퇴출지역", desc_eng: "Extraction,zone,(EZ)" },
                                { id: "2.2.1.3.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GAL---", desc_kor: "착륙지역", desc_eng: "Landing,zone,(LZ)" },
                                { id: "2.2.1.3.8", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GAP---", desc_kor: "탑재(픽업)지역", desc_eng: "Pickup,zone,(PZ)" },
                                { id: "2.2.1.3.9", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GAS---", desc_kor: "수색정찰지역", desc_eng: "Search,area/Reconnaissance,area" },
                                { id: "2.2.1.3.10", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GAY---", desc_kor: "접근제한지역", desc_eng: "Limited,access,area" },
                                { id: "2.2.1.3.11", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GAZ---", desc_kor: "비행장지대", desc_eng: "Airfield,zone" },
                                {
                                    id: "2.2.1.3.12",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "GAB---",
                                    desc_kor: "비치매트",
                                    desc_eng: "Beach,Mat",
                                    children: [
                                        { id: "2.2.1.3.12.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GABB--", desc_kor: "비치매트", desc_eng: "Beach,Mat" },
                                        { id: "2.2.1.3.12.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "GABH--", desc_kor: "한매트", desc_eng: "Han,Mat" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    id: "2.2.2",
                    type: "G",
                    affiliation: "*",
                    battlefield: "G",
                    status: "*",
                    modifier: "A-----",
                    desc_kor: "항공통제",
                    desc_eng: "Aviation",
                    children: [{
                            id: "2.2.2.1",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "AP----",
                            desc_kor: "점",
                            desc_eng: "Points",
                            children: [
                                { id: "2.2.2.1.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "APP---", desc_kor: "항공통제점", desc_eng: "Air,control,point,(ACP)" },
                                { id: "2.2.2.1.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "APC---", desc_kor: "통신확인점", desc_eng: "Communications,checkpoint,(CCP)" },
                                { id: "2.2.2.1.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "APU---", desc_kor: "급상승지점", desc_eng: "Pull-up,point,(PUP)" },
                                { id: "2.2.2.1.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "APD---", desc_kor: "비상탈출승무원 구조지점", desc_eng: "Downed,aircrew,pickup,point" }
                            ]
                        },
                        {
                            id: "2.2.2.2",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "AL----",
                            desc_kor: "선",
                            desc_eng: "Lines",
                            children: [
                                { id: "2.2.2.2.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ALC---", desc_kor: "비행회랑", desc_eng: "Air,corridor" },
                                { id: "2.2.2.2.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ALM---", desc_kor: "최소위험경로", desc_eng: "Minimum,risk,route,(MRR)" },
                                { id: "2.2.2.2.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ALS---", desc_kor: "일반군용기비행경로", desc_eng: "Standard-use,army,aircraft,flight,route,(SAAFR)" },
                                { id: "2.2.2.2.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ALU---", desc_kor: "무인항공기비행경로", desc_eng: "Unmanned,aircraft,(UA),route" },
                                { id: "2.2.2.2.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ALL---", desc_kor: "저고도비행경로", desc_eng: "Low,level,transit,route,(LLTR)" }
                            ]
                        },
                        {
                            id: "2.2.2.3",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "AA----",
                            desc_kor: "구역",
                            desc_eng: "Areas",
                            children: [
                                { id: "2.2.2.3.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AAR---", desc_kor: "작전제한공역", desc_eng: "Restricted,operations,zone,(ROZ)" },
                                { id: "2.2.2.3.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AAF---", desc_kor: "전방방공구역", desc_eng: "Short-range,air,defense,engagement,zone,(ShorADEZ)" },
                                { id: "2.2.2.3.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AAH---", desc_kor: "고밀도공역통제구역", desc_eng: "High,density,airspace,control,zone,(HiDACZ)" },
                                {
                                    id: "2.2.2.3.4",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "AAM---",
                                    desc_kor: "유도탄교전구역",
                                    desc_eng: "Missile,engagement,zone,(MEZ)",
                                    children: [
                                        { id: "2.2.2.3.4.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AAML--", desc_kor: "저고도유도탄교전구역", desc_eng: "Low,altitude,MEZ" },
                                        { id: "2.2.2.3.4.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AAMH--", desc_kor: "고고도 유도탄교전공역", desc_eng: "High,altitude,MEZ" }
                                    ]
                                },
                                { id: "2.2.2.3.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AAW---", desc_kor: "자유무기사격지대", desc_eng: "Weapons,free,zone" },
                                { id: "2.2.2.3.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AAP---", desc_kor: "다각호형", desc_eng: "Polygon,Arc" },
                                { id: "2.2.2.3.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AAA---", desc_kor: "방위호형", desc_eng: "Radial,Arc" },
                                { id: "2.2.2.3.8", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AAT---", desc_kor: "트랙형", desc_eng: "Track" },
                                { id: "2.2.2.3.9", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AAO---", desc_kor: "궤도형", desc_eng: "Orbit" }
                            ]
                        },
                        {
                            id: "2.2.2.4",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "AS----",
                            desc_kor: "특수부호",
                            desc_eng: "특수부호",
                            children: [{
                                    id: "2.2.2.4.1",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "ASP---",
                                    desc_kor: "점",
                                    desc_eng: "점",
                                    children: [
                                        { id: "2.2.2.4.1.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPG--", desc_kor: "일반", desc_eng: "일반" },
                                        { id: "2.2.2.4.1.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPS--", desc_kor: "Station,", desc_eng: "General" },
                                        { id: "2.2.2.4.1.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPA--", desc_kor: "Station,", desc_eng: "Air" },
                                        { id: "2.2.2.4.1.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPE--", desc_kor: "Station,", desc_eng: "Emergency" },
                                        { id: "2.2.2.4.1.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPH--", desc_kor: "Station,", desc_eng: "Hazard" },
                                        { id: "2.2.2.4.1.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPU--", desc_kor: "Station,", desc_eng: "Support,Unit" },
                                        { id: "2.2.2.4.1.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPN--", desc_kor: "Station,", desc_eng: "Enemy,point" },
                                        { id: "2.2.2.4.1.8", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPR--", desc_kor: "Station,", desc_eng: "Link,participant" },
                                        { id: "2.2.2.4.1.9", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPI--", desc_kor: "Station,", desc_eng: "Site" },
                                        { id: "2.2.2.4.1.10", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPC--", desc_kor: "Station,", desc_eng: "ECM,fix" },
                                        { id: "2.2.2.4.1.11", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPF--", desc_kor: "Station,", desc_eng: "Radar,site" },
                                        { id: "2.2.2.4.1.12", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPM--", desc_kor: "Station,", desc_eng: "Mine,warfare" },
                                        { id: "2.2.2.4.1.13", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASPT--", desc_kor: "Station,", desc_eng: "CAP" }
                                    ]
                                },
                                { id: "2.2.2.4.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AST---", desc_kor: "Track", desc_eng: "SIF" },
                                { id: "2.2.2.4.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASI---", desc_kor: "Intermediate", desc_eng: "told-in,track" },
                                { id: "2.2.2.4.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASM---", desc_kor: "산", desc_eng: "산" },
                                { id: "2.2.2.4.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASC---", desc_kor: "좌표점", desc_eng: "좌표점" },
                                { id: "2.2.2.4.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASA---", desc_kor: "Area", desc_eng: "handles,(when,area,is,hooked)" },
                                { id: "2.2.2.4.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASF---", desc_kor: "Appproach", desc_eng: "fix,(for,border,crossings)" },
                                { id: "2.2.2.4.8", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASB---", desc_kor: "Attention", desc_eng: "arrow" },
                                { id: "2.2.2.4.9", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASD---", desc_kor: "SPI", desc_eng: "code" },
                                { id: "2.2.2.4.10", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASE---", desc_kor: "AOP", desc_eng: "track" },
                                { id: "2.2.2.4.11", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASG---", desc_kor: "Cities", desc_eng: "and,landmarks" },
                                { id: "2.2.2.4.12", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASH---", desc_kor: "Flight", desc_eng: "plan(uncorrelated)" },
                                { id: "2.2.2.4.13", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASJ---", desc_kor: "Flight", desc_eng: "plan(correlated)" },
                                { id: "2.2.2.4.14", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASK---", desc_kor: "Offset/Final", desc_eng: "turn" },
                                { id: "2.2.2.4.15", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASL---", desc_kor: "Mission", desc_eng: "plan(Uncrrelated)" },
                                { id: "2.2.2.4.16", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASN---", desc_kor: "Mission", desc_eng: "plan(correlated)" },
                                { id: "2.2.2.4.17", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASO---", desc_kor: "Present", desc_eng: "uncorrelated,serch" },
                                { id: "2.2.2.4.18", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASQ---", desc_kor: "Present", desc_eng: "correlated,search" },
                                { id: "2.2.2.4.19", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASR---", desc_kor: "Present", desc_eng: "uncorrelated,beacon" },
                                { id: "2.2.2.4.20", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASS---", desc_kor: "Present", desc_eng: "correlated,beacon" },
                                { id: "2.2.2.4.21", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASU---", desc_kor: "Present", desc_eng: "uncorrelated,reinforced,search/beacon" },
                                { id: "2.2.2.4.22", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASV---", desc_kor: "Present", desc_eng: "correlated,reinforced,search/beacon" },
                                { id: "2.2.2.4.23", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASW---", desc_kor: "Plot", desc_eng: "histories" },
                                { id: "2.2.2.4.24", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASX---", desc_kor: "Emergency", desc_eng: "beacon" },
                                { id: "2.2.2.4.25", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASY---", desc_kor: "All", desc_eng: "beacon" },
                                { id: "2.2.2.4.26", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "ASZ---", desc_kor: "Search", desc_eng: "Reinforced,beacon" },
                                { id: "2.2.2.4.27", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AS1---", desc_kor: "Search", desc_eng: "Search" },
                                { id: "2.2.2.4.28", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "AS2---", desc_kor: "Data", desc_eng: "SIF" }
                            ]
                        }
                    ]
                },
                {
                    id: "2.2.3",
                    type: "G",
                    affiliation: "*",
                    battlefield: "G",
                    status: "*",
                    modifier: "P-----",
                    desc_kor: "기만",
                    desc_eng: "Deception",
                    children: [
                        { id: "2.2.3.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "PD----", desc_kor: "모조", desc_eng: "Dummy,(Deception/Decoy)" },
                        { id: "2.2.3.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "PA----", desc_kor: "기만전진축", desc_eng: "Axis,of,advance,for,feint" },
                        { id: "2.2.3.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "PF----", desc_kor: "기만공격방향", desc_eng: "Direction,of,attack,for,feint" },
                        { id: "2.2.3.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "PM----", desc_kor: "기만지뢰지역", desc_eng: "Decoy,mined,area" },
                        { id: "2.2.3.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "PY----", desc_kor: "기만지뢰구역(망)", desc_eng: "Decoy,mined,area,,fenced" },
                        { id: "2.2.3.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "PN----", desc_kor: "모조지뢰지대(설치식)", desc_eng: "Dummy,minefield,(Static)" },
                        { id: "2.2.3.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "PC----", desc_kor: "모조지뢰지대(살포식)", desc_eng: "Dummy,minefield,(Dynamic)" }
                    ]
                },
                {
                    id: "2.2.4",
                    type: "G",
                    affiliation: "*",
                    battlefield: "G",
                    status: "*",
                    modifier: "D-----",
                    desc_kor: "방어",
                    desc_eng: "Defense",
                    children: [{
                            id: "2.2.4.1",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "DP----",
                            desc_kor: "점",
                            desc_eng: "Points",
                            children: [
                                { id: "2.2.4.1.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPT---", desc_kor: "표적참조점", desc_eng: "Target,reference,point,(TRP)" },
                                {
                                    id: "2.2.4.1.2",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "DPO---",
                                    desc_kor: "관측소",
                                    desc_eng: "Observation,post/Outpost",
                                    children: [{
                                            id: "2.2.4.1.2.1",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "G",
                                            status: "*",
                                            modifier: "DPOC--",
                                            desc_kor: "전투전초",
                                            desc_eng: "Combat,outpost",
                                            children: [
                                                { id: "2.2.4.1.2.1.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPOCA-", desc_kor: "초소", desc_eng: "초소" },
                                                { id: "2.2.4.1.2.1.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPOCB-", desc_kor: "잠복초", desc_eng: "잠복초" },
                                                { id: "2.2.4.1.2.1.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPOCC-", desc_kor: "복초", desc_eng: "복초" },
                                                { id: "2.2.4.1.2.1.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPOCD-", desc_kor: "교통초소", desc_eng: "교통초소" },
                                                { id: "2.2.4.1.2.1.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPOCE-", desc_kor: "해안초소", desc_eng: "해안초소" },
                                                { id: "2.2.4.1.2.1.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPOCF-", desc_kor: "대공초소", desc_eng: "대공초소" },
                                                { id: "2.2.4.1.2.1.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPOCG-", desc_kor: "경계분초 및 분견대", desc_eng: "경계분초,및,분견대" }
                                            ]
                                        },
                                        { id: "2.2.4.1.2.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPOR--", desc_kor: "관측소(수색정찰)", desc_eng: "Observation,post,occupied,by,dismounted,scouts,or,reconnaissance" },
                                        { id: "2.2.4.1.2.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPOF--", desc_kor: "전방관측점", desc_eng: "Forward,observer,position" },
                                        { id: "2.2.4.1.2.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPOS--", desc_kor: "감지소/청음초", desc_eng: "Sensor,outpost/Listening,post,(OP/LP)" },
                                        { id: "2.2.4.1.2.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPON--", desc_kor: "화생방관측소", desc_eng: "Cbrn,observation,post,(Dismounted)" },
                                        { id: "2.2.4.1.2.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DPOM--", desc_kor: "수중탐지소", desc_eng: "수중탐지소" }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "2.2.4.2",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "DL----",
                            desc_kor: "선",
                            desc_eng: "Lines",
                            children: [
                                { id: "2.2.4.2.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DLF---", desc_kor: "전투지역전단", desc_eng: "Forward,edge,of,battle,area,(FEBA)" },
                                { id: "2.2.4.2.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DLP---", desc_kor: "주사격방향", desc_eng: "Principal,direction,of,fire,(PDF)" },
                                { id: "2.2.4.2.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DLA---", desc_kor: "봉쇄선", desc_eng: "봉쇄선" },
                                { id: "2.2.4.2.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DLB---", desc_kor: "차단선", desc_eng: "차단선" },
                                { id: "2.2.4.2.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DLC---", desc_kor: "교란사격", desc_eng: "교란사격" }
                            ]
                        },
                        {
                            id: "2.2.4.3",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "DA----",
                            desc_kor: "구역",
                            desc_eng: "Areas",
                            children: [{
                                    id: "2.2.4.3.1",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "DAB---",
                                    desc_kor: "전투진지",
                                    desc_eng: "Battle,position",
                                    children: [
                                        { id: "2.2.4.3.1.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DABP--", desc_kor: "전투진지(미점령)", desc_eng: "Prepared,but,not,occupied" }
                                    ]
                                },
                                { id: "2.2.4.3.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DAE---", desc_kor: "교전구역", desc_eng: "Engagement,area" },
                                { id: "2.2.4.3.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "DAF---", desc_kor: "발열진지", desc_eng: "발열진지" }
                            ]
                        }
                    ]
                },
                {
                    id: "2.2.5",
                    type: "G",
                    affiliation: "*",
                    battlefield: "G",
                    status: "*",
                    modifier: "O-----",
                    desc_kor: "공격",
                    desc_eng: "Offense",
                    children: [{
                            id: "2.2.5.1",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "OP----",
                            desc_kor: "점",
                            desc_eng: "Points",
                            children: [
                                { id: "2.2.5.1.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OPP---", desc_kor: "공격개시점", desc_eng: "Point,of,departure" }
                            ]
                        },
                        {
                            id: "2.2.5.2",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "OL----",
                            desc_kor: "선",
                            desc_eng: "Lines",
                            children: [{
                                    id: "2.2.5.2.1",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "OLA---",
                                    desc_kor: "전진축",
                                    desc_eng: "Axis,of,advance",
                                    children: [
                                        { id: "2.2.5.2.1.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLAV--", desc_kor: "아군항공전진축", desc_eng: "Aviation" },
                                        { id: "2.2.5.2.1.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLAA--", desc_kor: "아군공수전진축", desc_eng: "Airborne" },
                                        { id: "2.2.5.2.1.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLAR--", desc_kor: "아군공격 회전익 전진축", desc_eng: "Attack,,rotary,wing" },
                                        {
                                            id: "2.2.5.2.1.4",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "G",
                                            status: "*",
                                            modifier: "OLAG--",
                                            desc_kor: "지상전진축",
                                            desc_eng: "Ground",
                                            children: [
                                                { id: "2.2.5.2.1.4.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLAGM-", desc_kor: "지상주공전진측", desc_eng: "Main,attack" },
                                                { id: "2.2.5.2.1.4.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLAGS-", desc_kor: "지상조공전진축", desc_eng: "Supporting,attack" }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    id: "2.2.5.2.2",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "OLK---",
                                    desc_kor: "공격방향",
                                    desc_eng: "Direction,of,attack",
                                    children: [
                                        { id: "2.2.5.2.2.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLKA--", desc_kor: "공중공격방향", desc_eng: "Aviation" },
                                        {
                                            id: "2.2.5.2.2.2",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "G",
                                            status: "*",
                                            modifier: "OLKG--",
                                            desc_kor: "지상공격방향",
                                            desc_eng: "Ground",
                                            children: [
                                                { id: "2.2.5.2.2.2.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLKGM-", desc_kor: "지상주공방향", desc_eng: "Main,attack" },
                                                { id: "2.2.5.2.2.2.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLKGS-", desc_kor: "지상조공방향", desc_eng: "Supporting,attack" }
                                            ]
                                        }
                                    ]
                                },
                                { id: "2.2.5.2.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLF---", desc_kor: "최후협조선", desc_eng: "Final,coordination,line" },
                                { id: "2.2.5.2.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLI---", desc_kor: "침투로", desc_eng: "Infiltration,lane" },
                                { id: "2.2.5.2.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLL---", desc_kor: "전진한계선", desc_eng: "Limit,of,advance" },
                                { id: "2.2.5.2.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLT---", desc_kor: "공격개시선", desc_eng: "Line,of,departure" },
                                { id: "2.2.5.2.7", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLC---", desc_kor: "공격개시선/접촉선", desc_eng: "Line,of,departure/line,of,contact,(LD/LC)" },
                                { id: "2.2.5.2.8", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OLP---", desc_kor: "예상전개선", desc_eng: "Probable,line,of,deployment,(PLD)" }
                            ]
                        },
                        {
                            id: "2.2.5.3",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "OA----",
                            desc_kor: "구역",
                            desc_eng: "Areas",
                            children: [
                                { id: "2.2.5.3.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OAA---", desc_kor: "돌격진지", desc_eng: "Assault,position" },
                                { id: "2.2.5.3.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OAK---", desc_kor: "공격대기지역", desc_eng: "Attack,position" },
                                { id: "2.2.5.3.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OAF---", desc_kor: "사격지점(공격)", desc_eng: "Attack,by,fire,position" },
                                { id: "2.2.5.3.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OAS---", desc_kor: "사격지원진지", desc_eng: "Support,by,fire,position" },
                                { id: "2.2.5.3.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OAO---", desc_kor: "목표", desc_eng: "Objective" },
                                { id: "2.2.5.3.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "OAP---", desc_kor: "돌파구역", desc_eng: "Penetration,box" }
                            ]
                        }
                    ]
                },
                {
                    id: "2.2.6",
                    type: "G",
                    affiliation: "*",
                    battlefield: "G",
                    status: "*",
                    modifier: "S-----",
                    desc_kor: "특수",
                    desc_eng: "Special",
                    children: [{
                            id: "2.2.6.1",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "SL----",
                            desc_kor: "선",
                            desc_eng: "Line",
                            children: [{
                                    id: "2.2.6.1.1",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "G",
                                    status: "*",
                                    modifier: "SLA---",
                                    desc_kor: "매복",
                                    desc_eng: "Ambush",
                                    children: [
                                        { id: "2.2.6.1.1.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "SLAA--", desc_kor: "분대매복", desc_eng: "Ambush(Squad)" },
                                        { id: "2.2.6.1.1.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "SLAB--", desc_kor: "소대매복", desc_eng: "소대매복" },
                                        { id: "2.2.6.1.1.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "SLAD--", desc_kor: "화기매복", desc_eng: "화기매복" }
                                    ]
                                },
                                { id: "2.2.6.1.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "SLH---", desc_kor: "견제선", desc_eng: "Holding,line" },
                                { id: "2.2.6.1.3", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "SLR---", desc_kor: "분진선", desc_eng: "Release,line" },
                                { id: "2.2.6.1.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "SLB---", desc_kor: "교두보", desc_eng: "Bridgehead" }
                            ]
                        },
                        {
                            id: "2.2.6.2",
                            type: "G",
                            affiliation: "*",
                            battlefield: "G",
                            status: "*",
                            modifier: "SA----",
                            desc_kor: "구역",
                            desc_eng: "Area",
                            children: [
                                { id: "2.2.6.2.1", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "SAO---", desc_kor: "작전구역", desc_eng: "Area,of,operations,(AO)" },
                                { id: "2.2.6.2.2", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "SAA---", desc_kor: "공두보", desc_eng: "Airhead" },
                                { id: "2.2.6.2.4", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "SAE---", desc_kor: "포위지역", desc_eng: "Encirclement" },
                                { id: "2.2.6.2.5", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "SAN---", desc_kor: "중요관심지역", desc_eng: "Named,area,of,interest,(NAI)" },
                                { id: "2.2.6.2.6", type: "G", affiliation: "*", battlefield: "G", status: "*", modifier: "SAT---", desc_kor: "관심타격지역", desc_eng: "Targeted,area,of,interest,(TAI)" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "2.3",
            type: "G",
            affiliation: "*",
            battlefield: "M",
            status: "*",
            modifier: "------",
            desc_kor: "기동 및 방어",
            desc_eng: "Mobility/Survivability",
            children: [{
                    id: "2.3.1",
                    type: "G",
                    affiliation: "*",
                    battlefield: "M",
                    status: "*",
                    modifier: "O-----",
                    desc_kor: "장애물",
                    desc_eng: "Obstacles",
                    children: [{
                            id: "2.3.1.1",
                            type: "G",
                            affiliation: "*",
                            battlefield: "M",
                            status: "*",
                            modifier: "OG----",
                            desc_kor: "일반",
                            desc_eng: "General",
                            children: [
                                { id: "2.3.1.1.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGB---", desc_kor: "장애물지대", desc_eng: "Belt" },
                                { id: "2.3.1.1.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGL---", desc_kor: "장애물라인", desc_eng: "Line" },
                                { id: "2.3.1.1.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGZ---", desc_kor: "장애물지역", desc_eng: "Zone" },
                                { id: "2.3.1.1.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGF---", desc_kor: "장애물허가구역", desc_eng: "Obstacle,free,area" },
                                { id: "2.3.1.1.5", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGR---", desc_kor: "장애물제한구역", desc_eng: "Obstacle,restricted,area" },
                                { id: "2.3.1.1.6", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGA---", desc_kor: "사태,돌폭뢰 등 폭파지역", desc_eng: "사태,돌폭뢰,등,폭파지역" },
                                { id: "2.3.1.1.7", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGC---", desc_kor: "이동차단물대", desc_eng: "이동차단물대" },
                                { id: "2.3.1.1.8", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGD---", desc_kor: "장애물", desc_eng: "장애물" },
                                { id: "2.3.1.1.9", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGE---", desc_kor: "기타장애물(육상)", desc_eng: "기타장애물(육상)" },
                                { id: "2.3.1.1.10", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGG---", desc_kor: "기계적인 장애물", desc_eng: "기계적인,장애물" },
                                { id: "2.3.1.1.11", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGH---", desc_kor: "장벽", desc_eng: "장벽" },
                                { id: "2.3.1.1.12", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGI---", desc_kor: "단애", desc_eng: "단애" },
                                { id: "2.3.1.1.13", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGJ---", desc_kor: "기타군장애물위치", desc_eng: "기타군장애물위치" },
                                { id: "2.3.1.1.14", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OGK---", desc_kor: "장애물극복", desc_eng: "장애물극복" }
                            ]
                        },
                        { id: "2.3.1.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OS----", desc_kor: "목책(녹채)", desc_eng: "Abatis" },
                        {
                            id: "2.3.1.3",
                            type: "G",
                            affiliation: "*",
                            battlefield: "M",
                            status: "*",
                            modifier: "OA----",
                            desc_kor: "대전차장애물",
                            desc_eng: "Antitank,obstacles",
                            children: [{
                                    id: "2.3.1.3.1",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "M",
                                    status: "*",
                                    modifier: "OAD---",
                                    desc_kor: "대전차구",
                                    desc_eng: "Antitank,ditch",
                                    children: [
                                        { id: "2.3.1.3.1.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OADU--", desc_kor: "대전차구(건설중)", desc_eng: "Under,construction" },
                                        { id: "2.3.1.3.1.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OADC--", desc_kor: "대전차구(완성)", desc_eng: "Complete" },
                                        { id: "2.3.1.3.1.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OADD--", desc_kor: "거부완료", desc_eng: "거부완료" },
                                        {
                                            id: "2.3.1.3.1.4",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "M",
                                            status: "*",
                                            modifier: "OADA--",
                                            desc_kor: "낙석장애물",
                                            desc_eng: "낙석장애물",
                                            children: [
                                                { id: "2.3.1.3.1.4.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OADAA-", desc_kor: "낙석준비", desc_eng: "낙석준비" }
                                            ]
                                        },
                                        {
                                            id: "2.3.1.3.1.5",
                                            type: "G",
                                            affiliation: "*",
                                            battlefield: "M",
                                            status: "*",
                                            modifier: "OADB--",
                                            desc_kor: "고가낙석",
                                            desc_eng: "고가낙석",
                                            children: [
                                                { id: "2.3.1.3.1.5.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OADBA-", desc_kor: "고가낙석준비", desc_eng: "고가낙석준비" }
                                            ]
                                        },
                                        { id: "2.3.1.3.1.6", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OADE--", desc_kor: "도로대화구", desc_eng: "도로대화구" }
                                    ]
                                },
                                { id: "2.3.1.3.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OAR---", desc_kor: "대전차구(대전차지뢰포함)", desc_eng: "Antitank,ditch,reinforced,with,antitank,mines" },
                                {
                                    id: "2.3.1.3.3",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "M",
                                    status: "*",
                                    modifier: "OAO---",
                                    desc_kor: "대전차장애물,용치,기타",
                                    desc_eng: "Antitank,obstacles:,tetrahedrons,,dragons,teeth,,and,other,similar,obstacles",
                                    children: [
                                        { id: "2.3.1.3.3.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OAOF--", desc_kor: "대전차장애물(고정,조립식)", desc_eng: "Fixed,and,prefabricated" },
                                        { id: "2.3.1.3.3.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OAOM--", desc_kor: "대전차장애물(이동식)", desc_eng: "Moveable" },
                                        { id: "2.3.1.3.3.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OAOP--", desc_kor: "대전차장애물(이동,조립식)", desc_eng: "Moveable,and,prefabricated" }
                                    ]
                                },
                                { id: "2.3.1.3.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OAW---", desc_kor: "대전차방벽", desc_eng: "Antitank,wall" }
                            ]
                        },
                        { id: "2.3.1.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OB----", desc_kor: "부비트랩", desc_eng: "Booby,trap" },
                        {
                            id: "2.3.1.5",
                            type: "G",
                            affiliation: "*",
                            battlefield: "M",
                            status: "*",
                            modifier: "OM----",
                            desc_kor: "지뢰",
                            desc_eng: "Mines",
                            children: [
                                { id: "2.3.1.5.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OMU---", desc_kor: "불명확지뢰", desc_eng: "Unspecified,mine" },
                                {
                                    id: "2.3.1.5.2",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "M",
                                    status: "*",
                                    modifier: "OMT---",
                                    desc_kor: "대전차지뢰",
                                    desc_eng: "Antitank,mine,(AT)",
                                    children: [
                                        { id: "2.3.1.5.2.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OMTA--", desc_kor: "대전차지뢰열", desc_eng: "대전차지뢰열" }
                                    ]
                                },
                                { id: "2.3.1.5.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OMD---", desc_kor: "대전차지뢰(제거방지장치)", desc_eng: "Antitank,mine,with,antihandling,device" },
                                { id: "2.3.1.5.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OME---", desc_kor: "대전차지뢰(지향성)", desc_eng: "Antitank,mine,(Directional)" },
                                {
                                    id: "2.3.1.5.5",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "M",
                                    status: "*",
                                    modifier: "OMP---",
                                    desc_kor: "대인지뢰",
                                    desc_eng: "Antipersonnel,(AP),mines",
                                    children: [
                                        { id: "2.3.1.5.5.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OMPA--", desc_kor: "대인지뢰열", desc_eng: "대인지뢰열" }
                                    ]
                                },
                                { id: "2.3.1.5.6", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OMW---", desc_kor: "살포식지뢰", desc_eng: "Wide,area,mines" },
                                { id: "2.3.1.5.7", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OMC---", desc_kor: "지뢰군", desc_eng: "Mine,cluster" },
                                { id: "2.3.1.5.8", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OMA---", desc_kor: "돌출봉지뢰", desc_eng: "돌출봉지뢰" },
                                { id: "2.3.1.5.9", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OMB---", desc_kor: "조명지뢰", desc_eng: "조명지뢰" },
                                { id: "2.3.1.5.10", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OMF---", desc_kor: "다중크레모아", desc_eng: "다중크레모아" }
                            ]
                        },
                        {
                            id: "2.3.1.6",
                            type: "G",
                            affiliation: "*",
                            battlefield: "M",
                            status: "*",
                            modifier: "OF----",
                            desc_kor: "지뢰지대",
                            desc_eng: "Minefields",
                            children: [
                                { id: "2.3.1.6.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OFS---", desc_kor: "지뢰지대(설치식)", desc_eng: "Static,depiction" },
                                { id: "2.3.1.6.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OFD---", desc_kor: "지뢰지대(살포식)", desc_eng: "Dynamic,depiction" },
                                { id: "2.3.1.6.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OFG---", desc_kor: "간격(지뢰 또는 장애물이 없는지대)", desc_eng: "Gap" },
                                { id: "2.3.1.6.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OFA---", desc_kor: "지뢰지역", desc_eng: "Mined,area" }
                            ]
                        },
                        {
                            id: "2.3.1.7",
                            type: "G",
                            affiliation: "*",
                            battlefield: "M",
                            status: "*",
                            modifier: "OE----",
                            desc_kor: "장애물 효과",
                            desc_eng: "Obstacle,effect",
                            children: [
                                { id: "2.3.1.7.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OEB---", desc_kor: "저지(장애물효과)", desc_eng: "Block" },
                                { id: "2.3.1.7.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OEF---", desc_kor: "고착(장애물효과)", desc_eng: "Fix" },
                                { id: "2.3.1.7.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OET---", desc_kor: "유인(장애물효과)", desc_eng: "Turn" },
                                { id: "2.3.1.7.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OED---", desc_kor: "와해(장애물효과)", desc_eng: "Disrupt" }
                            ]
                        },
                        { id: "2.3.1.8", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OU----", desc_kor: "불발탄 탄착지역", desc_eng: "Unexploded,ordnance,area,(UXO)" },
                        {
                            id: "2.3.1.9",
                            type: "G",
                            affiliation: "*",
                            battlefield: "M",
                            status: "*",
                            modifier: "OR----",
                            desc_kor: "도로봉쇄,대화구,폭파된교량",
                            desc_eng: "Roadblocks,,craters,,and,blown,bridges",
                            children: [
                                { id: "2.3.1.9.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "ORP---", desc_kor: "폭파예정", desc_eng: "Planned" },
                                { id: "2.3.1.9.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "ORS---", desc_kor: "폭파준비1(안전)", desc_eng: "Explosives,,state,of,readiness,1,(Safe)" },
                                { id: "2.3.1.9.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "ORA---", desc_kor: "폭파준비2(설치완료)", desc_eng: "Explosives,,state,of,readiness,2,(Armed-but,passable)" },
                                { id: "2.3.1.9.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "ORC---", desc_kor: "도로봉쇄완료(폭파완료)", desc_eng: "Roadblock,complete,(Executed)" }
                            ]
                        },
                        { id: "2.3.1.10", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OT----", desc_kor: "인계철선", desc_eng: "Trip,wire" },
                        {
                            id: "2.3.1.11",
                            type: "G",
                            affiliation: "*",
                            battlefield: "M",
                            status: "*",
                            modifier: "OW----",
                            desc_kor: "철조망",
                            desc_eng: "Wire,obstacle",
                            children: [
                                { id: "2.3.1.11.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OWU---", desc_kor: "불명확철조망", desc_eng: "Unspecified" },
                                { id: "2.3.1.11.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OWS---", desc_kor: "단선철조망", desc_eng: "Single,fence" },
                                { id: "2.3.1.11.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OWD---", desc_kor: "복선철조망", desc_eng: "Double,fence" },
                                { id: "2.3.1.11.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OWA---", desc_kor: "복선지붕형철조망", desc_eng: "Double,apron,fence" },
                                { id: "2.3.1.11.5", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OWL---", desc_kor: "저가철조망", desc_eng: "Low,wire,fence" },
                                { id: "2.3.1.11.6", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OWH---", desc_kor: "고가철조망", desc_eng: "High,wire,fence" },
                                {
                                    id: "2.3.1.11.7",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "M",
                                    status: "*",
                                    modifier: "OWC---",
                                    desc_kor: "윤형철조망",
                                    desc_eng: "Concertina",
                                    children: [
                                        { id: "2.3.1.11.7.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OWCS--", desc_kor: "단선윤형철조망", desc_eng: "Single,concertina" },
                                        { id: "2.3.1.11.7.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OWCD--", desc_kor: "복선윤형철조망", desc_eng: "Double,strand,concertina" },
                                        { id: "2.3.1.11.7.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OWCT--", desc_kor: "삼선윤형철조망", desc_eng: "Triple,strand,concertina" },
                                        { id: "2.3.1.11.7.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OWCA--", desc_kor: "전기철조망", desc_eng: "전기철조망" }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "2.3.1.12",
                            type: "G",
                            affiliation: "*",
                            battlefield: "M",
                            status: "*",
                            modifier: "OH----",
                            desc_kor: "비행장애물",
                            desc_eng: "Aviation",
                            children: [{
                                    id: "2.3.1.12.1",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "M",
                                    status: "*",
                                    modifier: "OHT---",
                                    desc_kor: "탑",
                                    desc_eng: "Tower",
                                    children: [
                                        { id: "2.3.1.12.1.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OHTL--", desc_kor: "탑(저고도)", desc_eng: "Low" },
                                        { id: "2.3.1.12.1.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OHTH--", desc_kor: "탑(고고도)", desc_eng: "High" }
                                    ]
                                },
                                { id: "2.3.1.12.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "OHO---", desc_kor: "가공전선/송전선", desc_eng: "Overhead,wire/Power,line" }
                            ]
                        }
                    ]
                },
                {
                    id: "2.3.2",
                    type: "G",
                    affiliation: "*",
                    battlefield: "M",
                    status: "*",
                    modifier: "B-----",
                    desc_kor: "장애물우회",
                    desc_eng: "Obstacle,bypass",
                    children: [{
                            id: "2.3.2.1",
                            type: "G",
                            affiliation: "*",
                            battlefield: "M",
                            status: "*",
                            modifier: "BD----",
                            desc_kor: "장애물우회곤란정도",
                            desc_eng: "Obstacle,bypass,difficulty",
                            children: [
                                { id: "2.3.2.1.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BDE---", desc_kor: "우회가능", desc_eng: "Bypass,easy" },
                                { id: "2.3.2.1.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BDD---", desc_kor: "우회곤란", desc_eng: "Bypass,difficult" },
                                { id: "2.3.2.1.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BDI---", desc_kor: "우회불가", desc_eng: "Bypass,impossible" }
                            ]
                        },
                        {
                            id: "2.3.2.2",
                            type: "G",
                            affiliation: "*",
                            battlefield: "M",
                            status: "*",
                            modifier: "BC----",
                            desc_kor: "도하",
                            desc_eng: "Crossing,site/Water,crossing",
                            children: [
                                { id: "2.3.2.2.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BCA---", desc_kor: "공격도하지점", desc_eng: "Assault,crossing,area" },
                                { id: "2.3.2.2.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BCB---", desc_kor: "교량도하", desc_eng: "Bridge,or,gap" },
                                { id: "2.3.2.2.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BCF---", desc_kor: "도선장", desc_eng: "Ferry" },
                                { id: "2.3.2.2.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BCE---", desc_kor: "도섭가능", desc_eng: "Ford,easy" },
                                { id: "2.3.2.2.5", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BCD---", desc_kor: "도섭곤란", desc_eng: "Ford,difficult" },
                                { id: "2.3.2.2.6", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BCL---", desc_kor: "도하통로", desc_eng: "Lane" },
                                { id: "2.3.2.2.7", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BCR---", desc_kor: "문교지점", desc_eng: "Raft,site" },
                                { id: "2.3.2.2.8", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BCP---", desc_kor: "공병통제소", desc_eng: "Engineer,regulating,point" },
                                { id: "2.3.2.2.9", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BCC---", desc_kor: "공병장비집적소", desc_eng: "공병장비집적소" },
                                { id: "2.3.2.2.10", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BCG---", desc_kor: "철교(거부작전실시위치)", desc_eng: "철교(거부작전실시위치)" },
                                { id: "2.3.2.2.11", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "BCH---", desc_kor: "터널(피해복구)", desc_eng: "터널(피해복구)" }
                            ]
                        }
                    ]
                },
                {
                    id: "2.3.3",
                    type: "G",
                    affiliation: "*",
                    battlefield: "M",
                    status: "*",
                    modifier: "S-----",
                    desc_kor: "방어",
                    desc_eng: "Survivability",
                    children: [
                        { id: "2.3.3.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SE----", desc_kor: "둑,참호,축성", desc_eng: "Earthwork,,small,trench,or,fortification" },
                        { id: "2.3.3.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SF----", desc_kor: "요새", desc_eng: "Fort" },
                        { id: "2.3.3.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SL----", desc_kor: "요새방어선", desc_eng: "Fortified,line" },
                        { id: "2.3.3.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SW----", desc_kor: "유개엄체호", desc_eng: "Foxhole,,emplacement,or,weapon,site" },
                        { id: "2.3.3.5", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SP----", desc_kor: "거점", desc_eng: "Strong,point" },
                        { id: "2.3.3.6", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SS----", desc_kor: "지상엄체", desc_eng: "Surface,shelter" },
                        { id: "2.3.3.7", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SU----", desc_kor: "지하엄체", desc_eng: "Underground,shelter" },
                        { id: "2.3.3.8", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SA----", desc_kor: "교통호", desc_eng: "교통호" },
                        { id: "2.3.3.9", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SB----", desc_kor: "교통호(총안구)", desc_eng: "교통호(총안구)" },
                        { id: "2.3.3.10", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SC----", desc_kor: "교통호(구축중)", desc_eng: "교통호(구축중)" },
                        { id: "2.3.3.11", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SD----", desc_kor: "갱도", desc_eng: "갱도" },
                        { id: "2.3.3.12", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SG----", desc_kor: "토목화점", desc_eng: "토목화점" },
                        { id: "2.3.3.13", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SH----", desc_kor: "일화구영구화점", desc_eng: "일화구영구화점" },
                        { id: "2.3.3.14", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SI----", desc_kor: "쌍화구화점", desc_eng: "쌍화구화점" },
                        { id: "2.3.3.15", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "SJ----", desc_kor: "비밀화점", desc_eng: "비밀화점" }
                    ]
                },
                {
                    id: "2.3.4",
                    type: "G",
                    affiliation: "*",
                    battlefield: "M",
                    status: "*",
                    modifier: "N-----",
                    desc_kor: "화생방",
                    desc_eng: "Chemical,,biological,,radiological,,and,nuclear",
                    children: [
                        { id: "2.3.4.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NM----", desc_kor: "최소안전지대", desc_eng: "Minimum,safe,distance,zones" },
                        { id: "2.3.4.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NZ----", desc_kor: "핵폭발지점", desc_eng: "Nuclear,detonations,ground,zero" },
                        { id: "2.3.4.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NF----", desc_kor: "낙진발생지점", desc_eng: "Fallout,producing" },
                        { id: "2.3.4.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NR----", desc_kor: "방사능오염지역", desc_eng: "Radioactive,area" },
                        { id: "2.3.4.5", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NB----", desc_kor: "생물학오염지역", desc_eng: "Biologically,contaminated,area" },
                        { id: "2.3.4.6", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NC----", desc_kor: "화학오염지역", desc_eng: "Chemically,contaminated,area" },
                        {
                            id: "2.3.4.7",
                            type: "G",
                            affiliation: "*",
                            battlefield: "M",
                            status: "*",
                            modifier: "NE----",
                            desc_kor: "오염발생",
                            desc_eng: "Release,events",
                            children: [
                                { id: "2.3.4.7.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NEB---", desc_kor: "오염발생(생물학)", desc_eng: "Biological" },
                                { id: "2.3.4.7.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NEC---", desc_kor: "오염발생(화학)", desc_eng: "Chemical" }
                            ]
                        },
                        {
                            id: "2.3.4.8",
                            type: "G",
                            affiliation: "*",
                            battlefield: "M",
                            status: "*",
                            modifier: "ND----",
                            desc_kor: "제독지점",
                            desc_eng: "Decontamination,(DECON),points",
                            children: [
                                { id: "2.3.4.8.1", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NDP---", desc_kor: "제독지점(불명확)", desc_eng: "Decon,site/point,(Unspecified)" },
                                { id: "2.3.4.8.2", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NDA---", desc_kor: "대체제독지점(불명확)", desc_eng: "Alternate,decon,site/point,(Unspecified)" },
                                { id: "2.3.4.8.3", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NDT---", desc_kor: "제독지점(부대)", desc_eng: "Decon,site/point,(Troops)" },
                                { id: "2.3.4.8.4", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NDE---", desc_kor: "제독지점(장비)", desc_eng: "Decon,site/point,(Equipment)" },
                                { id: "2.3.4.8.5", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NDB---", desc_kor: "제독지점(장비및부대)", desc_eng: "Decon,site/point,(Equipment,and,troops)" },
                                { id: "2.3.4.8.6", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NDO---", desc_kor: "제독지점(작전상제독)", desc_eng: "Decon,site/point,(Operational,decontamination)" },
                                { id: "2.3.4.8.7", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NDD---", desc_kor: "제독지점(완전제독)", desc_eng: "Decon,site/point,(Thorough,decontamination)" },
                                { id: "2.3.4.8.8", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NDF---", desc_kor: "제독지점(인원)", desc_eng: "제독지점(인원)" },
                                { id: "2.3.4.8.9", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NDG---", desc_kor: "제독지점(정밀)", desc_eng: "제독지점(정밀)" },
                                { id: "2.3.4.8.10", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NDH---", desc_kor: "제독지점(급속)", desc_eng: "제독지점(급속)" },
                                { id: "2.3.4.8.11", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NDC---", desc_kor: "제독급수원", desc_eng: "제독급수원" }
                            ]
                        },
                        { id: "2.3.4.9", type: "G", affiliation: "*", battlefield: "M", status: "*", modifier: "NL----", desc_kor: "오염윤곽선", desc_eng: "Dose,rate,contour,lines" }
                    ]
                }
            ]
        },
        {
            id: "2.4",
            type: "G",
            affiliation: "*",
            battlefield: "F",
            status: "*",
            modifier: "------",
            desc_kor: "화력지원",
            desc_eng: "Fire,support",
            children: [{
                    id: "2.4.1",
                    type: "G",
                    affiliation: "*",
                    battlefield: "F",
                    status: "*",
                    modifier: "P-----",
                    desc_kor: "점",
                    desc_eng: "Point",
                    children: [{
                            id: "2.4.1.1",
                            type: "G",
                            affiliation: "*",
                            battlefield: "F",
                            status: "*",
                            modifier: "PT----",
                            desc_kor: "표적",
                            desc_eng: "Target",
                            children: [
                                { id: "2.4.1.1.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "PTS---", desc_kor: "점/단일표적", desc_eng: "Point/Single,target" },
                                { id: "2.4.1.1.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "PTN---", desc_kor: "핵표적", desc_eng: "Nuclear,target" }
                            ]
                        },
                        {
                            id: "2.4.1.2",
                            type: "G",
                            affiliation: "*",
                            battlefield: "F",
                            status: "*",
                            modifier: "PC----",
                            desc_kor: "지휘통제점",
                            desc_eng: "Command/Control,points",
                            children: [
                                { id: "2.4.1.2.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "PCF---", desc_kor: "화력지원지점", desc_eng: "Fire,support,station" },
                                { id: "2.4.1.2.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "PCS---", desc_kor: "측량통제점", desc_eng: "Survey,control,point" },
                                { id: "2.4.1.2.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "PCB---", desc_kor: "사격위치", desc_eng: "Firing,point" },
                                { id: "2.4.1.2.4", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "PCR---", desc_kor: "재장전위치", desc_eng: "Reload,point" },
                                { id: "2.4.1.2.5", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "PCH---", desc_kor: "은폐위치", desc_eng: "Hide,point" },
                                { id: "2.4.1.2.6", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "PCL---", desc_kor: "발사위치", desc_eng: "Launch,point" }
                            ]
                        }
                    ]
                },
                {
                    id: "2.4.2",
                    type: "G",
                    affiliation: "*",
                    battlefield: "F",
                    status: "*",
                    modifier: "L-----",
                    desc_kor: "선",
                    desc_eng: "Lines",
                    children: [{
                            id: "2.4.2.1",
                            type: "G",
                            affiliation: "*",
                            battlefield: "F",
                            status: "*",
                            modifier: "LT----",
                            desc_kor: "선형표적",
                            desc_eng: "Linear,target",
                            children: [
                                { id: "2.4.2.1.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "LTS---", desc_kor: "선형연막표적", desc_eng: "Linear,smoke,target" },
                                { id: "2.4.2.1.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "LTF---", desc_kor: "최후방어사격", desc_eng: "Final,protective,fire,(FPF)" }
                            ]
                        },
                        {
                            id: "2.4.2.2",
                            type: "G",
                            affiliation: "*",
                            battlefield: "F",
                            status: "*",
                            modifier: "LC----",
                            desc_kor: "지휘통제선",
                            desc_eng: "Command/control,lines",
                            children: [
                                { id: "2.4.2.2.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "LCF---", desc_kor: "화력지원협조선(FSCL)", desc_eng: "Fire,support,coordination,line,(FSCL)" },
                                { id: "2.4.2.2.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "LCC---", desc_kor: "사격협조선(CFL)", desc_eng: "Coordinated,fire,line,(CFL)" },
                                { id: "2.4.2.2.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "LCN---", desc_kor: "화력금지선", desc_eng: "No-fire,line,(NFL)" },
                                { id: "2.4.2.2.4", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "LCR---", desc_kor: "사격제한선", desc_eng: "Restrictive,fire,line,(RFL)" },
                                { id: "2.4.2.2.5", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "LCM---", desc_kor: "군수비행경로", desc_eng: "Munition,flight,path,(MFP)" }
                            ]
                        }
                    ]
                },
                {
                    id: "2.4.3",
                    type: "G",
                    affiliation: "*",
                    battlefield: "F",
                    status: "*",
                    modifier: "A-----",
                    desc_kor: "구역",
                    desc_eng: "Areas",
                    children: [{
                            id: "2.4.3.1",
                            type: "G",
                            affiliation: "*",
                            battlefield: "F",
                            status: "*",
                            modifier: "AT----",
                            desc_kor: "영역표적지역",
                            desc_eng: "Area,target",
                            children: [
                                { id: "2.4.3.1.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ATR---", desc_kor: "사각형표적", desc_eng: "Rectangular,target" },
                                { id: "2.4.3.1.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ATC---", desc_kor: "원형표적", desc_eng: "Circular,target" },
                                { id: "2.4.3.1.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ATG---", desc_kor: "표적열/군 지역", desc_eng: "Series,or,group,of,targets" },
                                { id: "2.4.3.1.4", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ATS---", desc_kor: "연막차장지역", desc_eng: "Smoke" },
                                { id: "2.4.3.1.5", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ATB---", desc_kor: "폭격지역", desc_eng: "Bomb,area" }
                            ]
                        },
                        {
                            id: "2.4.3.2",
                            type: "G",
                            affiliation: "*",
                            battlefield: "F",
                            status: "*",
                            modifier: "AC----",
                            desc_kor: "지휘통제지역",
                            desc_eng: "Command/control,areas",
                            children: [{
                                    id: "2.4.3.2.1",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACS---",
                                    desc_kor: "화력지원지역",
                                    desc_eng: "Fire,support,area,(FSA)",
                                    children: [
                                        { id: "2.4.3.2.1.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACSI--", desc_kor: "화력지원지역(FSA)(다각형)", desc_eng: "Fire,support,area,(FSA),,Irregular" },
                                        { id: "2.4.3.2.1.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACSR--", desc_kor: "화력지원지역(FSA)(사각형)", desc_eng: "Fire,support,area,(FSA),,Rectangular" },
                                        { id: "2.4.3.2.1.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACSC--", desc_kor: "화력지원지역(FSA)(원형)", desc_eng: "Fire,support,area,(FSA),,Circular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.2.2",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACA---",
                                    desc_kor: "공역협조지역(ACA)",
                                    desc_eng: "Airspace,coordination,area,(ACA)",
                                    children: [
                                        { id: "2.4.3.2.2.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACAI--", desc_kor: "공역협조지역(ACA)(다각형)", desc_eng: "Airspace,coordination,area,(ACA),,Irregular" },
                                        { id: "2.4.3.2.2.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACAR--", desc_kor: "공역협조지역(ACA)(사각형)", desc_eng: "Airspace,coordination,area,(ACA),,Rectangular" },
                                        { id: "2.4.3.2.2.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACAC--", desc_kor: "공역협조지역(ACA)(원형)", desc_eng: "Airspace,coordination,area,(ACA),,Circular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.2.3",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACF---",
                                    desc_kor: "자유사격지역(FFA)",
                                    desc_eng: "Free,fire,area,(FFA)",
                                    children: [
                                        { id: "2.4.3.2.3.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACFI--", desc_kor: "자유사격지역(FFA)(다각형)", desc_eng: "Free,fire,area,(FFA),,Irregular" },
                                        { id: "2.4.3.2.3.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACFR--", desc_kor: "자유사격지역(FFA)(사각형)", desc_eng: "Free,fire,area,(FFA),,Rectangular" },
                                        { id: "2.4.3.2.3.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACFC--", desc_kor: "자유사격지역(FFA)(원형)", desc_eng: "Free,fire,area,(FFA),,Circular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.2.4",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACN---",
                                    desc_kor: "화력금지지역(NFA)",
                                    desc_eng: "No-fire,area,(NFA)",
                                    children: [
                                        { id: "2.4.3.2.4.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACNI--", desc_kor: "화력금지지역(NFA)(다각형)", desc_eng: "No,fire,area,(NFA),,Irregular" },
                                        { id: "2.4.3.2.4.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACNR--", desc_kor: "화력금지지역(NFA)(사각형)", desc_eng: "No,fire,area,(NFA),,Rectangular" },
                                        { id: "2.4.3.2.4.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACNC--", desc_kor: "화력금지지역(NFA)(원형)", desc_eng: "No,fire,area,(NFA),,Circular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.2.5",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACR---",
                                    desc_kor: "화력제한지역(RFA)",
                                    desc_eng: "Restrictive,fire,area,(RFA)",
                                    children: [
                                        { id: "2.4.3.2.5.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACRI--", desc_kor: "화력제한지역(RFA)(다각형)", desc_eng: "Restrictive,fire,area,(RFA),,Irregular" },
                                        { id: "2.4.3.2.5.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACRR--", desc_kor: "화력제한지역(RFA)(사각형)", desc_eng: "Restrictive,fire,area,(RFA),,Rectangular" },
                                        { id: "2.4.3.2.5.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACRC--", desc_kor: "화력제한지역(RFA)(원형)", desc_eng: "Restrictive,fire,area,(RFA),,Circular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.2.6",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACP---",
                                    desc_kor: "포진지지역(PAA)",
                                    desc_eng: "Position,area,for,artillery,(PAA)",
                                    children: [
                                        { id: "2.4.3.2.6.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACPR--", desc_kor: "포진지지역(PAA)(사각형)", desc_eng: "Position,area,for,artillery,(PAA),,Rectangular" },
                                        { id: "2.4.3.2.6.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACPC--", desc_kor: "포진지지역(PAA)(원형)", desc_eng: "Position,area,for,artillery,(PAA),,Circular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.2.7",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACE---",
                                    desc_kor: "센서지역",
                                    desc_eng: "Sensor,zone",
                                    children: [
                                        { id: "2.4.3.2.7.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACEI--", desc_kor: "센서지역(다각형)", desc_eng: "Sensor,zone,,Irregular" },
                                        { id: "2.4.3.2.7.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACER--", desc_kor: "센서지역(사각형)", desc_eng: "Sensor,zone,,Rectangular" },
                                        { id: "2.4.3.2.7.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACEC--", desc_kor: "센서지역(원형)", desc_eng: "Sensor,zone,,Circular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.2.8",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACD---",
                                    desc_kor: "사강지역(DA)",
                                    desc_eng: "Dead,space,area,(DA)",
                                    children: [
                                        { id: "2.4.3.2.8.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACDI--", desc_kor: "사강지역(DA)(다각형)", desc_eng: "Dead,space,area,(DA),,Irregular" },
                                        { id: "2.4.3.2.8.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACDR--", desc_kor: "사강지역(DA)(사각형)", desc_eng: "Dead,space,area,(DA),,Rectangular" },
                                        { id: "2.4.3.2.8.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACDC--", desc_kor: "사강지역(DA)(원형)", desc_eng: "Dead,space,area,(DA),,Circular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.2.9",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACZ---",
                                    desc_kor: "책임구역(ZOR)",
                                    desc_eng: "Zone,of,responsibility,(ZOR)",
                                    children: [
                                        { id: "2.4.3.2.9.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACZI--", desc_kor: "책임구역(ZOR)(다각형)", desc_eng: "Zone,of,responsibility,(ZOR),,Irregular" },
                                        { id: "2.4.3.2.9.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACZR--", desc_kor: "책임구역(ZOR)(사각형)", desc_eng: "Zone,of,responsibility,(ZOR),,Rectangular" },
                                        { id: "2.4.3.2.9.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACZC--", desc_kor: "책임구역(ZOR)(원형)", desc_eng: "Zone,of,responsibility,(ZOR),,Circular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.2.10",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACB---",
                                    desc_kor: "표적식별지역(TBA)",
                                    desc_eng: "Target,build-up,area,(TBA)",
                                    children: [
                                        { id: "2.4.3.2.10.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACBI--", desc_kor: "표적식별지역(TBA)(다각형)", desc_eng: "Target,build,up,area,(TBA),,Irregular" },
                                        { id: "2.4.3.2.10.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACBR--", desc_kor: "표적식별지역(TBA)(사각형)", desc_eng: "Target,build,up,area,(TBA),,Rectangular" },
                                        { id: "2.4.3.2.10.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACBC--", desc_kor: "표적식별지역(TBA)(원형)", desc_eng: "Target,build,up,area,(TBA),,Circular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.2.11",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACV---",
                                    desc_kor: "표적평가지역(TVAR)",
                                    desc_eng: "Target,value,area,(TVAR)",
                                    children: [
                                        { id: "2.4.3.2.11.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACVI--", desc_kor: "표적평가지역(TVAR)(다각형)", desc_eng: "Target,value,area,(TVAR),,Irregular" },
                                        { id: "2.4.3.2.11.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACVR--", desc_kor: "표적평가지역(TVAR)(사각형)", desc_eng: "Target,value,area,(TVAR),,Rectangular" },
                                        { id: "2.4.3.2.11.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACVC--", desc_kor: "표적평가지역(TVAR)(원형)", desc_eng: "Target,value,area,(TVAR),,Circular" }
                                    ]
                                },
                                { id: "2.4.3.2.12", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACT---", desc_kor: "단말유도 군수품 수신구역", desc_eng: "Terminally,guided,munition,footprint,(TGMF)" },
                                {
                                    id: "2.4.3.2.13",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACC---",
                                    desc_kor: "화생방정찰지역",
                                    desc_eng: "CBRN,reconnaissance,area",
                                    children: [
                                        { id: "2.4.3.2.13.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACCI--", desc_kor: "화생방정찰지역(다각형)", desc_eng: "CBRN,reconnaissance,area,,Irregular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.2.14",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "ACG---",
                                    desc_kor: "화생방제독지역",
                                    desc_eng: "CBRN,detoxification,area",
                                    children: [
                                        { id: "2.4.3.2.14.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "ACGI--", desc_kor: "화생방제독지역(다각형)", desc_eng: "CBRN,detoxification,area,,Irregular" }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "2.4.3.3",
                            type: "G",
                            affiliation: "*",
                            battlefield: "F",
                            status: "*",
                            modifier: "AZ----",
                            desc_kor: "표적획득지역",
                            desc_eng: "Target,acquisition,zones",
                            children: [{
                                    id: "2.4.3.3.1",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "AZI---",
                                    desc_kor: "포병표적정보구역(ATI)",
                                    desc_eng: "Artillery,target,intelligence,(ATI),zone",
                                    children: [
                                        { id: "2.4.3.3.1.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AZII--", desc_kor: "포병표적정보구역(ATI)(다각형)", desc_eng: "Artillery,target,intelligence,(ATI),zone,,Irregular" },
                                        { id: "2.4.3.3.1.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AZIR--", desc_kor: "포병표적정보구역(ATI)(사각형)", desc_eng: "Artillery,target,intelligence,(ATI),zone,,Rectangular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.3.2",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "AZX---",
                                    desc_kor: "화력요청구역(CFFZ)",
                                    desc_eng: "Call,for,fire,zone,(CFFZ)",
                                    children: [
                                        { id: "2.4.3.3.2.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AZXI--", desc_kor: "화력요청구역(CFFZ)(다각형)", desc_eng: "Call,for,fire,zone,(CFFZ),,Irregular" },
                                        { id: "2.4.3.3.2.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AZXR--", desc_kor: "화력요청구역(CFFZ)(사각형)", desc_eng: "Call,for,fire,zone,(CFFZ),,Rectangular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.3.3",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "AZC---",
                                    desc_kor: "검열구역",
                                    desc_eng: "Censor,zone",
                                    children: [
                                        { id: "2.4.3.3.3.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AZCI--", desc_kor: "검열구역(다각형)", desc_eng: "Censor,zone,,Irregular" },
                                        { id: "2.4.3.3.3.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AZCR--", desc_kor: "검열구역(사각형)", desc_eng: "Censor,zone,,Rectangular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.3.4",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "AZF---",
                                    desc_kor: "아군확인구역(CFZ)",
                                    desc_eng: "Critical,friendly,zone,(CFZ)",
                                    children: [
                                        { id: "2.4.3.3.4.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AZFI--", desc_kor: "아군확인구역(CFZ)(다각형)", desc_eng: "Critical,friendly,zone,(CFZ),,Irregular" },
                                        { id: "2.4.3.3.4.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AZFR--", desc_kor: "아군확인구역(CFZ)(사각형)", desc_eng: "Critical,friendly,zone,(CFZ),,Rectangular" }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "2.4.3.4",
                            type: "G",
                            affiliation: "*",
                            battlefield: "F",
                            status: "*",
                            modifier: "AX----",
                            desc_kor: "무기/센서 유효영역",
                            desc_eng: "Weapon/sensor,range,fans",
                            children: [
                                { id: "2.4.3.4.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AXC---", desc_kor: "무기/센서 유효영역(원형)", desc_eng: "Weapon/sensor,range,fan,,Circular" },
                                { id: "2.4.3.4.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AXS---", desc_kor: "무기/센서 유효영역(섹터)", desc_eng: "Weapon/sensor,range,fan,,Sector" }
                            ]
                        },
                        {
                            id: "2.4.3.5",
                            type: "G",
                            affiliation: "*",
                            battlefield: "F",
                            status: "*",
                            modifier: "AK----",
                            desc_kor: "킬박스",
                            desc_eng: "Kill,box",
                            children: [{
                                    id: "2.4.3.5.1",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "AKB---",
                                    desc_kor: "아군 킬박스",
                                    desc_eng: "Blue,kill,box,(BKB)",
                                    children: [
                                        { id: "2.4.3.5.1.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AKBC--", desc_kor: "아군 킬박스(원형)", desc_eng: "Blue,kill,box,,Circular" },
                                        { id: "2.4.3.5.1.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AKBI--", desc_kor: "아군 킬박스(다각형)", desc_eng: "Blue,kill,box,,Irregular" },
                                        { id: "2.4.3.5.1.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AKBR--", desc_kor: "아군 킬박스(사각형)", desc_eng: "Blue,kill,box,,Rectangular" }
                                    ]
                                },
                                {
                                    id: "2.4.3.5.2",
                                    type: "G",
                                    affiliation: "*",
                                    battlefield: "F",
                                    status: "*",
                                    modifier: "AKP---",
                                    desc_kor: "적군 킬박스",
                                    desc_eng: "Purple,kill,box,(PKB)",
                                    children: [
                                        { id: "2.4.3.5.2.1", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AKPC--", desc_kor: "적군 킬박스(원형)", desc_eng: "Purple,kill,box,,Circular" },
                                        { id: "2.4.3.5.2.2", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AKPI--", desc_kor: "적군 킬박스(다각형)", desc_eng: "Purple,kill,box,,Irregular" },
                                        { id: "2.4.3.5.2.3", type: "G", affiliation: "*", battlefield: "F", status: "*", modifier: "AKPR--", desc_kor: "적군 킬박스(사각형)", desc_eng: "Purple,kill,box,,Rectangular" }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "2.5",
            type: "G",
            affiliation: "*",
            battlefield: "S",
            status: "*",
            modifier: "------",
            desc_kor: "전투근무지원",
            desc_eng: "Combat,service,support",
            children: [{
                    id: "2.5.1",
                    type: "G",
                    affiliation: "*",
                    battlefield: "S",
                    status: "*",
                    modifier: "P-----",
                    desc_kor: "점",
                    desc_eng: "Points",
                    children: [
                        { id: "2.5.1.1", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PX----", desc_kor: "구급전환지점", desc_eng: "Ambulance,exchange,point" },
                        { id: "2.5.1.2", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PC----", desc_kor: "폐품(재활용)활용지점", desc_eng: "Cannibalization,point" },
                        { id: "2.5.1.3", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PY----", desc_kor: "사상자수집소", desc_eng: "Casualty,collection,point" },
                        { id: "2.5.1.4", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PT----", desc_kor: "민간인수집소", desc_eng: "Civilian,collection,point" },
                        { id: "2.5.1.5", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PD----", desc_kor: "억류자수용소", desc_eng: "Detainee,collection,point" },
                        { id: "2.5.1.6", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PE----", desc_kor: "적포로수집소", desc_eng: "Enemy,prisoner,of,war,(EPW),collection,point" },
                        { id: "2.5.1.7", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PL----", desc_kor: "군수불출지점", desc_eng: "Logistics,release,point,(LRP)" },
                        { id: "2.5.1.8", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PM----", desc_kor: "정비수집소", desc_eng: "Maintenance,collection,point" },
                        { id: "2.5.1.9", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PR----", desc_kor: "재무장,재급유,재보급지점", desc_eng: "Rearm,,refuel,and,resupply,point" },
                        { id: "2.5.1.10", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PU----", desc_kor: "이동재급유지점", desc_eng: "Refuel,on,the,move,(ROM),point" },
                        { id: "2.5.1.11", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PO----", desc_kor: "교통통제소", desc_eng: "Traffic,control,post,(TCP)" },
                        { id: "2.5.1.12", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PI----", desc_kor: "트레일러전달지점", desc_eng: "Trailer,transfer,point" },
                        { id: "2.5.1.13", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PN----", desc_kor: "부대정비수집지점", desc_eng: "Unit,maintenance,collection,point" },
                        {
                            id: "2.5.1.14",
                            type: "G",
                            affiliation: "*",
                            battlefield: "S",
                            status: "*",
                            modifier: "PS----",
                            desc_kor: "보급지점",
                            desc_eng: "Supply,points",
                            children: [
                                { id: "2.5.1.14.1", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSZ---", desc_kor: "일반", desc_eng: "General" },
                                { id: "2.5.1.14.2", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSA---", desc_kor: "1종-식량", desc_eng: "Class,I" },
                                { id: "2.5.1.14.3", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSB---", desc_kor: "2종-물자", desc_eng: "Class,II" },
                                { id: "2.5.1.14.4", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSC---", desc_kor: "3종-유류", desc_eng: "Class,III" },
                                { id: "2.5.1.14.5", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSD---", desc_kor: "4종-자재", desc_eng: "Class,IV" },
                                { id: "2.5.1.14.6", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSE---", desc_kor: "5종-탄약", desc_eng: "Class,V" },
                                { id: "2.5.1.14.7", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSF---", desc_kor: "6종-PX", desc_eng: "Class,VI" },
                                { id: "2.5.1.14.8", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSG---", desc_kor: "7종-장비", desc_eng: "Class,VII" },
                                { id: "2.5.1.14.9", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSH---", desc_kor: "8종-의료", desc_eng: "Class,VIII" },
                                { id: "2.5.1.14.10", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSI---", desc_kor: "9종-수리부속", desc_eng: "Class,IX" },
                                { id: "2.5.1.14.11", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSJ---", desc_kor: "10종-기타", desc_eng: "Class,X" },
                                { id: "2.5.1.14.12", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSK---", desc_kor: "급수탑", desc_eng: "급수탑" },
                                { id: "2.5.1.14.13", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PSL---", desc_kor: "석탄탑", desc_eng: "석탄탑" }
                            ]
                        },
                        {
                            id: "2.5.1.15",
                            type: "G",
                            affiliation: "*",
                            battlefield: "S",
                            status: "*",
                            modifier: "PA----",
                            desc_kor: "탄약지점",
                            desc_eng: "Ammunition,points",
                            children: [
                                { id: "2.5.1.15.1", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PAS---", desc_kor: "탄약보급소", desc_eng: "Ammunition,supply,point,(ASP)" },
                                { id: "2.5.1.15.2", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PAT---", desc_kor: "탄약전환보급소", desc_eng: "Ammunition,transfer,point,(ATP)" }
                            ]
                        },
                        { id: "2.5.1.16", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PQ----", desc_kor: "노상구난반", desc_eng: "Rescue,team" },
                        { id: "2.5.1.17", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "PV----", desc_kor: "검문소", desc_eng: "Checkpoint" }
                    ]
                },
                {
                    id: "2.5.2",
                    type: "G",
                    affiliation: "*",
                    battlefield: "S",
                    status: "*",
                    modifier: "L-----",
                    desc_kor: "선",
                    desc_eng: "Lines",
                    children: [{
                            id: "2.5.2.1",
                            type: "G",
                            affiliation: "*",
                            battlefield: "S",
                            status: "*",
                            modifier: "LC----",
                            desc_kor: "호위",
                            desc_eng: "Convoys",
                            children: [
                                { id: "2.5.2.1.1", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "LCM---", desc_kor: "호위(이동중)", desc_eng: "Moving,convoy" },
                                { id: "2.5.2.1.2", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "LCH---", desc_kor: "호위(정지)", desc_eng: "Halted,convoy" }
                            ]
                        },
                        {
                            id: "2.5.2.2",
                            type: "G",
                            affiliation: "*",
                            battlefield: "S",
                            status: "*",
                            modifier: "LR----",
                            desc_kor: "보급로(병참선)",
                            desc_eng: "Supply,routes",
                            children: [
                                { id: "2.5.2.2.1", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "LRM---", desc_kor: "주보급로", desc_eng: "Main,supply,route" },
                                { id: "2.5.2.2.2", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "LRA---", desc_kor: "예비보급로", desc_eng: "Alternate,supply,route" },
                                { id: "2.5.2.2.3", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "LRO---", desc_kor: "주보급로(일방통행)", desc_eng: "One-way,traffic" },
                                { id: "2.5.2.2.4", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "LRT---", desc_kor: "주보급로(우회통행)", desc_eng: "Alternating,traffic" },
                                { id: "2.5.2.2.5", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "LRW---", desc_kor: "주보급로(양방통행)", desc_eng: "Two-way,traffic" },
                                { id: "2.5.2.2.6", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "LRB---", desc_kor: "통제구간", desc_eng: "통제구간" }
                            ]
                        }
                    ]
                },
                {
                    id: "2.5.3",
                    type: "G",
                    affiliation: "*",
                    battlefield: "S",
                    status: "*",
                    modifier: "A-----",
                    desc_kor: "지역",
                    desc_eng: "Area",
                    children: [
                        { id: "2.5.3.1", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "AD----", desc_kor: "억류자수용지역", desc_eng: "Detainee,holding,area" },
                        { id: "2.5.3.2", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "AE----", desc_kor: "포로수용소", desc_eng: "Enemy,prisoner,of,war,(EPW),holding,area" },
                        { id: "2.5.3.3", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "AR----", desc_kor: "전방 재무장 및 재급유지역", desc_eng: "Forward,arming,and,refueling,area,(FARP)" },
                        { id: "2.5.3.4", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "AH----", desc_kor: "피난민수용지역", desc_eng: "Refugee,holding,area" },
                        {
                            id: "2.5.3.5",
                            type: "G",
                            affiliation: "*",
                            battlefield: "S",
                            status: "*",
                            modifier: "AS----",
                            desc_kor: "지원지역",
                            desc_eng: "Support,areas",
                            children: [
                                { id: "2.5.3.5.1", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "ASB---", desc_kor: "여단지원지역", desc_eng: "Brigade,(BSA)" },
                                { id: "2.5.3.5.2", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "ASD---", desc_kor: "사단지원지역", desc_eng: "Division,(DSA)" },
                                { id: "2.5.3.5.3", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "ASR---", desc_kor: "연대지원지역", desc_eng: "Regimental,(RSA)" },
                                { id: "2.5.3.5.4", type: "G", affiliation: "*", battlefield: "S", status: "*", modifier: "ASA---", desc_kor: "군수지원지역", desc_eng: "군수지원지역" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "2.6",
            type: "G",
            affiliation: "*",
            battlefield: "O",
            status: "*",
            modifier: "------",
            desc_kor: "기타",
            desc_eng: "Other",
            children: [{
                    id: "2.6.1",
                    type: "G",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "E-----",
                    desc_kor: "비상",
                    desc_eng: "Emergency",
                    children: [
                        { id: "2.6.1.1", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "ED----", desc_kor: "불시착", desc_eng: "Ditched,aircraft" },
                        { id: "2.6.1.2", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "EP----", desc_kor: "익수자", desc_eng: "Person,in,water" },
                        { id: "2.6.1.3", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "EV----", desc_kor: "조난선", desc_eng: "Distressed,vessel" }
                    ]
                },
                {
                    id: "2.6.2",
                    type: "G",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "H-----",
                    desc_kor: "위험",
                    desc_eng: "Hazard",
                    children: [
                        { id: "2.6.2.1", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "HM----", desc_kor: "기뢰의심", desc_eng: "Sea,mine-like" },
                        { id: "2.6.2.2", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "HN----", desc_kor: "항해장애물", desc_eng: "Navigational" },
                        { id: "2.6.2.3", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "HI----", desc_kor: "빙산", desc_eng: "Iceberg" },
                        { id: "2.6.2.4", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "HO----", desc_kor: "유전시추장치", desc_eng: "Oil,rig" }
                    ]
                },
                {
                    id: "2.6.3",
                    type: "G",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "S-----",
                    desc_kor: "해저장애물",
                    desc_eng: "Sea,subsurface,returns",
                    children: [{
                            id: "2.6.3.1",
                            type: "G",
                            affiliation: "*",
                            battlefield: "O",
                            status: "*",
                            modifier: "SB----",
                            desc_kor: "해저장애물",
                            desc_eng: "Bottom,return/Non-milco",
                            children: [
                                { id: "2.6.3.1.1", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "SBM---", desc_kor: "해저장애물(시설,인공)", desc_eng: "Installation/Manmade" },
                                { id: "2.6.3.1.2", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "SBN---", desc_kor: "해저암반,기타 장애물", desc_eng: "Seabed,rock/Stone,,obstacle,,other" },
                                { id: "2.6.3.1.3", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "SBW---", desc_kor: "난파선(안전)", desc_eng: "Wreck,,non,dangerous" },
                                { id: "2.6.3.1.4", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "SBX---", desc_kor: "난파선(위험)", desc_eng: "Wreck,,dangerous" }
                            ]
                        },
                        { id: "2.6.3.2", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "SM----", desc_kor: "해양생물", desc_eng: "Marine,life" },
                        { id: "2.6.3.3", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "SS----", desc_kor: "이례적해양현상(해류,항적)", desc_eng: "Sea,anomaly,(Wake,,Current,,Knuckle)" },
                        { id: "2.6.3.4", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "SA----", desc_kor: "어초", desc_eng: "어초" }
                    ]
                },
                {
                    id: "2.6.4",
                    type: "G",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "B-----",
                    desc_kor: "방향선",
                    desc_eng: "Bearing,line",
                    children: [
                        { id: "2.6.4.1", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "BE----", desc_kor: "전파방향선", desc_eng: "Electronic" },
                        { id: "2.6.4.2", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "BA----", desc_kor: "음파방향선", desc_eng: "Acoustic" },
                        { id: "2.6.4.3", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "BT----", desc_kor: "어뢰방향선", desc_eng: "Torpedo" },
                        { id: "2.6.4.4", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "BO----", desc_kor: "전자광학도청방향선", desc_eng: "Electro-optical,intercept" }
                    ]
                },
                {
                    id: "2.6.5",
                    type: "G",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "F-----",
                    desc_kor: "교차점",
                    desc_eng: "Fix",
                    children: [
                        { id: "2.6.5.1", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "FA----", desc_kor: "교차점(음파로부터)", desc_eng: "Acoustic" },
                        { id: "2.6.5.2", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "FE----", desc_kor: "교차점(전자기로부터)", desc_eng: "Electro-magnetic" },
                        { id: "2.6.5.3", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "FO----", desc_kor: "교차점(전자광학으로부터)", desc_eng: "Electro-optical" }
                    ]
                },
                { id: "2.6.9", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "O-----", desc_kor: "폭파지점", desc_eng: "Blasting,Point" },
                { id: "2.6.10", type: "G", affiliation: "*", battlefield: "O", status: "*", modifier: "D-----", desc_kor: "댐방류통제", desc_eng: "Dam" }
            ]
        }
    ]
}];


var { affiliation } = require("./mil_basic");

module.exports = {
    code: "G",
    affiliation: affiliation,
    battlefield: battlefield_OperAct,
    status: status_OperAct,
    unit: unit_OperAct,
    mission: mission_OperAct,
    identifier: functionIdentifier_OperAct
};
},{"./mil_basic":2}],5:[function(require,module,exports){
/* eslint-disable */

var battlefield_Safe = [
    { code: "V", desc: "과격행동" },
    { code: "L", desc: "위치" },
    { code: "O", desc: "작전" },
    { code: "I", desc: "항목" },
    { code: "P", desc: "개인" },
    { code: "G", desc: "비군사 조직 혹은 단체" },
    { code: "R", desc: "강간" }
];

var functionIdentifier_Safe = [{
    id: "5",
    type: "O",
    affiliation: "*",
    battlefield: "-",
    status: "-",
    modifier: "------",
    desc_kor: "안정화작전",
    desc_eng: "Stability,operations,(SO)",
    children: [{
            id: "5.1",
            type: "O",
            affiliation: "*",
            battlefield: "V",
            status: "*",
            modifier: "------",
            desc_kor: "과격행동(사상자초래)",
            desc_eng: "Violent,activities,(Death,causing)",
            children: [
                { id: "5.1.1", type: "O", affiliation: "*", battlefield: "V", status: "*", modifier: "A-----", desc_kor: "방화/화재", desc_eng: "Arson/Fire" },
                {
                    id: "5.1.2",
                    type: "O",
                    affiliation: "*",
                    battlefield: "V",
                    status: "*",
                    modifier: "M-----",
                    desc_kor: "살해",
                    desc_eng: "Killing,(General)",
                    children: [
                        { id: "5.1.2.1", type: "O", affiliation: "*", battlefield: "V", status: "*", modifier: "MA----", desc_kor: "살인", desc_eng: "Murder" },
                        { id: "5.1.2.2", type: "O", affiliation: "*", battlefield: "V", status: "*", modifier: "MB----", desc_kor: "처형", desc_eng: "Execution" },
                        { id: "5.1.2.3", type: "O", affiliation: "*", battlefield: "V", status: "*", modifier: "MC----", desc_kor: "암살", desc_eng: "Assassination" }
                    ]
                },
                { id: "5.1.3", type: "O", affiliation: "*", battlefield: "V", status: "*", modifier: "B-----", desc_kor: "폭탄테러/폭탄투하(척)", desc_eng: "Bomb/Bombing" },
                { id: "5.1.4", type: "O", affiliation: "*", battlefield: "V", status: "*", modifier: "Y-----", desc_kor: "부비트랩", desc_eng: "Booby,trap" },
                { id: "5.1.5", type: "O", affiliation: "*", battlefield: "V", status: "*", modifier: "D-----", desc_kor: "차량사격돌진", desc_eng: "Drive-by,shooting" },
                { id: "5.1.6", type: "O", affiliation: "*", battlefield: "V", status: "*", modifier: "S-----", desc_kor: "저격", desc_eng: "Sniping" },
                { id: "5.1.7", type: "O", affiliation: "*", battlefield: "V", status: "*", modifier: "P-----", desc_kor: "독살", desc_eng: "Poisoning" },
                {
                    id: "5.1.8",
                    type: "O",
                    affiliation: "*",
                    battlefield: "V",
                    status: "*",
                    modifier: "E-----",
                    desc_kor: "폭발",
                    desc_eng: "Explosion",
                    children: [
                        { id: "5.1.8.1", type: "O", affiliation: "*", battlefield: "V", status: "*", modifier: "EI----", desc_kor: "폭발물 폭발", desc_eng: "IED,explosion" }
                    ]
                }
            ]
        },
        {
            id: "5.2",
            type: "O",
            affiliation: "*",
            battlefield: "L",
            status: "*",
            modifier: "------",
            desc_kor: "위치",
            desc_eng: "Locations",
            children: [
                { id: "5.2.1", type: "O", affiliation: "*", battlefield: "L", status: "*", modifier: "B-----", desc_kor: "블랙리스트 위치", desc_eng: "Black,list,location" },
                { id: "5.2.2", type: "O", affiliation: "*", battlefield: "L", status: "*", modifier: "G-----", desc_kor: "그레이리스트 위치", desc_eng: "Gray,list,location" },
                { id: "5.2.3", type: "O", affiliation: "*", battlefield: "L", status: "*", modifier: "W-----", desc_kor: "화이트 리스트 위치", desc_eng: "White,list,location" },
                { id: "5.2.4", type: "O", affiliation: "*", battlefield: "L", status: "*", modifier: "M-----", desc_kor: "공동묘지", desc_eng: "Mass,grave,location" }
            ]
        },
        {
            id: "5.3",
            type: "O",
            affiliation: "*",
            battlefield: "O",
            status: "*",
            modifier: "------",
            desc_kor: "작전",
            desc_eng: "Operations",
            children: [
                { id: "5.3.1", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "P-----", desc_kor: "순찰", desc_eng: "Patrolling" },
                {
                    id: "5.3.2",
                    type: "O",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "R-----",
                    desc_kor: "징집",
                    desc_eng: "Recruitment",
                    children: [
                        { id: "5.3.2.1", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "RW----", desc_kor: "징집(지원)", desc_eng: "Recruitment,(Willing)" },
                        { id: "5.3.2.2", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "RC----", desc_kor: "징집(강제/징모)", desc_eng: "Recruitment,(Coerced/Impressed)" }
                    ]
                },
                { id: "5.3.3", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "D-----", desc_kor: "데모", desc_eng: "Demonstration" },
                { id: "5.3.4", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "M-----", desc_kor: "지뢰부설", desc_eng: "Mine,laying" },
                {
                    id: "5.3.5",
                    type: "O",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "Y-----",
                    desc_kor: "심리작전",
                    desc_eng: "Psychological,operations,(PSYOP)",
                    children: [
                        { id: "5.3.5.1", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "YT----", desc_kor: "심리작전(TV,라디오)", desc_eng: "Psyop,(TV,and,radio,propaganda)" },
                        { id: "5.3.5.2", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "YW----", desc_kor: "심리작전(선전물)", desc_eng: "Psyop,(Written,propaganda)" },
                        { id: "5.3.5.3", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "YH----", desc_kor: "방문선전", desc_eng: "House-to-house,propaganda" }
                    ]
                },
                { id: "5.3.6", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "F-----", desc_kor: "식량탐색", desc_eng: "Foraging/Searching" },
                { id: "5.3.7", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "S-----", desc_kor: "염탐", desc_eng: "Spy" },
                { id: "5.3.8", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "O-----", desc_kor: "배식", desc_eng: "Food,distribution" },
                { id: "5.3.9", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "E-----", desc_kor: "강탈", desc_eng: "Extortion" },
                {
                    id: "5.3.10",
                    type: "O",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "H-----",
                    desc_kor: "공중납치",
                    desc_eng: "Hijacking",
                    children: [
                        { id: "5.3.10.1", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "HT----", desc_kor: "공중납치(차량)", desc_eng: "Hijacking,(Vehicle)" },
                        { id: "5.3.10.2", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "HA----", desc_kor: "공중납치(항공기)", desc_eng: "Hijacking,(Airplane)" },
                        { id: "5.3.10.3", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "HV----", desc_kor: "공중납치(선박)", desc_eng: "Hijacking,(Boat)" }
                    ]
                },
                {
                    id: "5.3.11",
                    type: "O",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "K-----",
                    desc_kor: "납치",
                    desc_eng: "Kidnapping",
                    children: [
                        { id: "5.3.11.1", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "KA----", desc_kor: "납치미수", desc_eng: "Attempted" }
                    ]
                },
                { id: "5.3.12", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "A-----", desc_kor: "체포", desc_eng: "Arrest" },
                { id: "5.3.13", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "U-----", desc_kor: "마약작전", desc_eng: "Drug,operation" },
                {
                    id: "5.3.14",
                    type: "O",
                    affiliation: "*",
                    battlefield: "O",
                    status: "*",
                    modifier: "C-----",
                    desc_kor: "복합손실",
                    desc_eng: "Composite,loss",
                    children: [
                        { id: "5.3.14.1", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "CA----", desc_kor: "전투", desc_eng: "Combat" },
                        { id: "5.3.14.2", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "CB----", desc_kor: "사고", desc_eng: "Accident" },
                        { id: "5.3.14.3", type: "O", affiliation: "*", battlefield: "O", status: "*", modifier: "CC----", desc_kor: "기타", desc_eng: "Other" }
                    ]
                }
            ]
        },
        {
            id: "5.4",
            type: "O",
            affiliation: "*",
            battlefield: "I",
            status: "*",
            modifier: "------",
            desc_kor: "항목",
            desc_eng: "Items",
            children: [
                { id: "5.4.1", type: "O", affiliation: "*", battlefield: "I", status: "*", modifier: "R-----", desc_kor: "난민", desc_eng: "Refugees" },
                { id: "5.4.2", type: "O", affiliation: "*", battlefield: "I", status: "*", modifier: "S-----", desc_kor: "은신처", desc_eng: "Safe,house" },
                { id: "5.4.3", type: "O", affiliation: "*", battlefield: "I", status: "*", modifier: "G-----", desc_kor: "낙서", desc_eng: "Graffiti" },
                { id: "5.4.4", type: "O", affiliation: "*", battlefield: "I", status: "*", modifier: "V-----", desc_kor: "야만/강간/강탈/약탈/도적/노략질", desc_eng: "Vandalism/Loot/Ransack/Plunder/,Sack" },
                { id: "5.4.5", type: "O", affiliation: "*", battlefield: "I", status: "*", modifier: "I-----", desc_kor: "확인된 반란차량", desc_eng: "Known,insurgent,vehicle" },
                { id: "5.4.6", type: "O", affiliation: "*", battlefield: "I", status: "*", modifier: "D-----", desc_kor: "마약 차량", desc_eng: "Drug,vehicle" },
                { id: "5.4.7", type: "O", affiliation: "*", battlefield: "I", status: "*", modifier: "F-----", desc_kor: "내부 경비 부대", desc_eng: "Internal,security,force" }
            ]
        },
        {
            id: "5.5",
            type: "O",
            affiliation: "*",
            battlefield: "P",
            status: "*",
            modifier: "------",
            desc_kor: "개인",
            desc_eng: "Individual",
            children: [
                { id: "5.5.1", type: "O", affiliation: "*", battlefield: "P", status: "*", modifier: "A-----", desc_kor: "지도자", desc_eng: "Leader" },
                { id: "5.5.2", type: "O", affiliation: "*", battlefield: "P", status: "*", modifier: "B-----", desc_kor: "표적", desc_eng: "Targeted" },
                { id: "5.5.3", type: "O", affiliation: "*", battlefield: "P", status: "*", modifier: "C-----", desc_kor: "테러리스트", desc_eng: "Terrorist" }
            ]
        },
        {
            id: "5.6",
            type: "O",
            affiliation: "*",
            battlefield: "G",
            status: "*",
            modifier: "------",
            desc_kor: "비군사단체",
            desc_eng: "Nonmilitary,group,or,organization",
            children: [
                { id: "5.6.1", type: "O", affiliation: "*", battlefield: "G", status: "*", modifier: "A-----", desc_kor: "난민, 피난민 단체", desc_eng: "Displaced,persons,,refugees,,and,evacuees" },
                { id: "5.6.2", type: "O", affiliation: "*", battlefield: "G", status: "*", modifier: "B-----", desc_kor: "비정부조직", desc_eng: "Nongovernmental,organization,(NGO)" },
                { id: "5.6.3", type: "O", affiliation: "*", battlefield: "G", status: "*", modifier: "C-----", desc_kor: "테러조직", desc_eng: "Terrorist" },
                { id: "5.6.4", type: "O", affiliation: "*", battlefield: "G", status: "*", modifier: "D-----", desc_kor: "종교단체", desc_eng: "Religious" },
                { id: "5.6.5", type: "O", affiliation: "*", battlefield: "G", status: "*", modifier: "E-----", desc_kor: "외국인전사", desc_eng: "Foreign,fighters" },
                { id: "5.6.6", type: "O", affiliation: "*", battlefield: "G", status: "*", modifier: "F-----", desc_kor: "폭력조직", desc_eng: "Gang" }
            ]
        },
        {
            id: "5.7",
            type: "O",
            affiliation: "*",
            battlefield: "R",
            status: "*",
            modifier: "------",
            desc_kor: "강간",
            desc_eng: "Rape",
            children: [
                { id: "5.7.1", type: "O", affiliation: "*", battlefield: "R", status: "*", modifier: "A-----", desc_kor: "강간미수", desc_eng: "Attempted" }
            ]
        }
    ]
}];

var { affiliation, unit, status, mission } = require("./mil_basic");

module.exports = {
    code: "O",
    affiliation: affiliation,
    battlefield: battlefield_Safe,
    status: status,
    mission: mission,
    unit: unit,
    identifier: functionIdentifier_Safe
};
},{"./mil_basic":2}],6:[function(require,module,exports){
/* eslint-disable */


var functionIdentifier_Signal = [{
    id: "4",
    type: "I",
    affiliation: "-",
    battlefield: "-",
    status: "-",
    modifier: "------",
    desc_kor: "신호정보",
    desc_eng: "Signals,intelligence",
    children: [{
            id: "4.1",
            type: "I",
            affiliation: "*",
            battlefield: "P",
            status: "*",
            modifier: "------",
            desc_kor: "우주항적",
            desc_eng: "Space,track",
            children: [{
                id: "4.1.1",
                type: "I",
                affiliation: "*",
                battlefield: "P",
                status: "*",
                modifier: "S-----",
                desc_kor: "신호도청",
                desc_eng: "Signal,intercept",
                children: [{
                        id: "4.1.1.1",
                        type: "I",
                        affiliation: "*",
                        battlefield: "P",
                        status: "*",
                        modifier: "SC----",
                        desc_kor: "통신",
                        desc_eng: "Communications",
                        children: [
                            { id: "4.1.1.1.1", type: "I", affiliation: "*", battlefield: "P", status: "*", modifier: "SCD---", desc_kor: "위성수신", desc_eng: "Satellite,downlink" }
                        ]
                    },
                    {
                        id: "4.1.1.2",
                        type: "I",
                        affiliation: "*",
                        battlefield: "P",
                        status: "*",
                        modifier: "SR----",
                        desc_kor: "레이다",
                        desc_eng: "Radar",
                        children: [
                            { id: "4.1.1.2.1", type: "I", affiliation: "*", battlefield: "P", status: "*", modifier: "SRD---", desc_kor: "데이터전송", desc_eng: "Data,transmission" },
                            { id: "4.1.1.2.2", type: "I", affiliation: "*", battlefield: "P", status: "*", modifier: "SRE---", desc_kor: "지구감시", desc_eng: "Earth,surveillance" },
                            { id: "4.1.1.2.3", type: "I", affiliation: "*", battlefield: "P", status: "*", modifier: "SRI---", desc_kor: "적아식별(응답기)", desc_eng: "IFF,(Transponder)" },
                            { id: "4.1.1.2.4", type: "I", affiliation: "*", battlefield: "P", status: "*", modifier: "SRM---", desc_kor: "다중임무", desc_eng: "Multifunction" },
                            { id: "4.1.1.2.5", type: "I", affiliation: "*", battlefield: "P", status: "*", modifier: "SRT---", desc_kor: "표적획득", desc_eng: "Target,acquisition" },
                            { id: "4.1.1.2.6", type: "I", affiliation: "*", battlefield: "P", status: "*", modifier: "SRS---", desc_kor: "우주항적", desc_eng: "Space" },
                            { id: "4.1.1.2.7", type: "I", affiliation: "*", battlefield: "P", status: "*", modifier: "SRU---", desc_kor: "미확인", desc_eng: "Unknown" }
                        ]
                    }
                ]
            }]
        },
        {
            id: "4.2",
            type: "I",
            affiliation: "*",
            battlefield: "A",
            status: "*",
            modifier: "------",
            desc_kor: "공중항적",
            desc_eng: "Air,track",
            children: [{
                id: "4.2.1",
                type: "I",
                affiliation: "*",
                battlefield: "A",
                status: "*",
                modifier: "S-----",
                desc_kor: "신호도청",
                desc_eng: "Signal,intercept",
                children: [{
                        id: "4.2.1.1",
                        type: "I",
                        affiliation: "*",
                        battlefield: "A",
                        status: "*",
                        modifier: "SC----",
                        desc_kor: "통신",
                        desc_eng: "Communications",
                        children: [
                            { id: "4.2.1.1.1", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SCC---", desc_kor: "무선/모바일", desc_eng: "Cellular/Mobile" },
                            { id: "4.2.1.1.2", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SCO---", desc_kor: "전방위레이다가시선", desc_eng: "Omni-line,of,sight,(LOS)" },
                            { id: "4.2.1.1.3", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SCP---", desc_kor: "일대일레이다가시선", desc_eng: "Point-to-point,line,of,sight,(LOS)" },
                            { id: "4.2.1.1.4", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SCS---", desc_kor: "위성송신", desc_eng: "Satellite,uplink" }
                        ]
                    },
                    {
                        id: "4.2.1.2",
                        type: "I",
                        affiliation: "*",
                        battlefield: "A",
                        status: "*",
                        modifier: "SR----",
                        desc_kor: "레이다",
                        desc_eng: "Radar",
                        children: [
                            { id: "4.2.1.2.1", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRAI--", desc_kor: "공수 도청", desc_eng: "Airborne,intercept" },
                            { id: "4.2.1.2.2", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRAS--", desc_kor: "공수 탐색 및 폭격", desc_eng: "Airborne,search,and,bombing" },
                            { id: "4.2.1.2.3", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRC---", desc_kor: "통제된 도청", desc_eng: "Controlled,intercept" },
                            { id: "4.2.1.2.4", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRD---", desc_kor: "데이터전송", desc_eng: "Data,transmission" },
                            { id: "4.2.1.2.5", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRE---", desc_kor: "조기경보", desc_eng: "Early,warning" },
                            { id: "4.2.1.2.6", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRF---", desc_kor: "화력제어", desc_eng: "Fire,control" },
                            { id: "4.2.1.2.7", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRI---", desc_kor: "적아식별(응답기)", desc_eng: "IFF,(Transponder)" },
                            { id: "4.2.1.2.8", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRMA--", desc_kor: "유도탄포착", desc_eng: "Missile,acquisition" },
                            { id: "4.2.1.2.9", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRMD--", desc_kor: "유도탄수신", desc_eng: "Missile,downlink" },
                            { id: "4.2.1.2.10", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRMG--", desc_kor: "유도탄유도", desc_eng: "Missile,guidance" },
                            { id: "4.2.1.2.11", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRMT--", desc_kor: "유도탄추적", desc_eng: "Missile,tracking" },
                            { id: "4.2.1.2.12", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRMF--", desc_kor: "다중임무", desc_eng: "Multifunction" },
                            { id: "4.2.1.2.13", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRTI--", desc_kor: "표적발광체", desc_eng: "Target,illuminator" },
                            { id: "4.2.1.2.14", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRTA--", desc_kor: "표적획득", desc_eng: "Target,acquisition" },
                            { id: "4.2.1.2.15", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRTT--", desc_kor: "표적추적", desc_eng: "Target,tracking" },
                            { id: "4.2.1.2.16", type: "I", affiliation: "*", battlefield: "A", status: "*", modifier: "SRU---", desc_kor: "미확인", desc_eng: "Unknown" }
                        ]
                    }
                ]
            }]
        },
        {
            id: "4.3",
            type: "I",
            affiliation: "*",
            battlefield: "G",
            status: "*",
            modifier: "------",
            desc_kor: "지상 항적",
            desc_eng: "Ground,track",
            children: [{
                id: "4.3.1",
                type: "I",
                affiliation: "*",
                battlefield: "G",
                status: "*",
                modifier: "S-----",
                desc_kor: "신호도청",
                desc_eng: "Signal,intercept",
                children: [{
                        id: "4.3.1.1",
                        type: "I",
                        affiliation: "*",
                        battlefield: "G",
                        status: "*",
                        modifier: "SC----",
                        desc_kor: "통신",
                        desc_eng: "Communications",
                        children: [
                            { id: "4.3.1.1.1", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SCC---", desc_kor: "무선/모바일", desc_eng: "Cellular/Mobile" },
                            { id: "4.3.1.1.2", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SCO---", desc_kor: "전방위레이다가시선", desc_eng: "Omni-line,of,sight,(LOS)" },
                            { id: "4.3.1.1.3", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SCP---", desc_kor: "일대일레이다가시선", desc_eng: "Point-to-point,line,of,sight,(LOS)" },
                            { id: "4.3.1.1.4", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SCS---", desc_kor: "위성송신", desc_eng: "Satellite,uplink" },
                            { id: "4.3.1.1.5", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SCT---", desc_kor: "대류권산란", desc_eng: "Tropospheric,scatter" }
                        ]
                    },
                    {
                        id: "4.3.1.2",
                        type: "I",
                        affiliation: "*",
                        battlefield: "G",
                        status: "*",
                        modifier: "SR----",
                        desc_kor: "레이다",
                        desc_eng: "Radar",
                        children: [
                            { id: "4.3.1.2.1", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRAT--", desc_kor: "항공교통관제", desc_eng: "Air,traffic,control" },
                            { id: "4.3.1.2.2", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRAA--", desc_kor: "대공", desc_eng: "Antiaircraft" },
                            { id: "4.3.1.2.3", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRB---", desc_kor: "전장감시", desc_eng: "Battlefield,surveillance" },
                            { id: "4.3.1.2.4", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRCS--", desc_kor: "해안감시", desc_eng: "Coastal,surveillance" },
                            { id: "4.3.1.2.5", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRCA--", desc_kor: "접근관제", desc_eng: "Controlled,approach" },
                            { id: "4.3.1.2.6", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRD---", desc_kor: "데이터전송", desc_eng: "Data,transmission" },
                            { id: "4.3.1.2.7", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRE---", desc_kor: "조기경보", desc_eng: "Early,warning" },
                            { id: "4.3.1.2.8", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRF---", desc_kor: "화력통제", desc_eng: "Fire,control" },
                            { id: "4.3.1.2.9", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRH---", desc_kor: "고도탐지", desc_eng: "Height,finding" },
                            { id: "4.3.1.2.10", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRI---", desc_kor: "적아식별(질문기)", desc_eng: "Identification,friend/FOE,(Interrogator)" },
                            { id: "4.3.1.2.11", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRMM--", desc_kor: "기상(군용)", desc_eng: "Meteorological,(Military)" },
                            { id: "4.3.1.2.12", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRMA--", desc_kor: "유도탄포착", desc_eng: "Missile,acquisition" },
                            { id: "4.3.1.2.13", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRMG--", desc_kor: "유도탄유도", desc_eng: "Missile,guidance" },
                            { id: "4.3.1.2.14", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRMT--", desc_kor: "유도탄추적", desc_eng: "Missile,tracking" },
                            { id: "4.3.1.2.15", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRMF--", desc_kor: "다중임무", desc_eng: "Multifunction" },
                            { id: "4.3.1.2.16", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRS---", desc_kor: "포탄포착", desc_eng: "Shell,tracking" },
                            { id: "4.3.1.2.17", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRTA--", desc_kor: "표적획득", desc_eng: "Target,acquisition" },
                            { id: "4.3.1.2.18", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRTI--", desc_kor: "표적발광체", desc_eng: "Target,illuminator" },
                            { id: "4.3.1.2.19", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRTT--", desc_kor: "표적추적", desc_eng: "Target,tracking" },
                            { id: "4.3.1.2.20", type: "I", affiliation: "*", battlefield: "G", status: "*", modifier: "SRU---", desc_kor: "미확인", desc_eng: "Unknown" }
                        ]
                    }
                ]
            }]
        },
        {
            id: "4.4",
            type: "I",
            affiliation: "*",
            battlefield: "S",
            status: "*",
            modifier: "------",
            desc_kor: "수상항적",
            desc_eng: "Sea,surface,track",
            children: [{
                id: "4.4.1",
                type: "I",
                affiliation: "*",
                battlefield: "S",
                status: "*",
                modifier: "S-----",
                desc_kor: "신호도청",
                desc_eng: "Signal,intercept",
                children: [{
                        id: "4.4.1.1",
                        type: "I",
                        affiliation: "*",
                        battlefield: "S",
                        status: "*",
                        modifier: "SC----",
                        desc_kor: "통신",
                        desc_eng: "Communications",
                        children: [
                            { id: "4.4.1.1.1", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SCC---", desc_kor: "무선/모바일", desc_eng: "Cellular/Mobile" },
                            { id: "4.4.1.1.2", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SCO---", desc_kor: "전방위레이다가시선", desc_eng: "Omni-line,of,sight,(LOS)" },
                            { id: "4.4.1.1.3", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SCP---", desc_kor: "일대일레이다가시선", desc_eng: "Point-to-point,line,of,sight,(LOS)" },
                            { id: "4.4.1.1.4", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SCS---", desc_kor: "위성송신", desc_eng: "Satellite,uplink" }
                        ]
                    },
                    {
                        id: "4.4.1.2",
                        type: "I",
                        affiliation: "*",
                        battlefield: "S",
                        status: "*",
                        modifier: "SR----",
                        desc_kor: "레이다",
                        desc_eng: "Radar",
                        children: [
                            { id: "4.4.1.2.1", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRAT--", desc_kor: "항공교통관제", desc_eng: "Air,traffic,control" },
                            { id: "4.4.1.2.2", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRAA--", desc_kor: "대공", desc_eng: "Antiaircraft" },
                            { id: "4.4.1.2.3", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRCA--", desc_kor: "접근관제", desc_eng: "Controlled,approach" },
                            { id: "4.4.1.2.4", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRCI--", desc_kor: "요격관제", desc_eng: "Controlled,intercept" },
                            { id: "4.4.1.2.5", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRD---", desc_kor: "데이터전송", desc_eng: "Data,transmission" },
                            { id: "4.4.1.2.6", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRE---", desc_kor: "조기경보", desc_eng: "Early,warning" },
                            { id: "4.4.1.2.7", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRF---", desc_kor: "화력통제", desc_eng: "Fire,control" },
                            { id: "4.4.1.2.8", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRH---", desc_kor: "고도탐지", desc_eng: "Height,finding" },
                            { id: "4.4.1.2.9", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRI---", desc_kor: "적아식별(질문기)", desc_eng: "Identification,friend/FOE,(Interrogator)" },
                            { id: "4.4.1.2.10", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRMM--", desc_kor: "기상(군용)", desc_eng: "Meteorological,(Military)" },
                            { id: "4.4.1.2.11", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRMA--", desc_kor: "유도탄포착", desc_eng: "Missile,acquisition" },
                            { id: "4.4.1.2.12", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRMG--", desc_kor: "유도탄유도", desc_eng: "Missile,guidance" },
                            { id: "4.4.1.2.13", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRMT--", desc_kor: "유도탄추적", desc_eng: "Missile,tracking" },
                            { id: "4.4.1.2.14", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRMF--", desc_kor: "다중임무", desc_eng: "Multifunction" },
                            { id: "4.4.1.2.15", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRS---", desc_kor: "수상탐색", desc_eng: "Surface,search" },
                            { id: "4.4.1.2.16", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRTA--", desc_kor: "표적포착", desc_eng: "Target,acquisition" },
                            { id: "4.4.1.2.17", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRTI--", desc_kor: "표적발광체", desc_eng: "Target,illuminator" },
                            { id: "4.4.1.2.18", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRTT--", desc_kor: "표적추적", desc_eng: "Target,tracking" },
                            { id: "4.4.1.2.19", type: "I", affiliation: "*", battlefield: "S", status: "*", modifier: "SRU---", desc_kor: "미확인", desc_eng: "Unknown" }
                        ]
                    }
                ]
            }]
        },
        {
            id: "4.5",
            type: "I",
            affiliation: "*",
            battlefield: "U",
            status: "*",
            modifier: "------",
            desc_kor: "수중항적",
            desc_eng: "Subsurface,track",
            children: [{
                id: "4.5.1",
                type: "I",
                affiliation: "*",
                battlefield: "U",
                status: "*",
                modifier: "S-----",
                desc_kor: "신호도청",
                desc_eng: "Signal,intercept",
                children: [{
                        id: "4.5.1.1",
                        type: "I",
                        affiliation: "*",
                        battlefield: "U",
                        status: "*",
                        modifier: "SC----",
                        desc_kor: "통신",
                        desc_eng: "Communications",
                        children: [
                            { id: "4.5.1.1.1", type: "I", affiliation: "*", battlefield: "U", status: "*", modifier: "SCO---", desc_kor: "전방위레이다가시선", desc_eng: "Omni-line,of,sight,(LOS)" },
                            { id: "4.5.1.1.2", type: "I", affiliation: "*", battlefield: "U", status: "*", modifier: "SCP---", desc_kor: "일대일레이다가시선", desc_eng: "Point-to-point,line,of,sight,(LOS)" },
                            { id: "4.5.1.1.3", type: "I", affiliation: "*", battlefield: "U", status: "*", modifier: "SCS---", desc_kor: "위성송신", desc_eng: "Satellite,uplink" }
                        ]
                    },
                    {
                        id: "4.5.1.2",
                        type: "I",
                        affiliation: "*",
                        battlefield: "U",
                        status: "*",
                        modifier: "SR----",
                        desc_kor: "레이다",
                        desc_eng: "Radar",
                        children: [
                            { id: "4.5.1.2.1", type: "I", affiliation: "*", battlefield: "U", status: "*", modifier: "SRD---", desc_kor: "데이터전송", desc_eng: "Data,transmission" },
                            { id: "4.5.1.2.2", type: "I", affiliation: "*", battlefield: "U", status: "*", modifier: "SRE---", desc_kor: "조기경보", desc_eng: "Early,warning" },
                            { id: "4.5.1.2.3", type: "I", affiliation: "*", battlefield: "U", status: "*", modifier: "SRM---", desc_kor: "다중임무", desc_eng: "Multifunction" },
                            { id: "4.5.1.2.4", type: "I", affiliation: "*", battlefield: "U", status: "*", modifier: "SRS---", desc_kor: "수상탐색", desc_eng: "Surface,search" },
                            { id: "4.5.1.2.5", type: "I", affiliation: "*", battlefield: "U", status: "*", modifier: "SRT---", desc_kor: "표적포착", desc_eng: "Target,acquisition" },
                            { id: "4.5.1.2.6", type: "I", affiliation: "*", battlefield: "U", status: "*", modifier: "SRU---", desc_kor: "미확인", desc_eng: "Unknown" }
                        ]
                    }
                ]
            }]
        }
    ]
}];

var { affiliation, battlefield, status, mission } = require("./mil_basic");

module.exports = {
    code: "I",
    affiliation: affiliation,
    battlefield: battlefield,
    status: status,
    mission: mission,
    unit: {},
    identifier: functionIdentifier_Signal
};
},{"./mil_basic":2}],7:[function(require,module,exports){
/* eslint-disable */

/* index : 2 */
var position_Weather = [
    { code: "A", desc: "대기" },
    { code: "O", desc: "해양" },
    { code: "S", desc: "우주" }
];

/* index : 3,4 */
var fix_Weather = [
    { code: "S-", desc: "고정" },
    { code: "-D", desc: "가변" }
];

/* index : 11,12,13 */
var graphic_Weather = [
    { code: "P--", desc: "점" },
    { code: "-L-", desc: "선" },
    { code: "--A", desc: "영역" }
];

var functionIdentifier_Weather = [{
    id: "3",
    type: "W",
    pos: "-",
    fix: "--",
    graphic: "---",
    modifier: "------",
    desc_kor: "기상 및 해양",
    desc_eng: "METOC",
    children: [{
            id: "3.1",
            type: "W",
            pos: "A",
            fix: "--",
            graphic: "---",
            modifier: "------",
            desc_kor: "대기",
            desc_eng: "Atmospheric",
            children: [{
                    id: "3.1.1",
                    type: "W",
                    pos: "A",
                    fix: "--",
                    graphic: "---",
                    modifier: "P-----",
                    desc_kor: "기압",
                    desc_eng: "Pressure,systems",
                    children: [{
                            id: "3.1.1.1",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "P--",
                            modifier: "PL----",
                            desc_kor: "저기압중심",
                            desc_eng: "Low,pressure,center",
                            children: [
                                { id: "3.1.1.1.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "PC----", desc_kor: "싸이클론중심", desc_eng: "Cyclone,center" },
                                { id: "3.1.1.1.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "PLT---", desc_kor: "대류권계면 저고도", desc_eng: "Tropopause,low" }
                            ]
                        },
                        {
                            id: "3.1.1.2",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "P--",
                            modifier: "PH----",
                            desc_kor: "고기압중심",
                            desc_eng: "High,pressure,center",
                            children: [
                                { id: "3.1.1.2.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "PA----", desc_kor: "고기압중심", desc_eng: "Anticyclone,center" },
                                { id: "3.1.1.2.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "PHT---", desc_kor: "대류권계면 고고도", desc_eng: "Tropopause,high" }
                            ]
                        },
                        {
                            id: "3.1.1.3",
                            type: "W",
                            pos: "A",
                            fix: "-D",
                            graphic: "-L-",
                            modifier: "PF----",
                            desc_kor: "전선",
                            desc_eng: "Frontal,systems",
                            children: [{
                                    id: "3.1.1.3.1",
                                    type: "W",
                                    pos: "A",
                                    fix: "-D",
                                    graphic: "-L-",
                                    modifier: "PFC---",
                                    desc_kor: "한랭전선",
                                    desc_eng: "Cold,front",
                                    children: [
                                        { id: "3.1.1.3.1.1", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PFCU--", desc_kor: "상층 한랭전선", desc_eng: "Upper,cold,front" },
                                        { id: "3.1.1.3.1.2", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PFC-FG", desc_kor: "한랭전선 발생", desc_eng: "Cold,frontogenesis" },
                                        { id: "3.1.1.3.1.3", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PFC-FY", desc_kor: "한랭전선 소멸", desc_eng: "Cold,frontolysis" }
                                    ]
                                },
                                {
                                    id: "3.1.1.3.2",
                                    type: "W",
                                    pos: "A",
                                    fix: "-D",
                                    graphic: "-L-",
                                    modifier: "PFW---",
                                    desc_kor: "온난전선",
                                    desc_eng: "Warm,front",
                                    children: [
                                        { id: "3.1.1.3.2.1", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PFWU--", desc_kor: "상층 온난전선", desc_eng: "Upper,warm,front" },
                                        { id: "3.1.1.3.2.2", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PFW-FG", desc_kor: "온난전선 발생", desc_eng: "Warm,frontogenesis" },
                                        { id: "3.1.1.3.2.3", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PFW-FY", desc_kor: "온난전선 소멸", desc_eng: "Warm,frontolysis" }
                                    ]
                                },
                                {
                                    id: "3.1.1.3.3",
                                    type: "W",
                                    pos: "A",
                                    fix: "-D",
                                    graphic: "-L-",
                                    modifier: "PFO---",
                                    desc_kor: "폐색전선",
                                    desc_eng: "Occluded,front",
                                    children: [
                                        { id: "3.1.1.3.3.1", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PFOU--", desc_kor: "상층 폐색전선", desc_eng: "Upper,occluded,front" },
                                        { id: "3.1.1.3.3.2", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PFO-FY", desc_kor: "폐색전선 소멸", desc_eng: "Occluded,frontolysis" }
                                    ]
                                },
                                {
                                    id: "3.1.1.3.4",
                                    type: "W",
                                    pos: "A",
                                    fix: "-D",
                                    graphic: "-L-",
                                    modifier: "PFS---",
                                    desc_kor: "정체전선",
                                    desc_eng: "Stationary,front",
                                    children: [
                                        { id: "3.1.1.3.4.1", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PFSU--", desc_kor: "상층 정체전선", desc_eng: "Upper,stationary,front" },
                                        { id: "3.1.1.3.4.2", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PFS-FG", desc_kor: "정체전선 발생", desc_eng: "Stationary,frontogenesis" },
                                        { id: "3.1.1.3.4.3", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PFS-FY", desc_kor: "정체전선 소멸", desc_eng: "Stationary,frontolysis" }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "3.1.1.4",
                            type: "W",
                            pos: "A",
                            fix: "--",
                            graphic: "---",
                            modifier: "PX----",
                            desc_kor: "선",
                            desc_eng: "Lines",
                            children: [
                                { id: "3.1.1.4.1", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PXT---", desc_kor: "기압골", desc_eng: "Trough,axis" },
                                { id: "3.1.1.4.2", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PXR---", desc_kor: "기압마루", desc_eng: "Ridge,axis" },
                                { id: "3.1.1.4.3", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PXSQ--", desc_kor: "강한돌풍선", desc_eng: "Severe,squall,line" },
                                { id: "3.1.1.4.4", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PXIL--", desc_kor: "대기불안정선", desc_eng: "Instability,line" },
                                { id: "3.1.1.4.5", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PXSH--", desc_kor: "측밀림선", desc_eng: "Shear,line" },
                                { id: "3.1.1.4.6", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PXITCZ", desc_kor: "열대수렴대(ITCZ)", desc_eng: "Inter-tropical,convergance,zone" },
                                { id: "3.1.1.4.7", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PXCV--", desc_kor: "수렴선", desc_eng: "Convergance,line" },
                                { id: "3.1.1.4.8", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "PXITD-", desc_kor: "열대불연속(ITD)", desc_eng: "Inter-tropical,discontinuity" }
                            ]
                        }
                    ]
                },
                {
                    id: "3.1.2",
                    type: "W",
                    pos: "A",
                    fix: "--",
                    graphic: "---",
                    modifier: "T-----",
                    desc_kor: "난기류",
                    desc_eng: "Turbulence",
                    children: [
                        { id: "3.1.2.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "TL----", desc_kor: "난기류(약)", desc_eng: "Turbulence,-,Light" },
                        { id: "3.1.2.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "TM----", desc_kor: "난기류(중)", desc_eng: "Turbulence,-,Moderate" },
                        { id: "3.1.2.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "TS----", desc_kor: "난기류(강)", desc_eng: "Turbulence,-,Severe" },
                        { id: "3.1.2.4", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "TE----", desc_kor: "난기류(매우강)", desc_eng: "Turbulence,-,Extreme" },
                        { id: "3.1.2.5", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "T-MW--", desc_kor: "산악파", desc_eng: "Mountain,waves" }
                    ]
                },
                {
                    id: "3.1.3",
                    type: "W",
                    pos: "A",
                    fix: "--",
                    graphic: "---",
                    modifier: "I-----",
                    desc_kor: "착빙",
                    desc_eng: "Icing",
                    children: [{
                            id: "3.1.3.1",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "P--",
                            modifier: "IC----",
                            desc_kor: "결빙",
                            desc_eng: "Clear,icing",
                            children: [
                                { id: "3.1.3.1.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "ICL---", desc_kor: "결빙(약)", desc_eng: "Clear,icing,-,Light" },
                                { id: "3.1.3.1.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "ICM---", desc_kor: "결빙(중)", desc_eng: "Clear,icing,-,Moderate" },
                                { id: "3.1.3.1.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "ICS---", desc_kor: "결빙(강)", desc_eng: "Clear,icing,-,Severe" }
                            ]
                        },
                        {
                            id: "3.1.3.2",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "P--",
                            modifier: "IR----",
                            desc_kor: "무빙",
                            desc_eng: "Rime,icing",
                            children: [
                                { id: "3.1.3.2.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "IRL---", desc_kor: "무빙(약)", desc_eng: "Rime,icing,-,Light" },
                                { id: "3.1.3.2.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "IRM---", desc_kor: "무빙(중)", desc_eng: "Rime,icing,-,Moderate" },
                                { id: "3.1.3.2.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "IRS---", desc_kor: "무빙(강)", desc_eng: "Rime,icing,-,Severe" }
                            ]
                        },
                        {
                            id: "3.1.3.3",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "P--",
                            modifier: "IM----",
                            desc_kor: "혼빙",
                            desc_eng: "Mixed,icing",
                            children: [
                                { id: "3.1.3.3.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "IML---", desc_kor: "혼빙(약)", desc_eng: "Mixed,icing,-,Light" },
                                { id: "3.1.3.3.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "IMM---", desc_kor: "혼빙(중)", desc_eng: "Mixed,icing,-,Moderate" },
                                { id: "3.1.3.3.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "IMS---", desc_kor: "혼빙(강)", desc_eng: "Mixed,icing,-,Severe" }
                            ]
                        }
                    ]
                },
                {
                    id: "3.1.4",
                    type: "W",
                    pos: "A",
                    fix: "--",
                    graphic: "---",
                    modifier: "W-----",
                    desc_kor: "바람",
                    desc_eng: "Winds",
                    children: [
                        { id: "3.1.4.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WC----", desc_kor: "무풍", desc_eng: "Calm,winds" },
                        { id: "3.1.4.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WP----", desc_kor: "바람기호", desc_eng: "Wind,plot" },
                        { id: "3.1.4.3", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "WJ----", desc_kor: "제트기류", desc_eng: "Jet,stream" },
                        { id: "3.1.4.4", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "WS----", desc_kor: "기류선", desc_eng: "Stream,line" }
                    ]
                },
                {
                    id: "3.1.5",
                    type: "W",
                    pos: "A",
                    fix: "--",
                    graphic: "---",
                    modifier: "CC----",
                    desc_kor: "구름상태",
                    desc_eng: "Cloud,coverage",
                    children: [{
                        id: "3.1.5.1",
                        type: "W",
                        pos: "A",
                        fix: "--",
                        graphic: "---",
                        modifier: "CCCS--",
                        desc_kor: "구름상태부호",
                        desc_eng: "Cloud,coverage,symbols",
                        children: [
                            { id: "3.1.5.1.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "CCCSCS", desc_kor: "맑음", desc_eng: "Clear,sky" },
                            { id: "3.1.5.1.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "CCCSFC", desc_kor: "구름조금", desc_eng: "Few,coverage" },
                            { id: "3.1.5.1.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "CCCSSC", desc_kor: "구름다소", desc_eng: "Scattered,coverage" },
                            { id: "3.1.5.1.4", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "CCCSBC", desc_kor: "약간흐림", desc_eng: "Broken,coverage" },
                            { id: "3.1.5.1.5", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "CCCSOC", desc_kor: "흐림", desc_eng: "Overcast,coverage" },
                            { id: "3.1.5.1.6", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "CCCSOB", desc_kor: "하늘덮임", desc_eng: "Sky,totally,or,partially,obscured" }
                        ]
                    }]
                },
                {
                    id: "3.1.6",
                    type: "W",
                    pos: "A",
                    fix: "--",
                    graphic: "---",
                    modifier: "WS----",
                    desc_kor: "날씨부호",
                    desc_eng: "Weather,symbols",
                    children: [{
                            id: "3.1.6.1",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSR---",
                            desc_kor: "비",
                            desc_eng: "Rain",
                            children: [
                                { id: "3.1.6.1.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSR-LI", desc_kor: "비(간헐-약)", desc_eng: "Rain,-,Intermittent,light" },
                                { id: "3.1.6.1.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSR-LC", desc_kor: "비(지속-약)", desc_eng: "Rain,-,Continuous,light" },
                                { id: "3.1.6.1.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSR-MI", desc_kor: "비(간헐-중)", desc_eng: "Rain,-,Intermittent,moderate" },
                                { id: "3.1.6.1.4", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSR-MC", desc_kor: "비(지속-중)", desc_eng: "Rain,-,Continuous,moderate" },
                                { id: "3.1.6.1.5", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSR-HI", desc_kor: "비(간헐-강)", desc_eng: "Rain,-,Intermittent,heavy" },
                                { id: "3.1.6.1.6", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSR-HC", desc_kor: "비(지속-강)", desc_eng: "Rain,-,Continuous,heavy" }
                            ]
                        },
                        {
                            id: "3.1.6.2",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSRF--",
                            desc_kor: "동우",
                            desc_eng: "Freezing,rain",
                            children: [
                                { id: "3.1.6.2.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSRFL-", desc_kor: "동우(약)", desc_eng: "Freezing,rain,-,Light" },
                                { id: "3.1.6.2.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSRFMH", desc_kor: "동우(중/강)", desc_eng: "Freezing,rain,-,Moderate/Heavy" }
                            ]
                        },
                        {
                            id: "3.1.6.3",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSRS--",
                            desc_kor: "소나기",
                            desc_eng: "Rain,showers",
                            children: [
                                { id: "3.1.6.3.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSRSL-", desc_kor: "소나기(약)", desc_eng: "Rain,showers,-,Light" },
                                { id: "3.1.6.3.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSRSMH", desc_kor: "소나기(중/강)", desc_eng: "Rain,showers,-,Moderate/Heavy" },
                                { id: "3.1.6.3.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSRST-", desc_kor: "소나기(폭우)", desc_eng: "Rain,showers,-,Torrential" }
                            ]
                        },
                        {
                            id: "3.1.6.4",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSD---",
                            desc_kor: "가랑비",
                            desc_eng: "Drizzle",
                            children: [{
                                    id: "3.1.6.4.1",
                                    type: "W",
                                    pos: "A",
                                    fix: "S-",
                                    graphic: "P--",
                                    modifier: "WSD-LI",
                                    desc_kor: "가랑비(간헐-약)",
                                    desc_eng: "Drizzle,-,Intermittent,light",
                                    children: [
                                        { id: "3.1.6.4.1.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSD-LC", desc_kor: "가랑비(지속-약)", desc_eng: "Drizzle,-,Continuous,light" }
                                    ]
                                },
                                {
                                    id: "3.1.6.4.2",
                                    type: "W",
                                    pos: "A",
                                    fix: "S-",
                                    graphic: "P--",
                                    modifier: "WSD-MI",
                                    desc_kor: "가랑비(간헐-중)",
                                    desc_eng: "Drizzle,-,Intermittent,moderate",
                                    children: [
                                        { id: "3.1.6.4.2.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSD-MC", desc_kor: "가랑비(지속-중)", desc_eng: "Drizzle,-,Continuous,moderate" }
                                    ]
                                },
                                {
                                    id: "3.1.6.4.3",
                                    type: "W",
                                    pos: "A",
                                    fix: "S-",
                                    graphic: "P--",
                                    modifier: "WSD-HI",
                                    desc_kor: "가랑비(간헐-강)",
                                    desc_eng: "Drizzle,-,Intermittent,heavy",
                                    children: [
                                        { id: "3.1.6.4.3.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSD-HC", desc_kor: "가랑비(지속-강)", desc_eng: "Drizzle,-,Continuous,heavy" }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "3.1.6.5",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSDF--",
                            desc_kor: "진눈깨비",
                            desc_eng: "Freezing,drizzle",
                            children: [
                                { id: "3.1.6.5.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSDFL-", desc_kor: "진눈깨비(약)", desc_eng: "Freezing,drizzle,-,Light" },
                                { id: "3.1.6.5.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSDFMH", desc_kor: "진눈깨비(중/강)", desc_eng: "Freezing,drizzle,-,Moderate/Heavy" }
                            ]
                        },
                        {
                            id: "3.1.6.6",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSM---",
                            desc_kor: "눈비혼합",
                            desc_eng: "Rain,and,snow,mixed",
                            children: [
                                { id: "3.1.6.6.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSM-L-", desc_kor: "비/가랑비/눈(약)", desc_eng: "Rain,or,drizzle,and,snow,-,Light" },
                                { id: "3.1.6.6.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSM-MH", desc_kor: "비/가랑비/눈(중/강)", desc_eng: "Rain,or,drizzle,and,snow,-,Moderate/Heavy" },
                                { id: "3.1.6.6.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSMSL-", desc_kor: "소나기/소낙눈(약)", desc_eng: "Rain,and,snow,showers,-,Light" },
                                { id: "3.1.6.6.4", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSMSMH", desc_kor: "소나기/소낙눈(중/강)", desc_eng: "Rain,and,snow,showers,-,Moderate/Heavy" }
                            ]
                        },
                        {
                            id: "3.1.6.7",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSS---",
                            desc_kor: "눈",
                            desc_eng: "Snow",
                            children: [{
                                    id: "3.1.6.7.1",
                                    type: "W",
                                    pos: "A",
                                    fix: "S-",
                                    graphic: "P--",
                                    modifier: "WSS-LI",
                                    desc_kor: "눈(간헐-약)",
                                    desc_eng: "Snow,-,intermittent,light",
                                    children: [
                                        { id: "3.1.6.7.1.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSS-LC", desc_kor: "눈(지속-약)", desc_eng: "Snow,-,continuous,light" }
                                    ]
                                },
                                {
                                    id: "3.1.6.7.2",
                                    type: "W",
                                    pos: "A",
                                    fix: "S-",
                                    graphic: "P--",
                                    modifier: "WSS-MI",
                                    desc_kor: "눈(간헐-중)",
                                    desc_eng: "Snow,-,intermittent,moderate",
                                    children: [
                                        { id: "3.1.6.7.2.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSS-MC", desc_kor: "눈(지속-중)", desc_eng: "Snow,-,continuous,moderate" }
                                    ]
                                },
                                {
                                    id: "3.1.6.7.3",
                                    type: "W",
                                    pos: "A",
                                    fix: "S-",
                                    graphic: "P--",
                                    modifier: "WSS-HI",
                                    desc_kor: "눈(간헐-강)",
                                    desc_eng: "Snow,-,intermittent,heavy",
                                    children: [
                                        { id: "3.1.6.7.3.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSS-HC", desc_kor: "눈(지속-강)", desc_eng: "Snow,-,continuous,heavy" }
                                    ]
                                },
                                { id: "3.1.6.7.4", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSSBLM", desc_kor: "눈보라(풍설)(약/중)", desc_eng: "Blowing,snow,-,Light/Moderate" },
                                { id: "3.1.6.7.5", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSSBH-", desc_kor: "눈보라(강)", desc_eng: "Blowing,snow,-,Heavy" }
                            ]
                        },
                        { id: "3.1.6.8", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSSG--", desc_kor: "싸락눈", desc_eng: "Snow,grains" },
                        {
                            id: "3.1.6.9",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSSS--",
                            desc_kor: "소낙눈",
                            desc_eng: "Snow,showers",
                            children: [
                                { id: "3.1.6.9.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSSSL-", desc_kor: "소낙눈(약)", desc_eng: "Snow,showers,-,Light" },
                                { id: "3.1.6.9.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSSSMH", desc_kor: "소낙눈(중/강)", desc_eng: "Snow,showers,-,Moderate/Heavy" }
                            ]
                        },
                        {
                            id: "3.1.6.10",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSGR--",
                            desc_kor: "우박",
                            desc_eng: "Hail",
                            children: [
                                { id: "3.1.6.10.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSGRL-", desc_kor: "우박(약)", desc_eng: "Hail,-,Light,not,associated,with,thunder" },
                                { id: "3.1.6.10.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSGRMH", desc_kor: "우박(중/강)", desc_eng: "Hail,-,Moderate/Heavy,not,associated,with,thunder" }
                            ]
                        },
                        { id: "3.1.6.11", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSIC--", desc_kor: "얼음결정", desc_eng: "Ice,crystals,(Diamond,dust)" },
                        {
                            id: "3.1.6.12",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSPL--",
                            desc_kor: "싸락우박",
                            desc_eng: "Ice,pellets,(Sleet)",
                            children: [
                                { id: "3.1.6.12.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSPLL-", desc_kor: "싸락우박(약)", desc_eng: "Ice,pellets,-,Light" },
                                { id: "3.1.6.12.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSPLM-", desc_kor: "싸락우박(중)", desc_eng: "Ice,pellets,-,Moderate" },
                                { id: "3.1.6.12.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSPLH-", desc_kor: "싸락우박(강)", desc_eng: "Ice,pellets,-,Heavy" }
                            ]
                        },
                        {
                            id: "3.1.6.13",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WST---",
                            desc_kor: "폭풍",
                            desc_eng: "Storms",
                            children: [
                                { id: "3.1.6.13.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WST-NP", desc_kor: "뇌우", desc_eng: "Thunderstorm,-,No,precipitation" },
                                { id: "3.1.6.13.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSTMR-", desc_kor: "뇌우(약~중)(비/눈)", desc_eng: "Thunderstorm,light,to,moderate,with,Rain/Snow,-,No,hail" },
                                { id: "3.1.6.13.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSTHR-", desc_kor: "뇌우(강)(비/눈)", desc_eng: "Thunderstorm,heavy,with,Rain/Snow,-,No,hail" },
                                { id: "3.1.6.13.4", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSTMH-", desc_kor: "뇌우(약~중)(우박)", desc_eng: "Thunderstorm,light,to,moderate,-,With,hail" },
                                { id: "3.1.6.13.5", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSTHH-", desc_kor: "뇌우(강)(우박)", desc_eng: "Thunderstorm,heavy,-,With,hail" },
                                { id: "3.1.6.13.6", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WST-FC", desc_kor: "토네이도", desc_eng: "Funnel,cloud,(Tornado/Waterspout)" },
                                { id: "3.1.6.13.7", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WST-SQ", desc_kor: "돌풍", desc_eng: "Squall" },
                                { id: "3.1.6.13.8", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WST-LG", desc_kor: "번개", desc_eng: "Lightning" }
                            ]
                        },
                        {
                            id: "3.1.6.14",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSFG--",
                            desc_kor: "안개",
                            desc_eng: "Fog",
                            children: [
                                { id: "3.1.6.14.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSFGPS", desc_kor: "안개(옅은,부분적)", desc_eng: "Fog,-,Shallow,patches" },
                                { id: "3.1.6.14.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSFGCS", desc_kor: "안개(옅은,지속적)", desc_eng: "Fog,-,Shallow,continuous" },
                                { id: "3.1.6.14.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSFGP-", desc_kor: "안개(부분적)", desc_eng: "Fog,-,Patchy" },
                                { id: "3.1.6.14.4", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSFGSV", desc_kor: "안개(하늘보임)", desc_eng: "Fog,-,Sky,visible" },
                                { id: "3.1.6.14.5", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSFGSO", desc_kor: "안개(하늘가림)", desc_eng: "Fog,-,Sky,obscured" },
                                { id: "3.1.6.14.6", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSFGFV", desc_kor: "얼안개(빙무)(하늘보임)", desc_eng: "Fog,-,Freezing,,Sky,visible" },
                                { id: "3.1.6.14.7", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSFGFO", desc_kor: "얼안개(빙무)(하늘가림)", desc_eng: "Fog,-,Freezing,,Sky,not,visible" }
                            ]
                        },
                        { id: "3.1.6.15", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSBR--", desc_kor: "박무", desc_eng: "Mist" },
                        { id: "3.1.6.16", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSFU--", desc_kor: "연기", desc_eng: "Smoke" },
                        { id: "3.1.6.17", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSHZ--", desc_kor: "연무", desc_eng: "Haze" },
                        {
                            id: "3.1.6.18",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSDS--",
                            desc_kor: "풍진",
                            desc_eng: "Dust,or,sand",
                            children: [
                                { id: "3.1.6.18.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSDSLM", desc_kor: "풍진(약~중)", desc_eng: "Dust/Sand,storm,-,Light,to,moderate" },
                                { id: "3.1.6.18.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSDSS-", desc_kor: "풍진(강)", desc_eng: "Dust/Sand,storm,-,Severe" },
                                { id: "3.1.6.18.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSDD--", desc_kor: "회오리바람", desc_eng: "Dust,devil" },
                                { id: "3.1.6.18.4", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSDB--", desc_kor: "먼지/모래바람", desc_eng: "Blowing,dust,or,sand" }
                            ]
                        },
                        {
                            id: "3.1.6.19",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "WSTS--",
                            desc_kor: "폭풍체계",
                            desc_eng: "Tropical,storm,systems",
                            children: [
                                { id: "3.1.6.19.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSTSD-", desc_kor: "열대성저기압", desc_eng: "Tropical,depression" },
                                { id: "3.1.6.19.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSTSS-", desc_kor: "열대폭풍", desc_eng: "Tropical,storm" },
                                { id: "3.1.6.19.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSTSH-", desc_kor: "태풍(허리케인)", desc_eng: "Hurricane/Typhoon" },
                                { id: "3.1.6.19.4", type: "W", pos: "A", fix: "-D", graphic: "--A", modifier: "WSTSWA", desc_kor: "열대태풍 영역/일시", desc_eng: "Tropical,storm,wind,areas,and,date/Time,labels" }
                            ]
                        },
                        {
                            id: "3.1.6.20",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "P--",
                            modifier: "WSVE--",
                            desc_kor: "화산폭발",
                            desc_eng: "Volcanic,eruption",
                            children: [
                                { id: "3.1.6.20.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSVA--", desc_kor: "화산재", desc_eng: "Volcanic,ash" }
                            ]
                        },
                        { id: "3.1.6.21", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WST-LV", desc_kor: "대류권계면 고도", desc_eng: "Tropopause,level" },
                        { id: "3.1.6.22", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSF-LV", desc_kor: "결빙 고도", desc_eng: "Freezing,level" },
                        { id: "3.1.6.23", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "WSUKP-", desc_kor: "강수미상(형태/밀도)", desc_eng: "Precipitation,of,unknown,type,and,intensity" }
                    ]
                },
                {
                    id: "3.1.7",
                    type: "W",
                    pos: "A",
                    fix: "--",
                    graphic: "---",
                    modifier: "BA----",
                    desc_kor: "기상 상태별 지역",
                    desc_eng: "Bounded,areas,of,weather",
                    children: [
                        { id: "3.1.7.1", type: "W", pos: "A", fix: "-D", graphic: "--A", modifier: "BAIF--", desc_kor: "계기비행 지역", desc_eng: "Instrument,flight,rule,(IFR)" },
                        { id: "3.1.7.2", type: "W", pos: "A", fix: "-D", graphic: "--A", modifier: "BAMV--", desc_kor: "유시계비행한계 지역", desc_eng: "Marginal,visual,flight,rule,(MVFR)" },
                        { id: "3.1.7.3", type: "W", pos: "A", fix: "-D", graphic: "--A", modifier: "BATB--", desc_kor: "난기류 지역", desc_eng: "Turbulence" },
                        { id: "3.1.7.4", type: "W", pos: "A", fix: "-D", graphic: "--A", modifier: "BAI---", desc_kor: "착빙 지역", desc_eng: "Icing" },
                        { id: "3.1.7.5", type: "W", pos: "A", fix: "-D", graphic: "--A", modifier: "BALPNC", desc_kor: "액체형태 강수(비대류성, 연속 또는 간헐) 지역", desc_eng: "Liquid,precipitation,-,Non-convective,continuous,or,intermittent" },
                        { id: "3.1.7.6", type: "W", pos: "A", fix: "-D", graphic: "--A", modifier: "BALPC-", desc_kor: "액체형태 강수(대류성) 지역", desc_eng: "Liquid,precipitation,-,Convective" },
                        { id: "3.1.7.7", type: "W", pos: "A", fix: "-D", graphic: "--A", modifier: "BAFP--", desc_kor: "결빙형태 강수 지역", desc_eng: "Freezing/Frozen,precipitation" },
                        { id: "3.1.7.8", type: "W", pos: "A", fix: "-D", graphic: "--A", modifier: "BAT---", desc_kor: "뇌우지역", desc_eng: "Thunderstorms" },
                        { id: "3.1.7.9", type: "W", pos: "A", fix: "-D", graphic: "--A", modifier: "BAFG--", desc_kor: "안개지역", desc_eng: "Fog" },
                        { id: "3.1.7.10", type: "W", pos: "A", fix: "-D", graphic: "--A", modifier: "BAD---", desc_kor: "풍진지역", desc_eng: "Dust,or,sand" },
                        { id: "3.1.7.11", type: "W", pos: "A", fix: "-D", graphic: "--A", modifier: "BAFF--", desc_kor: "임의지정지역", desc_eng: "Operator-defined,freeform" }
                    ]
                },
                {
                    id: "3.1.8",
                    type: "W",
                    pos: "A",
                    fix: "--",
                    graphic: "---",
                    modifier: "IP----",
                    desc_kor: "등치선",
                    desc_eng: "Isopleths",
                    children: [
                        { id: "3.1.8.1", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "IPIB--", desc_kor: "등압선(표면)", desc_eng: "Isobar,-,Surface" },
                        { id: "3.1.8.2", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "IPCO--", desc_kor: "등압면고도(고층)", desc_eng: "Contour,-,Upper,air" },
                        { id: "3.1.8.3", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "IPIS--", desc_kor: "등온선", desc_eng: "Isotherm" },
                        { id: "3.1.8.4", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "IPIT--", desc_kor: "등풍속선", desc_eng: "Isotach" },
                        { id: "3.1.8.5", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "IPID--", desc_kor: "등이슬점선", desc_eng: "Isodrosotherm" },
                        { id: "3.1.8.6", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "IPTH--", desc_kor: "등겹선", desc_eng: "Thickness" },
                        { id: "3.1.8.7", type: "W", pos: "A", fix: "-D", graphic: "-L-", modifier: "IPFF--", desc_kor: "임의지정등치선", desc_eng: "Operator-defined,freeform" }
                    ]
                },
                {
                    id: "3.1.9",
                    type: "W",
                    pos: "A",
                    fix: "S-",
                    graphic: "---",
                    modifier: "G-----",
                    desc_kor: "지표상태",
                    desc_eng: "State,of,the,ground",
                    children: [{
                            id: "3.1.9.1",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "GN----",
                            desc_kor: "눈/결빙 없음",
                            desc_eng: "Without,snow,or,measurable,ice,cover",
                            children: [
                                { id: "3.1.9.1.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GND-NC", desc_kor: "지표건조(균열, 주목할만한 먼지, 성긴모래 등이 없음)", desc_eng: "Surface,dry,without,cracks,or,appreciable,dust,or,loose,sand" },
                                { id: "3.1.9.1.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GNM---", desc_kor: "지표습기", desc_eng: "Surface,moist" },
                                { id: "3.1.9.1.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GNW-SW", desc_kor: "지표물기(크고작은 물웅덩이)", desc_eng: "Surface,wet,,standing,water,in,small,or,large,pools" },
                                { id: "3.1.9.1.4", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GNFL--", desc_kor: "지표홍수", desc_eng: "Surface,flooded" },
                                { id: "3.1.9.1.5", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GNFZ--", desc_kor: "지표결빙", desc_eng: "Surface,frozen" },
                                { id: "3.1.9.1.6", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GNG-TI", desc_kor: "지표우빙", desc_eng: "Glaze,(Thin,ice),on,ground" },
                                { id: "3.1.9.1.7", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GNLDN-", desc_kor: "지표를 완전히 덮지 않는 성긴 먼지/모래", desc_eng: "Loose,dry,dust,or,sand,not,covering,ground,completely" },
                                { id: "3.1.9.1.8", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GNLDTC", desc_kor: "지표를 얇게 덮는 성긴 먼지/모래", desc_eng: "Thin,loose,dry,dust,or,sand,covering,ground,completely" },
                                { id: "3.1.9.1.9", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GNLDMC", desc_kor: "지표를 두껍게 덮는 성긴 먼지/모래", desc_eng: "Moderate/Thick,loose,dry,dust,or,sand,covering,ground,completely" },
                                { id: "3.1.9.1.10", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GNDEWC", desc_kor: "지표 매우건조 및 갈라짐", desc_eng: "Extremely,dry,with,cracks" }
                            ]
                        },
                        {
                            id: "3.1.9.2",
                            type: "W",
                            pos: "A",
                            fix: "S-",
                            graphic: "---",
                            modifier: "GS----",
                            desc_kor: "지표 눈/얼음 덮임",
                            desc_eng: "With,snow,or,measurable,ice,cover",
                            children: [
                                { id: "3.1.9.2.1", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GSI---", desc_kor: "지표 대부분 얼음 덮임", desc_eng: "Predominately,ice,covered" },
                                { id: "3.1.9.2.2", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GSSCL-", desc_kor: "지표 반이하 단단한눈 또는 젖은눈 덮임", desc_eng: "Compact,or,wet,snow,(with,or,without,ice),covering,less,than,one-half,of,ground" },
                                { id: "3.1.9.2.3", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GSSCH-", desc_kor: "지표 반이상 단단한눈 또는 젖은눈 덮임", desc_eng: "Compact,or,wet,snow,(with,or,without,ice),covering,at,least,one-half,ground,,but,ground,not,completely,covered" },
                                { id: "3.1.9.2.4", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GSSCCE", desc_kor: "지표전체 골고루 단단한눈 또는 젖은눈 덮임", desc_eng: "Even,layer,of,compact,or,wet,snow,covering,ground,completely" },
                                { id: "3.1.9.2.5", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GSSCCU", desc_kor: "지표전체 불규칙하게 단단한눈 또는 젖은눈 덮임", desc_eng: "Uneven,layer,of,compact,or,wet,snow,covering,ground,completely" },
                                { id: "3.1.9.2.6", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GSSLL-", desc_kor: "지표 반이하 성기고 마른눈 덮임", desc_eng: "Loose,dry,snow,covering,less,than,one-half,of,ground" },
                                { id: "3.1.9.2.7", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GSSLH-", desc_kor: "지표 반이상 성기고 마른눈 덮임", desc_eng: "Loose,dry,snow,covering,at,least,one-half,ground,,but,ground,not,completely,covered" },
                                { id: "3.1.9.2.8", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GSSLCE", desc_kor: "지표전체 골고루 성기고 마른눈 덮임", desc_eng: "Even,layer,of,loose,dry,snow,covering,ground,completely" },
                                { id: "3.1.9.2.9", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GSSLCU", desc_kor: "지표전체 불규칙하게 성기고 마른눈 덮임", desc_eng: "Uneven,layer,of,loose,dry,snow,covering,ground,completely" },
                                { id: "3.1.9.2.10", type: "W", pos: "A", fix: "S-", graphic: "P--", modifier: "GSSDC-", desc_kor: "지표완전 눈덮임(두꺼운 눈더미)", desc_eng: "Snow,covering,ground,completely;,Deep,drifts" }
                            ]
                        }
                    ]
                },
                {
                    id: "3.1.10",
                    type: "W",
                    pos: "A",
                    fix: "--",
                    graphic: "---",
                    modifier: "F-----",
                    desc_kor: "비행규정",
                    desc_eng: "Flight,rules",
                    children: [
                        { id: "3.1.10.1", type: "W", pos: "A", fix: "--", graphic: "---", modifier: "FI----", desc_kor: "계기상승한도", desc_eng: "Instrument,ceiling" },
                        { id: "3.1.10.2", type: "W", pos: "A", fix: "--", graphic: "---", modifier: "FV----", desc_kor: "시계상승한도", desc_eng: "Visual,ceiling" }
                    ]
                }
            ]
        },
        {
            id: "3.2",
            type: "W",
            pos: "O",
            fix: "--",
            graphic: "---",
            modifier: "------",
            desc_kor: "해양",
            desc_eng: "Oceanic",
            children: [{
                    id: "3.2.1",
                    type: "W",
                    pos: "O",
                    fix: "--",
                    graphic: "---",
                    modifier: "I-----",
                    desc_kor: "얼음",
                    desc_eng: "Ice,systems",
                    children: [{
                            id: "3.2.1.1",
                            type: "W",
                            pos: "O",
                            fix: "S-",
                            graphic: "P--",
                            modifier: "IB----",
                            desc_kor: "빙산군",
                            desc_eng: "Icebergs",
                            children: [
                                { id: "3.2.1.1.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IBM---", desc_kor: "많은 빙산군", desc_eng: "Many,icebergs" },
                                { id: "3.2.1.1.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IBBS--", desc_kor: "빙산띠", desc_eng: "Belts,and,strips" },
                                { id: "3.2.1.1.3", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IBG---", desc_kor: "빙산(일반)", desc_eng: "Iceberg,-,General" },
                                { id: "3.2.1.1.4", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IBMG--", desc_kor: "많은 빙산(일반)", desc_eng: "Many,icebergs,-,General" },
                                { id: "3.2.1.1.5", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IBBB--", desc_kor: "부빙편", desc_eng: "Bergy,bit" },
                                { id: "3.2.1.1.6", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IBBBM-", desc_kor: "많은 부빙편", desc_eng: "Many,bergy,bits" },
                                { id: "3.2.1.1.7", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IBGL--", desc_kor: "작은 빙산", desc_eng: "Growler" },
                                { id: "3.2.1.1.8", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IBGLM-", desc_kor: "작은 빙산(다수)", desc_eng: "Many,growlers" },
                                { id: "3.2.1.1.9", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IBF---", desc_kor: "부빙", desc_eng: "Floeberg" },
                                { id: "3.2.1.1.10", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IBII--", desc_kor: "얼음섬", desc_eng: "Ice,island" }
                            ]
                        },
                        {
                            id: "3.2.1.2",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "IC----",
                            desc_kor: "얼음 분포",
                            desc_eng: "Ice,concentration",
                            children: [
                                { id: "3.2.1.2.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "ICWB--", desc_kor: "빙산 많음", desc_eng: "Bergy,water" },
                                { id: "3.2.1.2.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "ICWR--", desc_kor: "레이다에 포착되는 빙산", desc_eng: "Water,with,radar,targets" },
                                { id: "3.2.1.2.3", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "ICIF--", desc_kor: "빙산 없음", desc_eng: "Ice,free" }
                            ]
                        },
                        {
                            id: "3.2.1.3",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "ID----",
                            desc_kor: "동적 프로세스",
                            desc_eng: "Dynamic,processes",
                            children: [
                                { id: "3.2.1.3.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IDC---", desc_kor: "수렴", desc_eng: "Convergence" },
                                { id: "3.2.1.3.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IDD---", desc_kor: "발산", desc_eng: "Divergence" },
                                { id: "3.2.1.3.3", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IDS---", desc_kor: "측밀림/측밀림지역", desc_eng: "Shearing,or,shear,zone" },
                                { id: "3.2.1.3.4", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "IDID--", desc_kor: "눈더미(방향)", desc_eng: "Ice,drift,(Direction)" }
                            ]
                        },
                        {
                            id: "3.2.1.4",
                            type: "W",
                            pos: "O",
                            fix: "S-",
                            graphic: "P--",
                            modifier: "II----",
                            desc_kor: "해빙(바다얼음)",
                            desc_eng: "Sea,ice",
                            children: [
                                { id: "3.2.1.4.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IITM--", desc_kor: "해빙두께(관측)", desc_eng: "Ice,thickness,(Observed)" },
                                { id: "3.2.1.4.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IITE--", desc_kor: "해빙두께(추정)", desc_eng: "Ice,thickness,(Estimated)" },
                                { id: "3.2.1.4.3", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "IIP---", desc_kor: "홍수얼음", desc_eng: "Melt,puddles,or,flooded,ice" }
                            ]
                        },
                        {
                            id: "3.2.1.5",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "IL----",
                            desc_kor: "제한",
                            desc_eng: "Limits",
                            children: [
                                { id: "3.2.1.5.1", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "ILOV--", desc_kor: "목측관측 제한", desc_eng: "Limit,of,visual,observation" },
                                { id: "3.2.1.5.2", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "ILUC--", desc_kor: "비행기 아래의 구름", desc_eng: "Limit,of,undercast" },
                                { id: "3.2.1.5.3", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "ILOR--", desc_kor: "레이더 관측 제한", desc_eng: "Limit,of,radar,observation" },
                                { id: "3.2.1.5.4", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "ILIEO-", desc_kor: "관측된 빙산면/경계", desc_eng: "Observed,ice,edge,or,boundary" },
                                { id: "3.2.1.5.5", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "ILIEE-", desc_kor: "추정된 빙산면/경계", desc_eng: "Estimated,ice,edge,or,boundary" },
                                { id: "3.2.1.5.6", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "ILIER-", desc_kor: "레이더 관측 빙산면/경계", desc_eng: "Ice,edge,or,boundary,from,radar" }
                            ]
                        },
                        {
                            id: "3.2.1.6",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "IO----",
                            desc_kor: "얼음 구멍",
                            desc_eng: "Openings,in,the,ice",
                            children: [
                                { id: "3.2.1.6.1", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "IOC---", desc_kor: "균열", desc_eng: "Cracks" },
                                { id: "3.2.1.6.2", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "IOCS--", desc_kor: "특정위치의 균열", desc_eng: "Cracks,at,a,specific,location" },
                                { id: "3.2.1.6.3", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "IOL---", desc_kor: "리드", desc_eng: "Lead" },
                                { id: "3.2.1.6.4", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "IOLF--", desc_kor: "리드(결빙)", desc_eng: "Frozen,lead" }
                            ]
                        },
                        {
                            id: "3.2.1.7",
                            type: "W",
                            pos: "O",
                            fix: "S-",
                            graphic: "P--",
                            modifier: "ISC---",
                            desc_kor: "적설",
                            desc_eng: "Snow,cover",
                            children: [
                                { id: "3.2.1.7.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "ISS---", desc_kor: "설면융기(방향)", desc_eng: "Sastrugi,(with,orientation)" }
                            ]
                        },
                        {
                            id: "3.2.1.8",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "IT----",
                            desc_kor: "지형특성",
                            desc_eng: "Topographical,features",
                            children: [
                                { id: "3.2.1.8.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "ITRH--", desc_kor: "산마루/작은언덕", desc_eng: "Ridges,or,hummocks" },
                                { id: "3.2.1.8.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "ITR---", desc_kor: "급류", desc_eng: "Rafting" },
                                { id: "3.2.1.8.3", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "ITBB--", desc_kor: "빽빽한 유빙조각", desc_eng: "Jammed,brash,barrier" }
                            ]
                        }
                    ]
                },
                {
                    id: "3.2.2",
                    type: "W",
                    pos: "O",
                    fix: "--",
                    graphic: "---",
                    modifier: "H-----",
                    desc_kor: "수부",
                    desc_eng: "Hydrography",
                    children: [{
                            id: "3.2.2.1",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "HD----",
                            desc_kor: "수심",
                            desc_eng: "Depth",
                            children: [
                                { id: "3.2.2.1.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HDS---", desc_kor: "수심측량", desc_eng: "Soundings" },
                                { id: "3.2.2.1.2", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HDDL--", desc_kor: "수심선", desc_eng: "Depth,curve" },
                                { id: "3.2.2.1.3", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HDDC--", desc_kor: "등심선", desc_eng: "Depth,contour" },
                                { id: "3.2.2.1.4", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HDDA--", desc_kor: "등심영역", desc_eng: "Depth,area" }
                            ]
                        },
                        {
                            id: "3.2.2.2",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "HC----",
                            desc_kor: "해안수부",
                            desc_eng: "Coastal,hydrography",
                            children: [
                                { id: "3.2.2.2.1", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HCC---", desc_kor: "해안선", desc_eng: "Coastline" },
                                { id: "3.2.2.2.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HCI---", desc_kor: "섬", desc_eng: "Island" },
                                { id: "3.2.2.2.3", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HCB---", desc_kor: "해안", desc_eng: "Beach" },
                                { id: "3.2.2.2.4", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HCW---", desc_kor: "물", desc_eng: "Water" },
                                {
                                    id: "3.2.2.2.5",
                                    type: "W",
                                    pos: "O",
                                    fix: "-D",
                                    graphic: "---",
                                    modifier: "HCF---",
                                    desc_kor: "물가,갯벌",
                                    desc_eng: "Foreshore",
                                    children: [
                                        { id: "3.2.2.2.5.1", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HCF---", desc_kor: "물가,갯벌(경계)", desc_eng: "Foreshore" },
                                        { id: "3.2.2.2.5.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HCF---", desc_kor: "물가,갯벌(영역)", desc_eng: "Foreshore" }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "3.2.2.3",
                            type: "W",
                            pos: "O",
                            fix: "-D",
                            graphic: "---",
                            modifier: "HP----",
                            desc_kor: "항만,항구",
                            desc_eng: "Ports,and,harbors",
                            children: [{
                                    id: "3.2.2.3.1",
                                    type: "W",
                                    pos: "O",
                                    fix: "S-",
                                    graphic: "---",
                                    modifier: "HPB---",
                                    desc_kor: "항만",
                                    desc_eng: "Ports",
                                    children: [
                                        { id: "3.2.2.3.1.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HPB-O-", desc_kor: "정박지(육지)", desc_eng: "Berths,(Onshore)" },
                                        { id: "3.2.2.3.1.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HPB-A-", desc_kor: "정박지(닻)", desc_eng: "Berths,(Anchor)" },
                                        { id: "3.2.2.3.1.3", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HPBA--", desc_kor: "정박지(위치)", desc_eng: "Anchorage" },
                                        { id: "3.2.2.3.1.4", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HPBA--", desc_kor: "정박지(경계)", desc_eng: "Anchorage" },
                                        { id: "3.2.2.3.1.5", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HPBA--", desc_kor: "정박지(영역)", desc_eng: "Anchorage" },
                                        { id: "3.2.2.3.1.6", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HPCP--", desc_kor: "호출지점", desc_eng: "Call,in,point" },
                                        { id: "3.2.2.3.1.7", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HPBP--", desc_kor: "부두", desc_eng: "Pier/Wharf/Quay" }
                                    ]
                                },
                                {
                                    id: "3.2.2.3.2",
                                    type: "W",
                                    pos: "O",
                                    fix: "--",
                                    graphic: "---",
                                    modifier: "HPF---",
                                    desc_kor: "어업",
                                    desc_eng: "Fishing",
                                    children: [
                                        { id: "3.2.2.3.2.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HPFH--", desc_kor: "어항", desc_eng: "Fishing,harbor" },
                                        { id: "3.2.2.3.2.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HPFS--", desc_kor: "둑(위치)", desc_eng: "Fish,stakes/Traps/Weirs" },
                                        { id: "3.2.2.3.2.3", type: "W", pos: "O", fix: "S-", graphic: "-L-", modifier: "HPFS--", desc_kor: "둑(경계)", desc_eng: "Fish,stakes" },
                                        { id: "3.2.2.3.2.4", type: "W", pos: "O", fix: "S-", graphic: "--A", modifier: "HPFF--", desc_kor: "둑(영역)", desc_eng: "Fish,stakes/Traps/Weirs" }
                                    ]
                                },
                                {
                                    id: "3.2.2.3.3",
                                    type: "W",
                                    pos: "O",
                                    fix: "--",
                                    graphic: "---",
                                    modifier: "HPM---",
                                    desc_kor: "항만시설",
                                    desc_eng: "Facilities",
                                    children: [
                                        { id: "3.2.2.3.3.1", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HPMD--", desc_kor: "건선거", desc_eng: "Drydock" },
                                        { id: "3.2.2.3.3.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HPML--", desc_kor: "상륙장", desc_eng: "Landing,place" },
                                        { id: "3.2.2.3.3.3", type: "W", pos: "O", fix: "-D", graphic: "P--", modifier: "HPMO--", desc_kor: "연안 화물적재시설(위치)", desc_eng: "Offshore,loading,facility" },
                                        { id: "3.2.2.3.3.4", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HPMO--", desc_kor: "연안 화물적재시설(경계)", desc_eng: "Offshore,loading,facility" },
                                        { id: "3.2.2.3.3.5", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HPMO--", desc_kor: "연안 화물적재시설(영역)", desc_eng: "Offshore,loading,facility" },
                                        { id: "3.2.2.3.3.6", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HPMRA-", desc_kor: "경사로(수면)", desc_eng: "Ramp,(Above,water)" },
                                        { id: "3.2.2.3.3.7", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HPMRB-", desc_kor: "경사로(수중)", desc_eng: "Ramp,(Below,water)" },
                                        { id: "3.2.2.3.3.8", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HPM-R-", desc_kor: "상륙고리", desc_eng: "Landing,ring" },
                                        { id: "3.2.2.3.3.9", type: "W", pos: "O", fix: "S-", graphic: "-L-", modifier: "HPM-FC", desc_kor: "연락선", desc_eng: "Ferry,crossing" },
                                        { id: "3.2.2.3.3.10", type: "W", pos: "O", fix: "S-", graphic: "-L-", modifier: "HPM-CC", desc_kor: "연락선(케이블)", desc_eng: "Cable,ferry,crossing" },
                                        { id: "3.2.2.3.3.11", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HPD---", desc_kor: "돌고래", desc_eng: "Dolphin" }
                                    ]
                                },
                                {
                                    id: "3.2.2.3.4",
                                    type: "W",
                                    pos: "O",
                                    fix: "--",
                                    graphic: "---",
                                    modifier: "HPP---",
                                    desc_kor: "해안방제",
                                    desc_eng: "Shoreline,protection",
                                    children: [
                                        { id: "3.2.2.3.4.1", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HPSPA-", desc_kor: "방파제/제방/둑(수면)", desc_eng: "Breakwater/Groin/Jetty,(Above,water)" },
                                        { id: "3.2.2.3.4.2", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HPSPB-", desc_kor: "방파제/제방/둑(수중)", desc_eng: "Breakwater/Groin/Jetty,(Below,water)" },
                                        { id: "3.2.2.3.4.3", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HPSPS-", desc_kor: "방파제", desc_eng: "Seawall" }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "3.2.2.4",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "HA----",
                            desc_kor: "항로표지",
                            desc_eng: "Aids,to,navigation",
                            children: [
                                { id: "3.2.2.4.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HABA--", desc_kor: "신호등", desc_eng: "Beacon" },
                                { id: "3.2.2.4.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HABB--", desc_kor: "부표(기본)", desc_eng: "Buoy,default" },
                                { id: "3.2.2.4.3", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HABM--", desc_kor: "표시", desc_eng: "Marker" },
                                {
                                    id: "3.2.2.4.4",
                                    type: "W",
                                    pos: "O",
                                    fix: "S-",
                                    graphic: "---",
                                    modifier: "HABP--",
                                    desc_kor: "말뚝",
                                    desc_eng: "Perches/Stakes",
                                    children: [
                                        { id: "3.2.2.4.4.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HABP--", desc_kor: "말뚝(위치)", desc_eng: "Perches/Stakes" },
                                        { id: "3.2.2.4.4.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HABP--", desc_kor: "말뚝(지역)", desc_eng: "Perches/Stakes" }
                                    ]
                                },
                                { id: "3.2.2.4.5", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HAL---", desc_kor: "빛", desc_eng: "Light" },
                                { id: "3.2.2.4.6", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HALLA-", desc_kor: "유도선", desc_eng: "Leading,line" },
                                { id: "3.2.2.4.7", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HALV--", desc_kor: "등대선", desc_eng: "Light,vessel/Lightship" },
                                { id: "3.2.2.4.8", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HALH--", desc_kor: "등대", desc_eng: "Lighthouse" }
                            ]
                        },
                        {
                            id: "3.2.2.5",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "HH----",
                            desc_kor: "위험물/장애물",
                            desc_eng: "Dangers/Hazards",
                            children: [
                                { id: "3.2.2.5.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HHRS--", desc_kor: "암반(침수)", desc_eng: "Rock,submergered" },
                                { id: "3.2.2.5.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HHRA--", desc_kor: "암반(침세)", desc_eng: "Rock,awashed" },
                                { id: "3.2.2.5.3", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HHD---", desc_kor: "해저 위험물/장애물", desc_eng: "Underwater,danger/Hazard" },
                                {
                                    id: "3.2.2.5.4",
                                    type: "W",
                                    pos: "O",
                                    fix: "S-",
                                    graphic: "---",
                                    modifier: "HHDF--",
                                    desc_kor: "해저암초",
                                    desc_eng: "Foul,ground",
                                    children: [
                                        { id: "3.2.2.5.4.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HHDF--", desc_kor: "해저암초(위치)", desc_eng: "Foul,ground" },
                                        { id: "3.2.2.5.4.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HHDF--", desc_kor: "해저암초(지역)", desc_eng: "Foul,ground" }
                                    ]
                                },
                                {
                                    id: "3.2.2.5.5",
                                    type: "W",
                                    pos: "O",
                                    fix: "-D",
                                    graphic: "---",
                                    modifier: "HHDK--",
                                    desc_kor: "해초",
                                    desc_eng: "Kelp/Seaweed",
                                    children: [
                                        { id: "3.2.2.5.5.1", type: "W", pos: "O", fix: "-D", graphic: "P--", modifier: "HHDK--", desc_kor: "해초(위치)", desc_eng: "Kelp/Seaweed" },
                                        { id: "3.2.2.5.5.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HHDK--", desc_kor: "해초(지역)", desc_eng: "Kelp/Seaweed" }
                                    ]
                                },
                                {
                                    id: "3.2.2.5.6",
                                    type: "W",
                                    pos: "O",
                                    fix: "S-",
                                    graphic: "---",
                                    modifier: "HHDMD-",
                                    desc_kor: "기뢰",
                                    desc_eng: "Mine-naval",
                                    children: [
                                        { id: "3.2.2.5.6.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HHDMDB", desc_kor: "기뢰(의심)", desc_eng: "Mine-naval,(Doubtful)" },
                                        { id: "3.2.2.5.6.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HHDMDF", desc_kor: "기뢰(명확)", desc_eng: "Mine-naval,(Definite)" }
                                    ]
                                },
                                { id: "3.2.2.5.7", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HHDS--", desc_kor: "암초", desc_eng: "Snags/Stumps" },
                                {
                                    id: "3.2.2.5.8",
                                    type: "W",
                                    pos: "O",
                                    fix: "S-",
                                    graphic: "---",
                                    modifier: "HHDWA-",
                                    desc_kor: "난파선",
                                    desc_eng: "Wreck",
                                    children: [
                                        { id: "3.2.2.5.8.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HHDWA-", desc_kor: "난파선(돌출)", desc_eng: "Wreck,(Uncovers)" },
                                        { id: "3.2.2.5.8.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HHDWB-", desc_kor: "난파선(침수)", desc_eng: "Wreck,(Submerged)" }
                                    ]
                                },
                                { id: "3.2.2.5.9", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "HHDB--", desc_kor: "쇄파", desc_eng: "Breakers" },
                                { id: "3.2.2.5.10", type: "W", pos: "O", fix: "S-", graphic: "-L-", modifier: "HHDR--", desc_kor: "암초", desc_eng: "Reef" },
                                { id: "3.2.2.5.11", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "HHDE--", desc_kor: "회오리/단조/격조", desc_eng: "Eddies/Overfalls/Tide,rips" },
                                { id: "3.2.2.5.12", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "HHDD--", desc_kor: "적조", desc_eng: "Discolored,water" }
                            ]
                        },
                        {
                            id: "3.2.2.6",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "BF----",
                            desc_kor: "해저지형",
                            desc_eng: "Bottom,features",
                            children: [{
                                    id: "3.2.2.6.1",
                                    type: "W",
                                    pos: "O",
                                    fix: "S-",
                                    graphic: "---",
                                    modifier: "BFC---",
                                    desc_kor: "해저지형 특성",
                                    desc_eng: "Bottom,characteristics",
                                    children: [
                                        { id: "3.2.2.6.1.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFC-S-", desc_kor: "모래", desc_eng: "Sand" },
                                        { id: "3.2.2.6.1.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFC-M-", desc_kor: "진흙", desc_eng: "Mud" },
                                        { id: "3.2.2.6.1.3", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFC-CL", desc_kor: "점토", desc_eng: "Clay" },
                                        { id: "3.2.2.6.1.4", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFC-SI", desc_kor: "유사", desc_eng: "Silt" },
                                        { id: "3.2.2.6.1.5", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFC-ST", desc_kor: "돌", desc_eng: "Stones" },
                                        { id: "3.2.2.6.1.6", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFC-G-", desc_kor: "자갈자", desc_eng: "Gravel" },
                                        { id: "3.2.2.6.1.7", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFC-P-", desc_kor: "조약돌", desc_eng: "Pebbles" },
                                        { id: "3.2.2.6.1.8", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFC-CB", desc_kor: "굵은 자갈", desc_eng: "Cobbles" },
                                        { id: "3.2.2.6.1.9", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFC-R-", desc_kor: "바위", desc_eng: "Rock" },
                                        { id: "3.2.2.6.1.10", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFC-CO", desc_kor: "산호", desc_eng: "Coral" },
                                        { id: "3.2.2.6.1.11", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFC-SH", desc_kor: "패각", desc_eng: "Shell" }
                                    ]
                                },
                                {
                                    id: "3.2.2.6.2",
                                    type: "W",
                                    pos: "O",
                                    fix: "S-",
                                    graphic: "---",
                                    modifier: "BFQ---",
                                    desc_kor: "해저상태",
                                    desc_eng: "Qualifying,terms",
                                    children: [
                                        { id: "3.2.2.6.2.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFQ-F-", desc_kor: "좋음", desc_eng: "Fine" },
                                        { id: "3.2.2.6.2.2", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFQ-M-", desc_kor: "보통", desc_eng: "Medium" },
                                        { id: "3.2.2.6.2.3", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "BFQ-C-", desc_kor: "거친", desc_eng: "Coarse" }
                                    ]
                                }
                            ]
                        },
                        {
                            id: "3.2.2.7",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "TCC---",
                            desc_kor: "조류",
                            desc_eng: "Tide,and,current",
                            children: [
                                { id: "3.2.2.7.1", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "TCCW--", desc_kor: "난류", desc_eng: "Water,turbulence" },
                                { id: "3.2.2.7.2", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "TCCCFE", desc_kor: "조류방향(간조)", desc_eng: "Current,flow,-,Ebb" },
                                { id: "3.2.2.7.3", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "TCCCFF", desc_kor: "조류방향(만조)", desc_eng: "Current,flow,-,Flood" },
                                { id: "3.2.2.7.4", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "TCCTD-", desc_kor: "조류 자료수집점", desc_eng: "Tide,data,point" },
                                { id: "3.2.2.7.5", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "TCCTG-", desc_kor: "검조기", desc_eng: "Tide,gauge" }
                            ]
                        }
                    ]
                },
                {
                    id: "3.2.3",
                    type: "W",
                    pos: "O",
                    fix: "--",
                    graphic: "---",
                    modifier: "O-----",
                    desc_kor: "해양",
                    desc_eng: "Oceanography",
                    children: [{
                            id: "3.2.3.1",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "OB----",
                            desc_kor: "생물발광",
                            desc_eng: "Bioluminescence",
                            children: [
                                { id: "3.2.3.1.1", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "OBVA--", desc_kor: "VDR 레벨 1~2", desc_eng: "VDR,level,1-2" },
                                { id: "3.2.3.1.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "OBVB--", desc_kor: "VDR 레벨 2~3", desc_eng: "VDR,level,2-3" },
                                { id: "3.2.3.1.3", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "OBVC--", desc_kor: "VDR 레벨 3~4", desc_eng: "VDR,level,3-4" },
                                { id: "3.2.3.1.4", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "OBVD--", desc_kor: "VDR 레벨 4~5", desc_eng: "VDR,level,4-5" },
                                { id: "3.2.3.1.5", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "OBVE--", desc_kor: "VDR 레벨 5~6", desc_eng: "VDR,level,5-6" },
                                { id: "3.2.3.1.6", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "OBVF--", desc_kor: "VDR 레벨 6~7", desc_eng: "VDR,level,6-7" },
                                { id: "3.2.3.1.7", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "OBVG--", desc_kor: "VDR 레벨 7~8", desc_eng: "VDR,level,7-8" },
                                { id: "3.2.3.1.8", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "OBVH--", desc_kor: "VDR 레벨 8~9", desc_eng: "VDR,level,8-9" },
                                { id: "3.2.3.1.9", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "OBVI--", desc_kor: "VDR 레벨 9~10", desc_eng: "VDR,level,9-10" }
                            ]
                        },
                        {
                            id: "3.2.3.2",
                            type: "W",
                            pos: "O",
                            fix: "--",
                            graphic: "---",
                            modifier: "BS----",
                            desc_kor: "해안경사",
                            desc_eng: "Beach,slope",
                            children: [
                                { id: "3.2.3.2.1", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "BSF---", desc_kor: "평지", desc_eng: "Flat" },
                                { id: "3.2.3.2.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "BSG---", desc_kor: "완만한", desc_eng: "Gentle" },
                                { id: "3.2.3.2.3", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "BSM---", desc_kor: "적당한", desc_eng: "Moderate" },
                                { id: "3.2.3.2.4", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "BST---", desc_kor: "가파른가", desc_eng: "Steep" }
                            ]
                        }
                    ]
                },
                {
                    id: "3.2.4",
                    type: "W",
                    pos: "O",
                    fix: "--",
                    graphic: "---",
                    modifier: "G-----",
                    desc_kor: "지구물리/음향",
                    desc_eng: "Geophysics/Acoustics",
                    children: [{
                        id: "3.2.4.1",
                        type: "W",
                        pos: "O",
                        fix: "--",
                        graphic: "---",
                        modifier: "GM----",
                        desc_kor: "기뢰전 해저 설명",
                        desc_eng: "Mine,warfare,bottom,descriptors",
                        children: [{
                                id: "3.2.4.1.1",
                                type: "W",
                                pos: "O",
                                fix: "--",
                                graphic: "---",
                                modifier: "GMS---",
                                desc_kor: "기뢰전 해저 침전물",
                                desc_eng: "Miw-bottom,sediments",
                                children: [
                                    { id: "3.2.4.1.1.1", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMSR--", desc_kor: "암석", desc_eng: "Solid,rock" },
                                    { id: "3.2.4.1.1.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMSC--", desc_kor: "점토", desc_eng: "Clay" },
                                    { id: "3.2.4.1.1.3", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMSSVS", desc_kor: "극조사", desc_eng: "Very,coarse,sand" },
                                    { id: "3.2.4.1.1.4", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMSSC-", desc_kor: "조사조", desc_eng: "Coarse,sand" },
                                    { id: "3.2.4.1.1.5", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMSSM-", desc_kor: "중사", desc_eng: "Medium,sand" },
                                    { id: "3.2.4.1.1.6", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMSSF-", desc_kor: "세사", desc_eng: "Fine,sand" },
                                    { id: "3.2.4.1.1.7", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMSSVF", desc_kor: "미세사미", desc_eng: "Very,fine,sand" },
                                    { id: "3.2.4.1.1.8", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMSIVF", desc_kor: "미세사립실트", desc_eng: "Very,fine,silt" },
                                    { id: "3.2.4.1.1.9", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMSIF-", desc_kor: "세립실트", desc_eng: "Fine,silt" },
                                    { id: "3.2.4.1.1.10", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMSIM-", desc_kor: "중립실트", desc_eng: "Medium,silt" },
                                    { id: "3.2.4.1.1.11", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMSIC-", desc_kor: "조립실트", desc_eng: "Coarse,silt" },
                                    { id: "3.2.4.1.1.12", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMSB--", desc_kor: "옥석", desc_eng: "Boulders" },
                                    { id: "3.2.4.1.1.13", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMS-CO", desc_kor: "조약돌,패분", desc_eng: "Cobbles,,oyster,shells" },
                                    { id: "3.2.4.1.1.14", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMS-PH", desc_kor: "자갈,패각", desc_eng: "Pebbles,,shells" },
                                    { id: "3.2.4.1.1.15", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMS-SH", desc_kor: "모래,패각", desc_eng: "Sand,and,shells" },
                                    { id: "3.2.4.1.1.16", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GML---", desc_kor: "육지", desc_eng: "Land" },
                                    { id: "3.2.4.1.1.17", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMN---", desc_kor: "자료없음", desc_eng: "No,data" }
                                ]
                            },
                            {
                                id: "3.2.4.1.2",
                                type: "W",
                                pos: "O",
                                fix: "--",
                                graphic: "---",
                                modifier: "GMR---",
                                desc_kor: "해저 거칠기",
                                desc_eng: "Bottom,roughness",
                                children: [
                                    { id: "3.2.4.1.2.1", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMRS--", desc_kor: "평탄", desc_eng: "Smooth" },
                                    { id: "3.2.4.1.2.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMRM--", desc_kor: "보통", desc_eng: "Moderate" },
                                    { id: "3.2.4.1.2.3", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMRR--", desc_kor: "거친", desc_eng: "Rough" }
                                ]
                            },
                            {
                                id: "3.2.4.1.3",
                                type: "W",
                                pos: "O",
                                fix: "--",
                                graphic: "---",
                                modifier: "GMC---",
                                desc_kor: "바닥쓰레기",
                                desc_eng: "Clutter,(Bottom)",
                                children: [
                                    { id: "3.2.4.1.3.1", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMCL--", desc_kor: "적음", desc_eng: "Low" },
                                    { id: "3.2.4.1.3.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMCM--", desc_kor: "보통", desc_eng: "Medium" },
                                    { id: "3.2.4.1.3.3", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMCH--", desc_kor: "많음", desc_eng: "High" }
                                ]
                            },
                            {
                                id: "3.2.4.1.4",
                                type: "W",
                                pos: "O",
                                fix: "--",
                                graphic: "---",
                                modifier: "GMIB--",
                                desc_kor: "침전물 충돌가능성",
                                desc_eng: "Impact,burial",
                                children: [
                                    { id: "3.2.4.1.4.1", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMIBA-", desc_kor: "0%", desc_eng: "0%" },
                                    { id: "3.2.4.1.4.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMIBB-", desc_kor: "0-10%", desc_eng: "0-10%" },
                                    { id: "3.2.4.1.4.3", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMIBC-", desc_kor: "10-20%", desc_eng: "10-20%" },
                                    { id: "3.2.4.1.4.4", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMIBD-", desc_kor: "20-75%", desc_eng: "20-75%" },
                                    { id: "3.2.4.1.4.5", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMIBE-", desc_kor: ">75%", desc_eng: ">75%" }
                                ]
                            },
                            {
                                id: "3.2.4.1.5",
                                type: "W",
                                pos: "O",
                                fix: "--",
                                graphic: "---",
                                modifier: "GMBC--",
                                desc_kor: "대기뢰전 해저 범주",
                                desc_eng: "MIW,bottom,category",
                                children: [
                                    { id: "3.2.4.1.5.1", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMBCA-", desc_kor: "A", desc_eng: "A" },
                                    { id: "3.2.4.1.5.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMBCB-", desc_kor: "B", desc_eng: "B" },
                                    { id: "3.2.4.1.5.3", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMBCC-", desc_kor: "C", desc_eng: "C" }
                                ]
                            },
                            {
                                id: "3.2.4.1.6",
                                type: "W",
                                pos: "O",
                                fix: "--",
                                graphic: "---",
                                modifier: "GMBT--",
                                desc_kor: "대기뢰전 해저 유형",
                                desc_eng: "MIW,bottom,type",
                                children: [
                                    { id: "3.2.4.1.6.1", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMBTA-", desc_kor: "A1", desc_eng: "A1" },
                                    { id: "3.2.4.1.6.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMBTB-", desc_kor: "A2", desc_eng: "A2" },
                                    { id: "3.2.4.1.6.3", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMBTC-", desc_kor: "A3", desc_eng: "A3" },
                                    { id: "3.2.4.1.6.4", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMBTD-", desc_kor: "B1", desc_eng: "B1" },
                                    { id: "3.2.4.1.6.5", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMBTE-", desc_kor: "B2", desc_eng: "B2" },
                                    { id: "3.2.4.1.6.6", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMBTF-", desc_kor: "B3", desc_eng: "B3" },
                                    { id: "3.2.4.1.6.7", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMBTG-", desc_kor: "C1", desc_eng: "C1" },
                                    { id: "3.2.4.1.6.8", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMBTH-", desc_kor: "C2", desc_eng: "C2" },
                                    { id: "3.2.4.1.6.9", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "GMBTI-", desc_kor: "C3", desc_eng: "C3" }
                                ]
                            }
                        ]
                    }]
                },
                {
                    id: "3.2.5",
                    type: "W",
                    pos: "O",
                    fix: "--",
                    graphic: "---",
                    modifier: "L-----",
                    desc_kor: "제한",
                    desc_eng: "Limits",
                    children: [
                        { id: "3.2.5.1", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "L-ML--", desc_kor: "해상제한경계", desc_eng: "Maritime,limit,boundary" },
                        { id: "3.2.5.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "L-MA--", desc_kor: "연안지역", desc_eng: "Maritime,area" },
                        { id: "3.2.5.3", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "L-RA--", desc_kor: "제한지역(경계)", desc_eng: "Restricted,area" },
                        { id: "3.2.5.4", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "L-SA--", desc_kor: "피해지역", desc_eng: "Swept,area" },
                        { id: "3.2.5.5", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "L-TA--", desc_kor: "훈련지역", desc_eng: "Training,area" },
                        { id: "3.2.5.6", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "L-O---", desc_kor: "임의지정지역", desc_eng: "Operator-defined" }
                    ]
                },
                {
                    id: "3.2.6",
                    type: "W",
                    pos: "O",
                    fix: "--",
                    graphic: "---",
                    modifier: "M-----",
                    desc_kor: "인공구조물",
                    desc_eng: "Man-made,structures",
                    children: [
                        { id: "3.2.6.1", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "MCA---", desc_kor: "해저케이블", desc_eng: "Submarine,cable" },
                        { id: "3.2.6.2", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "MCC---", desc_kor: "해저시설물", desc_eng: "Submerged,crib" },
                        { id: "3.2.6.3", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "MCD---", desc_kor: "운하", desc_eng: "Canal" },
                        { id: "3.2.6.4", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "MF----", desc_kor: "여울", desc_eng: "Ford" },
                        { id: "3.2.6.5", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "ML----", desc_kor: "갑문", desc_eng: "Lock" },
                        { id: "3.2.6.6", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "MOA---", desc_kor: "석유/가스 굴착장치(위치)", desc_eng: "Oil/Gas,rig" },
                        { id: "3.2.6.7", type: "W", pos: "O", fix: "-D", graphic: "--A", modifier: "MOA---", desc_kor: "석유/가스 굴착장치(지역)", desc_eng: "Oil/Gas,rig,field" },
                        { id: "3.2.6.8", type: "W", pos: "O", fix: "-D", graphic: "-L-", modifier: "MPA---", desc_kor: "송유관", desc_eng: "Pipelines/Pipe" },
                        { id: "3.2.6.9", type: "W", pos: "O", fix: "S-", graphic: "P--", modifier: "MPA---", desc_kor: "말뚝/기둥", desc_eng: "Pile/Piling/Post" }
                    ]
                }
            ]
        },
        { id: "3.3", type: "W", pos: "S", fix: "--", graphic: "---", modifier: "------", desc_kor: "우주", desc_eng: "Space" }
    ]
}];



module.exports = {
    code: "W",
    pos: position_Weather,
    fix: fix_Weather,
    graphic: graphic_Weather,
    identifier: functionIdentifier_Weather
};
},{}]},{},[1]);
