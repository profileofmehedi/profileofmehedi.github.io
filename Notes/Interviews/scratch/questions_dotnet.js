// Questions 1 to 35: C# & .NET Core / .NET 8 / 9, CLR, Memory, Concurrency
module.exports = [
  // Junior
  {
    topic: 'dotnet',
    level: 'junior',
    badge: 'C# Basics',
    q: '১. Value Type এবং Reference Type এর মূল পার্থক্য কী? মেমোরিতে এরা কোথায় থাকে?',
    a: `<p><strong>Value Type:</strong> সরাসরি ডাটা ধারণ করে এবং সাধারণত মেমোরির <strong>Stack</strong> এ সংরক্ষিত থাকে। উদাহরণ: <code>int, float, bool, struct, enum, double</code>। যখন একটি Value Type ভ্যারিয়েবল অন্যটিতে অ্যাসাইন করা হয়, তখন পুরো ডাটার একটি স্বাধীন কপি তৈরি হয়। একটির পরিবর্তন অন্যটিকে প্রভাবিত করে না।</p>
<p><strong>Reference Type:</strong> মেমোরির <strong>Managed Heap</strong> এ মূল অবজেক্ট সংরক্ষণ করে এবং Stack এ সেই অবজেক্টের মেমোরি অ্যাড্রেস (পয়েন্টার বা রেফারেন্স) ধারণ করে। উদাহরণ: <code>class, string, object, array, delegate, interface</code>। এটি কপি করলে শুধুমাত্র পয়েন্টারটি কপি হয়, অর্থাৎ উভয় ভ্যারিয়েবল হিপের একই অবজেক্টকে নির্দেশ করে।</p>
<p><em>নোট:</em> যদি কোনো Value Type কোনো ক্লাসের ফিল্ড বা প্রোপার্টি হয়, তবে সেটিও ক্লাসের সাথে Heap মেমোরিতেই সংরক্ষিত হয়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'junior',
    badge: 'C# Strings',
    q: '২. string এবং StringBuilder এর মধ্যে পার্থক্য কী? লুপের ভেতর কোনটি ব্যবহার করা উচিত?',
    a: `<p><code>string</code> হলো <strong>Immutable (অপরিবর্তনশীল)</strong>। আপনি যখন কোনো স্ট্রিং কনক্যাট বা পরিবর্তন করেন (যেমন <code>str += "a"</code>), C# বিদ্যমান স্ট্রিংটি এডিট করে না, বরং হিপ মেমোরিতে সম্পূর্ণ নতুন একটি স্ট্রিং অবজেক্ট তৈরি করে এবং পুরনোটি আনরেফারেন্সড গার্বেজে পরিণত করে। লুপের ভেতর হাজার বার স্ট্রিং যোগ করলে প্রচুর মেমোরি অপচয় ও Garbage Collection (GC) প্রেসার তৈরি হয়।</p>
<p><code>StringBuilder</code> হলো <strong>Mutable (পরিবর্তনশীল)</strong>। এটি ইন্টারনাল ক্যারেক্টার বাফার (Dynamic Array Buffer) ম্যানেজ করে। কোনো নতুন অবজেক্ট না তৈরি করেই বাফারের ভেতর ইন-প্লেস ক্যারেক্টার অ্যাপেন্ড বা মডিফাই করতে পারে।</p>
<p><strong>সিদ্ধান্ত:</strong> যদি ২-৩টি স্ট্রিং জোড়া দিতে হয় তবে সাধারণ স্ট্রিং ইন্টারপোলেশন <code>$"Hello {name}"</code> ব্যবহার করা সহজ। কিন্তু যেকোনো লুপ, ফাইল প্রসেসিং বা বড় ডায়নামিক টেক্সট তৈরির ক্ষেত্রে সর্বদা <code>StringBuilder</code> ব্যবহার করা বাধ্যতামূলক।</p>`
  },
  {
    topic: 'dotnet',
    level: 'junior',
    badge: 'OOP Core',
    q: '৩. Interface এবং Abstract Class এর মধ্যে পার্থক্য কী এবং কখন কোনটি ব্যবহার করবেন?',
    a: `<p><strong>মূল পার্থক্যসমূহ:</strong></p>
<ul>
    <li><strong>ইনহেরিটেন্স সীমা:</strong> একটি ক্লাস কেবল <em>একটি</em> Abstract Class ইনহেরিট করতে পারে (C# এ মাল্টিপল ক্লাস ইনহেরিটেন্স নিষিদ্ধ)। কিন্তু একই সাথে <em>একাধিক</em> Interface ইমপ্লিমেন্ট করতে পারে।</li>
    <li><strong>স্টেট ও ফিল্ড:</strong> Abstract Class-এ স্টেট (ফিল্ড ভ্যারিয়েবল), কনস্ট্রাক্টর এবং প্রোটেক্টেড মেম্বার থাকতে পারে। Interface-এ কোনো ইন্সট্যান্স ফিল্ড বা স্টেট থাকতে পারে না (শুধুমাত্র মেথড, প্রোপার্টি, ইভেন্টের সিগনেচার)।</li>
    <li><strong>ডিফল্ট ইমপ্লিমেন্টেশন:</strong> C# 8.0 থেকে ইন্টারফেসে Default Interface Method যোগ হলেও তা মূল কন্ট্রাক্ট ডিজাইনের বিকল্প নয়।</li>
</ul>
<p><strong>কখন কোনটি:</strong> যখন আপনি সম্পর্কিত ক্লাসগুলোর মধ্যে কোড শেয়ার করতে চান এবং 'IS-A' হায়ারার্কি তৈরি করতে চান (যেমন <code>Vehicle -> Car</code>) তখন Abstract Class। আর যখন সম্পূর্ণ অসম্পর্কিত ক্লাসগুলোর মধ্যে একটি নির্দিষ্ট চুক্তি বা সক্ষমতা নিশ্চিত করতে চান (যেমন <code>IDisposable, ILogger, IRepository</code>) তখন Interface ব্যবহার করবেন।</p>`
  },
  {
    topic: 'dotnet',
    level: 'junior',
    badge: 'C# Internals',
    q: '৪. Boxing এবং Unboxing কী? এর পারফরম্যান্স ইমপ্যাক্ট কী এবং জেনেরিক্স কীভাবে এটি রোধ করে?',
    a: `<p><strong>Boxing:</strong> একটি Value Type (যেমন <code>int</code>)-কে Reference Type (যেমন <code>object</code> বা কোনো ইন্টারফেস)-এ রূপান্তর করার প্রক্রিয়া। এতে CLR হিপ মেমোরিতে একটি নতুন অবজেক্ট বক্স তৈরি করে এবং স্ট্যাকের ভ্যালু কপি করে হিপে নিয়ে যায়। এটি মেমোরি অ্যালোকেশন ও GC ওভারহেড তৈরি করে।</p>
<p><strong>Unboxing:</strong> হিপে থাকা অবজেক্ট বক্স থেকে পুনরায় স্ট্যাকের Value Type ভ্যারিয়েবলে এক্সপ্লিসিটলি ডাটা ফেরত আনার প্রক্রিয়া।</p>
<pre><code>int x = 42;
object obj = x;        // Boxing (স্ট্যাক থেকে হিপে অ্যালোকেশন)
int y = (int)obj;      // Unboxing (হিপ বক্স থেকে স্ট্যাকে ভ্যালু রিট্রিভ)</code></pre>
<p><strong>জেনেরিক্সের সমাধান:</strong> C# 1.0 এর <code>ArrayList</code> সব উপাদান <code>object</code> হিসেবে রাখত, ফলে প্রতি ইনসার্টে Boxing এবং রিট্রিভে Unboxing হতো। C# 2.0 এর <code>List&lt;int&gt;</code> জেনেরিক টাইপ সেফটি আনে—যেখানে কম্পাইলার সরাসরি স্পেসিফিক টাইপ হ্যান্ডেল করে কোনো Boxing ছাড়াই, ফলে মেমোরি খরচ শূন্যে নেমে আসে।</p>`
  },
  {
    topic: 'dotnet',
    level: 'junior',
    badge: 'C# Fundamentals',
    q: '৫. C# এর Access Modifiers কয়টি ও কী কী? protected internal এবং private protected এর পার্থক্য কী?',
    a: `<p>C# এ ৬ ধরণের অ্যাক্সেস মডিফায়ার রয়েছে:</p>
<ol>
    <li><code>public</code>: যেকোনো প্রজেক্ট বা অ্যাসেম্বলি থেকে অ্যাক্সেসযোগ্য।</li>
    <li><code>private</code>: শুধুমাত্র একই ক্লাসের ভেতর থেকে অ্যাক্সেসযোগ্য (ডিফল্ট)।</li>
    <li><code>protected</code>: একই ক্লাস এবং তার চাইল্ড (ডেরাইভড) ক্লাস থেকে অ্যাক্সেসযোগ্য।</li>
    <li><code>internal</code>: শুধুমাত্র একই প্রজেক্ট/অ্যাসেম্বলির (DLL) ভেতর থেকে অ্যাক্সেসযোগ্য।</li>
    <li><code>protected internal</code>: <strong>UNION (OR) লজিক:</strong> একই অ্যাসেম্বলির যেকোনো ক্লাস <em>অথবা</em> অন্য অ্যাসেম্বলির চাইল্ড ক্লাস থেকে অ্যাক্সেসযোগ্য।</li>
    <li><code>private protected</code>: <strong>INTERSECTION (AND) লজিক:</strong> শুধুমাত্র <em>একই অ্যাসেম্বলির ভেতর</em> অবস্থিত চাইল্ড ক্লাস থেকে অ্যাক্সেসযোগ্য। অন্য অ্যাসেম্বলির চাইল্ড ক্লাস এটি পাবে না।</li>
</ol>`
  },
  {
    topic: 'dotnet',
    level: 'junior',
    badge: 'C# Keywords',
    q: '৬. const এবং readonly এর মধ্যে পার্থক্য কী? কোনটি রানটাইমে ভ্যালু পরিবর্তন সমর্থন করে?',
    a: `<p><strong>const (কম্পাইল-টাইম কনস্ট্যান্ট):</strong> ভ্যালু অবশ্যই ডিক্লেয়ার করার সময়ই দিতে হয়। কম্পাইলার কোড বিল্ড করার সময় ভ্যারিয়েবলের নামের জায়গায় সরাসরি লিটারেল ভ্যালু ইনলাইন (hardcode) করে দেয়। এটি সর্বদা ইমপ্লিসিটলি <code>static</code>।</p>
<p><strong>readonly (রান-টাইম কনস্ট্যান্ট):</strong> ডিক্লেয়ারেশনের সময় অথবা ক্লাসের <strong>কনস্ট্রাক্টরের (Constructor) ভেতর</strong> ভ্যালু অ্যাসাইন করা যায়। রানটাইমে কনফিগারেশন বা ক্যালকুলেশনের উপর ভিত্তি করে প্রতি ইন্সট্যান্সে ভিন্ন ভ্যালু নিতে পারে। কনস্ট্রাক্টর এক্সিকিউট হওয়ার পর এর ভ্যালু আর পরিবর্তন করা যায় না।</p>`
  },
  {
    topic: 'dotnet',
    level: 'junior',
    badge: 'Exception Handling',
    q: '৭. C# এ throw বনাম throw ex এর পার্থক্য কী? কেন throw ex প্রোডাকশনে মারাত্মক ভুল?',
    a: `<p><strong>মারাত্মক পার্থক্য:</strong></p>
<ul>
    <li><code>throw;</code>: মূল যে ফাইলে এবং যে লাইনে এররটি ঘটেছিল, তার সম্পূর্ণ <strong>Call Stack Trace অক্ষত থাকে</strong>। প্রোডাকশন লগে সঠিক রুট-কজ খুঁজে পাওয়া যায়।</li>
    <li><code>throw ex;</code>: এটি মূল স্ট্যাক ট্রেস <strong>মুছে ফেলে</strong> এবং রি-থ্রো করার লাইনটিকে নতুন সোর্স হিসেবে সেট করে। ফলে আসল কোন মেথডে বাগ ছিল তা চিরতরে হারিয়ে যায়।</li>
</ul>`
  },

  // Mid-Level
  {
    topic: 'dotnet',
    level: 'mid',
    badge: 'ASP.NET Core DI',
    q: '৮. Dependency Injection এ Transient, Scoped এবং Singleton এর সুনির্দিষ্ট ব্যবহার ক্ষেত্র কী?',
    a: `<p>ASP.NET Core এর বিল্ট-ইন IoC কন্টেইনারে ৩ ধরণের সার্ভিস লাইফটাইম আছে:</p>
<ol>
    <li><strong>Transient (<code>AddTransient</code>):</strong> প্রতিবার সার্ভিসের জন্য রিকোয়েস্ট করলেই একটি ব্র্যান্ড নিউ ইন্সট্যান্স তৈরি হয়। লাইটওয়েট এবং স্টেটলেস সার্ভিসের জন্য আদর্শ (যেমন: ইউটিলিটি, ভ্যালিডেটর, ফরম্যাটার)।</li>
    <li><strong>Scoped (<code>AddScoped</code>):</strong> প্রতিটি একক HTTP Request-এর জন্য একটি মাত্র ইন্সট্যান্স তৈরি হয়। পুরো রিকোয়েস্ট লাইফসাইকেলে যত জায়গায় ইনজেক্ট করা হোক, তারা একই অবজেক্ট শেয়ার করবে। রিকোয়েস্ট শেষ হলে এটি স্বয়ংক্রিয়ভাবে ডিসপোজ হয়। <code>DbContext</code> এবং বিজনেস সার্ভিসগুলোর জন্য এটি সর্বোত্তম।</li>
    <li><strong>Singleton (<code>AddSingleton</code>):</strong> অ্যাপ্লিকেশন স্টার্ট হওয়ার পর প্রথম রিকোয়েস্টে একবার তৈরি হয় এবং অ্যাপ বন্ধ না হওয়া পর্যন্ত জীবিত থাকে। ইন-মেমোরি ক্যাশ, কনফিগারেশন ম্যানেজার বা সিঙ্গেল ইনস্ট্যান্স ক্লায়েন্টের (যেমন HttpClientFactory বা RedisConnectionMultiplexer) জন্য প্রযোজ্য। এটি অবশ্যই থ্রেড-সেফ হতে হবে।</li>
</ol>`
  },
  {
    topic: 'dotnet',
    level: 'mid',
    badge: 'EF Core & LINQ',
    q: '৯. IEnumerable বনাম IQueryable এর পার্থক্য কী? Deferred Execution কীভাবে কাজ করে?',
    a: `<p><strong>IEnumerable:</strong> ইন-মেমোরি (In-Memory) কালেকশনের উপর কাজ করে। ডাটাবেজে কুয়েরি চালালে এটি সমস্ত ডাটা মেমোরিতে টেনে নিয়ে আসে এবং মেমোরির ভেতরে ফিল্টার করে (Client-side evaluation)। বড় টেবিলে এটি চালালে মেমোরি ক্র্যাশ করে।</p>
<p><strong>IQueryable:</strong> এক্সপ্রেশন ট্রি (Expression Tree) তৈরি করে। এটি <code>WHERE</code>, <code>ORDER BY</code> বা <code>TAKE</code> ক্লজকে সরাসরি SQL স্টেটমেন্টে রূপান্তর করে ডাটাবেজ ইঞ্জিনে পাঠায়। ফলে শুধুমাত্র কাঙ্ক্ষিত নির্দিষ্ট ডেটাই ডাটাবেজ থেকে নেটওয়ার্কের মাধ্যমে মেমোরিতে আসে (Server-side evaluation)।</p>
<p><strong>Deferred Execution (বিলম্বিত সম্পাদন):</strong> LINQ কুয়েরি ডিফাইন করার সাথে সাথে এক্সিকিউট হয় না। যখন কুয়েরিটি <code>foreach</code> লুপে ট্রাভার্স করা হয় অথবা <code>ToList() / ToListAsync() / FirstOrDefaultAsync() / Count()</code> কল করা হয়, তখনই কেবল ডাটাবেজে SQL স্টেটমেন্ট রান হয়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'mid',
    badge: 'Async Internals',
    q: '১০. async/await কীভাবে কাজ করে? ConfigureAwait(false) কেন লাইব্রেরি কোডে ব্যবহার করা হয়?',
    a: `<p>C# কম্পাইলার যখন কোনো <code>async</code> মেথড দেখে, তখন সে মেথডটিকে একটি স্টেট মেশিন স্ট্রাক্টে (<code>IAsyncStateMachine</code>) রূপান্তর করে। যখন <code>await</code> এক্সিকিউট হয়, কলিং থ্রেডটি ব্লক না হয়ে থ্রেডপুলে ফিরে যায় অন্যান্য রিকোয়েস্ট প্রসেস করতে। I/O অপারেশন (ডাটাবেজ বা HTTP) শেষ হলে OS কলব্যাক পাঠিয়ে থ্রেডপুল থেকে একটি থ্রেড নিয়ে বাকি মেথড অংশটুকু চালায়।</p>
<p><strong>SynchronizationContext ও ConfigureAwait(false):</strong> বাই-ডিফল্ট <code>await</code> টাস্ক শেষ হওয়ার পর মূল <code>SynchronizationContext</code>-এ ফিরে আসার চেষ্টা করে। <code>ConfigureAwait(false)</code> বলে দেয়: "আমার মূল কনটেক্সটে ফেরার দরকার নেই, থ্রেডপুলের যেকোনো মুক্ত থ্রেডে বাকি কাজ শেষ করো।" এটি লাইব্রেরিতে ডেডলক এড়ায় এবং পারফরম্যান্স বুস্ট করে।</p>`
  },
  {
    topic: 'dotnet',
    level: 'mid',
    badge: 'EF Core Optimization',
    q: '১১. EF Core এ AsNoTracking, Split Queries এবং N+1 কুয়েরি প্রবলেম কীভাবে সমাধান করবেন?',
    a: `<p><strong>১. AsNoTracking:</strong> বাই-ডিফল্ট EF Core ডাটাবেজ থেকে ডাটা পড়ার সময় <strong>Change Tracker</strong>-এ অবজেক্টের স্ন্যাপশট রাখে। রিড-অনলি এপিআই বা গ্রিড ডিসপ্লেতে <code>.AsNoTracking()</code> ব্যবহার করলে চেঞ্জ ট্র্যাকিং বাইপাস হয়, যা মেমোরি খরচ প্রায় ৪০% কমিয়ে দেয়।</p>
<p><strong>২. N+1 Problem:</strong> যদি প্যারেন্ট টেবিল পড়ার পর লুপের ভেতর চাইল্ড টেবিলের প্রোপার্টি রিড করা হয়, তবে প্যারেন্টের জন্য ১টি এবং প্রতি চাইল্ডের জন্য N-সংখ্যক কুয়েরি ফায়ার হয়। <em>সমাধান:</em> <code>.Include(x => x.Orders)</code> দিয়ে <strong>Eager Loading</strong> করতে হবে।</p>
<p><strong>৩. Split Queries (AsSplitQuery):</strong> যখন একাধিক চাইল্ড কালেকশন <code>Include</code> করা হয় (যেমন: Customer -> Orders -> OrderItems), তখন সিঙ্গেল SQL কুয়েরিতে Cartesian Product তৈরি হয়ে মেমোরিতে লক্ষ লক্ষ ডুপ্লিকেট রো জেনারেট হয়। <code>.AsSplitQuery()</code> লিখলে EF Core একাধিক অপ্টিমাইজড সমান্তরাল SQL কুয়েরি চালিয়ে মেমোরিতে ডাটা জোড়া দেয়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'mid',
    badge: 'ASP.NET Core Architecture',
    q: '১২. ASP.NET Core Middleware Pipeline এবং Action Filters এর মধ্যে পার্থক্য কী? এক্সিকিউশন অর্ডার কীভাবে নিয়ন্ত্রিত হয়?',
    a: `<p><strong>Middleware:</strong> HTTP রিকোয়েস্ট পাইপলাইনের সর্বনিম্ন স্তরে কাজ করে। <code>HttpContext</code> রিসিভ করে এবং পরবর্তী মিডলওয়্যারে পাস করে (<code>next()</code>) অথবা শর্ট-সার্কিট করে রেসপন্স ফেরত দেয়। এটি ফ্রেমওয়ার্ক-অ্যাগনস্টিক (Routing, CORS, Authentication, Response Compression)। <code>Program.cs</code>-এ রেজিস্ট্রেশনের ক্রম অনুযায়ী এক্সিকিউট হয়।</p>
<p><strong>Action Filters:</strong> এটি MVC/API সাব-সিস্টেমের অংশ। রাউটিং শেষ হওয়ার পর কন্ট্রোলার অ্যাকশন মেথড এক্সিকিউট হওয়ার ঠিক আগে ও পরে রান করে। এর কাছে <code>ActionContext</code>, মডেল প্যারামিটার, এবং <code>ModelState</code> থাকে। ব্যবহার: অ্যাকশন-লেভেল মডেল ভ্যালিডেশন, ট্রানজ্যাকশন হ্যান্ডলিং।</p>`
  },
  {
    topic: 'dotnet',
    level: 'mid',
    badge: 'LINQ Deep-Dive',
    q: '১৩. LINQ এ Select এবং SelectMany এর পার্থক্য কী? Deferred Execution এর সুবিধা কী?',
    a: `<p><strong>Select (১-টু-১ ম্যাপিং):</strong> ইনপুট কালেকশনের প্রতিটি এলিমেন্টকে অন্য একটি অবজেক্টে প্রজেক্ট করে। আউটপুটের দৈর্ঘ্য ইনপুটের সমান থাকে।</p>
<p><strong>SelectMany (১-টু-অনেস্ট ফ্ল্যাটেনিং):</strong> যখন প্রতিটি এলিমেন্টের ভেতর নিজস্ব একটি চাইল্ড কালেকশন বা লিস্ট থাকে (যেমন <code>List&lt;Department&gt;</code> এর ভেতর <code>List&lt;Employee&gt;</code>), <code>SelectMany</code> সেই চাইল্ড লিস্টগুলোকে একত্রিত করে একটি সিঙ্গেল ফ্ল্যাট সিকোয়েন্সে (<code>IEnumerable&lt;Employee&gt;</code>) রূপান্তর করে।</p>
<p><strong>Deferred Execution এর সুবিধা:</strong> কুয়েরি ডিফাইন করার সাথে সাথে ডাটা লোড হয় না। ফলে একাধিক ফিল্টার ও পেজিং চেইন করা যায় এবং ডাটাবেজে শুধুমাত্র ফাইনাল অপ্টিমাইজড কুয়েরিটিই রান হয়।</p>`
  },

  // Senior / Lead
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'CLR & Threading',
    q: '১৪. ThreadPool Starvation কী? প্রোডাকশনে কীভাবে ডিবাগ করবেন এবং কেন এটি ক্যাটাস্ট্রফিক?',
    a: `<p><strong>ThreadPool Starvation</strong> ঘটে যখন অ্যাসিনক্রোনাস কোডকে সিনক্রোনাসলি কল করা হয় (Sync-Over-Async যেমন <code>task.Result</code> বা <code>task.Wait()</code>)। উচ্চ ট্রাফিকের সময় শত শত ইনকামিং রিকোয়েস্ট থ্রেডপুলের ওয়ার্কার থ্রেডগুলোকে ব্লক করে বসে থাকে।</p>
<p>ডটনেট থ্রেডপুল তাৎক্ষণিকভাবে থ্রেড তৈরি করতে পারে না; এটি <strong>Hill-Climbing Algorithm</strong> অনুযায়ী প্রতি সেকেন্ডে মাত্র ১-২টি থ্রেড বাড়াতে পারে। ফলে সার্ভারের সিপিইউ ইউসেজ মাত্র ৫%-১০% থাকা সত্ত্বেও সমস্ত ইনকামিং এপিআই কল কিউতে আটকে টাইমআউট (HTTP 503) হতে থাকে।</p>
<p><strong>ডিবাগিং ও ফিক্স:</strong> প্রোডাকশনে <code>dotnet-dump collect -p &lt;PID&gt;</code> দিয়ে মেমোরি ডাম্প নিন। <code>dotnet-dump analyze</code> এ <code>!threads</code> কমান্ড দিলে দেখা যাবে শত শত থ্রেড <code>Task.Wait</code> বা <code>Monitor.Wait</code>-এ আটকে আছে। <strong>সমাধান:</strong> সম্পূর্ণ কোডবেস "Async All The Way" হতে হবে।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'High Performance C#',
    q: '১৫. Span<T> এবং Memory<T> এর মধ্যে পার্থক্য কী? Span কেন async মেথডে ব্যবহার করা যায় না?',
    a: `<p><code>Span&lt;T&gt;</code> হলো একটি <code>ref struct</code> যা মেমোরির যেকোনো কন্টিনিউয়াস ব্লকের (Stack, Heap, Native Unmanaged Memory) উপর একটি লাইটওয়েট উইন্ডো তৈরি করে কোনো মেমোরি এলোকেশন ও কপি ছাড়াই স্লাইসিং করতে দেয় (Zero Allocation)।</p>
<p><strong>কেন async মেথডে Span ব্যবহার করা যায় না?</strong> টাইপ সেফটির কারণে CLR নিশ্চিত করে যে <code>ref struct</code> কখনো ম্যানেজড হিপে যেতে পারবে না—শুধুমাত্র স্ট্যাকে থাকবে। অ্যাসিনক্রোনাস মেথডে (<code>async/await</code>) মেথড সাসপেন্ড হওয়ার সময় স্টেট ধরে রাখার জন্য কম্পাইলার সমস্ত লোকাল ভ্যারিয়েবলকে হিপ মেমোরিতে একটি স্টেট মেশিন ক্লাসের ফিল্ডে রূপান্তর করে। যেহেতু হিপে <code>ref struct</code> রাখা অবৈধ, তাই কম্পাইলার <code>await</code> বাউন্ডারিতে <code>Span&lt;T&gt;</code> ব্যবহার করতে দেয় না। <code>Memory&lt;T&gt;</code> সাধারণ <code>struct</code> হওয়ায় হিপে থাকতে পারে এবং async মেথডে নিরাপদে পাস করা যায়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'CLR Internals',
    q: '১৬. .NET Garbage Collector Internals: Gen 0, 1, 2, LOH এবং POH এর মেকানিক্স ব্যাখ্যা করুন।',
    a: `<p>.NET GC হলো একটি Generational Tracing Garbage Collector:</p>
<ul>
    <li><strong>Generation 0:</strong> স্বল্পস্থায়ী অবজেক্ট। কালেকশন অত্যন্ত দ্রুত (মাইক্রোসেকেন্ডে)। বেঁচে যাওয়া অবজেক্ট Gen 1 এ প্রমোট হয়।</li>
    <li><strong>Generation 1:</strong> বাফার জোন। Gen 0 এবং Gen 2 এর মধ্যে ট্রানজিশন স্তর।</li>
    <li><strong>Generation 2:</strong> দীর্ঘস্থায়ী অবজেক্ট (Singleton, Static Cache)। Gen 2 কালেকশনকে <strong>Full GC</strong> বলে, যা তুলনামূলক ব্যয়বহুল।</li>
    <li><strong>LOH (Large Object Heap):</strong> ৮৫,০০০ বাইট (৮৫ KB) বা তার বড় অবজেক্ট সরাসরি LOH-এ জমা হয়। এটি সাধারণত কম্প্যাক্ট করা হয় না, ফলে মেমোরি ফ্র্যাগমেন্টেশন হতে পারে।</li>
    <li><strong>POH (Pinned Object Heap):</strong> যে অবজেক্টগুলোকে মেমোরিতে নির্দিষ্ট ঠিকানায় পিন করে রাখতে হয় (Unmanaged ইন্টারপ বা সকেট I/O বাফার), সেগুলো এখানে থাকে যাতে অন্যান্য হিপ কম্প্যাক্ট হতে বাধা না পায়।</li>
</ul>
<p>প্রোডাকশনে সর্বদা <code>Server GC</code> ব্যবহার করা হয়, যেখানে প্রতিটি CPU কোরের জন্য স্বাধীন হিপ ও থ্রেড থাকে।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'ASP.NET Core Architecture',
    q: '১৭. Captive Dependency কী? কীভাবে এটি মেমোরি লিক ও কনকারেন্সি ক্র্যাশ তৈরি করে?',
    a: `<p><strong>Captive Dependency</strong> ঘটে যখন দীর্ঘস্থায়ী কোনো সার্ভিস (যেমন: <strong>Singleton</strong>) তার ভেতর কম লাইফটাইমের কোনো সার্ভিসকে (যেমন: <strong>Scoped</strong>) কনস্ট্রাক্টরে ইনজেক্ট করে ধরে রাখে।</p>
<p>যেহেতু Singleton অ্যাপ্লিকেশন লাইফটাইমে একবার তৈরি হয়ে চিরকাল বেঁচে থাকে, তাই এর ভেতর ইনজেক্ট হওয়া Scoped সার্ভিসটিও (যেমন: <code>DbContext</code>) আর কখনো ডিসপোজ হতে পারে না—চিরকালের জন্য বন্দী হয়ে যায়।</p>
<p><strong>ভয়ংকর পরিণতি:</strong> <code>DbContext</code> থ্রেড-সেফ নয়। একাধিক সমান্তরাল HTTP থ্রেড একই Singleton থেকে ক্যাপটিভ <code>DbContext</code> শেয়ার করায় <code>InvalidOperationException</code> এ সার্ভার ক্র্যাশ করে এবং অবজেক্ট রিলিজ না হওয়ায় মেমোরি লিক ঘটে। ফিক্স: <code>ValidateScopes = true</code> চালু রাখা।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'High Performance & AOT',
    q: '১৮. ArrayPool<T> এবং Native AOT এর বাস্তব সুবিধা ও চ্যালেঞ্জ কী কী?',
    a: `<p><strong>ArrayPool&lt;T&gt;:</strong> উচ্চ ট্রাফিকের সময় প্রতি রিকোয়েস্টে বড় বাইট অ্যারে তৈরি না করে মেমোরি পুল থেকে ধার নেওয়া হয়: <code>ArrayPool&lt;byte&gt;.Shared.Rent(4096)</code>। কাজ শেষে <code>Return(buffer)</code> করলে বাফারটি পুনরায় ব্যবহারযোগ্য হয়। এটি Gen 2 ও LOH-এ নতুন অ্যালোকেশন ১০০% রোধ করে।</p>
<p><strong>Native AOT (.NET 8/9):</strong> C# কোডকে সরাসরি মেশিন কোডে কম্পাইল করে (কোনো JIT কম্পাইলার বা IL কোড রানটাইমে লাগে না)। সুবিধা: মিলিসেকেন্ডে ইনস্ট্যান্ট কোল্ড-স্টার্ট, অতি ক্ষুদ্র মেমোরি ফুটপ্রিন্ট (১৫-২০ MB)। চ্যালেঞ্জ: রানটাইম রিফ্লেকশন কাজ করে না, তাই সোর্স জেনারেটর ব্যবহার করতে হয়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Enterprise Architecture',
    q: '১৯. Clean Architecture এ CQRS এবং MediatR Pipeline Behaviors কেন ব্যবহার করবেন?',
    a: `<p><strong>CQRS:</strong> রিড (Query) এবং রাইট (Command) অপারেশনকে সম্পূর্ণ পৃথক করে। কমান্ড মডেলে থাকে ভ্যালিডেশন ও ট্রানজ্যাকশন; আর কুয়েরি মডেলে ড্যাপার দিয়ে সরাসরি ফাস্ট রিড করা যায়।</p>
<p><strong>MediatR Pipeline Behaviors:</strong> কন্ট্রোলারের ভেতর একই কোড বারবার না লিখে পাইপলাইনে Cross-Cutting Concerns হ্যান্ডেল করা হয়: <code>ValidationBehavior</code> (হ্যান্ডলারে ঢোকার আগেই FluentValidation দিয়ে মডেল চেক), <code>LoggingBehavior</code> (পারফরম্যান্স টাইমিং লগিং), এবং <code>TransactionBehavior</code> (সফল হলে স্বয়ংক্রিয় DB Commit, ফেইল হলে Rollback)।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'JIT & Dynamic PGO',
    q: '২০. Dynamic PGO (Profile-Guided Optimization) এবং Tiered Compilation কীভাবে .NET 8/9 এ ৪০% গতি বাড়ায়?',
    a: `<p><strong>Tiered Compilation:</strong></p>
<ul>
    <li><strong>Tier 0 (Quick JIT):</strong> অ্যাপ স্টার্টআপ ফাস্ট করার জন্য কোনো অপ্টিমাইজেশন ছাড়াই অতি দ্রুত IL কোডকে মেশিন কোডে কম্পাইল করে।</li>
    <li><strong>Tier 1 (Optimized JIT):</strong> কোনো মেথড যদি প্রায় ৩০ বার কল হয়, CLR ব্যাকগ্রাউন্ড থ্রেডে সেই মেথডটিকে সর্বোচ্চ অপ্টিমাইজেশন দিয়ে পুনরায় কম্পাইল করে।</li>
    <li><strong>OSR (On-Stack Replacement):</strong> যদি কোনো দীর্ঘায়িত লুপ টিয়ার ০ মেথডের ভেতর চলতে থাকে, মেথড শেষ হওয়ার আগেই রানিং এক্সিকিউশনের মাঝপথেই কোডকে টিয়ার ১ অপ্টিমাইজড ভার্সনে হট-সোয়াপ করে দেয়।</li>
</ul>
<p><strong>Dynamic PGO (.NET 8/9 ডিফল্ট):</strong> টিয়ার ০ চলাকালীন রানটাইম মেথডের ভেতর প্রোফাইলিং ইনস্ট্রুমেন্টেশন বসায় (যেমন: কোন ইন্টারফেস মেথডে আসলে কোন কংক্রিট ক্লাস সবচেয়ে বেশি কল হচ্ছে)। এরপর টিয়ার ১ এ জেনেরিক ভার্চুয়াল কলকে সরাসরি <strong>Direct Call (Devirtualization)</strong> এবং ইনলাইন (Inlining) করে দেয়। ফলে মেমোরি জাম্প ও CPU ব্র্যাঞ্চ মিস-প্রেডিকশন দূর হয়ে ৪০% পর্যন্ত স্পিড বাড়ে।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Memory Layout Internals',
    q: '২১. 64-bit CLR এ একটি Reference Object এর মেমোরি লেআউট কীরূপ? MethodTable Pointer ও SyncBlockIndex এর ভূমিকা কী?',
    a: `<p>একটি 64-bit সিস্টেমে হিপে তৈরি যেকোনো রেফারেন্স অবজেক্টের শুরুতে <strong>১৬ বাইটের ওভারহেড (Object Header)</strong> থাকে:</p>
<pre><code>[SyncBlockIndex (8 Bytes)] [MethodTable Pointer (8 Bytes)] [Object Fields / Data ...]</code></pre>
<ol>
    <li><strong>SyncBlockIndex (8 বাইট):</strong> <code>lock(obj)</code> করার সময় মনিটর অবজেক্টের লক স্টেট, ডিফল্ট হ্যাশকোড (HashCode) এবং COM ইন্টারপ তথ্য ধারণ করে।</li>
    <li><strong>MethodTable Pointer (8 বাইট):</strong> অবজেক্টটির টাইপ ডেসক্রিপ্টরকে নির্দেশ করে। ভার্চুয়াল মেথড ডিসপ্যাচ টেবিল (V-Table), ইন্টারফেস টেবিল এবং টাইপ মেটাডাটা এখানে থাকে।</li>
</ol>
<p><strong>মিনিমাম সাইজ ও প্যাডিং:</strong> 64-bit CLR এ একটি খালি অবজেক্টের সাইজও ন্যূনতম <strong>২৪ বাইট</strong> (16 বাইট হেডার + 8 বাইট মিনিমাম অ্যালোকেশন অ্যালাইনমেন্ট)। ফিল্ডগুলো মেমোরিতে 8-বাইট বাউন্ডারিতে অ্যালাইন করা হয় (Memory Padding)।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Unsafe & Low-Level C#',
    q: '২২. ref struct, scoped ref এবং Unsafe ক্লাসের pointer arithmetic দিয়ে কীভাবে সাব-মাইক্রোসেকেন্ড পারফরম্যান্স অর্জন করবেন?',
    a: `<p><code>ref struct</code> কম্পাইলার লেভেলে গ্যারান্টি দেয় যে অবজেক্টটি কখনোই হিপে যাবে না (বক্সিং নিষিদ্ধ, ক্লাসের ফিল্ড হতে পারবে না, ল্যাম্বডায় ক্যাপচার করা যাবে না)।</p>
<p><strong>C# 11+ scoped ref:</strong> নিশ্চিত করে যে কোনো রেফারেন্স পয়েন্টার যেন মেথডের স্কোপের বাইরে স্ট্যাক থেকে এস্কেপ না করে (Life-time safety)।</p>
<p><strong>Unsafe Class:</strong> উচ্চগতির ডেটা পার্সিংয়ে অ্যারে বাউন্ডস চেকিং (Bounds Checking) বাইপাস করতে <code>Unsafe.AddByteOffset</code> এবং <code>Unsafe.As</code> ব্যবহার করা হয়:</p>
<pre><code>ref byte start = ref MemoryMarshal.GetReference(span);
ref byte current = ref Unsafe.Add(ref start, offset); // কোনো বাউন্ড চেক ছাড়াই সরাসরি মেমোরি পয়েন্টার জাম্প</code></pre>
<p>এটি নেটওয়ার্ক প্যাকেট পার্সার ও হাই-ফ্রিকোয়েন্সি ট্রেডিং ইঞ্জিনে প্রতি অপারেশনে ন্যানোসেকেন্ড সময় বাঁচায়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'LOH Fragmentation',
    q: '২৩. LOH (Large Object Heap) ফ্র্যাগমেন্টেশন কেন ঘটে? RecyclableMemoryStream এবং ArrayPool কীভাবে ওএমএম (OOM) ঠেকায়?',
    a: `<p><strong>LOH ফ্র্যাগমেন্টেশন:</strong> ৮৫,০০০ বাইটের বেশি অবজেক্ট (যেমন বড় JSON বা মেমোরি স্ট্রিম বাফার) LOH-এ যায়। পারফরম্যান্স বাঁচাতে GC সাধারণত LOH কম্প্যাক্ট করে না। বিভিন্ন আকারের বড় অবজেক্ট তৈরি ও ডিলিট হতে থাকলে মেমোরিতে ছোট ছোট ছিদ্র (Free holes) তৈরি হয়। সার্ভারে পর্যাপ্ত ফ্রি মেমোরি থাকা সত্ত্বেও কোনো কন্টিনিউয়াস বড় ব্লক না পাওয়ায় <code>OutOfMemoryException</code> ঘটে।</p>
<p><strong>সমাধান:</strong></p>
<ul>
    <li>কখনোই <code>new MemoryStream()</code> দিয়ে বড় ফাইল লোড করবেন না। Microsoft এর <strong><code>Microsoft.IO.RecyclableMemoryStream</code></strong> ব্যবহার করবেন—যা ছোট ছোট পুলড বাফার চেইন করে বড় স্ট্রিম তৈরি করে, ফলে LOH-এ কোনো অবজেক্টই যায় না।</li>
    <li><code>ArrayPool&lt;T&gt;.Shared.Rent()</code> দিয়ে বাফার রিইউজ করবেন।</li>
    <li>জরুরি ক্ষেত্রে <code>GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;</code> দিয়ে পরবর্তী ফুল GC-তে একবার LOH কম্প্যাক্ট করানো যায়।</li>
</ul>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Concurrency Primitives',
    q: '২৪. lock (Monitor), SpinLock, SemaphoreSlim, ReaderWriterLockSlim এবং Interlocked এর সুনির্দিষ্ট ট্রেড-অফ কী?',
    a: `<table class="table table-bordered table-sm">
    <thead>
        <tr><th>লক টাইপ</th><th>ব্লকিং মেকানিজম</th><th>ব্যবহার ক্ষেত্র</th></tr>
    </thead>
    <tbody>
        <tr><td><strong>Interlocked</strong></td><td>লক-ফ্রি (Hardware CPU Atomics)</td><td>কাউন্টার ইনক্রিমেন্ট, স্টেট ফ্ল্যাগ (CompareExchange) - ন্যানোসেকেন্ড গতি।</td></tr>
        <tr><td><strong>lock (Monitor)</strong></td><td>অপারেটিং সিস্টেম কার্নেল থ্রেড স্লিপ</td><td>সাধারণ সিঙ্ক্রোনাস ক্রিটিক্যাল সেকশন।</td></tr>
        <tr><td><strong>SpinLock</strong></td><td>CPU লুপে স্পিন করে (No OS Context Switch)</td><td>অত্যন্ত ক্ষুদ্র সময় (&lt; ১ মাইক্রোসেকেন্ড) লকিং হলে কার্নেল ট্রানজিশন এড়াতে।</td></tr>
        <tr><td><strong>SemaphoreSlim</strong></td><td>অ্যাসিনক্রোনাস ওয়েট (<code>await WaitAsync()</code>)</td><td>Async কোডে এবং একই সাথে N-সংখ্যক থ্রেড থ্রটলিং (Resource Pool)।</td></tr>
        <tr><td><strong>ReaderWriterLockSlim</strong></td><td>মাল্টি-রিডার, সিঙ্গেল-রাইটার</td><td>যেখানে ৯৯% রিড এবং ১% রাইট অপারেশন হয় (ইন-মেমোরি ক্যাশ)।</td></tr>
    </tbody>
</table>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'High Throughput Channels',
    q: '২৫. System.Threading.Channels কী এবং BlockingCollection বা কাফকা কনজিউমারে এটি কেন সেরা?',
    a: `<p><code>System.Threading.Channels</code> হলো ডটনেটের আধুনিক হাই-পারফরম্যান্স <strong>Producer-Consumer Queue</strong>।</p>
<p><strong>কেন BlockingCollection এর চেয়ে সেরা?</strong></p>
<ul>
    <li><code>BlockingCollection</code> সিনক্রোনাস থ্রেড ব্লক করে (Thread sleep)। আর <code>Channel</code> সম্পূর্ণ <strong>Asynchronous</strong> (<code>await channel.Reader.ReadAsync()</code> এবং <code>await channel.Writer.WriteAsync()</code>), ফলে থ্রেডপুলের কোনো থ্রেড অপচয় হয় না।</li>
    <li><strong>Backpressure:</strong> <code>BoundedChannel</code> তৈরি করে সর্বোচ্চ ধারণক্ষমতা (যেমন ৫,০০০ আইটেম) নির্ধারণ করা যায়। বাফার ফুল হলে প্রোডিউসার পজ হয়ে যায়, ফলে মেমোরি লিক হওয়া বন্ধ হয়।</li>
    <li><code>SingleReader = true</code> এবং <code>SingleWriter = true</code> ফ্ল্যাগ দিলে এটি লক ও কনটেনশন সম্পূর্ণ বাইপাস করে মেমোরি বাফারে বিদ্যুৎগতিতে ডাটা পাইপ করে।</li>
</ul>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Async Context Leak',
    q: '২৬. AsyncLocal<T> বনাম ThreadLocal<T>: ExecutionContext ফ্লো কীভাবে কাজ করে এবং মেমোরি লিক এড়াবেন কীভাবে?',
    a: `<p><strong>ThreadLocal&lt;T&gt;:</strong> শুধুমাত্র একটি ফিজিক্যাল থ্রেডের সাথে স্টেট বাইন্ড করে। <code>await</code> মেথডে থ্রেডপুল থ্রেড পরিবর্তন হলে মান হারিয়ে যায়।</p>
<p><strong>AsyncLocal&lt;T&gt;:</strong> .NET-এর <strong>ExecutionContext</strong>-এর সাথে যুক্ত থাকে। যখন মেথড <code>await</code> করে অন্য থ্রেডে জাম্প করে, CLR স্বয়ংক্রিয়ভাবে পূর্বের কনটেক্সট কপি করে নতুন থ্রেডে ফ্লো করায়। <em>ব্যবহার:</em> ডিস্ট্রিবিউটেড ট্রেসিংয়ে CorrelationId বা কারেন্ট টেন্যান্ট আইডি সংরক্ষণ।</p>
<p><strong>মেমোরি লিক ফাঁদ:</strong> <code>AsyncLocal</code> হলো <strong>Copy-on-Write</strong>। যদি কোনো বড় অবজেক্ট বা ইভেন্ট হ্যান্ডলার AsyncLocal-এ রাখা হয়, চাইল্ড টাস্কের প্রতিটি শাখায় অবজেক্টের রেফারেন্স ছড়িয়ে পড়ে এবং দীর্ঘস্থায়ী ব্যাকগ্রাউন্ড টাস্কে মেমোরি লিক তৈরি করে। সর্বদা প্রিমিটিভ বা লাইটওয়েট ইমিউটেবল আইডি রাখা উচিত।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Hardware Acceleration',
    q: '২৭. SIMD (Single Instruction Multiple Data) এবং Hardware Intrinsics দিয়ে C# এ কীভাবে কোটি কোটি ডেটা প্রসেস করবেন?',
    a: `<p>সাধারণ কোডে CPU একটি ইন্সট্রাকশনে একটি মাত্র সংখ্যার যোগ/গুণ করে (SISD)।</p>
<p><strong>SIMD (Vectorization):</strong> আধুনিক CPU-এর বিশেষ রেজিস্টার (AVX2, AVX-512, ARM NEON) ব্যবহার করে একটি একক ক্লক সাইকেলে একই সাথে ৪টি, ৮টি বা ১৬টি সংখ্যার উপর সমান্তরাল গাণিতিক অপারেশন চালায়:</p>
<pre><code>// ৮টি float সংখ্যা এক নিমিষে প্যারালাল যোগ
Vector256&lt;float&gt; v1 = Vector256.Create(array1, i);
Vector256&lt;float&gt; v2 = Vector256.Create(array2, i);
Vector256&lt;float&gt; result = Vector256.Add(v1, v2);</code></pre>
<p>.NET 8/9 এ <code>Vector&lt;T&gt;</code> হার্ডওয়্যার সাপোর্ট শনাক্ত করে নিজে থেকেই ভেক্টরাইজড কোড জেনারেট করে, যা সাধারণ লুপের চেয়ে ৮ থেকে ১৬ গুণ বেশি দ্রুত সম্পন্ন হয়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Async Memory Optimization',
    q: '২৮. Task বনাম ValueTask: কখন ValueTask ব্যবহার করবেন এবং এর Double-Await বিপদ কী?',
    a: `<p><code>Task</code> একটি Reference Type। প্রতিবার <code>Task</code> রিটার্ন করলে হিপে অবজেক্ট অ্যালোকেশন হয়। যদি কোনো মেথড ৯৫% ক্ষেত্রে সিঙ্ক্রোনাসলি ক্যাশ থেকে ডাটা ফেরত দিতে পারে (যেমন: <code>if (cache.TryGetValue(key, out var val)) return val;</code>), তবে সেখানে <code>ValueTask&lt;T&gt;</code> ব্যবহার করলে ০ হিপ অ্যালোকেশন ঘটে।</p>
<p><strong>মারাত্মক বিপদ (Double-Await Hazard):</strong></p>
<ul>
    <li><code>ValueTask</code> হলো একটি <code>struct</code> যা ইন্টারনালি পুনরায় ব্যবহারযোগ্য বাফার (<code>IValueTaskSource</code>) পুল করতে পারে।</li>
    <li>একটি <code>ValueTask</code>-কে <strong>কখনোই দুবার <code>await</code> করা যাবে না</strong> অথবা সমান্তরালে <code>Task.WhenAll</code>-এ সরাসরি দেওয়া যাবে না। এতে রেস কন্ডিশন ও অপ্রত্যাশিত ক্র্যাশ ঘটে। প্রয়োজনে <code>valTask.AsTask()</code> করে নিতে হয়।</li>
</ul>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Modern C# Semantics',
    q: '২৯. C# Records: record class বনাম record struct এর পার্থক্য কী? with এক্সপ্রেশন আন্ডার দ্য হুড কীভাবে কাজ করে?',
    a: `<p><strong>Records:</strong> C# 9+ এর ফিচার যা ইমিউটেবল ডেটা মডেলিং এবং <strong>Value-based Equality</strong> প্রদান করে (উভয় অবজেক্টের ফিল্ড মান সমান হলে তারা <code>Equals</code> হিসেবে গণ্য হয়)।</p>
<ul>
    <li><code>record class</code>: হিপে রেফারেন্স টাইপ হিসেবে থাকে।</li>
    <li><code>record struct</code>: স্ট্যাকে ভ্যালু টাইপ হিসেবে থাকে (জিরো হিপ অ্যালোকেশন)।</li>
</ul>
<p><strong>with Expression (Non-destructive Mutation):</strong></p>
<pre><code>var updated = original with { Status = "Completed" };</code></pre>
<p>আন্ডার দ্য হুড কম্পাইলার একটি স্পেশাল <strong>Clone Constructor</strong> কল করে মূল অবজেক্টের সমস্ত ফিল্ড হুবহু শ্যালো কপি করে এবং শুধুমাত্র স্পেসিফাইড ফিল্ডটিকে নতুন মান দিয়ে প্রতিস্থাপন করে ব্র্যান্ড নিউ ইন্সট্যান্স রিটার্ন করে।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Metaprogramming & Roslyn',
    q: '৩০. Expression Trees এবং Roslyn Source Generators কীভাবে রানটাইম রিফ্লেকশন ওভারহেড দূর করে?',
    a: `<p><strong>Expression Trees:</strong> কোডকে ডেটা হিসেবে উপস্থাপন করে। LINQ Provider (যেমন EF Core) এই ট্রি পার্স করে রানটাইমে SQL কোয়েরি তৈরি করে। অথবা <code>Expression.Lambda&lt;Func&lt;T&gt;&gt;().Compile()</code> দিয়ে রানটাইমে ডায়নামিক IL মেথড জেনারেট করে ক্লাসিক রিফ্লেকশনের চেয়ে ১০০ গুণ দ্রুত ডেটা ম্যাপিং করা যায়।</p>
<p><strong>C# Source Generators (.NET 8/9):</strong> মেটাপ্রোগ্রামিংয়ের চূড়ান্ত বিপ্লব। কোড কম্পাইল করার সময় Roslyn কম্পাইলার আপনার কোড স্ক্যান করে স্বয়ংক্রিয়ভাবে অতিরিক্ত সি-শার্প কোড লিখে একই অ্যাসেম্বলিতে কম্পাইল করে দেয়। ফলে JSON সিরিয়ালাইজেশন, DTO ম্যাপিং বা DI রেজিস্ট্রেশনের জন্য কোনো রানটাইম রিফ্লেকশন লাগে না এবং Native AOT ১০০% সমর্থিত হয়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Production Diagnostics',
    q: '৩১. dotnet-dump এবং SOS দিয়ে লাইভ সার্ভারে Finalizer Queue ব্লকিং কীভাবে ডিবাগ করবেন?',
    a: `<p>যদি কোনো ডেভেলপার ক্লাসে <code>~MyClass()</code> ফাইনলাইজার লেখে কিন্তু সঠিকভাবে <code>GC.SuppressFinalize(this)</code> কল না করে, অবজেক্টগুলো সরাসরি গার্বেজ হয় না—প্রথমে <strong>Finalization Queue</strong> তে যায়।</p>
<p>ডটনেটে সমস্ত ফাইনলাইজার চালানোর জন্য মাত্র একটি <strong>একক Finalizer Thread</strong> থাকে। যদি কোনো একটি ফাইনলাইজারের ভেতর স্লিপ, ডেডলক বা ব্লকিং নেটওয়ার্ক কল থাকে, পুরো ফাইনলাইজার থ্রেড চিরতরে আটকে যায় এবং মেমোরিতে লক্ষ লক্ষ অবজেক্ট জমে অ্যাপ OOM ক্র্যাশ করে।</p>
<p><strong>SOS কমান্ড সিকোয়েন্স:</strong></p>
<ol>
    <li><code>dotnet-dump analyze dump.dmp</code></li>
    <li><code>!finalizequeue</code> &rarr; দেখতে পাবেন ফাইনলাইজেশন কিউতে লাখ লাখ অবজেক্ট জ্যাম লেগে আছে।</li>
    <li><code>!threads</code> দিয়ে ডেডিকেটেড Finalizer থ্রেডের আইডি খুঁজে নিন।</li>
    <li><code>~&lt;ThreadID&gt;s</code> দিয়ে ওই থ্রেডে সুইচ করে <code>!clrstack</code> দিলে ধরা পড়বে কোন অপদার্থ মেথড ফাইনলাইজারের ভেতর ব্লক হয়ে বসে আছে!</li>
</ol>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'CPU Profiling',
    q: '৩২. প্রোডাকশনে 100% CPU স্পাইকে JIT Stalls বনাম Thread Contention কীভাবে আলাদা করবেন?',
    a: `<p>সার্ভারে সিপিইউ ১০০% হলে দুটি সম্পূর্ণ ভিন্ন কারণে হতে পারে:</p>
<ol>
    <li><strong>High Thread Contention / SpinLock:</strong> থ্রেডগুলো কাজের বদলে লকের জন্য নিজেদের মধ্যে যুদ্ধ করছে এবং সিপিইউ সাইকেল অপচয় করছে।</li>
    <li><strong>Compute Loop / Regex Catastrophic Backtracking:</strong> সিপিইউ আসলেই ভারী কম্পিউটেশন বা ইনফিনিট লুপে ব্যস্ত।</li>
</ol>
<p><strong>শনাক্তকরণ:</strong> <code>dotnet-counters monitor --process-id &lt;PID&gt; System.Runtime</code> রান করুন। যদি <code>Lock Contention Rate / sec</code> অস্বাভাবিক বেশি থাকে, তবে সমস্যা লকিংয়ে। আর যদি <code>% Time in GC</code> ৫০% এর উপরে থাকে, তবে মেমোরি এলোকেশন প্রেসারের কারণে GC পুরো সিপিইউ দখল করে রেখেছে। <code>dotnet-trace</code> এর SpeedScope ফ্লেমগ্রাফে রুট-কজ মেথডটি স্ক্রিনে ভেসে উঠবে।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'High Performance Middleware',
    q: '৩৩. Conventional Middleware বনাম Factory-based (IMiddleware) এর মেমোরি ও লাইফটাইম পার্থক্য কী?',
    a: `<p><strong>Conventional Middleware:</strong> <code>RequestDelegate next</code> কনস্ট্রাক্টরে নেয়। এটি অ্যাপ্লিকেশন স্টার্টআপের সময় একবার তৈরি হয় (কার্যত <strong>Singleton</strong>)। এর <code>InvokeAsync(HttpContext context)</code> মেথডে প্রতি রিকোয়েস্টে কোনো নতুন অবজেক্ট তৈরি হয় না (Zero Allocation)। তবে এর কনস্ট্রাক্টরে সরাসরি Scoped সার্ভিস ইনজেক্ট করলে Captive Dependency তৈরি হয়।</p>
<p><strong>Factory-based (<code>IMiddleware</code>):</strong> <code>IMiddleware</code> ইন্টারফেস ইমপ্লিমেন্ট করে এবং IoC কন্টেইনারে <code>AddTransient&lt;MyMiddleware&gt;()</code> হিসেবে রেজিস্টার হয়। প্রতি রিকোয়েস্টে নতুন ইন্সট্যান্স তৈরি হয়, তাই কনস্ট্রাক্টরে নিরাপদে Scoped সার্ভিস (যেমন <code>DbContext</code>) ইনজেক্ট করা যায়। কিন্তু প্রতি রিকোয়েস্টে অবজেক্ট অ্যালোকেশন ওভারহেড থাকে।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Resilience & Throttling',
    q: '৩৪. .NET 8/9 এর বিল্ট-ইন Rate Limiting Middleware কীভাবে কনফিগার করবেন? ৪টি পলিসির পার্থক্য কী?',
    a: `<p>ASP.NET Core এখন <code>Microsoft.AspNetCore.RateLimiting</code> বিল্ট-ইন প্রদান করে:</p>
<ul>
    <li><strong>Fixed Window:</strong> নির্দিষ্ট সময় উইন্ডোতে (যেমন ১ মিনিটে ১০০ রিকোয়েস্ট) লিমিট করে। উইন্ডোর শেষে রিসেট হয় (বাউন্ডারি স্পাইক রিস্ক থাকে)।</li>
    <li><strong>Sliding Window:</strong> উইন্ডোটিকে ক্ষুদ্র সেগমেন্টে ভাগ করে চলমান স্লাইডিং রেট পর্যবেক্ষণ করে (স্পাইক মুক্ত মসৃণ লিমিটিং)।</li>
    <li><strong>Token Bucket:</strong> বালতিতে নির্দিষ্ট রেটে টোকেন জমা হয়। বাস্ট ট্রাফিক সামলাতে সেরা।</li>
    <li><strong>Concurrency Limiter:</strong> নির্দিষ্ট সময়ে এক সাথে কয়টি রিকোয়েস্ট প্রসেস হতে পারবে তা নিয়ন্ত্রণ করে (যেমন ডাটাবেজ ওভারলোড রোধে সর্বোচ্চ ২০টি সমান্তরাল রিকোয়েস্ট)।</li>
</ul>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Microservices Observability',
    q: '৩৫. ASP.NET Core Health Checks: Liveness, Readiness এবং Startup Probe এর সুনির্দিষ্ট আর্কিটেকচার কী?',
    a: `<p>কুবারনেটিস বা লোড ব্যালেন্সারের নির্ভরযোগ্যতার জন্য ৩টি পৃথক এন্ডপয়েন্ট ডিজাইন করতে হয়:</p>
<ol>
    <li><strong>Startup Probe (<code>/health/startup</code>):</strong> অ্যাপ্লিকেশনের হেভি ওয়ার্ম-আপ, ক্যাশ প্রি-লোড বা ডাটাবেজ মাইগ্রেশন শেষ হয়েছে কি না। শেষ না হওয়া পর্যন্ত ট্রাফিক আসবে না।</li>
    <li><strong>Liveness Probe (<code>/health/live</code>):</strong> প্রসেসটি জীবিত আছে কি না (Ping check)। এটি ফেল করলে কুবারনেটিস কন্টেইনারটিকে <strong>Kill করে রিস্টার্ট</strong> দেবে। এখানে কখনই ডাটাবেজ চেক রাখবেন না (ডাটাবেজ ডাউন থাকলে সমস্ত সুস্থ কন্টেইনার অপ্রয়োজনীয় রিস্টার্ট লুপে ধ্বংস হবে)।</li>
    <li><strong>Readiness Probe (<code>/health/ready</code>):</strong> অ্যাপ্লিকেশনের ডিপেনডেন্সি (Postgres DB, Redis, RabbitMQ) সাড়া দিচ্ছে কি না। ফেল করলে কুবারনেটিস সাময়িকভাবে ট্রাফিক পাঠানো বন্ধ রাখবে কিন্তু অ্যাপ কিল করবে না।</li>
</ol>`
  }
];
