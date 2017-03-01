
function createImageView(ops){
    var url = ops.image;

    delete ops.image;
    var imgv = Ti.UI.createImageView(ops);
    download(url, imgv);
    return imgv;
}

function download(url, imgv){

    var filename = Ti.Utils.md5HexDigest(url);
    var tempfile = getTempFile(filename);

    if (tempfile){
        imgv.image = tempfile;
        return;
    }

    var xhr = Titanium.Network.createHTTPClient({
        onload: function() {
            imgv.image = storeTempFile(filename, this.responseData);

        },
        timeout: 30000
    });
    xhr.open('GET', url);

    /* insert token below and uncomment this section
     var authstr = 'Bearer ' + oAuthToken;
     xhr.setRequestHeader('Authorization', authstr);
    */

    xhr.send();
}

function storeTempFile(filename, blob){
    var f = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, filename);
    f.write(blob);
    return getTempFile(filename);
}


function getTempFile(filename){
    var f = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, filename);
    if (f.isFile()){
        console.log('returning ', f.nativePath);
        return f.read();
    }
    return false;
}

exports.createImageView = createImageView;
