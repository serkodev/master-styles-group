import lex, { LexResult } from "./style-lexer";
import generate from "./generate";

type lexMap = { [key: string]: LexResult }
const groupLexCache = new WeakMap();

const updateStyleClass = (e: Element) => {
    const cache: lexMap = groupLexCache.get(e) || {};

    // loop cache, check if current does not have
    for (const style in cache) {
        if (!e.classList.contains(style)) {
            const styles = generate(cache[style]);
            delete cache[style];
            groupLexCache.set(e, cache);

            e.classList.remove(...styles);
        }
    }

    // lex current class
    e.classList.forEach((c) => {
        if (!cache[c]) {
            const lexResult = lex(c);
            if (lexResult !== undefined) {
                cache[c] = lexResult;
                groupLexCache.set(e, cache);

                const newStyles = generate(lexResult).filter(style => !e.classList.contains(style));
                e.classList.add(...newStyles);
            }
        }
    });
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach(function (mutation) {
        switch (mutation.type) {
            case "childList":
                mutation.addedNodes.forEach(node => node instanceof Element && updateStyleClass(node));
                break;
            case "attributes":
                if (mutation.target instanceof Element && mutation.attributeName === "class") {
                    updateStyleClass(mutation.target);
                }
        }
    });
});

const observe = (target: HTMLElement, options?: MutationObserverInit) => {
    if (options && options.subtree) {
        target.querySelectorAll("[class]").forEach((e) => {
            updateStyleClass(e);
        });
    }
    observer.observe(target, options);
};

// update all element when init
document.querySelectorAll("[class]").forEach(e => {
    updateStyleClass(e);
});

observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["class"]
});
