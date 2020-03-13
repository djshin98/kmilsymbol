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
        this.stairs = 0;
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
    find(id){
        let findObj;
        if( this.id == id ) findObj= this;
        else if( this.id.indexOf(id) == 0 && this.children ){
            this.children.some((d)=>{
                let findObj = d.find(id);
                return findObj ? true : false;
            });
        }
        return findObj;
    }
    append(m) {
        m.stairs = this.stairs+1;
        this.children.push(m);
    }
    save(fd) {
        this.write(fd,this.preString());
        if (this.children && this.children.length > 0) {
            this.children.forEach(d=>{
                d.save(fd);
            })
        }
        this.write(fd,this.postString());
    }
    preString(){
        return '\t'.repeat(this.stairs) + '{ id:"' + this.id + '", type:"' + this.codeType +
            '", affiliation:"' + this.affiliation +
            '", battlefield:"' + this.battlefield +
            '", status:"' + this.status +
            '", modifier:"' + this.modifier +
            '", desc:"' + this.desc +'"';
    }
    postString(){
        return '}';
    }
    toString() {
        if (this.children && this.children.length > 0) {
            this.children.reduce((prev, curr) => {})
        }
        return this.preString() + this.postString();
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
    find(id){
        let findObj;
        this.rootModifier.some((d)=>{
            findObj = d.find(id);
            return ( findObj ) ? true : false;
        });
        return findObj;
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
                let parent = find(m.parendId);
                if (parent) {
                    parent.append(m);
                } else {
                    console.log("error: not found parent :" + m.toString());
                }
            }
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
    const fileStream = fs.createReadStream('./kmilsymbol/res/modifier.1.txt');

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

fs.open("./kmilsymbol/res/modifier.3.txt", 'w', (err, fd) => {
    var s = new Modifier(fd);
    processLineByLine(s);

});