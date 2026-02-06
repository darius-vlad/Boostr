create table roles_permissions
(
    id            bigint auto_increment
        primary key,
    role_id       bigint not null,
    permission_id bigint not null,
    constraint roles_permissions_permissions_id_fk
        foreign key (permission_id) references permissions (id),
    constraint roles_permissions_roles_id_fk
        foreign key (role_id) references roles (id)
);
