/* =====================================================
   CODING DROP — SHARED BLOG DATA
   ===================================================== */

const CATEGORIES = {
    all:          { label: "All Articles",   colorClass: "cat-all" },
    architecture: { label: "Architecture",   colorClass: "cat-architecture" },
    performance:  { label: "Performance",    colorClass: "cat-performance" },
    frontend:     { label: "Front-End",      colorClass: "cat-frontend" },
    backend:      { label: "Back-End",       colorClass: "cat-backend" },
    database:     { label: "Database",       colorClass: "cat-database" },
    devops:       { label: "DevOps",         colorClass: "cat-devops" },
};

const POSTS = [
    {
        id: 1,
        slug: "architecting-microservices-dotnet",
        title: "Architecting Microservices in .NET Core",
        excerpt: "A deep dive into breaking down a monolithic enterprise application into clean, testable, isolated microservices. We explore service boundaries, database-per-service patterns, and asynchronous message communication with RabbitMQ.",
        category: "architecture",
        tags: [".NET Core", "Microservices", "RabbitMQ", "DDD"],
        date: "Jun 20, 2026",
        readTime: "12 min",
        icon: "fas fa-sitemap",
        featured: true,
        featuredIcon: "fas fa-sitemap",
        content: `
<p class="lead">Microservices architecture has become the gold standard for building scalable enterprise systems. But the transition from a monolith can be painful without a clear strategy. In this article, we walk through the exact patterns we used at <strong>OPUS Technology</strong> to decompose a banking platform into clean, independently deployable services.</p>

<h2>Why Break the Monolith?</h2>
<p>A monolithic application might start clean, but over time it becomes a tangled mess of dependencies. Deployments become risky — changing one module can break another. Teams step on each other's toes. Scaling means scaling the entire application, even if only one part is under load.</p>
<p>The solution: decompose by <strong>business capability</strong>. Each service owns its domain, its data, and its deployment lifecycle.</p>

<h2>Defining Service Boundaries</h2>
<p>The hardest part of microservices isn't the technology — it's deciding <em>where to cut</em>. We use <strong>Domain-Driven Design (DDD)</strong> to identify bounded contexts. Each bounded context becomes a candidate for a service.</p>
<p>For our banking system, we identified these core bounded contexts:</p>
<ul>
  <li><strong>Identity Service</strong> — authentication, KYC, user management</li>
  <li><strong>Account Service</strong> — account creation, balance, statements</li>
  <li><strong>Transaction Service</strong> — fund transfers, payment processing</li>
  <li><strong>Notification Service</strong> — SMS, email, push alerts</li>
</ul>

<h2>Database-per-Service Pattern</h2>
<p>Each service owns its own database. This is non-negotiable. Sharing a database between services creates tight coupling — the very thing we're trying to avoid.</p>
<pre><code>// Each service has its own DbContext
public class AccountDbContext : DbContext
{
    public DbSet&lt;Account&gt; Accounts { get; set; }
    public DbSet&lt;Statement&gt; Statements { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(AccountDbContext).Assembly);
    }
}</code></pre>

<h2>Async Communication with RabbitMQ</h2>
<p>Services communicate asynchronously through a message broker. When the Transaction Service processes a payment, it publishes a <code>PaymentProcessed</code> event. The Notification Service subscribes to this event and sends an SMS — completely decoupled.</p>
<pre><code>// Publishing an event
public class PaymentService
{
    private readonly IMessagePublisher _publisher;

    public async Task ProcessPaymentAsync(PaymentRequest request)
    {
        // ... process payment logic

        await _publisher.PublishAsync(new PaymentProcessedEvent
        {
            TransactionId = result.Id,
            Amount = request.Amount,
            RecipientPhone = request.RecipientPhone,
            Timestamp = DateTime.UtcNow
        });
    }
}</code></pre>

<h2>API Gateway with YARP</h2>
<p>Instead of exposing each service directly to clients, we use an API Gateway. We chose <strong>YARP (Yet Another Reverse Proxy)</strong> from Microsoft — it integrates seamlessly with ASP.NET Core middleware.</p>
<pre><code>// appsettings.json — YARP routing config
{
  "ReverseProxy": {
    "Routes": {
      "accounts-route": {
        "ClusterId": "accounts-cluster",
        "Match": { "Path": "/api/accounts/{**catch-all}" }
      },
      "transactions-route": {
        "ClusterId": "transactions-cluster",
        "Match": { "Path": "/api/transactions/{**catch-all}" }
      }
    }
  }
}</code></pre>

<h2>Key Takeaways</h2>
<ul>
  <li>Start with a <strong>modular monolith</strong> before jumping to microservices</li>
  <li>Use <strong>DDD Bounded Contexts</strong> to define service boundaries</li>
  <li>Never share databases between services</li>
  <li>Use <strong>async messaging</strong> (RabbitMQ, Azure Service Bus) for cross-service communication</li>
  <li>An <strong>API Gateway</strong> is essential for production deployments</li>
</ul>
<p>Microservices bring immense scalability and team autonomy — but at the cost of operational complexity. Choose wisely, plan carefully, and always design for failure.</p>
        `
    },
    {
        id: 2,
        slug: "redis-caching-aspnet-core",
        title: "Advanced Redis Caching Strategies in ASP.NET Core",
        excerpt: "Enterprise database optimization starts with a smart caching layer. We study sliding expirations, Redis transaction buffers, distributed caches, and cache-aside patterns with real benchmarks.",
        category: "performance",
        tags: ["Redis", "ASP.NET Core", "Caching", "Performance"],
        date: "Jun 10, 2026",
        readTime: "9 min",
        icon: "fas fa-bolt",
        featured: false,
        content: `
<p class="lead">Caching is one of the most impactful performance optimizations you can apply to an ASP.NET Core application. Done right, it can reduce database load by 80% and cut response times from 200ms to under 5ms. In this article, we explore battle-tested Redis caching patterns used in high-traffic production systems.</p>

<h2>Setting Up Redis in ASP.NET Core</h2>
<p>Start by adding the StackExchange.Redis NuGet package and configuring it in your DI container:</p>
<pre><code>// Program.cs
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "BankingApp:";
});

// Register a typed cache service
builder.Services.AddSingleton&lt;ICacheService, RedisCacheService&gt;();</code></pre>

<h2>The Cache-Aside Pattern</h2>
<p>The most common and recommended pattern. The application checks the cache first; on a miss, it loads from the database and populates the cache:</p>
<pre><code>public async Task&lt;Account&gt; GetAccountAsync(string accountId)
{
    var cacheKey = $"account:{accountId}";

    // 1. Try cache first
    var cached = await _cache.GetStringAsync(cacheKey);
    if (cached != null)
        return JsonSerializer.Deserialize&lt;Account&gt;(cached);

    // 2. Cache miss — load from DB
    var account = await _dbContext.Accounts
        .AsNoTracking()
        .FirstOrDefaultAsync(a => a.Id == accountId);

    // 3. Populate cache with sliding expiration
    var options = new DistributedCacheEntryOptions
    {
        SlidingExpiration = TimeSpan.FromMinutes(30),
        AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(2)
    };

    await _cache.SetStringAsync(cacheKey,
        JsonSerializer.Serialize(account), options);

    return account;
}</code></pre>

<h2>Sliding vs Absolute Expiration</h2>
<p>Use <strong>sliding expiration</strong> for frequently accessed data — it resets on each access, keeping hot data in cache longer. Use <strong>absolute expiration</strong> as a safety net to prevent stale data from living forever.</p>

<h2>Cache Invalidation Strategy</h2>
<p>When data changes, invalidate the cache immediately:</p>
<pre><code>public async Task UpdateAccountAsync(Account account)
{
    _dbContext.Accounts.Update(account);
    await _dbContext.SaveChangesAsync();

    // Invalidate immediately after write
    await _cache.RemoveAsync($"account:{account.Id}");
    await _cache.RemoveAsync($"accounts:list:{account.CustomerId}");
}</code></pre>

<h2>Benchmarks</h2>
<p>In our production banking system with 10M+ API hits, implementing Redis caching delivered:</p>
<ul>
  <li>Average response time: <strong>180ms → 4ms</strong> (on cached endpoints)</li>
  <li>Database CPU: reduced by <strong>65%</strong> during peak hours</li>
  <li>Throughput increase: <strong>40%</strong> more requests per second</li>
</ul>
<p>Redis is not just a performance tool — it's an architectural necessity for any high-scale ASP.NET Core application.</p>
        `
    },
    {
        id: 3,
        slug: "ef-core-performance-traps",
        title: "Entity Framework Core: 10 Performance Traps to Avoid",
        excerpt: "EF Core is powerful but easy to misuse. We dissect N+1 query problems, eager vs lazy loading pitfalls, raw SQL with AsNoTracking, and compiled queries that dramatically reduce round trips.",
        category: "database",
        tags: ["EF Core", "SQL Server", "ORM", ".NET"],
        date: "May 28, 2026",
        readTime: "11 min",
        icon: "fas fa-database",
        featured: false,
        content: `
<p class="lead">Entity Framework Core is a powerful ORM, but it's a double-edged sword. Developers often unknowingly write code that generates catastrophically slow SQL. This article exposes the 10 most common EF Core performance traps — and how to escape them.</p>

<h2>Trap #1: The N+1 Query Problem</h2>
<p>This is the most infamous EF Core pitfall. It happens when you load a list of entities and then access a navigation property in a loop:</p>
<pre><code>// ❌ BAD — generates N+1 queries!
var orders = await _context.Orders.ToListAsync();
foreach (var order in orders)
{
    Console.WriteLine(order.Customer.Name); // triggers separate query per order!
}

// ✅ GOOD — use Include() for eager loading
var orders = await _context.Orders
    .Include(o => o.Customer)
    .ToListAsync();</code></pre>

<h2>Trap #2: Forgetting AsNoTracking</h2>
<p>By default, EF Core tracks all queried entities. For read-only operations, this is wasted memory and CPU:</p>
<pre><code>// ❌ BAD — unnecessary change tracking
var accounts = await _context.Accounts.ToListAsync();

// ✅ GOOD — for read-only queries
var accounts = await _context.Accounts
    .AsNoTracking()
    .ToListAsync();</code></pre>

<h2>Trap #3: Loading Too Much Data</h2>
<p>Never load full entities when you only need a few columns. Use <code>.Select()</code> projections:</p>
<pre><code>// ❌ BAD — loads ALL columns for every account
var accounts = await _context.Accounts.ToListAsync();

// ✅ GOOD — project only what you need
var accountSummaries = await _context.Accounts
    .Select(a => new AccountSummaryDto
    {
        Id = a.Id,
        AccountNumber = a.AccountNumber,
        Balance = a.Balance
    })
    .ToListAsync();</code></pre>

<h2>Trap #4: Inefficient Pagination</h2>
<pre><code>// ❌ BAD — loads everything then skips
var results = await _context.Transactions
    .ToListAsync(); // loads ALL
var page = results.Skip(100).Take(20);

// ✅ GOOD — skip/take on the server
var results = await _context.Transactions
    .OrderBy(t => t.CreatedAt)
    .Skip(100)
    .Take(20)
    .AsNoTracking()
    .ToListAsync();</code></pre>

<h2>Trap #5: Using Raw SQL Without AsNoTracking</h2>
<pre><code>// ✅ Raw SQL for complex queries — but still avoid tracking
var results = await _context.Transactions
    .FromSqlRaw("SELECT * FROM dbo.GetMonthlyReport(@month)", param)
    .AsNoTracking()
    .ToListAsync();</code></pre>

<h2>Key Takeaways</h2>
<ul>
  <li>Always use <code>AsNoTracking()</code> for read-only queries</li>
  <li>Always <code>Include()</code> related entities you'll need in the same query</li>
  <li>Use <code>Select()</code> to project only required columns</li>
  <li>Always paginate on the database, not in memory</li>
  <li>Use <strong>SQL Server Profiler</strong> or <strong>EF Core logging</strong> to inspect generated SQL</li>
</ul>
        `
    },
    {
        id: 4,
        slug: "angular-standalone-components",
        title: "Angular Standalone Components: The Modern Way",
        excerpt: "Angular 17 rewrites the rules. We explore the standalone component architecture, eliminating NgModule boilerplate, lazy-loading routes, and combining signals with RxJS for reactive state management.",
        category: "frontend",
        tags: ["Angular", "TypeScript", "Standalone", "RxJS"],
        date: "May 15, 2026",
        readTime: "8 min",
        icon: "fab fa-angular",
        featured: false,
        content: `
<p class="lead">Angular 17 marked a turning point: standalone components are now the default. The old NgModule-centric world is fading. In this article, we explore how to embrace the new Angular architecture — cleaner, faster, and simpler to reason about.</p>

<h2>What Are Standalone Components?</h2>
<p>Standalone components don't belong to any NgModule. They declare their own imports directly, making them self-contained and tree-shakeable.</p>
<pre><code>// ✅ Angular 17 standalone component
@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        AccountCardComponent,
        CurrencyPipe
    ],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    accounts = signal&lt;Account[]&gt;([]);
}</code></pre>

<h2>Bootstrapping Without AppModule</h2>
<pre><code>// main.ts — no more AppModule!
bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes, withPreloading(PreloadAllModules)),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideAnimations()
    ]
});</code></pre>

<h2>Lazy Loading with Standalone</h2>
<pre><code>// app.routes.ts
export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./dashboard/dashboard.component')
                .then(m => m.DashboardComponent)
    },
    {
        path: 'accounts',
        loadChildren: () =>
            import('./accounts/accounts.routes')
                .then(m => m.ACCOUNT_ROUTES)
    }
];</code></pre>

<h2>Signals + RxJS: The Best of Both Worlds</h2>
<pre><code>@Component({ standalone: true })
export class AccountListComponent {
    private accountService = inject(AccountService);

    // Signal for local state
    selectedId = signal&lt;string | null&gt;(null);

    // toSignal converts Observable to Signal
    accounts = toSignal(this.accountService.getAll$(), {
        initialValue: []
    });

    // Computed signal — reactive to selectedId
    selectedAccount = computed(() =>
        this.accounts().find(a => a.id === this.selectedId())
    );
}</code></pre>

<h2>Key Takeaways</h2>
<ul>
  <li>Use standalone components for all new Angular development</li>
  <li>Use <code>provideRouter()</code> and <code>provideHttpClient()</code> in <code>bootstrapApplication()</code></li>
  <li>Lazy load routes with <code>loadComponent()</code> and <code>loadChildren()</code></li>
  <li>Embrace <strong>Signals</strong> for local state — they're simpler and more performant than BehaviorSubjects</li>
  <li>Use <code>toSignal()</code> to bridge RxJS Observables with the Signal world</li>
</ul>
        `
    },
    {
        id: 5,
        slug: "clean-architecture-dotnet",
        title: "Clean Architecture in .NET: A Practical Guide",
        excerpt: "Clean Architecture isn't just theory. See how to structure a real ASP.NET Core project with Domain, Application, Infrastructure, and Presentation layers — with proper dependency inversion and testability in mind.",
        category: "architecture",
        tags: ["Clean Architecture", "SOLID", "DDD", "C#"],
        date: "May 02, 2026",
        readTime: "14 min",
        icon: "fas fa-layer-group",
        featured: false,
        content: `
<p class="lead">Clean Architecture, popularized by Robert C. Martin (Uncle Bob), is about separating concerns so that business rules are completely independent of frameworks, databases, and UI. Here's how to implement it in a real ASP.NET Core project — not just theory.</p>

<h2>The Four Layers</h2>
<ul>
  <li><strong>Domain</strong> — Entities, Value Objects, Domain Events, Interfaces (no dependencies)</li>
  <li><strong>Application</strong> — Use Cases (CQRS Commands/Queries), DTOs, Service Interfaces</li>
  <li><strong>Infrastructure</strong> — EF Core, Redis, Email, File Storage, External APIs</li>
  <li><strong>Presentation</strong> — ASP.NET Core Controllers, Minimal APIs, SignalR Hubs</li>
</ul>

<h2>Domain Layer — Pure C#</h2>
<pre><code>// Domain/Entities/Account.cs
public class Account : BaseEntity
{
    public string AccountNumber { get; private set; }
    public decimal Balance { get; private set; }
    public AccountStatus Status { get; private set; }

    // Factory method — enforces business rules
    public static Account Create(string customerId, string currency)
    {
        var account = new Account
        {
            AccountNumber = AccountNumber.Generate(),
            Balance = 0,
            Status = AccountStatus.Active
        };

        account.AddDomainEvent(new AccountCreatedEvent(account.Id));
        return account;
    }

    public void Debit(decimal amount)
    {
        if (amount <= 0) throw new DomainException("Amount must be positive");
        if (Balance < amount) throw new InsufficientFundsException();
        Balance -= amount;
    }
}</code></pre>

<h2>Application Layer — Use Cases with MediatR</h2>
<pre><code>// Application/Accounts/Commands/CreateAccount/CreateAccountCommand.cs
public record CreateAccountCommand(string CustomerId, string Currency)
    : IRequest&lt;AccountDto&gt;;

public class CreateAccountCommandHandler
    : IRequestHandler&lt;CreateAccountCommand, AccountDto&gt;
{
    private readonly IAccountRepository _repo;
    private readonly IUnitOfWork _uow;

    public async Task&lt;AccountDto&gt; Handle(
        CreateAccountCommand request,
        CancellationToken ct)
    {
        var account = Account.Create(request.CustomerId, request.Currency);
        await _repo.AddAsync(account, ct);
        await _uow.SaveChangesAsync(ct);
        return _mapper.Map&lt;AccountDto&gt;(account);
    }
}</code></pre>

<h2>Dependency Rule</h2>
<p>The golden rule: <strong>dependencies always point inward</strong>. Domain knows nothing about Application. Application knows nothing about Infrastructure. This makes the core business logic completely testable without a database or framework.</p>

<h2>Key Takeaways</h2>
<ul>
  <li>Domain layer should have <strong>zero NuGet dependencies</strong></li>
  <li>Use <strong>MediatR</strong> for CQRS — it decouples handlers from controllers perfectly</li>
  <li>Define repository <strong>interfaces</strong> in Application, <strong>implement</strong> them in Infrastructure</li>
  <li>Use <strong>Domain Events</strong> to notify other parts of the system without coupling</li>
</ul>
        `
    },
    {
        id: 6,
        slug: "sql-server-index-deep-dive",
        title: "SQL Server Query Optimization: Index Deep Dive",
        excerpt: "Slow queries kill user experience. We walk through clustered vs non-clustered indexes, covering indexes, execution plan analysis, index fragmentation, and statistics updates for 10M+ row tables.",
        category: "database",
        tags: ["SQL Server", "Indexes", "Performance", "Query"],
        date: "Apr 18, 2026",
        readTime: "10 min",
        icon: "fas fa-search",
        featured: false,
        content: `
<p class="lead">Indexes are the single most impactful optimization you can apply to SQL Server. A single missing index can turn a millisecond query into a 30-second table scan. This guide is based on real experience optimizing databases with 10M+ rows.</p>

<h2>Clustered vs Non-Clustered Indexes</h2>
<p><strong>Clustered index</strong>: physically sorts the table data. Only one per table (usually the Primary Key).</p>
<p><strong>Non-clustered index</strong>: a separate structure pointing back to the clustered key. You can have many.</p>
<pre><code>-- Most tables benefit from this pattern:
CREATE CLUSTERED INDEX CIX_Transactions_Id
ON dbo.Transactions (Id ASC);

-- Non-clustered for query patterns
CREATE NONCLUSTERED INDEX IX_Transactions_CustomerId_Date
ON dbo.Transactions (CustomerId ASC, TransactionDate DESC)
INCLUDE (Amount, Status); -- covering index!</code></pre>

<h2>Covering Indexes</h2>
<p>A covering index includes all columns a query needs — eliminating the key lookup back to the clustered index. This is a massive win for read-heavy queries:</p>
<pre><code>-- Without covering index: needs key lookup
SELECT Amount, Status
FROM Transactions
WHERE CustomerId = 'C001';

-- With INCLUDE columns: single seek, no lookup
CREATE NONCLUSTERED INDEX IX_Transactions_Customer_Cover
ON dbo.Transactions (CustomerId)
INCLUDE (Amount, Status, TransactionDate);</code></pre>

<h2>Reading Execution Plans</h2>
<p>Always check execution plans for slow queries. Watch for:</p>
<ul>
  <li><strong>Table Scan</strong> — No index is being used. Critical issue.</li>
  <li><strong>Key Lookup</strong> — Non-clustered index exists but needs extra data. Add INCLUDE columns.</li>
  <li><strong>Thick arrows</strong> — Large row estimate. Check statistics.</li>
</ul>

<h2>Index Maintenance</h2>
<pre><code>-- Check fragmentation
SELECT index_id, avg_fragmentation_in_percent
FROM sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID('Transactions'), NULL, NULL, 'SAMPLED')
WHERE avg_fragmentation_in_percent > 10;

-- Rebuild if fragmentation > 30%
ALTER INDEX IX_Transactions_Customer ON Transactions REBUILD;

-- Reorganize if fragmentation 10-30%
ALTER INDEX IX_Transactions_Customer ON Transactions REORGANIZE;

-- Update statistics after bulk operations
UPDATE STATISTICS dbo.Transactions WITH FULLSCAN;</code></pre>

<h2>Key Takeaways</h2>
<ul>
  <li>Use <strong>covering indexes</strong> (with INCLUDE) to eliminate key lookups</li>
  <li>Create composite indexes in the order: <strong>equality columns → range columns → INCLUDE columns</strong></li>
  <li>Rebuild indexes with >30% fragmentation, reorganize for 10-30%</li>
  <li>Update statistics after large data changes</li>
  <li>Use <strong>Missing Index DMVs</strong> to find recommendations: <code>sys.dm_db_missing_index_details</code></li>
</ul>
        `
    },
    {
        id: 7,
        slug: "signalr-realtime-dotnet",
        title: "Building Real-time APIs with SignalR in .NET",
        excerpt: "Push live data to clients without polling. We build a real-time notification engine using SignalR hubs, connection groups, authentication, scale-out with Redis backplane, and Angular client integration.",
        category: "backend",
        tags: ["SignalR", ".NET", "WebSockets", "Real-time"],
        date: "Apr 05, 2026",
        readTime: "13 min",
        icon: "fas fa-wifi",
        featured: false,
        content: `
<p class="lead">Polling is the lazy developer's real-time. With SignalR, you push data to clients the moment it changes — no wasted requests, no delays. This article walks through building a production-grade real-time notification system used in our digital banking platform.</p>

<h2>Setting Up a SignalR Hub</h2>
<pre><code>// NotificationHub.cs
[Authorize]
public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{userId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? ex)
    {
        var userId = Context.UserIdentifier;
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user:{userId}");
        await base.OnDisconnectedAsync(ex);
    }
}</code></pre>

<h2>Pushing Notifications from a Service</h2>
<pre><code>public class NotificationService
{
    private readonly IHubContext&lt;NotificationHub&gt; _hub;

    public async Task SendTransactionAlertAsync(string userId, TransactionAlert alert)
    {
        await _hub.Clients
            .Group($"user:{userId}")
            .SendAsync("ReceiveAlert", alert);
    }
}</code></pre>

<h2>Angular Client Integration</h2>
<pre><code>// notification.service.ts
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private hub: signalR.HubConnection;
    alerts$ = new Subject&lt;TransactionAlert&gt;();

    connect(token: string): void {
        this.hub = new signalR.HubConnectionBuilder()
            .withUrl('/hubs/notifications', {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000])
            .build();

        this.hub.on('ReceiveAlert', (alert: TransactionAlert) => {
            this.alerts$.next(alert);
        });

        this.hub.start();
    }
}</code></pre>

<h2>Scale-out with Redis Backplane</h2>
<p>When running multiple server instances, connections are spread across them. Use a Redis backplane to broadcast messages across all instances:</p>
<pre><code>// Program.cs
builder.Services.AddSignalR()
    .AddStackExchangeRedis(redisConnString, options => {
        options.Configuration.ChannelPrefix = "BankingApp";
    });</code></pre>

<h2>Key Takeaways</h2>
<ul>
  <li>Use <strong>Groups</strong> to scope messages to specific users or rooms</li>
  <li>Always use <strong>IHubContext</strong> to send from background services or controllers</li>
  <li>Configure <strong>withAutomaticReconnect()</strong> on the client for resilience</li>
  <li>Add <strong>Redis backplane</strong> for multi-instance deployments</li>
  <li>Secure your Hub with <code>[Authorize]</code> and JWT bearer tokens</li>
</ul>
        `
    },
    {
        id: 8,
        slug: "dockerizing-aspnet-core",
        title: "Dockerizing ASP.NET Core Applications",
        excerpt: "From development to production with Docker. We create multi-stage Dockerfiles, configure Docker Compose for .NET + SQL Server, manage environment variables, and set up health checks for production deployments.",
        category: "devops",
        tags: ["Docker", "DevOps", "CI/CD", "ASP.NET Core"],
        date: "Mar 22, 2026",
        readTime: "7 min",
        icon: "fab fa-docker",
        featured: false,
        content: `
<p class="lead">Docker eliminates the "works on my machine" problem forever. Containerizing your ASP.NET Core application ensures consistent behaviour from development through to production. This guide covers multi-stage builds, Docker Compose, and production-ready health checks.</p>

<h2>Multi-Stage Dockerfile</h2>
<p>Multi-stage builds keep your final image small — only production artifacts, no SDK bloat:</p>
<pre><code># Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["BankingApi.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime (much smaller!)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BankingApi.dll"]</code></pre>

<h2>Docker Compose for Local Dev</h2>
<pre><code># docker-compose.yml
services:
  api:
    build: .
    ports:
      - "5000:8080"
    environment:
      - ConnectionStrings__Default=Server=db;Database=BankingDb;...
      - ASPNETCORE_ENVIRONMENT=Development
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - SA_PASSWORD=YourPassword123!
      - ACCEPT_EULA=Y
    ports:
      - "1433:1433"
    healthcheck:
      test: /opt/mssql-tools/bin/sqlcmd -S localhost -U sa ...
      interval: 10s
      retries: 10</code></pre>

<h2>Health Checks</h2>
<pre><code>// Program.cs
builder.Services.AddHealthChecks()
    .AddSqlServer(connString, name: "database")
    .AddRedis(redisConnString, name: "redis");

app.MapHealthChecks("/health", new HealthCheckOptions {
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});</code></pre>

<h2>Key Takeaways</h2>
<ul>
  <li>Always use <strong>multi-stage builds</strong> — keeps images under 200MB vs 800MB+</li>
  <li>Use <strong>Docker Compose</strong> for local development with all dependencies</li>
  <li>Never hardcode secrets — use <strong>environment variables</strong> or Docker secrets</li>
  <li>Add <strong>health checks</strong> — orchestrators like Kubernetes depend on them</li>
  <li>Use <code>depends_on: condition: service_healthy</code> to avoid race conditions</li>
</ul>
        `
    },
    {
        id: 9,
        slug: "jwt-authentication-aspnet-core",
        title: "JWT Authentication & Authorization in ASP.NET Core",
        excerpt: "Secure your APIs the right way. Implementing JWT bearer tokens, refresh token rotation, role-based & policy-based authorization, and integrating ASP.NET Core Identity with custom claims.",
        category: "backend",
        tags: ["JWT", "Security", "Auth", "ASP.NET Core"],
        date: "Mar 10, 2026",
        readTime: "10 min",
        icon: "fas fa-shield-alt",
        featured: false,
        content: `
<p class="lead">Security is non-negotiable. Implementing JWT authentication correctly in ASP.NET Core involves more than just adding a NuGet package. This guide covers token generation, refresh token rotation, and policy-based authorization — all production patterns used in real banking APIs.</p>

<h2>Configuring JWT Bearer Authentication</h2>
<pre><code>// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Jwt:Issuer"],
            ValidAudience = config["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config["Jwt:SecretKey"]!)),
            ClockSkew = TimeSpan.Zero // No tolerance!
        };
    });</code></pre>

<h2>Generating JWT Tokens</h2>
<pre><code>public string GenerateAccessToken(User user, IList&lt;string&gt; roles)
{
    var claims = new List&lt;Claim&gt;
    {
        new(ClaimTypes.NameIdentifier, user.Id),
        new(ClaimTypes.Email, user.Email!),
        new("account_id", user.AccountId),
        new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
    var token = new JwtSecurityToken(
        issuer: _issuer,
        audience: _audience,
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(15), // Short-lived!
        signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}</code></pre>

<h2>Refresh Token Rotation</h2>
<p>Access tokens should be short-lived (15 minutes). Use refresh tokens to issue new access tokens without requiring re-login:</p>
<pre><code>public async Task&lt;TokenResponse&gt; RefreshAsync(string refreshToken)
{
    var storedToken = await _repo.GetRefreshTokenAsync(refreshToken);

    if (storedToken is null || storedToken.IsRevoked || storedToken.ExpiresAt < DateTime.UtcNow)
        throw new SecurityException("Invalid refresh token");

    // Rotate — revoke old, issue new
    storedToken.IsRevoked = true;
    var newRefreshToken = GenerateRefreshToken(storedToken.UserId);
    await _repo.SaveRefreshTokenAsync(newRefreshToken);

    var user = await _userManager.FindByIdAsync(storedToken.UserId);
    var roles = await _userManager.GetRolesAsync(user!);

    return new TokenResponse(
        AccessToken: GenerateAccessToken(user, roles),
        RefreshToken: newRefreshToken.Token
    );
}</code></pre>

<h2>Policy-Based Authorization</h2>
<pre><code>// Registration
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanTransfer", policy =>
        policy.RequireClaim("account_verified", "true")
              .RequireRole("Customer", "Admin"));
});

// Usage on endpoint
[Authorize(Policy = "CanTransfer")]
[HttpPost("transfer")]
public async Task&lt;IActionResult&gt; Transfer(TransferRequest request) { ... }</code></pre>

<h2>Key Takeaways</h2>
<ul>
  <li>Keep access tokens <strong>short-lived</strong> (15 mins) — use refresh tokens for longevity</li>
  <li>Always set <code>ClockSkew = TimeSpan.Zero</code> in production</li>
  <li>Use <strong>refresh token rotation</strong> — revoke on use to prevent replay attacks</li>
  <li>Prefer <strong>policy-based</strong> authorization over raw role checks</li>
  <li>Store refresh tokens <strong>hashed</strong> in the database, not plaintext</li>
</ul>
        `
    },
];
