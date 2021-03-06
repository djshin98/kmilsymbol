const fs = require('fs');
const readline = require('readline');

class Modifier {
    constructor(fd) {
        this.fd = fd;
        this.group = "";
        this.code = "";
        this.buffer = "";
        this.write("{\n");
        this.hashCodes = [];
    }
    currentGroup() {
        return this.group;
    }
    end() {
        if (this.group.length > 0) {
            if (this.code.length > 0) {
                this.write(this.buffer + '"}');

            }
            this.write("\n\t]");
        }
        this.write("\n}\n");
        this.group = "";
        this.code = "";
        this.buffer = "";
    }
    startGroup(grp) {
        if (this.group.length > 0) {
            this.write(this.buffer + '"}');
            this.write("\n\t],\n");
        }
        this.group = grp;
        this.write('"' + this.group + '" : [\n');
        this.code = "";
        this.buffer = "";
    }
    startCode(code) {
        if (this.code.length > 0) {
            this.appendDesc('"},\n');
            //let str = this.buffer + '"},\n';
            this.write(this.buffer);
            this.buffer = "";
        }
        this.code = code;
        this.hashCodes.push(this.code);
        this.write('\t\t{code:"' + this.code + '", desc:"');
        this.buffer = "";
    }
    appendDesc(desc) {
        this.buffer += " " + desc;
    }
    hasCode(code) {
        if (this.hashCodes.indexOf(code) >= 0) {
            return true;
        }
        return false;
    }
    write(str) {
        let buf = Buffer.from(str);
        //  buf.write(str);
        fs.write(this.fd, buf, 0, buf.length, null, (err, writtenBytes, b) => {
            //console.log(`Wrote ${writtenBytes} bytes to file`);
        });

    }

}
var skiptxt = "군대부호 표준 부록 A MND-STD-2525C";
async function processLineByLine(parser) {
    const fileStream = fs.createReadStream('./milsymbol/res/modifier.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        let txt = line;
        txt = txt.trim();
        if (txt.length > 0 && txt != skiptxt && txt.indexOf("A-") != 0) {
            parser.write(txt);
            parser.write("\n");
        }
    }
    parser.end();
}

fs.open("./milsymbol/res/modifier.1.txt", 'w', (err, fd) => {
    var s = new Modifier(fd);
    processLineByLine(s);

});