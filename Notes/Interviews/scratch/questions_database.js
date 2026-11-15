// Questions 36 to 70: SQL Server, PostgreSQL, Oracle, Redis, Index Internals, Concurrency
module.exports = [
  // Junior
  {
    topic: 'database',
    level: 'junior',
    badge: 'SQL Indexing',
    q: '৩৬. Clustered Index এবং Non-Clustered Index এর মূল পার্থক্য কী?',
    a: `<p><strong>Clustered Index:</strong> টেবিলে ডেটার ফিজিক্যাল বিন্যাস সরাসরি নির্ধারণ করে। এর B-Tree স্ট্রাকচারের লিফ নোডে সম্পূর্ণ টেবিল ডেটা বা রো সংরক্ষিত থাকে। তাই একটি টেবিলে <strong>শুধুমাত্র একটিই</strong> Clustered Index থাকতে পারে (যেমন একটি ডিকশনারি বা টেলিফোন ডিরেক্টরি)। সাধারণত Primary Key-র উপর এটি স্বয়ংক্রিয়ভাবে তৈরি হয়।</p>
<p><strong>Non-Clustered Index:</strong> মূল ডাটা টেবিল থেকে আলাদা একটি B-Tree স্ট্রাকচারে সংরক্ষিত থাকে। এর লিফ নোডে শুধুমাত্র ইনডেক্স করা কলামের ভ্যালু এবং মূল ডাটা রোর একটি পয়েন্টার (Row Locator / Clustered Key) থাকে। একটি টেবিলে একাধিক নন-ক্লাস্টার্ড ইনডেক্স থাকতে পারে (যেমন বইয়ের পেছনের ইনডেক্স সূচি)।</p>`
  },
  {
    topic: 'database',
    level: 'junior',
    badge: 'SQL Constraints',
    q: '৩৭. Primary Key এবং Unique Key এর মধ্যে পার্থক্য কী? Foreign Key কীভাবে ডাটা ইন্টিগ্রিটি নিশ্চিত করে?',
    a: `<p><strong>Primary Key:</strong> টেবিলের প্রতি রো-কে ইউনিকলি সনাক্ত করে। কখনোই <code>NULL</code> ভ্যালু অনুমোদন করে না। একটি টেবিলে শুধুমাত্র একটি প্রাইমারি কি থাকতে পারে এবং বাই-ডিফল্ট এটি Clustered Index তৈরি করে।</p>
<p><strong>Unique Key:</strong> কলামের ভ্যালুর ইউনিকনেস নিশ্চিত করে কিন্তু <code>NULL</code> অনুমোদন করে। একটি টেবিলে একাধিক Unique Key থাকতে পারে এবং বাই-ডিফল্ট এটি Non-Clustered Index তৈরি করে।</p>
<p><strong>Foreign Key:</strong> প্যারেন্ট ও চাইল্ড টেবিলের মধ্যে রিলেশনশিপ তৈরি করে। চাইল্ড টেবিলে এমন কোনো ভ্যালু ইনসার্ট হতে দেয় না যা প্যারেন্ট টেবিলে নেই। এটি রেফারেন্সিয়াল ইন্টিগ্রিটি বজায় রাখে।</p>`
  },
  {
    topic: 'database',
    level: 'junior',
    badge: 'SQL Joins',
    q: '৩৮. বিভিন্ন ধরণের SQL Joins (INNER, LEFT, RIGHT, FULL, CROSS) এর কার্যপ্রণালী ব্যাখ্যা করুন।',
    a: `<p>SQL Joins দুটি টেবিলের সাধারণ কলামের ভিত্তিতে ডাটা একত্রিত করে:</p>
<ul>
    <li><strong>INNER JOIN:</strong> উভয় টেবিলে ম্যাচিং হওয়া রেকর্ডগুলো শুধুমাত্র রিটার্ন করে।</li>
    <li><strong>LEFT JOIN:</strong> বাম টেবিলের সব রেকর্ড এবং ডান টেবিলের ম্যাচিং রেকর্ড আনে। ডানে ম্যাচ না থাকলে সেখানে <code>NULL</code> বসে।</li>
    <li><strong>RIGHT JOIN:</strong> ডান টেবিলের সব রেকর্ড এবং বামের ম্যাচিং রেকর্ড আনে।</li>
    <li><strong>FULL OUTER JOIN:</strong> যেকোনো এক টেবিলে মিল থাকলেই সব ডাটা নিয়ে আসে। অমিলের ক্ষেত্রে অপর পাশে <code>NULL</code> দেখায়।</li>
    <li><strong>CROSS JOIN:</strong> কার্টেসিয়ান গুণফল (Cartesian Product)। বাম টেবিলের প্রতিটি রো-র সাথে ডান টেবিলের প্রতিটি রো-কে জোড়া দেয় (M &times; N রো)।</li>
</ul>`
  },
  {
    topic: 'database',
    level: 'junior',
    badge: 'Database Core',
    q: '৩৯. ACID প্রোপার্টিজ কী? একটি ব্যাংক ফান্ড ট্রান্সফারের উদাহরণ দিয়ে বুঝিয়ে বলুন।',
    a: `<p>ACID হলো ডাটাবেজ ট্রানজ্যাকশনের ৪টি ভিত্তিস্তম্ভ:</p>
<ul>
    <li><strong>Atomicity:</strong> অল অর নাথিং। রহিমের একাউন্ট থেকে ১০০০ টাকা কাটা এবং করিমের একাউন্টে জমা হওয়া—উভয়টি সম্পন্ন হতে হবে। মাঝে সার্ভার ক্র্যাশ করলে পুরো অপারেশন রোলব্যাক হবে।</li>
    <li><strong>Consistency:</strong> ট্রানজ্যাকশন শেষে সব ভ্যালিডেশন রুলস ও কনস্ট্রেইন্ট অক্ষত থাকবে। ব্যাংক ব্যালেন্স কখনো নেগেটিভ হতে পারবে না।</li>
    <li><strong>Isolation:</strong> সমান্তরাল ট্রানজ্যাকশন চললেও একটি অন্যটির অর্ধসমাপ্ত ডাটা রিড করতে পারে না।</li>
    <li><strong>Durability:</strong> একবার ট্রানজ্যাকশন <code>COMMIT</code> হয়ে গেলে বিদ্যুৎ চলে গেলেও ডাটা কখনো হারাবে না (Write-Ahead Logging এর মাধ্যমে)।</li>
</ul>`
  },
  {
    topic: 'database',
    level: 'junior',
    badge: 'SQL DDL vs DML',
    q: '৪০. DELETE, TRUNCATE এবং DROP এর মধ্যে প্রযুক্তিগত পার্থক্য কী?',
    a: `<p><strong>DELETE (DML):</strong> <code>WHERE</code> ক্লজ দিয়ে নির্দিষ্ট রো মোছা যায়। রো-বাই-রো ট্রানজ্যাকশন লগে লেখে, তাই ধীরগতির। Identity মান রিসেট হয় না। ট্রিগার ফায়ার করে।</p>
<p><strong>TRUNCATE (DDL):</strong> সমস্ত ডাটা পেজ তাৎক্ষণিকভাবে ডিঅ্যালোকেট করে। কোনো <code>WHERE</code> ক্লজ নেয় না। লগে কেবল পেজ ডিঅ্যালোকেশন লেখে, ফলে চোখের পলকে কোটি রো মুছে যায়। Identity রিসেট হয়। ট্রিগার ফায়ার করে না।</p>
<p><strong>DROP (DDL):</strong> ডাটা সহ সম্পূর্ণ টেবিলের স্কিমা, স্ট্রাকচার ও ইনডেক্স ডাটাবেজ থেকে চিরতরে মুছে ফেলে।</p>`
  },

  // Mid-Level
  {
    topic: 'database',
    level: 'mid',
    badge: 'Query Optimization',
    q: '৪১. Covering Index কী এবং INCLUDE ক্লজ কীভাবে Key Lookup দূর করে?',
    a: `<p>যখন কোনো কুয়েরির <code>SELECT</code> এর কিছু কলাম নন-ক্লাস্টার্ড ইনডেক্সে থাকে না, ইঞ্জিন ইনডেক্স খোঁজার পর বাকি কলাম আনতে মূল টেবিলে জাম্প করে—যাকে বলে <strong>Key Lookup (Bookmark Lookup)</strong>। উচ্চ ট্রাফিকে এটি সার্ভারের আই/ও ধ্বংস করে।</p>
<p><strong>Covering Index:</strong> <code>WHERE</code> ক্লজের কলামকে ইনডেক্স কী-তে রেখে <code>SELECT</code> এর কলামগুলোকে <code>INCLUDE</code> ক্লজে দিলে সম্পূর্ণ কুয়েরি ইনডেক্স পেজ থেকেই সার্ভ হয়ে যায় এবং Key Lookup সম্পূর্ণরূপে ০ হয়ে যায়:</p>
<pre><code>CREATE NONCLUSTERED INDEX IX_Orders_Cust 
ON Orders(CustomerId) 
INCLUDE (OrderDate, TotalAmount);</code></pre>`
  },
  {
    topic: 'database',
    level: 'mid',
    badge: 'Execution Plan',
    q: '৪২. SQL Server Execution Plan এ Index Seek বনাম Index Scan এবং Hash Match এর তাৎপর্য কী?',
    a: `<p><strong>Index Seek:</strong> B-Tree ইনডেক্সের রুট থেকে সরাসরি নির্দিষ্ট লিফ নোডে ঝাঁপ দেয়। এটি সবচেয়ে দ্রুত ও অপ্টিমাইজড (O(log N))।</p>
<p><strong>Index Scan:</strong> সম্পূর্ণ ইনডেক্সের সমস্ত পেজ রিড করে। ইনডেক্সড কলামের উপর ফাংশন ব্যবহার করলে বা ফিল্টারিং মিস হলে এটি ঘটে।</p>
<p><strong>Hash Match:</strong> দুটি বড় টেবিল জয়েন করতে ইঞ্জিন মেমোরিতে একটি ইন-মেমোরি হ্যাশ টেবিল তৈরি করে। এটি প্রচুর RAM এবং CPU খরচ করে। সঠিক ইনডেক্সিং থাকলে এটি দ্রুততর <strong>Merge Join</strong> বা <strong>Nested Loops</strong>-এ রূপান্তরিত হয়।</p>`
  },
  {
    topic: 'database',
    level: 'mid',
    badge: 'Database Modeling',
    q: '৪৩. ডাটাবেজ নরমালাইজেশন (1NF থেকে BCNF) বনাম ডিনরমালাইজেশন কখন প্রযোজ্য?',
    a: `<p><strong>নরমালাইজেশন (OLTP):</strong> ডুপ্লিকেশন কমানো এবং Insert, Update, Delete এনোমালি রোধ করার প্রক্রিয়া। 1NF (অ্যাটমিক ভ্যালু), 2NF (পার্শিয়াল ডিপেনডেন্সি মুক্ত), 3NF (ট্রানজিটিভ ডিপেনডেন্সি মুক্ত)।</p>
<p><strong>ডিনরমালাইজেশন (OLAP / High-Scale Read):</strong> যখন উচ্চ ট্রাফিকের কারণে জটিল ৭-৮টি টেবিল JOIN করা পারফরম্যান্সের জন্য ক্ষতিকর হয়ে দাঁড়ায়, তখন সচেতনভাবে কিছু রিডানড্যান্ট কলাম রেখে কুয়েরি দ্রুত করা হয়।</p>`
  },
  {
    topic: 'database',
    level: 'mid',
    badge: 'Concurrency Control',
    q: '৪৪. Transaction Isolation Levels: Dirty Read, Non-repeatable Read এবং Phantom Read কী?',
    a: `<table class="table table-bordered table-sm">
    <thead><tr><th>Isolation Level</th><th>Dirty Read</th><th>Non-repeatable Read</th><th>Phantom Read</th></tr></thead>
    <tbody>
        <tr><td><strong>Read Uncommitted</strong></td><td>❌ ঘটে</td><td>❌ ঘটে</td><td>❌ ঘটে</td></tr>
        <tr><td><strong>Read Committed</strong> (ডিফল্ট)</td><td>✅ নিরাপদ</td><td>❌ ঘটে</td><td>❌ ঘটে</td></tr>
        <tr><td><strong>Repeatable Read</strong></td><td>✅ নিরাপদ</td><td>✅ নিরাপদ</td><td>❌ ঘটে</td></tr>
        <tr><td><strong>Serializable</strong></td><td>✅ নিরাপদ</td><td>✅ নিরাপদ</td><td>✅ নিরাপদ</td></tr>
    </tbody>
</table>
<p><em>Dirty Read:</em> আনকমিটেড ডাটা পড়া। <em>Non-repeatable Read:</em> একই ট্রানজ্যাকশনে আপডেটের কারণে মান বদলানো। <em>Phantom Read:</em> নতুন রো ইনসার্টের কারণে রো সংখ্যা বৃদ্ধি পাওয়া।</p>`
  },
  {
    topic: 'database',
    level: 'mid',
    badge: 'Concurrency & Deadlocks',
    q: '৪৫. SQL Server এ Deadlock কেন ঘটে? Deadlock Graph বিশ্লেষণ এবং প্রতিরোধের উপায় কী?',
    a: `<p><strong>Deadlock:</strong> ঘটে যখন দুটি ট্রানজ্যাকশন একে অপরের দখল করা রিসোর্সের উপর এক্সক্লুসিভ লক দাবি করে একটি সাইক্লিক ডিপেনডেন্সিতে আটকে যায়। ইঞ্জিন একজনকে <strong>Deadlock Victim</strong> হিসেবে বেছে নিয়ে ১২০৫ এরর থ্রো করে।</p>
<p><strong>প্রতিরোধ:</strong> ১. সমস্ত অ্যাপ্লিকেশনে টেবিল অ্যাক্সেসের ধারাবাহিকতা একই রাখা (Consistent Ordering)। ২. চাইল্ড টেবিলের Foreign Key কলামে ইনডেক্স নিশ্চিত করা। ৩. শর্ট ট্রানজ্যাকশন রাখা। ৪. RCSI সক্রিয় করা।</p>`
  },

  // Senior / Architect
  {
    topic: 'database',
    level: 'senior',
    badge: 'PostgreSQL Internals',
    q: '৪৬. PostgreSQL এ Table Bloat কেন ঘটে এবং Autovacuum কীভাবে টিউন করবেন?',
    a: `<p>Postgres এর MVCC ডিজাইনে কোনো রো আপডেট হলে ইঞ্জিন পুরনো রো এডিট করে না, বরং পুরনোটিকে <strong>Dead Tuple</strong> বানিয়ে নতুন রো ইনসার্ট করে। ঘনঘন আপডেটে কোটি কোটি ডেড টাপল ডিস্ক দখল করায় <strong>Table Bloat</strong> ঘটে এবং কুয়েরি স্লো হয়ে যায়।</p>
<p><code>VACUUM</code> ডেড টাপল মুছে ডিস্ক স্পেস নতুন রো লেখার উপযোগী করে। হাই-রাইট টেবিলের জন্য <code>autovacuum_vacuum_scale_factor = 0.05</code> (৫% ডেড টাপলেই ভ্যাকুয়াম চলবে) এবং HOT (Heap-Only Tuple) নিশ্চিত করতে <code>fillfactor = 85</code> কনফিগার করা সিনিয়র বেস্ট প্র্যাকটিস।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Oracle Architecture',
    q: '৪৭. Oracle PL/SQL এ BULK COLLECT ও FORALL কেন লাখ লাখ রো প্রসেসিংয়ে গেম চেঞ্জার?',
    a: `<p>সাধারণ PL/SQL লুপে প্রতি রো প্রসেসিংয়ের সময় PL/SQL ইঞ্জিন ও SQL ইঞ্জিনের মধ্যে <strong>Context Switching</strong> ঘটে। ১০ লাখ রো-এর জন্য ১০ লাখ বার কনটেক্সট সুইচ হলে ঘণ্টার পর ঘণ্টা সময় অপচয় হয়।</p>
<p><code>BULK COLLECT ... LIMIT 1000</code> দিয়ে এক সিঙ্গেল রাউন্ডট্রিপে ১,০০০ রো মেমোরি অ্যারেতে আনা হয় এবং <code>FORALL ... SAVE EXCEPTIONS</code> দিয়ে এক ব্যাচে ডাটাবেজ ইঞ্জিনে পুশ করা হয়। এতে Context Switching সম্পূর্ণরূপে শূন্য হয়ে কোটি কোটি রো চোখের পলকে প্রসেস হয়।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'SQL Server Deep Dive',
    q: '৪৮. Parameter Sniffing কী? প্রোডাকশনে কুয়েরি হঠাৎ স্লো হলে কীভাবে ফিক্স করবেন?',
    a: `<p><strong>Parameter Sniffing:</strong> যখন কোনো Stored Procedure প্রথমবার রান হয়, SQL Server সেই নির্দিষ্ট প্যারামিটার ভ্যালুর জন্য সবচেয়ে অনুকূল একটি Execution Plan জেনারেট করে ক্যাশে রেখে দেয়। যদি প্রথম প্যারামিটারটি ছিল একটি ব্যতিক্রমী মান (Outlier, যা ১টি রো আনে), পরবর্তী সময়ে সাধারণ প্যারামিটার (যা লক্ষ রো আনবে) রান করলে ইঞ্জিন ওই পুরানো Index Seek প্ল্যান ব্যবহার করে হাজার হাজার Key Lookup করতে গিয়ে সিপিইউ ১০০% এ আটকে ফেলে।</p>
<p><strong>ফিক্স:</strong> ১. লোকাল ভ্যারিয়েবল ট্রিক: <code>DECLARE @LocalId INT = @ParamId; SELECT ... WHERE Id = @LocalId;</code> ২. <code>OPTION (OPTIMIZE FOR (@ParamId = 100))</code> ৩. <code>OPTION (RECOMPILE)</code>।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'SQL Server Concurrency',
    q: '৪৯. Read Committed Snapshot Isolation (RCSI) কী এবং কেন এটি লক কনটেনশন বন্ধ করে?',
    a: `<p>ডিফল্ট SQL Server-এ রিড অপারেশনের সময় Shared Lock (S-Lock) লাগে। যদি কোনো ট্রানজ্যাকশন ডাটা আপডেট করতে থাকে (Exclusive X-Lock), রিডাররা ব্লক হয়ে বসে থাকে।</p>
<p><code>ALTER DATABASE MyDb SET READ_COMMITTED_SNAPSHOT ON;</code> দিলে রিডাররা কোনো লক নেয় না। আপডেট চলাকালীন ইঞ্জিন পূর্বের কমিটেড ডাটার স্ন্যাপশট <strong>TempDB Version Store</strong>-এ রাখে। রিডাররা সরাসরি TempDB থেকে পূর্বের ভার্সন পড়ে চলে যায়। ফলে কোনো লকিং কনটেনশন থাকে না এবং কনকারেন্সি বহুগুণ বৃদ্ধি পায়।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Oracle Triggers',
    q: '৫০. Oracle এ Mutating Table Error (ORA-04091) কেন ঘটে এবং Compound Trigger দিয়ে কীভাবে সমাধান করবেন?',
    a: `<p><strong>ORA-04091:</strong> যখন একটি <code>AFTER INSERT OR UPDATE FOR EACH ROW</code> ট্রিগারের ভেতর থেকে সেই একই টেবিলের উপর <code>SELECT</code> কুয়েরি চালানো হয় যা বর্তমানে ট্রানজ্যাকশনের অধীনে মডিফাই হচ্ছে। ডাটাবেজ তখন টেবিলটিকে Mutating ঘোষণা করে এরর দেয়।</p>
<p><strong>Compound Trigger এর সমাধান:</strong> এটি ৪টি ফেজে কাজ করে: ১. <code>BEFORE STATEMENT</code> (অ্যারে ইনিশিয়ালাইজ), ২. <code>AFTER EACH ROW</code> (কোনো কুয়েরি না চালিয়ে শুধুমাত্র আইডিগুলো অ্যারেতে পুশ), ৩. <code>AFTER STATEMENT</code> (টেবিলের লক মুক্ত হওয়ার পর অ্যারেতে থাকা আইডিগুলোর উপর একবার বাল্ক কুয়েরি চালিয়ে রুলস প্রয়োগ)।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Redis Distributed Caching',
    q: '৫১. Redis Caching: Cache Stampede (Dogpiling) কী? XFetch ও RedLock কীভাবে কাজ করে?',
    a: `<p><strong>Cache Stampede:</strong> যখন হট কি-র ক্যাশ এক্সপায়ার হয়, হাজার হাজার কনকারেন্ট রিকোয়েস্ট ক্যাশে ডাটা না পেয়ে একসাথে ডাটাবেজে আঘাত হানে এবং ডাটাবেজ ক্র্যাশ করে।</p>
<p><strong>সমাধান:</strong> ১. <strong>XFetch Algorithm (Probabilistic Early Expiration):</strong> ক্যাশ এক্সপায়ার হওয়ার সামান্য আগে গাণিতিক সম্ভাবনার ভিত্তিতে একটি মাত্র ব্যাকগ্রাউন্ড থ্রেড ডাটাবেজ থেকে ক্যাশ রিফ্রেশ করে নেয়। ২. <strong>Distributed Mutex (RedLock):</strong> প্রথম রিকোয়েস্টটি লক নিয়ে ডাটাবেজ পড়বে, বাকি রিকোয়েস্টগুলো অপেক্ষা করে নতুন ক্যাশ থেকে ডাটা পাবে।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'SQL Storage Internals',
    q: '৫২. SQL Server Data Page Lifecycle: 8KB Page, Extent (Uniform vs Mixed), Page Split এবং PFS/GAM/SGAM পেজ কী?',
    a: `<p>SQL Server মেমোরি ও ডিস্কে ডেটা সংরক্ষণ করে <strong>8KB (৮,১৯২ বাইট) Data Page</strong> আকারে। ৮টি কন্টিনিউয়াস পেজ নিয়ে গঠিত হয় একটি <strong>64KB Extent</strong>।</p>
<ul>
    <li><strong>Uniform Extent:</strong> সমস্ত ৮টি পেজ একটি একক টেবিল বা অবজেক্টের মালিকানাধীন।</li>
    <li><strong>Mixed Extent:</strong> ৮টি পেজ বিভিন্ন টেবিল শেয়ার করে (ছোট টেবিলের অপচয় রোধে)।</li>
    <li><strong>Bad Page Split:</strong> যখন একটি ইন্ডেক্স পেজ ৯৯% পূর্ণ থাকে এবং তার মাঝে একটি নতুন রো ইনসার্ট করতে হয়, ইঞ্জিন তাৎক্ষণিকভাবে একটি নতুন পেজ অ্যালোকেট করে অর্ধেক রো সেখানে সরিয়ে নেয় (৫০-৫০ স্প্লিট)। এটি ভারী ডিস্ক আই/ও এবং সূচক ফ্র্যাগমেন্টেশন (Fragmentation) তৈরি করে।</li>
    <li><strong>অ্যালোকেশন ট্র্যাকিং পেজ:</strong> <code>GAM</code> (Global Allocation Map) ফ্রি এক্সটেন্ট ট্র্যাক করে, <code>SGAM</code> শেয়ার্ড এক্সটেন্ট ট্র্যাক করে, এবং <code>PFS</code> (Page Free Space) প্রতিটি পেজের ভেতর কত পারসেন্ট ফ্রি স্পেস আছে তা বাইট আকারে ট্র্যাক করে।</li>
</ul>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Query Optimizer Internals',
    q: '৫৩. Cardinality Estimation এবং SQL Statistics: Histogram, Density Vector এবং CE2014+ এর পরিবর্তন কী?',
    a: `<p>কুয়েরি অপ্টিমাইজার কোনো এক্সিকিউশন প্ল্যান তৈরির আগে দেখে টেবিলের ফিল্টারে কতগুলো রো ম্যাচ করতে পারে—যাকে বলে <strong>Cardinality Estimation (CE)</strong>। এর ভিত্তি হলো <strong>Statistics</strong>।</p>
<ul>
    <li><strong>Histogram:</strong> সর্বোচ্চ ২০০টি স্টেপ (Buckets) এ ডাটার বন্টন, রেঞ্জ এবং ফ্রিকোয়েন্সি রেকর্ড করে।</li>
    <li><strong>Density Vector:</strong> একাধিক কলামের ইউনিকনেসের পরিমাপ (1 / Distinct Values)। ইনডেক্স কলামের সমন্বয়ে কত পারসেন্ট ডুপ্লিকেশন আছে তা বোঝায়।</li>
    <li><strong>CE2014+ পরিবর্তন:</strong> SQL Server 2014-এর নতুন CE ইঞ্জিন স্বাধীন কলাম অনুমানের বদলে <strong>Exponential Backoff Model</strong> (কলাম ১ ১০০%, কলাম ২ ৩০%, কলাম ৩ ৯%) ব্যবহার করে। জটিল মাল্টি-কলাম প্রেডিকেটে যদি পুরানো CE ভালো কাজ করে, তবে <code>USE HINT ('FORCE_LEGACY_CARDINALITY_ESTIMATION')</code> দিয়ে পুরানো মডেলে ফোর্স করা যায়।</li>
</ul>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Advanced Locking',
    q: '৫৪. Lock Escalation কী? Row-level Lock কখন Table Lock এ রূপান্তর হয় এবং কীভাবে ঠেকাবেন?',
    a: `<p>প্রতিটি লকের জন্য মেমোরিতে প্রায় ৯৬ বাইট খরচ হয়। মেমোরি বাঁচাতে যখন একটি একক ট্রানজ্যাকশন একটি একক টেবিলে <strong>৫,০০০ এর বেশি রো বা পেজ লক</strong> অর্জন করে, SQL Server স্বয়ংক্রিয়ভাবে সমস্ত রো লককে একটি একক <strong>Exclusive Table Lock (X-Table Lock)</strong> এ রূপান্তর করে দেয়—যাকে বলে <strong>Lock Escalation</strong>।</p>
<p><strong>ভয়ংকর পরিণতি:</strong> টেবিল লক হয়ে যাওয়ায় অন্য সমস্ত ব্যবহারকারীর রিড/রাইট সম্পূর্ণ ব্লক হয়ে যায়।</p>
<p><strong>প্রতিরোধ:</strong></p>
<ol>
    <li>লাখ লাখ রো একবারে আপডেট না করে <strong>ব্যাচ আকারে (Chunks of 2,000 rows)</strong> আপডেট করুন।</li>
    <li>টেবিলে পার্টিশনিং থাকলে পার্টিশন-লেভেল লকিং অন করুন: <code>ALTER TABLE Orders SET (LOCK_ESCALATION = AUTO);</code> (শুধুমাত্র অ্যাফেক্টেড পার্টিশন লক হবে, পুরো টেবিল নয়)।</li>
</ol>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Partitioning & Archiving',
    q: '৫৫. Table Partitioning এ Sliding Window Pattern এবং SWITCH PARTITION কীভাবে বিলিয়ন রো জিরো-লগে আর্কাইভ করে?',
    a: `<p><strong>Sliding Window Pattern:</strong> টাইম-সিরিজ ডেটাবেজে (যেমন ১০ কোটি অডিট লগ) প্রতি মাসের জন্য আলাদা পার্টিশন তৈরি করা হয় (Partition Function & Scheme)।</p>
<p><strong>SWITCH PARTITION এর ম্যাজিক:</strong></p>
<pre><code>ALTER TABLE ActiveAuditLogs SWITCH PARTITION 1 TO ArchivedAuditLogs;</code></pre>
<p>এটি কোনো ডাটা ফিজিক্যালি মুভ বা কপি করে না, কোনো ট্রানজ্যাকশন লগ জেনারেট করে না। এটি কার্নেল মেটাডাটা পয়েন্টার পরিবর্তন করে এক নিমিষে (১ মিলি-সেকেন্ডে) কোটি কোটি রো একটি টেবিল থেকে অন্য টেবিলে স্থানান্তর করে দেয়। ফলে প্রোডাকশনে ডেটা আর্কাভিঙে কোনো সার্ভার ল্যাগ বা লক হয় না।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'In-Memory Database',
    q: '৫৬. In-Memory OLTP (Hekaton): Memory-Optimized Tables এবং Natively Compiled Stored Procedures কেন ২০ গুণ দ্রুত?',
    a: `<p>SQL Server In-Memory OLTP সম্পূর্ণ মেমোরিতে অপ্টিমাইজড <strong>Bw-Tree</strong> এবং হ্যাশ ইনডেক্স ব্যবহার করে।</p>
<ul>
    <li><strong>Latch-Free & Lock-Free:</strong> সাধারণ ডাটাবেজের মতো কোনো লকিং মেকানিজম নেই। এটি মাল্টি-ভার্সন অপটিমিস্টিক কনকারেন্সিতে কাজ করে, ফলে কোনো থ্রেড কাউকে ব্লক করে না।</li>
    <li><strong>Natively Compiled Stored Procedures:</strong> T-SQL কোডকে ইন্টারপ্রেট না করে সরাসরি সি (C) ল্যাঙ্গুয়েজের মেশিন কোড DLL-এ কম্পাইল করে রানটামে এক্সিকিউট করে। ফলে ইন্টারপ্রিটেশন ওভারহেড শূন্য হয়ে যায় এবং সাধারণ কুয়েরির চেয়ে ২০ থেকে ৩০ গুণ বেশি থ্রুপুট দেয়।</li>
</ul>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Temporal Data & Audit',
    q: '৫৭. Temporal Tables (System-Versioned Tables) কীভাবে স্বয়ংক্রিয় অডিট এবং Point-in-Time ট্রাভেল সমর্থন করে?',
    a: `<p>SQL Server 2016+ এ <code>SYSTEM_VERSIONING = ON</code> দিয়ে Temporal Table ডিক্লেয়ার করা যায়:</p>
<pre><code>CREATE TABLE Employee (
    EmpId INT PRIMARY KEY, Name VARCHAR(100),
    SysStartTime DATETIME2 GENERATED ALWAYS AS ROW START,
    SysEndTime DATETIME2 GENERATED ALWAYS AS ROW END,
    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime)
) WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.EmployeeHistory));</code></pre>
<p>কোনো রো আপডেট বা ডিলিট হলে ইঞ্জিন নিজে থেকেই পুরানো স্ন্যাপশটটি হিস্ট্রি টেবিলে টাইমস্ট্যাম্প সহ আর্কাইভ করে। অ্যাপ্লিকেশন কোনো অডিট ট্রিগার বা কোড ছাড়াই সরাসরি <strong>Time Travel Query</strong> করতে পারে:</p>
<pre><code>SELECT * FROM Employee FOR SYSTEM_TIME AS OF '2024-01-01 12:00:00';</code></pre>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'PostgreSQL Deep Engine',
    q: '৫৮. PostgreSQL Internals: FSM (Free Space Map), VM (Visibility Map), HOT Updates এবং WAL Write Amplification?',
    a: `<p><strong>Free Space Map (FSM):</strong> প্রতিটি টেবিল ফাইলের সাথে একটি <code>_fsm</code> ফাইল থাকে যা বাইনারি ট্রিতে ট্র্যাক করে কোন পেজে নতুন রো ইনসার্ট করার মতো পর্যাপ্ত ফ্রি স্পেস আছে।</p>
<p><strong>Visibility Map (VM):</strong> ট্র্যাক করে কোন পেজের সমস্ত টাপল সমস্ত অ্যাক্টিভ ট্রানজ্যাকশনের কাছে দৃশ্যমান। এটি থাকলে ইঞ্জিন সরাসরি <strong>Index-Only Scan</strong> করতে পারে—হিপ পেজ রিড করার প্রয়োজনই হয় না।</p>
<p><strong>HOT (Heap-Only Tuple) Update:</strong> যদি আপডেটে কোনো ইনডেক্সড কলাম পরিবর্তন না হয় এবং একই পেজে পর্যাপ্ত জায়গা থাকে, Postgres কোনো নতুন ইনডেক্স এন্ট্রি তৈরি না করেই পেজের ভেতর পয়েন্টার চেইন করে। এটি ৯৯% ডিস্ক আই/ও বাঁচিয়ে দেয়।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Advanced Index Types',
    q: '৫৯. PostgreSQL Index Types: B-tree বনাম GIN বনাম GiST বনাম BRIN কখন কোনটি বেছে নেবেন?',
    a: `<table class="table table-bordered table-sm">
    <thead><tr><th>ইনডেক্স টাইপ</th><th>আন্ডারলাইং স্ট্রাকচার</th><th>আদর্শ ব্যবহার ক্ষেত্র</th></tr></thead>
    <tbody>
        <tr><td><strong>B-tree</strong></td><td>ব্যালেন্সড ট্রি</td><td>সাধারণ ইউনিক মান, সমতা (<code>=</code>) এবং রেঞ্জ (<code>&lt;, &gt;</code>) কুয়েরি।</td></tr>
        <tr><td><strong>GIN (Generalized Inverted Index)</strong></td><td>ইনভার্টেড ইনডেক্স</td><td>JSONB ডকুমেন্টস, টেক্সট সার্চ (Full-text Search), এবং Array এলিমেন্ট অনুসন্ধান।</td></tr>
        <tr><td><strong>GiST</strong></td><td>জেনারেলাইজড সার্চ ট্রি</td><td>ভৌগোলিক ডেটা (GIS/PostGIS), জ্যামিতিক শেপ, আইপি রেঞ্জ ওভারল্যাপ।</td></tr>
        <tr><td><strong>BRIN (Block Range Index)</strong></td><td>ব্লক রেঞ্জ মেটাডাটা</td><td>বিলিয়ন রো-র বিশাল টাইম-সিরিজ টেবিল যেখানে ডেটা শারীরিকভাবে সর্টেড থাকে। ইনডেক্স সাইজ B-Tree এর তুলনায় ১% মাত্র!</td></tr>
    </tbody>
