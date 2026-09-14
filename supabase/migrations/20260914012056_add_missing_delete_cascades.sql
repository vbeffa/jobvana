alter table public.application_events
drop constraint application_events_user_id_fkey,
add constraint application_events_user_id_fkey
foreign key (user_id)
references auth.users (id)
on update cascade
on delete cascade;

alter table public.interview_round_events
drop constraint interview_events_user_id_fkey,
add constraint interview_events_user_id_fkey
foreign key (user_id)
references auth.users (id)
on update cascade
on delete cascade;

alter table public.interview_round_events
drop constraint interview_round_events_interview_round_id_fkey,
add constraint interview_round_events_interview_round_id_fkey
foreign key (interview_round_id)
references public.interview_rounds (id)
on update cascade
on delete cascade;
