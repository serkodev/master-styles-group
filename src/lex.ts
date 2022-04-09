export type LexResult = { styles: string[], selector: string }

function lex(src: string): LexResult | undefined {
    const len = src.length;

    if (src[0] == "{" ) {
        let pos = 0;
        const styles: string[] = [];

        const findNext = (charList: string[]): string | undefined => {
            while (pos < len) {
                const c = src[pos];
                if (charList.includes(c)) {
                    return c;
                }
                pos++;
            }
        };

        // start
        pos++;
        let clsPosition = pos;

        while (pos < len) {

            switch (findNext(["'", ";", "}"])) {
                case "'": // string
                    pos++;
                    parseString:
                    while (pos < len) {
                        switch (findNext(["'", "\\"])) {
                            case "\\":
                                pos++;
                                break;
                            case "'":
                                break parseString;
                            default:
                                return; // "error";
                        }
                        pos++;
                    }
                    break;
                case ";": // test is end class
                    if ((pos + 1 < len) && src[pos + 1] == "_") {
                        styles.push(src.substring(clsPosition, pos++));
                        clsPosition = pos + 1;
                    }
                    break;
                case "}":
                    const lastStyle = src.substring(clsPosition, pos++);
                    if (lastStyle.length > 0) {
                        styles.push(lastStyle);
                    }
                    return { styles, selector: src.substring(pos) };
                default:
            }
            pos++;
        }
    }
}

export default lex;
