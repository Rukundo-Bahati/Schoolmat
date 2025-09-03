--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: notifications_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notifications_status_enum AS ENUM (
    'unread',
    'read'
);


ALTER TYPE public.notifications_status_enum OWNER TO postgres;

--
-- Name: notifications_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notifications_type_enum AS ENUM (
    'order_status',
    'payment_success',
    'payment_failed',
    'stock_low',
    'order_delivered',
    'general'
);


ALTER TYPE public.notifications_type_enum OWNER TO postgres;

--
-- Name: orders_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orders_status_enum AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
);


ALTER TYPE public.orders_status_enum OWNER TO postgres;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_role_enum AS ENUM (
    'parent',
    'school_manager',
    'admin'
);


ALTER TYPE public.users_role_enum OWNER TO postgres;

--
-- Name: users_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_status_enum AS ENUM (
    'active',
    'inactive',
    'suspended'
);


ALTER TYPE public.users_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid,
    "productId" uuid,
    "productName" character varying NOT NULL,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    category character varying NOT NULL,
    "imageUrl" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "imageUrl" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_preferences (
    id character varying(50) NOT NULL,
    "emailNotifications" boolean DEFAULT true NOT NULL,
    "smsNotifications" boolean DEFAULT true NOT NULL,
    "orderConfirmations" boolean DEFAULT true NOT NULL,
    "deliveryUpdates" boolean DEFAULT true NOT NULL,
    "paymentReminders" boolean DEFAULT true NOT NULL,
    "lowStockAlerts" boolean DEFAULT true NOT NULL,
    "newOrderAlerts" boolean DEFAULT true NOT NULL,
    "marketingEmails" boolean DEFAULT false NOT NULL,
    "emailRecipients" text,
    "smsRecipients" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notification_preferences OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    "orderId" character varying(255),
    "isRead" boolean DEFAULT false NOT NULL,
    metadata json,
    "userId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    type character varying(20) DEFAULT 'general'::character varying NOT NULL,
    status character varying(20) DEFAULT 'unread'::character varying NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "orderId" uuid,
    "productId" uuid,
    "productName" character varying NOT NULL,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    category character varying NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid,
    "parentName" character varying NOT NULL,
    "parentEmail" character varying NOT NULL,
    "parentPhone" character varying NOT NULL,
    "studentName" character varying NOT NULL,
    "studentGrade" character varying NOT NULL,
    "studentClass" character varying NOT NULL,
    "totalAmount" numeric NOT NULL,
    "orderDate" timestamp without time zone DEFAULT now() NOT NULL,
    "paymentMethod" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    status public.orders_status_enum DEFAULT 'pending'::public.orders_status_enum NOT NULL,
    "deliveryAddress" character varying
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: payment_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_methods (
    id character varying(50) NOT NULL,
    type character varying(20) NOT NULL,
    provider character varying(30) NOT NULL,
    name character varying(100) NOT NULL,
    "accountNumber" character varying(50),
    "accountName" character varying(100),
    "isActive" boolean DEFAULT true NOT NULL,
    instructions text,
    "sortOrder" integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payment_methods OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    category character varying NOT NULL,
    price numeric NOT NULL,
    stock integer NOT NULL,
    "minStock" integer NOT NULL,
    required boolean NOT NULL,
    supplier character varying NOT NULL,
    "imageUrl" character varying NOT NULL,
    "lastUpdated" timestamp without time zone DEFAULT now() NOT NULL,
    description character varying,
    rating numeric DEFAULT '0'::numeric NOT NULL,
    reviews integer DEFAULT 0 NOT NULL,
    "cloudinaryPublicId" character varying
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid,
    "customerName" character varying NOT NULL,
    "customerEmail" character varying NOT NULL,
    "customerPhone" character varying,
    description text NOT NULL,
    "totalAmount" numeric NOT NULL,
    "paidAmount" numeric DEFAULT 0 NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    "paymentStatus" character varying DEFAULT 'unpaid'::character varying NOT NULL,
    "expectedCloseDate" timestamp without time zone,
    "actualCloseDate" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sales OWNER TO postgres;

--
-- Name: schoolinfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schoolinfo (
    id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    "airtelNumber" character varying(20),
    "mtnNumber" character varying(20),
    "momoCode" character varying(20),
    location character varying(255),
    address text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "orderProcessingTime" integer,
    currency character varying(3) DEFAULT 'RWF'::character varying
);


ALTER TABLE public.schoolinfo OWNER TO postgres;

--
-- Name: system_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_preferences (
    id character varying(50) NOT NULL,
    theme character varying(10) DEFAULT 'light'::character varying NOT NULL,
    language character varying(5) DEFAULT 'en'::character varying NOT NULL,
    "autoSave" boolean DEFAULT true NOT NULL,
    "sessionTimeout" integer DEFAULT 30 NOT NULL,
    "enableAnalytics" boolean DEFAULT true NOT NULL,
    "enableBackups" boolean DEFAULT true NOT NULL,
    "backupFrequency" integer,
    "maintenanceMode" boolean DEFAULT false NOT NULL,
    "maintenanceMessage" text,
    "itemsPerPage" integer DEFAULT 10 NOT NULL,
    timezone character varying(50) DEFAULT 'UTC'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "defaultOrderStatus" character varying DEFAULT 'pending'::character varying NOT NULL,
    "autoApproveOrders" boolean DEFAULT false NOT NULL,
    "lowStockThreshold" integer DEFAULT 10 NOT NULL,
    "dataRetentionPeriod" integer DEFAULT 365 NOT NULL
);


ALTER TABLE public.system_preferences OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    phone character varying,
    "otpExpiresAt" timestamp without time zone,
    "isEmailVerified" boolean DEFAULT false NOT NULL,
    "profileImageUrl" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    role public.users_role_enum DEFAULT 'parent'::public.users_role_enum NOT NULL,
    status public.users_status_enum DEFAULT 'active'::public.users_status_enum NOT NULL,
    otp text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, "userId", "productId", "productName", quantity, price, category, "imageUrl", "createdAt", "updatedAt") FROM stdin;
990e8400-e29b-41d4-a716-446655440001	550e8400-e29b-41d4-a716-446655440001	660e8400-e29b-41d4-a716-446655440001	Premium School Backpack	1	15000	School Bags	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897137/schoolmart/mzuvpv18epvvkn1a9mka.png	2024-01-20 00:00:00	2024-01-20 00:00:00
990e8400-e29b-41d4-a716-446655440002	550e8400-e29b-41d4-a716-446655440001	660e8400-e29b-41d4-a716-446655440002	Scientific Calculator	2	8500	Calculators	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897139/schoolmart/fmto1yaqpkyut1wipolc.png	2024-01-20 00:00:00	2024-01-20 00:00:00
990e8400-e29b-41d4-a716-446655440003	550e8400-e29b-41d4-a716-446655440001	660e8400-e29b-41d4-a716-446655440004	Notebook Set (5 Pack)	1	3200	Notebooks & Paper	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897147/schoolmart/m5x8dfiqk9rriiw1otus.png	2024-01-20 00:00:00	2024-01-20 00:00:00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, "imageUrl", "createdAt") FROM stdin;
440e8400-e29b-41d4-a716-446655440001	Notebooks & Paper	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897104/schoolmart/cu6ucbxwbtxmxxlrmdld.png	2024-01-01 00:00:00
440e8400-e29b-41d4-a716-446655440002	Writing Materials	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897108/schoolmart/hwtqsb8bzsyr9zr4bqrx.png	2024-01-01 00:00:00
440e8400-e29b-41d4-a716-446655440003	Art Supplies	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897111/schoolmart/hs7relyciuoepf5vvotj.png	2024-01-01 00:00:00
440e8400-e29b-41d4-a716-446655440004	School Bags	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897115/schoolmart/aqaimzwarfjvppplcuoh.png	2024-01-01 00:00:00
440e8400-e29b-41d4-a716-446655440005	Calculators	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897119/schoolmart/t350do6vviajifn5qvfs.png	2024-01-01 00:00:00
440e8400-e29b-41d4-a716-446655440006	Sports Equipment	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897125/schoolmart/wprjanmwvalyv9uiyj71.png	2024-01-01 00:00:00
440e8400-e29b-41d4-a716-446655440007	Uniforms	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897128/schoolmart/wefphswsswrpdo6gy4dp.png	2024-01-01 00:00:00
440e8400-e29b-41d4-a716-446655440008	Accessories	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897133/schoolmart/l10dfsdfdov8rxb3yshw.png	2024-01-01 00:00:00
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1756742362014	InitialSchema1756742362014
2	1756742441647	SeedMockData1756742441647
3	1756742500000	AddSalesTable1756742500000
4	1756768812780	CreateCategoriesTable1756768812780
5	1756807170876	AddSchoolInfoTable1756807170876
6	1756807213000	AddSchoolInfoTable1756807213000
8	1756809803804	CreateNotificationsTable1756809803804
9	1756811194514	DropAndRecreateNotificationsTable1756811194514
10	1756812000000	UpdateSchoolInfoEmailNulls1756812000000
11	1756813873052	UpdateSchoolInfoEmailNulls1756813873052
12	1756813873053	AddSettingsTables1756813873053
13	1756813873054	UpdateSystemPreferencesEntity1756813873054
14	1756841428036	UpdateNotificationPreferencesTable1756841428036
15	1756867000000	AddCloudinaryPublicIdToProduct1756867000000
\.


