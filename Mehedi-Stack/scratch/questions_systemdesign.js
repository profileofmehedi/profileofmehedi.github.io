// Questions 96 to 120: System Design, Distributed Systems, Microservices, Scalability
module.exports = [
  // Mid-Level
  {
    topic: 'systemdesign',
    level: 'mid',
    badge: 'Architecture Paradigm',
    q: '৯৬. Monolithic বনাম Microservices Architecture: কখন মাইক্রোসার্ভিসে যাবেন এবং কখন যাবেন না?',
    a: `<p><strong>Monolith:</strong> সমস্ত বিজনেস মডিউল একটি একক কোডবেস এবং একক ডেপ্লয়েবল ইউনিট হিসেবে রান করে। সুবিধা: দ্রুত ডেভেলপমেন্ট, সহজ ডিবাগিং, কোনো নেটওয়ার্ক ল্যাটেন্সি নেই, সিঙ্গেল ডাটাবেজ ট্রানজ্যাকশন (ACID)। অসুবিধা: টিম বড় হলে কোড কনফ্লিক্ট বাড়ে, যেকোনো ছোট পরিবর্তনের জন্য পুরো সিস্টেম রি-ডেপ্লয় করতে হয়।</p>
<p><strong>Microservices:</strong> ব্যবসায়িক ডোমেইন অনুযায়ী স্বাধীন ছোট ছোট সার্ভিস (User, Order, Payment) যা নিজস্ব ডাটাবেজ মেইনটেইন করে এবং নেটওয়ার্কে (REST/gRPC/Kafka) যোগাযোগ করে।</p>
<p><strong>কখন যাবেন না:</strong> স্টার্টআপ বা প্রজেক্টের প্রাথমিক পর্যায়ে কখনই মাইক্রোসার্ভিস শুরু করবেন না (Martin Fowler's Monolith First)। ডিস্ট্রিবিউটেড সিস্টেমের ওভারহেড (নেটওয়ার্ক ফেইলিওর, ডেটা ইনকনসিস্টেন্সি, সিআই/সিডি জটিলতা) ছোট টিমের সক্ষমতা নষ্ট করে দেয়। যখন কোনো নির্দিষ্ট মডিউলে অস্বাভাবিক ট্রাফিক আসে বা ১০০+ ইঞ্জিনিয়ারের দল স্বাধীনভাবে কাজ করতে চায়, কেবল তখনই মাইক্রোসার্ভিসে ভাগ করুন।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'mid',
    badge: 'Scalability & Balancing',
    q: '৯৭. Horizontal vs Vertical Scaling কী? Load Balancing এর প্রধান অ্যালগরিদমগুলো কী কী?',
    a: `<p><strong>Vertical Scaling (Scale Up):</strong> বিদ্যমান সিঙ্গেল সার্ভারে আরও বেশি CPU, RAM যুক্ত করা। একটি নির্দিষ্ট সীমার পর এটি অত্যন্ত ব্যয়বহুল এবং Single Point of Failure (SPOF)।</p>
<p><strong>Horizontal Scaling (Scale Out):</strong> লোড ব্যালেন্সারের পেছনে একের অধিক সাধারণ সার্ভার ইনস্ট্যান্স যুক্ত করা। আধুনিক ক্লাউড সিস্টেমে এটিই মূল আর্কিটেকচার।</p>
<p><strong>প্রধান অ্যালগরিদম:</strong> <em>Round Robin</em> (ক্রমানুসারে পাঠায়), <em>Least Connections</em> (যে সার্ভারে সবচেয়ে কম অ্যাক্টিভ ক্লায়েন্ট আছে), <em>IP Hash</em> (আইপি হ্যাশ করে সর্বদা একই সার্ভারে পাঠায় - Sticky Session)।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'mid',
    badge: 'API Protocols',
    q: '৯৮. REST বনাম gRPC বনাম GraphQL এর আর্কিটেকচারাল ট্রেড-অফ ব্যাখ্যা করুন।',
    a: `<p><strong>REST (HTTP/1.1 + JSON):</strong> সার্বজনীন ও সহজ ডিবাগিংযোগ্য। ব্রাউজার টু ব্যাকএন্ড পাবলিক এপিআই-র জন্য ডি-ফ্যাক্টো স্ট্যান্ডার্ড। কিন্তু টেক্সট-বেসড হওয়ায় পেলোড বড় হয়।</p>
<p><strong>gRPC (HTTP/2 + Protocol Buffers):</strong> বাইনারি সিরিয়ালাইজেশন ফরম্যাট। অত্যন্ত দ্রুত এবং ব্যান্ডউইথ খরচ JSON-এর তুলনায় ৭০% কম। একই TCP কানেকশনে মাল্টিপ্লেক্সিং ও স্ট্রিমিং সমর্থন করে। <em>ব্যবহার:</em> ইন্টারনাল মাইক্রোসার্ভিস টু মাইক্রোসার্ভিস হাই-পারফরম্যান্স যোগাযোগ।</p>
<p><strong>GraphQL:</strong> ক্লায়েন্ট একটি একক এন্ডপয়েন্টে কোয়েরি পাঠিয়ে ঠিক যে ফিল্ড দরকার শুধুমাত্র সেগুলোই চায়। মোবাইল অ্যাপ্লিকেশনে Over-fetching এবং Under-fetching সম্পূর্ণ দূর করে।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'mid',
    badge: 'Distributed Systems',
    q: '৯৯. Idempotency Key কী এবং পেমেন্ট সিস্টেমে কেন এটি অত্যন্ত গুরুত্বপূর্ণ?',
    a: `<p>ডিস্ট্রিবিউটেড সিস্টেমে নেটওয়ার্ক ফেইলিওরের কারণে ক্লায়েন্ট একই রিকোয়েস্ট একাধিকবার পাঠাতে পারে। যদি ইউজার পেমেন্ট করার পর টাইমআউট পেয়ে পুনরায় সাবমিট করে, তার কার্ড থেকে দুবার টাকা কাটা একটি মারাত্মক ত্রুটি।</p>
<p><strong>Idempotency Key:</strong> ক্লায়েন্ট প্রতি ট্রানজ্যাকশনে একটি ইউনিক <code>Idempotency-Key: UUID</code> হেডারে পাঠায়। সার্ভার ডাটাবেজ বা Redis এ চেক করে কি-টি ইতোমধ্যে প্রসেস হয়েছে কি না। প্রসেস হয়ে থাকলে সে পুনরায় চার্জ না করে পূর্বের সেভ করা রেজাল্ট রিটার্ন করে।</p>`
  },

  // Senior / Architect
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Microservices Data',
    q: '১০০. Dual-Write Problem কী এবং Transactional Outbox Pattern কীভাবে ডেটা কনসিস্টেন্সি রক্ষা করে?',
    a: `<p>যখন একটি সার্ভিস একই সাথে ডাটাবেজে অর্ডার সেভ করে এবং কাফকাতে ইভেন্ট পাবলিশ করতে চায়: ডাটাবেজ সেভ সফল হলেও যদি কাফকা ডাউন থাকার কারণে মেসেজ ড্রপ হয়, তবে সিস্টেম স্থায়ীভাবে ইনকনসিস্টেন্ট হয়ে যায়।</p>
<p><strong>Transactional Outbox:</strong> কাফকাতে সরাসরি না পাঠিয়ে, একই লোকাল ডাটাবেজ ট্রানজ্যাকশনে <code>Orders</code> এবং <code>OutboxMessages</code> টেবিলে ইভেন্ট সেভ করা হয় (Atomic Commit)। এরপর একটি ব্যাকগ্রাউন্ড মেসেজ রিলে (যেমন Debezium CDC) ডাটাবেজের ট্রানজ্যাকশন লগ পড়ে কাফকাতে পুশ করে। এটি নেটওয়ার্ক ক্র্যাশেও মেসেজ হারানোর ঝুঁকি সম্পূর্ণ দূর করে (At-least-once delivery)।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Fault Tolerance',
    q: '১০১. Circuit Breaker (Polly) এর ৩টি স্টেট কীভাবে ক্যাসকেডিং ফেইলিওর ঠেকায়?',
    a: `<p>যখন কোনো ডাউনস্ট্রিম থার্ড-পার্টি সার্ভিস ডাউন থাকে, ইনকামিং হাজার হাজার রিকোয়েস্ট থ্রেড ব্লক করে বসে থাকে এবং এক সার্ভিসের কারণে পুরো ক্লাস্টার ভেঙে পড়ে (Cascading Failure)।</p>
<p><strong>Circuit Breaker ৩টি স্টেটে পরিচালিত হয়:</strong></p>
<ul>
    <li><strong>Closed (স্বাভাবিক):</strong> রিকোয়েস্ট স্বাভাবিকভাবে পাস হয় এবং ফেইলিওর রেট পর্যবেক্ষণ করা হয়।</li>
    <li><strong>Open (সার্কিট ব্রেক):</strong> ফেইলিওর রেট ৫০% অতিক্রম করলে সার্কিট ওপেন হয়ে যায়। ডাউনস্ট্রিমে কোনো নেটওয়ার্ক কল না পাঠিয়ে তাৎক্ষণিকভাবে ফলব্যাক রেসপন্স ফেরত দেয়।</li>
    <li><strong>Half-Open (টেস্টিং):</strong> নির্দিষ্ট বিরতির পর ১-২টি ট্রায়াল রিকোয়েস্ট পাঠায়। সফল হলে স্বাভাবিক স্টেটে ফেরে, ফেইল হলে আবার ওপেন স্টেটে লক থাকে।</li>
</ul>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Distributed Transactions',
    q: '১০২. Distributed Transactions: Two-Phase Commit (2PC) বনাম Saga Pattern (Choreography vs Orchestration)?',
    a: `<p><strong>Two-Phase Commit (2PC):</strong> সেন্ট্রাল কোঅর্ডিনেটর সমস্ত পার্টিসিপ্যান্ট নোডকে লক করে। ক্লাউডে এটি অ্যান্টি-প্যাটার্ন কারণ নেটওয়ার্ক ড্রপে পুরো সিস্টেম লক হয়ে থমকে যায়।</p>
<p><strong>Saga Pattern:</strong> লোকাল ট্রানজ্যাকশনের একটি ধারাবাহিক সিকোয়েন্স। কোনো ধাপ ব্যর্থ হলে আগের সমস্ত সফল ধাপকে রিভার্স করার জন্য <strong>Compensating Transaction</strong> চালানো হয়।</p>
<ul>
    <li><strong>Choreography:</strong> প্রতিটি সার্ভিস ইভেন্ট শুনে নিজের কাজ করে পরবর্তী ইভেন্ট ছাড়ে। সেন্ট্রাল কন্ট্রোলার থাকে না (ছোট প্রজেক্টের জন্য)।</li>
    <li><strong>Orchestration:</strong> একটি সেন্ট্রাল অর্কেস্ট্রেটর (MassTransit State Machine) ধাপে ধাপে নির্দেশ পাঠায় এবং ফেইল করলে সুনির্দিষ্ট ক্ষতিপূরণমূলক রোলব্যাক চালায় (জটিল ফাইন্যান্সিয়াল সিস্টেমের জন্য সেরা)।</li>
</ul>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Event Streaming',
    q: '১০৩. Apache Kafka Internals: Partition, Consumer Group, Rebalancing এবং Exactly-Once Semantics (EOS)?',
    a: `<p><strong>Topic & Partition:</strong> কাফকা টপিক এক বা একাধিক পার্টিশনে বিভক্ত থাকে যা ডিস্কে অ্যাপেন্ড-অনলি কমিট লগ হিসেবে থাকে। পার্টিশনই হলো কাফকার সমান্তরাল স্কেলিংয়ের একক।</p>
<p><strong>Consumer Group & Rebalancing:</strong> একটি গ্রুপের কনজিউমারদের মাঝে পার্টিশনগুলো বণ্টিত হয়। কনজিউমার ক্র্যাশ করলে গ্রুপ কোঅর্ডিনেটর পার্টিশনগুলোকে সুস্থ মেম্বারদের মাঝে পুনর্বণ্টন (Rebalance) করে দেয়।</p>
<p><strong>Exactly-Once Semantics (EOS):</strong> আইডেম্পোটেন্ট প্রডিউসার (<code>enable.idempotence=true</code>) এবং ট্রানজ্যাকশনাল প্রডিউসার দিয়ে নিশ্চিত করা হয় যে নেটওয়ার্ক ড্রপ হলেও ডুপ্লিকেট মেসেজ তৈরি হবে না এবং এন্ড-টু-এন্ড ডাটা একবারই প্রসেস হবে।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'High Scale Case Study',
    q: '১০৪. ফ্ল্যাশ সেল বা টিকিট বুকিং সিস্টেমে লাখ লাখ কনকারেন্ট ট্রাফিকে ডাটাবেজ ক্র্যাশ না করিয়ে কীভাবে হ্যান্ডেল করবেন?',
    a: `<p><strong>ফ্ল্যাশ সেলে ডাটাবেজে সরাসরি কল করা নিষিদ্ধ:</strong></p>
<ol>
    <li><strong>ইন-মেমোরি স্টক ম্যানেজমেন্ট (Redis Lua Script):</strong> স্টকের সংখ্যা Redis-এ ক্যাশ থাকে। <code>DECRBY</code> লজিকটি একটি সিঙ্গেল অ্যাটমিক Redis Lua স্ক্রিপ্টে চালানো হয়। স্টক ০ হলে ইনস্ট্যান্ট "Sold Out" বলে ফেরত পাঠানো হয়।</li>
    <li><strong>অ্যাসিঙ্ক অর্ডার প্লেসমেন্ট (Kafka Queue):</strong> যারা স্টক সফলভাবে ডিক্রিমেন্ট করতে পেরেছে তাদের অর্ডার ইভেন্ট কাফকা কিউতে পাঠিয়ে দেওয়া হয়।</li>
    <li><strong>ডাটাবেজ ব্যাচ রাইটার:</strong> ব্যাকগ্রাউন্ড ওয়ার্কার সার্ভিস কাফকা থেকে প্রতি সেকেন্ডে ১০০-২০০টি করে অর্ডার ব্যাচ আকারে ডাটাবেজে পারসিস্ট করে।</li>
</ol>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'API Rate Limiting',
    q: '১০৫. API Rate Limiting: Token Bucket, Leaky Bucket এবং Sliding Window Counter এর মেকানিক্স ব্যাখ্যা করুন।',
    a: `<p><strong>Token Bucket:</strong> বালতিতে প্রতি সেকেন্ডে নির্দিষ্ট হারে টোকেন জমা হয়। রিকোয়েস্ট এলে ১টি টোকেন নিয়ে পাস হয়। ফাঁকা থাকলে রিকোয়েস্ট বাতিল (HTTP 429)। সাময়িক বাস্ট ট্রাফিক অনুমোদন করে।</p>
<p><strong>Leaky Bucket:</strong> রিকোয়েস্টগুলো কিউতে জমা হয় এবং নিচের ছিদ্র দিয়ে স্থির গতিতে প্রসেস হয়। কোনো বাস্ট অ্যালাউ করে না।</p>
<p><strong>Sliding Window Counter (Redis):</strong> বর্তমান সময় এবং বিগত ৬০ সেকেন্ডের বাউন্ডারিকে স্লাইডিং উইন্ডো আকারে পর্যবেক্ষণ করে রিয়েল-টাইমে নিখুঁত রেট লিমিট নিশ্চিত করে।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Distributed Partitioning',
    q: '১০৬. Consistent Hashing with Virtual Nodes: ক্যাশিং নোড যোগ/বিয়োগের সময় রিব্যালেন্সিং কীভাবে সমাধান করে?',
    a: `<p>সাধারণ হ্যাশিংয়ে <code>hash(key) % N</code> ব্যবহার করা হয়। কিন্তু একটি নোড মারা গেলে বা যোগ হলে (N পরিবর্তিত হলে) ৯৯% ক্যাশ মিস হয়ে সম্পূর্ণ ক্যাশ ক্লাস্টার ধ্বংস হয়ে যায়।</p>
<p><strong>Consistent Hashing:</strong> একটি কাল্পনিক বৃত্তাকার <strong>Hash Ring (0 থেকে 2^32-1)</strong> তৈরি করে। সার্ভার এবং ডেটা কি উভয়কেই এই রিংয়ে হ্যাশ করে ম্যাপ করা হয়। প্রতিটি ডেটা কি ঘড়ির কাঁটার দিকে প্রথম সার্ভারে স্থান পায়। কোনো সার্ভার বাদ পড়লে শুধুমাত্র তার পার্শ্ববর্তী নোডের ক্যাশ রি-হ্যাশ হয়, বাকি ৯৫% ক্যাশ অক্ষত থাকে।</p>
<p><strong>Virtual Nodes (ভার্চুয়াল নোড):</strong> ডেটার অসম বণ্টন (Hotspots) রোধ করতে প্রতিটি ফিজিক্যাল সার্ভারকে রিংয়ের বিভিন্ন বিন্দুতে ১০০-২০০টি ভার্চুয়াল নোড হিসেবে ছড়িয়ে দেওয়া হয়, যা নিখুঁত সুষম ভারসাম্য (Uniform Distribution) নিশ্চিত করে।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Database Sharding',
    q: '১০৭. Database Sharding: Range-based বনাম Hash-based Sharding এবং Cross-shard Query কীভাবে হ্যান্ডেল করবেন?',
    a: `<p>যখন ডাটাবেজ টেবিল এত বড় হয়ে যায় যে সিঙ্গেল মেশিনের ডিস্ক বা মেমোরিতে ধরে না, তখন অনুভূমিকভাবে ডেটাকে একাধিক স্বাধীন ডাটাবেজ নোডে ভাগ করাকে <strong>Sharding</strong> বলে।</p>
<ul>
    <li><strong>Range-based Sharding:</strong> নির্দিষ্ট সীমার ভিত্তিতে ভাগ করা (যেমন: ইউজার আইডি ১-১ মিলিয়ন Shard 1 এ, ১-২ মিলিয়ন Shard 2 এ)। রেঞ্জ কুয়েরি সহজ কিন্তু নতুন ব্যবহারকারীদের কারণে শেষ শার্ডে হটস্পট হয়।</li>
    <li><strong>Hash-based Sharding:</strong> <code>hash(UserId) % TotalShards</code>। ডেটা সুষমভাবে ছড়ায় কিন্তু রেঞ্জ কোয়েরি অত্যন্ত কঠিন।</li>
    <li><strong>Cross-shard Queries & Joins:</strong> দুটি ভিন্ন শার্ডের টেবিল সরাসরি SQL JOIN করা যায় না। <em>সমাধান:</em> অ্যাপ্লিকেশন লেভেলে প্যারালাল কুয়েরি চালিয়ে মেমোরিতে মার্চ করা (Scatter-Gather Pattern), অথবা গ্লোবাল লুকআপ টেবিল আলাদা ক্যাশে রাখা।</li>
</ul>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Event-Driven Architecture',
    q: '১০৮. Event Sourcing এবং CQRS: Aggregate Snapshots এবং Read Model Projections কীভাবে তৈরি হয়?',
    a: `<p><strong>Event Sourcing:</strong> বর্তমান স্টেট সরাসরি ডাটাবেজে ওভাররাইট না করে, সিস্টেমে যা যা ঘটেছে তার সমস্ত অপরিবর্তনশীল ঘটনাকে (Events) একটি <strong>Append-Only Event Store</strong>-এ ক্রমানুসারে সংরক্ষণ করা হয় (যেমন: <code>AccountCreated</code>, <code>MoneyDeposited</code>, <code>MoneyWithdrawn</code>)।</p>
<ul>
    <li><strong>Aggregate Reconstitution:</strong> অবজেক্টের বর্তমান ব্যালেন্স জানতে সমস্ত পুরানো ইভেন্ট প্রথম থেকে রি-প্লে (Replay) করা হয়।</li>
    <li><strong>Snapshots:</strong> ১ লাখ ইভেন্ট রি-প্লে করা ধীরগতির হওয়ায় প্রতি ১,০০০ ইভেন্ট পর পর একটি স্টেট স্ন্যাপশট নিয়ে রাখা হয়।</li>
    <li><strong>Projections (Read Models):</strong> ব্যাকগ্রাউন্ড প্রজেকশন সার্ভিস ইভেন্টগুলো শুনে রিলেশনাল DB বা Elasticsearch এ ডিনরমালাইজড রিড মডেল তৈরি করে রাখে, যাতে ইউজাররা মিলি-সেকেন্ডে কুয়েরি করতে পারে।</li>
</ul>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Distributed Consensus',
    q: '১০৯. Distributed Consensus: Raft অ্যালগরিদম কীভাবে Leader Election, Log Replication এবং Split-Brain রোধ করে?',
    a: `<p>ডিস্ট্রিবিউটেড ক্লাস্টারে (যেমন Kafka, Etcd, Consul) সমস্ত নোড যেন একই স্টেট মেনে চলে তার জন্য <strong>Raft Consensus</strong> ব্যবহৃত হয়:</p>
<ol>
    <li><strong>Leader Election:</strong> ক্লাস্টারের নোড ৩টি স্টেটে থাকে (Follower, Candidate, Leader)। প্রতিটি নোডের একটি র‍্যান্ডম হার্টবিট টাইমার থাকে। লিডারের হার্টবিট মিস হলে নোড Candidate হয়ে ভোট চায়। সংখ্যাগরিষ্ঠ ভোট (Quorum: <code>(N/2) + 1</code>) পেলে সে নতুন Leader হয়।</li>
    <li><strong>Log Replication:</strong> ক্লায়েন্ট লিডারকে রাইট পাঠায়। লিডার সমস্ত ফলোয়ার নোডে লগ রেপ্লিকেট করে এবং সংখ্যাগরিষ্ঠ নোড লগ রাইট কনফার্ম করলে লিডার ট্রানজ্যাকশন কমিট করে।</li>
    <li><strong>Split-Brain প্রতিরোধ:</strong> ৫টি নোডের ক্লাস্টার ভেঙে ২ এবং ৩ নোডে ভাগ হলে, ৩ নোডের পক্ষই কেবল সংখ্যাগরিষ্ঠ কোরাম গঠন করতে পারে। ২ নোডের পক্ষ কোনো সিদ্ধান্ত কমিট করতে পারে না, ফলে ডেটা করাপশন রোধ হয়।</li>
</ol>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Distributed Locking Fencing',
    q: '১১০. Martin Kleppmann এর RedLock সমালোচনা কী এবং Fencing Tokens কীভাবে রেস কন্ডিশন সমাধান করে?',
    a: `<p>মার্টিন ক্লেপম্যান প্রমাণ করেন যে বিশুদ্ধ টাইম-বেসড রেডিস ডিস্ট্রিবিউটেড লক (RedLock) শতভাগ নিরাপদ নয়।</p>
<p><strong>ভুল সিনারিও:</strong> Client 1 লক নিল। হঠাৎ Client 1-এ একটি দীর্ঘ <strong>GC Pause</strong> বা নেটওয়ার্ক স্টল হলো। এর মাঝে লকের TTL এক্সপায়ার হয়ে গেল এবং Client 2 নতুন লক পেয়ে কাজ শুরু করল। Client 1 যখন আনফ্রিজ হলো, সে মনে করল লক এখনও তার কাছেই আছে এবং সে ফাইল রাইট করে Client 2 এর ডেটা ওভাররাইট করে ফেলল!</p>
<p><strong>Fencing Token এর সমাধান:</strong> লক নেওয়ার সময় সার্ভার একটি ক্রমবর্ধমান টোকেন (Monotonically Increasing Number, যেমন: টোকেন ৩৪, ৩৫) প্রদান করে। স্টোরেজ বা ডাটাবেজ যেকোনো রাইট গ্রহণের আগে চেক করে: যদি আগত রিকোয়েস্টের টোকেন পূর্বের প্রসেস করা সর্বোচ্চ টোকেনের চেয়ে কম হয়, তবে সে রাইট তাৎক্ষণিকভাবে রিজেক্ট করে দেয়।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Real-time at Scale C1000K',
    q: '১১১. ১ মিলিয়ন কনকারেন্ট WebSocket কানেকশন (C1000K Problem) হ্যান্ডেল করার আর্কিটেকচার কীভাবে সাজাবেন?',
    a: `<p>১০ লাখ লাইভ ওয়েবসকেট ক্লায়েন্ট ধরে রাখতে অপারেটিং সিস্টেম ও আর্কিটেকচারাল সমন্বয় প্রয়োজন:</p>
<ol>
    <li><strong>OS Kernel Tuning:</strong> ডিফল্ট লিনাক্সে ফাইল ডেসক্রিপ্টর লিমিট মাত্র ১০২৪। <code>/etc/security/limits.conf</code> এ <code>nofile 2000000</code> এবং <code>sysctl</code> এ <code>net.ipv4.ip_local_port_range</code> টিউন করতে হবে।</li>
    <li><strong>Epoll I/O Multiplexing:</strong> প্রতি কানেকশনে ১টি করে থ্রেড রাখা অসম্ভব। লিনাক্সের <strong>Epoll</strong> মেকানিজমে একটি সিঙ্গেল ইভেন্ট-লুপ থ্রেড লক্ষ লক্ষ নিষ্ক্রিয় সকেট কানেকশন হ্যান্ডেল করে (Kestrel Transport Sockets)।</li>
    <li><strong>Redis Pub/Sub Backplane:</strong> ইউজাররা বিভিন্ন ক্লাস্টার সার্ভারে যুক্ত থাকে। Server A-তে থাকা ব্যবহারকারী Server B-এর কোনো ফ্রেন্ডকে মেসেজ পাঠালে মাঝখানে <strong>Redis Pub/Sub</strong> বা <strong>RabbitMQ</strong> ব্যাকপ্লেন মেসেজ রাউটিং পরিচালনা করে।</li>
</ol>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Distributed Observability',
    q: '১১২. OpenTelemetry এবং W3C TraceContext: ডিস্ট্রিবিউটেড সিস্টেমে TraceId এবং SpanId কীভাবে প্রোপাগেট হয়?',
    a: `<p>একটি ইউজার রিকোয়েস্ট যদি ৭টি মাইক্রোসার্ভিস পার করে আসে, একটি সেন্ট্রাল ট্রেস আইডি ছাড়া এরর ডিবাগ করা অসম্ভব।</p>
<p><strong>W3C TraceContext স্পেসিফিকেশন:</strong> প্রতি HTTP/gRPC রিকোয়েস্টের হেডারে স্ট্যান্ডার্ড হেডার পাঠানো হয়:</p>
<pre><code>traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01</code></pre>
<ul>
    <li><code>4bf92f...</code> হলো <strong>TraceId</strong> (পুরো রিকোয়েস্ট লাইফসাইকেলে একই থাকে)।</li>
    <li><code>00f067...</code> হলো <strong>SpanId</strong> (প্রতিটি নির্দিষ্ট সার্ভিসের কাজের একক)।</li>
    <li>.NET 8 এর <code>ActivitySource</code> এবং OpenTelemetry স্বয়ংক্রিয়ভাবে ডাউনস্ট্রিম এপিআই কলে এই হেডার ইনজেক্ট করে। Jaeger বা Zipkin-এ সম্পূর্ণ রিকোয়েস্টের এন্ড-টু-এন্ড টাইমলাইন মিলিসেকেন্ড নিখুঁতভাবে দেখা যায়।</li>
</ul>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Distributed Transactions TCC',
    q: '১১৩. TCC (Try-Confirm-Cancel) প্যাটার্ন কী এবং পেমেন্ট গেটওয়েতে Saga এর চেয়ে এটি কখন বেশি উপযোগী?',
    a: `<p><strong>Saga এর সীমাবদ্ধতা:</strong> সাগাতে প্রতিটি ধাপ সরাসরি আসল টাকা কেটে ফেলে। শেষের ধাপে ফেইল করলে ক্ষতিপূরণমূলক ট্রানজ্যাকশনে টাকা রিফান্ড করা হয়—যা গ্রাহকের ব্যাংক স্টেটমেন্টে বিভ্রান্তি তৈরি করে।</p>
<p><strong>TCC ৩ ধাপে কাজ করে:</strong></p>
<ol>
    <li><strong>Try:</strong> টাকা না কেটে শুধুমাত্র নির্দিষ্ট ব্যালেন্স <strong>রিজার্ভ বা ফ্রিজ (Hold)</strong> করে রাখে।</li>
    <li><strong>Confirm:</strong> সমস্ত ডিপেনডেন্ট সার্ভিস সফল হলে রিজার্ভ করা টাকা একবারে <strong>Deduct</strong> করে ট্রানজ্যাকশন সম্পন্ন করে।</li>
    <li><strong>Cancel:</strong> কোনো একটি সার্ভিস ফেইল করলে রিজার্ভ করা হোল্ডটি রিলিজ করে দেয় (গ্রাহকের একাউন্টে কোনো কাটাছেঁড়া ছাড়াই)।</li>
</ol>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Disaster Recovery RTO RPO',
    q: '১১৪. Disaster Recovery: RTO বনাম RPO কী? Multi-Region Active-Active আর্কিটেকচার কীভাবে ডিজাইন করবেন?',
    a: `<p><strong>RTO (Recovery Time Objective):</strong> একটি ডাটা সেন্টার পুড়ে বা ডাউন হয়ে যাওয়ার পর কত সময়ের ভেতর সিস্টেম রিস্টোর করতে হবে (যেমন: সর্বোচ্চ ১৫ মিনিট)।</p>
<p><strong>RPO (Recovery Point Objective):</strong> দুর্যোগের সময় সর্বোচ্চ কতটুকু সাম্প্রতিক ডেটা হারানোর ঝুঁকি ব্যবসা মেনে নেবে (যেমন: ০ সেকেন্ড বা সর্বোচ্চ ২ মিনিট)।</p>
<p><strong>Multi-Region Active-Active আর্কিটেকচার:</strong> দুটি ভিন্ন ভৌগোলিক ক্লাউড রিজিয়নে (যেমন: AWS ফ্রাঙ্কফুর্ট ও সিঙ্গাপুর) সম্পূর্ণ অ্যাপ ও ডাটাবেজ সমান্তরালে লাইভ থাকে। ক্লায়েন্ট ট্রাফিক <strong>Route 53 Geolocation / Latency Routing</strong> দিয়ে নিকটবর্তী রিজিয়নে পাঠানো হয়। ডাটাবেজে মাল্টি-মাস্টার বাই-ডিরেকশনাল রেপ্লিকেশন (Conflict-Free Replicated Data Types - CRDTs) নিশ্চিত করা হয়।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Caching Topologies',
    q: '১১৫. Caching Topologies: Write-Through বনাম Write-Behind (Write-Back) এবং Cache Invalidation স্ট্রেটেজি?',
    a: `<p><strong>Write-Through:</strong> অ্যাপ ক্যাশে ডাটা লেখে এবং ক্যাশ প্রোভাইডার সিনক্রোনাসলি ডাটাবেজে ডাটা সেভ করে। উভয়ই সফল হলে কনফার্মেশন ফেরত আসে। ক্যাশ এবং ডাটাবেজ সর্বদা ১০০% কনসিস্টেন্ট থাকে কিন্তু রাইট ল্যাটেন্সি বেশি।</p>
<p><strong>Write-Behind (Write-Back):</strong> অ্যাপ দ্রুত মেমোরি ক্যাশে ডাটা লিখে ইউজারকে ওকে বলে দেয়। ক্যাশ ইঞ্জিন ব্যাকগ্রাউন্ডে ব্যাচ আকারে ডাটাবেজে ডেটা পারসিস্ট করে। রাইট বিদ্যুৎগতি সম্পন্ন হলেও সার্ভার হঠাৎ ক্র্যাশ করলে মেমোরির ডাটা হারানোর ঝুঁকি থাকে।</p>
<p><strong>Cache Invalidation:</strong> সবচেয়ে জনপ্রিয় হলো <strong>Cache-Aside (Lazy Loading)</strong>। আপডেটের সময় ক্যাশ আপডেট না করে সরাসরি <strong>Delete (Evict)</strong> করে দেওয়া হয়। পরবর্তী রিড রিকোয়েস্ট ক্যাশ মিস করে নতুন ডাটাবেজ ভ্যালু এনে ক্যাশ পপুলেট করে নেয়।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Edge Computing & CDN',
    q: '১১৬. CDN Edge Caching: stale-while-revalidate এবং Cloudflare Workers কীভাবে অরিজিন সার্ভারের ৯০% লোড কমায়?',
    a: `<p><strong>stale-while-revalidate হেডার:</strong></p>
<pre><code>Cache-Control: max-age=600, stale-while-revalidate=30</code></pre>
<p>ক্যাশ এক্সপায়ার হওয়ার পরও এজ ক্যাশ ক্লায়েন্টকে দ্রুত পুরানো ক্যাশ রেসপন্স ফেরত দেয় (জিরো ল্যাটেন্সি) এবং পেছনের ব্যাকগ্রাউন্ডে সম্পূর্ণ স্বাধীনভাবে অরিজিন সার্ভার থেকে নতুন ডাটা এনে ক্যাশ রিফ্রেশ করে নেয়।</p>
<p><strong>Edge Workers:</strong> ব্যবহারকারীর নিকটবর্তী ক্লাউডফ্লেয়ার বা ক্লাউডফ্রন্ট এজ পপ (PoP) এ লাইটওয়েট V8 আইসোলেটে কোড এক্সিকিউট করে। জিও-রিডাইরেকশন, অথেনটিকেশন JWT ভ্যালিডেশন এবং এ/বি টেস্টিং অরিজিন সার্ভারে পৌঁছানোর আগেই এজ থেকেই নিষ্পন্ন হয়ে যায়।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Async Request-Reply',
    q: '১১৭. Asynchronous Request-Reply Pattern: দীর্ঘায়িত ভারী ব্যাকগ্রাউন্ড প্রসেসিংয়ে HTTP 202 Accepted কীভাবে কাজ করে?',
    a: `<p>যদি কোনো রিকোয়েস্ট সম্পন্ন হতে ৩০ সেকেন্ড বা তার বেশি সময় লাগে (যেমন: ১ লাখ রো-র এক্সেল রিপোর্ট তৈরি বা ভিডিও ট্রান্সকোডিং), সরাসরি HTTP কানেকশন ধরে রাখলে গেটওয়ে ৫০৪ টাইমআউট দেয়।</p>
<p><strong>সমাধান:</strong></p>
<ol>
    <li>ক্লায়েন্ট রিকোয়েস্ট পাঠালে সার্ভার জবটি কিউতে পুশ করে তাৎক্ষণিকভাবে ফেরত দেয়: <code>HTTP 202 Accepted</code> সাথে হেডারে <code>Location: /api/jobs/123/status</code> এবং <code>Retry-After: 10</code>।</li>
    <li>ক্লায়েন্ট প্রতি ১০ সেকেন্ড পর পর স্ট্যাটাস ইউআরএলে পোলিং করে প্রগ্রেস চেক করে।</li>
    <li>কাজ শেষ হলে স্ট্যাটাস এন্ডপয়েন্ট <code>HTTP 303 See Other</code> দিয়ে প্রস্তুত ফাইলের ডাউনলোড লিঙ্ক ফেরত দেয়।</li>
</ol>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Resilience Patterns',
    q: '১১৮. Bulkhead Pattern: কীভাবে থ্রেডপুল ও মেমোরি আইসোলেশন দিয়ে একটি স্লো সার্ভিস থেকে সম্পূর্ণ সিস্টেমকে রক্ষা করবেন?',
    a: `<p>জাহাজের খোলে বিভিন্ন চেম্বারের মাঝে যেমন জলরোধী দেওয়াল (Bulkhead) থাকে যাতে একটি চেম্বার ফুটো হলেও পুরো জাহাজ না ডোবে—ঠিক তেমনি সফটওয়্যারেও রিসোর্স আইসোলেশন করা হয়।</p>
<p><strong>বাস্তবায়ন:</strong> পেমেন্ট গেটওয়ে, ইনভেন্টরি সার্ভিস এবং সাধারণ ক্যাটালগ সার্ভিসের জন্য <strong>পৃথক ডেডিকেটেড থ্রেডপুল বা SemaphoreSlim</strong> বরাদ্দ করা হয়। যদি পেমেন্ট গেটওয়ে হঠাৎ স্লো হয়ে পড়ে, তবে শুধুমাত্র তার জন্য নির্ধারিত ২০টি থ্রেডই ব্লক হবে। ক্যাটালগ বা সার্চ সার্ভিসের বরাদ্দকৃত বাকি ৮০টি থ্রেড সম্পূর্ণ মুক্ত থাকবে এবং ইউজাররা স্বাভাবিকভাবে সাইট ব্রাউজ করতে পারবে।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Reactive Backpressure',
    q: '১১৯. Reactive Backpressure: প্রোডিউসারের গতি কনজিউমারের চেয়ে ১০ গুণ বেশি হলে কীভাবে বাফার ব্লো-আপ ঠেকাবেন?',
    a: `<p>যদি একটি সেন্সর বা মেসেজ স্ট্রিম প্রতি সেকেন্ডে ১০,০০০ মেসেজ পাঠায় অথচ ডাটাবেজ সেভার মাত্র ১,০০০ মেসেজ প্রসেস করতে পারে, রিসিভারের মেমোরি ফুল হয়ে অ্যাপ ক্র্যাশ করবে।</p>
<p><strong>Backpressure Strategies:</strong></p>
<ul>
    <li><strong>Request-driven (Pull-based):</strong> কনজিউমার প্রোডিউসারকে বলে: "আমি এখন প্রস্তুত, আমাকে পরবর্তী ১০০টি আইটেম দাও।"</li>
    <li><strong>Drop Strategy:</strong> বাফার পূর্ণ হলে ইনকামিং অপ্রয়োজনীয় মেসেজ ড্রপ করা (যেমন ভিডিও স্ট্রিমিংয়ে ফ্রেম ড্রপ)।</li>
    <li><strong>Buffer with Sliding Window:</strong> নতুন মেসেজ অগ্রাধিকার দিয়ে পুরানো মেসেজ মুছে ফেলা (Latest Wins)।</li>
</ul>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Modern API Gateway',
    q: '১২০. API Gateway এবং BFF (Backend-for-Frontend) প্যাটার্ন: Microsoft YARP দিয়ে কীভাবে উচ্চগতির গেটওয়ে তৈরি করবেন?',
    a: `<p><strong>BFF Pattern:</strong> মোবাইল অ্যাপ, ওয়েব ব্রাউজার এবং থার্ড-পার্টি পার্টনারদের রিকোয়ারমেন্ট ভিন্ন ভিন্ন হয়। একটি একক জেনেরিক এপিআই না বানিয়ে প্রতি ক্লায়েন্ট চ্যানেলের জন্য ডেডিকেটেড লাইটওয়েট ব্যাকএন্ড গেটওয়ে (BFF) তৈরি করা হয়।</p>
<p><strong>Microsoft YARP (Yet Another Reverse Proxy):</strong> সম্পূর্ণ .NET 8/9 এ তৈরি অত্যন্ত দ্রুতগতির রিভার্স প্রক্সি টুলকিট। কন্ট্রোলারের বয়লারপ্লেট ছাড়াই কনফিগারেশনে সরাসরি রাউটিং, রাউন্ড-রবিন ক্লাস্টারিং, পাথ ট্রান্সফর্ম, এবং রেট-লিমিটিং পরিচালনা করে। এটি মাইক্রোসফটের অভ্যন্তরীণ বিং ও অ্যাজুরের কোটি কোটি রিকোয়েস্ট সফলভাবে সার্ভ করে।</p>`
  }
];
