export type LexResult = { styles: (string|LexResult)[], selector: string }

function lex(src: string): LexResult | undefined {
    const len = src.length;

    if (src[0] == "{" || src[len-1] == "}") {
        let pos = 0;
        let rootSelector = "";

        const findNext = (charList: string[]): string | undefined => {
            while (pos < len) {
                const c = src[pos];
                if (charList.includes(c)) {
                    return c;
                }
                pos++;
            }
        };

        const parseString = () => {
            while (pos < len) {
                switch (findNext(["'", "\\"])) {
                    case "\\":
                        pos++;
                        break;
                    case "'":
                        return;
                    default:
                        return; // "error";
                }
                pos++;
            }
        };

        const parseAfterSelector = () => {
            while (pos < len) {
                switch (findNext(["'", ";", "}"])) {
                    case "'": // string
                        pos++;
                        parseString();
                        break;
                    case ";": // next
                    case "}": // end group
                        return;
                }
                pos++;
            }
        };

        // selector on the begin
        if (src[0] != "{" && src[len-1] == "}") {
            const parseFrontSelector = () => {
                while (pos < len) {
                    switch (findNext(["'", "{"])) {
                        case "'": // string
                            pos++;
                            parseString();
                            break;
                        case "{":
                            rootSelector = src.substring(0, pos);
                            return true;
                    }
                    pos++;
                }
                return false;
            };
            if (!parseFrontSelector()) return;
        }

        // start
        pos++;
        let clsPos = pos;

        // inside "{"
        const parseGroup = (selector: string, root: boolean) => {
            const styles: (string|LexResult)[] = [];
            while (pos < len) {
                switch (findNext(["'", ";", "}", "{"])) {
                    case "'": // string
                        pos++;
                        parseString();
                        pos++;
                        break;
                    case ";": // test is end class
                        if ((pos + 1 < len) && src[pos + 1] == "_") {
                            const style = src.substring(clsPos, pos++);
                            if (style.length > 0) {
                                styles.push(style);
                            }
                            clsPos = pos + 1;
                        }
                        pos++;
                        break;
                    case "}":
                        const lastStyle = src.substring(clsPos, pos++);
                        if (lastStyle.length > 0) {
                            styles.push(lastStyle);
                        }
                        if (!root) {
                            if (!selector) {
                                const selStart = pos;
                                parseAfterSelector();
                                selector = src.substring(selStart, pos);
                            }
                            return { styles, selector: selector };
                        }
                        return { styles, selector: selector || src.substring(pos) };
                    case "{": // nested group
                        let nestSelector = "";
                        if (pos != clsPos) { // {@sel{foo:bar}}
                            nestSelector = src.substring(clsPos, pos);
                        }
                        pos++;
                        clsPos = pos;
                        const nested = parseGroup(nestSelector, false);
                        nested && styles.push(nested);
                        clsPos = pos;
                        break;
                    default:
                        pos++;
                }
            }
        };
        return parseGroup(rootSelector, true);
    }
}

export default lex;
