const fs = require('fs');
const path = require('path');

const questions = [
  // ==========================================
  // TOPIC 1: C# & .NET CORE / .NET 8 / 9
  // ==========================================
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
    a: `<p><strong>const (কম্পাইল-টাইম কনস্ট্যান্ট):</strong></p>
<ul>
    <li>ভ্যালু অবশ্যই ডিক্লেয়ার করার সময়ই দিতে হয়।</li>
    <li>কম্পাইলার কোড বিল্ড করার সময় ভ্যারিয়েবলের নামের জায়গায় সরাসরি লিটারেল ভ্যালু ইনলাইন (hardcode) করে দেয়।</li>
    <li>এটি সর্বদা ইমপ্লিসিটলি <code>static</code>।</li>
</ul>
<p><strong>readonly (রান-টাইম কনস্ট্যান্ট):</strong></p>
<ul>
    <li>ডিক্লেয়ারেশনের সময় অথবা ক্লাসের <strong>কনস্ট্রাক্টরের (Constructor) ভেতর</strong> ভ্যালু অ্যাসাইন করা যায়।</li>
    <li>রানটাইমে কনফিগারেশন বা ক্যালকুলেশনের উপর ভিত্তি করে প্রতি ইন্সট্যান্সে ভিন্ন ভ্যালু নিতে পারে।</li>
    <li>কনস্ট্রাক্টর এক্সিকিউট হওয়ার পর এর ভ্যালু আর পরিবর্তন করা যায় না।</li>
</ul>
<p><em>ইন্টারভিউ টিপ:</em> যদি কোনো রেফারেন্স টাইপকে কনস্ট্যান্ট রাখতে হয় বা কোনো কনফিগারেশন ভ্যালু রানটাইমে লোড করতে হয়, তবে সর্বদা <code>readonly</code> ব্যবহার করতে হয়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'junior',
    badge: 'Exception Handling',
    q: '৭. C# এ throw বনাম throw ex এর পার্থক্য কী? কেন throw ex প্রোডাকশনে মারাত্মক ভুল?',
    a: `<p>যখন <code>try-catch</code> ব্লকে কোনো এক্সেপশন রিব্লিঙ্ক বা রি-থ্রো করা হয়:</p>
<pre><code>try {
    // কিছু কোড যা এরর তৈরি করে
} catch (Exception ex) {
    throw;    // সঠিক পদ্ধতি: অরিজিনাল Stack Trace সম্পূর্ণ অক্ষত থাকে
}</code></pre>
<p><strong>মারাত্মক পার্থক্য:</strong></p>
<ul>
    <li><code>throw;</code>: মূল যে ফাইলে এবং যে লাইনে এররটি ঘটেছিল, তার সম্পূর্ণ <strong>Call Stack Trace অক্ষত থাকে</strong>। প্রোডাকশন লগে সঠিক রুট-কজ খুঁজে পাওয়া যায়।</li>
    <li><code>throw ex;</code>: এটি মূল স্ট্যাক ট্রেস <strong>মুছে ফেলে</strong> এবং রি-থ্রো করার লাইনটিকে নতুন সোর্স হিসেবে সেট করে। ফলে আসল কোন মেথডে বাগ ছিল তা চিরতরে হারিয়ে যায়।</li>
</ul>`
  },
  {
    topic: 'dotnet',
    level: 'mid',
    badge: 'ASP.NET Core DI',
    q: '৮. Dependency Injection এ Transient, Scoped এবং Singleton এর সুনির্দিষ্ট ব্যবহার ক্ষেত্র কী?',
    a: `<p>ASP.NET Core এর বিল্ট-ইন IoC কন্টেইনারে ৩ ধরণের সার্ভিস লাইফটাইম আছে:</p>
<ol>
    <li><strong>Transient (<code>AddTransient</code>):</strong> প্রতিবার সার্ভিসের জন্য রিকোয়েস্ট করলেই একটি ব্র্যান্ড নিউ ইন্সট্যান্স তৈরি হয়। লাইটওয়েট এবং স্টেটলেস সার্ভিসের জন্য আদর্শ (যেমন: ইউটিলিটি, ভ্যালিডেটর, ফরম্যাটার)।</li>
    <li><strong>Scoped (<code>AddScoped</code>):</strong> প্রতিটি একক HTTP Request-এর জন্য একটি মাত্র ইন্সট্যান্স তৈরি হয়। পুরো রিকোয়েস্ট লাইফসাইকেলে যত জায়গায় ইনজেক্ট করা হোক, তারা একই অবজেক্ট শেয়ার করবে। রিকোয়েস্ট শেষ হলে এটি স্বয়ংক্রিয়ভাবে ডিসপোজ হয়। <code>DbContext</code> এবং বিজনেস সার্ভিসগুলোর জন্য এটি সর্বোত্তম।</li>
    <li><strong>Singleton (<code>AddSingleton</code>):</strong> অ্যাপ্লিকেশন স্টার্ট হওয়ার পর প্রথম রিকোয়েস্টে একবার তৈরি হয় এবং অ্যাপ বন্ধ না হওয়া পর্যন্ত জীবিত থাকে। ইন-মেমোরি ক্যাশ, কনফিগারেশন ম্যানেজার বা সিঙ্গেল ইনস্ট্যান্স ক্লায়েন্টের (যেমন HttpClientFactory বা RedisConnectionMultiplexer) জন্য প্রযোজ্য। এটি থ্রেড-সেফ হতে হবে।</li>
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
<p><strong>SynchronizationContext ও ConfigureAwait(false):</strong></p>
<ul>
    <li>বাই-ডিফল্ট <code>await</code> টাস্ক শেষ হওয়ার পর মূল <code>SynchronizationContext</code>-এ ফিরে আসার চেষ্টা করে। ডেস্কটপ (WPF/WinForms) বা লেগাসি ASP.NET এ এটি মূল UI বা রিকোয়েস্ট থ্রেডে কনটেক্সট ক্যাপচার করে।</li>
    <li><code>ConfigureAwait(false)</code> বলে দেয়: "আমার মূল কনটেক্সটে ফেরার দরকার নেই, থ্রেডপুলের যেকোনো মুক্ত থ্রেডে বাকি কাজ শেষ করো।"</li>
    <li>লাইব্রেরি বা ক্লাস লাইব্রেরি প্রজেক্টে ডেডলক এড়াতে এবং পারফরম্যান্স বাড়াতে সর্বদা <code>ConfigureAwait(false)</code> ব্যবহার করতে হয়। আধুনিক ASP.NET Core-এ নিজস্ব SynchronizationContext নেই, তবুও লাইব্রেরিতে এটি ব্যবহার করা সেরা স্ট্যান্ডার্ড।</li>
</ul>`
  },
  {
    topic: 'dotnet',
    level: 'mid',
    badge: 'EF Core Optimization',
    q: '১১. EF Core এ AsNoTracking, Split Queries এবং N+1 কুয়েরি প্রবলেম কীভাবে সমাধান করবেন?',
    a: `<p><strong>১. AsNoTracking:</strong> বাই-ডিফল্ট EF Core ডাটাবেজ থেকে ডাটা পড়ার সময় <strong>Change Tracker</strong>-এ অবজেক্টের স্ন্যাপশট রাখে যাতে <code>SaveChanges</code> দিলে আপডেট ট্র্যাক করা যায়। রিড-অনলি এপিআই বা গ্রিড ডিসপ্লেতে <code>.AsNoTracking()</code> ব্যবহার করলে চেঞ্জ ট্র্যাকিং বাইপাস হয়, যা মেমোরি খরচ প্রায় ৪০% কমিয়ে দেয় এবং কুয়েরি দ্রুততর করে।</p>
<p><strong>২. N+1 Problem:</strong> যদি প্যারেন্ট টেবিল পড়ার পর লুপের ভেতর চাইল্ড টেবিলের প্রোপার্টি রিড করা হয়, তবে প্যারেন্টের জন্য ১টি এবং প্রতি চাইল্ডের জন্য N-সংখ্যক কুয়েরি ফায়ার হয়।<br>
<em>সমাধান:</em> <code>.Include(x => x.Orders)</code> দিয়ে <strong>Eager Loading</strong> করতে হবে।</p>
<p><strong>৩. Split Queries (AsSplitQuery):</strong> যখন একাধিক চাইল্ড কালেকশন <code>Include</code> করা হয় (যেমন: Customer -> Orders -> OrderItems), তখন সিঙ্গেল SQL কুয়েরিতে <strong>Cartesian Product (কার্টেসিয়ান গুণফল)</strong> তৈরি হয়ে মেমোরিতে লক্ষ লক্ষ ডুপ্লিকেট রো জেনারেট হয়।<br>
<em>সমাধান:</em> <code>.AsSplitQuery()</code> লিখলে EF Core একাধিক অপ্টিমাইজড সমান্তরাল SQL কুয়েরি চালিয়ে মেমোরিতে ডাটা জোড়া দেয়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'mid',
    badge: 'ASP.NET Core Architecture',
    q: '১২. ASP.NET Core Middleware Pipeline এবং Action Filters এর মধ্যে পার্থক্য কী? এক্সিকিউশন অর্ডার কীভাবে নিয়ন্ত্রিত হয়?',
    a: `<p><strong>Middleware:</strong></p>
<ul>
    <li>HTTP রিকোয়েস্ট পাইপলাইনের সর্বনিম্ন স্তরে কাজ করে। <code>HttpContext</code> রিসিভ করে এবং পরবর্তী মিডলওয়্যারে পাস করে (<code>next()</code>) অথবা শর্ট-সার্কিট করে রেসপন্স ফেরত দেয়।</li>
    <li>এটি সম্পূর্ণ ফ্রেমওয়ার্ক-অ্যাগনস্টিক। MVC বা API কন্ট্রোলারে ঢোকার অনেক আগেই (যেমন Routing, CORS, Authentication, Response Compression) মিডলওয়্যার কাজ করে।</li>
    <li><code>Program.cs</code>-এ যেভাবে কোড লেখা হয় ঠিক সেই ক্রমেই (Order of Registration) এক্সিকিউট হয়।</li>
</ul>
<p><strong>Action Filters:</strong></p>
<ul>
    <li>এটি ASP.NET Core MVC/API সাব-সিস্টেমের অংশ। রাউটিং শেষ হওয়ার পর কন্ট্রোলার অ্যাকশন মেথড এক্সিকিউট হওয়ার ঠিক আগে ও পরে রান করে।</li>
    <li>এর কাছে <code>ActionContext</code>, অ্যাকশন মেথডের প্যারামিটার, এবং <code>ModelState</code> থাকে।</li>
    <li>ব্যবহার: অ্যাকশন-লেভেল মডেল ভ্যালিডেশন, ট্রানজ্যাকশন হ্যান্ডলিং, কাস্টম ক্যাশিং।</li>
</ul>`
  },
  {
    topic: 'dotnet',
    level: 'mid',
    badge: 'LINQ Deep-Dive',
    q: '১৩. LINQ এ Select এবং SelectMany এর পার্থক্য কী? Deferred Execution এর সুবিধা কী?',
    a: `<p><strong>Select (১-টু-১ ম্যাপিং):</strong> ইনপুট কালেকশনের প্রতিটি এলিমেন্টকে অন্য একটি অবজেক্টে প্রজেক্ট করে। আউটপুটের দৈর্ঘ্য ইনপুটের সমান থাকে।</p>
<p><strong>SelectMany (১-টু-অনেস্ট ফ্ল্যাটেনিং):</strong> যখন প্রতিটি এলিমেন্টের ভেতর নিজস্ব একটি চাইল্ড কালেকশন বা লিস্ট থাকে (যেমন <code>List&lt;Department&gt;</code> এর ভেতর <code>List&lt;Employee&gt;</code>), <code>SelectMany</code> সেই চাইল্ড লিস্টগুলোকে একত্রিত করে একটি সিঙ্গেল ফ্ল্যাট সিকোয়েন্সে (<code>IEnumerable&lt;Employee&gt;</code>) রূপান্তর করে।</p>
<p><strong>Deferred Execution এর সুবিধা:</strong> কুয়েরি কম্পোজ করার সাথে সাথে ডাটা লোড হয় না। ফলে আপনি ডায়নামিকালি একাধিক <code>Where</code> ফিল্টার ও পেজিং (<code>Skip/Take</code>) চেইন করতে পারেন। ডাটাবেজে শুধুমাত্র ফাইনাল অপ্টিমাইজড কুয়েরিটিই এক্সিকিউট হয়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'CLR & Threading',
    q: '১৪. ThreadPool Starvation কী? প্রোডাকশনে কীভাবে ডিবাগ করবেন এবং কেন এটি ক্যাটাস্ট্রফিক?',
    a: `<p><strong>ThreadPool Starvation</strong> ঘটে যখন অ্যাসিনক্রোনাস কোডকে সিনক্রোনাসলি কল করা হয় (Sync-Over-Async যেমন <code>task.Result</code> বা <code>task.Wait()</code>)। উচ্চ ট্রাফিকের সময় শত শত ইনকামিং রিকোয়েস্ট থ্রেডপুলের ওয়ার্কার থ্রেডগুলোকে ব্লক করে বসে থাকে।</p>
<p>ডটনেট থ্রেডপুল তাৎক্ষণিকভাবে থ্রেড তৈরি করতে পারে না; এটি <strong>Hill-Climbing Algorithm</strong> অনুযায়ী প্রতি সেকেন্ডে মাত্র ১-২টি থ্রেড বাড়াতে পারে। ফলে সার্ভারের সিপিইউ ইউসেজ মাত্র ৫%-১০% থাকা সত্ত্বেও সমস্ত ইনকামিং এপিআই কল কিউতে আটকে টাইমআউট (HTTP 503) হতে থাকে।</p>
<p><strong>ডিবাগিং ও ফিক্স:</strong></p>
<ul>
    <li>প্রোডাকশনে অ্যাপ ক্র্যাশ না করে <code>dotnet-dump collect -p &lt;PID&gt;</code> দিয়ে মেমোরি ডাম্প নিন।</li>
    <li><code>dotnet-dump analyze</code> এ <code>!threads</code> কমান্ড দিলে দেখা যাবে শত শত থ্রেড <code>Task.Wait</code> বা <code>Monitor.Wait</code>-এ আটকে আছে।</li>
    <li><strong>সমাধান:</strong> সম্পূর্ণ কোডবেস "Async All The Way" হতে হবে। কন্ট্রোলার থেকে শুরু করে ডাটাবেজ রিপোজিটরি পর্যন্ত কোথাও <code>.Result</code> বা <code>.GetAwaiter().GetResult()</code> রাখা যাবে না।</li>
</ul>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'High Performance C#',
    q: '১৫. Span<T> এবং Memory<T> এর মধ্যে পার্থক্য কী? Span কেন async মেথডে ব্যবহার করা যায় না?',
    a: `<p><code>Span&lt;T&gt;</code> হলো একটি <code>ref struct</code> যা মেমোরির যেকোনো কন্টিনিউয়াস ব্লকের (Stack, Heap, Native Unmanaged Memory) উপর একটি লাইটওয়েট উইন্ডো তৈরি করে কোনো মেমোরি এলোকেশন ও কপি ছাড়াই স্লাইসিং করতে দেয় (Zero Allocation)।</p>
<p><strong>কেন async মেথডে Span ব্যবহার করা যায় না?</strong></p>
<ul>
    <li>টাইপ সেফটির কারণে CLR নিশ্চিত করে যে <code>ref struct</code> কখনো ম্যানেজড হিপে যেতে পারবে না—শুধুমাত্র স্ট্যাকে থাকবে।</li>
    <li>অ্যাসিনক্রোনাস মেথডে (<code>async/await</code>) মেথড সাসপেন্ড হওয়ার সময় স্টেট ধরে রাখার জন্য কম্পাইলার সমস্ত লোকাল ভ্যারিয়েবলকে হিপ মেমোরিতে একটি স্টেট মেশিন ক্লাসের ফিল্ডে রূপান্তর করে।</li>
    <li>যেহেতু হিপে <code>ref struct</code> রাখা অবৈধ, তাই কম্পাইলার <code>await</code> বাউন্ডারিতে <code>Span&lt;T&gt;</code> ব্যবহার করতে দেয় না।</li>
</ul>
<p><strong>Memory&lt;T&gt; এর ভূমিকা:</strong> <code>Memory&lt;T&gt;</code> সাধারণ <code>struct</code> (ref struct নয়), তাই এটি হিপে থাকতে পারে এবং async মেথডে নিরাপদে পাস করা যায়। পরবর্তীতে সিঙ্ক্রোনাস প্রসেসিং করার সময় <code>memory.Span</code> প্রোপার্টি কল করে জিরো-অ্যালোকেশন সুবিধা নেওয়া হয়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'CLR Internals',
    q: '১৬. .NET Garbage Collector Internals: Gen 0, 1, 2, LOH এবং POH এর মেকানিক্স ব্যাখ্যা করুন।',
    a: `<p>.NET GC হলো একটি Generational Tracing Garbage Collector। এটি মেমোরিকে কয়েকটি ভাগে পরিচালনা করে:</p>
<ul>
    <li><strong>Generation 0 (Gen 0):</strong> স্বল্পস্থায়ী অবজেক্ট (Short-lived)। নতুন তৈরি সমস্ত অবজেক্ট এখানে যায়। কালেকশন অত্যন্ত দ্রুত (মাইক্রোসেকেন্ডে)। বেঁচে যাওয়া অবজেক্টগুলো Gen 1 এ প্রমোট হয়।</li>
    <li><strong>Generation 1 (Gen 1):</strong> বাফার জোন। Gen 0 এবং Gen 2 এর মধ্যে ট্রানজিশন স্তর।</li>
    <li><strong>Generation 2 (Gen 2):</strong> দীর্ঘস্থায়ী অবজেক্ট (Long-lived, যেমন Singleton, Static Cache)। Gen 2 কালেকশনকে <strong>Full GC</strong> বলে, যা তুলনামূলক ব্যয়বহুল।</li>
    <li><strong>LOH (Large Object Heap):</strong> ৮৫,০০০ বাইট (৮৫ KB) বা তার বড় অবজেক্ট সরাসরি LOH-এ জমা হয়। এটি সাধারণত কম্প্যাক্ট করা হয় না (মেমোরি কপি অনেক ব্যয়বহুল হওয়ায়), ফলে এটি ফ্র্যাগমেন্টেড হতে পারে।</li>
    <li><strong>POH (Pinned Object Heap - .NET 5+):</strong> যে অবজেক্টগুলোকে মেমোরিতে নির্দিষ্ট ঠিকানায় পিন করে রাখতে হয় (Unmanaged C++ ইন্টারপ বা সকেট I/O বাফার), সেগুলো এখানে থাকে যাতে অন্যান্য হিপ কম্প্যাক্ট হতে বাধা না পায়।</li>
</ul>
<p><strong>সার্ভার মোড:</strong> ASP.NET Core প্রোডাকশনে সর্বদা <code>Server GC</code> ব্যবহার করা হয়, যেখানে প্রতিটি CPU কোর বা প্রসেসরের জন্য একটি স্বাধীন হিপ ও ডেডিকেটেড থ্রেড থাকে।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'ASP.NET Core Architecture',
    q: '১৭. Captive Dependency কী? কীভাবে এটি মেমোরি লিক ও কনকারেন্সি ক্র্যাশ তৈরি করে?',
    a: `<p><strong>Captive Dependency</strong> ঘটে যখন দীর্ঘস্থায়ী কোনো সার্ভিস (যেমন: <strong>Singleton</strong>) তার ভেতর কম লাইফটাইমের কোনো সার্ভিসকে (যেমন: <strong>Scoped</strong>) কনস্ট্রাক্টরে ইনজেক্ট করে ধরে রাখে।</p>
<p>যেহেতু Singleton অ্যাপ্লিকেশন লাইফটাইমে একবার তৈরি হয়ে চিরকাল বেঁচে থাকে, তাই এর ভেতর ইনজেক্ট হওয়া Scoped সার্ভিসটিও (যেমন: <code>DbContext</code>) আর কখনো ডিসপোজ হতে পারে না—চিরকালের জন্য ক্যাপটিভ (বন্দী) হয়ে যায়।</p>
<p><strong>ভয়ংকর পরিণতি:</strong></p>
<ol>
    <li><code>DbContext</code> থ্রেড-সেফ নয়। একাধিক সমান্তরাল HTTP থ্রেড একই Singleton থেকে ক্যাপটিভ <code>DbContext</code> শেয়ার করায় <code>InvalidOperationException: A second operation was started on this context instance before a previous operation completed</code> এক্সেপশনে সার্ভার ক্র্যাশ করে।</li>
    <li>চেঞ্জ ট্র্যাকারের অবজেক্টগুলো মেমোরি থেকে কখনো রিলিজ হয় না, ফলে ভয়াবহ Memory Leak ঘটে।</li>
</ol>
<p><strong>প্রতিরোধ:</strong> <code>Program.cs</code>-এ <code>builder.Host.UseDefaultServiceProvider(o => o.ValidateScopes = true);</code> কনফিগার করলে অ্যাপ স্টার্টআপের সময়ই ক্যাপটিভ ডিপেনডেন্সি থাকলে এক্সেপশন থ্রো করে আটকে দেয়।</p>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'High Performance & AOT',
    q: '১৮. ArrayPool<T> এবং Native AOT এর বাস্তব সুবিধা ও চ্যালেঞ্জ কী কী?',
    a: `<p><strong>ArrayPool&lt;T&gt;:</strong> উচ্চ ট্রাফিকের সময় প্রতি রিকোয়েস্টে বড় বাইট অ্যারে (যেমন: ইমেজ প্রসেসিং বা নেটওয়ার্ক বাফার) তৈরি না করে মেমোরি পুল থেকে ধার নেওয়া হয়: <code>ArrayPool&lt;byte&gt;.Shared.Rent(4096)</code>। কাজ শেষে <code>Return(buffer)</code> করলে বাফারটি পুনরায় ব্যবহারযোগ্য হয়। এটি Gen 2 ও LOH-এ নতুন অ্যালোকেশন ১০০% রোধ করে।</p>
<p><strong>Native AOT (.NET 8/9):</strong> C# কোডকে সরাসরি টার্গেট ওএস-এর মেশিন কোডে কম্পাইল করে (কোনো JIT কম্পাইলার বা IL কোড রানটাইমে লাগে না)।</p>
<ul>
    <li><strong>সুবিধা:</strong> মিলিসেকেন্ডে ইনস্ট্যান্ট কোল্ড-স্টার্ট (Serverless / AWS Lambda-র জন্য আদর্শ), অতি ক্ষুদ্র মেমোরি ফুটপ্রিন্ট (মাত্র ১৫-২০ MB)।</li>
    <li><strong>চ্যালেঞ্জ:</strong> রানটাইম রিফ্লেকশন (Dynamic Code Generation / Emit) কাজ করে না। EF Core বা প্রাচীন JSON সিরিয়ালাইজারগুলোর ক্ষেত্রে সোর্স জেনারেটর (Source Generators) ব্যবহার করতে হয়।</li>
</ul>`
  },
  {
    topic: 'dotnet',
    level: 'senior',
    badge: 'Enterprise Architecture',
    q: '১৯. Clean Architecture এ CQRS এবং MediatR Pipeline Behaviors কেন ব্যবহার করবেন?',
    a: `<p><strong>CQRS (Command Query Responsibility Segregation):</strong> রিড (Query) এবং রাইট (Command) অপারেশনকে সম্পূর্ণ পৃথক করে দেয়। কমান্ড মডেলে থাকে ভ্যালিডেশন, বিজনেস রুলস ও ট্রানজ্যাকশন; আর কুয়েরি মডেলে ড্যাপার বা অপ্টিমাইজড EF Core দিয়ে সরাসরি ফাস্ট রিড করা যায়।</p>
<p><strong>MediatR Pipeline Behaviors:</strong> এটি ডটনেটে AOP (Aspect-Oriented Programming) ইমপ্লিমেন্ট করার চমৎকার উপায়। কন্ট্রোলার বা হ্যান্ডলারের ভেতর একই কোড বারবার না লিখে পাইপলাইনে Cross-Cutting Concerns হ্যান্ডেল করা হয়:</p>
<ol>
    <li><strong>ValidationBehavior:</strong> হ্যান্ডলারে ঢোকার আগেই FluentValidation দিয়ে মডেল চেক করে।</li>
    <li><strong>LoggingBehavior:</strong> প্রতিটি কমান্ড কত মিলিসেকেন্ড সময় নিল তা স্বয়ংক্রিয়ভাবে লগ করে।</li>
    <li><strong>TransactionBehavior:</strong> হ্যান্ডলারের কাজ সফল হলে স্বয়ংক্রিয়ভাবে DB Transaction Commit করে, ফেইল হলে Rollback করে।</li>
</ol>`
  },

  // ==========================================
  // TOPIC 2: DATABASES (SQL, POSTGRES, ORACLE, REDIS)
  // ==========================================
  {
    topic: 'database',
    level: 'junior',
    badge: 'SQL Indexing',
    q: '২০. Clustered Index এবং Non-Clustered Index এর মূল পার্থক্য কী?',
    a: `<p><strong>Clustered Index:</strong> টেবিলে ডেটার ফিজিক্যাল বিন্যাস (Physical Storage Order) সরাসরি নির্ধারণ করে। এর B-Tree স্ট্রাকচারের লিফ নোডে সম্পূর্ণ টেবিল ডেটা বা রো সংরক্ষিত থাকে। তাই একটি টেবিলে <strong>শুধুমাত্র একটিই</strong> Clustered Index থাকতে পারে (যেমন একটি ডিকশনারি বা টেলিফোন ডিরেক্টরি)। সাধারণত Primary Key-র উপর এটি স্বয়ংক্রিয়ভাবে তৈরি হয়।</p>
<p><strong>Non-Clustered Index:</strong> মূল ডাটা টেবিল থেকে আলাদা একটি B-Tree স্ট্রাকচারে সংরক্ষিত থাকে। এর লিফ নোডে শুধুমাত্র ইনডেক্স করা কলামের ভ্যালু এবং মূল ডাটা রোর একটি পয়েন্টার (Row Locator / Clustered Key) থাকে। একটি টেবিলে একাধিক নন-ক্লাস্টার্ড ইনডেক্স থাকতে পারে (যেমন বইয়ের পেছনের ইনডেক্স সূচি)।</p>`
  },
  {
    topic: 'database',
    level: 'junior',
    badge: 'SQL Constraints',
    q: '২১. Primary Key এবং Unique Key এর মধ্যে পার্থক্য কী? Foreign Key কীভাবে ডাটা ইন্টিগ্রিটি নিশ্চিত করে?',
    a: `<p><strong>Primary Key:</strong></p>
<ul>
    <li>টেবিলের প্রতি রো-কে ইউনিকলি সনাক্ত করে।</li>
    <li>কখনোই <code>NULL</code> ভ্যালু অনুমোদন করে না।</li>
    <li>একটি টেবিলে শুধুমাত্র একটি প্রাইমারি কি থাকতে পারে এবং বাই-ডিফল্ট এটি Clustered Index তৈরি করে।</li>
</ul>
<p><strong>Unique Key:</strong></p>
<ul>
    <li>কলামের ভ্যালুর ইউনিকনেস নিশ্চিত করে কিন্তু <code>NULL</code> অনুমোদন করে (SQL Server-এ একটি মাত্র NULL অনুমোদন করে, তবে PostgreSQL/Oracle-এ একাধিক NULL সমর্থন করে)।</li>
    <li>একটি টেবিলে একাধিক Unique Key থাকতে পারে এবং বাই-ডিফল্ট এটি Non-Clustered Index তৈরি করে।</li>
</ul>
<p><strong>Foreign Key:</strong> প্যারেন্ট ও চাইল্ড টেবিলের মধ্যে রিলেশনশিপ তৈরি করে। চাইল্ড টেবিলে এমন কোনো ভ্যালু ইনসার্ট হতে দেয় না যা প্যারেন্ট টেবিলে নেই। এটি রেফারেন্সিয়াল ইন্টিগ্রিটি বজায় রাখে।</p>`
  },
  {
    topic: 'database',
    level: 'junior',
    badge: 'SQL Joins',
    q: '২২. বিভিন্ন ধরণের SQL Joins (INNER, LEFT, RIGHT, FULL, CROSS) এর কার্যপ্রণালী ব্যাখ্যা করুন।',
    a: `<p>SQL Joins দুটি টেবিলের সাধারণ কলামের ভিত্তিতে ডাটা একত্রিত করে:</p>
<ul>
    <li><strong>INNER JOIN:</strong> উভয় টেবিলে ম্যাচিং হওয়া রেকর্ডগুলো শুধুমাত্র রিটার্ন করে। কোনো অমিল ডাটা আসে না।</li>
    <li><strong>LEFT JOIN (LEFT OUTER JOIN):</strong> বাম টেবিলের সব রেকর্ড এবং ডান টেবিলের ম্যাচিং রেকর্ড আনে। ডানে ম্যাচ না থাকলে সেখানে <code>NULL</code> বসে।</li>
    <li><strong>RIGHT JOIN:</strong> ডান টেবিলের সব রেকর্ড এবং বামের ম্যাচিং রেকর্ড আনে।</li>
    <li><strong>FULL OUTER JOIN:</strong> যেকোনো এক টেবিলে মিল থাকলেই সব ডাটা নিয়ে আসে। অমিলের ক্ষেত্রে অপর পাশে <code>NULL</code> দেখায়।</li>
    <li><strong>CROSS JOIN:</strong> কার্টেসিয়ান গুণফল (Cartesian Product)। বাম টেবিলের প্রতিটি রো-র সাথে ডান টেবিলের প্রতিটি রো-কে জোড়া দেয় (M &times; N সংখ্যক রো)।</li>
</ul>`
  },
  {
    topic: 'database',
    level: 'junior',
    badge: 'Database Core',
    q: '২৩. ACID প্রোপার্টিজ কী? একটি ব্যাংক ফান্ড ট্রান্সফারের উদাহরণ দিয়ে বুঝিয়ে বলুন।',
    a: `<p>ACID হলো ডাটাবেজ ট্রানজ্যাকশনের নির্ভরযোগ্যতার ৪টি ভিত্তিস্তম্ভ:</p>
<ul>
    <li><strong>Atomicity (অল অর নাথিং):</strong> ট্রানজ্যাকশনের সব কাজ সফল হবে নতুবা কোনোটিই হবে না। <em>উদাহরণ:</em> রহিম যদি করিমকে ১০০০ টাকা পাঠায়, রহিমের একাউন্ট থেকে কাটা এবং করিমের একাউন্টে জমা হওয়া—উভয়টি সম্পন্ন হতে হবে। মাঝে সার্ভার ক্র্যাশ করলে পুরো অপারেশন রোলব্যাক হবে।</li>
    <li><strong>Consistency (ধারাবাহিকতা):</strong> ট্রানজ্যাকশন শেষে সব ভ্যালিডেশন রুলস ও কনস্ট্রেইন্ট অক্ষত থাকবে। ব্যাংক ব্যালেন্স কখনো নেগেটিভ হতে পারবে না।</li>
    <li><strong>Isolation (বিচ্ছিন্নতা):</strong> সমান্তরাল একাধিক ট্রানজ্যাকশন চললেও একটি যেন অন্যটির অর্ধসমাপ্ত ডাটা রিড না করতে পারে।</li>
    <li><strong>Durability (স্থায়িত্ব):</strong> একবার ট্রানজ্যাকশন <code>COMMIT</code> হয়ে গেলে বিদ্যুৎ চলে গেলেও বা সার্ভার ক্র্যাশ করলেও ডাটা কখনোই হারাবে না (Write-Ahead Logging / WAL এর মাধ্যমে ডিস্কে সংরক্ষিত হয়)।</li>
</ul>`
  },
  {
    topic: 'database',
    level: 'junior',
    badge: 'SQL DDL vs DML',
    q: '২৪. DELETE, TRUNCATE এবং DROP এর মধ্যে প্রযুক্তিগত পার্থক্য কী?',
    a: `<p><strong>DELETE (DML - Data Manipulation Language):</strong></p>
<ul>
    <li><code>WHERE</code> ক্লজ ব্যবহার করে নির্দিষ্ট রো মুছে ফেলা যায়।</li>
    <li>প্রতিটি রো কাটার সময় ট্রানজ্যাকশন লগে রো-বাই-রো রেকর্ড লেখে, তাই কোটি রো মুছতে গেলে প্রচুর সময় ও লগ স্পেস খরচ হয়।</li>
    <li>টেবিলের Identity কলামের মান রিসেট হয় না। ট্রিগার ফায়ার করে।</li>
</ul>
<p><strong>TRUNCATE (DDL - Data Definition Language):</strong></p>
<ul>
    <li>সম্পূর্ণ টেবিলের সমস্ত ডাটা পেজ তাৎক্ষণিকভাবে ডিঅ্যালোকেট করে। কোনো <code>WHERE</code> ক্লজ নেয় না।</li>
    <li>লগে কেবল পেজ ডিঅ্যালোকেশন লেখে, ফলে চোখের পলকে কোটি কোটি রো মুছে যায়।</li>
    <li>Identity কলামকে ইনিশিয়াল সিডে রিসেট করে। কোনো রো-লেভেল ট্রিগার ফায়ার করে না।</li>
</ul>
<p><strong>DROP (DDL):</strong> ডাটা সহ সম্পূর্ণ টেবিলের স্কিমা, স্ট্রাকচার ও ইনডেক্স ডাটাবেজ থেকে চিরতরে মুছে ফেলে।</p>`
  },
  {
    topic: 'database',
    level: 'mid',
    badge: 'Query Optimization',
    q: '২৫. Covering Index কী এবং INCLUDE ক্লজ কীভাবে Key Lookup দূর করে?',
    a: `<p>যখন কোনো কুয়েরির <code>SELECT</code> এর কিছু কলাম নন-ক্লাস্টার্ড ইনডেক্সে থাকে না, ইঞ্জিন ইনডেক্স খোঁজার পর বাকি কলাম আনতে মূল টেবিলে জাম্প করে—যাকে বলে <strong>Key Lookup (Bookmark Lookup)</strong>। উচ্চ ট্রাফিকে এটি সার্ভারের আই/ও ধ্বংস করে।</p>
<p><strong>Covering Index:</strong> <code>WHERE</code> ক্লজের কলামকে ইনডেক্স কী-তে রেখে <code>SELECT</code> এর কলামগুলোকে <code>INCLUDE</code> ক্লজে দিলে সম্পূর্ণ কুয়েরি ইনডেক্স পেজ থেকেই সার্ভ হয়ে যায় এবং Key Lookup সম্পূর্ণরূপে ০ হয়ে যায়:</p>
<pre><code>CREATE NONCLUSTERED INDEX IX_Orders_Cust 
ON Orders(CustomerId) 
INCLUDE (OrderDate, TotalAmount);</code></pre>
<p>এখানে <code>OrderDate</code> ও <code>TotalAmount</code> ইনডেক্সের বি-ট্রি রুটে সর্ট হয় না, সরাসরি লিফ নোডে জমা থাকে, ফলে ইনডেক্সের আকার ছোট থাকে কিন্তু কোয়েরি ১০০% কভারড হয়।</p>`
  },
  {
    topic: 'database',
    level: 'mid',
    badge: 'Execution Plan',
    q: '২৬. SQL Server Execution Plan এ Index Seek বনাম Index Scan এবং Hash Match এর তাৎপর্য কী?',
    a: `<p><strong>Index Seek:</strong> কাঙ্ক্ষিত ডাটা দ্রুত খুঁজে বের করতে B-Tree ইনডেক্সের রুট থেকে সরাসরি নির্দিষ্ট লিফ নোডে ঝাঁপ দেয়। এটি সবচেয়ে দ্রুত ও অপ্টিমাইজড (O(log N))।</p>
<p><strong>Index Scan:</strong> সম্পূর্ণ ইনডেক্সের প্রথম থেকে শেষ পর্যন্ত সমস্ত পেজ রিড করে। এটি সাধারণত ঘটে যখন কুয়েরিতে কোনো ইন্ডেক্সড কলামের উপর ফাংশন ব্যবহার করা হয় (যেমন <code>WHERE YEAR(OrderDate) = 2024</code>) অথবা ফিল্টারিং শর্ত অনুপস্থিত থাকে।</p>
<p><strong>Hash Match (Join):</strong> যখন দুটি বড় টেবিল জয়েন করতে হয় এবং কোনো ইনডেক্স বা সর্টেড কলাম থাকে না, ইঞ্জিন মেমোরিতে একটি ইন-মেমোরি হ্যাশ টেবিল তৈরি করে ম্যাচ করায়। এটি প্রচুর RAM এবং CPU খরচ করে। সঠিক ইনডেক্সিং থাকলে এটি দ্রুততর <strong>Merge Join</strong> বা <strong>Nested Loops</strong>-এ রূপান্তরিত হয়।</p>`
  },
  {
    topic: 'database',
    level: 'mid',
    badge: 'Database Modeling',
    q: '২৭. ডাটাবেজ নরমালাইজেশন (1NF থেকে BCNF) বনাম ডিনরমালাইজেশন কখন প্রযোজ্য?',
    a: `<p><strong>নরমালাইজেশন (OLTP - Transactional System):</strong> ডাটাবেজে ডুপ্লিকেশন (Redundancy) কমানো এবং Insert, Update, Delete এনোমালি রোধ করার প্রক্রিয়া।</p>
<ul>
    <li><strong>1NF:</strong> প্রতিটি কলামে অ্যাটমিক (অবিভাজ্য) একক ভ্যালু থাকতে হবে।</li>
    <li><strong>2NF:</strong> 1NF পূর্ণ করার পর কোনো নন-প্রাইমারি কি কলাম কম্পোজিট কি-র আংশিক অংশের উপর নির্ভরশীল হতে পারবে না (No Partial Dependency)।</li>
    <li><strong>3NF:</strong> কোনো নন-কি কলাম অন্য নন-কি কলামের উপর নির্ভরশীল হতে পারবে না (No Transitive Dependency)।</li>
</ul>
<p><strong>ডিনরমালাইজেশন (OLAP / High-Scale Read):</strong> যখন উচ্চ ট্রাফিকের কারণে জটিল ৭-৮টি টেবিল JOIN করা পারফরম্যান্সের জন্য ক্ষতিকর হয়ে দাঁড়ায়, তখন সচেতনভাবে কিছু টেবিল মার্চ করে বা রিডানড্যান্ট কলাম রেখে কুয়েরি দ্রুত করা হয় (যেমন ই-কমার্স ড্যাশবোর্ড বা রিপোর্টিং সিস্টেম)।</p>`
  },
  {
    topic: 'database',
    level: 'mid',
    badge: 'Concurrency Control',
    q: '২৮. Transaction Isolation Levels: Dirty Read, Non-repeatable Read এবং Phantom Read কী?',
    a: `<table class="table table-bordered table-sm">
    <thead>
        <tr><th>Isolation Level</th><th>Dirty Read</th><th>Non-repeatable Read</th><th>Phantom Read</th></tr>
    </thead>
    <tbody>
        <tr><td><strong>Read Uncommitted</strong></td><td>❌ ঘটে</td><td>❌ ঘটে</td><td>❌ ঘটে</td></tr>
        <tr><td><strong>Read Committed</strong> (ডিফল্ট)</td><td>✅ নিরাপদ</td><td>❌ ঘটে</td><td>❌ ঘটে</td></tr>
        <tr><td><strong>Repeatable Read</strong></td><td>✅ নিরাপদ</td><td>✅ নিরাপদ</td><td>❌ ঘটে</td></tr>
        <tr><td><strong>Serializable</strong></td><td>✅ নিরাপদ</td><td>✅ নিরাপদ</td><td>✅ নিরাপদ</td></tr>
    </tbody>
</table>
<ul>
    <li><strong>Dirty Read:</strong> অন্য ট্রানজ্যাকশনের আন-কমিটেড (Uncommitted) ডাটা রিড করা যা পরবর্তীতে রোলব্যাক হয়ে যেতে পারে।</li>
    <li><strong>Non-repeatable Read:</strong> একই ট্রানজ্যাকশনে একই রো দুবার পড়লে অন্য কারো আপডেটের কারণে ভিন্ন মান পাওয়া।</li>
    <li><strong>Phantom Read:</strong> একই রেঞ্জ কুয়েরি দুবার চালালে অন্য ট্রানজ্যাকশনের নতুন ইনসার্টের কারণে অতিরিক্ত রো চলে আসা।</li>
</ul>`
  },
  {
    topic: 'database',
    level: 'mid',
    badge: 'Concurrency & Deadlocks',
    q: '২৯. SQL Server এ Deadlock কেন ঘটে? Deadlock Graph বিশ্লেষণ এবং প্রতিরোধের উপায় কী?',
    a: `<p><strong>Deadlock:</strong> ঘটে যখন দুটি ট্রানজ্যাকশন একে অপরের দখল করা রিসোর্সের উপর এক্সক্লুসিভ লক দাবি করে একটি সাইক্লিক ডিপেনডেন্সিতে আটকে যায় (Transaction A রিসোর্স ১ লক করে রিসোর্স ২ এর জন্য অপেক্ষা করছে, আর Transaction B রিসোর্স ২ লক করে রিসোর্স ১ এর জন্য অপেক্ষা করছে)। ইঞ্জিন একজনকে <strong>Deadlock Victim</strong> হিসেবে কিল করে এরর 1205 ফেরত দেয়।</p>
<p><strong>প্রতিরোধের কৌশল:</strong></p>
<ol>
    <li><strong>একই ক্রম রক্ষা করা (Consistent Ordering):</strong> সমস্ত অ্যাপ্লিকেশনে টেবিল অ্যাক্সেসের ধারাবাহিকতা একই রাখুন (প্রথমে Table A, পরে Table B)।</li>
    <li><strong>ফরেন কি-তে ইনডেক্স দেওয়া:</strong> চাইল্ড টেবিলে ফরেন কি কলাম ইনডেক্স না থাকলে প্যারেন্ট ডিলিট বা আপডেটে চাইল্ড টেবিলে ফুল টেবিল লক লাগে।</li>
    <li><strong>শর্ট ট্রানজ্যাকশন:</strong> ট্রানজ্যাকশনের ভেতর কখনো ভারী এপিআই কল বা ফাইল I/O রাখবেন না।</li>
    <li><strong>RCSI (Read Committed Snapshot Isolation) সক্রিয় করা।</strong></li>
</ol>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'PostgreSQL Internals',
    q: '৩০. PostgreSQL এ Table Bloat কেন ঘটে এবং Autovacuum কীভাবে টিউন করবেন?',
    a: `<p>Postgres এর MVCC ডিজাইনে কোনো রো আপডেট হলে ইঞ্জিন পুরনো রো এডিট করে না, বরং পুরনোটিকে <strong>Dead Tuple</strong> বানিয়ে নতুন রো ইনসার্ট করে। ঘনঘন আপডেটে কোটি কোটি ডেড টাপল ডিস্ক দখল করায় <strong>Table Bloat</strong> ঘটে এবং কুয়েরি স্লো হয়ে যায়।</p>
<p><code>VACUUM</code> ডেড টাপল মুছে ডিস্ক স্পেস নতুন রো লেখার উপযোগী করে। হাই-রাইট টেবিলের জন্য <code>autovacuum_vacuum_scale_factor = 0.05</code> (৫% ডেড টাপলেই ভ্যাকুয়াম চলবে) এবং HOT (Heap-Only Tuple) নিশ্চিত করতে <code>fillfactor = 85</code> কনফিগার করা সিনিয়র বেস্ট প্র্যাকটিস।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Oracle Architecture',
    q: '৩১. Oracle PL/SQL এ BULK COLLECT ও FORALL কেন লাখ লাখ রো প্রসেসিংয়ে গেম চেঞ্জার?',
    a: `<p>সাধারণ PL/SQL লুপে প্রতি রো প্রসেসিংয়ের সময় PL/SQL ইঞ্জিন ও SQL ইঞ্জিনের মধ্যে <strong>Context Switching</strong> ঘটে। ১০ লাখ রো-এর জন্য ১০ লাখ বার কনটেক্সট সুইচ হলে ঘণ্টার পর ঘণ্টা সময় অপচয় হয়।</p>
<p><code>BULK COLLECT ... LIMIT 1000</code> দিয়ে এক সিঙ্গেল রাউন্ডট্রিপে ১,০০০ রো মেমোরি অ্যারেতে আনা হয় এবং <code>FORALL ... SAVE EXCEPTIONS</code> দিয়ে এক ব্যাচে ডাটাবেজ ইঞ্জিনে পুশ করা হয়। এতে Context Switching সম্পূর্ণরূপে শূন্য হয়ে কোটি কোটি রো চোখের পলকে প্রসেস হয়।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'SQL Server Deep Dive',
    q: '৩২. Parameter Sniffing কী? প্রোডাকশনে কুয়েরি হঠাৎ স্লো হলে কীভাবে ফিক্স করবেন?',
    a: `<p><strong>Parameter Sniffing:</strong> যখন কোনো Stored Procedure প্রথমবার রান হয়, SQL Server সেই নির্দিষ্ট প্যারামিটার ভ্যালুর জন্য সবচেয়ে অনুকূল একটি Execution Plan জেনারেট করে এবং মেমোরি ক্যাশে রেখে দেয়।</p>
<p>যদি প্রথম প্যারামিটারটি ছিল একটি ব্যতিক্রমী মান (Outlier, যা মাত্র ১টি রো রিটার্ন করে এবং Index Seek তৈরি করে), পরবর্তী সময়ে সাধারণ প্যারামিটার (যা লক্ষ লক্ষ রো রিটার্ন করবে) রান করলে ইঞ্জিন ওই পুরানো Index Seek প্ল্যান ব্যবহার করে হাজার হাজার Key Lookup করতে গিয়ে সার্ভারের সিপিইউ ১০০% এ আটকে ফেলে।</p>
<p><strong>সমাধানের উপায়:</strong></p>
<ul>
    <li><strong>লোকাল ভ্যারিয়েবল ট্রিক:</strong> প্যারামিটারকে লোকাল ভ্যারিয়েবলে অ্যাসাইন করা (ইঞ্জিন গড় স্ট্যাটিসটিক্স ব্যবহার করবে):<br><code>DECLARE @LocalId INT = @ParamId; SELECT ... WHERE Id = @LocalId;</code></li>
    <li><strong>OPTIMIZE FOR:</strong> গড় মানের জন্য প্ল্যান তৈরি করতে বলা: <code>OPTION (OPTIMIZE FOR (@ParamId = 100))</code>।</li>
    <li><strong>OPTION (RECOMPILE):</strong> প্রতি এক্সিকিউশনে নতুন প্ল্যান তৈরি করবে (ছোট বা অনিয়মিত কুয়েরির জন্য প্রযোজ্য)।</li>
</ul>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'SQL Server Concurrency',
    q: '৩৩. Read Committed Snapshot Isolation (RCSI) কী এবং কেন এটি লক কনটেনশন বন্ধ করে?',
    a: `<p>ডিফল্ট SQL Server-এ রিড অপারেশনের সময় <strong>Shared Lock (S-Lock)</strong> লাগে। যদি কোনো ট্রানজ্যাকশন ডাটা আপডেট করতে থাকে (Exclusive Lock বা X-Lock নিয়ে থাকে), তবে রিডাররা সেখানে ব্লক হয়ে বসে থাকে (Readers block Writers, Writers block Readers)।</p>
<p><strong>RCSI অ্যাক্টিভেট করলে:</strong></p>
<pre><code>ALTER DATABASE MyDb SET READ_COMMITTED_SNAPSHOT ON;</code></pre>
<p>রিডাররা কোনো লক নেয় না। আপডেট চলাকালীন ইঞ্জিন পূর্বের কমিটেড ডাটার স্ন্যাপশট <strong>TempDB Version Store</strong>-এ রাখে। রিডাররা সরাসরি TempDB থেকে পূর্বের ভার্সন পড়ে চলে যায়। ফলে কোনো লকিং কনটেনশন থাকে না এবং রিড-রাইট কনকারেন্সি বহুগুণ বৃদ্ধি পায়।</p>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Oracle Triggers',
    q: '৩৪. Oracle এ Mutating Table Error (ORA-04091) কেন ঘটে এবং Compound Trigger দিয়ে কীভাবে সমাধান করবেন?',
    a: `<p><strong>ORA-04091:</strong> যখন একটি <code>AFTER INSERT OR UPDATE FOR EACH ROW</code> ট্রিগারের ভেতর থেকে সেই একই টেবিলের উপর <code>SELECT</code> কুয়েরি চালানো হয় যা বর্তমানে ট্রানজ্যাকশনের অধীনে মডিফাই হচ্ছে। ডাটাবেজ তখন টেবিলটিকে "Mutating (অস্থির)" ঘোষণা করে নিরাপত্তা ত্রুটি দেখায়।</p>
<p><strong>Compound Trigger এর সমাধান:</strong> এটি ৪টি ফেজে কোড ভাগ করে:</p>
<ol>
    <li><code>BEFORE STATEMENT:</code> প্যাকেজ গ্লোবাল মেমোরি কালেকশন ইনিশিয়ালাইজ করে।</li>
    <li><code>AFTER EACH ROW:</code> কোনো কুয়েরি না চালিয়ে শুধুমাত্র অ্যাফেক্টেড আইডিগুলোকে ইন-মেমোরি অ্যারেতে পুশ করে।</li>
    <li><code>AFTER STATEMENT:</code> সম্পূর্ণ টেবিলের লক মুক্ত হয়ে যাওয়ার পর অ্যারেতে থাকা আইডিগুলোর উপর একবার বাল্ক কুয়েরি চালিয়ে বিজনেস রুল প্রয়োগ করে।</li>
</ol>`
  },
  {
    topic: 'database',
    level: 'senior',
    badge: 'Redis Distributed Caching',
    q: '৩৫. Redis Caching: Cache Stampede (Dogpiling) কী? XFetch ও RedLock কীভাবে কাজ করে?',
    a: `<p><strong>Cache Stampede:</strong> যখন উচ্চ ট্রাফিকের কোনো হট কি-র (যেমন হোমপেজ ব্যানার বা প্রোডাক্ট ক্যাটালগ) ক্যাশ এক্সপায়ার হয়, তখন একই সাথে আসা হাজার হাজার কনকারেন্ট রিকোয়েস্ট ক্যাশে ডাটা না পেয়ে ডাটাবেজে আঘাত হানে। ফলে ডাটাবেজ সিপিইউ নিমেষে ১০০% হয়ে সার্ভার ক্র্যাশ করে।</p>
<p><strong>সমাধানসমূহ:</strong></p>
<ul>
    <li><strong>প্রোবাবিলিস্টিক আর্লি এক্সপায়ারেশন (XFetch Algorithm):</strong> ক্যাশ আসলেই এক্সপায়ার হওয়ার সামান্য আগে গাণিতিক সম্ভাবনার ভিত্তিতে একটি মাত্র ব্যাকগ্রাউন্ড থ্রেড ডাটাবেজ থেকে ক্যাশ রিফ্রেশ করে নেয়।</li>
    <li><strong>মিউচুয়াল এক্সক্লুসিভ লক (Mutex / Distributed Lock):</strong> শুধুমাত্র প্রথম রিকোয়েস্টটি লকিং কি (<code>SET lock_key uuid NX PX 5000</code>) নিয়ে ডাটাবেজ থেকে ডাটা পড়বে, বাকি রিকোয়েস্টগুলো সামান্য অপেক্ষা করে নতুন ক্যাশ থেকে ডাটা পাবে।</li>
    <li><strong>RedLock:</strong> মাল্টি-নোড রেডিস ক্লাস্টারে ব্রেন-স্প্লিট ফল্ট দূর করে নির্ভরযোগ্য ডিস্ট্রিবিউটেড লকিং প্রদান করে।</li>
</ul>`
  },

  // ==========================================
  // TOPIC 3: FRONTEND (CSS, JQUERY, ANGULAR 18)
  // ==========================================
  {
    topic: 'frontend',
    level: 'junior',
    badge: 'CSS Basics',
    q: '৩৬. CSS Box Model কী এবং box-sizing: border-box কেন আধুনিক ওয়েবের স্ট্যান্ডার্ড?',
    a: `<p>CSS Box Model ৪টি স্তর নিয়ে গঠিত: <strong>Content &rarr; Padding &rarr; Border &rarr; Margin</strong>।</p>
<p>ডিফল্ট <code>content-box</code> এ কোনো এলিমেন্টের উইডথ ৩০০ পিক্সেল দিয়ে ২০ পিক্সেল প্যাডিং ও ৫ পিক্সেল বর্ডার দিলে ব্রাউজারে মোট দৃশ্যমান উইডথ হয়ে যায় ৩৫০ পিক্সেল (300 + 40 + 10)। এর ফলে গ্রিড বা রেসপনসিভ লেআউট প্রায়ই ভেঙে যায়।</p>
<p><code>box-sizing: border-box</code> ব্যবহার করলে প্যাডিং ও বর্ডার মূল নির্ধারিত উইডথের <strong>ভেতরের অংশ হিসেবে</strong> সমন্বয় হয়। অর্থাৎ উইডথ ৩০০ পিক্সেল দিলে দৃশ্যমান আকার ঠিক ৩০০ পিক্সেলই থাকে। তাই আধুনিক সব সিএসএস ফ্রেমওয়ার্কে গ্লোবাল রিসেট ব্যবহার করা হয়:</p>
<pre><code>*, *::before, *::after {
    box-sizing: border-box;
}</code></pre>`
  },
  {
    topic: 'frontend',
    level: 'junior',
    badge: 'CSS Layout',
    q: '৩৭. CSS Flexbox এবং CSS Grid এর মূল পার্থক্য কী? কখন কোনটি ব্যবহার করবেন?',
    a: `<p><strong>Flexbox (১-মাত্রিক বা 1-Dimensional Layout):</strong></p>
<ul>
    <li>শুধুমাত্র একটি অক্ষে (Row <em>অথবা</em> Column) কাজ করে।</li>
    <li>কনটেন্ট চালিত লেআউট (Content-first)। ছোট কম্পোনেন্ট, নেভিগেশন বার, ফর্ম ফিল্ড এবং আইকন অ্যালাইনমেন্টের জন্য সেরা।</li>
</ul>
<p><strong>CSS Grid (২-মাত্রিক বা 2-Dimensional Layout):</strong></p>
<ul>
    <li>একই সাথে সারি ও কলাম (Rows <em>এবং</em> Columns) উভয় অক্ষ সম্পূর্ণ নিয়ন্ত্রণ করে।</li>
    <li>লেআউট চালিত ডিজাইন (Layout-first)। পুরো পেজের কাঠামো, জটিল ড্যাশবোর্ড এবং রেসপনসিভ ফটো গ্যালারির জন্য সেরা।</li>
</ul>
<p><strong>সিদ্ধান্ত:</strong> পুরো পেজের ম্যাক্রো আর্কিটেকচার গ্রিড দিয়ে এবং কম্পোনেন্টের ভেতরের ক্ষুদ্র মাইক্রো অ্যালাইনমেন্ট ফ্লেক্সবক্স দিয়ে সাজানো সবচেয়ে বুদ্ধিমানের কাজ।</p>`
  },
  {
    topic: 'frontend',
    level: 'junior',
    badge: 'CSS Specificity',
    q: '৩৮. CSS Specificity Hierarchy কীভাবে হিসাব করা হয়? !important কেন এড়িয়ে চলা উচিত?',
    a: `<p>CSS Specificity হলো ব্রাউজারের অগ্রাধিকার সূত্র যখন একই উপাদানে একাধিক নিয়ম প্রযোজ্য হয়:</p>
<ol>
    <li><strong>Inline Styles</strong> (ওয়েট: 1000) &mdash; যেমন <code>style="color:red;"</code></li>
    <li><strong>ID Selectors</strong> (ওয়েট: 100) &mdash; যেমন <code>#header</code></li>
    <li><strong>Class, Attribute ও Pseudo-classes</strong> (ওয়েট: 10) &mdash; যেমন <code>.btn, [type="text"], :hover</code></li>
    <li><strong>Elements ও Pseudo-elements</strong> (ওয়েট: 1) &mdash; যেমন <code>div, p, ::before</code></li>
</ol>
<p><strong>!important এর বিপদ:</strong> এটি স্বাভাবিক ক্যাসকেডিং নিয়মকে জোরপূর্বক ধ্বংস করে। একবার <code>!important</code> দিলে ভবিষ্যতে তা ওভাররাইড করতে আরও বড় <code>!important</code> দিতে হয়, যা বড় প্রজেক্টে মেইনটেইনেবিলিটি নষ্ট করে।</p>`
  },
  {
    topic: 'frontend',
    level: 'junior',
    badge: 'jQuery vs Vanilla JS',
    q: '৩৯. jQuery এবং Modern Vanilla JavaScript এর পার্থক্য কী? আধুনিক অ্যাপে jQuery এর অবস্থান কী?',
    a: `<p>jQuery একসময় বিপ্লব এনেছিল কারণ প্রাচীন ব্রাউজারগুলোতে (যেমন IE6/7/8) DOM ম্যানিপুলেশন ও AJAX কল অত্যন্ত জটিল ও অসঙ্গত ছিল। <code>$()</code> সিনট্যাক্স দিয়ে ক্রস-ব্রাউজার সমস্যা এক নিমিষে দূর হতো।</p>
<p><strong>আধুনিক পরিস্থিতি:</strong></p>
<ul>
    <li>আজকের আধুনিক ব্রাউজারে বিল্ট-ইন <code>document.querySelector()</code>, <code>fetch()</code> API, এবং <code>classList.toggle()</code> অত্যন্ত দ্রুত ও স্ট্যান্ডার্ডাইজড।</li>
    <li>লেগাসি এন্টারপ্রাইজ সিস্টেম ও ওয়ার্ডপ্রেস ছাড়া নতুন সিঙ্গেল পেজ অ্যাপে (Angular/React) সাধারণত jQuery ব্যবহার করা হয় না কারণ এটি ভারচুয়াল বা সিগন্যাল ডোম আর্কিটেকচার না বুঝে সরাসরি রিয়েল ডোমে অপ্রয়োজনীয় ম্যানিপুলেশন করে।</li>
</ul>`
  },
  {
    topic: 'frontend',
    level: 'junior',
    badge: 'Angular Core',
    q: '৪০. Angular Component Lifecycle Hooks এর প্রধান ধাপগুলো কী কী? ngOnInit বনাম Constructor?',
    a: `<p><strong>Constructor:</strong> এটি সাধারণ TypeScript ক্লাসের ফিচার। শুধুমাত্র ডিপেনডেন্সি ইনজেকশন করার জন্য ব্যবহৃত হয়। এই ধাপে ইনপুট প্রোপার্টিজ (<code>@Input</code>) মান পায় না এবং DOM তৈরি হয় না।</p>
<p><strong>প্রধান লাইফসাইকেল হুকস:</strong></p>
<ol>
    <li><code>ngOnChanges()</code>: যখন কোনো <code>@Input()</code> প্রোপার্টির মান পরিবর্তিত হয়।</li>
    <li><code>ngOnInit()</code>: কম্পোনেন্ট ইনিশিয়ালাইজ হলে একবার কল হয়। সমস্ত এপিআই কল বা প্রাথমিক ডাটা লোডিং এখানে করা হয়।</li>
    <li><code>ngAfterViewInit()</code>: কম্পোনেন্টের টেমপ্লেট ও চাইল্ড ভিউ পুরোপুরি DOM এ রেন্ডার হওয়ার পর কল হয়।</li>
    <li><code>ngOnDestroy()</code>: কম্পোনেন্ট ডোম থেকে অপসারিত হওয়ার ঠিক আগে কল হয়। মেমোরি লিক রোধ করতে সমস্ত RxJS সাবস্ক্রিপশন আনসাবস্ক্রাইব করা বা ইভেন্ট রিমুভ করার একমাত্র স্থান।</li>
</ol>`
  },
  {
    topic: 'frontend',
    level: 'mid',
    badge: 'jQuery & DOM',
    q: '৪১. jQuery Event Delegation কী? $(\'.item\').click() এর বদলে $(document).on(\'click\', \'.item\') কেন শ্রেয়?',
    a: `<p><code>$('.item').click()</code> শুধুমাত্র পেজ লোড হওয়ার সময় যেসব উপাদান বিদ্যমান ছিল তাদের উপর ইভেন্ট লিসেনার বাইন্ড করে। পরবর্তীতে AJAX দিয়ে নতুন কোনো <code>.item</code> ডোম-এ আসলে ক্লিক কাজ করে না। উপরন্তু ১,০০০ আইটেমের জন্য ১,০০০টি ইভেন্ট লিসেনার ব্রাউজারের মেমোরি নষ্ট করে।</p>
<p><strong>Event Delegation:</strong> <code>$(document).on('click', '.item', fn)</code> প্যারেন্ট এলিমেন্টে মাত্র ১টি লিসেনার রাখে এবং ব্রাউজারের <strong>Event Bubbling</strong> মেকানিজম ব্যবহার করে যেকোনো ভবিষ্যতে আসা ডায়নামিক উপাদানেও নিখুঁতভাবে কাজ করে এবং মেমোরি অপচয় ৯৯% কমায়।</p>`
  },
  {
    topic: 'frontend',
    level: 'mid',
    badge: 'Modern CSS',
    q: '৪২. CSS Container Queries (@container) এবং Media Queries (@media) এর মধ্যে তফাত কী?',
    a: `<p><strong>Media Queries (<code>@media</code>):</strong> সম্পূর্ণ <strong>ব্রাউজার ভিউপোর্টের (Viewport) স্ক্রিন সাইজ</strong> অনুযায়ী সিএসএস পরিবর্তন করে। এর সীমাবদ্ধতা হলো, একটি ছোট সাইডবারের ভেতরের উইজেট এবং ফুল-উইডথ বডির ভেতরের উইজেট একই ভিউপোর্ট সাইজে একই সিএসএস পেত।</p>
<p><strong>Container Queries (<code>@container</code>):</strong> উইজেটটির প্যারেন্ট কন্টেইনারের প্রস্থ বা আকারের উপর ভিত্তি করে রেসপনসিভ স্টাইল দেয়। ফলে একটি কার্ড কম্পোনেন্টকে আপনি সাইডবারে রাখলে সেটি নিজে থেকেই কমপ্যাক্ট কলামে চলে আসবে, আবার মেইন সেকশনে রাখলে নিজে থেকেই গ্রিড হয়ে যাবে—সম্পূর্ণ স্বাধীন ও পুনঃব্যবহারযোগ্য কম্পোনেন্ট ডিজাইন সম্ভব হয়।</p>`
  },
  {
    topic: 'frontend',
    level: 'mid',
    badge: 'Angular Forms',
    q: '৪৩. Angular Reactive Forms বনাম Template-Driven Forms এর গভীর পার্থক্য কী?',
    a: `<p><strong>Reactive Forms (এন্টারপ্রাইজ স্ট্যান্ডার্ড):</strong></p>
<ul>
    <li>কম্পোনেন্ট ক্লাসে সম্পূর্ণ কোড-বেসড অবজেক্ট ট্রি তৈরি হয় (<code>FormGroup, FormControl, FormArray</code>)।</li>
    <li>সিনক্রোনাস ডাটা ফ্লো, ১০০% টাইপ-সেফ (Typed Forms in Angular 14+)।</li>
    <li>জটিল ডায়নামিক ভ্যালিডেশন, কাস্টম অ্যাসিঙ্ক ভ্যালিডেটর এবং ইউনিট টেস্টিং অত্যন্ত সহজ।</li>
</ul>
<p><strong>Template-Driven Forms:</strong></p>
<ul>
    <li>টেমপ্লেট ফাইলে <code>[(ngModel)]</code> নির্দেশক দিয়ে টু-ওয়ে ডাটা বাইন্ডিং করা হয়।</li>
    <li>অ্যাসিনক্রোনাস ডাটা ফ্লো, টেস্ট করা কঠিন, জটিল ব্যবসায়িক ফর্মের জন্য অনুপযুক্ত।</li>
</ul>`
  },
  {
    topic: 'frontend',
    level: 'mid',
    badge: 'Angular DI',
    q: '৪৪. Angular Hierarchical Dependency Injection কীভাবে কাজ করে? providedIn: \'root\' বনাম Component Providers?',
    a: `<p>অ্যাঙ্গুলার ডিপেনডেন্সি ইনজেকশন হায়ারার্কিকাল ট্রির মতো কাজ করে:</p>
<ol>
    <li><strong><code>providedIn: 'root'</code> (Root Injector):</strong> পুরো অ্যাপ্লিকেশনে একটি মাত্র Singleton ইন্সট্যান্স তৈরি হয় এবং ট্রি-শেকিং (Tree-shaking) সমর্থন করে। যদি সার্ভিসটি কোথাও ব্যবহৃত না হয়, ফাইনাল প্রোডাকশন বান্ডেলে এটি ইনক্লুড হয় না।</li>
    <li><strong>Component <code>providers: [MyService]</code>:</strong> সেই কম্পোনেন্ট এবং তার সমস্ত চাইল্ড কম্পোনেন্টের জন্য একটি লোকাল আইসোলেটেড ইন্সট্যান্স তৈরি হয়। কম্পোনেন্ট নষ্ট হলে সার্ভিসটিও ডিসপোজ হয়। এটি মাল্টি-ইনস্ট্যান্স উইজেটের নিজস্ব স্টেটের জন্য উপযোগী।</li>
</ol>`
  },
  {
    topic: 'frontend',
    level: 'mid',
    badge: 'RxJS Operators',
    q: '৪৫. RxJS Flattening Operators: switchMap, mergeMap, concatMap এবং exhaustMap এর সুনির্দিষ্ট ব্যবহার ক্ষেত্র কী?',
    a: `<p>উচ্চ কনকারেন্সির সময় এই ৪টি অপারেটরের পার্থক্য জেনে রাখা সিনিয়রদের জন্য অত্যন্ত জরুরি:</p>
<ul>
    <li><strong>switchMap:</strong> নতুন ইভেন্ট আসা মাত্র আগের পেন্ডিং সাবস্ক্রিপশন বাতিল (Cancel) করে দেয়। <em>ব্যবহার:</em> সার্চ অটো-সাজেস্ট টাইপিং।</li>
    <li><strong>mergeMap:</strong> সমস্ত ইনকামিং ইভেন্টকে সমান্তরালভাবে (Parallel) হ্যান্ডেল করে, কোনো অর্ডার বজায় রাখে না। <em>ব্যবহার:</em> প্যারালাল মাল্টি-ফাইল আপলোড।</li>
    <li><strong>concatMap:</strong> আগের অপারেশন শেষ না হওয়া পর্যন্ত পরেরটি কিউতে রেখে দেয় (Sequential Queue)। <em>ব্যবহার:</em> এটিএম ব্যালেন্স ডেবিট বা চ্যাট মেসেজ সিকোয়েন্স।</li>
    <li><strong>exhaustMap:</strong> আগের কাজ শেষ না হওয়া পর্যন্ত পরবর্তী সমস্ত ইনকামিং ইভেন্ট ইগনোর (Drop) করে। <em>ব্যবহার:</em> ফর্ম সাবমিট বা পেমেন্ট বাটনে বারবার ডাবল ক্লিক প্রতিরোধ।</li>
</ul>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Angular 18 Reactivity',
    q: '৪৬. Angular 18 এ Signals বনাম RxJS এর সুনির্দিষ্ট আর্কিটেকচারাল ব্যবহার ক্ষেত্র কী?',
    a: `<p><strong>Angular Signals:</strong> সিঙ্ক্রোনাস রিঅ্যাক্টিভ স্টেট (Synchronous State)। কম্পোনেন্টের লোকাল স্টেট, ডোম প্রোপার্টিজ ও ক্যালকুলেটেড ডেরিভেশনের জন্য সেরা। কোনো মেমোরি লিক রিস্ক নেই এবং ম্যানুয়াল আনসাবস্ক্রাইব করার প্রয়োজন হয় না। এটি ভবিষ্যতে Zone.js মুক্ত লাইটওয়েট অ্যাঙ্গুলার সম্ভব করছে।</p>
<p><strong>RxJS Observables:</strong> অ্যাসিনক্রোনাস ইভেন্ট স্ট্রিম (Asynchronous Streams)। HTTP রিকোয়েস্ট, সার্চ ইনপুটে Debouncing, WebSockets এবং জটিল টাইমিং অর্কেস্ট্রেশনে RxJS অপরিহার্য। আধুনিক অ্যাঙ্গুলারে两者 মিলে কাজ করে (<code>toSignal</code> এবং <code>toObservable</code> ইন্টারঅপারেবিলিটি)।</p>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Angular Performance',
    q: '৪৭. ChangeDetectionStrategy.OnPush কীভাবে কাজ করে এবং কোন ৪টি কারণে কম্পোনেন্ট রি-রেন্ডার হয়?',
    a: `<p>ডিফল্ট চেঞ্জ ডিটেকশনে যেকোনো ব্রাউজার ইভেন্টে পুরো কম্পোনেন্ট ট্রি চেক হয়। <code>OnPush</code> ব্যবহার করলে অ্যাঙ্গুলার সেই কম্পোনেন্ট স্কিপ করে এবং শুধুমাত্র ৪টি কারণে রি-রেন্ডার করে:</p>
<ol>
    <li>কোনো <code>@Input()</code> এর অবজেক্ট রেফারেন্স পরিবর্তন হলে (ইমিউটেবল ডাটা)।</li>
    <li>কম্পোনেন্টের নিজস্ব ভেতরে কোনো DOM ইভেন্ট ফায়ার হলে (যেমন বাটন ক্লিক)।</li>
    <li>টেমপ্লেটে পড়া কোনো সিগন্যাল (Signal) আপডেট হলে।</li>
    <li>ম্যানুয়ালি <code>ChangeDetectorRef.markForCheck()</code> কল করা হলে।</li>
</ol>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Modern Angular 18',
    q: '৪৮. Angular Control Flow (@if, @for track) এবং @defer এর পারফরম্যান্স বেনিফিট কী?',
    a: `<p><strong>Modern Control Flow:</strong> পূর্বে ব্যবহৃত <code>*ngIf</code> এবং <code>*ngFor</code> ছিল স্ট্রাকচারাল ডাইরেক্টিভ যা অতিরিক্ত মডিউল ইমপোর্ট ও মেমোরি ওভারহেড তৈরি করত। নতুন <code>@if</code> এবং <code>@for (item of items; track item.id)</code> কম্পাইলার লেভেলে অপ্টিমাইজড। <code>track</code> ক্লজ বাধ্যতামূলক করায় রি-রেন্ডারিংয়ে ডোম ম্যানিপুলেশন ৯০% কমে যায়।</p>
<p><strong>@defer (Deferred Views):</strong> একটি বিশাল আর্কিটেকচারাল আপগ্রেড। হেভি কম্পোনেন্ট বা চার্টকে পেজ লোডের সময় বান্ডেলে না এনে lazy-load করা হয়:</p>
<pre><code>@defer (on viewport) {
    &lt;app-heavy-chart [data]="chartData" /&gt;
} @placeholder {
    &lt;div class="skeleton-loader"&gt;চার্ট লোড হচ্ছে...&lt;/div&gt;
}</code></pre>
<p>ইউজার স্ক্রোল করে যখন চার্টের সেকশনে পৌঁছাবে, তখনই কেবল সেই জাভাস্ক্রিপ্ট বান্ডেল ডাউনলোড হয়ে রেন্ডার হবে। এতে ফার্স্ট কনটেন্টফুল পেইন্ট (FCP) বিদ্যুৎ গতি পায়।</p>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Frontend Security & Net',
    q: '৪৯. Angular এ Silent JWT Token Refresh Interceptor কীভাবে কনকারেন্সি রেস কন্ডিশন হ্যান্ডেল করে?',
    a: `<p>যদি ব্যবহারকারীর এক্সেস টোকেন এক্সপায়ার হওয়ার মুহূর্তে একই সাথে ৫টি সমান্তরাল API কল চলে যায়, তবে ৫টি কলই 401 Unauthorized পায়। যদি ৫ বার রিফ্রেশ টোকেন রিকোয়েস্ট পাঠানো হয়, সার্ভার টোকেন রোটেশনের কারণে সেশন ইনভ্যালিড করে ইউজারকে লগআউট করে দেবে।</p>
<p><strong>সিনিয়র আর্কিটেকচারাল সমাধান:</strong></p>
<ol>
    <li>একটি ফ্ল্যাগ <code>isRefreshing = false</code> এবং একটি <code>BehaviorSubject&lt;string | null&gt;(null)</code> বজায় রাখা হয়।</li>
    <li>প্রথম 401 আসা মাত্র <code>isRefreshing = true</code> হয় এবং রিফ্রেশ টোকেন কল করে।</li>
    <li>পরবর্তী ৪টি রিকোয়েস্ট রিফ্রেশ কল না পাঠিয়ে <code>refreshTokenSubject</code> এর পাইপে ফিল্টার দিয়ে অপেক্ষা (Queue) করে থাকে।</li>
    <li>নতুন টোকেন সার্ভার থেকে ফেরত আসা মাত্র <code>refreshTokenSubject.next(newToken)</code> ফায়ার হয় এবং কিউতে অপেক্ষারত সমস্ত রিকোয়েস্ট নতুন হেডার নিয়ে সফলভাবে সার্ভারে পৌঁছায়।</li>
</ol>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Browser Rendering Engine',
    q: '৫০. Browser Rendering Pipeline (Layout, Paint, Composite) কী? CSS GPU Acceleration কীভাবে 60 FPS নিশ্চিত করে?',
    a: `<p>ব্রাউজার স্ক্রিনে কোনো সিএসএস রেন্ডার করতে ৩টি ধাপ পার করে:</p>
<ol>
    <li><strong>Layout (Reflow):</strong> এলিমেন্টের জ্যামিতিক আকার ও পজিশন গণনা করে। <code>width, height, margin, top, left</code> পরিবর্তন করলে পুরো পেজের লেআউট রি-ক্যালকুলেট হয় (সবচেয়ে ব্যয়বহুল)।</li>
    <li><strong>Paint (Repaint):</strong> পিক্সেলগুলো রঙ ও ব্যাকগ্রাউন্ড দিয়ে আঁকে। <code>color, background-color, box-shadow</code> পরিবর্তন করলে পেইন্ট হয়।</li>
    <li><strong>Composite:</strong> আঁকা লেয়ারগুলোকে GPU-তে একত্রিত করে স্ক্রিনে ডিসপ্লে করে।</li>
</ol>
<p><strong>GPU Acceleration:</strong> শুধুমাত্র <code>transform</code> (যেমন <code>translate3d</code>) এবং <code>opacity</code> প্রোপার্টি সরাসরি GPU-তে নিজস্ব কম্পোজিটিং লেয়ারে কাজ করে—Layout বা Paint ফেজকে সম্পূর্ণ বাইপাস করে। ফলে ভারী অ্যানিমেশনেও কোনো সিপিইউ ফ্রেম ড্রপ বা ল্যাগ (Jank) হয় না এবং মসৃণ ৬০ FPS বজায় থাকে।</p>`
  },

  // ==========================================
  // TOPIC 4: SYSTEM DESIGN & MICROSERVICES
  // ==========================================
  {
    topic: 'systemdesign',
    level: 'mid',
    badge: 'Architecture Paradigm',
    q: '৫১. Monolithic বনাম Microservices Architecture: কখন মাইক্রোসার্ভিসে যাবেন এবং কখন যাবেন না?',
    a: `<p><strong>Monolith:</strong> সমস্ত বিজনেস মডিউল একটি একক কোডবেস এবং একক ডেপ্লয়েবল ইউনিট হিসেবে রান করে।</p>
<ul>
    <li><em>সুবিধা:</em> দ্রুত ডেভেলপমেন্ট, সহজ ডিবাগিং, কোনো নেটওয়ার্ক ল্যাটেন্সি নেই, সিঙ্গেল ডাটাবেজ ট্রানজ্যাকশন (ACID)।</li>
    <li><em>অসুবিধা:</em> টিম বড় হলে কোড কনফ্লিক্ট বাড়ে, যেকোনো ছোট পরিবর্তনের জন্য পুরো সিস্টেম রি-ডেপ্লয় করতে হয়।</li>
</ul>
<p><strong>Microservices:</strong> ব্যবসায়িক ডোমেইন অনুযায়ী স্বাধীন ছোট ছোট সার্ভিস (যেমন: User, Order, Payment) যা নিজস্ব ডাটাবেজ মেইনটেইন করে এবং নেটওয়ার্কে (REST/gRPC/Kafka) যোগাযোগ করে।</p>
<p><strong>কখন যাবেন না:</strong> স্টার্টআপ বা প্রজেক্টের প্রাথমিক পর্যায়ে কখনই মাইক্রোসার্ভিস শুরু করবেন না (Martin Fowler's Monolith First)। ডিস্ট্রিবিউটেড সিস্টেমের ওভারহেড (নেটওয়ার্ক ফেইলিওর, ডেটা ইনকনসিস্টেন্সি, সিআই/সিডি জটিলতা) ছোট টিমের সক্ষমতা নষ্ট করে দেয়। যখন কোনো নির্দিষ্ট মডিউলে অস্বাভাবিক ট্রাফিক আসে বা ১০০+ ইঞ্জিনিয়ারের দল স্বাধীনভাবে কাজ করতে চায়, কেবল তখনই মাইক্রোসার্ভিসে ভাগ করুন।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'mid',
    badge: 'Scalability & Balancing',
    q: '৫২. Horizontal vs Vertical Scaling কী? Load Balancing এর প্রধান অ্যালগরিদমগুলো কী কী?',
    a: `<p><strong>Vertical Scaling (Scale Up):</strong> বিদ্যমান সিঙ্গেল সার্ভারে আরও বেশি CPU, RAM বা SSD যুক্ত করা। একটি নির্দিষ্ট হার্ডওয়্যার লিমিটের পর এটি অত্যন্ত ব্যয়বহুল এবং এটি Single Point of Failure (SPOF)।</p>
<p><strong>Horizontal Scaling (Scale Out):</strong> ট্রাফিক সামলাতে লোড ব্যালেন্সারের পেছনে একের অধিক সাধারণ কমোডোটি সার্ভার ইনস্ট্যান্স যুক্ত করা। আধুনিক ক্লাউড সিস্টেমে এটিই মূল আর্কিটেকচার।</p>
<p><strong>প্রধান লোড ব্যালেন্সিং অ্যালগরিদম:</strong></p>
<ul>
    <li><strong>Round Robin:</strong> রিকোয়েস্টগুলোকে একে একে ক্রমানুসারে প্রতিটি সার্ভারে পাঠায়।</li>
    <li><strong>Least Connections:</strong> বর্তমানে যে সার্ভারে সবচেয়ে কম সংখ্যক অ্যাক্টিভ ক্লায়েন্ট কানেকশন রয়েছে সেখানে পাঠায় (দীর্ঘস্থায়ী ট্রানজ্যাকশনের জন্য সেরা)।</li>
    <li><strong>IP Hash:</strong> ক্লায়েন্টের আইপি অ্যাড্রেস হ্যাশ করে সর্বদা একই নির্দিষ্ট সার্ভারে পাঠায় (Session Affinity / Sticky Session)।</li>
</ul>`
  },
  {
    topic: 'systemdesign',
    level: 'mid',
    badge: 'API Protocols',
    q: '৫৩. REST বনাম gRPC বনাম GraphQL এর আর্কিটেকচারাল ট্রেড-অফ ব্যাখ্যা করুন।',
    a: `<p><strong>REST (HTTP/1.1 + JSON):</strong> সার্বজনীন ও সহজ ডিবাগিংযোগ্য। ব্রাউজার টু ব্যাকএন্ড পাবলিক এপিআই-র জন্য ডি-ফ্যাক্টো স্ট্যান্ডার্ড। কিন্তু টেক্সট-বেসড হওয়ায় পেলোড বড় হয়।</p>
<p><strong>gRPC (HTTP/2 + Protocol Buffers):</strong> বাইনারি সিরিয়ালাইজেশন ফরম্যাট। অত্যন্ত দ্রুত এবং ব্যান্ডউইথ খরচ JSON-এর তুলনায় ৭০% কম। একই TCP কানেকশনে মাল্টিপ্লেক্সিং ও বাই-ডিরেকশনাল স্ট্রিমিং সমর্থন করে। <em>ব্যবহার:</em> ইন্টারনাল মাইক্রোসার্ভিস টু মাইক্রোসার্ভিস হাই-পারফরম্যান্স যোগাযোগ।</p>
<p><strong>GraphQL:</strong> ক্লায়েন্ট একটি একক এন্ডপয়েন্টে কোয়েরি পাঠিয়ে ঠিক যে যে ফিল্ড দরকার শুধুমাত্র সেগুলোই চায়। মোবাইল অ্যাপ্লিকেশনে Over-fetching এবং Under-fetching সম্পূর্ণ দূর করে।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'mid',
    badge: 'Distributed Systems',
    q: '৫৪. Idempotency Key কী এবং পেমেন্ট সিস্টেমে কেন এটি অত্যন্ত গুরুত্বপূর্ণ?',
    a: `<p>ডিস্ট্রিবিউটেড সিস্টেমে নেটওয়ার্ক ফেইলিওরের কারণে ক্লায়েন্ট একই রিকোয়েস্ট একাধিকবার পাঠাতে পারে। যদি ইউজার পেমেন্ট করার পর টাইমআউট পেয়ে পুনরায় সাবমিট করে, তার কার্ড থেকে দুবার টাকা কাটা একটি মারাত্মক বাগ।</p>
<p><strong>Idempotency Key:</strong> ক্লায়েন্ট প্রতি ট্রানজ্যাকশনে একটি ইউনিক <code>Idempotency-Key: UUID</code> হেডারে পাঠায়। সার্ভার ডাটাবেজ বা Redis এ চেক করে কি-টি ইতোমধ্যে প্রসেস হয়েছে কি না। প্রসেস হয়ে থাকলে সে পুনরায় চার্জ না করে পূর্বের সেভ করা রেজাল্ট রিটার্ন করে।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Microservices Data',
    q: '৫৫. Dual-Write Problem কী এবং Transactional Outbox Pattern কীভাবে ডেটা কনসিস্টেন্সি রক্ষা করে?',
    a: `<p>যখন একটি সার্ভিস একই সাথে ডাটাবেজে অর্ডার সেভ করে এবং কাফকাতে ইভেন্ট পাবলিশ করতে চায়: ডাটাবেজ সেভ সফল হলেও যদি কাফকা ডাউন থাকার কারণে মেসেজ ড্রপ হয়, তবে সিস্টেম স্থায়ীভাবে ইনকনসিস্টেন্ট হয়ে যায়।</p>
<p><strong>Transactional Outbox:</strong> কাফকাতে সরাসরি না পাঠিয়ে, একই লোকাল ডাটাবেজ ট্রানজ্যাকশনে <code>Orders</code> এবং <code>OutboxMessages</code> টেবিলে ইভেন্ট সেভ করা হয় (Atomic Commit)। এরপর একটি ব্যাকগ্রাউন্ড মেসেজ রিলে (যেমন Debezium CDC) ডাটাবেজের ট্রানজ্যাকশন লগ পড়ে কাফকাতে পুশ করে। এটি নেটওয়ার্ক ক্র্যাশেও মেসেজ হারানোর ঝুঁকি সম্পূর্ণ দূর করে (At-least-once delivery)।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Fault Tolerance',
    q: '৫৬. Circuit Breaker (Polly) এর ৩টি স্টেট কীভাবে ক্যাসকেডিং ফেইলিওর ঠেকায়?',
    a: `<p>যখন কোনো ডাউনস্ট্রিম থার্ড-পার্টি সার্ভিস (যেমন SMS গেটওয়ে বা পেমেন্ট গেটওয়ে) ডাউন থাকে, ইনকামিং হাজার হাজার রিকোয়েস্ট থ্রেড ব্লক করে বসে থাকে এবং এক সার্ভিসের কারণে পুরো ক্লাস্টার ভেঙে পড়ে (Cascading Failure)।</p>
<p><strong>Circuit Breaker ৩টি স্টেটে পরিচালিত হয়:</strong></p>
<ul>
    <li><strong>Closed (স্বাভাবিক):</strong> রিকোয়েস্ট স্বাভাবিকভাবে পাস হয় এবং ফেইলিওর রেট পর্যবেক্ষণ করা হয়।</li>
    <li><strong>Open (সার্কিট ব্রেক):</strong> ফেইলিওর রেট ৫০% অতিক্রম করলে সার্কিট ওপেন হয়ে যায়। ডাউনস্ট্রিমে কোনো নেটওয়ার্ক কল না পাঠিয়ে তাৎক্ষণিকভাবে ফলব্যাক ক্যাশ ডাটা বা এরর রেসপন্স ফেরত দেয়।</li>
    <li><strong>Half-Open (টেস্টিং):</strong> নির্দিষ্ট বিরতির পর ১-২টি ট্রায়াল রিকোয়েস্ট পাঠায়। সফল হলে স্বাভাবিক স্টেটে ফেরে, ফেইল হলে আবার ওপেন স্টেটে লক থাকে।</li>
</ul>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Distributed Transactions',
    q: '৫৭. Distributed Transactions: Two-Phase Commit (2PC) বনাম Saga Pattern (Choreography vs Orchestration)?',
    a: `<p><strong>Two-Phase Commit (2PC):</strong> একটি সেন্ট্রাল কোঅর্ডিনেটর সমস্ত পার্টিসিপ্যান্ট নোডকে লক করে এবং ২ ধাপে প্রিপেয়ার ও কমিট করায়। ক্লাউড বা মাইক্রোসার্ভিসে এটি অ্যান্টি-প্যাটার্ন কারণ নেটওয়ার্ক পার্টিশনে পুরো সিস্টেম লক হয়ে থমকে যায় এবং হাই ল্যাটেন্সি তৈরি করে।</p>
<p><strong>Saga Pattern:</strong> লোকাল ট্রানজ্যাকশনের একটি ধারাবাহিক সিকোয়েন্স। যদি কোনো ধাপ ব্যর্থ হয়, তবে আগের সমস্ত সফল ধাপকে রিভার্স করার জন্য <strong>Compensating Transaction</strong> চালানো হয়।</p>
<ul>
    <li><strong>Choreography (ইভেন্ট ভিত্তিক):</strong> প্রতিটি সার্ভিস নিজস্ব কাজ শেষ করে ইভেন্ট পাবলিশ করে এবং পরবর্তী সার্ভিস সেই ইভেন্ট শুনে নিজের কাজ শুরু করে। কোনো সেন্ট্রাল কন্ট্রোলার থাকে না (ছোট প্রজেক্টের জন্য ভালো)।</li>
    <li><strong>Orchestration (মাস্টার কোঅর্ডিনেটর):</strong> একটি সেন্ট্রাল অর্কেস্ট্রেটর (যেমন MassTransit State Machine) ধাপে ধাপে নির্দেশ পাঠায় এবং কোনো ধাপ ফেইল করলে সুনির্দিষ্ট ক্ষতিপূরণমূলক রোলব্যাক পরিচালনা করে (জটিল ফাইন্যান্সিয়াল সিস্টেমের জন্য সেরা)।</li>
</ul>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'Event Streaming',
    q: '৫৮. Apache Kafka Internals: Partition, Consumer Group, Rebalancing এবং Exactly-Once Semantics (EOS)?',
    a: `<p><strong>Topic & Partition:</strong> কাফকা টপিক এক বা একাধিক পার্টিশনে বিভক্ত থাকে যা ডিস্কে অ্যাপেন্ড-অনলি কমিট লগ হিসেবে থাকে। পার্টিশনই হলো কাফকার সমান্তরাল প্রসেসিং বা স্কেলিংয়ের একক।</p>
<p><strong>Consumer Group & Rebalancing:</strong> একটি কনজিউমার গ্রুপের একাধিক মেম্বারের মধ্যে পার্টিশনগুলো বণ্টন হয়। যদি কোনো কনজিউমার ক্র্যাশ করে, গ্রুপ কোঅর্ডিনেটর পার্টিশনগুলোকে পুনরায় সুস্থ কনজিউমারদের মাঝে পুনর্বণ্টন (Rebalance) করে দেয়।</p>
<p><strong>Exactly-Once Semantics (EOS):</strong> কাফকা ২.৫+ এ আইডেম্পোটেন্ট প্রডিউসার (<code>enable.idempotence=true</code>) এবং ট্রানজ্যাকশনাল প্রডিউসার দিয়ে নিশ্চিত করা হয় যে নেটওয়ার্ক ড্রপ হয়ে পুনরায় মেসেজ পাঠালেও কনজিউমার ডুপ্লিকেট মেসেজ পাবে না এবং এন্ড-টু-এন্ড ডাটা একবারই প্রসেস হবে।</p>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'High Scale Case Study',
    q: '৫৯. ফ্ল্যাশ সেল বা টিকিট বুকিং সিস্টেমে লাখ লাখ কনকারেন্ট ট্রাফিকে ডাটাবেজ ক্র্যাশ না করিয়ে কীভাবে হ্যান্ডেল করবেন?',
    a: `<p><strong>ফ্ল্যাশ সেলে ডাটাবেজে সরাসরি হিট করা যাবে না:</strong></p>
<ol>
    <li><strong>ইন-মেমোরি স্টক ম্যানেজমেন্ট (Redis Lua Script):</strong> স্টকের সংখ্যা Redis-এ ক্যাশ রাখা হয়। <code>DECRBY</code> লজিকটি একটি সিঙ্গেল অ্যাটমিক Redis Lua স্ক্রিপ্টে চালানো হয়। স্টক ০ হলে ইনস্ট্যান্ট "Sold Out" বলে ফেরত পাঠিয়ে দেওয়া হয়—ডাটাবেজে কোনো কলই যাবে না।</li>
    <li><strong>অ্যাসিঙ্ক অর্ডার প্লেসমেন্ট (Kafka Queue):</strong> যারা স্টক সফলভাবে ডিক্রিমেন্ট করতে পেরেছে তাদের অর্ডার ইভেন্ট কাফকা কিউতে পাঠিয়ে দেওয়া হয়।</li>
    <li><strong>ডাটাবেজ ব্যাচ রাইটার:</strong> ব্যাকগ্রাউন্ড ওয়ার্কার সার্ভিস কাফকা থেকে প্রতি সেকেন্ডে ১০০-২০০টি করে অর্ডার ব্যাচ আকারে ডাটাবেজে পারসিস্ট করে।</li>
</ol>`
  },
  {
    topic: 'systemdesign',
    level: 'senior',
    badge: 'API Rate Limiting',
    q: '৬০. API Rate Limiting: Token Bucket, Leaky Bucket এবং Sliding Window Counter এর মেকানিক্স ব্যাখ্যা করুন।',
    a: `<p><strong>Token Bucket:</strong> একটি নির্দিষ্ট ধারণক্ষমতার বালতিতে প্রতি সেকেন্ডে নির্দিষ্ট হারে টোকেন জমা হয়। রিকোয়েস্ট এলে বালতি থেকে ১টি টোকেন নিয়ে পাস হয়। বালতি ফাঁকা থাকলে রিকোয়েস্ট বাতিল (HTTP 429)। এটি সাময়িক ট্রাফিক বাস্ট (Burst Traffic) অনুমোদন করে।</p>
<p><strong>Leaky Bucket:</strong> রিকোয়েস্টগুলো কিউতে জমা হয় এবং নিচের ছিদ্র দিয়ে স্থির গতিতে প্রসেস হয়। আউটফ্লো রেট সর্বদা ধ্রুবক থাকে (কোনো বাস্ট অ্যালাউ করে না)।</p>
<p><strong>Sliding Window Counter (Redis):</strong> বর্তমান সময় এবং বিগত ৬০ সেকেন্ডের বাউন্ডারিকে স্লাইডিং উইন্ডো আকারে পর্যবেক্ষণ করে। এটি ফিক্সড উইন্ডোর মতো বাউন্ডারি স্পাইক সমস্যা তৈরি করে না এবং রিয়েল-টাইমে নিখুঁত রেট লিমিট নিশ্চিত করে।</p>`
  },

  // ==========================================
  // TOPIC 5: SERVER MANAGEMENT & DEVOPS
  // ==========================================
  {
    topic: 'devops',
    level: 'junior',
    badge: 'Hosting Environments',
    q: '৬১. Windows Server IIS বনাম Linux Hosting for .NET: কোনটি কখন বেছে নেবেন?',
    a: `<p><strong>Windows Server (IIS):</strong></p>
<ul>
    <li>লেগাসি .NET Framework অ্যাপ এবং Active Directory (Windows Authentication) বা COM+ ইন্টারপ থাকলে এটি বাধ্যতামূলক।</li>
    <li>উইন্ডোজ সার্ভার লাইসেন্সিং কস্ট অনেক বেশি এবং রিমোট ম্যানেজমেন্টে রিসোর্স বেশি লাগে।</li>
</ul>
<p><strong>Linux (Ubuntu / Alpine with Kestrel):</strong></p>
<ul>
    <li>আধুনিক .NET 8/9 সম্পূর্ণ ক্রস-প্লাটফর্ম। লিনাক্সে রানটাইম মেমোরি অনেক হালকা থাকে এবং লাইসেন্সিং খরচ ০%।</li>
    <li>ডকার কন্টেইনার এবং কুবারনেটিসে লিনাক্স বেসড ইমেজ অত্যন্ত ক্ষুদ্র (৮০ MB) এবং সেকেন্ডের ভগ্নাংশে স্কেল হতে পারে।</li>
</ul>`
  },
  {
    topic: 'devops',
    level: 'mid',
    badge: 'IIS Architecture',
    q: '৬২. In-Process বনাম Out-of-Process Hosting in IIS (AspNetCoreModuleV2) এর পার্থক্য কী?',
    a: `<p><strong>In-Process Hosting (ডিফল্ট ও দ্রুততম):</strong> ASP.NET Core অ্যাপ সরাসরি IIS-এর ওয়ার্কার প্রসেসের (<code>w3wp.exe</code>) ভেতর রান করে। ফলে IIS এবং Kestrel-এর মাঝে কোনো নেটওয়ার্ক লুপব্যাক রাউন্ডট্রিপ থাকে না। এটি প্রায় ৩-৪ গুণ বেশি পারফরম্যান্স দেয়।</p>
<p><strong>Out-of-Process Hosting:</strong> IIS শুধুমাত্র একটি রিভার্স প্রক্সি হিসেবে কাজ করে এবং আসল অ্যাপটি বাইরে আলাদা প্রসেসে <code>dotnet.exe</code> হিসেবে Kestrel সার্ভারে রান করে। এদের মধ্যে লোকাল পোর্ট বা পাইপ দিয়ে যোগাযোগ হয়।</p>`
  },
  {
    topic: 'devops',
    level: 'mid',
    badge: 'DevOps Secrets',
    q: '৬৩. প্রোডাকশন কনফিগারেশন এবং সিক্রেটস ম্যানেজমেন্ট কীভাবে করবেন? appsettings.json এ পাসওয়ার্ড রাখা কেন অপরাধ?',
    a: `<p><code>appsettings.json</code> ফাইলে ডাটাবেজ পাসওয়ার্ড বা API Secret রাখলে তা গিট রিপোজিটরিতে চলে যাওয়ার মারাত্মক ঝুঁকি থাকে, যা সবচেয়ে সাধারণ ডেটা ব্রিচের কারণ।</p>
<p><strong>আধুনিক প্রোডাকশন নিয়মাবলী:</strong></p>
<ol>
    <li><strong>Environment Variables:</strong> প্রোডাকশনে ওএস এনভায়রনমেন্ট ভ্যারিয়েবল ব্যবহার করা হয়। .NET স্বয়ংক্রিয়ভাবে <code>ConnectionStrings__DefaultConnection</code> ডবল আন্ডারস্কোরকে নেস্টেড কনফিগারেশন হিসেবে ম্যাপ করে নেয়।</li>
    <li><strong>Azure Key Vault / HashiCorp Vault:</strong> সেন্ট্রালাইজড এনক্রিপ্টেড সিক্রেট স্টোর যেখান থেকে অ্যাপ স্টার্টআপে মেমোরিতে সিক্রেট ফেচ করে নেয়।</li>
    <li><strong>Secret Scanning:</strong> সিআই/সিডি পাইপলাইনে গিটহিট প্রতিরোধে Trivy বা GitGuardian দিয়ে স্ক্যান করা।</li>
</ol>`
  },
  {
    topic: 'devops',
    level: 'mid',
    badge: 'Docker Best Practice',
    q: '৬৪. ডকার মাল্টি-স্টেজ বিল্ড (Multi-stage Build) কেন প্রোডাকশন ইমেজের জন্য অপরিহার্য?',
    a: `<p>.NET SDK ইমেজ সাইজে প্রায় ৮৫০ MB এবং এর ভেতর কম্পাইলার টুলস ও সোর্স কোড থাকে যা প্রোডাকশনে অপ্রয়োজনীয় এবং সিকিউরিটি ঝুঁকি তৈরি করে।</p>
<p><strong>Multi-stage Build:</strong> প্রথম স্টেজে SDK ইমেজ দিয়ে কোড কম্পাইল করা হয় এবং ফাইনাল স্টেজে শুধুমাত্র হালকা Alpine বা Chiseled রানটাইম ইমেজে পাবলিশড ফাইলগুলো কপি করা হয়। ফলে ফাইনাল ইমেজ সাইজ নেমে আসে মাত্র ৮০ MB-তে এবং অ্যাটাক সারফেস ৯০% কমে যায়।</p>`
  },
  {
    topic: 'devops',
    level: 'mid',
    badge: 'Container Orchestration',
    q: '৬৫. Docker Compose দিয়ে লোকাল ডেভেলপমেন্টে ফুল-স্ট্যাক মাইক্রোসার্ভিস এনভায়রনমেন্ট কীভাবে সাজাবেন?',
    a: `<p><code>docker-compose.yml</code> ফাইলে একই নেটওয়ার্কে Web API, PostgreSQL, Redis এবং RabbitMQ কনফিগার করে সিঙ্গেল কমান্ডে (<code>docker compose up -d</code>) সম্পূর্ণ ডেভেলপমেন্ট এনভায়রনমেন্ট তৈরি করা যায়:</p>
<ul>
    <li><strong>Bridge Network:</strong> সার্ভিসগুলো লোকালহোস্ট আইপি ছাড়া সরাসরি সার্ভিসের নামে (যেমন <code>host=db</code> বা <code>host=redis</code>) যোগাযোগ করতে পারে।</li>
    <li><strong>Volumes:</strong> কন্টেইনার ডিলিট হলেও লোকাল ডিস্কে ডাটাবেজের সমস্ত ডাটা পারসিস্টেন্ট থাকে।</li>
    <li><strong>Healthcheck:</strong> ডাটাবেজ পুরোপুরি রেডি হওয়ার পরই কেবল ওয়েব এপিআই স্টার্ট হতে বাধ্য করা যায় (<code>depends_on: condition: service_healthy</code>)।</li>
</ul>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Live Diagnostics',
    q: '৬৬. লাইভ প্রোডাকশনে মেমোরি লিক হলে অ্যাপ বন্ধ না করে কীভাবে dotnet-dump দিয়ে রুট-কজ বের করবেন?',
    a: `<ol>
    <li><code>dotnet-dump collect -p &lt;PID&gt;</code> দিয়ে রানিং অ্যাপ্লিকেশনের মেমোরি স্ন্যাপশট ডাম্প ফাইল সেভ করুন।</li>
    <li><code>dotnet-dump analyze dump.dmp</code> দিয়ে অ্যানালিসিস শেল ওপেন করুন।</li>
    <li><code>dumpheap -stat</code> কমান্ড দিলে হিপে কোন নির্দিষ্ট ক্লাস কোটি কোটি অবজেক্ট এবং শত শত মেগাবাইট দখল করে আছে তার তালিকা দেখাবে।</li>
    <li>ম্যাজিক কমান্ড <code>gcroot &lt;Address&gt;</code> দিয়ে দেখতে পাবেন কে এই অবজেক্টগুলোকে মেমোরিতে ধরে রেখে GC থেকে বাঁচিয়ে রেখেছে (যেমন: কোনো Static Event বা Singleton Cache)।</li>
</ol>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Production Troubleshooting',
    q: '৬৭. প্রোডাকশনে সিপিইউ ১০০% স্পাইক করলে dotnet-trace ও SpeedScope দিয়ে কীভাবে ইনফিনিট লুপ ডিবাগ করবেন?',
    a: `<p>অ্যাপ বন্ধ না করে সরাসরি সার্ভারে রান করুন:</p>
<pre><code>dotnet-trace collect --process-id &lt;PID&gt; --duration 00:00:30 --format Speedscope</code></pre>
<p>এটি ৩০ সেকেন্ডের জন্য মেমোরির কোনো ক্ষতি না করে এক্সিকিউটিং থ্রেডগুলোর স্যাম্পলিং প্রোফাইল রেকর্ড করে একটি <code>.speedscope.json</code> ফাইল তৈরি করবে।</p>
<p>ফাইলটি <strong>speedscope.app</strong> ওয়েবসাইটে আপলোড করলে একটি সুন্দর <strong>Flame Graph</strong> দেখতে পাবেন। যে মেথডটি স্ক্রিনের ৯০% প্রস্থ জুড়ে লাল হয়ে থাকবে, সেটাই হলো ইনফিনিট লুপ বা রেগুলার এক্সপ্রেশন ক্যাটাস্ট্রফিক ব্যাকট্র্যাকিং এর মূল অপরাধী।</p>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Linux Systemd Hardening',
    q: '৬৮. Linux এ ASP.NET Core কে নিরাপদ Systemd সার্ভিস হিসেবে কনফিগার করার প্রোডাকশন রেসিপি কী?',
    a: `<p><code>/etc/systemd/system/kestrel-app.service</code> কনফিগারেশনে সিনিয়র সিকিউরিটি সেটিংস:</p>
<pre><code>[Unit]
Description=.NET 8 Production API
After=network.target

[Service]
WorkingDirectory=/var/www/myapi
ExecStart=/usr/bin/dotnet /var/www/myapi/MyApi.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=dotnet-myapi
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

# সিকিউরিটি হার্ডেনিং
PrivateTmp=true
NoNewPrivileges=true
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target</code></pre>
<p>এখানে <code>User=www-data</code> নিশ্চিত করে কোনো অবস্থাতেই রুট ইউজার হিসেবে অ্যাপ চলবে না এবং ক্র্যাশ করলে ১০ সেকেন্ড পর নিজে থেকেই রিস্টার্ট নেবে।</p>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Nginx Web Server',
    q: '৬৯. Nginx Reverse Proxy দিয়ে SSL Termination, HTTP/2 এবং Upstream Connection Pooling কনফিগারেশন?',
    a: `<p>Nginx ফ্রন্টে থাকলে এটি ক্লায়েন্টের সাথে HTTPS হ্যান্ডশেক সম্পন্ন করে (SSL Termination) এবং পেছনের Kestrel-এ প্লেইন HTTP ফরোয়ার্ড করে CPU লোড বাঁচায়:</p>
<pre><code>upstream dotnet_backend {
    server 127.0.0.1:5000;
    keepalive 32;  # কানেকশন রিইউজ করে ল্যাটেন্সি কমায়
}

server {
    listen 443 ssl http2;
    server_name api.codex.com;
    
    ssl_certificate /etc/letsencrypt/live/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/privkey.pem;

    location / {
        proxy_pass http://dotnet_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}</code></pre>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'High Availability',
    q: '৭০. IIS এ Zero-Downtime Deployment এবং AppPool Recycling এর বিপদ কীভাবে এড়াবেন?',
    a: `<p><strong>বিপদ:</strong> IIS এর ডিফল্ট সেটিংসে ২০ মিনিট কোনো রিকোয়েস্ট না আসলে <strong>Idle Time-out</strong> হয়ে অ্যাপ বন্ধ হয়ে যায়। আবার ১৭৪০ মিনিট (২৯ ঘণ্টা) পর পর বা মেমোরি লিমিটে হঠাৎ <strong>AppPool Recycle</strong> হয়। এর ফলে ইনকামিং রিকোয়েস্ট কোল্ড স্টার্টের কারণে ১৫-২০ সেকেন্ড ল্যাগ খায়।</p>
<p><strong>প্রোডাকশন ফিক্স:</strong></p>
<ol>
    <li>AppPool Advanced Settings &rarr; <code>Idle Time-out (minutes) = 0</code>।</li>
    <li><code>Start Mode = AlwaysRunning</code> (সার্ভার রিস্টার্ট হলেও নিজে চালু থাকবে)।</li>
    <li>ওয়েবসাইট Advanced Settings &rarr; <code>Preload Enabled = True</code>।</li>
    <li><strong>Blue-Green Deployment:</strong> একই IIS সার্ভারে দুটি পোর্ট বা সাইট (Blue ও Green) রেখে ARR (Application Request Routing) বা ক্লাউডফ্লেয়ার দিয়ে ট্রাফিক সুইচ করলে ইউজাররা ০ মিলি-সেকেন্ডও ডাউনটাইম টের পায় না।</li>
</ol>`
  },

  // ==========================================
  // TOPIC 6: TECH LEADERSHIP & STAR METHOD
  // ==========================================
  {
    topic: 'leadership',
    level: 'senior',
    badge: 'Tech Lead Strategy',
    q: '৭১. প্রোডাক্ট ম্যানেজারের দ্রুত ফিচার রিলিজ চাপ এবং টিমের টেকনিক্যাল ডেট মেটানোর মধ্যে কীভাবে ভারসাম্য রাখবেন?',
    a: `<div class="star-box">
    <p class="mb-1"><strong>Situation & Task:</strong> নতুন ফিচারের চাপে কোড কোয়ালিটি ড্রপ করছিল এবং প্রোডাকশন বাগ রিলিজ রেট বৃদ্ধি পাচ্ছিল। প্রোডাক্ট টিম স্প্রিন্টে টেকনিক্যাল ডেট রিফ্যাক্টরিংয়ের সুযোগ দিতে চাইছিল না।</p>
    <p class="mb-1"><strong>Action:</strong> আমি টেকনিক্যাল ডেটকে বিমূর্ত কোড বা "ক্লিন কোড" বলে তর্ক না করে ব্যবসায়িক আর্থিক ক্ষতি হিসেবে উপস্থাপন করি (যেমন: বাগ ফিক্সিংয়ে সপ্তাহে ১৫ ইঞ্জিনিয়ারিং আওয়ার অপচয় এবং পেজ লোড ১.৫ সেকেন্ড স্লো হওয়ায় সেলস ড্রপ)। এরপর প্রোডাক্ট ওনারের সাথে আলোচনা করে স্প্রিন্টে <strong>৮০/২০ রুল</strong> বাস্তবায়ন করি (৮০% সময় বিজনেস ফিচার, ২০% সময় আর্কিটেকচারাল রিফ্যাক্টরিং)।</p>
    <p class="mb-0"><strong>Result:</strong> এতে বিজনেস টিমের ফিচার রিলিজ বন্ধ হয়নি, অথচ মাত্র ৩ মাসে প্রোডাকশন বাগরিলিজ রেট ৬০% কমে যায় এবং সিস্টেমের রিড ল্যাটেন্সি উল্লেখযোগ্য হারে হ্রাস পায়।</p>
</div>`
  },
  {
    topic: 'leadership',
    level: 'senior',
    badge: 'Engineering Alignment',
    q: '৭২. টিমের দুজন সিনিয়র ইঞ্জিনিয়ারের মধ্যে আর্কিটেকচারাল মতভেদ হলে টেক লিড হিসেবে কীভাবে সমাধান করবেন?',
    a: `<div class="star-box">
    <p class="mb-1"><strong>Situation & Task:</strong> একজন ইঞ্জিনিয়ার ইভেন্ট ড্রাইভেন কাফকা আর্কিটেকচার চাচ্ছিলেন, অপরজন সরল REST/gRPC ভিত্তিক সিনক্রোনাস কমিউনিকেশন ধরে রাখতে চাচ্ছিলেন। আলোচনা দীর্ঘায়িত হয়ে স্প্রিন্টের অগ্রগতি ব্যাহত হচ্ছিল।</p>
    <p class="mb-1"><strong>Action:</strong> আমি উভয়কে মৌখিক তর্কের বদলে একটি <strong>RFC (Request for Comments)</strong> ডকুমেন্ট তৈরি করতে বলি। সেখানে ৪টি সুনির্দিষ্ট মানদণ্ডে মূল্যায়ন করা হয়: ১. বর্তমান ও আগামী ১ বছরের সম্ভাব্য ট্রাফিক, ২. ইনফ্রাস্ট্রাকচার মেইনটেনেন্স জটিলতা ও ক্লাউড খরচ, ৩. টিমের লার্নিং কার্ভ, ৪. ফেইলিওর রিকভারি মেকানিজম। আমরা একটি টাইম-বক্সড প্রুফ-অব-কনসেপ্ট (PoC) চালাই।</p>
    <p class="mb-0"><strong>Result:</strong> ডেটার ভিত্তিতে স্পষ্ট হয় যে বর্তমান স্কেলে gRPC যথেষ্ট এবং কাফকার ওভারহেড অপ্রয়োজনীয়। উভয় ইঞ্জিনিয়ার যৌক্তিকভাবে সিদ্ধান্তে একমত হন (<em>"Disagree and Commit"</em> নীতি)।</p>
</div>`
  },
  {
    topic: 'leadership',
    level: 'senior',
    badge: 'People Mentorship',
    q: '৭৩. জুনিয়র ও মিড-লেভেল ইঞ্জিনিয়ারদের উচ্চ পারফর্মিং সিনিয়র ডেভলপারে রূপান্তরিত করার আপনার কৌশল কী?',
    a: `<div class="star-box">
    <p class="mb-1"><strong>পদ্ধতি ও দর্শন:</strong> কেবল মাইক্রোম্যানেজমেন্ট না করে দায়িত্ব অর্পণ ও মানসিক নিরাপত্তা (Psychological Safety) দেওয়া।</p>
    <p class="mb-1"><strong>কৌশল:</strong></p>
    <ul>
        <li><strong>নিয়মিত ১-অন-১ (Bi-weekly 1-on-1s):</strong> কেবল টাস্ক স্ট্যাটাস নয়, তাদের ক্যারিয়ার গ্রোথ, কোন প্রযুক্তি শিখতে চান এবং কোথায় ব্লক হচ্ছেন তা উন্মুক্ত আলোচনা।</li>
        <li><strong>কমপ্লেক্স সাবসিস্টেম ডেলিগেশন উইথ সেফটি নেট:</strong> জুনিয়র বা মিডদের পুরো একটি ফিচারের আর্কিটেকচারাল ডিজাইন ও ডাটাবেজ মডেলিংয়ের দায়িত্ব দেওয়া, তবে আমি কোড রিভিউ ও পেয়ার প্রোগ্রামিংয়ে সেফটি নেট হিসেবে থাকা।</li>
        <li><strong>কনস্ট্রাকটিভ কোড রিভিউ:</strong> শুধু "কোড ভুল হয়েছে" না বলে "কেন ভুল এবং এর লং-টার্ম কনসিকোয়েন্স কী হতে পারে" তা রেফারেন্স লিংক সহ বুঝিয়ে দেওয়া।</li>
    </ul>
    <p class="mb-0"><strong>ফলাফল:</strong> বিগত দুই বছরে আমার টিমের ৩ জন ডেভেলপার সফলভাবে সিনিয়র রোলে পদোন্নতি লাভ করেছেন।</p>
</div>`
  },
  {
    topic: 'leadership',
    level: 'senior',
    badge: 'Incident Management',
    q: '৭৪. প্রোডাকশনে বড় ধরণের বিভ্রাট (Major Outage) ঘটলে ইনসিডেন্ট ম্যানেজমেন্ট ও Blameless Post-Mortem কীভাবে পরিচালনা করেন?',
    a: `<div class="star-box">
    <p class="mb-1"><strong>লাইভ ইনসিডেন্টের সময়:</strong> টেক লিড হিসেবে শান্ত থেকে তাৎক্ষণিকভাবে <strong>Incident Commander</strong> এর ভূমিকা গ্রহণ করা। বিজনেস ও স্টেকহোল্ডারদের প্রতি ১৫ মিনিটে স্ট্যাটাস আপডেট দেওয়া যাতে ইঞ্জিনিয়াররা নিরবচ্ছিন্নভাবে ট্রাবলশুট করতে পারে। অগ্রাধিকার থাকে রুট কজ বের করার চেয়ে আগে সার্ভিস দ্রুত রিস্টোর (Mitigation) করা (যেমন ট্রাফিক ডাইভার্ট করা বা প্রিভিয়াস স্টেবল ভার্সনে রোলব্যাক করা)।</p>
    <p class="mb-1"><strong>ইনসিডেন্ট পরবর্তী (Blameless Post-Mortem):</strong> কোনো নির্দিষ্ট ব্যক্তিকে দোষারোপ না করে সিস্টেমের প্রসেসগত ফাঁকফোকর বের করা। আমরা <strong>5 Whys Methodology</strong> প্রয়োগ করি: "কেন ডাটাবেজ ডাউন হলো? কারণ কানেকশন পুল ফুল ছিল। কেন পুল ফুল ছিল? কারণ একটি স্লো কুয়েরি লক ধরে রেখেছিল। কেন স্লো কুয়েরি প্রোডাকশনে গেল? কারণ স্ট্রেস টেস্টে এই সিনারিও কভার করা হয়নি।"</p>
    <p class="mb-0"><strong>ফলাফল:</strong> অ্যাকশন আইটেম তৈরি করা (যেমন কুয়েরি অপ্টিমাইজেশন, কানেকশন টাইমআউট রিডিউস, এবং এলার্টিং থ্রেশহোল্ড সেট করা) যাতে একই ধরণের আউটেজ ভবিষ্যতে আর কখনো পুনরাবৃত্তি না ঘটে।</p>
</div>`
  }
];

const topicHeadersMap = {
  dotnet: {
    icon: 'bi-hash',
    color: 'text-primary',
    title: 'C# ও .NET কোর ইঞ্জিনিয়ারিং'
  },
  database: {
    icon: 'bi-database-fill-gear',
    color: 'text-info',
    title: 'ডাটাবেজ আর্কিটেকচার ও অপ্টিমাইজেশন (SQL Server, PostgreSQL, Oracle, Redis)'
  },
  frontend: {
    icon: 'bi-palette-fill',
    color: 'text-danger',
    title: 'ফ্রন্টএন্ড এন্টারপ্রাইজ মাস্টারি (Modern CSS3, jQuery, Angular 18)'
  },
  systemdesign: {
    icon: 'bi-diagram-3-fill',
    color: 'text-success',
    title: 'সিস্টেম ডিজাইন ও ডিস্ট্রিবিউটেড আর্কিটেকচার'
  },
  devops: {
    icon: 'bi-hdd-rack-fill',
    color: 'text-warning',
    title: 'সার্ভার ম্যানেজমেন্ট, DevOps ও প্রোডাকশন ক্র্যাশ অ্যানালিসিস'
  },
  leadership: {
    icon: 'bi-people-fill',
    color: 'text-dark',
    title: 'টেক লিডারশিপ ও STAR ফরম্যাট ইন্টারভিউ'
  }
};

function generateHtml(activePage) {
  let lastTopic = null;
  const cardsHtml = questions.map((item, idx) => {
    let headerHtml = '';
    if (item.topic !== lastTopic) {
      const info = topicHeadersMap[item.topic];
      headerHtml = `                <!-- TOPIC: ${item.topic.toUpperCase()} -->
                <div class="topic-heading-group mb-4 ${lastTopic ? 'mt-5' : ''}" data-topic-header="${item.topic}">
                    <div class="d-flex align-items-center gap-2 border-bottom pb-2 mb-3">
                        <i class="bi ${info.icon} fs-3 ${info.color}"></i>
                        <h3 class="fw-bold mb-0 text-primary">${info.title}</h3>
                    </div>
                </div>\n\n`;
      lastTopic = item.topic;
    }

    return `${headerHtml}                <!-- Q${idx + 1} (${item.level}) -->
                <div class="qa-card-box level-${item.level}" data-level="${item.level}" data-topic="${item.topic}">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="topic-badge-pill bg-primary-subtle text-primary border">${item.badge}</span>
                        <span class="level-tag tag-${item.level}">${item.level === 'junior' ? '🟢 Junior (0-2 Yrs)' : (item.level === 'mid' ? '🟡 Mid-Level (2-5 Yrs)' : '🔴 Senior / Lead (5-7+ Yrs)')}</span>
                    </div>
                    <div class="qa-header-row">
                        <h5 class="qa-question-title">${item.q}</h5>
                        <i class="bi bi-chevron-down qa-toggle-icon"></i>
                    </div>
                    <div class="qa-answer-content">
                        ${item.a}
                    </div>
                </div>`;
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="জুনিয়র থেকে সিনিয়র ও টেক লিড (০ থেকে ৭+ বছর): সম্পূর্ণ সফটওয়্যার ইঞ্জিনিয়ারিং ইন্টারভিউ ক্র্যাকিং মাস্টার ভল্ট। C#, .NET, SQL, Postgres, Oracle, CSS, jQuery, Angular, System Design ও DevOps।">
    <title>মাস্টার ইন্টারভিউ ভল্ট (Junior to Senior 7+ Years) | Codex</title>
    <!-- Bootstrap 5 CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
    
    <style>
        .topic-badge-pill {
            font-size: 0.75rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
            display: inline-block;
        }
        .level-tag {
            font-size: 0.72rem;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .tag-junior {
            background: rgba(16, 185, 129, 0.12);
            color: #059669;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .tag-mid {
            background: rgba(245, 158, 11, 0.12);
            color: #d97706;
            border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .tag-senior {
            background: rgba(124, 58, 237, 0.12);
            color: #7c3aed;
            border: 1px solid rgba(124, 58, 237, 0.3);
        }
        .star-box {
            background: rgba(124, 58, 237, 0.05);
            border: 1px dashed var(--primary);
            border-radius: 10px;
            padding: 1rem;
            margin-top: 0.75rem;
        }
    </style>
</head>
<body>

    <!-- Theme Toggle Input -->
    <input type="checkbox" id="theme-toggle" class="d-none">

    <div class="app-container">

        <!-- Navigation Bar -->
        <nav class="navbar navbar-expand-lg custom-navbar py-3 sticky-top">
            <div class="container">
                <a class="navbar-brand d-flex align-items-center fs-3 fw-bold text-primary text-decoration-none" href="index.html">
                    <span style="background: var(--primary-grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        <i class="bi bi-code-slash me-2"></i>Codex
                    </span>
                </a>
                <div class="collapse navbar-collapse d-none d-lg-block ms-5">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
                        <li class="nav-item"><a class="nav-link" href="index.html">হোম</a></li>
                        <li class="nav-item"><a class="nav-link" href="courses.html">টিউটোরিয়ালসমূহ</a></li>
                        <li class="nav-item"><a class="nav-link" href="dashboard.html">ড্যাশবোর্ড</a></li>
                        <li class="nav-item"><a class="nav-link active" href="senior-interview-vault.html">ইন্টারভিউ ভল্ট</a></li>
                        <li class="nav-item"><a class="nav-link" href="blog.html">ব্লগ</a></li>
                    </ul>
                </div>
                <div class="d-flex align-items-center gap-3 ms-auto">
                    <label for="theme-toggle" class="theme-switch-label">
                        <i class="bi bi-sun"></i>
                        <i class="bi bi-moon-stars"></i>
                    </label>
                    <a href="dashboard.html" class="btn btn-premium-outline d-none d-lg-inline-block">ড্যাশবোর্ড</a>
                </div>
            </div>
        </nav>

        <!-- Header Hero Section -->
        <section class="py-5 text-center fade-in-up bg-light-subtle border-bottom">
            <div class="container">
                <div class="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill border bg-primary-subtle text-primary border-primary-subtle mb-3">
                    <i class="bi bi-patch-check-fill"></i>
                    <span class="fs-7 fw-bold">All-in-One Interview Playbook (Junior • Mid • Senior 7+ Years)</span>
                </div>
                <h1 class="display-4 fw-extrabold mb-3">মাস্টার ইঞ্জিনিয়ারিং ইন্টারভিউ ভল্ট</h1>
                <p class="text-muted fs-5 max-w-700 mx-auto mb-4">
                    ফ্রেশ গ্র্যাজুয়েট ও জুনিয়র থেকে শুরু করে ৭+ বছরের অভিজ্ঞ সিনিয়র আর্কিটেক্ট ও টেক লিড পদের সমস্ত প্রশ্নোত্তর, ইন্টারনাল মেকানিক্স ও বাস্তব প্রোডাকশন ট্রাবলশুটিং গাইড।
                </p>

                <!-- Search Input Bar -->
                <div class="vault-search-container">
                    <i class="bi bi-search vault-search-icon"></i>
                    <input type="text" id="vaultSearchInput" class="vault-search-input" placeholder="যেকোনো বিষয় বা প্রশ্ন খুঁজুন... (যেমন: GC, Deadlock, Signals, Docker, Span, Kafka, Outbox)">
                    <button id="vaultClearBtn" class="vault-clear-btn" title="মুছে ফেলুন"><i class="bi bi-x-circle-fill"></i></button>
                </div>

                <!-- Level Filter Pills -->
                <div class="level-filter-bar">
                    <button class="level-btn active" data-level="all"><i class="bi bi-grid-fill"></i>সব লেভেল (<span id="count-all">${questions.length}</span>)</button>
                    <button class="level-btn btn-junior" data-level="junior"><i class="bi bi-check-circle-fill"></i>🟢 জুনিয়র (০-২ বছর)</button>
                    <button class="level-btn btn-mid" data-level="mid"><i class="bi bi-lightning-fill"></i>🟡 মিড-লেভেল (২-৫ বছর)</button>
                    <button class="level-btn btn-senior" data-level="senior"><i class="bi bi-stars"></i>🔴 সিনিয়র ও লিড (৫-৭+ বছর)</button>
                </div>

                <!-- Topic Category Badges -->
                <div class="d-flex justify-content-center gap-2 flex-wrap mb-2">
                    <button class="topic-btn badge bg-secondary-subtle text-secondary border px-3 py-2 active" data-topic="all">সব টপিক</button>
                    <button class="topic-btn badge bg-primary-subtle text-primary border px-3 py-2" data-topic="dotnet">C# ও .NET</button>
                    <button class="topic-btn badge bg-info-subtle text-info border px-3 py-2" data-topic="database">ডাটাবেজসমূহ</button>
                    <button class="topic-btn badge bg-danger-subtle text-danger border px-3 py-2" data-topic="frontend">ফ্রন্টএন্ড (CSS/jQuery/Angular)</button>
                    <button class="topic-btn badge bg-success-subtle text-success border px-3 py-2" data-topic="systemdesign">সিস্টেম ডিজাইন</button>
                    <button class="topic-btn badge bg-warning-subtle text-warning border px-3 py-2" data-topic="devops">সার্ভার ও DevOps</button>
                    <button class="topic-btn badge bg-dark-subtle text-dark border px-3 py-2" data-topic="leadership">লিডারশিপ ও STAR</button>
                </div>

                <!-- Expand / Collapse All Controls -->
                <div class="d-flex justify-content-center gap-3 mt-4">
                    <button id="btnExpandAll" class="btn btn-sm btn-premium-outline py-1 px-3"><i class="bi bi-arrows-expand me-1"></i>সব উত্তর উন্মুক্ত করুন</button>
                    <button id="btnCollapseAll" class="btn btn-sm btn-premium-outline py-1 px-3"><i class="bi bi-arrows-collapse me-1"></i>সব উত্তর বন্ধ করুন (সেলফ টেস্ট)</button>
                </div>
            </div>
        </section>

        <!-- Main Questions Container -->
        <main class="container py-5">
            <div class="max-w-900 mx-auto">
                <div id="noResultsMsg" class="alert alert-info text-center py-4 d-none">
                    <i class="bi bi-info-circle display-4 mb-2 d-block text-primary"></i>
                    <h5 class="fw-bold">কোনো প্রশ্ন পাওয়া যায়নি!</h5>
                    <p class="text-muted mb-0">অনুগ্রহ করে ভিন্ন কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা ফিল্টার পরিবর্তন করুন।</p>
                </div>

${cardsHtml}

            </div>
        </main>

        <!-- Floating Back To Top Button -->
        <button id="btnBackToTop" class="floating-back-to-top" title="উপরে যান">
            <i class="bi bi-arrow-up"></i>
        </button>

        <!-- Mobile App Bottom Navigation Bar (App-Like Experience for Phone Users) -->
        <div class="mobile-bottom-nav">
            <a href="index.html" class="mobile-nav-link">
                <i class="bi bi-house-door"></i>
                <span>হোম</span>
            </a>
            <a href="courses.html" class="mobile-nav-link">
                <i class="bi bi-grid"></i>
                <span>ট্র্যাকসমূহ</span>
            </a>
            <a href="senior-interview-vault.html" class="mobile-nav-link active">
                <i class="bi bi-trophy-fill"></i>
                <span>ইন্টারভিউ</span>
            </a>
            <a href="dashboard.html" class="mobile-nav-link">
                <i class="bi bi-speedometer2"></i>
                <span>ড্যাশবোর্ড</span>
            </a>
            <label for="theme-toggle" class="mobile-nav-link cursor-pointer m-0">
                <i class="bi bi-moon-stars"></i>
                <span>থিম</span>
            </label>
        </div>

        <!-- Footer -->
        <footer class="footer mt-auto">
            <div class="container text-center pt-4 border-top">
                <p class="text-muted mb-0">&copy; 2026 Codex Ltd. সর্বস্বত্ব সংরক্ষিত।</p>
            </div>
        </footer>

    </div>

    <!-- Client-Side Instant Search, Level Filter & Expand Engine (Zero-Dependency) -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('vaultSearchInput');
            const clearBtn = document.getElementById('vaultClearBtn');
            const levelBtns = document.querySelectorAll('.level-btn');
            const topicBtns = document.querySelectorAll('.topic-btn');
            const qaCards = document.querySelectorAll('.qa-card-box');
            const topicHeaders = document.querySelectorAll('[data-topic-header]');
            const noResultsMsg = document.getElementById('noResultsMsg');
            const btnExpandAll = document.getElementById('btnExpandAll');
            const btnCollapseAll = document.getElementById('btnCollapseAll');
            const btnBackToTop = document.getElementById('btnBackToTop');

            let currentLevel = 'all';
            let currentTopic = 'all';

            // Floating Back to Top Button
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    btnBackToTop.classList.add('visible');
                } else {
                    btnBackToTop.classList.remove('visible');
                }
            });

            btnBackToTop.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Toggle Individual Card on click
            qaCards.forEach(card => {
                const header = card.querySelector('.qa-header-row');
                header.addEventListener('click', () => {
                    card.classList.toggle('expanded');
                });
            });

            // Expand / Collapse All
            btnExpandAll.addEventListener('click', () => {
                qaCards.forEach(c => c.classList.add('expanded'));
            });
            btnCollapseAll.addEventListener('click', () => {
                qaCards.forEach(c => c.classList.remove('expanded'));
            });

            // Search filter logic
            function filterVault() {
                const query = searchInput.value.toLowerCase().trim();
                let visibleCount = 0;

                qaCards.forEach(card => {
                    const cardLevel = card.getAttribute('data-level');
                    const cardTopic = card.getAttribute('data-topic');
                    const text = card.textContent.toLowerCase();

                    const matchesLevel = (currentLevel === 'all' || cardLevel === currentLevel);
                    const matchesTopic = (currentTopic === 'all' || cardTopic === currentTopic);
                    const matchesSearch = (!query || text.includes(query));

                    if (matchesLevel && matchesTopic && matchesSearch) {
                        card.style.display = 'block';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Handle topic section headers visibility
                topicHeaders.forEach(header => {
                    const topic = header.getAttribute('data-topic-header');
                    const matchingVisible = Array.from(qaCards).some(c => c.getAttribute('data-topic') === topic && c.style.display !== 'none');
                    header.style.display = matchingVisible ? 'block' : 'none';
                });

                // No results message
                if (visibleCount === 0) {
                    noResultsMsg.classList.remove('d-none');
                } else {
                    noResultsMsg.classList.add('d-none');
                }

                // Clear button visibility
                if (query.length > 0) {
                    clearBtn.style.display = 'block';
                } else {
                    clearBtn.style.display = 'none';
                }
            }

            // Search input listeners
            searchInput.addEventListener('input', filterVault);
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                searchInput.focus();
                filterVault();
            });

            // Level Buttons listener
            levelBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    levelBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentLevel = this.getAttribute('data-level');
                    filterVault();
                });
            });

            // Topic Buttons listener
            topicBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    topicBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentTopic = this.getAttribute('data-topic');
                    filterVault();
                });
            });

            // Initial count
            document.getElementById('count-all').textContent = qaCards.length;
        });
    </script>

</body>
</html>`;
}

// Generate senior-interview-vault.html and interview-vault.html
const content = generateHtml();
fs.writeFileSync(path.join(__dirname, '..', 'senior-interview-vault.html'), content, 'utf8');
fs.writeFileSync(path.join(__dirname, '..', 'interview-vault.html'), content, 'utf8');

console.log(`Generated senior-interview-vault.html and interview-vault.html with ${questions.length} questions!`);
