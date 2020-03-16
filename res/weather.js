const fs = require('fs');
const readline = require('readline');

function isAlphaX(s) {
    return s.split("").every(d => {
        return (d >= " " && d <= "z") ? true : false;
    });
}
class Writable {
    constructor() {

    }
    write(fd, str) {
        let buf = Buffer.from(str);
        fs.write(fd, buf, 0, buf.length, null, (err, writtenBytes, b) => {
            //console.log(`Wrote ${writtenBytes} bytes to file`);
        });
    }
}
class ModifierItem extends Writable {
    constructor(txt) {
        super();
        this.stairs = 1;
        this.txt = txt;
        this.parentId;
        this.id;
        this.codeType;
        this.affiliation;
        this.battlefield;
        this.status;
        this.modifier;
        this.echelon;
        this.desc;
        this.children = [];
        this.parse();

    }
    parse() {
        let fields = this.txt.split(" ");
        this.id = fields[0];
        if (this.id.indexOf(".") > 0) {
            this.parendId = this.id.substring(0, this.id.lastIndexOf("."));
        }
        this.codeType = fields[1];
        this.affiliation = fields[2];
        this.battlefield = fields[3];
        this.status = fields[4];
        this.modifier = fields[5];
        this.echelon = fields[6];
        let desc = fields.splice(9);
        //desc.forEach();
        let engIndex = 0;
        this.desc_kor = desc.reduce((prev, curr, i) => {
            if (engIndex > 0 || (i != 0 && isAlphaX(curr))) {
                if (engIndex == 0) engIndex += i;
                return prev;
            }
            return (prev.length > 0) ? (prev + " " + curr) : curr;
        }, "");
        this.desc_eng = desc.splice(engIndex);
    }
    isRoot() {
        return this.parendId ? false : true;
    }
    find(id) {
        let findObj;
        //console.log( this.tab() + " searching " + this.id );
        if (this.id == id) {
            //console.log( this.tab() + id + " : finded to " + this.id );
            findObj = this;
        } else if (id.indexOf(this.id) == 0 && this.children) {
            this.children.some((d) => {
                findObj = d.find(id);
                return findObj ? true : false;
            });
        }
        return findObj;
    }
    append(m) {
        m.stairs = this.stairs + 1;
        this.children.push(m);
    }
    save(fd) {
        this.write(fd, this.preString());
        if (this.children && this.children.length > 0) {
            this.write(fd, ",\n" + this.tab() + "\tchildren : [\n");
            this.children.forEach((d, i) => {
                d.save(fd);
                if (this.children.length - 1 == i) {
                    this.write(fd, "\n");
                } else {
                    this.write(fd, ",\n");
                }
            });
            this.write(fd, this.tab() + "\t]\n");
        }
        this.write(fd, this.postString());
    }
    tab() {
        return '\t'.repeat(this.stairs);
    }
    preString() {
        return this.tab() + '{ id:"' + this.id + '", type:"' + this.codeType +
            '", affiliation:"' + this.affiliation +
            '", battlefield:"' + this.battlefield +
            '", status:"' + this.status +
            '", modifier:"' + this.modifier +
            '", desc_kor:"' + this.desc_kor +
            '", desc_eng:"' + this.desc_eng + '"';
    }
    postString() {
        if (this.children && this.children.length > 0) {
            return this.tab() + '}';
        }
        return '}';
    }
    toString() {
        var buffer = this.preString();
        if (this.children && this.children.length > 0) {
            buffer += ",\n" + this.tab() + "\tchildren : [\n";
            this.children.forEach((d, i) => {
                buffer += d.toString();
                if (this.children.length - 1 == i) {
                    buffer += "\n";
                } else {
                    buffer += ",\n";
                }
            });
            buffer += "\t" + this.tab() + "]\n";
        }
        buffer += this.postString();
        return buffer;
    }
}
class Modifier extends Writable {
    constructor(fd) {
        super();
        this.fd = fd;
        this.hashCodes = [];
        this.rootModifier = [];
        this.cachedBuffer = "";
    }
    createCode(txt) {
        if (this.cachedBuffer.length > 0) {
            this.hashCodes.push(this.cachedBuffer);
        }
        this.cachedBuffer = txt;
    }
    appendCode(txt) {
        this.cachedBuffer += " " + txt;
    }
    find(id) {
        let findObj;
        this.rootModifier.some((d) => {
            findObj = d.find(id);
            return (findObj) ? true : false;
        });
        return findObj;
    }
    endRead() {
        if (this.cachedBuffer.length > 0) {
            this.hashCodes.push(this.cachedBuffer);
        }
        this.hashCodes.sort((a, b) => {
            return 1;
        })
        this.hashCodes.forEach((d) => {
            let m = new ModifierItem(d);
            if (m.isRoot()) {
                this.rootModifier.push(m);
            } else {
                console.log(m.id + " : finding parent ");
                let parent = this.find(m.parendId);
                if (parent) {
                    parent.append(m);
                } else {
                    console.err("error: not found parent :" + m.toString());
                }
            }
        });
    }
    save() {
        if (this.rootModifier) {
            this.write("var modifier = [\n");
            this.rootModifier.forEach((d, i) => {
                let str = d.toString();
                this.write(str);
                if (this.rootModifier.length - 1 == i) {
                    this.write("\n");
                } else {
                    this.write(",\n");
                }
            })
            this.write("];\n");
        } else {
            this.hashCodes.forEach(d => {
                this.write(d + "\n");
            });
        }

    }
    write(str) {
        super.write(this.fd, str);
    }
}
async function processLineByLine(parser) {
    const fileStream = fs.createReadStream('./kmilsymbol/res/weather.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        let txt = line;
        txt = txt.trim();
        if (txt.length > 0) {
            let txts = txt.split(" ");
            if (txts[0].split("").every(d => { return ((d >= '0' && d <= '9') || d == ".") ? true : false; })) {
                parser.createCode(txt);
            } else {
                parser.appendCode(txt);
            }
        }
    }
    parser.endRead();
    parser.save();
}

fs.open("./kmilsymbol/res/weather.1.txt", 'w', (err, fd) => {
    var s = new Modifier(fd);
    processLineByLine(s);

});