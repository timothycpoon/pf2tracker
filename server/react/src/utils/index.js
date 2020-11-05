export function post(url, data) {
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
        let err;
        try {
            res.text().then(text => err = text);
        } catch(e) {
            err = res.statusText;
        }
        throw err;
    });
}

export function getDefaultCreature() {
    return {
      creature_id: null,
      name: '',
      hp: {
        maxHP: 1,
        currHP: 1
      },
      ac: 10,
      fortitude: 0,
      reflex: 0,
      will: 0,
      initiative: {
        initSkill: 'perception',
        perception: 0,
        stealth: 0,
      },
    };
}
