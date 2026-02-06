create table migrations
(
    id          bigint
        primary key,
    description varchar(128) null,
    timestamp   datetime     null
);

