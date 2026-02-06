create table donation
(
    id         bigint auto_increment
        primary key,
    startup_id bigint   not null,
    donor_id   bigint   not null,
    amount     bigint   not null,
    donated_at datetime not null,
    perk_id    bigint   null,
    constraint donation_perks_id_fk
        foreign key (perk_id) references perks (id),
    constraint donation_startup_id_fk
        foreign key (startup_id) references startup (id),
    constraint donation_user_id_fk
        foreign key (donor_id) references user (id)
);
