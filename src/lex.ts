export type LexResult = { styles: string[], selector: string }

function lex(src: string): LexResult | undefined {
    const len = src.length;

    if (src[0] == "{" || src[len-1] == "}") {
        let pos = 0;
        const styles: string[] = [];
        let selector = "";

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
                            selector = src.substring(0, pos);
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
        let clsPosition = pos;

        while (pos < len) {
            switch (findNext(["'", ";", "}"])) {
                case "'": // string
                    pos++;
                    parseString();
                    break;
                case ";": // test is end class
                    if ((pos + 1 < len) && src[pos + 1] == "_") {
                        const style = src.substring(clsPosition, pos++);
                        if (style.length > 0) {
                            styles.push(style);
                        }
                        clsPosition = pos + 1;
                    }
                    break;
                case "}":
                    const lastStyle = src.substring(clsPosition, pos++);
                    if (lastStyle.length > 0) {
                        styles.push(lastStyle);
                    }
                    return { styles, selector: selector || src.substring(pos) };
                default:
            }
            pos++;
        }
    }
}

export default lex;
