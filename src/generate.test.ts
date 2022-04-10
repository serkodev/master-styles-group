/* eslint-disable @typescript-eslint/no-non-null-assertion */

import lex from "./style-lexer";
import generate from "./generate";

test("generate", () => {
    [
        {
            in: "{p:2;4;_m:8;16}@xs",
            out: ["p:2;4@xs", "m:8;16@xs"]
        },
        {
            in: "{{foo:bar}@xm;_f:red}@dark",
            out: ["foo:bar@xm@dark", "f:red@dark"]
        },
        {
            in: "{{foo:bar}@xm;_f:red}_.foo",
            out: ["foo:bar_.foo@xm", "f:red_.foo"]
        },
    ].forEach(c => expect(generate(lex(c.in)!)).toStrictEqual(c.out));
});
