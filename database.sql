CREATE TABLE "user" (
	"id" serial NOT NULL,
	"username" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"age" int NOT NULL,
	"zip_code" int NOT NULL,
	"access_level" int NOT NULL,
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "health_category" (
	"id" serial NOT NULL,
	"category" varchar(255) NOT NULL,
	CONSTRAINT "health_category_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "medical_links" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"link" varchar(255) NOT NULL,
	"logo_url" varchar(1024),
	CONSTRAINT "medical_links_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "virtuahealth" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"info_cost" varchar(1024),
	"link" varchar(255) NOT NULL,
	"specialty" varchar(255),
	"logo_url" varchar(1000),
	CONSTRAINT "virtuahealth_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "feedback" (
	"id" serial NOT NULL,
	"rating" int NOT NULL,
	"comment" varchar(255) NOT NULL,
	"user_id" int NOT NULL UNIQUE,
	CONSTRAINT "feedback_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "faq" (
	"id" serial NOT NULL,
	"question" varchar(1024) NOT NULL,
	"answer" varchar(1024) NOT NULL,
	"health_category_id" int NOT NULL,
	"age_range_id" int NOT NULL,
	CONSTRAINT "faq_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "feedback_q" (
	"id" serial NOT NULL,
	"question" varchar(255) NOT NULL,
	"answer" varchar(255) NOT NULL,
	"feedback_id" int NOT NULL,
	CONSTRAINT "feedback_q_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "diagnostic_tool" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"info" varchar(1024) NOT NULL,
	"health_category_id" int NOT NULL,
	"age_range_id" int NOT NULL,
	CONSTRAINT "diagnostic_tool_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "newsletter" (
	"id" serial NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	CONSTRAINT "newsletter_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "age_range" (
	"id" serial NOT NULL,
	"low" int NOT NULL,
	"high" int NOT NULL,
	CONSTRAINT "age_range_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "doctor_questions" (
	"id" serial NOT NULL,
	"question" varchar(1024) NOT NULL,
	"health_category_id" int NOT NULL,
	"age_range_id" int NOT NULL,
	CONSTRAINT "doctor_questions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "resources" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"link" varchar(1024) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"health_category_id" int NOT NULL,
	CONSTRAINT "resources_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "guidelines" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"info" varchar(1024) NOT NULL,
	"health_category_id" int NOT NULL,
	"age_range_id" int NOT NULL,
	"grade" varchar(255),
	"date" DATE,
	CONSTRAINT "guidelines_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);







ALTER TABLE "feedback" ADD CONSTRAINT "feedback_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id");

ALTER TABLE "faq" ADD CONSTRAINT "faq_fk0" FOREIGN KEY ("health_category_id") REFERENCES "health_category"("id");
ALTER TABLE "faq" ADD CONSTRAINT "faq_fk1" FOREIGN KEY ("age_range_id") REFERENCES "age_range"("id");

ALTER TABLE "feedback_q" ADD CONSTRAINT "feedback_q_fk0" FOREIGN KEY ("feedback_id") REFERENCES "feedback"("id");

ALTER TABLE "diagnostic_tool" ADD CONSTRAINT "diagnostic_tool_fk0" FOREIGN KEY ("health_category_id") REFERENCES "health_category"("id");
ALTER TABLE "diagnostic_tool" ADD CONSTRAINT "diagnostic_tool_fk1" FOREIGN KEY ("age_range_id") REFERENCES "age_range"("id");



ALTER TABLE "doctor_questions" ADD CONSTRAINT "doctor_questions_fk0" FOREIGN KEY ("health_category_id") REFERENCES "health_category"("id");
ALTER TABLE "doctor_questions" ADD CONSTRAINT "doctor_questions_fk1" FOREIGN KEY ("age_range_id") REFERENCES "age_range"("id");

ALTER TABLE "resources" ADD CONSTRAINT "resources_fk0" FOREIGN KEY ("health_category_id") REFERENCES "health_category"("id");

ALTER TABLE "guidelines" ADD CONSTRAINT "guidelines_fk0" FOREIGN KEY ("health_category_id") REFERENCES "health_category"("id");
ALTER TABLE "guidelines" ADD CONSTRAINT "guidelines_fk1" FOREIGN KEY ("age_range_id") REFERENCES "age_range"("id");



INSERT INTO "health_category" ("category")
VALUES ('Reproductive Health'), ('Cervical Health'), ('Menopause'), ('Mental Health'), ('Physical Therapy'), ('Breast Health');


INSERT INTO "age_range" ("low", "high")
VALUES (15, 19), (20, 24), (25, 29), (30, 34), (35, 39), (40, 44), (45, 49), (50, 54), (55, 59), (60, 64), (65, 69), (70, 74), (75, 79)
;



INSERT INTO "guidelines" ("name", "info", "health_category_id", "age_range_id", "grade", "date")
VALUES ('USPSTF Recommendation', 'Screen every 3 years with cervical cytology alone
OR every 5 years with high-risk human papillomavirus (hrHPV) testing alone,
OR every 5 years with hrHPV testing in combination with cytology (cotesting).
', 7, 5, 'A', '10-20-2020');


INSERT INTO "diagnostic_tool" ("name", "info", "health_category_id", "age_range_id")
VALUES ('Pap smear', 'aka Pap screening test, a sample is collected during a speculum exam with a brush. Sample is sent to the lab and reviewed under a microscope by a cytologist.', 7, 5), 
('HPV Testing', 'aka human papillomavirus screening test. Sample is collected during the speculum exam with a brush. Sample is sent to the lab and tested in an analyzer for DNA or RNA from certain types of HPV that are known to cause cervical cancer. ', 7, 5),
('Bio-marker Triage Testing', 'uses your initial sample to see if specific biomarkers are present, which could indicate progression of disease', 7, 5),
('Colposcopy', 'cervical examination using an instrument called a colposcope, which uses a magnifying lens to allow the provider to clearly see the surface of the cervix up close.', 7, 5),
('Cervical Biopsy', 'biopsies can be used to diagnose cervical pre-cancers and cancers. If the biopsy can completely remove all of the abnormal tissue, it might be the only treatment needed.', 7, 5),
('Colposcopic Biopsy', 'a tissue sample of the abnormal area is taken during the colposcopy.  The sample is sent to the lab for review by pathology and a diagnostic result (precancer, cancer, no cancer).', 7, 5),
('Endocervical curettage (endocervical scraping)', 'a curette or a brush is inserted into the endocervical canal to scrape the inside of the canal to remove some of the tissue.  The tissue is sent to the lab to be checked.', 7, 5),
('Cone biopsy', 'aka conization, a cone-shaped piece of tissue is removed from the cervix using a LEEP (heated wire) or sterile scalpel (done in a hospital) . The base of the cone is formed by the exocervix. ', 7, 5);


INSERT INTO "faq" ("question", "answer", "health_category_id", "age_range_id")
VALUES ('What is the first step in screening for cervical cancer?', 'A screening test will be performed using a Pap smear, an HPV test (primary screening) or both at the same time (co-testing)', 7, 5), 
('How do the screening tests differ?', 'The Pap test is reviewed by a cytologist under a microscope.  This test was developed in the 1970’s.  The HPV test is run in an analyzer and looks for RNA or DNA from the specific HPV genotypes that are known to cause cervical cancer.', 7, 5), 
('My screening test is positive.', 'Your test sample will go on for further testing, options include HPV, Pap or a triage biomarker. From there, you may be asked to come in for a visual examination using a colposcope to better see your cervix. ', 7, 5),
('What do these numbers mean in my HPV results?', 'There are 14 identified high-risk HPV genotypes, which is what the HPV test is looking for. HPV causes 99% of all cervical cancers, with HPV 16 and 18 causing 70% of those cases. Follow up with your provider for next steps and details.', 7, 5);

INSERT INTO "doctor_questions" ("question", "health_category_id", "age_range_id")
VALUES ('Risk Factors: What are my risk factors for cervical cancer? Are there any others I should consider based upon environmental factors?', 7, 5),
('Guidelines: Which screening guidelines are you following? How do the tests you use support them?', 7, 5),
('Clinical Updates: Can you please share any new information about cervical cancer screening that has come out since my last screening?', 7, 5),
('Results: How will you communicate my results to me? Where can I go for more information about these results?', 7, 5),
('Management: Who can I contact when I have questions? What are the possible next steps?', 7, 5);

INSERT INTO "resources" ("name", "link", "description", "health_category_id")
VALUES ('American Society for Colposcopy and Cervical Pathology', 'https://www.asccp.org/cervicalcancerelimination', 'Additional reading', 7),
('United States Preventive Services Task Force', 'https://uspreventiveservicestaskforce.org/uspstf/search_results?searchterm=cervical%20cancer', 'Additional reading', 7),
('American College of Obstetricians and Gynecologists', 'https://www.acog.org/clinical/clinical-guidance/practice-advisory/articles/2021/04/updated-cervical-cancer-screening-guidelines', 'Additional reading', 7),
('Centers for Disease Control and Prevention (CDC)', 'https://www.cdc.gov/cancer/cervical/basic_info/index.htm', 'Additional reading', 7),
('World Health Organization (WHO)', ' https://www.who.int/health-topics/cervical-cancer#tab=tab_1', 'Additional reading', 7);




