/* eslint-disable @typescript-eslint/no-non-null-assertion */

import lex from "./style-lexer";
import generate from "./generate";

test("generate", () => {
    [
        {
            in: "{p:2;4;_m:8;16}@xs",
            out: "p:2;4@xs m:8;16@xs"
        },
        {
            in: "{{foo:bar}@xm;_f:red}@dark",
            out: "foo:bar@xm@dark f:red@dark"
        },
        {
            in: "{{foo:bar}@xm;_f:red}_.foo",
            out: "foo:bar_.foo@xm f:red_.foo"
        },
        {
            in: "{@xm{foo:bar};_f:red}_.foo",
            out: "foo:bar_.foo@xm f:red_.foo"
        },
        {
            in: "{{m:2;_p:2;4}@dark;_f:red}_span",
            out: "m:2_span@dark p:2;4_span@dark f:red_span"
        },
    ].forEach(c => expect(generate(lex(c.in)!)).toStrictEqual(c.out.split(" ")));
});