</table>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Connection Pooling PgBouncer',
    q: '৬০. PgBouncer Connection Pooling: Session বনাম Transaction বনাম Statement মোড এবং Prepared Statements সমস্যা?',
    a: `<p>Postgres প্রতি ক্লায়েন্ট কানেকশনে একটি সম্পূর্ণ ওএস প্রসেস (Fork) তৈরি করে যাতে ১০ MB মেমোরি খরচ হয়। তাই সামনে <strong>PgBouncer</strong> ব্যবহার করা বাধ্যতামূলক।</p>
<ul>
    <li><strong>Session Pooling:</strong> ক্লায়েন্ট ডিসকানেক্ট না হওয়া পর্যন্ত পুরো ডাটাবেজ কানেকশন ধরে রাখে (কম স্কেলেবল)।</li>
    <li><strong>Transaction Pooling (সর্বোচ্চ স্কেলেবল):</strong> শুধুমাত্র ট্রানজ্যাকশন চলার সময় পুল থেকে কানেকশন ধার নেয় এবং <code>COMMIT</code> হওয়া মাত্র কানেকশন অন্য রিকোয়েস্টকে দিয়ে দেয়।</li>
    <li><strong>Prepared Statement সমস্যা ও সমাধান:</strong> Transaction মোডে পরবর্তী কুয়েরি ভিন্ন ব্যাকএন্ড প্রসেসে যেতে পারে, তাই সার্ভার-সাইড প্রিপেয়ার্ড স্টেটমেন্ট ফেইল করে। .NET Npgsql ড্রাইভারের জন্য কানেকশন স্ট্রিংয়ে <code>Max Auto Prepare=0</code> অথবা PgBouncer 1.21+ এর প্রিপেয়ার্ড স্টেটমেন্ট সাপোর্ট কনফিগার করতে হয়।</li>
</ul>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Oracle Optimizer & Plans',
    q: '৬১. Oracle Cost-Based Optimizer (CBO): Adaptive Cursor Sharing এবং SQL Plan Baselines কীভাবে কুয়েরি স্ট্যাবিলিটি নিশ্চিত করে?',
    a: `<p><strong>Adaptive Cursor Sharing (ACS):</strong> প্যারামিটারযুক্ত কুয়েরিতে যদি ডেটা স্কিউড (Skewed) থাকে, Oracle CBO রানটাইমে মনিটর করে কুয়েরির বাফার গেটস। প্রয়োজন অনুযায়ী সে একাধিক এক্সিকিউশন প্ল্যান তৈরি করে ভিন্ন ভিন্ন প্যারামিটারের জন্য সঠিক প্ল্যান বেছে নেয়।</p>