--
-- Data for Name: notification_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_preferences (id, "emailNotifications", "smsNotifications", "orderConfirmations", "deliveryUpdates", "paymentReminders", "lowStockAlerts", "newOrderAlerts", "marketingEmails", "emailRecipients", "smsRecipients", "createdAt", "updatedAt") FROM stdin;
default-prefs	t	t	t	t	t	t	t	f	\N	\N	2025-09-02 17:57:37.961684	2025-09-02 17:57:37.961684
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, title, message, "orderId", "isRead", metadata, "userId", "createdAt", "updatedAt", type, status) FROM stdin;
d116a5c1-c4d1-4f14-9a0f-76d5533e367c	Order Confirmation	Your order #2809c4d0-b025-4ef7-a052-e6319a15e9d3 has been confirmed and is being processed.	2809c4d0-b025-4ef7-a052-e6319a15e9d3	f	\N	eff3a83b-f931-4204-b4b4-d61f07da435e	2025-09-02 13:37:47.890786	2025-09-02 13:37:47.890786	order	unread
d9205fd9-1d6b-440a-9fdb-1f535f6c40d9	Order Confirmation	Your order #c21d9cfc-46aa-480d-86ae-fcf82d33eb58 has been confirmed and is being processed.	c21d9cfc-46aa-480d-86ae-fcf82d33eb58	f	\N	eff3a83b-f931-4204-b4b4-d61f07da435e	2025-09-02 14:01:12.368595	2025-09-02 14:01:12.368595	order	unread
4f44433e-3837-4c1c-835d-3c11067527ff	Order Confirmation	Your order #cac9cf96-f1db-40e5-a682-db088861e2ad has been confirmed and is being processed.	cac9cf96-f1db-40e5-a682-db088861e2ad	f	\N	eff3a83b-f931-4204-b4b4-d61f07da435e	2025-09-02 14:06:12.224959	2025-09-02 14:06:12.224959	order	unread
4aa2a75d-8f10-45cf-aedc-459178ade1f2	Order Confirmation	Your order #683639d3-bb06-4a85-b317-eb5219775323 has been confirmed and is being processed.	683639d3-bb06-4a85-b317-eb5219775323	f	\N	eff3a83b-f931-4204-b4b4-d61f07da435e	2025-09-02 14:08:29.212058	2025-09-02 14:08:29.212058	order	unread
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, "orderId", "productId", "productName", quantity, price, category) FROM stdin;
880e8400-e29b-41d4-a716-446655440001	770e8400-e29b-41d4-a716-446655440001	660e8400-e29b-41d4-a716-446655440001	Premium School Backpack	1	15000	School Bags
880e8400-e29b-41d4-a716-446655440002	770e8400-e29b-41d4-a716-446655440001	660e8400-e29b-41d4-a716-446655440002	Scientific Calculator	1	8500	Calculators
880e8400-e29b-41d4-a716-446655440003	770e8400-e29b-41d4-a716-446655440002	660e8400-e29b-41d4-a716-446655440004	Notebook Set (5 Pack)	2	3200	Notebooks & Paper
880e8400-e29b-41d4-a716-446655440004	770e8400-e29b-41d4-a716-446655440002	660e8400-e29b-41d4-a716-446655440003	Art Supply Kit	1	12000	Art Supplies
880e8400-e29b-41d4-a716-446655440005	770e8400-e29b-41d4-a716-446655440003	660e8400-e29b-41d4-a716-446655440007	School Uniform	2	18000	Uniforms
880e8400-e29b-41d4-a716-446655440006	770e8400-e29b-41d4-a716-446655440003	660e8400-e29b-41d4-a716-446655440005	Geometry Set	1	4800	Writing Materials
880e8400-e29b-41d4-a716-446655440007	770e8400-e29b-41d4-a716-446655440004	660e8400-e29b-41d4-a716-446655440008	Water Bottle	1	3800	Accessories
880e8400-e29b-41d4-a716-446655440008	770e8400-e29b-41d4-a716-446655440004	660e8400-e29b-41d4-a716-446655440009	Lunch Box	1	5200	Accessories
880e8400-e29b-41d4-a716-446655440009	770e8400-e29b-41d4-a716-446655440004	660e8400-e29b-41d4-a716-446655440006	Colored Pencils	1	2500	Art Supplies
f40af4a6-34d5-4817-9e80-6d9168ed9b64	0d6aa279-9f8a-4d7a-ba4d-bc32e535b3d1	660e8400-e29b-41d4-a716-446655440005	Geometry Set	1	4800	Writing Materials
5dd86dd0-a37c-4bb9-a05d-a6e06bcf320f	0d6aa279-9f8a-4d7a-ba4d-bc32e535b3d1	660e8400-e29b-41d4-a716-446655440006	Colored Pencils	1	2500	Art Supplies
222c2a4c-0a6a-414b-ac29-81ceb2adb006	f2270ef6-b8c1-4c7d-982b-6e8a501ca32b	660e8400-e29b-41d4-a716-446655440004	Notebook Set (5 Pack)	1	3200	Notebooks & Paper
1af91633-979f-4655-9f7f-0d22b28eeb0f	3eb207f9-16a4-484a-9f7e-5df6fdfabf9d	660e8400-e29b-41d4-a716-446655440001	Premium School Backpack	1	15000	School Bags
56eb42c8-eb5c-43c2-8a22-ddcaf3a19c71	2809c4d0-b025-4ef7-a052-e6319a15e9d3	660e8400-e29b-41d4-a716-446655440010	Exercise Books	1	1800	Notebooks & Paper
64b299a3-78e5-44ff-8c67-4b5cfb031eea	c21d9cfc-46aa-480d-86ae-fcf82d33eb58	660e8400-e29b-41d4-a716-446655440007	School Uniform	1	18000	Uniforms
2d8540f8-eb21-44bd-84be-984e14374f7e	cac9cf96-f1db-40e5-a682-db088861e2ad	660e8400-e29b-41d4-a716-446655440003	Art Supply Kit	1	12000	Art Supplies
1b3f096b-1b46-44ce-a0fa-6b96effd9192	683639d3-bb06-4a85-b317-eb5219775323	660e8400-e29b-41d4-a716-446655440009	Lunch Box	1	5200	Accessories
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, "userId", "parentName", "parentEmail", "parentPhone", "studentName", "studentGrade", "studentClass", "totalAmount", "orderDate", "paymentMethod", "createdAt", "updatedAt", status, "deliveryAddress") FROM stdin;
770e8400-e29b-41d4-a716-446655440002	550e8400-e29b-41d4-a716-446655440002	Mary Smith	mary.smith@email.com	+250 788 987 654	Tom Smith	Grade 4	4B	18400	2024-01-19 00:00:00	Airtel Money	2024-01-19 00:00:00	2024-01-19 00:00:00	pending	\N
770e8400-e29b-41d4-a716-446655440003	\N	David Wilson	david.wilson@email.com	+250 788 456 789	Sarah Wilson	Grade 6	6A	40800	2024-01-18 00:00:00	Visa Card	2024-01-18 00:00:00	2024-01-18 00:00:00	pending	\N
770e8400-e29b-41d4-a716-446655440004	\N	Alice Johnson	alice.johnson@email.com	+250 788 321 654	Mike Johnson	Grade 3	3C	11500	2024-01-17 00:00:00	MTN MoMo	2024-01-17 00:00:00	2024-01-17 00:00:00	pending	\N
3eb207f9-16a4-484a-9f7e-5df6fdfabf9d	eff3a83b-f931-4204-b4b4-d61f07da435e	IRAKIZA Bernard	rukundob39@gmail.com	+250790052180	Mugisha Samuel	S5	S5	15000	2025-09-02 12:39:34.262235	mtn	2025-09-02 12:39:34.262235	2025-09-02 12:39:34.262235	processing	KG 123 Street, Kigali, Rwanda
cac9cf96-f1db-40e5-a682-db088861e2ad	eff3a83b-f931-4204-b4b4-d61f07da435e	IRAKIZA Bernard	rukundob39@gmail.com	+250790052180	Mugisha Samuel	S5	S5	12000	2025-09-02 14:06:12.107357	mtn	2025-09-02 14:06:12.107357	2025-09-02 14:06:12.107357	processing	KG 123 Street, Kigali, Rwanda
770e8400-e29b-41d4-a716-446655440001	550e8400-e29b-41d4-a716-446655440001	John Doe	john.doe@email.com	+250 788 123 456	Jane Doe	Grade 5	5A	23500	2024-01-20 00:00:00	MTN MoMo	2024-01-20 00:00:00	2025-09-02 22:33:20.692057	cancelled	\N
c21d9cfc-46aa-480d-86ae-fcf82d33eb58	eff3a83b-f931-4204-b4b4-d61f07da435e	IRAKIZA Bernard	rukundob39@gmail.com	+250790052180	Mugisha Samuel	S5	S5	18000	2025-09-02 14:01:12.197351	mtn	2025-09-02 14:01:12.197351	2025-09-02 22:47:27.915727	delivered	KG 123 Street, Kigali, Rwanda
2809c4d0-b025-4ef7-a052-e6319a15e9d3	eff3a83b-f931-4204-b4b4-d61f07da435e	IRAKIZA Bernard	rukundob39@gmail.com	+250790052180	Mugisha Samuel	S5	S5	1800	2025-09-02 13:37:47.746156	mtn	2025-09-02 13:37:47.746156	2025-09-02 22:47:34.97584	delivered	KG 123 Street, Kigali, Rwanda
683639d3-bb06-4a85-b317-eb5219775323	eff3a83b-f931-4204-b4b4-d61f07da435e	IRAKIZA Bernard	rukundob39@gmail.com	+250736555962	Mugisha Samuel	S5	S5	5200	2025-09-02 14:08:29.105131	airtel	2025-09-02 14:08:29.105131	2025-09-02 22:48:03.652192	processing	KG 123 Street, Kigali, Rwanda
0d6aa279-9f8a-4d7a-ba4d-bc32e535b3d1	eff3a83b-f931-4204-b4b4-d61f07da435e	IRAKIZA Bernard	rukundob39@gmail.com	+250790052180	Mugisha Samuel	S5	S5	7300	2025-09-02 12:24:54.273566	airtel	2025-09-02 12:24:54.273566	2025-09-02 22:52:05.353527	delivered	KG 123 Street, Kigali, Rwanda
f2270ef6-b8c1-4c7d-982b-6e8a501ca32b	eff3a83b-f931-4204-b4b4-d61f07da435e	IRAKIZA Bernard	rukundob39@gmail.com	+250790052180	Mugisha Samuel	S5	S5	3200	2025-09-02 12:33:49.962046	mtn	2025-09-02 12:33:49.962046	2025-09-02 22:52:31.261367	delivered	KG 123 Street, Kigali, Rwanda
\.


