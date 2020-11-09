const numberRegex = '[0-9]+';
const bonusRegex = `[+-]${numberRegex}`;

const parseAC = (text) => {
    const saveRegex = ['Fort', 'Ref', 'Will'].map(save => `${save} (${bonusRegex})(?: \\((.*)\\))?`).join(', ');
    const matches = text.match(`AC (${numberRegex})(?:, (.*))?; ${saveRegex}(?:; )?(.*)`);
    if (matches) {
        return {
            ac: parseInt(matches[1]),
            ac_notes: matches[2],
            fort: parseInt(matches[3]),
            fort_notes: matches[4],
            ref: parseInt(matches[5]),
            ref_notes: matches[6],
            will: parseInt(matches[7]),
            will_notes: matches[8],
            save_notes: matches[9],
        };
    }
    return {};
}

const parseHP = (text) => {
    const defensesRegex = ['Immunities', 'Weaknesses', 'Resistances'].reduce((acc, str) => `${acc}(?:; ${str} ([^;]*))?`, '');
    const matches = text.match(`HP (${numberRegex})(?:, ([^;]*))?${defensesRegex}`);
    if (matches) {
        return {
            hp: parseInt(matches[1]),
            hp_notes: matches[2],
            immunities: matches[3],
            weaknesses: matches[4],
            resistances: matches[5],
        };
    }
    return {};
}

const parseStrike = (name, text) => {
    const matches = text.match(`${name} \\[one-action\\] ([\\w ]*) (${bonusRegex}) \\(([^)]*)\\), (?:Damage|Effect) (${numberRegex}d${numberRegex}(?:${bonusRegex})?)?(?: (\\w+))? ?(.*)?`);
    if (matches) {
        return {
            name: matches[1],
            bonus: matches[2],
            traits: matches[3].split(', '),
            damage: matches[4],
            type: matches[5],
            additional: matches[6],
        };
    }
    return null;
}

const parsePreparedSpontaneous = (tradition, type, text) => {
    const matches = text.match(`DC (${numberRegex})(?:, attack (${bonusRegex}))?; (.*)`);
    const isSpontaneous = type === 'Spontaneous';
    if (matches) {
        const data = {
            prepared: !isSpontaneous,
            spontaneous: isSpontaneous,
            dc: parseInt(matches[1]),
            attack: parseInt(matches[2]),
            spells: [],
            spellSlots: {},
        };
        matches[3].split('; ').forEach((spellLevel) => {
            if (spellLevel.startsWith('Cantrips')) {
                const levelMatches = spellLevel.match('Cantrips \\(([1-9]|10)\\w*\\) (.*)');
                if (levelMatches) {
                    data.cantripLevel = parseInt(levelMatches[1]);
                    data.cantrips = levelMatches[2].split(', ').map(name => ({
                        tradition,
                        name,
                        level: data.cantripLevel,
                    }));
                }
            } else {
                const levelMatches = spellLevel.match(`([1-9]|10)[\\w]* ${isSpontaneous ? `\\((${numberRegex}) slots\\) ` : ''}(.*)`);
                if (levelMatches) {
                    data.spells.push(...levelMatches[isSpontaneous ? 3 : 2].split(', ').map((spell) => {
                        const spellMatches = spell.match(`(.*)(?: \\(x(${numberRegex})\\))?`)
                        return {
                            tradition,
                            name: spellMatches[1],
                            uses: parseInt(spellMatches[2]) || (isSpontaneous ? 0 : 1),
                            level: parseInt(levelMatches[1]),
                            frequency: 'X/day',
                        };
                    }));
                }
                if (isSpontaneous) {
                    data.spellSlots[`level${levelMatches[1]}`] = levelMatches[2];
                }
            }
        });
        return data;
    }
    return {};
}

const parseInnate = (tradition, text) => {
    const matches = text.match(`DC (${numberRegex})(?:, attack (${bonusRegex}))?; (.*)`);
    if (matches) {
        const data = {
            dc: parseInt(matches[1]),
            attack: parseInt(matches[2]),
            innateSpells: [],
        };
        matches[3].split('; ').forEach((spellLevel) => {
            if (spellLevel.startsWith('Cantrips')) {
                const levelMatches = spellLevel.match('Cantrips \\(([1-9]|10)\\w*\\) (.*)');
                if (levelMatches) {
                    data.cantripLevel = parseInt(levelMatches[1]);
                    data.cantrips = levelMatches[2].split(', ');
                }
            } else if (spellLevel.startsWith('Constant')) {
                const levelMatches = spellLevel.match('Constant \\(([1-9]|10)\\w*\\) (.*)');
                if (levelMatches) {
                    const level = parseInt(levelMatches[1]);
                    data.innateSpells.push(...levelMatches[2].split(', ').map((name) => ({ name, level, frequency: 'Constant' })));
                }
            } else {
                const levelMatches = spellLevel.match(`([1-9]|10)[\\w]* (.*)`);
                if (levelMatches) {
                    data.innateSpells.push(...levelMatches[2].split(', ').map((spell) => {
                        const spellMatches = spell.match(`([\\w ]*\\w)(?: \\(((?:at will)|x)(${numberRegex})?\\))?`);
                        if (spellMatches) {
                            const isAtWill = spellMatches[2] === 'at will';
                            return {
                                tradition,
                                name: spellMatches[1],
                                uses: isAtWill ? 0 : parseInt(spellMatches[3]) || 1,
                                level: parseInt(levelMatches[1]),
                                frequency: isAtWill ? 'at will' : 'X/day',
                            };
                        }
                        return null;
                    }).filter(x => x));
                }
            }
        });
        return data;
    }
    return {};
}

