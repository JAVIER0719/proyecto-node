create table users(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contact varchar(20),
    email varchar(100),
    password varchar (250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)/*no se puede repetir el correo*/
);
create table category(
    id int not null AUTO_INCREMENT,
    name varchar(250) not null,
    primary key(id)
);

create table product(
    id int not null AUTO_INCREMENT,
    name varchar(250) not null,
    description varchar(250) not null,
    categoryId integer not null,
    price integer,
    status varchar(20),
    primary key (id)
);

create table bill(
    id int not null AUTO_INCREMENT,/**/
    uuid varchar(200)not null,/*aid aleatoria de lo que se constuye*/
    name varchar(255)not null,/**/
    email varchar(100) not null,/**/
    contact varchar(20) not null,/**/
    paymentMethod varchar(50) not null,/*metodo de pago*/
    total int not null,/**/
    productDetails JSON DEFAULT null,/*detalles del producto*/
    createdBy varchar(100) not null,/*creado por(quien ha creado la factura)*/
    primary key (id)/**/
);

insert into users(name, contact, email, password,status,role)
value('chart', '89779','javier@gmail.com', 'admin123','true','admin');

