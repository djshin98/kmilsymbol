const fs = require('fs');
const readline = require('readline');

async function processLineByLine(fd) {
    const fileStream = fs.createReadStream('./milsymbol/res/terms.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    var buffer = "";
    var position = 0;
    for await (const line of rl) {
        let txt = line;
        txt = txt.trim();
        if (txt.length > 0) {
            let ifirstFind = txt.indexOf(' ');
            if (ifirstFind > 0 && txt.substring(0, ifirstFind).split("").every(d => { return (d >= "A" && d <= "Z") ? true : false; })) {
                if (buffer.length > 0) {
                    let w = new Buffer("<td>" + buffer + "</td></tr>");
                    fs.write(fd, w, 0, w.length, null, (err, writtenBytes, b) => {
                        //console.log(`Wrote ${writtenBytes} bytes to file`);
                    });
                    position += w.length;
                }
                buffer = "";
                let key = txt.substring(0, ifirstFind);
                let desc = txt.substring(ifirstFind + 1);
                let w = new Buffer("<tr><td>" + key + "</td>");

                fs.write(fd, w, 0, w.length, null, (err, writtenBytes, b) => {
                    //console.log(`Wrote ${writtenBytes} bytes to file`);
                });
                buffer += desc;
            } else {

                buffer += "<br/>" + txt;
                console.log(buffer);
            }
        }
    }
}

fs.open("./milsymbol/res/terms-out.txt", 'w', (err, fd) => {
    processLineByLine(fd);
});