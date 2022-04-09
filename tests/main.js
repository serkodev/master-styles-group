import "@master/style";
import "@master/styles";

import "../src/index.ts";

var fsize = 13;
function increaseSize(e) {
    e.classList.remove("{font:" + fsize + "}@xm");
    fsize++;
    e.classList.add("{font:" + fsize + "}@xm");
}

function appendDummy() {
    var t = document.querySelector("#dummy");
    var clone = t.content.cloneNode(true);
    document.body.appendChild(clone);
}

// export
global.increaseSize = increaseSize;
global.appendDummy = appendDummy;