--
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_methods (id, type, provider, name, "accountNumber", "accountName", "isActive", instructions, "sortOrder", "createdAt", "updatedAt") FROM stdin;
airtel-money-001	mobile_money	airtel	Airtel Money	+250788123456	SchoolMart Academy	t	Dial *182*1*1# to pay	1	2025-09-02 17:57:37.961684	2025-09-02 17:57:37.961684
mtn-momo-001	mobile_money	mtn	MTN Mobile Money	+250789987654	SchoolMart Academy	t	Dial *182*1*1# to pay	2	2025-09-02 17:57:37.961684	2025-09-02 17:57:37.961684
cash-001	cash	cash	Cash Payment	\N	\N	t	Pay in person at school office	3	2025-09-02 17:57:37.961684	2025-09-02 17:57:37.961684
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, category, price, stock, "minStock", required, supplier, "imageUrl", "lastUpdated", description, rating, reviews, "cloudinaryPublicId") FROM stdin;
660e8400-e29b-41d4-a716-446655440012	Ruler Set	Writing Materials	1500	45	15	t	Measuring Tools Inc	/placeholder.svg?height=250&width=250	2024-01-10 00:00:00	\N	0	0	\N
660e8400-e29b-41d4-a716-446655440013	Highlighter Set	Writing Materials	2200	30	10	f	Writing Essentials	/placeholder.svg?height=250&width=250	2024-01-09 00:00:00	\N	0	0	\N
660e8400-e29b-41d4-a716-446655440015	Lab Coat	Uniforms	8000	12	5	t	Lab Wear Co	/placeholder.svg?height=250&width=250	2024-01-07 00:00:00	\N	0	0	\N
660e8400-e29b-41d4-a716-446655440008	Water Bottle	Accessories	3800	35	12	f	Bottle Corp	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897156/schoolmart/wzm0ydgpx9zhm79ltvll.png	2024-01-14 00:00:00	\N	0	0	schoolmart/wzm0ydgpx9zhm79ltvll
660e8400-e29b-41d4-a716-446655440009	Lunch Box	Accessories	5200	19	8	f	Lunch Box Ltd	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897158/schoolmart/vx8zk3pyevxlhdchl70c.png	2024-01-13 00:00:00	\N	0	0	schoolmart/vx8zk3pyevxlhdchl70c
660e8400-e29b-41d4-a716-446655440010	Exercise Books	Notebooks & Paper	1800	59	25	t	Paper Plus	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897161/schoolmart/d4g2yax6tg1r893lldhd.png	2024-01-12 00:00:00	\N	0	0	schoolmart/d4g2yax6tg1r893lldhd
5394fab5-013f-48c3-a2bd-00f70520c89b	Soap	Cleanliness	1500	150	20	f	Kigali Trader LTD	/placeholder-product.png	2025-09-02 15:35:59.49891	Standarized washing soap	0	0	\N
660e8400-e29b-41d4-a716-446655440014	Sports Equipment Kit	Sports Equipment	25000	5	3	f	Sports Gear Ltd	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897125/schoolmart/wprjanmwvalyv9uiyj71.png	2024-01-08 00:00:00	\N	0	0	schoolmart/wprjanmwvalyv9uiyj71
660e8400-e29b-41d4-a716-446655440007	School Uniform	Uniforms	18000	29	10	t	Uniform Masters	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897128/schoolmart/wefphswsswrpdo6gy4dp.png	2024-01-16 00:00:00	\N	0	0	schoolmart/wefphswsswrpdo6gy4dp
660e8400-e29b-41d4-a716-446655440011	Pencil Case	Accessories	2800	25	10	f	Stationery Pro	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897133/schoolmart/l10dfsdfdov8rxb3yshw.png	2024-01-11 00:00:00	\N	0	0	schoolmart/l10dfsdfdov8rxb3yshw
660e8400-e29b-41d4-a716-446655440001	Premium School Backpack	School Bags	15000	24	10	t	BagCorp Ltd	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897137/schoolmart/mzuvpv18epvvkn1a9mka.png	2024-01-20 00:00:00	\N	0	0	schoolmart/mzuvpv18epvvkn1a9mka
660e8400-e29b-41d4-a716-446655440002	Scientific Calculator	Calculators	8500	15	5	f	TechSupply Co	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897139/schoolmart/fmto1yaqpkyut1wipolc.png	2024-01-19 00:00:00	\N	0	0	schoolmart/fmto1yaqpkyut1wipolc
660e8400-e29b-41d4-a716-446655440003	Art Supply Kit	Art Supplies	12000	7	15	f	Creative Arts Ltd	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897144/schoolmart/geu0snafjwcezfrqtprt.png	2024-01-17 00:00:00	\N	0	0	schoolmart/geu0snafjwcezfrqtprt
660e8400-e29b-41d4-a716-446655440004	Notebook Set (5 Pack)	Notebooks & Paper	3200	49	20	t	Paper Plus	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897147/schoolmart/m5x8dfiqk9rriiw1otus.png	2024-01-18 00:00:00	\N	0	0	schoolmart/m5x8dfiqk9rriiw1otus
660e8400-e29b-41d4-a716-446655440005	Geometry Set	Writing Materials	4800	29	10	t	Stationery Pro	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897149/schoolmart/untxyahdy4jmujcxjdcg.png	2024-01-16 00:00:00	\N	0	0	schoolmart/untxyahdy4jmujcxjdcg
660e8400-e29b-41d4-a716-446655440006	Colored Pencils	Art Supplies	2500	39	15	f	Artistic Supplies	https://res.cloudinary.com/dwk1eq0om/image/upload/v1756897154/schoolmart/dkqqjq51kmz8ams5jwmq.png	2024-01-15 00:00:00	\N	0	0	schoolmart/dkqqjq51kmz8ams5jwmq
\.


