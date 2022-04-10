export default class Lexer {
    src: string;
    pos = 0;
    len = 0;

    constructor(src: string) {
        this.src = src;
        this.len = src.length;
    }

    findNext(charList: string[]): string | undefined  {
        while (this.pos < this.len) {
            const c = this.src[this.pos];
            if (charList.includes(c)) {
                return c;
            }
            this.pos++;
        }
    }

    parseString() {
        while (this.pos < this.len) {
            switch (this.findNext(["'", "\\"])) {
                case "\\":
                    this.pos++;
                    break;
                case "'":
                    return;
                default:
                    return; // "error";
            }
            this.pos++;
        }
    }
}