<p><strong>SQL Plan Baselines (SPM):</strong> প্রোডাকশনে ডাটাবেজ আপগ্রেড বা অপটিমাইজার পরিবর্তনের সময় কোনো কুয়েরি যাতে হঠাৎ খারাপ প্ল্যানে চলে না যায়, তার জন্য <code>DBMS_SPM</code> দিয়ে সুনির্দিষ্ট প্ল্যান বেসলাইন লক করে দেওয়া হয়। নতুন প্ল্যান ভেরিফাই ও টেস্টেড না হওয়া পর্যন্ত অপটিমাইজার তা গ্রহণ করে না।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Oracle Disaster Recovery',
    q: '৬২. Oracle Flashback Query (AS OF TIMESTAMP) এবং Flashback Drop দিয়ে ডেটা করাপশন থেকে তাৎক্ষণিক রিকভারি?',
    a: `<p>যদি কোনো ডেভেলপার অসাবধানতাবশত প্রোডাকশনে <code>DELETE FROM Customers</code> (WHERE ক্লজ ছাড়া) চালিয়ে দেয়:</p>
<p><strong>১. Flashback Query:</strong> ব্যাকআপ রিস্টোর করার কোনো প্রয়োজন নেই। Undo Tablespace ব্যবহার করে ১০ মিনিট আগের সঠিক ডেটা পড়ে ফিরিয়ে আনা যায়:</p>
<pre><code>INSERT INTO Customers SELECT * FROM Customers AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '15' MINUTE);</code></pre>
<p><strong>২. Flashback Drop:</strong> ভুলবশত টেবিল ড্রপ করা হলে Oracle তা সরাসরি ডিলিট না করে <strong>Recyclebin</strong>-এ রাখে: <code>FLASHBACK TABLE Customers TO BEFORE DROP;</code> কমান্ড দিলে টেবিলের সমস্ত ডাটা ও ইনডেক্স চোখের পলকে রিস্টোর হয়।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Redis Memory Eviction',
    q: '৬৩. Redis Memory Management: 8টি Eviction Policies এর পার্থক্য কী এবং ক্যাশে কোনটি সেরা?',
    a: `<p>যখন Redis এর <code>maxmemory</code> পূর্ণ হয়ে যায়, ইঞ্জিন নির্ধারিত পলিসি অনুযায়ী কি ডিলিট করে:</p>
