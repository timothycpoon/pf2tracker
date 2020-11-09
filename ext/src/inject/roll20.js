const addMetaInfo = (addAttrFn) => {
    addAttrFn('sheet_type', 'npc');
    addAttrFn('version_character', 3.442);
    addAttrFn('text_modifier', 'MODIFIER');
    addAttrFn('text_ability_modifier', 'ABILITY MODIFIER');
    addAttrFn('text_bonus', 'BONUS');
    addAttrFn('text_roll_bonus', 'BONUS TO ROLL');
    addAttrFn('text_roll_damage_bonus', 'BONUS TO DAMAGE');
    addAttrFn('text_#_damage_dice', '# DAMAGE DICE');
    addAttrFn('text_#_critical_damage_dice', '# CRITICAL DAMAGE DICE');
    addAttrFn('text_use', 'USE');
    addAttrFn('text_other', 'OTHER');
    addAttrFn('text_misc', 'MISC');
    addAttrFn('text_level', 'LEVEL');
    addAttrFn('text_proficiency', 'PROFICIENCY');
    addAttrFn('toggles', 'color:default,innate,focus,cantrips,normalspells,npcspellcaster');
}

// attributes which are one-to-one
const simpleMap = [
    // [roll20, currVal, maxVal]
    ['npc_type', 'type'],
    ['level', 'level'],
    ['alignment', 'alignment'],
    ['size', 'size'],
    ['traits', 'traits'],
    ['senses', 'senses'],
    ['armor_class', 'ac'],
    ['armor_class_notes', 'ac_notes'],
    ['hit_points', 'hp', 'hp'],
    ['languages', 'languages'],
    ['speed', 'speed'],
    ['speed_notes', 'speed_notes'],
    ['immunities', 'immunities'],
    ['resistances', 'resistances'],
    ['weaknesses', 'weaknesses'],
    ['spell_dc', 'dc'],
    ['cantrips_per_day', 'cantripLevel'], // Yes, this mapping is correct
];

// these convert int to string with a +/- in front
const modifierMap = [
    ['perception', 'perception'],
    ['acrobatics', 'acrobatics'],
    ['arcana', 'arcana'],
    ['athletics', 'athletics'],
    ['crafting', 'crafting'],
    ['deception', 'deception'],
    ['diplomacy', 'diplomacy'],
    ['intimidation', 'intimidation'],
    ['medicine', 'medicine'],
    ['nature', 'nature'],
    ['occultism', 'occultism'],
    ['performance', 'performance'],
    ['religion', 'religion'],
    ['society', 'society'],
    ['stealth', 'stealth'],
    ['survival', 'survival'],
    ['thievery', 'thievery'],
    ['strength_modifier', 'Str'],
    ['dexterity_modifier', 'Dex'],
    ['constitution_modifier', 'Con'],
    ['intelligence_modifier', 'Int'],
    ['wisdom_modifier', 'Wis'],
    ['charisma_modifier', 'Cha'],
    ['saving_throws_fortitude', 'fort'],
    ['saving_throws_reflex', 'ref'],
    ['saving_throws_will', 'will'],
    ['spell_attack', 'attack'],
];

const addStrike = (strikeType, id, strike, addAttrFn) => {
    const {
        name,
        bonus,
        traits,
        damage,
        type,
        additional,
    } = strike;
    const prefix = `repeating_${strikeType}-strikes_-strike${id}_`;
    const isAgile = traits.includes('agile');
    addAttrFn(`${prefix}weapon`, name);
    addAttrFn(`${prefix}roll_critical_damage_npc`, '@{damage_critical_roll_npc}');
    addAttrFn(`${prefix}weapon_map2`, isAgile ? '@{strikes_agile_map2}' : '@{strikes_map2}');
    addAttrFn(`${prefix}weapon_map3`, isAgile ? '@{strikes_agile_map3}' : '@{strikes_map3}');
    addAttrFn(`${prefix}weapon_strike`, bonus, undefined, true);
    addAttrFn(`${prefix}weapon_traits`, traits || '');
    addAttrFn(`${prefix}weapon_agile`, isAgile | 0);
    addAttrFn(`${prefix}weapon_strike_damage`, damage || '');
    addAttrFn(`${prefix}weapon_strike_damage_type`, type || '');
    addAttrFn(`${prefix}weapon_notes`, additional || '');
    addAttrFn(`${prefix}toggles`, 'display,');
}

