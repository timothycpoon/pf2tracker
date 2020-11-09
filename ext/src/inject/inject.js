const formatCreature = (format, creature) => {
    switch (format) {
        case "roll20":
            return formatRoll20(creature);
        default:
            return creature;
    }
}

chrome.extension.sendMessage({}, (res) => {
	$(document).ready(() => {
        chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
            if (msg == null) return;
            const { type, format } = msg;
            switch(type) {
                case 'parse':
                    try {
                        sendResponse({
                            err: null,
                            creature: formatCreature(format, parseCreature()),
                        });
                    } catch (err) {
                        console.error(err);
                        sendResponse({
                            err: err,
                            creature: {},
                        });
                    }
                    break;
                default:
                    break;
            }
        });
	});
});

