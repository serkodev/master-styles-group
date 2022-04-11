import Lexer from "./lexer";

export type atResult = {
    selector: string,
    at: string, // need put at the end
}

class SelectorLexer extends Lexer {
    lex(): atResult | undefined {
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
                        at: this.src.substring(this.pos),
                    };
                default:
                    this.pos++;
            }
        }
    }
}

export function lexSelector(src: string): atResult {
    if (src[0] == "@") {
        return { selector: "", at: src};
    } else if (!src.includes("@")) {
        return { selector: src, at: ""};
    }
    const l = new SelectorLexer(src);
    return l.lex() || { selector: src, at: ""};
}

export function lexStyle(src: string): { style: string, at: string } {
    if (src[0] == "@" || !src.includes("@")) { // animation
        return { style: src, at: "" };
    }

    const l = new SelectorLexer(src).lex();
    return l ? { style: l.selector, at: l.at } : { style: src, at: "" };
}
