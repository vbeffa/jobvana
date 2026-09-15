-- GENERATED FILE. DO NOT EDIT.
-- Source: reference-data/*.json
-- Regenerate with: npm run reference-data:write

begin;

insert into public.industries (id, code, name, retired_at)
values (1, 'b2b-software', 'B2B Software', null)
on conflict (code) do update set
  name = excluded.name,
  retired_at = excluded.retired_at;

insert into public.industries (id, code, name, retired_at)
values (2, 'consumer', 'Consumer', null)
on conflict (code) do update set
  name = excluded.name,
  retired_at = excluded.retired_at;

insert into public.industries (id, code, name, retired_at)
values (3, 'education', 'Education', null)
on conflict (code) do update set
  name = excluded.name,
  retired_at = excluded.retired_at;

insert into public.industries (id, code, name, retired_at)
values (4, 'financial-technology', 'Financial Technology', null)
on conflict (code) do update set
  name = excluded.name,
  retired_at = excluded.retired_at;

insert into public.industries (id, code, name, retired_at)
values (5, 'healthcare', 'Healthcare', null)
on conflict (code) do update set
  name = excluded.name,
  retired_at = excluded.retired_at;

insert into public.industries (id, code, name, retired_at)
values (6, 'industrials', 'Industrials', null)
on conflict (code) do update set
  name = excluded.name,
  retired_at = excluded.retired_at;

insert into public.industries (id, code, name, retired_at)
values (7, 'real-estate-construction', 'Real Estate & Construction', null)
on conflict (code) do update set
  name = excluded.name,
  retired_at = excluded.retired_at;

insert into public.roles (id, code, name, description, reference, retired_at)
values (1, 'software-engineer', 'Software Engineer', 'Software engineering is a branch of both computer science and engineering focused on designing, developing, testing, and maintaining software applications. It involves applying engineering principles and computer programming expertise to develop software systems that meet user needs.

The terms programmer and coder overlap software engineer, but they imply only the construction aspect of a typical software engineer workload.

A software engineer applies a software development process, which involves defining, implementing, testing, managing, and maintaining software systems, as well as developing the software development process itself.', 'https://en.wikipedia.org/wiki/Software_engineering', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  retired_at = excluded.retired_at;

insert into public.roles (id, code, name, description, reference, retired_at)
values (2, 'devops-engineer', 'DevOps Engineer', 'DevOps is the integration and automation of the software development and information technology operations.', 'https://en.wikipedia.org/wiki/DevOps', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  retired_at = excluded.retired_at;

insert into public.roles (id, code, name, description, reference, retired_at)
values (3, 'database-administrator', 'Database Administrator', 'A database administrator (DBA) manages computer databases. The role may include capacity planning, installation, configuration, database design, migration, performance monitoring, security, troubleshooting, as well as backup and data recovery.', 'https://en.wikipedia.org/wiki/Database_administrator', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  retired_at = excluded.retired_at;

insert into public.roles (id, code, name, description, reference, retired_at)
values (4, 'database-developer', 'Database Developer', 'A software developer who writes database-specific code, such as SQL queries.', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  retired_at = excluded.retired_at;

insert into public.roles (id, code, name, description, reference, retired_at)
values (5, 'qa-engineer', 'QA Engineer', 'A software engineer focused on writing tests and ensuring the quality of a software system.', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  retired_at = excluded.retired_at;

insert into public.roles (id, code, name, description, reference, retired_at)
values (6, 'software-developer', 'Software Developer', 'Software development is the process of designing and implementing a software solution to satisfy a user. The process is more encompassing than programming, writing code, in that it includes conceiving the goal, evaluating feasibility, analyzing requirements, design, testing and release. The process is part of software engineering which also includes organizational management, project management, configuration management and other aspects.', 'https://en.wikipedia.org/wiki/Software_development', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  retired_at = excluded.retired_at;

insert into public.roles (id, code, name, description, reference, retired_at)
values (7, 'site-reliability-engineer', 'Site Reliability Engineer', 'Site Reliability Engineering (SRE) is a discipline in the field of Software Engineering and IT infrastructure support that monitors and improves the availability and performance of deployed software systems and large software services.', 'https://en.wikipedia.org/wiki/Site_reliability_engineering', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  retired_at = excluded.retired_at;

insert into public.roles (id, code, name, description, reference, retired_at)
values (8, 'delivery-boy', 'Delivery Boy', 'Eats pizza and watches TV on the couch.', 'https://futurama.fandom.com/wiki/Philip_J._Fry', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  retired_at = excluded.retired_at;

insert into public.roles (id, code, name, description, reference, retired_at)
values (9, 'systems-programmer', 'Systems Programmer', 'The system programmer installs, customizes, and maintains the operating system, and also installs or upgrades products that run on the system.', 'https://www.ibm.com/docs/en/zos-basic-skills?topic=world-who-is-system-programmer', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  retired_at = excluded.retired_at;

insert into public.roles (id, code, name, description, reference, retired_at)
values (10, 'embedded-systems-programmer', 'Embedded Systems Programmer', 'Embedded software is computer software, written to control machines or devices that are not typically thought of as computers, commonly known as embedded systems. It is typically specialized for the particular hardware that it runs on and has time and memory constraints. This term is sometimes used interchangeably with firmware.', 'https://en.wikipedia.org/wiki/Embedded_software', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (1, 'general-purpose-programming-language', 'General-purpose programming language', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (2, 'runtime-system', 'Runtime system', null, 'A software system that provides an environment in which software programs run.', 'https://en.wikipedia.org/wiki/Runtime_system', 'AKA runtime environment', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (3, 'kernel', 'Kernel', null, 'A computer program at the core of a computer''s operating system.', 'https://en.wikipedia.org/wiki/Kernel_(operating_system)', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (4, 'software-library', 'Software library', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (5, 'software-framework', 'Software framework', null, 'Software that provides reusable, generic functionality which developers can extend or customize to create complete solutions.

Unlike a library, where user code controls the program''s control flow, a framework implements inversion of control by dictating the overall structure and calling user code at predefined extension points (e.g., through template methods or hooks). Frameworks also provide default behaviors that work out-of-the-box, structured mechanisms for extensibility, and a fixed core that accepts extensions (e.g., plugins or subclasses) without direct modification. ', 'https://en.wikipedia.org/wiki/Software_framework', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (6, 'domain-specific-programming-language', 'Domain-specific programming language', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (7, 'markup-language', 'Markup language', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (8, 'data-interchange-format', 'Data-interchange format', null, null, null, 'Data-interchange format implies a corresponding file format.', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (9, 'application-protocol', 'Application protocol', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (10, 'communication-protocol', 'Communication protocol', null, 'A system of rules that allows two or more entities of a communications system to transmit information via any variation of a physical quantity. The protocol defines the rules, syntax, semantics, and synchronization of communication and possible error recovery methods. Protocols may be implemented by hardware, software, or a combination of both.', 'https://en.wikipedia.org/wiki/Communication_protocol', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (11, 'software-platform', 'Software platform', null, 'The infrastructure on which software is executed.', 'https://en.wikipedia.org/wiki/Computing_platform', 'unneeded?', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (12, 'database-management-system', 'Database management system', null, 'A software system that enables users to define, create, maintain and control access to the database.', 'https://en.wikipedia.org/wiki/Database#Database_management_system', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (13, 'computer-language', 'Computer language', null, null, 'https://en.wikipedia.org/wiki/Computer_language', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (14, 'software-system', 'Software system', null, 'A system of intercommunicating components based on software forming part of a computer system (a combination of hardware and software).
', 'https://en.wikipedia.org/wiki/Software_system', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (15, 'relational-database-management-system', 'Relational database management system', null, 'A type of database management system that stores data in a structured format using rows and columns.', 'https://en.wikipedia.org/wiki/Relational_database', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (16, 'document-database-management-system', 'Document database management system', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (17, 'multi-model-database-management-system', 'Multi-model database management system', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (18, 'software', 'Software', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (19, 'programming-language', 'Programming language', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (20, 'structural-language', 'Structural language', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (21, 'style-sheet-language', 'Style sheet language', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (22, 'software-program', 'Software program', null, 'A sequence or set of instructions in a programming language for a computer to execute. It is one component of software, which also includes documentation and other intangible components.', 'https://en.wikipedia.org/wiki/Computer_program', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (23, 'software-programming-tool', 'Software programming tool', null, 'A programming tool or software development tool is a computer program that is used to develop another computer program, usually by helping the developer manage computer files.', 'https://en.wikipedia.org/wiki/Programming_tool', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (24, 'software-build-tool', 'Software build tool', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (25, 'system-software', 'System software', null, 'Software that provides a platform for other software.', 'https://en.wikipedia.org/wiki/System_software', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (26, 'operating-system', 'Operating system', null, 'System software that manages computer hardware and software resources, and provides common services for computer programs.', 'https://en.wikipedia.org/wiki/Operating_system', '', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (27, 'web-development-framework', 'Web development framework', null, 'A software framework that is designed to support the development of web applications including web services, web resources, and web APIs.', 'https://en.wikipedia.org/wiki/Web_framework', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (28, 'css-framework', 'CSS framework', null, 'A library allowing for easier, more standards-compliant web design using the Cascading Style Sheets language.', 'https://en.wikipedia.org/wiki/CSS_framework', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (29, 'middleware', 'Middleware', null, 'A type of software framework that provides services to software applications beyond those available from the operating system. It is sometimes described as "software glue."', 'https://en.wikipedia.org/wiki/Middleware', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_categories (id, code, name, parent_skill_category_id, description, reference, notes, retired_at)
values (30, 'electronic-data-interchange', 'Electronic data interchange', null, 'Electronic data interchange (EDI) is the concept of businesses electronically communicating information that was traditionally communicated on paper, such as purchase orders, advance ship notices, and invoices. Technical standards for EDI exist to facilitate parties transacting such instruments without having to make special arrangements.', 'https://en.wikipedia.org/wiki/Electronic_data_interchange', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'programming-language')
where code = 'general-purpose-programming-language';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software-system')
where code = 'runtime-system';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software-program')
where code = 'kernel';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software')
where code = 'software-library';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software')
where code = 'software-framework';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'programming-language')
where code = 'domain-specific-programming-language';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'structural-language')
where code = 'markup-language';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'electronic-data-interchange')
where code = 'data-interchange-format';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'communication-protocol')
where code = 'application-protocol';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'electronic-data-interchange')
where code = 'communication-protocol';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software')
where code = 'software-platform';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software-system')
where code = 'database-management-system';

update public.skill_categories
set parent_skill_category_id = null
where code = 'computer-language';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software')
where code = 'software-system';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'database-management-system')
where code = 'relational-database-management-system';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'database-management-system')
where code = 'document-database-management-system';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'database-management-system')
where code = 'multi-model-database-management-system';

update public.skill_categories
set parent_skill_category_id = null
where code = 'software';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'computer-language')
where code = 'programming-language';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'computer-language')
where code = 'structural-language';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'structural-language')
where code = 'style-sheet-language';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software')
where code = 'software-program';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software-program')
where code = 'software-programming-tool';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software-programming-tool')
where code = 'software-build-tool';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software')
where code = 'system-software';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software-system')
where code = 'operating-system';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software-framework')
where code = 'web-development-framework';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software-library')
where code = 'css-framework';

update public.skill_categories
set parent_skill_category_id = (select id from public.skill_categories where code = 'software-framework')
where code = 'middleware';

update public.skill_categories
set parent_skill_category_id = null
where code = 'electronic-data-interchange';

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (1, 'microsoft-sql-server', 'Microsoft SQL Server', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (2, 'node-js', 'Node.js', 'Node.js® is a free, open-source, cross-platform JavaScript runtime environment that lets developers create servers, web apps, command line tools and scripts.', null, 'https://nodejs.org/', 'V8 is Google''s open source high-performance JavaScript and WebAssembly engine, written in C++. It is used in Chrome and in Node.js, among others.

See https://v8.dev/docs.
', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (3, 'java', 'Java', 'Created by James Gosling', null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (4, 'javascript', 'JavaScript', null, null, 'https://262.ecma-international.org/', 'Per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/JavaScript_technologies_overview:

The core language of JavaScript is standardized by the ECMA TC39 committee as a language named ECMAScript. "ECMAScript" is the term for the language standard, but "ECMAScript" and "JavaScript" can be used interchangeably.

Among other things, ECMAScript defines:

  • Language syntax (parsing rules, keywords, control flow, object literal initialization, ...)
  • Error handling mechanisms (throw, try...catch, ability to create user-defined Error types)
  • Types (boolean, number, string, function, object, ...)
  • A prototype-based inheritance mechanism
  • Built-in objects and functions, including JSON, Math, Array methods, parseInt, decodeURI, etc.
  • Strict mode
  • A module system
  • Basic memory model
', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (5, 'oracle', 'Oracle', null, null, 'https://docs.oracle.com/en/database/oracle/oracle-database/index.html', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (6, 'postgres', 'Postgres', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (7, 'rust', 'Rust', 'Rust is a general-purpose programming language noted for its emphasis on performance, type safety, concurrency, and memory safety.', null, 'https://en.wikipedia.org/wiki/Rust_(programming_language)', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (8, 'macos', 'macOS', null, null, 'https://en.wikipedia.org/wiki/MacOS', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (9, 'windows', 'Windows', null, null, null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (10, 'linux', 'Linux', 'A family of open source Unix-like operating systems based on the Linux kernel.', null, 'https://en.wikipedia.org/wiki/Linux', 'Should this be under an "operating system family" category?', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (11, 'red-hat-enterprise-linux', 'Red Hat Enterprise Linux', null, 'RHEL', null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (12, 'react', 'React', 'A front-end JavaScript library for building user interfaces based on components. It is maintained by Meta (formerly Facebook) and a community of individual developers and companies.', null, 'https://en.wikipedia.org/wiki/React_(software)', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (13, 'next-js', 'Next.js', null, null, 'https://en.wikipedia.org/wiki/Next.js', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (14, 'remix', 'Remix', null, null, 'https://remix.run/', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (15, 'structured-query-language', 'Structured Query Language', null, 'SQL', 'https://en.wikipedia.org/wiki/SQL', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (16, 'hypertext-markup-language', 'Hypertext Markup Language', 'Hypertext Markup Language (HTML) is the standard markup language[a] for documents designed to be displayed in a web browser. It defines the content and structure of web content. It is often assisted by technologies such as Cascading Style Sheets (CSS) and scripting languages such as JavaScript.', 'HTML', 'https://html.spec.whatwg.org/', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (17, 'extensible-markup-language-format', 'Extensible Markup Language (format)', 'Extensible Markup Language (XML) is a simple, very flexible text format derived from SGML (ISO 8879). Originally designed to meet the challenges of large-scale electronic publishing, XML is also playing an increasingly important role in the exchange of a wide variety of data on the Web and elsewhere.', 'XML', 'https://www.w3.org/XML/', 'This duplicates a corresponding skill under Markup languages.', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (18, 'javascript-object-notation', 'JavaScript Object Notation', 'JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is based on a subset of the JavaScript Programming Language Standard ECMA-262 3rd Edition - December 1999.', 'JSON', 'https://www.json.org/', 'RFC 8259 - see https://www.rfc-editor.org/rfc/rfc8259.txt.', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (19, 'ldap-data-interchange-format', 'LDAP Data Interchange Format', null, 'LDIF', 'https://en.wikipedia.org/wiki/LDAP_Data_Interchange_Format', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (20, 'internet-protocol-suite', 'Internet protocol suite', null, 'TCP/IP', null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (21, 'transmission-control-protocol', 'Transmission Control Protocol', null, 'TCP', null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (22, 'internet-protocol', 'Internet Protocol', null, 'IP', null, null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (23, 'lightweight-directory-access-protocol', 'Lightweight Directory Access Protocol', null, 'LDAP', 'https://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (24, 'cascading-style-sheets', 'Cascading Style Sheets', null, 'CSS', 'https://www.w3.org/TR/css/', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (25, 'windows-server', 'Windows Server', null, null, '', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (26, 'mongodb', 'MongoDB', 'MongoDB is a source-available, cross-platform, document-oriented database program. Classified as a NoSQL database product, MongoDB uses JSON-like documents with optional schemas.', null, 'https://en.wikipedia.org/wiki/MongoDB', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (27, 'vite', 'Vite', 'A build tool that aims to provide a faster and leaner development experience for modern web projects.', null, 'https://vite.dev/guide/', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (28, 'tailwind-css', 'Tailwind CSS', 'A utility-first CSS framework.', 'Tailwind', 'https://en.wikipedia.org/wiki/Tailwind_CSS', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (29, 'lodash', 'Lodash', 'A modern JavaScript utility library delivering modularity, performance & extras.', null, 'https://lodash.com/', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (30, 'go', 'Go', 'Go is a high-level general purpose programming language that is statically typed and compiled.', null, 'https://go.dev/', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (31, 'linux-kernel', 'Linux kernel', 'A free and open-source  Unix-like kernel that is used in many computer systems worldwide. The kernel was created by Linus Torvalds in 1991 and was soon adopted as the kernel for the GNU operating system (OS) which was created to be a free replacement for Unix.', null, 'https://en.wikipedia.org/wiki/Linux_kernel', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (32, 'java-virtual-machine', 'Java Virtual Machine', 'A virtual machine that enables a computer to run Java programs as well as programs written in other languages that are also compiled to Java bytecode.', 'JVM', 'https://en.wikipedia.org/wiki/Java_virtual_machine', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (33, 'typescript', 'TypeScript', 'A high-level programming language that adds static typing with optional type annotations to JavaScript.', null, 'https://en.wikipedia.org/wiki/TypeScript', null, null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skills (id, code, name, description, abbreviation, reference, notes, retired_at)
values (34, 'extensible-markup-language', 'Extensible Markup Language', 'Extensible Markup Language (XML) is a simple, very flexible text format derived from SGML (ISO 8879). Originally designed to meet the challenges of large-scale electronic publishing, XML is also playing an increasingly important role in the exchange of a wide variety of data on the Web and elsewhere.', 'XML', 'https://www.w3.org/XML/', 'This duplicates a corresponding skill under Data-interchange formats.', null)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  abbreviation = excluded.abbreviation,
  reference = excluded.reference,
  notes = excluded.notes,
  retired_at = excluded.retired_at;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'relational-database-management-system'
where s.code = 'microsoft-sql-server'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'runtime-system'
where s.code = 'node-js'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'general-purpose-programming-language'
where s.code = 'java'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'general-purpose-programming-language'
where s.code = 'javascript'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'multi-model-database-management-system'
where s.code = 'oracle'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'relational-database-management-system'
where s.code = 'postgres'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'general-purpose-programming-language'
where s.code = 'rust'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'operating-system'
where s.code = 'macos'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'operating-system'
where s.code = 'windows'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'operating-system'
where s.code = 'linux'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'operating-system'
where s.code = 'red-hat-enterprise-linux'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'software-library'
where s.code = 'react'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'web-development-framework'
where s.code = 'next-js'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'web-development-framework'
where s.code = 'remix'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'domain-specific-programming-language'
where s.code = 'structured-query-language'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'markup-language'
where s.code = 'hypertext-markup-language'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'data-interchange-format'
where s.code = 'extensible-markup-language-format'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'data-interchange-format'
where s.code = 'javascript-object-notation'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'data-interchange-format'
where s.code = 'ldap-data-interchange-format'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'communication-protocol'
where s.code = 'internet-protocol-suite'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'communication-protocol'
where s.code = 'transmission-control-protocol'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'communication-protocol'
where s.code = 'internet-protocol'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'application-protocol'
where s.code = 'lightweight-directory-access-protocol'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'style-sheet-language'
where s.code = 'cascading-style-sheets'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'operating-system'
where s.code = 'windows-server'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'document-database-management-system'
where s.code = 'mongodb'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'software-build-tool'
where s.code = 'vite'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'css-framework'
where s.code = 'tailwind-css'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'software-library'
where s.code = 'lodash'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'general-purpose-programming-language'
where s.code = 'go'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'kernel'
where s.code = 'linux-kernel'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'runtime-system'
where s.code = 'java-virtual-machine'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'general-purpose-programming-language'
where s.code = 'typescript'
on conflict do nothing;

insert into public.skill_category_memberships (skill_id, skill_category_id)
select s.id, c.id
from public.skills s
join public.skill_categories c on c.code = 'markup-language'
where s.code = 'extensible-markup-language'
on conflict do nothing;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 3, s.id, 'sql-server-2017', 'SQL Server 2017', 'https://learn.microsoft.com/en-us/troubleshoot/sql/releases/sqlserver-2017/build-versions', null, '2017-09-29', 1, null
from public.skills s
where s.code = 'microsoft-sql-server'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 2, s.id, 'sql-server-2019', 'SQL Server 2019', 'https://learn.microsoft.com/en-us/troubleshoot/sql/releases/sqlserver-2019/build-versions', null, '2019-11-04', 2, null
from public.skills s
where s.code = 'microsoft-sql-server'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 1, s.id, 'sql-server-2022', 'SQL Server 2022', 'https://learn.microsoft.com/en-us/troubleshoot/sql/releases/sqlserver-2022/build-versions', null, '2022-11-16', 3, null
from public.skills s
where s.code = 'microsoft-sql-server'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 6, s.id, 'v20', 'v20', 'https://nodejs.org/en/blog/release/v20.9.0/', null, '2023-10-24', 1, null
from public.skills s
where s.code = 'node-js'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 5, s.id, 'v22', 'v22', 'https://nodejs.org/en/blog/release/v22.0.0', null, '2024-04-24', 2, null
from public.skills s
where s.code = 'node-js'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 4, s.id, 'v24', 'v24', 'https://nodejs.org/en/blog/release/v24.0.0', null, '2025-05-06', 3, null
from public.skills s
where s.code = 'node-js'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 9, s.id, 'jdk-22', 'JDK 22', 'https://www.oracle.com/java/technologies/javase/22all-relnotes.html', null, '2024-07-16', 1, null
from public.skills s
where s.code = 'java'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 8, s.id, 'jdk-23', 'JDK 23', 'https://www.oracle.com/java/technologies/javase/23all-relnotes.html', null, '2025-01-21', 2, null
from public.skills s
where s.code = 'java'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 7, s.id, 'jdk-24', 'JDK 24', 'https://www.oracle.com/java/technologies/javase/24all-relnotes.html', null, '2025-07-15', 3, null
from public.skills s
where s.code = 'java'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 12, s.id, 'es2023', 'ES2023', 'https://github.com/tc39/ecma262/releases/tag/es2023', null, '2023-06-07', 1, null
from public.skills s
where s.code = 'javascript'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 11, s.id, 'es2024', 'ES2024', 'https://github.com/tc39/ecma262/releases/tag/es2024', null, '2024-06-26', 2, null
from public.skills s
where s.code = 'javascript'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 10, s.id, 'es2025', 'ES2025', 'https://github.com/tc39/ecma262/releases/tag/es2025', null, '2025-06-29', 3, null
from public.skills s
where s.code = 'javascript'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 15, s.id, '19c', '19c', 'https://blogs.oracle.com/database/post/oracle-database-19c-now-available-on-oracle-exadata', null, '2019-02-13', 1, null
from public.skills s
where s.code = 'oracle'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 14, s.id, '21c', '21c', 'https://blogs.oracle.com/database/post/introducing-oracle-database-21c', null, '2021-01-13', 2, null
from public.skills s
where s.code = 'oracle'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 13, s.id, '23ai', '23ai', 'https://blogs.oracle.com/database/post/oracle-23ai-now-generally-available', null, '2024-05-02', 3, null
from public.skills s
where s.code = 'oracle'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 18, s.id, '15', '15', 'https://www.postgresql.org/support/versioning/', null, '2022-10-13', 1, null
from public.skills s
where s.code = 'postgres'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 17, s.id, '16', '16', 'https://www.postgresql.org/support/versioning/', null, '2023-09-14', 2, null
from public.skills s
where s.code = 'postgres'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 16, s.id, '17', '17', 'https://www.postgresql.org/support/versioning/', null, '2024-09-26', 3, null
from public.skills s
where s.code = 'postgres'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 21, s.id, '1-87-0', '1.87.0', 'https://blog.rust-lang.org/2025/05/15/Rust-1.87.0/', null, '2025-05-15', 1, null
from public.skills s
where s.code = 'rust'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 20, s.id, '1-88-0', '1.88.0', 'https://blog.rust-lang.org/2025/06/26/Rust-1.88.0/', null, '2025-06-26', 2, null
from public.skills s
where s.code = 'rust'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 19, s.id, '1-89-0', '1.89.0', 'https://blog.rust-lang.org/2025/08/07/Rust-1.89.0/', null, '2025-08-07', 3, null
from public.skills s
where s.code = 'rust'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 24, s.id, 'sonoma-14', 'Sonoma 14', 'https://support.apple.com/en-us/120950', null, '2023-09-26', 1, null
from public.skills s
where s.code = 'macos'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 23, s.id, 'sequoia-15', 'Sequoia 15', 'https://support.apple.com/en-us/121238', null, '2024-09-16', 2, null
from public.skills s
where s.code = 'macos'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 22, s.id, 'tahoe-26', 'Tahoe 26', 'https://en.wikipedia.org/wiki/MacOS_Tahoe', null, '2025-09-15', 3, null
from public.skills s
where s.code = 'macos'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 27, s.id, '8', '8', 'https://web.archive.org/web/20121027202517/https://blogs.windows.com/windows/b/bloggingwindows/archive/2012/10/25/windows-reimagined-windows8.aspx', null, '2012-10-25', 1, null
from public.skills s
where s.code = 'windows'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 26, s.id, '10', '10', 'https://en.wikipedia.org/wiki/Windows_10_version_history', null, '2015-07-29', 2, null
from public.skills s
where s.code = 'windows'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 25, s.id, '11', '11', 'https://blogs.windows.com/windowsexperience/2021/10/04/windows-11-a-new-era-for-the-pc-begins-today/', null, '2021-10-04', 3, null
from public.skills s
where s.code = 'windows'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 30, s.id, '4', '4', 'https://lkml.org/lkml/2015/4/12/178', null, '2015-04-12', 1, null
from public.skills s
where s.code = 'linux'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 29, s.id, '5', '5', 'https://lkml.iu.edu/hypermail/linux/kernel/1903.0/01288.html', null, '2019-03-03', 2, null
from public.skills s
where s.code = 'linux'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 28, s.id, '6', '6', 'https://lore.kernel.org/lkml/CAHk-=wiaGf66EQOq1FwM6p9c3mGOjzm9stGeUTfC5Txx4yoxgg@mail.gmail.com/T/#u', null, '2022-10-02', 3, null
from public.skills s
where s.code = 'linux'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 33, s.id, '8', '8', 'https://web.archive.org/web/20201130234314/https://access.redhat.com/announcements/4110231', null, '2019-05-07', 1, null
from public.skills s
where s.code = 'red-hat-enterprise-linux'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 32, s.id, '9', '9', 'https://www.redhat.com/en/about/press-releases/red-hat-defines-new-epicenter-innovation-red-hat-enterprise-linux-9', null, '2022-05-10', 2, null
from public.skills s
where s.code = 'red-hat-enterprise-linux'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 31, s.id, '10-0', '10.0', 'https://en.wikipedia.org/wiki/Red_Hat_Enterprise_Linux', null, '2025-05-13', 3, null
from public.skills s
where s.code = 'red-hat-enterprise-linux'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 36, s.id, '17', '17', 'https://legacy.reactjs.org/blog/2020/10/20/react-v17.html', null, '2020-10-20', 1, null
from public.skills s
where s.code = 'react'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 35, s.id, '18', '18', 'https://18.react.dev/blog/2022/03/29/react-v18', null, '2022-03-29', 2, null
from public.skills s
where s.code = 'react'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 34, s.id, '19', '19', 'https://react.dev/blog/2024/12/05/react-19', null, '2024-12-05', 3, null
from public.skills s
where s.code = 'react'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 39, s.id, '13', '13', 'https://nextjs.org/blog/next-13', null, '2022-10-25', 1, null
from public.skills s
where s.code = 'next-js'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 38, s.id, '14', '14', 'https://github.com/vercel/next.js/releases/tag/v14.0.0', null, '2023-10-26', 2, null
from public.skills s
where s.code = 'next-js'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 37, s.id, '15', '15', 'https://github.com/vercel/next.js/releases/tag/v15.0.0', null, '2024-10-21', 3, null
from public.skills s
where s.code = 'next-js'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 41, s.id, '1-19-3', '1.19.3', 'https://github.com/remix-run/remix/releases/tag/remix%401.19.3', null, '2023-08-09', 1, null
from public.skills s
where s.code = 'remix'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 40, s.id, '2-17-0', '2.17.0', 'https://github.com/remix-run/remix/releases/tag/remix%402.17.0', null, '2025-07-25', 2, null
from public.skills s
where s.code = 'remix'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 44, s.id, 'sql-2011', 'SQL:2011', 'https://en.wikipedia.org/wiki/SQL:2011', null, '2011-12-01', 1, null
from public.skills s
where s.code = 'structured-query-language'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 43, s.id, 'sql-2016', 'SQL:2016', 'https://www.iso.org/standard/63555.html', null, '2016-12-01', 2, null
from public.skills s
where s.code = 'structured-query-language'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 42, s.id, 'sql-2023', 'SQL:2023', 'https://www.iso.org/standard/76586.html', null, '2023-06-01', 3, null
from public.skills s
where s.code = 'structured-query-language'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 53, s.id, '4-1999', '4 (1999)', 'https://www.w3.org/TR/html40/', null, '1999-12-24', 1, null
from public.skills s
where s.code = 'hypertext-markup-language'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 52, s.id, '5-2017', '5 (2017)', 'https://www.w3.org/TR/2021/SPSD-html52-20210128/', null, '2021-01-28', 2, null
from public.skills s
where s.code = 'hypertext-markup-language'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 51, s.id, 'ls', 'LS', 'https://html.spec.whatwg.org/', 'https://html.spec.whatwg.org/multipage/introduction.html#is-this-html5 states

"In short: Yes.

"In more length: the term ''HTML5'' is widely used as a buzzword to refer to modern web technologies, many of which (though by no means all) are developed at the WHATWG. This document is one such; others are available from the WHATWG Standards overview."', '2025-09-13', 3, null
from public.skills s
where s.code = 'hypertext-markup-language'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 46, s.id, '1-1', '1.1', 'https://www.w3.org/TR/2006/REC-xml11-20060816/', 'XML 1.1 is not very widely implemented and is recommended for use only by those who need its particular features.

See https://en.wikipedia.org/wiki/XML#Versions.', '2006-08-16', 1, null
from public.skills s
where s.code = 'extensible-markup-language-format'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 45, s.id, '1-0', '1.0', 'https://www.w3.org/TR/2008/REC-xml-20081126/', null, '2008-11-26', 2, null
from public.skills s
where s.code = 'extensible-markup-language-format'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 50, s.id, '2017', '2017', 'https://www.rfc-editor.org/rfc/rfc8259.txt', null, '2017-12-01', 1, null
from public.skills s
where s.code = 'javascript-object-notation'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 49, s.id, '1', '1', 'https://www.rfc-editor.org/rfc/rfc2849', null, '2000-06-01', 1, null
from public.skills s
where s.code = 'ldap-data-interchange-format'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 48, s.id, 'version-2', 'version 2', 'https://www.rfc-editor.org/rfc/rfc1777', null, '1995-03-01', 1, null
from public.skills s
where s.code = 'lightweight-directory-access-protocol'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 47, s.id, 'version-3', 'version 3', '  https://datatracker.ietf.org/doc/html/rfc4511', null, '2006-06-01', 2, null
from public.skills s
where s.code = 'lightweight-directory-access-protocol'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 56, s.id, 'level-1', 'Level 1', 'https://www.w3.org/TR/2008/REC-CSS1-20080411/', 'The CSS Working Group considers the CSS1 specification to be obsolete. CSS Level 1 is defined as all the features defined in the CSS1 specification (properties, values, at-rules, etc), but using the syntax and definitions in the CSS2.1 specification. CSS Style Attributes defines its inclusion in element-specific style attributes. ', '1996-12-17', 1, null
from public.skills s
where s.code = 'cascading-style-sheets'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 55, s.id, 'level-2', 'Level 2', 'https://www.w3.org/TR/2008/REC-CSS2-20080411/', 'Although the CSS2 specification is technically a W3C Recommendation, it passed into the Recommendation stage before the W3C had defined the Candidate Recommendation stage. Over time implementation experience and further review has brought to light many problems in the CSS2 specification, so instead of expanding an already unwieldy errata list, the CSS Working Group chose to define CSS Level 2 Revision 1 (CSS2.1). In case of any conflict between the two specs CSS2.1 contains the definitive definition.

Once CSS2.1 became Candidate Recommendation—effectively though not officially the same level of stability as CSS2—obsoleted the CSS2 Recommendation. Features in CSS2 that were dropped from CSS2.1 should be considered to be at the Candidate Recommendation stage, but note that many of these have been or will be pulled into a CSS Level 3 working draft, in which case that specification will, once it reaches CR, obsolete the definitions in CSS2.

The CSS2.1 specification defines CSS Level 2 and the CSS Style Attributes specification defines its inclusion in element-specific style attributes.', '1998-05-12', 2, null
from public.skills s
where s.code = 'cascading-style-sheets'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 54, s.id, 'level-3', 'Level 3', 'https://www.w3.org/TR/2025/NOTE-css-2025-20250909/', '"CSS Level 3" as a term is used only to differentiate it from the previous monolithic versions.', '2025-09-09', 3, null
from public.skills s
where s.code = 'cascading-style-sheets'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 59, s.id, '2019', '2019', 'https://en.wikipedia.org/wiki/Windows_Server_2019', null, '2018-10-02', 1, null
from public.skills s
where s.code = 'windows-server'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 58, s.id, '2022', '2022', 'https://en.wikipedia.org/wiki/Windows_Server_2022', null, '2021-08-18', 2, null
from public.skills s
where s.code = 'windows-server'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 57, s.id, '2025', '2025', 'https://en.wikipedia.org/wiki/Windows_Server_2025', null, '2024-11-01', 3, null
from public.skills s
where s.code = 'windows-server'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 62, s.id, '6-0', '6.0', 'https://www.mongodb.com/docs/v6.0/release-notes/', null, '2022-07-19', 1, null
from public.skills s
where s.code = 'mongodb'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 61, s.id, '7-0', '7.0', 'https://www.mongodb.com/docs/v7.0/release-notes/7.0/', null, '2023-08-15', 2, null
from public.skills s
where s.code = 'mongodb'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 60, s.id, '8-0', '8.0', 'https://www.mongodb.com/docs/manual/release-notes/8.0/', null, '2024-10-02', 3, null
from public.skills s
where s.code = 'mongodb'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 65, s.id, 'v5', 'v5', 'https://github.com/vitejs/vite/releases/tag/v5.0.0', null, '2023-11-16', 1, null
from public.skills s
where s.code = 'vite'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 64, s.id, 'v6', 'v6', 'https://github.com/vitejs/vite/releases/tag/v6.0.0', null, '2024-11-26', 2, null
from public.skills s
where s.code = 'vite'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 63, s.id, 'v7', 'v7', 'https://github.com/vitejs/vite/releases/tag/v7.0.0', null, '2025-06-24', 3, null
from public.skills s
where s.code = 'vite'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 68, s.id, 'v2-2-19', 'v2.2.19', 'https://github.com/tailwindlabs/tailwindcss/releases/tag/v2.2.19', null, '2021-10-29', 1, null
from public.skills s
where s.code = 'tailwind-css'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 67, s.id, 'v3-4-17', 'v3.4.17', 'https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.4.17', null, '2024-12-17', 2, null
from public.skills s
where s.code = 'tailwind-css'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 66, s.id, 'v4-1-12', 'v4.1.12', 'https://github.com/tailwindlabs/tailwindcss/releases/tag/v4.1.12', null, '2025-08-14', 3, null
from public.skills s
where s.code = 'tailwind-css'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 71, s.id, '2-4-2', '2.4.2', 'https://github.com/lodash/lodash/releases/tag/2.0.0', null, '2013-09-14', 1, null
from public.skills s
where s.code = 'lodash'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 70, s.id, '3-10-1', '3.10.1', 'https://github.com/lodash/lodash/releases/tag/3.0.0', null, '2015-01-26', 2, null
from public.skills s
where s.code = 'lodash'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 69, s.id, '4-0-0', '4.0.0', 'https://github.com/lodash/lodash/releases/tag/4.0.0', null, '2016-01-12', 3, null
from public.skills s
where s.code = 'lodash'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 74, s.id, 'go1-23-0', 'go1.23.0', 'https://go.dev/doc/go1.23', null, '2024-08-13', 1, null
from public.skills s
where s.code = 'go'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 73, s.id, 'go1-24-0', 'go1.24.0', 'https://go.dev/doc/go1.24', null, '2025-02-11', 2, null
from public.skills s
where s.code = 'go'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 72, s.id, 'go1-25-0', 'go1.25.0', 'https://go.dev/doc/go1.25', null, '2025-08-12', 3, null
from public.skills s
where s.code = 'go'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 76, s.id, '4-1-6', '4.1.6', 'https://github.com/microsoft/TypeScript/releases/tag/v4.1.6', null, '2021-06-17', 2, null
from public.skills s
where s.code = 'typescript'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_versions (id, skill_id, code, version, reference, notes, release_date, ordinal, retired_at)
select 75, s.id, '5-9-2', '5.9.2', 'https://github.com/microsoft/TypeScript/releases/tag/v5.9.2', null, '2025-07-31', 3, null
from public.skills s
where s.code = 'typescript'
on conflict (skill_id, code) do update set
  version = excluded.version,
  reference = excluded.reference,
  notes = excluded.notes,
  release_date = excluded.release_date,
  ordinal = excluded.ordinal,
  retired_at = excluded.retired_at;

insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
select s.id, r.id, true
from public.skills s
join public.skills r on r.code = 'internet-protocol-suite'
where s.code = 'internet-protocol'
on conflict (skill_id, related_skill_id) do update set
  is_bidirectional = excluded.is_bidirectional;

insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
select s.id, r.id, true
from public.skills s
join public.skills r on r.code = 'lightweight-directory-access-protocol'
where s.code = 'ldap-data-interchange-format'
on conflict (skill_id, related_skill_id) do update set
  is_bidirectional = excluded.is_bidirectional;

insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
select s.id, r.id, false
from public.skills s
join public.skills r on r.code = 'structured-query-language'
where s.code = 'microsoft-sql-server'
on conflict (skill_id, related_skill_id) do update set
  is_bidirectional = excluded.is_bidirectional;

insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
select s.id, r.id, false
from public.skills s
join public.skills r on r.code = 'react'
where s.code = 'next-js'
on conflict (skill_id, related_skill_id) do update set
  is_bidirectional = excluded.is_bidirectional;

insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
select s.id, r.id, false
from public.skills s
join public.skills r on r.code = 'javascript'
where s.code = 'node-js'
on conflict (skill_id, related_skill_id) do update set
  is_bidirectional = excluded.is_bidirectional;

insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
select s.id, r.id, false
from public.skills s
join public.skills r on r.code = 'structured-query-language'
where s.code = 'oracle'
on conflict (skill_id, related_skill_id) do update set
  is_bidirectional = excluded.is_bidirectional;

insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
select s.id, r.id, false
from public.skills s
join public.skills r on r.code = 'structured-query-language'
where s.code = 'postgres'
on conflict (skill_id, related_skill_id) do update set
  is_bidirectional = excluded.is_bidirectional;

insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
select s.id, r.id, false
from public.skills s
join public.skills r on r.code = 'javascript'
where s.code = 'react'
on conflict (skill_id, related_skill_id) do update set
  is_bidirectional = excluded.is_bidirectional;

insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
select s.id, r.id, false
from public.skills s
join public.skills r on r.code = 'linux'
where s.code = 'red-hat-enterprise-linux'
on conflict (skill_id, related_skill_id) do update set
  is_bidirectional = excluded.is_bidirectional;

insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
select s.id, r.id, false
from public.skills s
join public.skills r on r.code = 'react'
where s.code = 'remix'
on conflict (skill_id, related_skill_id) do update set
  is_bidirectional = excluded.is_bidirectional;

insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
select s.id, r.id, false
from public.skills s
join public.skills r on r.code = 'cascading-style-sheets'
where s.code = 'tailwind-css'
on conflict (skill_id, related_skill_id) do update set
  is_bidirectional = excluded.is_bidirectional;

insert into public.skill_relations (skill_id, related_skill_id, is_bidirectional)
select s.id, r.id, true
from public.skills s
join public.skills r on r.code = 'internet-protocol-suite'
where s.code = 'transmission-control-protocol'
on conflict (skill_id, related_skill_id) do update set
  is_bidirectional = excluded.is_bidirectional;

commit;
