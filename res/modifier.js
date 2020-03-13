const fs = require('fs');
const readline = require('readline');

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
        this.txt = txt;
        this.parentId;
        this.id;
        this.codeType;
        this.affiliation;
        this.battlefield;
        this.status;
        this.modifier;
        this.desc;
        this.children;
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
        this.desc = fields.splice(6).reduce((prev, curr) => {
            return prev + " " + curr;
        });
    }
    isRoot() {
        return this.parendId ? false : true;
    }
    append(m) {
        this.children.push(m);
    }
    save(fd) {
        if (this.children && this.children.length > 0) {
            this.children.forEach
        }

        let post = '" }';
    }
    toString() {
        if (this.children && this.children.length > 0) {
            this.children.reduce((prev, curr) => {})
        }
        return '{ id:"' + this.id + '", type:"' + this.codeType +
            '", affiliation:"' + this.affiliation +
            '", battlefield:"' + this.battlefield +
            '", status:"' + this.status +
            '", modifier:"' + this.modifier +
            '", desc:"' + this.desc +

            '" }';
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
    endRead() {
        if (this.cachedBuffer.length > 0) {
            this.hashCodes.push(this.cachedBuffer);
        }
        this.hashCodes.forEach((d) => {
            let m = new ModifierItem(d);
            if (m.isRoot()) {
                this.rootModifier.push(m);
            } else {
                let parent = findParent(m.parendId);
                if (parent) {
                    parent.append(m);
                } else {
                    console.log("error: not found parent :" + m.toString());
                }
            }
            console.log(m.toString());

        });
    }
    save() {
        if (this.rootModifier) {
            this.rootModifier.save(this.fd);
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
    const fileStream = fs.createReadStream('./milsymbol/res/modifier.1.txt');

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

fs.open("./milsymbol/res/modifier.3.txt", 'w', (err, fd) => {
    var s = new Modifier(fd);
    processLineByLine(s);

});