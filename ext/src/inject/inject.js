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
        chrome.runtime.onMessage.addListener((msg) => {
            if (msg == null) return;
            const { type, format } = msg;
            switch(type) {
                case 'parse':
                    console.log(formatCreature(format, parseCreature()));
                    break;
                default:
                    break;
            }
        });
	});
});