<ul>
    <li><strong>volatile-lru:</strong> শুধুমাত্র যে কি-গুলোতে TTL (Expiration) সেট করা আছে সেগুলোর মধ্যে Least Recently Used কি ডিলিট করে।</li>
    <li><strong>allkeys-lru (সাধারণ ক্যাশের জন্য সেরা):</strong> সমস্ত কি-র মধ্যে সবচেয়ে পুরানো অব্যবহৃত কি ডিলিট করে।</li>
    <li><strong>allkeys-lfu:</strong> Least Frequently Used—যে কি সবচেয়ে কম সংখ্যক বার কল করা হয়েছে। এটি ফ্রিকোয়েন্সি বিবেচনা করে সাময়িক স্পাইকের হাত থেকে গুরুত্বপূর্ণ ক্যাশ বাঁচায়।</li>
    <li><strong>noeviction (ফাইন্যান্সিয়ালের জন্য):</strong> কোনো কি ডিলিট করবে না, নতুন রাইট এলে <code>OOM command not allowed</code> এরর ফেরত দেবে।</li>
</ul>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Redis Persistence Internals',
    q: '৬৪. Redis Persistence: RDB Snapshotting বনাম AOF (Append-Only File) এর মেকানিক্স এবং Hybrid Persistence?',
    a: `<p><strong>RDB (Redis Database Snapshot):</strong> নির্দিষ্ট বিরতিতে (যেমন ১৫ মিনিটে) মেমোরির একটি কমপ্যাক্ট বাইনারি স্ন্যাপশট ডিস্কে <code>dump.rdb</code> ফাইলে সেভ করে (OS Fork মেকানিজম দিয়ে)। এটি ফাস্ট রিস্টার্ট দেয় কিন্তু ক্র্যাশ করলে শেষ কয়েক মিনিটের ডেটা নষ্ট হতে পারে।</p>
<p><strong>AOF (Append-Only File):</strong> প্রতিটি রাইট কমান্ড একটি টেক্সট লগে অ্যাপেন্ড করে। <code>fsync everysec</code> মোডে ডেটা হারানোর ঝুঁকি সর্বোচ্চ ১ সেকেন্ড। তবে ফাইল সাইজ অনেক বড় হয়।</p>
<p><strong>Hybrid Persistence (Redis 4.0+ ডিফল্ট):</strong> AOF রিরাইটের সময় ফাইলের শুরুতে কমপ্যাক্ট RDB স্ন্যাপশট লেখে এবং বাকি অংশে রানিং ট্রানজ্যাকশনের ডেল্টা AOF লগ রাখে। এটি দ্রুততম রিস্টার্ট এবং শূন্য ডেটা লসের নিখুঁত সমন্বয়।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'High Availability Redis',
    q: '৬৫. Redis Sentinel বনাম Redis Cluster: Split-Brain ফল্ট এবং min-replicas-to-write সুরক্ষাবলয় কী?',
    a: `<p><strong>Redis Sentinel:</strong> হাই-অ্যাভেইলেবিলিটি (Failover) নিশ্চিত করে। মাস্টার ক্র্যাশ করলে সেন্টিনেল কোরাম (Quorum) ভোটের মাধ্যমে নতুন রেপলিকাকে মাস্টার বানায়।</p>
