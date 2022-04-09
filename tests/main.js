import "@master/style";
import "@master/styles";

import "../src/index.ts";

var fsize = 14;
function increaseSize(e) {
    if (e.classList.contains("{font:" + fsize + ";_f:blue}@xm")) {
        e.classList.replace(
            "{font:" + fsize++ + ";_f:blue}@xm",
            "{font:" + fsize + ";_f:blue}@xm"
        );
    } else {
        e.classList.add("{font:" + fsize + ";_f:blue}@xm");
    }
}

function appendDummy() {
    var t = document.querySelector("#dummy");
    var clone = t.content.cloneNode(true);
    document.body.appendChild(clone);
}

// export
global.increaseSize = increaseSize;
global.appendDummy = appendDummy;
