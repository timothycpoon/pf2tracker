$(document).ready(() => $('#parse-cta').click(() => {
    chrome.tabs.query({
        active: true,
        currentWindow: true,
    }, tabs => chrome.tabs.sendMessage(tabs[0].id, { type: 'parse', format: $('#format').val() }, (res) => {
        const {
            err,
            creature,
        } = res;
        debugger;
        if (err || !creature) {
            $('#error').html('Parsing failed');
        } else {
            const element = document.createElement("a");
            const blob = new Blob([JSON.stringify(creature)], { type: "text/plain;charset=utf-8" });
            element.href = URL.createObjectURL(blob);
            element.download = `${creature.name.split(' ').join('_')}.json`;
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
            document.body.removeChild(element);
        }
    }));
}));
