create table user
(
    name        varchar(64)      not null,
    id          bigint auto_increment
        primary key,
    email       varchar(64)      not null,
    password    varchar(64)      not null,
    created_at  datetime         null,
    profile_bio varchar(1024)    null,
    role_id     bigint default 2 not null,
    constraint user_unique
        unique (email),
    constraint user_roles_id_fk
        foreign key (role_id) references roles (id)
);