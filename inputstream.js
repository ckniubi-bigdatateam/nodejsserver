var fs = require('fs'),
    bite_size = 256,
    readbytes = 0,
    file;

fs.open('input.txt', 'r', function(err, fd) { file = fd; readsome(); });

function readsome() {
    var stats = fs.fstatSync(file);
    if(stats.size<readbytes+1) {
        setTimeout(readsome, 500);
    }
    else {
        fs.read(file, new Buffer(bite_size), 0, bite_size, readbytes, processsome);
    }
}

function processsome(err, bytecount, buff) {

    // Here we will process our incoming data:
    // Do whatever you need. Just be careful about not using beyond the bytecount in buff.
    console.log(buff.toString('utf-8', 0, bytecount));

    // So we continue reading from where we left:
    readbytes+=bytecount;
    process.nextTick(readsome);
}