<p><strong>Split-Brain ঝুঁকি:</strong> নেটওয়ার্ক পার্টিশনের কারণে পুরানো মাস্টার আইসোলেটেড হয়ে গেলেও ক্লায়েন্টের কাছ থেকে রাইট নিতে থাকে, আর অপর পাশে সেন্টিনেল নতুন মাস্টার বানিয়ে ফেলে। নেটওয়ার্ক ঠিক হলে পুরানো মাস্টারের সমস্ত ডাটা স্থায়ীভাবে ডিলিট হয়ে যায়।</p>
<p><strong>প্রতিরোধ:</strong></p>
<pre><code>min-replicas-to-write 1
min-replicas-max-lag 10</code></pre>
<p>এটি নিশ্চিত করে যদি মাস্টার অন্তত ১টি সুস্থ রেপলিকাকে ১০ সেকেন্ডের ভেতর পিং না পায়, তবে সে নিজে থেকেই ক্লায়েন্টের নতুন রাইট রিকোয়েস্ট রিজেক্ট করে দেবে এবং ডেটা ইনকনসিস্টেন্সি রোধ করবে।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Advanced Redis Structures',
    q: '৬৬. Redis Sorted Sets (ZSET with SkipList) এবং HyperLogLog দিয়ে কোটি কোটি ইউজারের লিডারবোর্ড ও ইউনিক ভিজিটর কাউন্ট?',
    a: `<p><strong>Sorted Sets (ZSET):</strong> প্রতিটি এলিমেন্টের সাথে একটি স্কোর থাকে। ইন্টারনালি এটি <strong>SkipList + Hash Table</strong> দিয়ে তৈরি, যা O(log N) সময়ে ইনসার্ট এবং রেঞ্জ কোয়েরি চালায়। কোটি খেলোয়াড়ের লাইভ গেম লিডারবোর্ড বা টপ র্যাঙ্কিং পেজিং (<code>ZREVRANGEBYSCORE</code>) চোখের পলকে সার্ভ করে।</p>
<p><strong>HyperLogLog:</strong> একটি ওয়েবসাইটে দৈনিক কোটি কোটি ইউনিক ভিজিটর (Cardinality) কাউন্ট করতে যদি সেট (Set) ব্যবহার করা হয়, গিগাবাইট মেমোরি খরচ হবে। <code>PFADD</code> এবং <code>PFCOUNT</code> ব্যবহার করে <strong>HyperLogLog মাত্র ১২ KB মেমোরিতে</strong> ৯৯.১9% নিখুঁত সম্ভাব্যতায় কোটি কোটি ইউনিক ভিজিটর গণনা করতে পারে!</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Database Maintenance',
    q: '৬৭. Index Rebuild বনাম Index Reorganize: ফ্র্যাগমেন্টেশন থ্রেশহোল্ড এবং প্রোডাকশন লকিং ইমপ্যাক্ট?',
    a: `<p><strong>ইন্ডেক্স ফ্র্যাগমেন্টেশন গাইডলাইন:</strong></p>
