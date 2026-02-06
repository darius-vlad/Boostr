create table perks
(
    id                      bigint auto_increment
        primary key,
    title                   varchar(64)   not null,
    description             varchar(1024) null,
    minimum_donation_amount bigint        not null
);
