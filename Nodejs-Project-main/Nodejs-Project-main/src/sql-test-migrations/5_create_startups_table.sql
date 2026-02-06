create table startup
(
    id              bigint auto_increment
        primary key,
    founder_id      bigint           not null,
    name            varchar(64)      not null,
    description     varchar(1024)    null,
    funding_goal    bigint           not null,
    current_funding bigint default 0 null,
    created_at      datetime         not null,
    constraint startup_user_id_fk
        foreign key (founder_id) references user (id)
);
