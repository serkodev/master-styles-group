import { atResult, lexSelector, lexStyle } from "./selector-lexer";
import { LexResult } from "./style-lexer";

const generate = (lexResult: LexResult, suffix?: atResult): string[] => {
    return lexResult.styles.reduce<string[]>((all, style) => {
        const sels = lexSelector(lexResult.selector);
        if (suffix) {
            sels.selector += suffix.selector;
            sels.at += suffix.at;
        }
        if (typeof style == "string") {
            // before ordering, split style if contians @ selector
            const styleSel = lexStyle(style);

            return all.concat(styleSel.style + sels.selector + styleSel.at + sels.at);
        } else {
            return all.concat(generate(style, sels));
        }
    }, []);
};

export default generate;