--
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales (id, "userId", "customerName", "customerEmail", "customerPhone", description, "totalAmount", "paidAmount", status, "paymentStatus", "expectedCloseDate", "actualCloseDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: schoolinfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schoolinfo (id, name, email, phone, "airtelNumber", "mtnNumber", "momoCode", location, address, "createdAt", "updatedAt", "orderProcessingTime", currency) FROM stdin;
school-001	SchoolMart Academy	support@schoolmart.rw	+250788123456	+250788654321	+250789987654	123435	Kigali, Rwanda	KG 123 Street, Kigali, Rwanda	2025-09-02 12:06:30.645842	2025-09-02 12:06:30.645842	\N	RWF
\.


--
-- Data for Name: system_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_preferences (id, theme, language, "autoSave", "sessionTimeout", "enableAnalytics", "enableBackups", "backupFrequency", "maintenanceMode", "maintenanceMessage", "itemsPerPage", timezone, "createdAt", "updatedAt", "defaultOrderStatus", "autoApproveOrders", "lowStockThreshold", "dataRetentionPeriod") FROM stdin;
default-system-prefs	light	en	t	30	t	t	\N	f	\N	10	UTC	2025-09-02 17:57:37.961684	2025-09-02 17:57:37.961684	pending	f	10	365
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, "firstName", "lastName", phone, "otpExpiresAt", "isEmailVerified", "profileImageUrl", "createdAt", "updatedAt", role, status, otp) FROM stdin;
550e8400-e29b-41d4-a716-446655440001	john.doe@email.com	$2a$10$hashedpassword1	John	Doe	+250 788 123 456	\N	t	\N	2024-01-01 00:00:00	2024-01-01 00:00:00	parent	active	\N
550e8400-e29b-41d4-a716-446655440002	mary.smith@email.com	$2a$10$hashedpassword2	Mary	Smith	+250 788 987 654	\N	t	\N	2024-01-01 00:00:00	2024-01-01 00:00:00	parent	active	\N
eff3a83b-f931-4204-b4b4-d61f07da435e	rukundob39@gmail.com	$2b$12$SN.Wokn.8uyMJZ0HtbiVEuJMf6/eL8H3V3m25Q75tH7WQaeCT6yRW	IRAKIZA	Bernard	+250790052180	\N	t	\N	2025-09-02 00:32:44.074389	2025-09-02 00:33:26.777854	parent	active	\N
2c4b8d6a-c01b-4235-858f-0e1fedd9a807	rukundorca@gmail.com	$2b$12$2XviIJMTZSEaFfYnZ7ldGexv2p2GYw36z/2FePlK7QQgfKnlLo0OW	Prince	Admin	+250790052180	\N	t	\N	2025-09-02 14:40:23.311126	2025-09-02 14:40:51.915131	school_manager	active	\N
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 15, true);


