CREATE TABLE user_login (
    id SERIAL PRIMARY KEY,
    username varchar(50),
    email varchar(128),
    password varchar(128)
);

CREATE TABLE creature (
    id SERIAL PRIMARY KEY,
    name varchar(100),
    max_hp int,
    ac int,
    fortitude int,
    reflex int,
    will int,
    perception int,
    stealth int,
    user_id int REFERENCES user_login(id)
);
