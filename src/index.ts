import lex, { LexResult } from "./lex";

const groupStyles = (lexResult: LexResult) => lexResult.styles.map(style => style + lexResult.selector);

const updateStyleClass = (e: Element, oldValue: string | null = null) => {
    const lexResultMap: { [key: string]: LexResult } = {};

    // lex current class
    e.classList.forEach((c) => {
        const lexResult = lex(c);
        if (lexResult !== undefined) {
            lexResultMap[c] = lexResult;
        }
    });

    // find old value group class and remove the related class
    if (oldValue) {
        oldValue.split(/\s/).forEach((c) => {
            if (!lexResultMap[c]) {
                const lexResult = lex(c);
                if (lexResult !== undefined) {
                    groupStyles(lexResult).forEach(style => {
                        e.classList.remove(style);
                    });
                }
            }
        });
    }

    // extract group style and add to element
    // TODO: prevent process same group-style to increase performance
    Object.values(lexResultMap).forEach(lexResult => {
        const styles = groupStyles(lexResult);
        styles.forEach(style => {
            !e.classList.contains(style) && e.classList.add(style);
        });
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
                    updateStyleClass(mutation.target, mutation.oldValue);
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
