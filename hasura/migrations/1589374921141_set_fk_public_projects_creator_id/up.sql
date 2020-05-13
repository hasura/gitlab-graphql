alter table "public"."projects"
           add constraint "projects_creator_id_fkey"
           foreign key ("creator_id")
           references "public"."users"
           ("id") on update restrict on delete restrict;
