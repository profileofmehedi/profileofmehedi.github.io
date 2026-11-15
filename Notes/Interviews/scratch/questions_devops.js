// Questions 121 to 140: Server Management, DevOps, Production Crash Diagnostics
module.exports = [
  // Junior / Mid
  {
    topic: 'devops',
    level: 'junior',
    badge: 'Hosting Environments',
    q: '১২১. Windows Server IIS বনাম Linux Hosting for .NET: কোনটি কখন বেছে নেবেন?',
    a: `<p><strong>Windows Server (IIS):</strong> লেগাসি .NET Framework অ্যাপ এবং Active Directory (Windows Authentication) বা COM+ ইন্টারপ থাকলে এটি বাধ্যতামূলক। তবে উইন্ডোজ সার্ভার লাইসেন্সিং কস্ট অনেক বেশি এবং রিমোট ম্যানেজমেন্টে রিসোর্স বেশি লাগে।</p>
<p><strong>Linux (Ubuntu / Alpine with Kestrel):</strong> আধুনিক .NET 8/9 সম্পূর্ণ ক্রস-প্লাটফর্ম। লিনাক্সে রানটাইম মেমোরি অনেক হালকা থাকে এবং লাইসেন্সিং খরচ ০%। ডকার কন্টেইনার এবং কুবারনেটিসে লিনাক্স বেসড ইমেজ অত্যন্ত ক্ষুদ্র (৮০ MB) এবং সেকেন্ডের ভগ্নাংশে স্কেল হতে পারে।</p>`
  },
  {
    topic: 'devops',
    level: 'mid',
    badge: 'IIS Architecture',
    q: '১২২. In-Process বনাম Out-of-Process Hosting in IIS (AspNetCoreModuleV2) এর পার্থক্য কী?',
    a: `<p><strong>In-Process Hosting (ডিফল্ট ও দ্রুততম):</strong> ASP.NET Core অ্যাপ সরাসরি IIS-এর ওয়ার্কার প্রসেসের (<code>w3wp.exe</code>) ভেতর রান করে। ফলে IIS এবং Kestrel-এর মাঝে কোনো নেটওয়ার্ক লুপব্যাক রাউন্ডট্রিপ থাকে না। এটি প্রায় ৩-৪ গুণ বেশি পারফরম্যান্স দেয়।</p>
<p><strong>Out-of-Process Hosting:</strong> IIS শুধুমাত্র একটি রিভার্স প্রক্সি হিসেবে কাজ করে এবং আসল অ্যাপটি বাইরে আলাদা প্রসেসে <code>dotnet.exe</code> হিসেবে Kestrel সার্ভারে রান করে। এদের মধ্যে লোকাল পোর্ট বা পাইপ দিয়ে যোগাযোগ হয়।</p>`
  },
  {
    topic: 'devops',
    level: 'mid',
    badge: 'DevOps Secrets',
    q: '১২৩. প্রোডাকশন কনফিগারেশন এবং সিক্রেটস ম্যানেজমেন্ট কীভাবে করবেন? appsettings.json এ পাসওয়ার্ড রাখা কেন অপরাধ?',
    a: `<p><code>appsettings.json</code> ফাইলে ডাটাবেজ পাসওয়ার্ড বা API Secret রাখলে তা গিট রিপোজিটরিতে চলে যাওয়ার মারাত্মক ঝুঁকি থাকে, যা সবচেয়ে সাধারণ ডেটা ব্রিচের কারণ।</p>
<p><strong>আধুনিক প্রোডাকশন নিয়মাবলী:</strong> ১. <strong>Environment Variables:</strong> .NET স্বয়ংক্রিয়ভাবে <code>ConnectionStrings__DefaultConnection</code> ডবল আন্ডারস্কোরকে নেস্টেড কনফিগারেশন হিসেবে ম্যাপ করে। ২. <strong>Azure Key Vault / HashiCorp Vault:</strong> সেন্ট্রালাইজড এনক্রিপ্টেড সিক্রেট স্টোর থেকে অ্যাপ মেমোরিতে ফেচ করে নেয়। ৩. সিআই/সিডি পাইপলাইনে GitGuardian দিয়ে সিক্রেট স্ক্যান করা।</p>`
  },
  {
    topic: 'devops',
    level: 'mid',
    badge: 'Docker Best Practice',
    q: '১২৪. ডকার মাল্টি-স্টেজ বিল্ড (Multi-stage Build) কেন প্রোডাকশন ইমেজের জন্য অপরিহার্য?',
    a: `<p>.NET SDK ইমেজ সাইজে প্রায় ৮৫০ MB এবং এর ভেতর কম্পাইলার টুলস ও সোর্স কোড থাকে যা প্রোডাকশনে অপ্রয়োজনীয় এবং সিকিউরিটি ঝুঁকি তৈরি করে।</p>
<p><strong>Multi-stage Build:</strong> প্রথম স্টেজে SDK ইমেজ দিয়ে কোড কম্পাইল করা হয় এবং ফাইনাল স্টেজে শুধুমাত্র হালকা Alpine বা Chiseled রানটাইম ইমেজে পাবলিশড ফাইলগুলো কপি করা হয়। ফলে ফাইনাল ইমেজ সাইজ নেমে আসে মাত্র ৮০ MB-তে এবং অ্যাটাক সারফেস ৯০% কমে যায়।</p>`
  },
  {
    topic: 'devops',
    level: 'mid',
    badge: 'Container Orchestration',
    q: '১২৫. Docker Compose দিয়ে লোকাল ডেভেলপমেন্টে ফুল-স্ট্যাক মাইক্রোসার্ভিস এনভায়রনমেন্ট কীভাবে সাজাবেন?',
    a: `<p><code>docker-compose.yml</code> ফাইলে একই নেটওয়ার্কে Web API, PostgreSQL, Redis এবং RabbitMQ কনফিগার করে সিঙ্গেল কমান্ডে (<code>docker compose up -d</code>) সম্পূর্ণ ডেভেলপমেন্ট এনভায়রনমেন্ট তৈরি করা যায়:</p>
<ul>
    <li><strong>Bridge Network:</strong> সার্ভিসগুলো লোকালহোস্ট আইপি ছাড়া সরাসরি সার্ভিসের নামে (<code>host=db</code> বা <code>host=redis</code>) যোগাযোগ করতে পারে।</li>
    <li><strong>Volumes:</strong> কন্টেইনার ডিলিট হলেও লোকাল ডিস্কে ডাটাবেজের সমস্ত ডাটা পারসিস্টেন্ট থাকে।</li>
    <li><strong>Healthcheck:</strong> ডাটাবেজ পুরোপুরি রেডি হওয়ার পরই কেবল ওয়েব এপিআই স্টার্ট হতে বাধ্য করা যায় (<code>depends_on: condition: service_healthy</code>)।</li>
</ul>`
  },

  // Senior / Architect
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Live Diagnostics',
    q: '১২৬. লাইভ প্রোডাকশনে মেমোরি লিক হলে অ্যাপ বন্ধ না করে কীভাবে dotnet-dump দিয়ে রুট-কজ বের করবেন?',
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
    q: '১২৭. প্রোডাকশনে সিপিইউ ১০০% স্পাইক করলে dotnet-trace ও SpeedScope দিয়ে কীভাবে ইনফিনিট লুপ ডিবাগ করবেন?',
    a: `<p>অ্যাপ বন্ধ না করে সরাসরি সার্ভারে রান করুন:</p>
<pre><code>dotnet-trace collect --process-id &lt;PID&gt; --duration 00:00:30 --format Speedscope</code></pre>
<p>এটি ৩০ সেকেন্ডের জন্য মেমোরির কোনো ক্ষতি না করে এক্সিকিউটিং থ্রেডগুলোর স্যাম্পলিং প্রোফাইল রেকর্ড করে একটি <code>.speedscope.json</code> ফাইল তৈরি করবে।</p>
<p>ফাইলটি <strong>speedscope.app</strong> ওয়েবসাইটে আপলোড করলে একটি সুন্দর <strong>Flame Graph</strong> দেখতে পাবেন। যে মেথডটি স্ক্রিনের ৯০% প্রস্থ জুড়ে লাল হয়ে থাকবে, সেটাই হলো ইনফিনিট লুপ বা রেগুলার এক্সপ্রেশন ক্যাটাস্ট্রফিক ব্যাকট্র্যাকিং এর মূল অপরাধী।</p>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Linux Systemd Hardening',
    q: '১২৮. Linux এ ASP.NET Core কে নিরাপদ Systemd সার্ভিস হিসেবে কনফিগার করার প্রোডাকশন রেসিপি কী?',
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
    q: '১২৯. Nginx Reverse Proxy দিয়ে SSL Termination, HTTP/2 এবং Upstream Connection Pooling কনফিগারেশন?',
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
    q: '১৩০. IIS এ Zero-Downtime Deployment এবং AppPool Recycling এর বিপদ কীভাবে এড়াবেন?',
    a: `<p><strong>বিপদ:</strong> IIS এর ডিফল্ট সেটিংসে ২০ মিনিট কোনো রিকোয়েস্ট না আসলে <strong>Idle Time-out</strong> হয়ে অ্যাপ বন্ধ হয়ে যায়। আবার ১৭৪০ মিনিট (২৯ ঘণ্টা) পর পর বা মেমোরি লিমিটে হঠাৎ <strong>AppPool Recycle</strong> হয়। এর ফলে ইনকামিং রিকোয়েস্ট কোল্ড স্টার্টের কারণে ১৫-২০ সেকেন্ড ল্যাগ খায়।</p>
<p><strong>প্রোডাকশন ফিক্স:</strong> ১. <code>Idle Time-out (minutes) = 0</code> ২. <code>Start Mode = AlwaysRunning</code> ৩. <code>Preload Enabled = True</code>। ৪. <strong>Blue-Green Deployment:</strong> একই IIS সার্ভারে দুটি পোর্ট বা সাইট (Blue ও Green) রেখে ARR বা ক্লাউডফ্লেয়ার দিয়ে ট্রাফিক সুইচ করলে ইউজাররা ০ মিলি-সেকেন্ডও ডাউনটাইম টের পায় না।</p>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Linux Kernel Tuning',
    q: '১৩১. Linux Kernel Networking Tuning: sysctl.conf টিউন করে TIME_WAIT Socket Exhaustion কীভাবে দূর করবেন?',
    a: `<p>উচ্চ ট্রাফিকের মাইক্রোসার্ভিসে দ্রুত আউটগোয়িং HTTP কল করলে হাজার হাজার সকেট <strong>TIME_WAIT</strong> স্টেটে আটকে থাকে এবং নতুন সকেটের জন্য পোর্ট খালি না পেয়ে <code>SocketException: Address already in use</code> এরর দেয়।</p>
<p><strong>/etc/sysctl.conf প্রোডাকশন কার্নেল টিউনিং:</strong></p>
<pre><code># ইনকামিং TCP কানেকশন ব্যাকলগ বাড়ানো (ডিফল্ট ১২৮ থেকে ৬৫৫৩৫)
net.core.somaxconn = 65535

# TIME_WAIT সকেট দ্রুত রি-ইউজ করার অনুমোদন
net.ipv4.tcp_tw_reuse = 1

# লোকাল পোর্ট রেঞ্জ সর্বোচ্চ বৃদ্ধি করা (১০২৪ থেকে ৬৫৫৩৫)
net.ipv4.ip_local_port_range = 1024 65535

# SYN Flood অ্যাটাক প্রটেকশন
net.ipv4.tcp_max_syn_backlog = 16384</code></pre>
<p><code>sysctl -p</code> চালালে কার্নেল সেকেন্ডে লক্ষ লক্ষ হাই-স্পিড সকেট কানেকশন হ্যান্ডেল করতে সক্ষম হয়।</p>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Windows Kernel HTTP.sys',
    q: '১৩২. Windows Kernel HTTP.sys Internals: কার্নেল ক্যাশিং এবং Kerberos Double-Hop সমস্যা ও SPN রেজিস্ট্রেশন?',
    a: `<p><strong>HTTP.sys:</strong> উইন্ডোজ কার্নেল স্পেসে (Ring 0) চলে। এটি সরাসরি নেটওয়ার্ক ড্রাইভ থেকে HTTP প্যাকেট গ্রহণ করে। যদি কোনো স্ট্যাটিক ফাইল বা রেসপন্স কার্নেল ক্যাশে থাকে, ইউজার মোডের <code>w3wp.exe</code> প্রসেসে কোনো কনটেক্সট সুইচ ছাড়াই কার্নেল থেকেই রেসপন্স ফেরত পাঠিয়ে দেয়।</p>
<p><strong>Kerberos Double-Hop Problem:</strong> যখন একজন ব্যবহারকারী ব্রাউজার থেকে IIS ওয়েবসাইটে উইন্ডোজ অথেনটিকেশন (NTLM/Kerberos) দিয়ে লগইন করে, IIS সার্ভিস অন্য কোনো ডাটাবেজ বা ব্যাকএন্ড সার্ভারে ব্যবহারকারীর আইডেন্টিটি পাস করতে পারে না (Double-Hop ড্রপ)।</p>
<p><strong>সমাধান:</strong> ডোমেইন কন্ট্রোলারে সার্ভিসের জন্য <strong>Service Principal Name (SPN)</strong> রেজিস্টার করতে হয় (<code>setspn -A HTTP/myportal domain\\serviceaccount</code>) এবং অ্যাক্টিভ ডিরেক্টরিতে <strong>Kerberos Constrained Delegation (KCD)</strong> কনফিগার করতে হয়।</p>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Native Memory Leaks',
    q: '১৩৩. Unmanaged / Native Memory Leaks: CLR ম্যানেজড হিপে কোনো লিক না থাকা সত্ত্বেও প্রোডাকশনে মেমোরি গ্রোথ কীভাবে ডিবাগ করবেন?',
    a: `<p>প্রায়ই দেখা যায় <code>dotnet-dump</code> দিয়ে <code>dumpheap -stat</code> চেক করলে ম্যানেজড হিপ মাত্র ২০০ MB দেখাচ্ছে, কিন্তু টাস্ক ম্যানেজারে প্রসেসের সাইজ ৩ GB ছাড়িয়ে গেছে!</p>
<p><strong>কারণ:</strong> এটি <strong>Native (Unmanaged CRT Heap) Leak</strong>। কোনো P/Invoke, C++ নেটিভ থার্ড-পার্টি লাইব্রেরি (যেমন ইমেজ প্রসেসর বা অরাকল আনম্যানেজড ক্লায়েন্ট) মেমোরি ম্যালক (<code>malloc / HeapAlloc</code>) করেছে কিন্তু ফ্রি করেনি।</p>
<p><strong>ডিবাগিং পদ্ধতি:</strong></p>
<ol>
    <li>উইন্ডোজে <strong>GFlags (Global Flags)</strong> দিয়ে ইউজার মোড স্ট্যাক ট্রেস অন করুন: <code>gflags /i w3wp.exe +ust</code>।</li>
    <li><strong>UMDH (User-Mode Dump Heap)</strong> দিয়ে ১ ঘণ্টা ব্যবধানে দুটি স্ন্যাপশট নিন: <code>umdh -pn:w3wp.exe -f:snap1.log</code> এবং <code>snap2.log</code>।</li>
    <li>তুলনামূলক বিশ্লেষণ চালান: <code>umdh snap1.log snap2.log &gt; diff.txt</code>। ফাইলের শীর্ষে সরাসরি দেখা যাবে কোন আনম্যানেজড C++ মেথডের কারণে কোটি কোটি বাইট লিক হচ্ছে!</li>
</ol>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Kubernetes Production',
    q: '১৩৪. Kubernetes এ .NET পডের Graceful Termination এবং Cascading Restart Death Loop কীভাবে এড়াবেন?',
    a: `<p>কুবারনেটিসে ডেপ্লয়মেন্টের সময় নোড ড্রেন বা পড স্কেল ডাউনের সময় পডটিকে <code>SIGTERM</code> সিগন্যাল পাঠানো হয়।</p>
<p><strong>Graceful Termination (.NET 8):</strong></p>
<pre><code>var app = builder.Build();
app.Lifetime.ApplicationStopping.Register(() => {
    // নতুন রিকোয়েস্ট গ্রহণ বন্ধ করো এবং রানিং ট্রানজ্যাকশন শেষ করার জন্য ১০ সেকেন্ড সময় দাও
});</code></pre>
<p><strong>Cascading Death Loop:</strong> যদি কোনো কারণে ডাটাবেজ স্লো হয়ে যায়, পডের <code>Liveness Probe</code> ফেইল করে। কুবারনেটিস তখন সমস্ত পড একসাথে কিল করে পুনরায় চালু করতে থাকে। নতুন শুরু হওয়া সমস্ত পড একসাথে আবার ডাটাবেজে কোল্ড স্টার্ট হিট করায় পুরো ক্লাস্টার চিরতরে ধসে পড়ে।</p>
<p><strong>ফিক্স:</strong> Liveness Probes-এ কখনোই ডাটাবেজ রাখবেন না (শুধুমাত্র ইন্টারনাল প্রসেস পিং)। এবং <strong>PodDisruptionBudget (PDB)</strong> কনফিগার করুন যাতে একসাথে ক্লাস্টারের ২০% এর বেশি পড ডাউন না হতে পারে।</p>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'K8s Crash Diagnostics',
    q: '১৩৫. Kubernetes এ Exit Code 137 (OOMKilled) বনাম 139 (Segmentation Fault): কীভাবে অটোমেটিক কোর ডাম্প সংগ্রহ করবেন?',
    a: `<p><strong>Exit Code 137 (OOMKilled):</strong> লিনাক্স কার্নেলের OOM Killer প্রসেসটিকে জোরপূর্বক <code>SIGKILL (Kill -9)</code> পাঠিয়েছে কারণ পডের মেমোরি লিমিট (Memory Limit) অতিক্রম করেছিল। সমাধান: মেমোরি লিমিট বৃদ্ধি এবং মেমোরি লিক ফিক্স।</p>
<p><strong>Exit Code 139 (Segmentation Fault):</strong> অবৈধ মেমোরি অ্যাড্রেসে অ্যাক্সেস করার কারণে কার্নেল <code>SIGSEGV</code> পাঠিয়েছে (সাধারণত করাপ্টেড C++ নেটিভ DLL এর কারণে)।</p>
<p><strong>অটোমেটিক কোর ডাম্প সংগ্রহ:</strong> কুবারনেটিস নোডে <code>sysctl kernel.core_pattern = /var/dumps/core.%e.%p</code> সেট করা হয় এবং একটি <strong>PersistentVolumeClaim (PVC)</strong> মাউন্ট করা হয়। ক্র্যাশ ঘটার সাথে সাথে কার্নেল পূর্ণ মেমোরি ডাম্প ডিস্কে লিখে দেয় যা পরবর্তীতে <code>dotnet-dump</code> দিয়ে লোকাল মেশিনে বসে বিশ্লেষণ করা যায়।</p>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Zero-Downtime DB Migration',
    q: '১৩৬. Expand and Contract (Parallel Run) Pattern: ব্রেকিং ডাটাবেজ স্কিমা মাইগ্রেশন কীভাবে শূন্য ডাউনটাইমে করবেন?',
    a: `<p>যদি প্রোডাকশনে <code>Users</code> টেবিলের <code>FullName</code> কলামকে ভেঙে <code>FirstName</code> এবং <code>LastName</code> করতে হয়, সরাসরি অল্টার টেবিল চালালে রানিং এপিআই ক্র্যাশ করবে।</p>
<p><strong>Expand and Contract ৪টি ধাপে সম্পন্ন হয়:</strong></p>
<ol>
    <li><strong>Expand (ফেজ ১):</strong> ডাটাবেজে নতুন কলাম <code>FirstName</code> ও <code>LastName</code> যোগ করুন (পুরানো কলাম অক্ষত রেখে)।</li>
    <li><strong>Dual-Write (ফেজ ২):</strong> নতুন এপিআই ভার্সন ডেপ্লয় করুন যা একই সাথে পুরানো কলাম এবং নতুন কলামে রাইট করে। ব্যাকগ্রাউন্ড স্ক্রিপ্ট দিয়ে পুরানো ডেটা নতুন কলামে মাইগ্রেট করুন।</li>
    <li><strong>Read Switch (ফেজ ৩):</strong> এপিআই রিড অপারেশনকে সম্পূর্ণ নতুন কলামে সুইচ করে দিন।</li>
    <li><strong>Contract (ফেজ ৪):</strong> নিশ্চিত হওয়ার পর পুরানো কলাম <code>FullName</code> নিরাপদভাবে ড্রপ করুন।</li>
</ol>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Enterprise CI/CD Pipelines',
    q: '১৩৭. Trunk-Based Development, SonarQube Quality Gates, Trivy Container Scanning এবং Canary Deployment এর আদর্শ পাইপলাইন?',
    a: `<p>উচ্চমানের সিআই/সিডি পাইপলাইনের ধাপসমূহ:</p>
<ol>
    <li><strong>Trunk-Based Development:</strong> দীর্ঘস্থায়ী ফিচার ব্রাঞ্চ পরিহার করে প্রতিদিন মেইন ব্রাঞ্চে ছোট ছোট কমিট মার্জ করা হয় (Feature Flags ব্যবহার করে)।</li>
    <li><strong>Automated Testing:</strong> প্রতি PR-এ ইউনিট টেস্ট, আর্কিটেকচারাল টেস্ট (NetArchTest), এবং টেস্টকন্টেইনারস (Testcontainers for .NET) দিয়ে রিয়েল Postgres এ ইন্টিগ্রেশন টেস্ট রান হয়।</li>
    <li><strong>SonarQube Quality Gate:</strong> কোড কভারেজ ন্যূনতম ৮০%, কোনো সিকিউরিটি ভালনারেবিলিটি বা টেকনিক্যাল ডেট ব্লক না হওয়া পর্যন্ত পিআর মার্জ নিষিদ্ধ।</li>
    <li><strong>Trivy Image Scan:</strong> ডকার ইমেজে কোনো ওপেন CVE ক্রিটিক্যাল ভালনারেবিলিটি থাকলে ইমেজ পুশ আটকে দেয়।</li>
    <li><strong>Canary Deployment:</strong> কুবারনেটিস আরগো সিডি (Argo Rollouts) দিয়ে ট্রাফিকের মাত্র ৫% নতুন ভার্সনে পাঠানো হয়। এরর রেট ০% নিশ্চিত হলে ধীরে ধীরে ১০০% ট্রাফিক সুইচ করা হয়।</li>
</ol>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Infrastructure as Code',
    q: '১৩৮. Infrastructure as Code (IaC): Terraform বনাম Bicep এর ট্রেড-অফ এবং State Drift কীভাবে প্রতিরোধ করবেন?',
    a: `<p><strong>Terraform (Cloud Agnostic):</strong> মাল্টি-ক্লাউড সমর্থন করে (AWS, Azure, GCP)। <code>terraform.tfstate</code> ফাইল রিমোট S3/Blob স্টোরেজে স্টেট লকিং (DynamoDB দিয়ে) মেইনটেইন করে।</p>
<p><strong>Azure Bicep (Azure Native):</strong> অ্যাজুরের জন্য ডোমেইন-স্পেসিফিক ল্যাঙ্গুয়েজ। কোনো স্টেট ফাইল ম্যানেজ করতে হয় না (অ্যাজুর রিসোর্স ম্যানেজার সরাসরি বর্তমান রিয়েল ক্লাউড স্টেট পড়ে)। কোনো অ্যাজুর নতুন ফিচার রিলিজ হওয়ার দিন ১ থেকেই সাপোর্ট করে।</p>
<p><strong>State Drift প্রতিরোধ:</strong> ডেভেলপাররা যাতে ক্লাউড পোর্টালে ঢুকে ম্যানুয়ালি কোনো সার্ভার বা ফায়ারওয়াল রুল এডিট না করতে পারে তার জন্য পোর্টালে <strong>Read-Only Permission</strong> সেট করতে হয় এবং সিআই/সিডিতে শিডিউলড <code>terraform plan --detailed-exitcode</code> চালিয়ে ড্রাফট ডিটেক্ট হলে সতর্কবার্তা পাঠানো হয়।</p>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'Centralized Observability',
    q: '১৩৯. Structured Logging at Scale: Serilog, OpenSearch বনাম Grafana Loki এর আর্কিটেকচারাল নির্বাচন?',
    a: `<p><strong>Serilog Structured Logging:</strong> প্লেইন টেক্সট স্ট্রিং লগ না লিখে JSON অবজেক্ট প্রোপার্টিজ লগ করতে হয়: <code>Log.Information("Order {OrderId} processed for {Amount}", id, amt);</code>। এতে ডাটাবেজে কুয়েরি করার মতো লগের ভেতর ফিল্টার করা যায়।</p>
<p><strong>OpenSearch / Elasticsearch:</strong> লগের প্রতিটি টেক্সট ও ফিল্ড ইনডেক্স করে (Full-text Lucene Index)। অত্যন্ত দ্রুত সার্চ কিন্তু বিশাল ডিস্ক ও মেমোরি খরচ হয়।</p>
<p><strong>Grafana Loki (Lightweight Standard):</strong> শুধুমাত্র লগের মেটাডাটা লেবেল (যেমন <code>app="order-api", env="prod"</code>) ইনডেক্স করে, লগের ভেতরের বডি ইনডেক্স করে না (Gzip কম্প্রেস করে অবজেক্ট স্টোরেজে রেখে দেয়)। ফলে OpenSearch এর তুলনায় <strong>৮০% ডিস্ক স্পেস ও মেমোরি খরচ কমায়</strong>।</p>`
  },
  {
    topic: 'devops',
    level: 'senior',
    badge: 'SRE Reliability Engineering',
    q: '১৪০. SLI, SLO, SLA এবং Error Budget কীভাবে সফটওয়্যার কোয়ালিটি এবং রিলিজ ভেলোসিটিকে নিয়ন্ত্রণ করে?',
    a: `<p>Google SRE ফ্রেমওয়ার্কের মূল ভিত্তি:</p>
<ul>
    <li><strong>SLI (Service Level Indicator):</strong> বাস্তব পরিমাপিত মেট্রিক (যেমন: গত ৩০ দিনে ৯৯.৯৫% HTTP রিকোয়েস্ট ২০০ms এর নিচে সাকসেস হয়েছে)।</li>
    <li><strong>SLO (Service Level Objective):</strong> ইঞ্জিনিয়ারিং টিমের অভ্যন্তরীণ টার্গেট (যেমন: ৯৯.৯% আপটাইম)।</li>
    <li><strong>SLA (Service Level Agreement):</strong> ক্লায়েন্টের সাথে আইনি চুক্তি (যেমন: ৯৯.৫% নিচে আপটাইম হলে আর্থিক জরিমানা ফেরত দিতে হবে)।</li>
    <li><strong>Error Budget:</strong> ১০০% - SLO = ০.১%। এই ০.১% ফেইলিওরের স্বাধীনতা টিম নতুন এক্সপেরিমেন্টাল ফিচার বা দ্রুত ডেপ্লয়মেন্টে ব্যবহার করতে পারে। কিন্তু যদি প্রোডাকশন বাগে এরর বাজেট নিঃশেষ (Burnout) হয়ে যায়, সমস্ত নতুন ফিচার রিলিজ তাৎক্ষণিকভাবে বন্ধ করে পুরো টিম ১০০% টেকনিক্যাল ডেট ও স্ট্যাবিলিটি ফিক্সে ঝাঁপিয়ে পড়ে।</li>
</ul>`
  }
];
