-- Table: public.employees

DROP TABLE IF EXISTS employees;

CREATE TABLE employees
(
    emp_id SERIAL NOT NULL,
    name character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default",
    password character varying COLLATE pg_catalog."default",
    profile_photo character varying COLLATE pg_catalog."default",
    role character varying COLLATE pg_catalog."default",
    work_id character varying COLLATE pg_catalog."default" NOT NULL,
    org_id INT,
    department character varying COLLATE pg_catalog."default",
    password_reset_token character varying COLLATE pg_catalog."default",
    password_expires_time date,
    CONSTRAINT "Employees_pkey" PRIMARY KEY (emp_id),
    CONSTRAINT employee UNIQUE (email),
    CONSTRAINT fk_org_employees FOREIGN KEY(org_id) REFERENCES organizations(org_id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS issues;

CREATE TABLE public.issues
(
    issue_id SERIAL NOT NULL,
    creator_id INT,
    recipient_id INT,
    creator_location character varying COLLATE pg_catalog."default",
    title character varying COLLATE pg_catalog."default",
    message character varying COLLATE pg_catalog."default",
    category character varying COLLATE pg_catalog."default",
    photos character varying COLLATE pg_catalog."default",
    priority character varying COLLATE pg_catalog."default",
    status BOOLEAN DEFAULT 'f',
    date_created date,
    resolve_message character varying COLLATE pg_catalog."default",
    resolve_date date,
    org_id INT,
    CONSTRAINT "Issues_pkey" PRIMARY KEY (issue_id),
    CONSTRAINT fk_crt_issues FOREIGN KEY(creator_id) REFERENCES employees(emp_id) ON DELETE SET NULL,
    CONSTRAINT fk_rcpt_issues FOREIGN KEY(recipient_id) REFERENCES employees(emp_id) ON DELETE SET NULL,
    CONSTRAINT fk_org_issues FOREIGN KEY(org_id) REFERENCES organizations(org_id) ON DELETE SET NULL
);

-- Table: public.organizations

DROP TABLE IF EXISTS organizations;

CREATE TABLE public.organizations
(
    org_id SERIAL NOT NULL,
    org_name character varying COLLATE pg_catalog."default",
    org_email character varying COLLATE pg_catalog."default",
    org_password character varying COLLATE pg_catalog."default",
    emp_id integer,
    sadmin_id integer,
    colour_scheme character varying COLLATE pg_catalog."default",
    logo character varying COLLATE pg_catalog."default",
    org_status BOOLEAN DEFAULT 't',
    CONSTRAINT "Organization_pkey" PRIMARY KEY (org_id),
    CONSTRAINT organization UNIQUE (org_email),
    CONSTRAINT fk_employee FOREIGN KEY(emp_id) REFERENCES employees(emp_id) ON DELETE SET NULL,
    CONSTRAINT fk_superadmins FOREIGN KEY(sadmin_id) REFERENCES superadmins(sadmin_id) ON DELETE SET NULL
);

-- Table: public.reports

CREATE TABLE public.reports
(
    id SERIAL NOT NULL,
    issue_status character varying COLLATE pg_catalog."default",
    no_issues_per_status integer,
    issue_creator_location point,
    issue_creation_date date,
    issue_closure_date date,
    user_closed_issue character varying COLLATE pg_catalog."default",
    CONSTRAINT "Reports_pkey" PRIMARY KEY (id)
);

-- Table: public.superadmins

DROP TABLE IF EXISTS superadmins;

CREATE TABLE public.superadmins
(
    sadmin_id SERIAL NOT NULL,
    name character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default",
    password character varying COLLATE pg_catalog."default",
    phone_number character varying COLLATE pg_catalog."default",
    profile_photo character varying COLLATE pg_catalog."default",
    role character varying COLLATE pg_catalog."default",
    password_reset_token character varying COLLATE pg_catalog."default",
    password_expires_time date,
    CONSTRAINT sadmin_id PRIMARY KEY (sadmin_id),
    CONSTRAINT superadmin UNIQUE (email)
);
