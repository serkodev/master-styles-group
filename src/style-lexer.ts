import Lexer from "./lexer";

export type LexResult = { styles: (string|LexResult)[], selector: string }

class StyleLexer extends Lexer {
    lex() : LexResult | undefined {
        let rootSelector = "";

        const parseAfterSelector = () => {
            while (this.pos < this.len) {
                switch (this.findNext(["'", ";", "}"])) {
                    case "'": // string
                        this.pos++;
                        this.parseString();
                        break;
                    case ";": // next
                    case "}": // end group
                        return;
                }
                this.pos++;
            }
        };

        // check is front-selector
        if (this.src[0] != "{" && this.src[this.len-1] == "}") {
            const parseFrontSelector = () => {
                while (this.pos < this.len) {
                    switch (this.findNext(["'", "{"])) {
                        case "'": // string
                            this.pos++;
                            this.parseString();
                            break;
                        case "{":
                            rootSelector = this.src.substring(0, this.pos);
                            return true;
                    }
                    this.pos++;
                }
                return false;
            };
            if (!parseFrontSelector()) return;
        }

        // start
        this.pos++;
        let clsPos = this.pos;

        // inside "{"
        const parseGroup = (selector: string, root: boolean) => {
            const styles: (string|LexResult)[] = [];
            while (this.pos < this.len) {
                switch (this.findNext(["'", ";", "}", "{"])) {
                    case "'": // string
                        this.pos++;
                        this.parseString();
                        this.pos++;
                        break;
                    case ";": // test is end class
                        if ((this.pos + 1 < this.len) && this.src[this.pos + 1] == "_") {
                            const style = this.src.substring(clsPos, this.pos++);
                            if (style.length > 0) {
                                styles.push(style);
                            }
                            clsPos = this.pos + 1;
                        }
                        this.pos++;
                        break;
                    case "}":
                        const lastStyle = this.src.substring(clsPos, this.pos++);
                        if (lastStyle.length > 0) {
                            styles.push(lastStyle);
                        }
                        if (!root) {
                            if (!selector) {
                                const selStart = this.pos;
                                parseAfterSelector();
                                selector = this.src.substring(selStart, this.pos);
                            }
                            return { styles, selector: selector };
                        }
                        return { styles, selector: selector || this.src.substring(this.pos) };
                    case "{": // nested group
                        let nestSelector = "";
                        if (this.pos != clsPos) { // check is front-selector {@sel{foo:bar}}
                            nestSelector = this.src.substring(clsPos, this.pos);
                        }
                        this.pos++;
                        clsPos = this.pos;
                        const nested = parseGroup(nestSelector, false);
                        nested && styles.push(nested);
                        clsPos = this.pos;
                        break;
                    default:
                        this.pos++;
                }
            }
        };
        return parseGroup(rootSelector, true);
    }
}

function lex(src: string): LexResult | undefined {
    if (src[0] == "{" || src[src.length-1] == "}") {
        const l = new StyleLexer(src);
        return l.lex();
    }
}

export default lex;
