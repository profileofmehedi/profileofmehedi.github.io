# 🚀 AWS Certification 30-Day Master Study Plan

> **Target Exam Focus:** AWS Certified Solutions Architect – Associate (SAA-C03) / Adaptable for Cloud Practitioner (CLF-C02) & Developer Associate (DVA-C02)  
> **Commitment:** 30 Days | ~2.5 - 3 Hours / Day | 75–90 Hours Total  
> **Target Score:** 850+ / 1000 (Passing score is 720)

---

## 📋 Table of Contents
1. [Exam Blueprint & Scoring Strategy](#-exam-blueprint--scoring-strategy)
2. [Interactive Study Notes (HTML)](#-interactive-study-notes-html)
3. [Daily 3-Hour Study Routine](#-daily-3-hour-study-routine)
4. [30-Day Day-by-Day Roadmap](#-30-day-day-by-day-roadmap)
   - [Week 1: Core Fundamentals, Compute & Storage](#week-1-core-fundamentals-compute--storage)
   - [Week 2: High Availability, Networking & Routing](#week-2-high-availability-networking--routing)
   - [Week 3: Databases, Serverless & Security](#week-3-databases-serverless--security)
   - [Week 4: Architecture Patterns & Mock Exam Marathon](#week-4-architecture-patterns--mock-exam-marathon)
5. [High-Yield Cheat Sheets & Decision Matrices](#-high-yield-cheat-sheets--decision-matrices)
6. [Exam "Trap" Keywords & Elimination Techniques](#-exam-trap-keywords--elimination-techniques)
7. [Curated Resources & Tools](#-curated-resources--tools)
8. [Exam Day Protocol & Checklist](#-exam-day-protocol--checklist)

---

## 🌐 Interactive Study Notes & Classroom Sliders (HTML)

Open these files directly in any web browser (Chrome, Edge, Firefox) for an immersive, visual learning experience:

- 🌟 **[AWS অল-ইন-ওয়ান মাস্টারক্লাস এনসাইক্লোপিডিয়া (index.html)](./index.html)** — *১৪টি সম্পূর্ণ AWS মডিউল এবং ৪২টি মাস্টারক্লাস স্লাইড! কোনো টপিক বাদ নেই (ECS, Fargate, Snowball, Storage Gateway, FSx, Direct Connect, Aurora, DynamoDB, Redshift, Athena, Glue, SQS, SNS, Kinesis, Cognito, WAF, KMS, DR)। সাইডবার ড্রয়ার, লাইভ সার্চ ফিল্টার, লাইট/ডার্ক মোড, কালপুরুষ ফন্ট, কাস্টম SVG আর্কিটেকচার ইনফোগ্রাফিক এবং মোবাইল সোয়াইপ নেভিগেশন সহ সম্পূর্ণ প্ল্যাটফর্ম।*
- 🎓 **[AWS IAM ক্লাসরুম মাস্টারক্লাস স্লাইডার (iam-tutorial.html)](./iam-tutorial.html)** — *IAM-এর ডেডিকেটেড ৯টি স্লাইড এবং লাইভ কুইজ।*
- 🛡️ **[AWS IAM Mastery Notes (iam-notes.html)](./iam-notes.html)** — *ইন্টারঅ্যাক্টিভ মাইলস্টোন চেকলিস্ট, JSON policy visualizer, comparison matrix, এবং ব্রাউজারে অটো-সেভ হওয়া ব্যক্তিগত নোটপ্যাড।*

---

## 🎯 Exam Blueprint & Scoring Strategy

The AWS Solutions Architect Associate (SAA-C03) covers four core domains:

| Domain | Focus Area | Exam Weight | Key Focus |
|---|---|---|---|
| **Domain 1** | Design Secure Architectures | **30%** | IAM, KMS, Secrets Manager, VPC Security (SGs/NACLs), Organizations |
| **Domain 2** | Design Resilient Architectures | **26%** | Multi-AZ, Multi-Region, Auto Scaling, ELB, S3 replication, Disaster Recovery |
| **Domain 3** | Design High-Performing Architectures | **24%** | Compute sizing, DynamoDB, RDS Aurora, ElastiCache, CloudFront |
| **Domain 4** | Design Cost-Optimized Architectures | **20%** | S3 Lifecycle, Spot/Savings Plans, Aurora Serverless, Data Transfer costs |

---

## ⏰ Daily 3-Hour Study Routine

Follow this strict routine every single day:

```
┌─────────────────────────────────────────────────────────────┐
│ 🕒 Daily 180-Minute Breakdown                               │
├───────────────────┬─────────────────────────────────────────┤
│ Block 1 (60 mins) │ 📚 Concept Mastery (Video course/docs)  │
│ Block 2 (50 mins) │ 🛠️ Hands-on Console Lab (AWS Free Tier) │
│ Block 3 (40 mins) │ 📝 Topic Quizzes & Review               │
│ Block 4 (30 mins) │ 🧠 Flashcards & Error Log Maintenance   │
└───────────────────┴─────────────────────────────────────────┘
```

> 💡 **Golden Rule:** Maintain an **"Error Log"** in a markdown file or notebook. Every question you miss in a quiz must have:
> 1. Why the correct option is right.
> 2. Why your chosen option is wrong.
> 3. The exact keyword trigger in the question (e.g., *"least operational overhead"*).

---

## 📅 30-Day Day-by-Day Roadmap

### Week 1: Core Fundamentals, Compute & Storage
*Objective: Master IAM security, EC2 configurations, storage tiers, and basic scaling.*

- [ ] **Day 1: AWS Global Infrastructure & IAM Deep Dive**
  - AWS Regions, Availability Zones (AZs), Local Zones, Points of Presence (Edge Locations).
  - IAM Users, Groups, Policies (JSON structure: `Effect`, `Action`, `Resource`, `Condition`).
  - IAM Roles vs Instance Profiles, MFA enforcement, Cross-account access basics.
  - *Lab:* Create IAM user with MFA, assign least-privilege policy, test access via AWS CLI.

- [ ] **Day 2: EC2 (Elastic Compute Cloud) Fundamentals**
  - EC2 instance families (`t`, `m`, `c`, `r`, `i`).
  - Purchasing models: On-Demand, Reserved Instances (Standard vs Convertible), Savings Plans, Spot Instances, Dedicated Hosts.
  - User Data script automation, EC2 Metadata service (IMDSv1 vs IMDSv2).
  - *Lab:* Launch an EC2 instance using User Data to install Apache web server.

- [ ] **Day 3: Block & File Storage (EBS, EFS & Instance Store)**
  - EBS Volume Types: `gp2`/`gp3` (General purpose SSD), `io1`/`io2` (High IOPS SSD), `st1` (Throughput HDD), `sc1` (Cold HDD).
  - EBS Snapshots, multi-attach EBS, encryption at rest with KMS.
  - Instance Store (ephemeral, high IOPS, non-persistent) vs EBS.
  - Amazon EFS (POSIX compliant, shared storage across 100s of EC2s, cross-AZ).
  - *Lab:* Attach an EBS volume, take a snapshot, restore to another AZ; test EFS mounting.

- [ ] **Day 4: Amazon S3 (Simple Storage Service) - Core Concepts**
  - S3 Buckets, Objects, S3 Versioning, Object Locking (Compliance vs Governance mode).
  - S3 Storage Classes: Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant Retrieval, Glacier Flexible, Glacier Deep Archive.
  - Lifecycle Policies, S3 Cross-Region Replication (CRR) and Same-Region Replication (SRR).
  - *Lab:* Set up bucket versioning, configure a lifecycle rule to transition objects to Glacier.

- [ ] **Day 5: S3 Security, Performance & Advanced Features**
  - S3 Bucket Policies vs IAM Policies vs ACLs.
  - Encryption: SSE-S3, SSE-KMS, SSE-C, Client-Side Encryption.
  - S3 Pre-signed URLs, CORS, S3 Transfer Acceleration, Multipart Upload.
  - S3 Select & Athena integration overview.
  - *Lab:* Create an S3 Bucket Policy allowing restricted read access; generate a pre-signed URL.

- [ ] **Day 6: Elastic Load Balancing (ELB) & Auto Scaling Groups (ASG)**
  - Application Load Balancer (ALB) - Layer 7 (HTTP/HTTPS, path/host-based routing).
  - Network Load Balancer (NLB) - Layer 4 (TCP/UDP/TLS, static IPs, ultra-low latency).
  - Gateway Load Balancer (GWLB) for third-party virtual appliances.
  - Auto Scaling Groups: Launch Templates, Scaling policies (Target Tracking, Simple/Step, Scheduled).
  - *Lab:* Set up an ASG behind an ALB across 2 AZs, simulate high CPU load to trigger scale-out.

- [ ] **Day 7: Week 1 Review & Cumulative Quiz**
  - Solve 30-40 practice questions focusing exclusively on IAM, EC2, EBS, S3, and ELB/ASG.
  - Log all incorrect answers into your Error Log.

---

### Week 2: High Availability, Networking & Routing
*Objective: Master VPC, hybrid networking, Route 53, and Content Delivery.*

- [ ] **Day 8: Amazon VPC (Virtual Private Cloud) - Part 1 (Core Anatomy)**
  - CIDR blocks (IPv4 `/16` to `/28`), Public vs Private Subnets.
  - Internet Gateway (IGW) and Route Tables.
  - Security Groups (stateful, allow rules only, instance level) vs Network Access Control Lists (NACLs) (stateless, allow & deny rules, subnet level).
  - *Lab:* Build a custom VPC with 2 public subnets and 2 private subnets across 2 AZs from scratch.

- [ ] **Day 9: Amazon VPC - Part 2 (Outbound & Hybrid Access)**
  - NAT Gateway (managed, public subnet, handles outbound IPv4 traffic from private subnets) vs NAT Instance.
  - Bastion Hosts (Jump Boxes) vs AWS Systems Manager (SSM) Session Manager (preferred secure method).
  - VPC Peering (non-transitive routing).
  - *Lab:* Deploy an EC2 in a private subnet, configure NAT Gateway, ping external internet, connect using SSM Session Manager.

- [ ] **Day 10: VPC Endpoints & Advanced Networking**
  - Gateway Endpoints (Free: S3 & DynamoDB only).
  - Interface Endpoints / AWS PrivateLink (uses ENI with private IP, charges apply).
  - AWS Transit Gateway (hub-and-spoke model for interconnecting 100s of VPCs and on-premises networks).
  - AWS Site-to-Site VPN and Direct Connect (DX) basics.
  - *Lab:* Create an S3 Gateway Endpoint and access S3 privately without traversing the public internet.

- [ ] **Day 11: Amazon Route 53 (DNS Management)**
  - Public vs Private Hosted Zones.
  - Routing Policies: Simple, Weighted, Latency, Failover (Active-Passive), Geolocation, Geoproximity (Traffic Flow), Multi-value answer.
  - Route 53 Health Checks and DNS Record Types (A, AAAA, CNAME, Alias).
  - *Alias Record vs CNAME* (Alias works at apex/zone apex `example.com`, CNAME does not).
  - *Lab:* Configure health check on an ALB endpoint and test automatic DNS failover.

- [ ] **Day 12: CloudFront, Global Accelerator & Edge Computing**
  - Amazon CloudFront: CDN edge locations, Cache Behaviors, TTL, Signed URLs vs Signed Cookies, Origin Access Control (OAC).
  - AWS Global Accelerator: Anycast IP, Layer 4 routing optimization vs CloudFront (Layer 7 HTTP caching).
  - Lambda@Edge vs CloudFront Functions.
  - *Lab:* Deploy an S3 static website fronted by CloudFront secured with OAC.

- [ ] **Day 13: Hybrid Storage & Migration Services**
  - AWS Storage Gateway: File Gateway (S3), Volume Gateway (Cached vs Stored), Tape Gateway.
  - AWS Snow Family: Snowcone, Snowball Edge (Compute vs Storage optimized), Snowmobile.
  - AWS DataSync vs AWS Transfer Family (SFTP/FTPS).
  - AWS Database Migration Service (DMS) & Schema Conversion Tool (SCT).

- [ ] **Day 14: Week 2 Review & Cumulative Practice Test**
  - Complete a 50-question mock test on VPC, Route 53, CloudFront, and Storage Gateway.
  - Identify weak spots in networking routing tables and CIDR calculation.

---

### Week 3: Databases, Serverless & Security
*Objective: Master managed relational & NoSQL databases, event-driven compute, and governance.*

- [ ] **Day 15: Relational Databases (Amazon RDS & Aurora)**
  - Amazon RDS: Multi-AZ (synchronous, disaster recovery) vs Read Replicas (asynchronous, read performance scale).
  - RDS Storage Auto Scaling, automated backups vs manual snapshots.
  - Amazon Aurora: 6 copies across 3 AZs, storage autoscaling up to 128TB, Aurora Serverless v2, Global Database (sub-second cross-region replication).
  - *Lab:* Launch an RDS PostgreSQL instance with a Read Replica; inspect endpoint configurations.

- [ ] **Day 16: NoSQL & In-Memory Caching (DynamoDB & ElastiCache)**
  - Amazon DynamoDB: Partition Key vs Sort Key, Provisioned vs On-Demand capacity.
  - DynamoDB Accelerator (DAX) for microsecond reads.
  - DynamoDB Streams, Global Tables (multi-region active-active replication), TTL.
  - Amazon ElastiCache: Redis (cluster mode, pub/sub, sorting, replication) vs Memcached (simple multi-threaded key-value).
  - *Lab:* Create a DynamoDB table, insert items, query items using partition and sort keys.

- [ ] **Day 17: Serverless Compute (AWS Lambda & API Gateway)**
  - AWS Lambda: Event sources, execution duration (max 15 mins), memory sizing, cold starts, VPC configuration.
  - Amazon API Gateway: REST vs HTTP vs WebSocket APIs, integration types, throttling, caching, Cognito Authorizer.
  - *Lab:* Build a serverless endpoint using API Gateway calling a Python Lambda function that writes to DynamoDB.

- [ ] **Day 18: Application Integration & Messaging (SQS, SNS, Kinesis, EventBridge)**
  - Amazon SQS: Standard (at-least-once, unlimited throughput) vs FIFO (exactly-once, order preserved, 300-3000 msgs/sec).
  - SQS Visibility Timeout, Dead-Letter Queues (DLQ), Long Polling vs Short Polling.
  - Amazon SNS: Pub/Sub topic fan-out pattern with SQS.
  - Amazon Kinesis: Data Streams (real-time stream analytics, shards) vs Firehose (near real-time loader to S3/Redshift/OpenSearch).
  - Amazon EventBridge (formerly CloudWatch Events): Schema Registry, rule filtering, 3rd party SaaS integration.

- [ ] **Day 19: Monitoring, Logging & Auditing (CloudWatch, CloudTrail, Config)**
  - Amazon CloudWatch: Metrics, Alarms, Logs, Dashboards, Synthetics.
  - AWS CloudTrail: API audit logs across account, Management vs Data events, CloudTrail Insights.
  - AWS Config: Configuration compliance recording, automated remediation via SSM documents.
  - *Lab:* Configure a CloudWatch Alarm on EC2 CPU utilization that sends an SNS notification.

- [ ] **Day 20: Security, Encryption & Governance**
  - AWS KMS (Key Management Service): Customer Master Keys (CMKs), AWS managed vs Customer managed, Key policies, Envelope Encryption.
  - AWS Secrets Manager (automatic rotation) vs SSM Parameter Store (hierarchical configuration/secrets, no built-in rotation).
  - AWS WAF (Web Application Firewall) & AWS Shield (Standard vs Advanced DDoS protection).
  - AWS Organizations & Service Control Policies (SCPs - enforce guardrails on member accounts).

- [ ] **Day 21: Week 3 Review & Serverless/Database Quiz**
  - Solve 40-50 practice questions focusing on DynamoDB, RDS, SQS/SNS fan-out, and KMS encryption.
  - Update Error Log.

---

### Week 4: Architecture Patterns & Mock Exam Marathon
*Objective: Tie concepts together with the Well-Architected Framework and crush full-length mock exams.*

- [ ] **Day 22: AWS Well-Architected Framework (6 Pillars)**
  - Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability.
  - Understand the primary design principles of each pillar.

- [ ] **Day 23: Disaster Recovery (DR) Strategies Deep Dive**
  - Understand the tradeoff between RTO (Recovery Time Objective) and RPO (Recovery Point Objective):
    1. *Backup & Restore* (High RTO, High RPO - Cheapest)
    2. *Pilot Light* (Core components running, scaled-down)
    3. *Warm Standby* (Fully functional minimal copy running constantly)
    4. *Multi-Site / Active-Active* (Near-zero RTO, near-zero RPO - Most Expensive)

- [ ] **Day 24: Full-Length Mock Exam 1 (65 Questions, 130 mins)**
  - Strictly simulate exam conditions (no notes, no pause).
  - Spend 2 hours reviewing **every single answer** (correct and incorrect).
  - Document all concepts scored below 75%.

- [ ] **Day 25: Targeted Weak-Point Remediation**
  - Review deep-dive whitepapers / FAQs for weak areas identified in Mock 1 (e.g., Kinesis Shards, Transit Gateway routing, S3 Cross-Account permissions).

- [ ] **Day 26: Full-Length Mock Exam 2**
  - Simulate exam conditions.
  - Score target: ≥ 78-80%.
  - Review and expand Error Log.

- [ ] **Day 27: Full-Length Mock Exam 3**
  - Simulate exam conditions.
  - Score target: ≥ 82-85%.
  - Analyze question patterns: Notice recurring distractors and trap options.

- [ ] **Day 28: Final Full-Length Mock Exam 4 & Speed Drill**
  - Aim to finish 65 questions in 90 minutes, leaving 40 minutes for review.
  - Focus on time management and spotting keywords quickly.

- [ ] **Day 29: Final Review of Cheat Sheets & Error Log**
  - Read through your entire Error Log from Day 1 to Day 28.
  - Review high-yield comparison tables (Storage, Databases, Networking).
  - Ensure zero unanswered doubts remain.
  - Stop studying 4 hours before bedtime; rest your brain.

- [ ] **Day 30: EXAM DAY! 🎓**
  - Eat light, hydrate, breathe, and trust your preparation.

---

## ⚡ High-Yield Cheat Sheets & Decision Matrices

### 1. Database Decision Matrix

| Requirement | Choose This Service | Key Indicators |
|---|---|---|
| Traditional SQL (Postgres, MySQL, Oracle, SQL Server) | **Amazon RDS** | Complex joins, transactional integrity, relational schema |
| High-performance enterprise relational | **Amazon Aurora** | 5x MySQL / 3x Postgres speed, auto-scaling storage, multi-AZ by default |
| Key-Value or Document store (single-digit ms latency) | **Amazon DynamoDB** | Massive scale, unpredictable traffic spikes, NoSQL schema |
| In-memory caching for relational DB | **Amazon ElastiCache** | Reduce DB query load, sub-millisecond response |
| Complex analytical queries / OLAP Data Warehouse | **Amazon Redshift** | Petabyte scale, BI reporting, columnar storage |
| Graph data (social network, fraud detection) | **Amazon Neptune** | Highly connected datasets |

---

### 2. S3 Storage Class Selection

```
Is data accessed frequently?
 ├── YES ──> S3 Standard
 └── NO
      ├── Access pattern unknown/dynamic? ──> S3 Intelligent-Tiering
      └── Predictable infrequent access:
           ├── Millisecond retrieval needed?
           │    ├── Multi-AZ redundancy needed? ──> S3 Standard-IA
           │    └── Low cost, single AZ acceptable? ──> S3 One Zone-IA
           └── Archive data (delay acceptable):
                ├── Millisecond retrieval? ──> S3 Glacier Instant Retrieval
                ├── Minutes to hours retrieval? ──> S3 Glacier Flexible (3-5 hrs default)
                └── Lowest cost, 12-48 hours retrieval? ──> S3 Glacier Deep Archive
```

---

### 3. Decoupling & Event Processing Matrix

| Service | Architecture Pattern | Delivery Guarantee | Retention |
|---|---|---|---|
| **SQS Standard** | Pull-based queue | At-least-once (Duplicates possible) | 1 minute to 14 days |
| **SQS FIFO** | Pull-based queue | Exactly-once (Strict ordering) | 1 minute to 14 days |
| **SNS** | Push-based pub/sub topic | Fan-out to multiple subscribers | No persistence (ephemeral) |
| **Kinesis Data Streams** | Pull-based partition streaming | Replayable stream for analytics | 24 hours up to 365 days |
| **EventBridge** | Event router / Choreography | Filters & routes JSON events from AWS/SaaS | Transient routing |

---

## 🚨 Exam "Trap" Keywords & Elimination Techniques

AWS exam questions are carefully crafted with trigger words. Learn to spot them:

| Trigger Phrase in Question | Correct Architecture Mindset | What to ELIMINATE Immediately |
|---|---|---|
| *"Most cost-effective / Lowest cost"* | Spot Instances, S3 Intelligent-Tiering, Serverless (Lambda), Aurora Serverless | Multi-AZ active-active, Dedicated Hosts, high-end provisioned IOPS |
| *"Least operational overhead / Managed"* | Managed AWS services (Serverless, S3, Aurora, SSM, Transit Gateway) | Self-hosted EC2 software, custom scripts, manual cron jobs |
| *"Real-time / Sub-millisecond"* | ElastiCache, DynamoDB + DAX, NLB | RDS, S3 standard queries, polling architectures |
| *"Decouple components / Asynchronous"* | SQS queues, SNS topics, EventBridge | Direct synchronous HTTP API calls between EC2 instances |
| *"Disaster Recovery with near-zero RTO/RPO"* | Multi-Region Active-Active, Aurora Global Database | Backup and Restore, Pilot Light |
| *"Preserve client source IP"* | Network Load Balancer (NLB) or ALB with `X-Forwarded-For` | Classic Load Balancer, basic proxying |

---

## 📚 Curated Resources & Tools

### Recommended Courses & Practice Tests
1. **Video Course:**
   - *Stephane Maarek* (Udemy: Ultimate AWS Certified Solutions Architect Associate SAA-C03) - *Best concise coverage.*
   - *Adrian Cantrill* (cantrill.io) - *Best for deep hands-on architectural understanding.*
2. **Practice Exams (The Gold Standard):**
   - *Tutorials Dojo (Jon Bonso)* Practice Exams - **Absolute must-have**. The explanations for wrong answers are more valuable than the questions themselves.
3. **Free Reference Material:**
   - [AWS Well-Architected Framework Whitepapers](https://aws.amazon.com/architecture/well-architected/)
   - [AWS Ramp-Up Guide: Architect](https://aws.amazon.com/training/ramp-up-guides/)

---

## 🏁 Exam Day Protocol & Checklist

### Preparation Day Before Exam:
- [ ] Check your computer system requirements if taking the exam via Pearson VUE online proctoring (test webcam, mic, speed).
- [ ] Prepare 2 valid government IDs (Passport, Driving License, National ID).
- [ ] Clean your testing desk completely (no dual monitors, papers, pens, or electronics within reach).
- [ ] Get 7-8 hours of sound sleep.

### During the Exam:
1. **Pace Yourself:** 65 questions in 130 minutes = **2 minutes per question**.
2. **Flag and Move On:** If a question takes more than 90 seconds, select your best initial guess, flag it for review, and keep going. Do not let one tricky question drain your confidence.
3. **Read the Last Sentence First:** Read the exact question prompt (e.g., *"Which solution meets these requirements with the LEAST operational overhead?"*) before reading the lengthy paragraph. This primes your brain to filter irrelevant details.
4. **Process of Elimination:** Eliminate the 2 obviously wrong distractors first. Usually, 2 options are technically impossible or violate best practices; then choose between the remaining 2 based on the constraints (cost vs performance).

---

*Made with dedication for your AWS Certification Success. Consistency over intensity wins the exam!*
