CREATE TABLE operam.image_net_node (
	id serial NOT NULL,
	"name" varchar NOT NULL,
	"size" int4 NULL,
	"left" int4 NOT NULL,
	"right" int4 NOT NULL,
	"nameNested" varchar NOT NULL,
	CONSTRAINT image_net_node_pk PRIMARY KEY (id)
);
CREATE INDEX image_net_node_left_idx ON operam.image_net_node USING btree ("left") ;
CREATE INDEX image_net_node_right_left_subtract_idx ON operam.image_net_node USING btree ((("right" - "left"))) ;
