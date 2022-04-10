import lex, { LexSuffix } from "./selector-lexer";
import { LexResult } from "./style-lexer";

const generate = (lexResult: LexResult, lexSuffix?: LexSuffix): string[] => {
    return lexResult.styles.reduce<string[]>((all, style) => {
        const lexSelector = lex(lexResult.selector);
        if (lexSuffix) {
            lexSelector.selector += lexSuffix.selector;
            lexSelector.atSelector += lexSuffix.atSelector;
        }
        if (typeof style == "string") {
            return all.concat(style + lexSelector.selector + lexSelector.atSelector);
        } else {
            return all.concat(generate(style, lexSelector));
        }
    }, []);
};

export default generate;