const addAbility = (id, ability, addAttrFn) => {
    const {
        name,
        actions,
        traits,
        description,
    } = ability;
    const prefix = `repeating_actions-activities_-ability${id}_`;
    addAttrFn(`${prefix}name`, name || '');
    addAttrFn(`${prefix}actions`, actions || '');
    addAttrFn(`${prefix}description`, description || '');
    addAttrFn(`${prefix}rep_traits`, traits || '');
    addAttrFn(`${prefix}toggles`, 'display,');
}

const addSpellSlots = (spellSlots, addAttrFn) => {
    // Slot #s are only provided for spontaneous casters
    for (let i = 1; i <= 10; i++) {
        addAttrFn(`level_${i}_per_day`, spellSlots[`level${i}`], spellSlots[`level${i}`]);
    }
}

const frequencyMap = {
    'X/day': 'daily-limit',
    'at will': 'at-will',
    'constant': 'constant',
}

const addSpell = (castingType, id, spell, addAttrFn, attack, dc) => {
    // Prepared and Spontaneous casting
    const {
        name,
        tradition,
        uses,
        level,
        frequency,
    } = spell;
    const prefix = `repeating_${castingType}_-${id}_`;
    addAttrFn(`${prefix}name`, name || '');
    addAttrFn(`${prefix}magic_tradition`, (tradition || '').toLowerCase());
    addAttrFn(`${prefix}current_level`, level || 1);
    addAttrFn(`${prefix}uses`, uses || 1, uses || 1);
    addAttrFn(`${prefix}spellattack`, attack || 1, undefined, true);
    addAttrFn(`${prefix}spellattack_final`, attack || 1, undefined, true);
    addAttrFn(`${prefix}npc_attack_roll`, '{{roll01=[[1d20cs20cf1 + (@{spellattack_final})[Spell attack] + (@{spellattack_misc})[MISC] + (@{query_roll_bonus})[@{text_bonus}]]]}} {{roll01_name=^{attack}}} {{roll01_type=attack}} {{roll01_critical=1}}');
    addAttrFn(`${prefix}spell_dc`, dc || 10);
    addAttrFn(`${prefix}roll_critical_damage`, '@{damage_critical_roll}');
    addAttrFn(`${prefix}frequency`, frequencyMap[frequency] || 'constant');
    addAttrFn(`${prefix}toggles`, 'display,');
}

const formatRoll20 = (creature) => {
    let currId = 0;
    const output = {
        schema_version: 2,
        avatar: '',
        oldId: '-oldId',
        bio: '',
        gmnotes: '',
        defaulttoken: '',
        tags: '[]',
        controlledby: '',
        inplayerjournals: '',
        attribs: [],
        abilities: [],
    };
    const addAttr = (name, current, max, isModifier) => {
        const toText = input => {
            if (!input) {
                return input;
            }
            if (Array.isArray(input)) {
                return input.join(', ');
            }
            if (Number.isInteger(input)) {
                if (input > 0 && isModifier) {
                    return `+${input}`;
                }
                return input.toString();
            }
            return input;
        }
        output.attribs.push({
            name,
            current: toText(current) || "",
            max: toText(max) || "",
            id: `-${currId++}`,
        });
    };

    output.name = creature.name;
    addMetaInfo(addAttr);
    simpleMap.forEach(([out, inCurr, inMax]) => {
        if (creature[inCurr]) {
            addAttr(out, creature[inCurr], inMax ? creature[inMax] : undefined);
        }
    });
    modifierMap.forEach(([out, inCurr, inMax]) => {
        if (creature[inCurr]) {
            addAttr(out, creature[inCurr], inMax ? creature[inMax] : undefined, true);
        }
    });
    creature.melee.forEach(strike => addStrike('melee', currId++, strike, addAttr));
    creature.ranged.forEach(strike => addStrike('ranged', currId++, strike, addAttr));
    creature.abilities.forEach(ability => addAbility(currId++, ability, addAttr));

    // Spellcasting
    addAttr('spellcaster_prepared', creature.prepared ? 'prepared' : '0');
    addAttr('spellcaster_spontaneous', creature.spontaneous ? 'spontaneous' : '0');
    creature.spellSlots && addSpellSlots(creature.spellSlots, addAttr);
    creature.spells.forEach(spell => addSpell('normalspells', currId++, spell, addAttr, creature.attack, creature.dc));
    creature.innateSpells.forEach(spell => addSpell('spellInnate', currId++, spell, addAttr, creature.attack, creature.dc));
    creature.cantrips.forEach(spell => addSpell('cantrip', currId++, spell, addAttr, creature.attack, creature.dc));
    return output;
};
