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
                "content": "The CLR maintains a table called the intern pool, which contains a single reference to each unique literal string constant. This reduces the amount of memory needed by avoiding duplicates of identical string constants.",
                "code": "string a = \"hello\";\nstring b = \"hello\";\nConsole.WriteLine(object.ReferenceEquals(a, b)); // True"
            },
            {
                "id": "asp-2",
                "title": "C#: Span<T> and Memory<T>",
                "content": "Span<T> is a stack-only type that represents a contiguous region of arbitrary memory. It's used for efficient, zero-allocation memory access. Memory<T> is a heap-compatible counterpart.",
                "code": "Span<byte> stackSpan = stackalloc byte[100];\nReadOnlySpan<char> span = \"Hello World\".AsSpan();"
            },
            {
                "id": "asp-3",
                "title": "C#: Managed vs Unmanaged Resources",
                "content": "Managed resources are handled by the Garbage Collector (GC), like memory for objects. Unmanaged resources are things like file handles, database connections, or sockets which the GC doesn't know how to clean up.",
                "code": "public class MyResource : IDisposable\n{\n    public void Dispose()\n    {\n        // Clean up unmanaged resources\n    }\n}"
            },
            {
                "id": "asp-4",
                "title": "C#: The IDisposable Pattern",
                "content": "Used to provide a mechanism for releasing unmanaged resources. Implementing IDisposable allows you to use the 'using' block for automatic cleanup.",
                "code": "using (var stream = new FileStream(\"test.txt\", FileMode.Open))\n{\n    // use stream\n}"
            },
            {
                "id": "asp-5",
                "title": "C#: Yield Keyword",
                "content": "The yield keyword indicates that the method is an iterator. It allows for lazy evaluation of a collection, providing items one by one.",
                "code": "public IEnumerable<int> GetNumbers()\n{\n    yield return 1;\n    yield return 2;\n}"
            },
            {
                "id": "asp-6",
                "title": "C#: Task.WhenAll vs Task.WaitAll",
                "content": "Task.WhenAll returns a Task that completes when all provided tasks complete (non-blocking). Task.WaitAll blocks the current thread until all tasks complete.",
                "code": "await Task.WhenAll(task1, task2);\nTask.WaitAll(task1, task2); // Blocking!"
            },
            {
                "id": "asp-7",
                "title": "C#: Covariance vs Contravariance",
                "content": "Covariance allows you to use a more derived type than originally specified. Contravariance allows you to use a less derived (more general) type.",
                "code": "IEnumerable<string> strings = new List<string>();\nIEnumerable<object> objects = strings; // Covariance"
            },
            {
                "id": "asp-8",
                "title": "C#: Structs vs Classes",
                "content": "Classes are reference types (stored on heap). Structs are value types (stored on stack). Use structs for small, immutable data types to reduce GC pressure."
            },
            {
                "id": "asp-9",
                "title": "C#: Readonly vs Const",
                "content": "const is a compile-time constant. readonly is a run-time constant that can be initialized in the constructor.",
                "code": "public const int MaxValue = 100;\npublic readonly int InstanceValue;"
            },
            {
                "id": "asp-10",
                "title": "C#: Reflection deep-dive",
                "content": "Reflection allows you to inspect metadata about types at runtime and even instantiate objects or call methods dynamically.",
                "code": "var type = typeof(MyClass);\nvar methods = type.GetMethods();"
            },
            {
                "id": "asp-11",
                "title": "C#: Expression Trees",
                "content": "Expression trees represent code in a tree-like data structure, where each node is an expression. EF Core uses them to translate LINQ queries into SQL.",
                "code": "Expression<Func<int, bool>> expr = n => n > 5;"
            },
            {
                "id": "asp-12",
                "title": "C#: Records in C# 9.0+",
                "content": "Records are reference types that provide built-in functionality for encapsulating data with value-based equality.",
                "code": "public record Person(string Name, int Age);"
            },
            {
                "id": "asp-13",
                "title": "C#: Pattern Matching",
                "content": "Pattern matching allows you to test expressions and perform actions based on their shape or value.",
                "code": "if (obj is string s) { /* use s */ }"
            },
            {
                "id": "asp-14",
                "title": "C#: Async/Await State Machine",
                "content": "The compiler transforms an async method into a state machine that handles pauses and resumes without blocking threads.",
                "code": "public async Task MyMethod() { ... }"
            },
            {
                "id": "asp-15",
                "title": "C#: Default Interface Methods",
                "content": "Introduced in C# 8.0, allows you to provide a default implementation for members in an interface.",
                "code": "interface IMyInterface { void MyMethod() => Console.WriteLine(\"Default\"); }"
            },
            {
                "id": "asp-16",
                "title": "C#: Indexers",
                "content": "Indexers allow instances of a class or struct to be indexed just like arrays.",
                "code": "public int this[int index] { get => data[index]; }"
            },
            {
                "id": "asp-17",
                "title": "C#: Generics and Constraints",
                "content": "Generics allow for type-safe code without boxing. Constraints limit the types that can be used as arguments.",
                "code": "public class MyList<T> where T : class { }"
            },
            {
                "id": "asp-18",
                "title": "C#: Nullable Reference Types",
                "content": "A C# 8.0 feature that helps prevent NullReferenceExceptions by making nullability explicit.",
                "code": "#nullable enable\nstring? name = null;"
            },
            {
                "id": "asp-19",
                "title": "C#: The lock keyword",
                "content": "Used to ensure that a block of code runs to completion without interruption by other threads by obtaining a mutual-exclusion lock.",
                "code": "lock(this) { ... }"
            },
            {
                "id": "asp-20",
                "title": "C#: Extension Methods",
                "content": "Allows you to add new methods to existing types without creating a new derived type.",
                "code": "public static void MyExtension(this string s) { ... }"
            },
            {
                "id": "asp-21",
                "title": "ASP.NET Core: The Middleware Pipeline",
                "content": "A sequence of delegates that handle requests and responses. Each middleware component can perform logic before and after the next component in the pipeline.",
                "code": "app.Use((context, next) => { ... return next(); });"
            },
            {
                "id": "asp-22",
                "title": "ASP.NET Core: Dependency Injection (DI)",
                "content": "A first-class citizen in ASP.NET Core. It supports constructor injection and provides a built-in IoC container.",
                "code": "public MyController(IMyService service) { ... }"
            },
            {
                "id": "asp-23",
                "title": "ASP.NET Core: Kestrel Server",
                "content": "A cross-platform, high-performance web server for ASP.NET Core. It's often used behind a reverse proxy like IIS or Nginx."
            },
            {
                "id": "asp-24",
                "title": "ASP.NET Core: Configuration Providers",
                "content": "Allows you to load configuration from JSON files, environment variables, command-line arguments, or Azure Key Vault.",
                "code": "builder.Configuration.AddJsonFile(\"appsettings.json\");"
            },
            {
                "id": "asp-25",
                "title": "ASP.NET Core: Options Pattern",
                "content": "Uses classes to represent groups of related settings. It's the preferred way to access configuration values.",
                "code": "services.Configure<MyOptions>(Configuration.GetSection(\"MySettings\"));"
            },
            {
                "id": "asp-26",
                "title": "ASP.NET Core: Environment Handling",
                "content": "Allows you to change app behavior based on the environment (Development, Staging, Production).",
                "code": "if (app.Environment.IsDevelopment()) { app.UseSwagger(); }"
            },
            {
                "id": "asp-27",
                "title": "ASP.NET Core: Routing (Attribute vs Conventional)",
                "content": "Conventional routing defines routes in a central place. Attribute routing uses attributes on controllers/actions.",
                "code": "[Route(\"api/[controller]\")]\npublic class MyController { ... }"
            },
            {
                "id": "asp-28",
                "title": "ASP.NET Core: Filters",
                "content": "Allows running code at specific stages in the request processing pipeline (Authorization, Resource, Action, Exception, Result).",
                "code": "public class MyActionFilter : IActionFilter { ... }"
            },
            {
                "id": "asp-29",
                "title": "ASP.NET Core: Model Binding",
                "content": "The process of mapping data from HTTP requests to action method parameters.",
                "code": "public IActionResult Post([FromBody] MyModel model) { ... }"
            },
            {
                "id": "asp-30",
                "title": "ASP.NET Core: Tag Helpers",
                "content": "Enable server-side code to participate in creating and rendering HTML elements in Razor files.",
                "code": "<form asp-controller=\"Home\" asp-action=\"Index\">"
            },
            {
                "id": "asp-31",
                "title": "ASP.NET Core: View Components",
                "content": "Similar to partial views, but they are more powerful and don't rely on controllers. They include their own logic.",
                "code": "@await Component.InvokeAsync(\"PriorityList\", new { ... })"
            },
            {
                "id": "asp-32",
                "title": "ASP.NET Core: Razor Pages vs MVC",
                "content": "MVC is better for large complex apps. Razor Pages is page-centric and often more productive for simple scenarios."
            },
            {
                "id": "asp-33",
                "title": "ASP.NET Core: In-Process vs Out-of-Process Hosting",
                "content": "In-process runs the app in the same process as the IIS worker process (W3WP.exe). Out-of-process runs it in a separate kestrel process."
            },
            {
                "id": "asp-34",
                "title": "ASP.NET Core: Background Tasks (IHostedService)",
                "content": "Allows running background tasks in the ASP.NET Core application.",
                "code": "public class MyWorker : BackgroundService { ... }"
            },
            {
                "id": "asp-35",
                "title": "ASP.NET Core: Minimal APIs",
                "content": "A new way to build APIs with minimal dependencies and code, introduced in .NET 6.",
                "code": "app.MapGet(\"/\", () => \"Hello World!\");"
            },
            {
                "id": "asp-36",
                "title": "ASP.NET Core: Strongly Typed Configuration",
                "content": "Binds configuration sections to POCO classes for type-safe access.",
                "code": "var settings = Configuration.GetSection(\"Section\").Get<MySettings>();"
            },
            {
                "id": "asp-37",
                "title": "ASP.NET Core: Application Parts",
                "content": "Allows loading controllers or views from a separate assembly (e.g., a plugin architecture).",
                "code": "builder.Services.AddControllers().AddApplicationPart(assembly);"
            },
            {
                "id": "asp-38",
                "title": "ASP.NET Core: Error Handling Middleware",
                "content": "Centralized place to catch exceptions and return a standardized response.",
                "code": "app.UseExceptionHandler(\"/Error\");"
            },
            {
                "id": "asp-39",
                "title": "ASP.NET Core: Health Checks",
                "content": "Provides a way to expose the health of the application and its dependencies (DB, Redis, etc.).",
                "code": "app.MapHealthChecks(\"/health\");"
            },
            {
                "id": "asp-40",
                "title": "ASP.NET Core: Logging (ILogger)",
                "content": "Built-in logging abstraction that supports various providers (Console, Debug, Serilog, etc.).",
                "code": "_logger.LogInformation(\"Message\");"
            },
            {
                "id": "asp-41",
                "title": "Web API: RESTful Principles",
                "content": "Representational State Transfer. Key principles: Client-Server, Stateless, Cacheable, Layered System, Uniform Interface."
            },
            {
                "id": "asp-42",
                "title": "Web API: Content Negotiation",
                "content": "The process of selecting the best representation for a given response when there are multiple representations available (e.g., JSON vs XML).",
                "code": "builder.Services.AddControllers().AddXmlSerializerFormatters();"
            },
            {
                "id": "asp-43",
                "title": "Web API: Action Result types",
                "content": "IActionResult vs Task<IActionResult> vs ActionResult<T>. The latter allows returning both the type and the action result.",
                "code": "public ActionResult<MyModel> Get() { return model; }"
            },
            {
                "id": "asp-44",
                "title": "Web API: Custom Model Binding",
                "content": "Allows you to create custom logic for how parameters are populated from the HTTP request.",
                "code": "public class MyModelBinder : IModelBinder { ... }"
            },
            {
                "id": "asp-45",
                "title": "Web API: API Versioning",
                "content": "Handling multiple versions of an API using query strings, headers, or URL segments.",
                "code": "builder.Services.AddApiVersioning(options => { ... });"
            },
            {
                "id": "asp-46",
                "title": "Web API: CORS Policy",
                "content": "Cross-Origin Resource Sharing. Allows you to specify which origins are allowed to access your API.",
                "code": "app.UseCors(options => options.WithOrigins(\"...\"));"
            },
            {
                "id": "asp-47",
                "title": "Web API: Data Shaper / Partial Responses",
                "content": "Allows clients to request only specific fields from an object to reduce payload size."
            },
            {
                "id": "asp-48",
                "title": "Web API: HATEOAS",
                "content": "Hypermedia as the Engine of Application State. Providing links in the API response to guide the client to related resources."
            },
            {
                "id": "asp-49",
                "title": "Web API: Idempotency",
                "content": "The property of certain operations in mathematics and computer science whereby they can be applied multiple times without changing the result (e.g., GET, PUT, DELETE)."
            },
            {
                "id": "asp-50",
                "title": "Web API: Status Codes (201, 204, 400, 401, 403, 404, 409, 500)",
                "content": "201 (Created), 204 (No Content), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 409 (Conflict)."
            },
            {
                "id": "asp-51",
                "title": "Web API: Rate Limiting",
                "content": "Restricting the number of requests a user can make to an API in a given time period to prevent abuse.",
                "code": "builder.Services.AddRateLimiter(options => { ... });"
            },
            {
                "id": "asp-52",
                "title": "Web API: Swagger / OpenAPI",
                "content": "Tools for documenting and testing APIs visually.",
                "code": "app.UseSwaggerUI();"
            },
            {
                "id": "asp-53",
                "title": "Web API: JSON Patch",
                "content": "A way to perform partial updates on a resource using the HTTP PATCH method.",
                "code": "public IActionResult Patch([FromBody] JsonPatchDocument patchDoc) { ... }"
            },
            {
                "id": "asp-54",
                "title": "Web API: Custom Action Constraints",
                "content": "Allows you to decide whether an action should be selected based on custom logic (e.g., specific header presence).",
                "code": "public class MyConstraint : IActionConstraint { ... }"
            },
            {
                "id": "asp-55",
                "title": "Web API: Global Exception Filter",
                "content": "A filter that runs when an unhandled exception occurs in an action.",
                "code": "public class MyExceptionFilter : IExceptionFilter { ... }"
            },
            {
                "id": "asp-56",
                "title": "Web API: Problem Details",
                "content": "A standardized format (RFC 7807) for returning error information from an API.",
                "code": "builder.Services.AddProblemDetails();"
            },
            {
                "id": "asp-57",
                "title": "Web API: SignalR",
                "content": "A library for adding real-time web functionality to applications (WebSockets fallback).",
                "code": "app.MapHub<MyHub>(\"/myhub\");"
            },
            {
                "id": "asp-58",
                "title": "Web API: gRPC",
                "content": "A high-performance RPC framework that uses HTTP/2 and Protocol Buffers for communication.",
                "code": "app.MapGrpcService<MyService>();"
            },
            {
                "id": "asp-59",
                "title": "Web API: HttpClientFactory",
                "content": "The preferred way to instantiate and manage HttpClient instances to avoid socket exhaustion.",
                "code": "services.AddHttpClient();"
            },
            {
                "id": "asp-60",
                "title": "Web API: OData",
                "content": "Open Data Protocol. A standard for building and consuming RESTful APIs with advanced querying capabilities.",
                "code": "app.MapODataRoute(...);"
            },
            {
                "id": "asp-61",
                "title": "EF Core: Tracking vs No-Tracking Queries",
                "content": "Tracking queries store objects in the change tracker. No-tracking queries (AsNoTracking) are faster and use less memory for read-only scenarios.",
                "code": "db.Users.AsNoTracking().ToList();"
            },
            {
                "id": "asp-62",
                "title": "EF Core: Eager, Lazy, and Explicit Loading",
                "content": "Eager: Include(). Lazy: Loading on access (proxies). Explicit: Load() method.",
                "code": "db.Users.Include(u => u.Posts).ToList();"
            },
            {
                "id": "asp-63",
                "title": "EF Core: Migrations",
                "content": "A way to keep the database schema in sync with the model code.",
                "code": "dotnet ef migrations add InitialCreate"
            },
            {
                "id": "asp-64",
                "title": "EF Core: Shadow Properties",
                "content": "Properties that are defined in the EF Core model but not in the .NET entity class.",
                "code": "modelBuilder.Entity<Post>().Property<DateTime>(\"LastUpdated\");"
            },
            {
                "id": "asp-65",
                "title": "EF Core: Global Query Filters",
                "content": "LINQ query predicates applied to Entity Types in the model, usually for Soft Delete scenarios.",
                "code": "modelBuilder.Entity<Post>().HasQueryFilter(p => !p.IsDeleted);"
            },
            {
                "id": "asp-66",
                "title": "EF Core: Concurrency Tokens (RowVersion)",
                "content": "Used to detect concurrency conflicts when multiple users update the same row simultaneously.",
                "code": "modelBuilder.Entity<Post>().Property(p => p.RowVersion).IsRowVersion();"
            },
            {
                "id": "asp-67",
                "title": "EF Core: Raw SQL Queries",
                "content": "Allows executing custom SQL queries while still mapping results to entity types.",
                "code": "db.Posts.FromSqlRaw(\"SELECT * FROM Posts\");"
            },
            {
                "id": "asp-68",
                "title": "EF Core: Table-per-Hierarchy (TPH)",
                "content": "The default inheritance mapping strategy where all classes in the hierarchy are mapped to a single table with a discriminator column."
            },
            {
                "id": "asp-69",
                "title": "EF Core: Value Converters",
                "content": "Allow property values to be converted when reading from or writing to the database.",
                "code": "modelBuilder.Entity<Post>().Property(p => p.Status).HasConversion<string>();"
            },
            {
                "id": "asp-70",
                "title": "EF Core: DB Context Pooling",
                "content": "Allows reusing DbContext instances to improve performance in high-scale applications.",
                "code": "services.AddDbContextPool<MyDbContext>(...);"
            },
            {
                "id": "asp-71",
                "title": "EF Core: Interceptors",
                "content": "Allow you to execute custom logic before or after database operations (e.g., logging or auditing).",
                "code": "public class MyInterceptor : DbCommandInterceptor { ... }"
            },
            {
                "id": "asp-72",
                "title": "EF Core: Compiled Queries",
                "content": "Allow you to compile a LINQ query once and execute it multiple times with different parameters for better performance.",
                "code": "EF.CompileQuery((MyDbContext db, int id) => ...);"
            },
            {
                "id": "asp-73",
                "title": "EF Core: Owned Entity Types",
                "content": "Types that don't have their own identity and are part of another entity (Value Objects in DDD).",
                "code": "modelBuilder.Entity<Order>().OwnsOne(o => o.ShippingAddress);"
            },
            {
                "id": "asp-74",
                "title": "EF Core: Split Queries",
                "content": "Allows EF Core to execute multiple SQL queries for a single LINQ query to avoid Cartesian Explosion.",
                "code": "db.Orders.Include(o => o.Items).AsSplitQuery().ToList();"
            },
            {
                "id": "asp-75",
                "title": "EF Core: Explicit Transactions",
                "content": "Allows you to group multiple database operations into a single atomic transaction.",
                "code": "using var transaction = db.Database.BeginTransaction();"
            },
            {
                "id": "asp-76",
                "title": "EF Core: Spatial Data Support",
                "content": "Allows storing and querying geographical or geometric data using NetTopologySuite.",
                "code": "modelBuilder.Entity<Location>().Property(l => l.Point).HasColumnType(\"geography\");"
            },
            {
                "id": "asp-77",
                "title": "EF Core: Many-to-Many relationships",
                "content": "In EF Core 5.0+, you can define many-to-many relationships without explicitly defining the join table in the entity classes."
            },
            {
                "id": "asp-78",
                "title": "EF Core: Connection Resiliency",
                "content": "Automatically retries failed database commands using an execution strategy.",
                "code": "options.EnableRetryOnFailure();"
            },
            {
                "id": "asp-79",
                "title": "EF Core: Seed Data",
                "content": "Provides a way to populate the database with initial data during migration.",
                "code": "modelBuilder.Entity<Role>().HasData(new Role { ... });"
            },
            {
                "id": "asp-80",
                "title": "EF Core: Client vs Server Evaluation",
                "content": "EF Core tries to evaluate as much as possible on the server. If it can't translate a part of the query, it might throw an exception (in newer versions) to avoid silent performance issues."
            },
            {
                "id": "asp-81",
                "title": "Architecture: Monolithic vs Microservices",
                "content": "Monolith: Single codebase, easy deployment, hard to scale parts. Microservices: Distributed, independent scaling, complex communication and data consistency."
            },
            {
                "id": "asp-82",
                "title": "Architecture: Clean Architecture / Onion Architecture",
                "content": "Focuses on separation of concerns. The core (entities and business logic) is at the center and has no dependencies on external layers like DB or UI."
            },
            {
                "id": "asp-83",
                "title": "Architecture: Repository & Unit of Work Patterns",
                "content": "Repository abstracts data access. Unit of Work ensures that multiple repository operations share a single database context and transaction."
            },
            {
                "id": "asp-84",
                "title": "Architecture: CQRS (Command Query Responsibility Segregation)",
                "content": "Separates read and write operations into different models to optimize performance, scalability, and security."
            },
            {
                "id": "asp-85",
                "title": "Architecture: Event-Driven Design",
                "content": "Systems communicate by producing and consuming events (using Message Brokers like RabbitMQ or Kafka)."
            },
            {
                "id": "asp-86",
                "title": "Security: JWT (JSON Web Tokens)",
                "content": "A compact, URL-safe means of representing claims to be transferred between two parties. Often used for stateless authentication.",
                "code": "[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]"
            },
            {
                "id": "asp-87",
                "title": "Security: OAuth2 and OpenID Connect",
                "content": "OAuth2 is for authorization. OpenID Connect is an identity layer built on top of OAuth2 for authentication."
            },
            {
                "id": "asp-88",
                "title": "Security: Data Protection API",
                "content": "Used in ASP.NET Core to protect sensitive data like cookies, CSRF tokens, and authentication tickets.",
                "code": "services.AddDataProtection();"
            },
            {
                "id": "asp-89",
                "title": "Security: SQL Injection Prevention",
                "content": "EF Core and parameterized queries automatically prevent SQL injection. Never use string concatenation to build SQL.",
                "code": "db.Database.ExecuteSqlRaw(\"SELECT * FROM Users WHERE Id = {0}\", id);"
            },
            {
                "id": "asp-90",
                "title": "Security: XSS and CSRF prevention",
                "content": "XSS: Prevented by encoding output. CSRF: Prevented by using anti-forgery tokens.",
                "code": "app.UseAntiforgery();"
            },
            {
                "id": "asp-91",
                "title": "Performance: Caching (In-Memory vs Distributed)",
                "content": "In-memory: Fast, local to app instance. Distributed (Redis): Shared across multiple instances, survive app restarts.",
                "code": "services.AddStackExchangeRedisCache(...);"
            },
            {
                "id": "asp-92",
                "title": "Performance: Response Compression",
                "content": "Reduces the size of the response sent to the client to save bandwidth.",
                "code": "app.UseResponseCompression();"
            },
            {
                "id": "asp-93",
                "title": "Performance: Response Caching",
                "content": "Allows the server or a proxy to cache responses based on headers.",
                "code": "app.UseResponseCaching();"
            },
            {
                "id": "asp-94",
                "title": "Performance: Benchmarking with BenchmarkDotNet",
                "content": "The standard library for benchmarking .NET code to find bottlenecks."
            },
            {
                "id": "asp-95",
                "title": "Testing: Unit vs Integration Testing",
                "content": "Unit: Tests a small piece of logic in isolation (mocking dependencies). Integration: Tests how multiple components work together (often using a real DB or TestServer)."
            },
            {
                "id": "asp-96",
                "title": "Testing: xUnit, Moq, and FluentAssertions",
                "content": "Common libraries used for testing in the .NET ecosystem."
            },
            {
                "id": "asp-97",
                "title": "DevOps: Dockerization of ASP.NET Core",
                "content": "Packaging the app and its dependencies into a container for consistent deployment.",
                "code": "FROM mcr.microsoft.com/dotnet/aspnet:8.0"
            },
            {
                "id": "asp-98",
                "title": "Microservices: API Gateway (Ocelot / YARP)",
                "content": "A single entry point for all client requests, which then routes them to the appropriate microservice."
            },
            {
                "id": "asp-99",
                "title": "Microservices: Service Discovery",
                "content": "Allows services to find each other in a dynamic environment (using tools like Consul or Eureka)."
            },
            {
                "id": "asp-100",
                "title": "The .NET GC: Generations (0, 1, 2)",
                "content": "Gen 0: Short-lived objects (newly created). Gen 1: Buffer between 0 and 2. Gen 2: Long-lived objects. Understanding these helps in optimizing memory usage."
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
                "title": "Clustered vs Non-Clustered Index",
                "content": "Clustered Index: Determines the physical order of data in the table. Only one per table.\nNon-Clustered Index: A separate structure from the data rows. Contains pointers to the data. Multiple allowed.",
                "code": "CREATE CLUSTERED INDEX IX_Table_Column ON Table(Column);\nCREATE NONCLUSTERED INDEX IX_Table_Column ON Table(Column);"
            },
            {
                "id": "db-2",
                "title": "ACID Properties",
                "content": "Atomicity: All or nothing.\nConsistency: Data must meet all validation rules.\nIsolation: Transactions don't interfere with each other.\nDurability: Once committed, data remains even after failure."
            },
            {
                "id": "db-3",
                "title": "CAP Theorem",
                "content": "Consistency, Availability, and Partition Tolerance. A distributed system can only guarantee two out of three of these properties simultaneously."
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
                "title": "React Hooks (useEffect)",
                "content": "The Effect Hook lets you perform side effects in function components (data fetching, subscriptions, manual DOM changes).",
                "code": "useEffect(() => {\n  // Side effect\n  return () => { /* cleanup */ };\n}, [dependencies]);"
            },
            {
                "id": "fe-2",
                "title": "Angular: Change Detection",
                "content": "Angular's mechanism for keeping the UI in sync with the data model. By default, it uses 'CheckAlways' (Every component), but can be optimized with 'OnPush'."
            },
            {
                "id": "fe-3",
                "title": "Redux vs Context API",
                "content": "Redux is for complex state management across the entire app with middleware support. Context API is for simple prop-drilling avoidance and lighter state sharing."
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
                "title": "AWS Lambda vs Azure Functions",
                "content": "Both are Serverless compute services. They allow running code without provisioning or managing servers. Scalability is handled automatically."
            },
            {
                "id": "cloud-2",
                "title": "Docker vs Kubernetes",
                "content": "Docker is a tool for containerizing applications. Kubernetes is a container orchestration platform for managing, scaling, and deploying containerized applications."
            },
            {
                "id": "cloud-3",
                "title": "CI/CD Pipeline",
                "content": "Continuous Integration (automated builds and tests) and Continuous Deployment (automated release to production)."
            }
        ]
    }
};