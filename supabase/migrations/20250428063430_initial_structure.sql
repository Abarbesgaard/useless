create table "public"."application_stages" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "application_id" uuid,
    "name" text,
    "icon" text,
    "position" bigint,
    "is_deleted" boolean not null,
    "auth_user" uuid
);


alter table "public"."application_stages" enable row level security;

create table "public"."applications" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "company" text not null,
    "position" text not null,
    "notes" text,
    "url" text,
    "date" timestamp with time zone,
    "auth_user" uuid,
    "current_stage" bigint,
    "is_deleted" boolean
);


alter table "public"."applications" enable row level security;

CREATE UNIQUE INDEX application_stages_pkey ON public.application_stages USING btree (id);

CREATE UNIQUE INDEX applications_pkey ON public.applications USING btree (id);

alter table "public"."application_stages" add constraint "application_stages_pkey" PRIMARY KEY using index "application_stages_pkey";

alter table "public"."applications" add constraint "applications_pkey" PRIMARY KEY using index "applications_pkey";

alter table "public"."application_stages" add constraint "application_stages_application_id_fkey" FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE not valid;

alter table "public"."application_stages" validate constraint "application_stages_application_id_fkey";

alter table "public"."application_stages" add constraint "application_stages_auth_user_fkey" FOREIGN KEY (auth_user) REFERENCES auth.users(id) not valid;

alter table "public"."application_stages" validate constraint "application_stages_auth_user_fkey";

alter table "public"."applications" add constraint "applications_auth_user_fkey" FOREIGN KEY (auth_user) REFERENCES auth.users(id) not valid;

alter table "public"."applications" validate constraint "applications_auth_user_fkey";

grant delete on table "public"."application_stages" to "anon";

grant insert on table "public"."application_stages" to "anon";

grant references on table "public"."application_stages" to "anon";

grant select on table "public"."application_stages" to "anon";

grant trigger on table "public"."application_stages" to "anon";

grant truncate on table "public"."application_stages" to "anon";

grant update on table "public"."application_stages" to "anon";

grant delete on table "public"."application_stages" to "authenticated";

grant insert on table "public"."application_stages" to "authenticated";

grant references on table "public"."application_stages" to "authenticated";

grant select on table "public"."application_stages" to "authenticated";

grant trigger on table "public"."application_stages" to "authenticated";

grant truncate on table "public"."application_stages" to "authenticated";

grant update on table "public"."application_stages" to "authenticated";

grant delete on table "public"."application_stages" to "service_role";

grant insert on table "public"."application_stages" to "service_role";

grant references on table "public"."application_stages" to "service_role";

grant select on table "public"."application_stages" to "service_role";

grant trigger on table "public"."application_stages" to "service_role";

grant truncate on table "public"."application_stages" to "service_role";

grant update on table "public"."application_stages" to "service_role";

grant delete on table "public"."applications" to "anon";

grant insert on table "public"."applications" to "anon";

grant references on table "public"."applications" to "anon";

grant select on table "public"."applications" to "anon";

grant trigger on table "public"."applications" to "anon";

grant truncate on table "public"."applications" to "anon";

grant update on table "public"."applications" to "anon";

grant delete on table "public"."applications" to "authenticated";

grant insert on table "public"."applications" to "authenticated";

grant references on table "public"."applications" to "authenticated";

grant select on table "public"."applications" to "authenticated";

grant trigger on table "public"."applications" to "authenticated";

grant truncate on table "public"."applications" to "authenticated";

grant update on table "public"."applications" to "authenticated";

grant delete on table "public"."applications" to "service_role";

grant insert on table "public"."applications" to "service_role";

grant references on table "public"."applications" to "service_role";

grant select on table "public"."applications" to "service_role";

grant trigger on table "public"."applications" to "service_role";

grant truncate on table "public"."applications" to "service_role";

grant update on table "public"."applications" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."application_stages"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."application_stages"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on email"
on "public"."application_stages"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = auth_user))
with check ((( SELECT auth.uid() AS uid) = auth_user));


create policy "Enable delete for users based on user_id"
on "public"."applications"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = auth_user));


create policy "Enable insert for authenticated users only"
on "public"."applications"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."applications"
as permissive
for select
to public
using (true);



