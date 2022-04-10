import lex from "./style-lexer";

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

test("lex front-selector", () => {
    [
        {
            in: "_:where(pre,a){font:bass;_asd:sxx}",
            out: { styles: ["font:bass", "asd:sxx"], selector: "_:where(pre,a)" }
        },
        {
            in: "@xs{p:2;4;_m:8;16}",
            out: { styles: ["p:2;4", "m:8;16"], selector: "@xs" }
        },
        {
            in: "@xs{font:bass;_asd:sxx}",
            out: { styles: ["font:bass", "asd:sxx"], selector: "@xs" }
        },
        {
            in: "@xs{font:bass;_content:'a|a'::after}",
            out: { styles: ["font:bass", "content:'a|a'::after"], selector: "@xs" }
        },
        {
            in: "@xs{font:bass;_content:'a|)}a'::after}",
            out: { styles: ["font:bass", "content:'a|)}a'::after"], selector: "@xs" }
        },
        {
            in: "@xs{font:bass;_content:'a|)\\'}a'::after}",
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
        },
        {
            in: "_:where(.content:'\\}'){content:'\\}';_font:red}",
            out: { styles: ["content:'\\}'", "font:red"], selector: "_:where(.content:'\\}')" }
        },
        {
            in: "_:where(.content:'\\''){font:red}",
            out: { styles: ["font:red"], selector: "_:where(.content:'\\'')" }
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
        },
        {
            in: "{;_font:red}",
            out: { styles: ["font:red"], selector: "" }
        }
    ].forEach(c => expect(lex(c.in)).toStrictEqual(c.out));
});

test("lex nested group", () => {
    [
        {
            in: "{@xm{foo:bar;_f:red;_@dark{f:blue}};_f:red}",
            out: { styles: [
                { styles:[
                    "foo:bar",
                    "f:red",
                    { styles:[
                        "f:blue"
                    ], selector: "@dark"},
                ], selector: "@xm"},
                "f:red"
            ], selector: "" }
        },
        {
            in: "{{foo:bar}@xm;_f:red}",
            out: { styles: [
                { styles:["foo:bar"], selector: "@xm"},
                "f:red"
            ], selector: "" }
        },
        {
            in: "{{foo:bar}@xm;_{f:blue;_{f:12}@md}_.foo@print}@dark",
            out: { styles: [
                { styles:["foo:bar"], selector: "@xm"},
                { styles:[
                    "f:blue",
                    { styles:["f:12"], selector: "@md"}
                ], selector: "_.foo@print"}
            ], selector: "@dark" }
        },
        {
            in: "{{foo:bar}@xm;_{f:blue;_{}}_.foo@print}@dark",
            out: { styles: [
                { styles:["foo:bar"], selector: "@xm"},
                { styles:[
                    "f:blue",
                    { styles:[], selector: ""}
                ], selector: "_.foo@print"}
            ], selector: "@dark" }
        },
        {
            in: "{{{}}}",
            out: { styles: [{ styles: [{ styles: [], selector: "" }], selector: "" }], selector: "" }
        }
    ].forEach(c => expect(lex(c.in)).toStrictEqual(c.out));
});