<ul>
    <li><strong>৫% থেকে ৩০% ফ্র্যাগমেন্টেশন &rarr; REORGANIZE:</strong> অনলাইন অপারেশন, কোনো হেভি টেবিল লক নেয় না। শুধুমাত্র বিদ্যমান লিফ পেজগুলোকে রি-অর্ডার করে। ট্রানজ্যাকশন লগ কম তৈরি করে।</li>
    <li><strong>৩০% এর বেশি ফ্র্যাগমেন্টেশন &rarr; REBUILD:</strong> সম্পূর্ণ নতুন ইন্ডেক্স বি-ট্রি তৈরি করে এবং পুরানোটি ড্রপ করে। ডিফল্টভাবে এটি অফলাইন (সম্পূর্ণ টেবিল লক করে)।</li>
</ul>
<p><strong>প্রোডাকশন বেস্ট প্র্যাকটিস:</strong> এন্টারপ্রাইজ সংস্করণে সর্বদা <code>ONLINE = ON</code> এবং <code>RESUMABLE = ON</code> ফ্ল্যাগ দিয়ে রিবিল্ড চালানো উচিত যাতে ব্যবহারকারীদের রিকোয়েস্টে কোনো ডাউনটাইম না আসে এবং নেটওয়ার্ক ব্রেক করলে পুনরায় সেখান থেকে শুরু করা যায়।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'High Availability AlwaysOn',
    q: '৬৮. SQL Server AlwaysOn Availability Groups: Synchronous বনাম Asynchronous Commit এবং Read-Only Routing?',
    a: `<p>AlwaysOn এ একটি প্রাইমারি ডাটাবেজের ট্রানজ্যাকশন লগ এক বা একাধিক সেকেন্ডারি নোডে রেপ্লিকেট হয়:</p>
<ul>
    <li><strong>Synchronous-Commit:</strong> সেকেন্ডারি নোডে লগ হার্ডেন (DiskWriten) না হওয়া পর্যন্ত প্রাইমারিতে ট্রানজ্যাকশন <code>COMMIT</code> সম্পন্ন হয় না (Zero Data Loss - RPO = 0)। কিন্তু নেটওয়ার্ক ল্যাটেন্সির কারণে রাইট কিছুটা স্লো হতে পারে।</li>
    <li><strong>Asynchronous-Commit:</strong> প্রাইমারি নিজে কমিট করে সেকেন্ডারিতে ব্যাকগ্রাউন্ডে পাঠায়। হাই পারফরম্যান্স দেয় কিন্তু নোড ক্র্যাশ করলে সামান্য ডেটা লস হতে পারে (Disaster Recovery সাইটের জন্য সেরা)।</li>
    <li><strong>Read-Only Routing:</strong> সেকেন্ডারি নোডগুলোকে রিড-অনলি হিসেবে কনফিগার করে সংযোগ স্ট্রিংয়ে <code>ApplicationIntent=ReadOnly</code> দিলে সমস্ত ভারি রিপোর্টিং কুয়েরি স্বয়ংক্রিয়ভাবে সেকেন্ডারিতে চলে যায়, ফলে প্রাইমারি নোড ১০০% ফ্রি থাকে।</li>
</ul>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Concurrency Conflicts',
    q: '৬৯. Optimistic Concurrency Control (RowVersion / Timestamp in EF Core) বনাম Pessimistic Concurrency (UPDLOCK)?',
    a: `<p><strong>Optimistic Concurrency (উচ্চ ট্রাফিকের স্ট্যান্ডার্ড):</strong> টেবিলে একটি <code>RowVersion (byte[])</code> কলাম রাখা হয়। ডাটাবেজে লক না নিয়ে ডাটা পড়া হয়। সেভ করার সময় <code>UPDATE ... WHERE Id = @Id AND RowVersion = @OriginalVersion</code> চেক করা হয়। যদি অন্য কোনো ব্যবহারকারী মাঝপথে আপডেট করে ফেলে, <code>DbUpdateConcurrencyException</code> থ্রো হয় যা ক্যাচ করে ইউজারকে কনফ্লিক্ট নোটিফাই করা যায়।</p>
