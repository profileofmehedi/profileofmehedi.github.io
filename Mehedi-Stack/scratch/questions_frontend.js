// Questions 71 to 95: Modern CSS3, jQuery, Angular 17/18, Web Vitals, Security
module.exports = [
  // Junior
  {
    topic: 'frontend',
    level: 'junior',
    badge: 'CSS Basics',
    q: '৭১. CSS Box Model কী এবং box-sizing: border-box কেন আধুনিক ওয়েবের স্ট্যান্ডার্ড?',
    a: `<p>CSS Box Model ৪টি স্তর নিয়ে গঠিত: <strong>Content &rarr; Padding &rarr; Border &rarr; Margin</strong>।</p>
<p>ডিফল্ট <code>content-box</code> এ কোনো এলিমেন্টের উইডথ ৩০০ পিক্সেল দিয়ে ২০ পিক্সেল প্যাডিং ও ৫ পিক্সেল বর্ডার দিলে ব্রাউজারে মোট দৃশ্যমান উইডথ হয়ে যায় ৩৫০ পিক্সেল (300 + 40 + 10)। এর ফলে গ্রিড বা রেসপনসিভ লেআউট প্রায়ই ভেঙে যায়।</p>
<p><code>box-sizing: border-box</code> ব্যবহার করলে প্যাডিং ও বর্ডার মূল নির্ধারিত উইডথের <strong>ভেতরের অংশ হিসেবে</strong> সমন্বয় হয়। অর্থাৎ উইডথ ৩০০ পিক্সেল দিলে দৃশ্যমান আকার ঠিক ৩০০ পিক্সেলই থাকে। তাই আধুনিক সব ফ্রেমওয়ার্কে গ্লোবাল রিসেট <code>*, *::before, *::after { box-sizing: border-box; }</code> ব্যবহার করা হয়।</p>`
  },
  {
    topic: 'frontend',
    level: 'junior',
    badge: 'CSS Layout',
    q: '৭২. CSS Flexbox এবং CSS Grid এর মূল পার্থক্য কী? কখন কোনটি ব্যবহার করবেন?',
    a: `<p><strong>Flexbox (১-মাত্রিক Layout):</strong> শুধুমাত্র একটি অক্ষে (Row <em>অথবা</em> Column) কাজ করে। কনটেন্ট চালিত লেআউট (Content-first)। ছোট কম্পোনেন্ট, নেভিগেশন বার, ফর্ম ফিল্ড এবং আইকন অ্যালাইনমেন্টের জন্য সেরা।</p>
<p><strong>CSS Grid (২-মাত্রিক Layout):</strong> একই সাথে সারি ও কলাম (Rows <em>এবং</em> Columns) উভয় অক্ষ সম্পূর্ণ নিয়ন্ত্রণ করে। লেআউট চালিত ডিজাইন (Layout-first)। পুরো পেজের কাঠামো, জটিল ড্যাশবোর্ড এবং রেসপনসিভ ফটো গ্যালারির জন্য সেরা।</p>
<p><strong>সিদ্ধান্ত:</strong> পুরো পেজের ম্যাক্রো কাঠামো গ্রিড দিয়ে এবং কম্পোনেন্টের ভেতরের মাইক্রো অ্যালাইনমেন্ট ফ্লেক্সবক্স দিয়ে সাজানো সেরা আর্কিটেকচার।</p>`
  },
  {
    topic: 'frontend',
    level: 'junior',
    badge: 'CSS Specificity',
    q: '৭৩. CSS Specificity Hierarchy কীভাবে হিসাব করা হয়? !important কেন এড়িয়ে চলা উচিত?',
    a: `<p>CSS Specificity হলো ব্রাউজারের অগ্রাধিকার সূত্র যখন একই উপাদানে একাধিক নিয়ম প্রযোজ্য হয়:</p>
<ol>
    <li><strong>Inline Styles</strong> (ওয়েট: 1000) &mdash; <code>style="color:red;"</code></li>
    <li><strong>ID Selectors</strong> (ওয়েট: 100) &mdash; <code>#header</code></li>
    <li><strong>Class, Attribute ও Pseudo-classes</strong> (ওয়েট: 10) &mdash; <code>.btn, [type="text"], :hover</code></li>
    <li><strong>Elements ও Pseudo-elements</strong> (ওয়েট: 1) &mdash; <code>div, p, ::before</code></li>
</ol>
<p><strong>!important এর বিপদ:</strong> এটি স্বাভাবিক ক্যাসকেডিং নিয়মকে ধ্বংস করে। একবার <code>!important</code> দিলে ভবিষ্যতে তা ওভাররাইড করতে আরও বড় <code>!important</code> দিতে হয়, যা বড় প্রজেক্টে মেইনটেইনেবিলিটি নষ্ট করে।</p>`
  },
  {
    topic: 'frontend',
    level: 'junior',
    badge: 'jQuery vs Vanilla JS',
    q: '৭৪. jQuery এবং Modern Vanilla JavaScript এর পার্থক্য কী? আধুনিক অ্যাপে jQuery এর অবস্থান কী?',
    a: `<p>jQuery একসময় বিপ্লব এনেছিল কারণ প্রাচীন ব্রাউজারগুলোতে DOM ম্যানিপুলেশন ও AJAX কল অত্যন্ত জটিল ও অসঙ্গত ছিল। <code>$()</code> সিনট্যাক্স দিয়ে ক্রস-ব্রাউজার সমস্যা দূর হতো।</p>
<p><strong>আধুনিক পরিস্থিতি:</strong> আজকের আধুনিক ব্রাউজারে বিল্ট-ইন <code>document.querySelector()</code>, <code>fetch()</code> API, এবং <code>classList.toggle()</code> অত্যন্ত দ্রুত ও স্ট্যান্ডার্ডাইজড। নতুন SPA প্রজেক্টে (Angular/React) সাধারণত jQuery ব্যবহার করা হয় না কারণ এটি ফ্রেমওয়ার্কের ভার্চুয়াল ডোম বা সিগন্যাল ট্রি বাইপাস করে সরাসরি রিয়েল ডোমে অপ্রয়োজনীয় পরিবর্তন করে।</p>`
  },
  {
    topic: 'frontend',
    level: 'junior',
    badge: 'Angular Core',
    q: '৭৫. Angular Component Lifecycle Hooks এর প্রধান ধাপগুলো কী কী? ngOnInit বনাম Constructor?',
    a: `<p><strong>Constructor:</strong> সাধারণ TypeScript ক্লাসের ফিচার। শুধুমাত্র ডিপেনডেন্সি ইনজেকশন করার জন্য ব্যবহৃত হয়। এই ধাপে ইনপুট প্রোপার্টিজ (<code>@Input</code>) মান পায় না এবং DOM তৈরি হয় না।</p>
<p><strong>প্রধান লাইফসাইকেল হুকস:</strong></p>
<ol>
    <li><code>ngOnChanges()</code>: যখন কোনো <code>@Input()</code> প্রোপার্টির মান পরিবর্তিত হয়।</li>
    <li><code>ngOnInit()</code>: কম্পোনেন্ট ইনিশিয়ালাইজ হলে একবার কল হয়। প্রাথমিক ডাটা ও এপিআই কল এখানে করা হয়।</li>
    <li><code>ngAfterViewInit()</code>: কম্পোনেন্টের টেমপ্লেট ও চাইল্ড ভিউ পুরোপুরি DOM এ রেন্ডার হওয়ার পর কল হয়।</li>
    <li><code>ngOnDestroy()</code>: কম্পোনেন্ট ডোম থেকে অপসারিত হওয়ার ঠিক আগে কল হয়। মেমোরি লিক রোধ করতে সমস্ত সাবস্ক্রিপশন আনসাবস্ক্রাইব করার স্থান।</li>
</ol>`
  },

  // Mid-Level
  {
    topic: 'frontend',
    level: 'mid',
    badge: 'jQuery & DOM',
    q: '৭৬. jQuery Event Delegation কী? $(\'.item\').click() এর বদলে $(document).on(\'click\', \'.item\') কেন শ্রেয়?',
    a: `<p><code>$('.item').click()</code> শুধুমাত্র পেজ লোড হওয়ার সময় যেসব উপাদান বিদ্যমান ছিল তাদের উপর ইভেন্ট লিসেনার বাইন্ড করে। পরবর্তীতে ডায়নামিক কোনো উপাদান ডোম-এ আসলে ক্লিক কাজ করে না। উপরন্তু ১,০০০ আইটেমের জন্য ১,০০০টি ইভেন্ট লিসেনার মেমোরি নষ্ট করে।</p>
<p><strong>Event Delegation:</strong> <code>$(document).on('click', '.item', fn)</code> প্যারেন্ট এলিমেন্টে মাত্র ১টি লিসেনার রাখে এবং ব্রাউজারের <strong>Event Bubbling</strong> মেকানিজম ব্যবহার করে যেকোনো ভবিষ্যতে আসা ডায়নামিক উপাদানেও নিখুঁতভাবে কাজ করে এবং মেমোরি অপচয় ৯৯% কমায়।</p>`
  },
  {
    topic: 'frontend',
    level: 'mid',
    badge: 'Modern CSS',
    q: '৭৭. CSS Container Queries (@container) এবং Media Queries (@media) এর মধ্যে তফাত কী?',
    a: `<p><strong>Media Queries (<code>@media</code>):</strong> সম্পূর্ণ <strong>ব্রাউজার ভিউপোর্টের স্ক্রিন সাইজ</strong> অনুযায়ী সিএসএস পরিবর্তন করে। এর সীমাবদ্ধতা হলো, একটি ছোট সাইডবারের ভেতরের উইজেট এবং ফুল-উইডথ বডির ভেতরের উইজেট একই ভিউপোর্ট সাইজে একই সিএসএস পেত।</p>
<p><strong>Container Queries (<code>@container</code>):</strong> উইজেটটির প্যারেন্ট কন্টেইনারের প্রস্থ বা আকারের উপর ভিত্তি করে রেসপনসিভ স্টাইল দেয়। ফলে একটি কার্ড কম্পোনেন্টকে আপনি সাইডবারে রাখলে নিজে থেকেই কমপ্যাক্ট কলামে চলে আসবে, আবার মেইন সেকশনে রাখলে নিজে থেকেই গ্রিড হয়ে যাবে—সম্পূর্ণ স্বাধীন ও পুনঃব্যবহারযোগ্য কম্পোনেন্ট ডিজাইন সম্ভব হয়।</p>`
  },
  {
    topic: 'frontend',
    level: 'mid',
    badge: 'Angular Forms',
    q: '৭৮. Angular Reactive Forms বনাম Template-Driven Forms এর গভীর পার্থক্য কী?',
    a: `<p><strong>Reactive Forms (এন্টারপ্রাইজ স্ট্যান্ডার্ড):</strong> কম্পোনেন্ট ক্লাসে সম্পূর্ণ কোড-বেসড অবজেক্ট ট্রি তৈরি হয় (<code>FormGroup, FormControl, FormArray</code>)। সিনক্রোনাস ডাটা ফ্লো, ১০০% টাইপ-সেফ (Typed Forms in Angular 14+)। জটিল ডায়নামিক ভ্যালিডেশন এবং ইউনিট টেস্টিং অত্যন্ত সহজ।</p>
<p><strong>Template-Driven Forms:</strong> টেমপ্লেট ফাইলে <code>[(ngModel)]</code> নির্দেশক দিয়ে টু-ওয়ে ডাটা বাইন্ডিং করা হয়। অ্যাসিনক্রোনাস ডাটা ফ্লো, টেস্ট করা কঠিন, জটিল এন্টারপ্রাইজ ফর্মের জন্য অনুপযুক্ত।</p>`
  },
  {
    topic: 'frontend',
    level: 'mid',
    badge: 'Angular DI',
    q: '৭৯. Angular Hierarchical Dependency Injection কীভাবে কাজ করে? providedIn: \'root\' বনাম Component Providers?',
    a: `<p>অ্যাঙ্গুলার ডিপেনডেন্সি ইনজেকশন হায়ারার্কিকাল ট্রির মতো কাজ করে:</p>
<ol>
    <li><strong><code>providedIn: 'root'</code> (Root Injector):</strong> পুরো অ্যাপ্লিকেশনে একটি মাত্র Singleton ইন্সট্যান্স তৈরি হয় এবং ট্রি-শেকিং (Tree-shaking) সমর্থন করে। অব্যবহৃত সার্ভিস প্রোডাকশন বান্ডেলে বাদ পড়ে।</li>
    <li><strong>Component <code>providers: [MyService]</code>:</strong> সেই কম্পোনেন্ট এবং তার চাইল্ড কম্পোনেন্টের জন্য একটি লোকাল আইসোলেটেড ইন্সট্যান্স তৈরি হয়। কম্পোনেন্ট নষ্ট হলে সার্ভিসটিও ডিসপোজ হয়। এটি মাল্টি-ইনস্ট্যান্স উইজেটের নিজস্ব স্টেটের জন্য উপযোগী।</li>
</ol>`
  },
  {
    topic: 'frontend',
    level: 'mid',
    badge: 'RxJS Operators',
    q: '৮০. RxJS Flattening Operators: switchMap, mergeMap, concatMap এবং exhaustMap এর সুনির্দিষ্ট ব্যবহার ক্ষেত্র কী?',
    a: `<p>উচ্চ কনকারেন্সির সময় এই ৪টি অপারেটরের পার্থক্য জেনে রাখা জরুরি:</p>
<ul>
    <li><strong>switchMap:</strong> নতুন ইভেন্ট আসা মাত্র আগের পেন্ডিং সাবস্ক্রিপশন বাতিল (Cancel) করে। <em>ব্যবহার:</em> সার্চ অটো-সাজেস্ট টাইপিং।</li>
    <li><strong>mergeMap:</strong> সমস্ত ইনকামিং ইভেন্টকে সমান্তরালভাবে (Parallel) হ্যান্ডেল করে। <em>ব্যবহার:</em> প্যারালাল মাল্টি-ফাইল আপলোড।</li>
    <li><strong>concatMap:</strong> আগের অপারেশন শেষ না হওয়া পর্যন্ত পরেরটি কিউতে রাখে (Sequential Queue)। <em>ব্যবহার:</em> অ্যাকাউন্ট ডেবিট বা চ্যাট মেসেজ সিকোয়েন্স।</li>
    <li><strong>exhaustMap:</strong> আগের কাজ শেষ না হওয়া পর্যন্ত পরবর্তী সমস্ত ইনকামিং ইভেন্ট ড্রপ করে। <em>ব্যবহার:</em> ফর্ম সাবমিট বা পেমেন্ট বাটনে বারবার ডাবল ক্লিক প্রতিরোধ।</li>
</ul>`
  },

  // Senior / Architect
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Angular 18 Reactivity',
    q: '৮১. Angular 18 এ Signals বনাম RxJS এর সুনির্দিষ্ট আর্কিটেকচারাল ব্যবহার ক্ষেত্র কী?',
    a: `<p><strong>Angular Signals:</strong> সিঙ্ক্রোনাস রিঅ্যাক্টিভ স্টেট (Synchronous State)। কম্পোনেন্টের লোকাল স্টেট, ডোম প্রোপার্টিজ ও ক্যালকুলেটেড ডেরিভেশনের জন্য সেরা। কোনো মেমোরি লিক রিস্ক নেই এবং ম্যানুয়াল আনসাবস্ক্রাইব করার প্রয়োজন হয় না। এটি ভবিষ্যতে Zone.js মুক্ত লাইটওয়েট অ্যাঙ্গুলার সম্ভব করছে।</p>
<p><strong>RxJS Observables:</strong> অ্যাসিনক্রোনাস ইভেন্ট স্ট্রিম (Asynchronous Streams)। HTTP রিকোয়েস্ট, সার্চ ইনপুটে Debouncing, WebSockets এবং জটিল টাইমিং অর্কেস্ট্রেশনে RxJS অপরিহার্য। আধুনিক অ্যাঙ্গুলারে两者 মিলে কাজ করে (<code>toSignal</code> এবং <code>toObservable</code> ইন্টারঅপারেবিলিটি)।</p>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Angular Performance',
    q: '৮২. ChangeDetectionStrategy.OnPush কীভাবে কাজ করে এবং কোন ৪টি কারণে কম্পোনেন্ট রি-রেন্ডার হয়?',
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
    q: '৮৩. Angular Control Flow (@if, @for track) এবং @defer এর পারফরম্যান্স বেনিফিট কী?',
    a: `<p><strong>Modern Control Flow:</strong> নতুন <code>@if</code> এবং <code>@for (item of items; track item.id)</code> কম্পাইলার লেভেলে অপ্টিমাইজড। <code>track</code> ক্লজ বাধ্যতামূলক করায় রি-রেন্ডারিংয়ে ডোম ম্যানিপুলেশন ৯০% কমে যায়।</p>
<p><strong>@defer (Deferred Views):</strong> হেভি কম্পোনেন্ট বা চার্টকে পেজ লোডের সময় বান্ডেলে না এনে lazy-load করা হয়:</p>
<pre><code>@defer (on viewport) {
    &lt;app-heavy-chart [data]="chartData" /&gt;
} @placeholder {
    &lt;div class="skeleton-loader"&gt;চার্ট লোড হচ্ছে...&lt;/div&gt;
}</code></pre>
<p>ইউজার স্ক্রোল করে ভিউপোর্টে পৌঁছালে জাভাস্ক্রিপ্ট বান্ডেল ডাউনলোড হয়ে রেন্ডার হয়, ফলে FCP বিদ্যুৎ গতি পায়।</p>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Frontend Security & Net',
    q: '৮৪. Angular এ Silent JWT Token Refresh Interceptor কীভাবে কনকারেন্সি রেস কন্ডিশন হ্যান্ডেল করে?',
    a: `<p>টোকেন এক্সপায়ার হওয়ার মুহূর্তে একই সাথে ৫টি সমান্তরাল API কল চলে গেলে ৫টিই 401 পায়। ৫ বার রিফ্রেশ কল পাঠালে সার্ভার সেশন বাতিল করবে।</p>
<p><strong>সিনিয়র সমাধান:</strong> একটি ফ্ল্যাগ <code>isRefreshing = false</code> এবং একটি <code>BehaviorSubject&lt;string | null&gt;(null)</code> রাখা হয়। প্রথম 401 আসা মাত্র <code>isRefreshing = true</code> হয়ে রিফ্রেশ টোকেন কল করে। পরবর্তী ৪টি রিকোয়েস্ট রিফ্রেশ কল না পাঠিয়ে <code>refreshTokenSubject</code> এ ফিল্টার দিয়ে কিউতে অপেক্ষা করে। নতুন টোকেন এলে <code>refreshTokenSubject.next(token)</code> ফায়ার হয়ে অপেক্ষারত সব রিকোয়েস্ট নতুন হেডার নিয়ে চলে যায়।</p>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Browser Rendering Engine',
    q: '৮৫. Browser Rendering Pipeline (Layout, Paint, Composite) কী? CSS GPU Acceleration কীভাবে 60 FPS নিশ্চিত করে?',
    a: `<p>ব্রাউজার স্ক্রিনে কোনো সিএসএস রেন্ডার করতে ৩টি ধাপ পার করে:</p>
<ol>
    <li><strong>Layout (Reflow):</strong> আকার ও পজিশন গণনা করে (<code>width, height, margin, top</code>)। সবচেয়ে ব্যয়বহুল।</li>
    <li><strong>Paint (Repaint):</strong> পিক্সেলগুলো রঙ ও ব্যাকগ্রাউন্ড দিয়ে আঁকে (<code>color, background, box-shadow</code>)।</li>
    <li><strong>Composite:</strong> লেয়ারগুলোকে GPU-তে একত্রিত করে স্ক্রিনে ডিসপ্লে করে।</li>
</ol>
<p><strong>GPU Acceleration:</strong> শুধুমাত্র <code>transform</code> এবং <code>opacity</code> সরাসরি GPU-তে নিজস্ব কম্পোজিটিং লেয়ারে কাজ করে—Layout বা Paint ফেজকে সম্পূর্ণ বাইপাস করে। ফলে কোনো সিপিইউ ফ্রেম ড্রপ হয় না এবং মসৃণ ৬০ FPS বজায় থাকে।</p>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Zoneless Angular 18',
    q: '৮৬. Zoneless Angular 18: provideExperimentalZonelessChangeDetection() কীভাবে Zone.js কে অপ্রয়োজনীয় করে তোলে?',
    a: `<p>পূর্বে অ্যাঙ্গুলার সমস্ত ব্রাউজার অ্যাসিনক্রোনাস এপিআই (<code>setTimeout</code>, <code>fetch</code>, DOM Events) কে <strong>Zone.js</strong> দিয়ে মাঙ্কি-প্যাচ (Monkey-patch) করে রাখত। ফলে যেকোনো ক্ষুদ্রতম ইভেন্টেও পুরো কম্পোনেন্ট ট্রি টপ-টু-বটম ডার্টি চেক হতো।</p>
<p><strong>Zoneless Architecture:</strong></p>
<pre><code>bootstrapApplication(AppComponent, {
    providers: [provideExperimentalZonelessChangeDetection()]
});</code></pre>
<p>Zone.js সম্পূর্ণ বাদ দেওয়ায় বান্ডেল সাইজ প্রায় ৩০ KB কমে যায়। কম্পোনেন্টগুলো সিগন্যালস (Signals) এর নোটিফিকেশনের মাধ্যমে সরাসরি সুনির্দিষ্ট নোড আপডেট করে (Fine-grained micro-updates), ফলে অ্যাপ্লিকেশনের স্পিড ২-৩ গুণ বৃদ্ধি পায় এবং স্ট্যাক ট্রেস সম্পূর্ণ স্বাভাবিক ক্রিস্টাল ক্লিয়ার হয়।</p>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Signal Inputs & Models',
    q: '৮৭. Angular 17/18 Signal-based Inputs, Outputs এবং model() কীভাবে টু-ওয়ে বাইন্ডিংকে আধুনিক রূপ দিয়েছে?',
    a: `<p>ক্লাসিক ডেকোরেটর <code>@Input()</code> এবং <code>@Output()</code> এর বদলে আধুনিক অ্যাঙ্গুলার ফাংশন-বেসড সিগন্যাল প্রদান করে:</p>
<pre><code>// Signal Input (Read-only Signal)
userId = input.required&lt;string&gt;();

// Output (Type-safe event emitter)
deleted = output&lt;number&gt;();

// Two-way Model Signal (Writiable Signal)
isOpen = model&lt;boolean&gt;(false);</code></pre>
<p><strong>সুবিধা:</strong> <code>userId</code> এখন একটি রিঅ্যাক্টিভ সিগন্যাল। তাই <code>ngOnChanges()</code> লেখার কোনো প্রয়োজন নেই। সরাসরি <code>computed(() => 'User: ' + this.userId())</code> লিখলেই ইনপুট মান পরিবর্তনের সাথে সাথে ক্যালকুলেশন মেমোইজড হয়ে স্বয়ংক্রিয়ভাবে আপডেট হয়।</p>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Micro Frontends',
    q: '৮৮. Angular এ Micro Frontends: Module Federation বনাম Angular Elements (Web Components) এর আর্কিটেকচারাল নির্বাচন?',
    a: `<p><strong>Module Federation (Webpack 5 / Rspack):</strong></p>
<ul>
    <li>একাধিক স্বাধীন দল ভিন্ন ভিন্ন Angular ভার্সনে বা একই ভার্সনে তৈরি রিমোট অ্যাপগুলোকে রানটাইমে হোস্ট শেলে লোড করে।</li>
    <li><strong>শেয়ার্ড ডিপেনডেন্সি:</strong> <code>@angular/core</code>, <code>rxjs</code> এবং কমন AuthService Singleton মেমোরিতে একবারই শেয়ার হয়, ডুপ্লিকেট ডাউনলোড হয় না।</li>
</ul>
<p><strong>Angular Elements (Custom Web Components):</strong> সম্পূর্ণ কম্পোনেন্টকে স্ট্যান্ডার্ড ব্রাউজার কাস্টম এলিমেন্টে (<code>&lt;user-widget&gt;</code>) প্যাকেজ করে। অন্য ফ্রেমওয়ার্কে (React/Vue বা প্রাচীন jQuery) উইজেট এম্বেড করার জন্য এটি সর্বোত্তম।</p>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'RxJS Memory Leaks',
    q: '৮৯. takeUntilDestroyed() মেমোরি লিক কীভাবে প্রতিরোধ করে? shareReplay({ refCount: true }) এর গোপন বিপদ কী?',
    a: `<p><strong>takeUntilDestroyed() (.NET 16+ / Angular 16+):</strong> পূর্বে <code>ngOnDestroy</code> এ <code>Subject.next()</code> দিয়ে আনসাবস্ক্রাইব করতে হতো। এখন ইনজেকশন কনটেক্সটে সরাসরি পাইপে <code>takeUntilDestroyed()</code> যোগ করলেই কম্পোনেন্ট ধ্বংসের সাথে সাথে সাবস্ক্রিপশন স্বয়ংক্রিয়ভাবে ডিসপোজ হয়।</p>
<p><strong>shareReplay এর মারাত্মক ফাঁদ:</strong></p>
<pre><code>// মেমোরি লিক! সব সাবস্ক্রাইবার চলে গেলেও সোর্স কখনো আনসাবস্ক্রাইব হয় না:
data$ = this.http.get().pipe(shareReplay(1)); 

// সঠিক প্রোডাকশন কোড:
data$ = this.http.get().pipe(shareReplay({ bufferSize: 1, refCount: true }));</code></pre>
<p><code>refCount: true</code> না দিলে ইন্টারনাল সাবজেক্টটি চিরকালের জন্য সোর্স ও কম্পোনেন্টের মেমোরি রেফারেন্স ধরে রাখে এবং বিশাল মেমোরি লিক ঘটায়।</p>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Frontend Security XSS',
    q: '৯০. DOM XSS, DomSanitizer, bypassSecurityTrustHtml এর নিরাপত্তা ঝুঁকি এবং Angular এ Strict CSP কীভাবে কনফিগার করবেন?',
    a: `<p>Angular ডিফল্টভাবে যেকোনো ডায়নামিক HTML কে আনট্রাস্টেড মনে করে এবং স্ক্রিপ্ট ও опасные অ্যাট্রিবিউট স্ট্রিপ (Sanitize) করে দেয়।</p>
<p><strong>মারাত্মক ভুল:</strong> ডেভেলপাররা প্রায়ই কাজ সহজ করতে <code>sanitizer.bypassSecurityTrustHtml(userInput)</code> কল করে। যদি ইউজারের ইনপুটে <code>&lt;img src=x onerror=alert(document.cookie)&gt;</code> থাকে, তবে সাইটে <strong>Stored XSS</strong> ঘটে এবং ব্যবহারকারীর সেশন হাইজ্যাক হয়।</p>
<p><strong>প্রতিরোধ:</strong> তৃতীয় পক্ষের স্যানিটাইজার লাইব্রেরি (DOMPurify) দিয়ে ইনপুট স্ক্রাব করতে হবে এবং ওয়েব সার্ভারে <strong>Strict CSP (Content Security Policy)</strong> হেডার সেট করতে হবে:</p>
<pre><code>Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-rAnd0m123'; object-src 'none';</code></pre>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'V8 Engine Internals',
    q: '৯১. V8 Engine Internals: Hidden Classes, Inline Caches (Monomorphic vs Megamorphic) এবং Event Loop এর Microtasks?',
    a: `<p><strong>Hidden Classes:</strong> জাভাস্ক্রিপ্টে ক্লাস না থাকলেও V8 ইন্টারনালি মেমোরিতে প্রতিটি অবজেক্টের জন্য একটি হিডেন ক্লাস তৈরি করে। কনস্ট্রাক্টরের বাইরে ডায়নামিকালি প্রোপার্টি যোগ করলে (<code>obj.newProp = 1</code>) হিডেন ক্লাস পরিবর্তিত হয় এবং মেমোরি লুকআপ স্লো হয়ে যায়।</p>
<p><strong>Inline Cache (IC):</strong> মেথড কল অপ্টিমাইজ করে। যদি একটি ফাংশন সর্বদা একই হিডেন ক্লাসের অবজেক্ট পায়, তাকে বলে <strong>Monomorphic (বিদ্যুৎ গতি)</strong>। যদি ৫টির বেশি ভিন্ন টাইপ পাস করা হয়, তা <strong>Megamorphic</strong> হয়ে যায় এবং V8 অপ্টিমাইজেশন বন্ধ করে সাধারণ স্লো প্রোপার্টি সার্চ করে।</p>
<p><strong>Event Loop:</strong> প্রতি ফ্রেম রেন্ডার হওয়ার আগে ব্রাউজার সমস্ত <strong>Microtasks (Promise.then, queueMicrotask)</strong> খালি না হওয়া পর্যন্ত এক্সিকিউট করে। এরপরেই কেবল ম্যাক্রোটাস্ক (setTimeout, DOM events) প্রসেস হয়।</p>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Ultra High Performance CSS',
    q: '৯২. CSS contain প্রোপার্টি এবং content-visibility: auto দিয়ে ১০,০০০ আইটেমের ভার্চুয়াল রেন্ডারিং কীভাবে করবেন?',
    a: `<p>হাজার হাজার কার্ডের দীর্ঘ ফিডে ব্রাউজার স্ক্রিনের বাইরে থাকা অবজেক্টগুলোরও লেআউট ও সাইজ গণনা করে সিপিইউ ফ্রিজ করে ফেলে।</p>
<p><strong>content-visibility: auto এর ম্যাজিক:</strong></p>
<pre><code>.feed-card {
    content-visibility: auto;
    contain-intrinsic-size: auto 300px;
}</code></pre>
<p>এই প্রোপার্টি ব্রাউজারকে নির্দেশ দেয়: যতক্ষণ না এই কার্ডটি স্ক্রিনে স্ক্রোল হয়ে ভিউপোর্টের কাছাকাছি আসছে, ততক্ষণ এর লেআউট ও পেইন্টিং সম্পূর্ণ স্কিপ করো। এতে ১০,০০০ রো-র পেজের রেন্ডারিং টাইম <strong>৩০০০ms থেকে নেমে মাত্র ৫০ms-এ চলে আসে</strong> কোনো থার্ড-পার্টি ভার্চুয়াল স্ক্রোল লাইব্রেরি ছাড়াই!</p>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Core Web Vitals',
    q: '৯৩. Core Web Vitals: LCP, INP এবং CLS অপ্টিমাইজেশনের সিনিয়র স্ট্র্যাটেজি কী কী?',
    a: `<p>Google এর ৩টি গুরুত্বপূর্ণ সার্চ র্যাঙ্কিং মেট্রিক্স:</p>
<ul>
    <li><strong>LCP (Largest Contentful Paint &lt; 2.5s):</strong> হিরো ইমেজকে <code>fetchpriority="high"</code> দিন এবং ওয়েবপ্যাক বা অ্যাঙ্গুলার থেকে ক্রিটিক্যাল সিএসএস ইনলাইন করুন।</li>
    <li><strong>INP (Interaction to Next Paint &lt; 200ms):</strong> ব্যবহারকারী বাটনে ক্লিক করলে রেসপন্স আসতে যাতে দেরি না হয়। দীর্ঘ জাভাস্ক্রিপ্ট টাস্ককে <code>scheduler.yield()</code> বা <code>requestIdleCallback</code> দিয়ে ছোট ছোট চ্যাঙ্কে ভাগ করুন।</li>
    <li><strong>CLS (Cumulative Layout Shift &lt; 0.1):</strong> পেজ লোডের সময় কনটেন্ট যেন হঠাৎ লাফ না দেয়। সর্বদা ইমেজ এবং বিজ্ঞাপনের জন্য নির্দিষ্ট <code>aspect-ratio</code> বা <code>width/height</code> বরাদ্দ রাখুন।</li>
</ul>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'Monolith Migration',
    q: '৯৪. Strangler Fig Pattern: একটি বিশাল লেগাসি jQuery/MVC কোডবেসকে বিগ-ব্যাং ছাড়া Angular 18 এ কীভাবে রূপান্তর করবেন?',
    a: `<p><strong>বিগ-ব্যাং রিরাইট চিরকাল ব্যর্থ হয়:</strong> সম্পূর্ণ সিস্টেম নতুন করে লিখতে গেলে ১-২ বছর লেগে যায় এবং ব্যবসা ক্ষতিগ্রস্ত হয়।</p>
<p><strong>Strangler Fig Strategy:</strong></p>
<ol>
    <li>Nginx বা রিভার্স প্রক্সির পেছনে পুরানো MVC অ্যাপ এবং নতুন Angular 18 অ্যাপকে একসাথে রাখুন।</li>
    <li>হোস্ট সাইটের নেভিগেশন ও কমন হেডার-ফুটার শেয়ার করুন।</li>
    <li>সবচেয়ে বিচ্ছিন্ন ও উচ্চ-অগ্রাধিকারপ্রাপ্ত পেজটি (যেমন: অর্ডার হিস্ট্রি ড্যাশবোর্ড) নতুন Angular এ তৈরি করুন এবং Nginx রাউটে <code>/orders</code> পাথটি Angular-এ পয়েন্ট করুন।</li>
    <li>ধীরে ধীরে এক একটি মডিউল স্থানান্তরিত করতে থাকুন। পুরানো গাছকে নতুন পরজীবী লতার মতো ঘিরে ফেলে একসময় পুরানো jQuery অ্যাপটি সম্পূর্ণ অপসারিত হবে কোনো সিস্টেম ডাউনটাইম ছাড়াই।</li>
</ol>`
  },
  {
    topic: 'frontend',
    level: 'senior',
    badge: 'State Management at Scale',
    q: '৯৫. Signals Store (@ngrx/signals) বনাম Redux Store (Actions, Reducers, Effects): কখন কোনটি বেছে নেবেন?',
    a: `<p><strong>Classic Redux / NgRx Store:</strong> অত্যন্ত কড়া স্ট্রাকচার (Actions, Reducers, Effects, Selectors)। প্রচুর বয়লারপ্লেট কোড। তবে অত্যন্ত বড় দল যেখানে ৫০+ ডেভেলপার কাজ করে এবং টাইম-ট্রাভেল ডিবাগিং বা কঠোর আর্কিটেকচারাল বাউন্ডারি বাধ্যতামূলক, সেখানে এটি প্রযোজ্য।</p>
<p><strong>Modern @ngrx/signals (SignalStore):</strong> অ্যাঙ্গুলার কমিউনিটির আধুনিক প্রিয় পছন্দ। সিগন্যাল-ফার্স্ট, ডিপ ফাংশনাল এবং কম্পোজেবল। কোনো বিরক্তিকর অ্যাকশন-রিডিউসার ড্রাফট ছাড়াই <code>signalStore(withState(...), withMethods(...), withComputed(...))</code> দিয়ে মাত্র ১০ লাইনে সম্পূর্ণ টাইপ-সেফ এন্টারপ্রাইজ স্টেট ম্যানেজমেন্ট করা যায়। মেমোরি ফুটপ্রিন্ট অনেক কম এবং দ্রুততর।</p>`
  }
];
