CREATE TABLE user_login (
    id SERIAL PRIMARY KEY ,
    username varchar(50),
    email varchar(128),
    password varchar(128)
);