<p><strong>Pessimistic Concurrency:</strong> কুয়েরির সময়ই ডেটাতে এক্সক্লুসিভ লক (<code>WITH (UPDLOCK, HOLDLOCK)</code>) নেওয়া হয় যাতে ট্রানজ্যাকশন শেষ না হওয়া পর্যন্ত আর কেউ ডাটা পড়তে বা এডিট করতে না পারে। টিকিট বুকিং বা এটিএম ব্যালেন্স কাটার মতো সেনসিটিভ ক্রাইটেরিয়ায় এটি প্রযোজ্য।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Query SARGability',
    q: '৭০. SARGability (Search Argument Able) কী? Non-SARGable কুয়েরি কীভাবে ইনডেক্স অকেজো করে এবং কীভাবে ফিক্স করবেন?',
    a: `<p><strong>SARGable:</strong> একটি কুয়েরি তখন SARGable হয় যখন ডাটাবেজ ইঞ্জিন সরাসরি B-Tree ইনডেক্সে <strong>Index Seek</strong> অপারেশন চালাতে পারে।</p>
<p><strong>Non-SARGable এর সাধারণ পাপসমূহ:</strong></p>
<ol>
    <li><strong>কলামের উপর ফাংশন ব্যবহার:</strong> <code>WHERE YEAR(CreatedDate) = 2024</code> &rarr; ইঞ্জিন বাধ্য হয়ে সম্পূর্ণ কোটি রো স্ক্যান (Index Scan) করবে।<br>
    <em>SARGable সমাধান:</em> <code>WHERE CreatedDate &gt;= '2024-01-01' AND CreatedDate &lt; '2025-01-01'</code>।</li>
    <li><strong>সামনে ওয়াইল্ডকার্ড লাইক:</strong> <code>WHERE Name LIKE '%Rahim'</code> &rarr; ইনডেক্স রুট থেকে খোঁজা অসম্ভব, তাই স্ক্যান হবে।</li>
    <li><strong>ইমপ্লিসিট ডাটা টাইপ কনভার্সন:</strong> কলাম <code>VARCHAR</code> অথচ প্যারামিটার পাস করা হলো <code>NVARCHAR</code>। ইঞ্জিন প্রতি রো-তে কনভার্সন ফাংশন বসিয়ে ইনডেক্স অকেজো করে ফেলে।</li>
</ol>`
  }
];
