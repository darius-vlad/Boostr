create table startup_tags
(
    id         bigint auto_increment
        primary key,
    startup_id bigint not null,
    tag_id     bigint not null,
    constraint startup_tags_startup_id_fk
        foreign key (startup_id) references startup (id),
    constraint startup_tags_tags_id_fk
        foreign key (tag_id) references tags (id)
);