const parseSpells = (text) => {
    const matches = text.match(`(Arcane|Primal|Occult|Divine) (Spontaneous|Prepared|Innate) Spells (.*)`);
    if (matches) {
        switch (matches[2]) {
            case 'Spontaneous':
            case 'Prepared':
                return parsePreparedSpontaneous(matches[1], matches[2], matches[3]);
            case 'Innate':
                return parseInnate(matches[1], matches[3]);
        }
    }
    return {};
}

const addSectionToCreature = (creature, name, section) => {
    const text = $(section).text();
    const toDirectlyTranscribe = ['Languages', 'Items'];
    if (name === 'Senses') {
        const matches = text.match(`Perception (${bonusRegex}); (.*)`);
        if (matches) {
            creature.perception = parseInt(matches[1]);
            creature.senses = matches[2];
        }
    } else if (name === 'Perception') {
        const matches = text.match(`Perception (${bonusRegex})`);
        if (matches) {
            creature.perception = parseInt(matches[1]);
        }
    } else if (toDirectlyTranscribe.includes(name)) {
        const matches = text.match(`${name} (.*)`);
        if (matches) {
            creature[name.toLowerCase()] = matches[1];
        }
    } else if (name === 'Skills') {
        const matches = text.match('Skills (.*)');
        if (matches) {
            matches[1].split(', ').forEach((skill) => {
                const skillMatches = skill.match(`([\\w ]*) (${bonusRegex})`);
                if (skillMatches) {
                    creature[skillMatches[1].toLowerCase()] = parseInt(skillMatches[2]);
                }
            });
        }
    } else if (name === 'Str') {
        // Ability Modifiers
        const matches = [...text.matchAll(`([a-zA-Z]*) (${bonusRegex})`)];
        if (matches) {
            matches.forEach((ability) => {
                creature[ability[1]] = parseInt(ability[2]);
            })
        }
    } else if (name === 'AC') {
        $.extend(creature, parseAC(text));
    } else if (name === 'HP') {
        $.extend(creature, parseHP(text));
    } else if (name === 'Speed') {
        const matches = text.match(`Speed (${numberRegex}) feet(?:[;,] (.*))?`);
        if (matches) {
            creature.speed = matches[1];
            creature.speed_notes = matches[2];
        }
    } else if (['Melee', 'Ranged'].includes(name)) {
        const strike = parseStrike(name, text);
        if (strike) {
            creature[name.toLowerCase()].push(strike);
        }
    } else if (['Divine', 'Arcane', 'Occult', 'Primal'].includes(text.split(' ')[0])) {
        const {
            prepared,
            spontaneous,
            dc,
            attack,
            spellSlots,
            cantripLevel,
            cantrips,
            spells,
            innateSpells,
        } = parseSpells(text);
        creature.prepared = creature.prepared || prepared;
        creature.spontaneous = creature.spontaneous || spontaneous;
        creature.dc = creature.dc || dc;
        creature.attack = creature.attack || attack;
        creature.spellSlots = creature.spellSlots || spellSlots;
        creature.cantripLevel = creature.cantripLevel || cantripLevel;
        creature.cantrips.push(...(cantrips || []));
        creature.spells.push(...(spells || []));
        creature.innateSpells.push(...(innateSpells || []));
    } else {
        const matches = text.match(`${name} (?:\\[([^\\]]*)\\] )?(?:\\(([^)]*)\\) )?(.*)?`)
        if (matches) {
            creature.abilities.push({
                name,
                actions: matches[1],
                traits: matches[2],
                description: matches[3],
            });
        }
    }
}

const parseCreature = () => {
    const creature = {
        abilities: [],
        melee: [],
        ranged: [],
        cantrips: [],
        spells: [],
        innateSpells: [],
    };
    const data = $('.article-content').first();

    const monsterHeader = data.find('.monster');
    creature.name = monsterHeader[0].childNodes[0].wholeText.trim();
    creature.type = monsterHeader.find('.monster-type').text();
    creature.level = parseInt(monsterHeader.find('.monster-level').text());

    const traits = data.find('.traits');
    creature.alignment = traits.find('.alignment').text();
    creature.size = traits.find('.size').text();
    creature.traits = [];
    traits.find('.trait, .type').each((idx, trait) => creature.traits.push(trait.innerHTML));

    data.find('p').each((idx, el) => {
        const sectionName = el.childNodes[0];
        if (['B', 'STRONG'].includes(sectionName.tagName)) {
            addSectionToCreature(creature, sectionName.innerHTML, el);
        }
    });

    return creature;
}
