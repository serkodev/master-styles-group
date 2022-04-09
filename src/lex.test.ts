import lex from "./lex";

test("lex end-selector", () => {
    [
        {
            in: "{font:bass;_asd:sxx}_:where(pre,a)",
            out: { styles: ["font:bass", "asd:sxx"], selector: "_:where(pre,a)" }
        },
        {
            in: "{p:2;4;_m:8;16}@xs",
            out: { styles: ["p:2;4", "m:8;16"], selector: "@xs" }
        },
        {
            in: "{font:bass;_asd:sxx}@xs",
            out: { styles: ["font:bass", "asd:sxx"], selector: "@xs" }
        },
        {
            in: "{font:bass;_content:'a|a'::after}@xs",
            out: { styles: ["font:bass", "content:'a|a'::after"], selector: "@xs" }
        },
        {
            in: "{font:bass;_content:'a|)}a'::after}@xs",
            out: { styles: ["font:bass", "content:'a|)}a'::after"], selector: "@xs" }
        },
        {
            in: "{font:bass;_content:'a|)\\'}a'::after}@xs",
            out: { styles: ["font:bass", "content:'a|)\\'}a'::after"], selector: "@xs" }
        }
    ].forEach(c => expect(lex(c.in)).toStrictEqual(c.out));
});

test("lex escape", () => {
    [
        {
            in: "{content:'foo;_bar';_foo:bar}",
            out: { styles: ["content:'foo;_bar'", "foo:bar"], selector: "" }
        },
        {
            in: "{content:'a|)\\'}a'}",
            out: { styles: ["content:'a|)\\'}a'"], selector: "" }
        },
        {
            in: "{content:''}",
            out: { styles: ["content:''"], selector: "" }
        },
        {
            in: "{content:'\\''}",
            out: { styles: ["content:'\\''"], selector: "" }
        },
        {
            in: "{content:'\''}",
            out: undefined
        },
        {
            in: "{content:'}'}",
            out: { styles: ["content:'}'"], selector: "" }
        },
        {
            in: "{content:'\\}';_font:red}",
            out: { styles: ["content:'\\}'", "font:red"], selector: "" }
        }
    ].forEach(c => expect(lex(c.in)).toStrictEqual(c.out));
});

test("lex empty", () => {
    [
        {
            in: "{}",
            out: { styles: [], selector: "" }
        },
        {
            in: "{}@xm",
            out: { styles: [], selector: "@xm" }
        },
        {
            in: "{foo:bar;_bar:foo}",
            out: { styles: ["foo:bar", "bar:foo"], selector: "" }
        }
    ].forEach(c => expect(lex(c.in)).toStrictEqual(c.out));
});