--
-- Name: products PK_4c88e956195bba85977da21b8f4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY (id);


--
-- Name: orders PK_4c88e956195bba85977da21b8f5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_4c88e956195bba85977da21b8f5" PRIMARY KEY (id);


--
-- Name: order_items PK_4c88e956195bba85977da21b8f6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "PK_4c88e956195bba85977da21b8f6" PRIMARY KEY (id);


--
-- Name: cart_items PK_4c88e956195bba85977da21b8f7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "PK_4c88e956195bba85977da21b8f7" PRIMARY KEY (id);


--
-- Name: sales PK_4c88e956195bba85977da21b8ff; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT "PK_4c88e956195bba85977da21b8ff" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: users PK_96aac72f1574b88752e9fb00089; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY (id);


--
-- Name: categories PK_categories; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_categories" PRIMARY KEY (id);


--
-- Name: notification_preferences PK_notification_preferences; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT "PK_notification_preferences" PRIMARY KEY (id);


--
-- Name: notifications PK_notifications; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_notifications" PRIMARY KEY (id);


--
-- Name: payment_methods PK_payment_methods; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT "PK_payment_methods" PRIMARY KEY (id);


--
-- Name: schoolinfo PK_schoolinfo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schoolinfo
    ADD CONSTRAINT "PK_schoolinfo" PRIMARY KEY (id);


--
-- Name: system_preferences PK_system_preferences; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_preferences
    ADD CONSTRAINT "PK_system_preferences" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: IDX_sales_expectedCloseDate; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_expectedCloseDate" ON public.sales USING btree ("expectedCloseDate");


--
-- Name: IDX_sales_paymentStatus; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_paymentStatus" ON public.sales USING btree ("paymentStatus");


--
-- Name: IDX_sales_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_status" ON public.sales USING btree (status);


--
-- Name: IDX_sales_userId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_userId" ON public.sales USING btree ("userId");


--
-- Name: orders FK_151b79a83ba240b0cb31b2302d1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: sales FK_4c88e956195bba85977da21b8fg; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT "FK_4c88e956195bba85977da21b8fg" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: notifications FK_692a909ee0fa9383e7859f9b406; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: cart_items FK_72679d98b31c737937b8932ebe6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: cart_items FK_84e765378a5f03ad9900df3a9ba; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_84e765378a5f03ad9900df3a9ba" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: order_items FK_cdb99c05982d5191ac8465ac010; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: order_items FK_f1d359a55923bb45b057fbdab0d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES public.orders(id);


--
-- PostgreSQL database dump complete
--

