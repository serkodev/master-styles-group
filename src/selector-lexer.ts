import Lexer from "./lexer";

export type LexSuffix = {
    selector: string,
    atSelector: string, // need put at the end
}

class SelectorLexer extends Lexer {
    lex(): LexSuffix | undefined {
        // contains @ selector but not at the start
        while (this.pos < this.len) {
            switch (this.findNext(["'", "@"])) {
                case "'":
                    this.pos++;
                    this.parseString();
                    this.pos++;
                    break;
                case "@":
                    return {
                        selector: this.src.substring(0, this.pos),
                        atSelector: this.src.substring(this.pos),
                    };
                default:
                    this.pos++;
            }
        }
    }
}

function lex(src: string): LexSuffix {
    if (src[0] == "@") {
        return { selector: "", atSelector: src};
    } else if (!src.includes("@")) {
        return { selector: src, atSelector: ""};
    }
    const l = new SelectorLexer(src);
    return l.lex() || { selector: src, atSelector: ""};
}

export default lex;
