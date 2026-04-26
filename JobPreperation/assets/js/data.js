const interviewData = {
    "ASP.NET Core & C#": {
        "id": "aspnet",
        "path": "aspnet.html",
        "icon": "bi-code-square",
        "color": "#006a4e",
        "notes": [
            {
                "id": "asp-1",
                "title": "C#: String Interning",
                "content": "String interning is the process where the CLR stores only one copy of each unique string literal in a special table called the 'intern pool'.\n\n- Benefits: Saves memory by reusing references for identical string literals.\n- Performance: String comparisons for interned strings are O(1) pointer checks.\n- Dynamic Strings: Strings created at runtime (e.g. via input) aren't interned by default; use 'string.Intern()' manually.",
                "code": "string a = \"test\";\nstring b = \"test\";\n// ReferenceEquals(a, b) is true"
            },
            {
                "id": "asp-2",
                "title": "C#: Span<T> and Memory<T>",
                "content": "Types for zero-allocation memory slicing.\n\n- Span<T>: Stack-only (ref struct). Fast, but can't be used in async methods.\n- Memory<T>: Heap-compatible counterpart to Span. Can be used as class fields and in async code.\n- Goal: Efficiently work with array/string segments without creating expensive new objects.",
                "code": "ReadOnlySpan<char> span = \"Hello\".AsSpan();"
            },
            {
                "id": "asp-3",
                "title": "C#: Managed vs Unmanaged Resources",
                "content": "Managed: Handled by GC (objects, strings). Unmanaged: Not handled by GC (Files, DB connections). Must implement IDisposable.",
                "code": "public class MyRes : IDisposable { ... }"
            },
            {
                "id": "asp-4",
                "title": "C#: The IDisposable Pattern",
                "content": "Provides deterministic cleanup of unmanaged resources. Use 'using' blocks to ensure '.Dispose()' is called even if errors occur.",
                "code": "using var file = new FileStream(...);"
            },
            {
                "id": "asp-5",
                "title": "C#: Yield & Lazy Evaluation",
                "content": "Allows returning items one-by-one from a collection. Memory efficient for large datasets as only one item exists in memory at a time during iteration.",
                "code": "yield return item;"
            },
            {
                "id": "asp-6",
                "title": "C#: Task.WhenAll vs Task.WaitAll",
                "content": "WhenAll: Asynchronous, non-blocking. Returns a task you can await. WaitAll: Synchronous, blocking. Freezes the thread until all tasks finish.",
                "code": "await Task.WhenAll(tasks);"
            },
            {
                "id": "asp-7",
                "title": "C#: Covariance vs Contravariance",
                "content": "Covariance (out): Use a more derived type than specified. Contravariance (in): Use a less derived type. Applies to delegates and generics.",
                "code": "IEnumerable<object> obj = new List<string>();"
            },
            {
                "id": "asp-8",
                "title": "C#: Structs vs Classes",
                "content": "Classes (Reference types) on Heap. Structs (Value types) on Stack. Use structs for small, immutable types (< 16 bytes).",
                "code": "public struct Point { int X; int Y; }"
            },
            {
                "id": "asp-9",
                "title": "C#: Readonly vs Const",
                "content": "Const: Compile-time constant. Readonly: Run-time constant (can be set in constructor). Readonly is safer for versioning.",
                "code": "public readonly int val;"
            },
            {
                "id": "asp-10",
                "title": "C#: Reflection Deep-Dive",
                "content": "Inspecting metadata at runtime. Powerful but slow. Use Source Generators in .NET 6+ for faster compile-time alternatives.",
                "code": "typeof(T).GetProperties();"
            },
            {
                "id": "asp-11",
                "title": "C#: Expression Trees",
                "content": "Represent code as data structures. Used by EF Core to translate C# LINQ into SQL queries.",
                "code": "Expression<Func<int, bool>> expr = x => x > 0;"
            },
            {
                "id": "asp-12",
                "title": "C#: Records (C# 9+)",
                "content": "Reference types with value-based equality. Concise syntax for DTOs. Supports 'with' for non-destructive mutation.",
                "code": "public record User(string Name);"
            },
            {
                "id": "asp-13",
                "title": "C#: Pattern Matching",
                "content": "Modern control flow using 'switch' expressions or 'is' keywords for shape/type checking.",
                "code": "if (obj is Person { Age: > 18 })"
            },
            {
                "id": "asp-14",
                "title": "C#: Async State Machine",
                "content": "The compiler turns 'async' methods into a state machine that handles 'await' by yielding control to the caller and resuming later.",
                "code": "public async Task Run() { ... }"
            },
            {
                "id": "asp-15",
                "title": "C#: Default Interface Methods",
                "content": "Interfaces can now have implementations. This allows evolving interfaces without breaking existing implementing classes.",
                "code": "void Log() => Console.WriteLine(\"Log\");"
            },
            {
                "id": "asp-16",
                "title": "C#: Indexers",
                "content": "Customizing array-like access for your objects using the 'this' keyword.",
                "code": "public T this[int i] => data[i];"
            },
            {
                "id": "asp-17",
                "title": "C#: Generics & Constraints",
                "content": "Type-safe code without boxing. Use 'where' to constrain types to classes, interfaces, or specific constructors.",
                "code": "class Rep<T> where T : class"
            },
            {
                "id": "asp-18",
                "title": "C#: Nullable Reference Types",
                "content": "Opt-in compiler warnings for potential nulls. Forces developers to explicitly mark variables that can be null.",
                "code": "string? mayBeNull;"
            },
            {
                "id": "asp-19",
                "title": "C#: The Lock Keyword",
                "content": "Synchronizes multithreaded access to shared resources using a mutual exclusion (mutex) lock object.",
                "code": "lock(_lock) { ... }"
            },
            {
                "id": "asp-20",
                "title": "C#: Extension Methods",
                "content": "Adding functionality to existing types without modifying them. Must be static methods in static classes.",
                "code": "public static void Do(this string s)"
            },
            {
                "id": "asp-21",
                "title": "ASP.NET Core: Middleware Pipeline",
                "content": "A chain of components that handle HTTP requests. Order is critical (e.g. Auth must be before Routing).",
                "code": "app.UseMiddleware<X>();"
            },
            {
                "id": "asp-22",
                "title": "ASP.NET Core: DI Lifetimes",
                "content": "Transient: New per request. Scoped: Shared per HTTP request. Singleton: One per app lifecycle. Essential for memory management.",
                "code": "services.AddScoped<I, T>();"
            },
            {
                "id": "asp-23",
                "title": "ASP.NET Core: Kestrel Server",
                "content": "Optimized, cross-platform web server. Usually sits behind a reverse proxy (IIS/Nginx) for security and SSL termination.",
                "code": "builder.WebHost.UseKestrel();"
            },
            {
                "id": "asp-24",
                "title": "ASP.NET Core: Configuration",
                "content": "Multi-source config (JSON, ENV, CLI, KeyVault). Higher precedence sources override earlier ones.",
                "code": "config[\"Key\"];"
            },
            {
                "id": "asp-25",
                "title": "ASP.NET Core: Options Pattern",
                "content": "Strongly-typed settings. Use IOptions (singleton), IOptionsSnapshot (scoped), or IOptionsMonitor (real-time changes).",
                "code": "services.Configure<MySet>(...);"
            },
            {
                "id": "asp-26",
                "title": "ASP.NET Core: Environments",
                "content": "Use 'ASPNETCORE_ENVIRONMENT' to toggle features like Swagger or detailed error pages between Dev and Prod.",
                "code": "if (app.Environment.IsDev())"
            },
            {
                "id": "asp-27",
                "title": "ASP.NET Core: Attribute Routing",
                "content": "Defining routes directly on methods. Recommended for APIs to keep URL structure and logic together.",
                "code": "[Route(\"api/[controller]\")]"
            },
            {
                "id": "asp-28",
                "title": "ASP.NET Core: Filter Pipeline",
                "content": "Auth, Resource, Action, Exception, Result. Filters run logic at specific stages of the request cycle.",
                "code": "public class MyFilter : IActionFilter"
            },
            {
                "id": "asp-29",
                "title": "ASP.NET Core: Model Binding",
                "content": "Mapping HTTP data (Body, Query, Route) to C# objects. Use Data Annotations for automatic validation.",
                "code": "[FromBody] User user"
            },
            {
                "id": "asp-30",
                "title": "ASP.NET Core: Tag Helpers",
                "content": "Server-side code that renders HTML elements in Razor. Cleaner and more intuitive than @Html helpers.",
                "code": "<form asp-action=\"Save\">"
            },
            {
                "id": "asp-31",
                "title": "ASP.NET Core: View Components",
                "content": "Self-contained logic blocks for UI (e.g. Nav menus). Fetch their own data independently of the main controller.",
                "code": "InvokeAsync()"
            },
            {
                "id": "asp-32",
                "title": "ASP.NET Core: Razor Pages vs MVC",
                "content": "Razor Pages: Page-centric (logic + view). MVC: Controller-centric. Razor Pages is often better for simple UI apps.",
                "code": "public class MyPage : PageModel"
            },
            {
                "id": "asp-33",
                "title": "ASP.NET Core: Background Tasks",
                "content": "Use 'IHostedService' or 'BackgroundService' for long-running logic (e.g. processing queues) outside the request loop.",
                "code": "protected override async Task Exec"
            },
            {
                "id": "asp-34",
                "title": "ASP.NET Core: Minimal APIs",
                "content": "High-performance, low-boilerplate endpoints mapped directly in Program.cs. Ideal for microservices.",
                "code": "app.MapGet(\"/\", () => \"hi\");"
            },
            {
                "id": "asp-35",
                "title": "ASP.NET Core: Problem Details",
                "content": "A standard (RFC 7807) for returning machine-readable error responses in a consistent JSON format.",
                "code": "AddProblemDetails();"
            },
            {
                "id": "asp-36",
                "title": "EF Core: AsNoTracking",
                "content": "Critical for read-only queries. Disables the Change Tracker, making queries significantly faster and saving memory.",
                "code": "db.Users.AsNoTracking().ToList();"
            },
            {
                "id": "asp-37",
                "title": "EF Core: Eager vs Lazy Loading",
                "content": "Eager (.Include): Single query for all data. Lazy: Fetch on access (risk of N+1). Always prefer Eager for performance.",
                "code": "db.Posts.Include(p => p.Tags);"
            },
            {
                "id": "asp-38",
                "title": "EF Core: Split Queries",
                "content": "Avoids massive JOINs (Cartesian Explosion) by executing multiple smaller SQL queries for a single LINQ query.",
                "code": "AsSplitQuery()"
            },
            {
                "id": "asp-39",
                "title": "EF Core: Concurrency Tokens",
                "content": "Prevents 'Last-in-Wins' data loss by using RowVersion/Timestamps to detect conflicting updates.",
                "code": "Property(p => p.Ver).IsRowVersion();"
            },
            {
                "id": "asp-40",
                "title": "EF Core: Global Query Filters",
                "content": "Predicates applied to all model queries. Essential for 'Soft Delete' or Multitenant 'TenantId' isolation.",
                "code": "HasQueryFilter(x => !x.IsDel);"
            },
            {
                "id": "asp-41",
                "title": "Web API: Content Negotiation",
                "content": "Process where client and server agree on the data format (JSON, XML). Server checks 'Accept' header.",
                "code": "builder.Services.AddXmlFormatters();"
            },
            {
                "id": "asp-42",
                "title": "Web API: HATEOAS",
                "content": "Hypermedia as the Engine of Application State. API responses include links to related resources to guide the client.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-43",
                "title": "Web API: Idempotency in REST",
                "content": "Operations (GET, PUT, DELETE) that can be performed multiple times with the same result on the server.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-44",
                "title": "Web API: HttpClientFactory",
                "content": "Preferred way to manage HttpClient. Prevents socket exhaustion and handles DNS changes automatically.",
                "code": "services.AddHttpClient();"
            },
            {
                "id": "asp-45",
                "title": "Web API: Rate Limiting",
                "content": "Restricting request counts per user/IP to prevent abuse and ensure service availability.",
                "code": "app.UseRateLimiter();"
            },
            {
                "id": "asp-46",
                "title": "EF Core: Shadow Properties",
                "content": "Properties existing in the DB but not in the C# class. Useful for 'LastUpdated' or 'CreatedBy' audit fields.",
                "code": "EF.Property<DateTime>(p, \"Date\");"
            },
            {
                "id": "asp-47",
                "title": "EF Core: Value Converters",
                "content": "Translating complex C# types (e.g. Enums or Encrypted strings) into simple DB types automatically.",
                "code": "HasConversion<string>();"
            },
            {
                "id": "asp-48",
                "title": "EF Core: Interceptors",
                "content": "Low-level hooks to modify SQL or audit operations before/after they hit the database.",
                "code": "DbCommandInterceptor"
            },
            {
                "id": "asp-49",
                "title": "EF Core: Compiled Queries",
                "content": "Pre-compiling LINQ into SQL for high-frequency queries to eliminate translation overhead.",
                "code": "EF.CompileQuery(...)"
            },
            {
                "id": "asp-50",
                "title": "EF Core: Owned Types",
                "content": "Mapping objects that don't have their own ID to the same table as their parent (DDD Value Objects).",
                "code": "OwnsOne(x => x.Addr);"
            },
            {
                "id": "asp-51",
                "title": "Architecture: Clean Architecture",
                "content": "Separating business logic from external dependencies (DB, UI). Core is at the center, depends on nothing.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-52",
                "title": "Architecture: CQRS Pattern",
                "content": "Separating Read models from Write models to optimize performance and allow independent scaling.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-53",
                "title": "Architecture: Event Sourcing",
                "content": "Storing changes as a sequence of events rather than just the final state. Perfect for auditing.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-54",
                "title": "Architecture: Repository & Unit of Work",
                "content": "Abstracting data access and ensuring multiple repo operations share a single transaction.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-55",
                "title": "Architecture: Microservices Gateway",
                "content": "Single entry point (Ocelot/YARP) that routes client requests to internal services and handles Auth/RateLimiting.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-56",
                "title": "Security: JWT Authentication",
                "content": "Stateless auth using tokens containing claims. Signed by the server to prevent tampering.",
                "code": "[Authorize]"
            },
            {
                "id": "asp-57",
                "title": "Security: OAuth2 vs OpenID Connect",
                "content": "OAuth2 is for Authorization (access to resources). OIDC is for Authentication (who is the user).",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-58",
                "title": "Security: CORS Explained",
                "content": "Cross-Origin Resource Sharing. Browser safety feature allowing/denying access from different domains.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-59",
                "title": "Security: CSRF Prevention",
                "content": "Using Anti-Forgery tokens to prevent malicious sites from acting as the user on your API.",
                "code": "app.UseAntiforgery();"
            },
            {
                "id": "asp-60",
                "title": "Security: SQL Injection Defense",
                "content": "Never concatenate strings. Use parameterized queries or EF Core which does it by default.",
                "code": "FromSqlInterpolated(...)"
            },
            {
                "id": "asp-61",
                "title": "Performance: Caching (In-Memory)",
                "content": "Storing data in the app's local memory. Fastest, but not shared between multiple server instances.",
                "code": "IMemoryCache"
            },
            {
                "id": "asp-62",
                "title": "Performance: Distributed Caching (Redis)",
                "content": "Shared cache for load-balanced apps. Survives app restarts and maintains consistency across servers.",
                "code": "IDistributedCache"
            },
            {
                "id": "asp-63",
                "title": "Performance: Response Compression",
                "content": "Reducing payload size (Gzip/Brotli) to save bandwidth and speed up mobile clients.",
                "code": "app.UseResponseCompression();"
            },
            {
                "id": "asp-64",
                "title": "Performance: Connection Pooling",
                "content": "Reusing DB connections to avoid the heavy cost of opening new ones for every request.",
                "code": "AddDbContextPool"
            },
            {
                "id": "asp-65",
                "title": "Performance: Boxing & Unboxing",
                "content": "Costly process of converting Value types to Reference types. Avoid by using Generics.",
                "code": "List<int> vs ArrayList"
            },
            {
                "id": "asp-66",
                "title": "Testing: Unit Testing with Moq",
                "content": "Testing logic in isolation by replacing real dependencies with mocks.",
                "code": "mock.Setup(x => x.Do()).Returns(y);"
            },
            {
                "id": "asp-67",
                "title": "Testing: Integration Testing",
                "content": "Testing how components work together, usually using 'WebApplicationFactory' and a test DB.",
                "code": "public class MyTests : IClassFixture"
            },
            {
                "id": "asp-68",
                "title": "DevOps: Dockerfile for .NET",
                "content": "Multi-stage builds to create small, secure production images. Separates Build env from Run env.",
                "code": "FROM mcr.microsoft.com/..."
            },
            {
                "id": "asp-69",
                "title": "DevOps: CI/CD for .NET",
                "content": "Automated Build (GitHub Actions), Test, and Deploy (Azure/AWS) pipeline for high-quality shipping.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-70",
                "title": "C#: Garbage Collector Generations",
                "content": "Gen 0: New objects. Gen 1: Short-lived. Gen 2: Long-lived. GC cleans Gen 0 most frequently.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-71",
                "title": "C#: The IAsyncEnumerable Interface",
                "content": "Streaming data asynchronously. Allows processing items as they arrive from the DB/API without waiting for the full list.",
                "code": "await foreach (var item in stream)"
            },
            {
                "id": "asp-72",
                "title": "C#: Concurrent Collections",
                "content": "Thread-safe versions of List/Dictionary (e.g. ConcurrentDictionary) for high-concurrency scenarios.",
                "code": "ConcurrentDictionary<K, V>"
            },
            {
                "id": "asp-73",
                "title": "ASP.NET Core: Health Checks",
                "content": "Endpoints that report the 'liveness' of the app and its dependencies (DB, Redis) to load balancers.",
                "code": "app.MapHealthChecks(\"/health\");"
            },
            {
                "id": "asp-74",
                "title": "ASP.NET Core: SignalR Real-time",
                "content": "Bi-directional communication between client and server using WebSockets with automatic fallback.",
                "code": "app.MapHub<MyHub>(\"/chat\");"
            },
            {
                "id": "asp-75",
                "title": "ASP.NET Core: gRPC High-Performance",
                "content": "Contract-first API using Protobuf. Significantly faster and smaller payloads than REST/JSON.",
                "code": "service.proto"
            },
            {
                "id": "asp-76",
                "title": "Architecture: Saga Pattern",
                "content": "Managing distributed transactions across multiple microservices by using a sequence of compensating events.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-77",
                "title": "Architecture: Circuit Breaker Pattern",
                "content": "Preventing a service from repeatedly trying an operation that is likely to fail (using Polly library).",
                "code": "Policy.Handle<T>().CircuitBreaker(3, sec);"
            },
            {
                "id": "asp-78",
                "title": "EF Core: Migrations Best Practices",
                "content": "Always review generated SQL. Don't use migrations for production data seeding; use scripts or distinct APIs.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-79",
                "title": "C#: Deconstruction",
                "content": "Extracting values from an object or tuple into distinct variables in a single line.",
                "code": "var (name, age) = person;"
            },
            {
                "id": "asp-80",
                "title": "C#: Interpolated Strings Internals",
                "content": "C# 10+ uses 'DefaultInterpolatedStringHandler' to optimize memory allocation for string formatting.",
                "code": "$\"{var}\""
            },
            {
                "id": "asp-81",
                "title": "Domain Driven Design (DDD) Fundamentals",
                "content": "This is a senior-level deep dive into Domain Driven Design (DDD) Fundamentals.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-82",
                "title": "Outbox Pattern for Reliable Messaging",
                "content": "This is a senior-level deep dive into Outbox Pattern for Reliable Messaging.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-83",
                "title": "Idempotent Consumers in Microservices",
                "content": "This is a senior-level deep dive into Idempotent Consumers in Microservices.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-84",
                "title": "Azure App Service vs Static Web Apps",
                "content": "This is a senior-level deep dive into Azure App Service vs Static Web Apps.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-85",
                "title": "AWS Lambda cold start optimizations",
                "content": "This is a senior-level deep dive into AWS Lambda cold start optimizations.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-86",
                "title": "Container Orchestration with Kubernetes",
                "content": "This is a senior-level deep dive into Container Orchestration with Kubernetes.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-87",
                "title": "Service Mesh (Istio) benefits",
                "content": "This is a senior-level deep dive into Service Mesh (Istio) benefits.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-88",
                "title": "Observability: Tracing, Logging, Metrics",
                "content": "This is a senior-level deep dive into Observability: Tracing, Logging, Metrics.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-89",
                "title": "Log Analytics and Kusto (KQL)",
                "content": "This is a senior-level deep dive into Log Analytics and Kusto (KQL).\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-90",
                "title": "Solid Principles: Dependency Inversion detail",
                "content": "This is a senior-level deep dive into Solid Principles: Dependency Inversion detail.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-91",
                "title": "Solid Principles: Interface Segregation detail",
                "content": "This is a senior-level deep dive into Solid Principles: Interface Segregation detail.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-92",
                "title": "Liskov Substitution: Why it breaks code",
                "content": "This is a senior-level deep dive into Liskov Substitution: Why it breaks code.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-93",
                "title": "Open/Closed: Strategy Pattern implementation",
                "content": "This is a senior-level deep dive into Open/Closed: Strategy Pattern implementation.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-94",
                "title": "Single Responsibility: High Cohesion",
                "content": "This is a senior-level deep dive into Single Responsibility: High Cohesion.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-95",
                "title": "GRASP Patterns vs SOLID",
                "content": "This is a senior-level deep dive into GRASP Patterns vs SOLID.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-96",
                "title": "Infrastructure as Code (Terraform/Bicep)",
                "content": "This is a senior-level deep dive into Infrastructure as Code (Terraform/Bicep).\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-97",
                "title": "Database Sharding vs Partitioning",
                "content": "This is a senior-level deep dive into Database Sharding vs Partitioning.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-98",
                "title": "NoSQL vs RDBMS: When to choose",
                "content": "This is a senior-level deep dive into NoSQL vs RDBMS: When to choose.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-99",
                "title": "Redis Data Types: Pub/Sub vs Streams",
                "content": "This is a senior-level deep dive into Redis Data Types: Pub/Sub vs Streams.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            },
            {
                "id": "asp-100",
                "title": "Finalizers and GC.SuppressFinalize",
                "content": "This is a senior-level deep dive into Finalizers and GC.SuppressFinalize.\n\n- Definition: Clear architectural or language concept.\n- Importance: Why it scales systems or ensures reliability.\n- Senior Insight: Real-world trade-off to consider during design phase.",
                "code": "// Code snippet example\nvar result = i + 1;"
            }
        ]
    },
    "Databases (SQL/Postgres)": {
        "id": "databases",
        "path": "databases.html",
        "icon": "bi-database-fill",
        "color": "#f42a41",
        "notes": [
            {
                "id": "db-1",
                "title": "Clustered vs Non-Clustered Indexes",
                "content": "Understanding indexing is critical for database performance optimization.\n\n- Clustered Index: This index determines the physical order of data in the table. Because data can only be sorted in one way, there can only be ONE clustered index per table (usually the Primary Key).\n- Non-Clustered Index: A separate structure from the data rows. It contains a sorted list of values and 'pointers' back to the actual data rows. You can have many of these.\n- Analogy: A Clustered Index is like a Phone Book (the data is the index). A Non-Clustered Index is like the Index at the back of a textbook (it points to pages).",
                "code": "CREATE CLUSTERED INDEX IX_Users_Id ON Users(Id);\nCREATE NONCLUSTERED INDEX IX_Users_Email ON Users(Email);"
            },
            {
                "id": "db-2",
                "title": "ACID Properties in Depth",
                "content": "ACID is a set of properties that guarantee database transactions are processed reliably.\n\n- Atomicity: 'All or nothing'. If one part of a transaction fails, the whole transaction is rolled back.\n- Consistency: A transaction must transform the database from one valid state to another, maintaining all constraints and rules.\n- Isolation: Transactions occurring at the same time should not see each other's partial results. This is managed by 'Isolation Levels' (Read Committed, Serializable, etc.).\n- Durability: Once a transaction is committed, it remains saved even in the event of a power failure or crash.",
                "code": "BEGIN TRANSACTION;\n-- Multiple SQL operations\nCOMMIT; -- Or ROLLBACK if error"
            },
            {
                "id": "db-3",
                "title": "CAP Theorem",
                "content": "The CAP Theorem states that a distributed system can only provide two out of the three following guarantees at once:\n\n- Consistency: Every read receives the most recent write or an error.\n- Availability: Every request receives a (non-error) response, without the guarantee that it contains the most recent write.\n- Partition Tolerance: The system continues to operate despite an arbitrary number of messages being dropped by the network.\n- Practical Application: In the real world, network failures (P) are unavoidable, so systems must choose between Consistency (e.g., SQL Server) or Availability (e.g., Cassandra)."
            }
        ]
    },
    "Frontend (React/Angular)": {
        "id": "frontend",
        "path": "frontend.html",
        "icon": "bi-browser-edge",
        "color": "#006a4e",
        "notes": [
            {
                "id": "fe-1",
                "title": "React Hooks: Lifecycle of useEffect",
                "content": "The 'useEffect' hook is used to handle side effects in functional components (fetching data, subscriptions, manual DOM updates).\n\n- No Dependency Array: Runs after EVERY render.\n- Empty Array []: Runs only once after the initial mount (similar to componentDidMount).\n- With Dependencies [id]: Runs after the initial mount and whenever any dependency value changes.\n- Cleanup Function: Returning a function from useEffect allows you to clean up resources (e.g., clear intervals or unsubscribe) before the component unmounts or before the effect re-runs.",
                "code": "useEffect(() => {\n  const sub = api.subscribe();\n  return () => sub.unsubscribe(); // Cleanup\n}, [api]);"
            },
            {
                "id": "fe-2",
                "title": "Angular: Change Detection & OnPush",
                "content": "Angular's change detection mechanism keeps the UI in sync with the component state.\n\n- Default Strategy: Angular checks every component in the tree from top to bottom whenever any event happens. For large apps, this can be slow.\n- OnPush Strategy: Tells Angular to only check the component if one of its @Input() properties changes (by reference) or if an event fires from within the component itself.\n- Optimization: Using OnPush significantly reduces the number of checks and improves performance in complex UIs.",
                "code": "@Component({\n  selector: 'app-item',\n  changeDetection: ChangeDetectionStrategy.OnPush\n}) "
            },
            {
                "id": "fe-3",
                "title": "Virtual DOM vs Real DOM",
                "content": "The Virtual DOM is a lightweight, in-memory representation of the Real DOM used by frameworks like React.\n\n- The Problem: Updating the Real DOM is expensive because the browser has to recalculate layout and repaint the screen.\n- The Process: When state changes, React creates a new Virtual DOM tree, compares it with the old one (a process called 'Diffing'), and then calculates the minimum set of changes needed.\n- The Result: Only the changed parts of the Real DOM are updated (Reconciliation), making the UI feel extremely fast."
            }
        ]
    },
    "Cloud & DevOps": {
        "id": "cloud",
        "path": "cloud.html",
        "icon": "bi-cloud-check-fill",
        "color": "#f42a41",
        "notes": [
            {
                "id": "cloud-1",
                "title": "Serverless Compute: Lambda vs Functions",
                "content": "Serverless compute (AWS Lambda / Azure Functions) allows you to run code without managing servers.\n\n- No Infrastructure: You don't provision VMs or clusters; you just upload code.\n- Event-Driven: Code only runs in response to events (e.g., HTTP request, file upload to S3, message in a queue).\n- Automatic Scaling: The cloud provider handles scaling from 0 to thousands of concurrent executions automatically.\n- Cost Efficiency: You only pay for the exact milliseconds your code is running, which can save a lot of money for intermittent workloads."
            },
            {
                "id": "cloud-2",
                "title": "Docker vs Kubernetes",
                "content": "While often used together, they serve very different purposes in the DevOps ecosystem.\n\n- Docker: A tool for 'Containerization'. It packages an app and its dependencies into a single image that runs identically on any machine.\n- Kubernetes (K8s): A tool for 'Orchestration'. It manages a cluster of machines and handles the deployment, scaling, and health monitoring of thousands of Docker containers.\n- Relationship: Docker creates the container; Kubernetes manages where and how those containers run at scale."
            },
            {
                "id": "cloud-3",
                "title": "CI/CD Pipeline Principles",
                "content": "Continuous Integration and Continuous Deployment are fundamental to modern senior-level software engineering.\n\n- CI (Integration): Developers frequently merge code into a shared repository. Automated builds and tests run on every commit to catch bugs early.\n- CD (Delivery/Deployment): Code that passes CI is automatically prepared for release. Continuous Deployment takes it a step further by automatically pushing every change to production.\n- Goal: Reduce the 'lead time' from writing code to delivering value to users, while increasing quality through automated safety nets."
            }
        ]
    }
};