using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using LifeOS.Web.Data;
using LifeOS.Web.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. Add SQL Server DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<LifeOsDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Register Repositories (Repository Pattern without Generic/UnitOfWork as instructed)
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IBudgetRepository, BudgetRepository>();
builder.Services.AddScoped<ISavingsGoalRepository, SavingsGoalRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<IHabitRepository, HabitRepository>();
builder.Services.AddScoped<IRoutineRepository, RoutineRepository>();
builder.Services.AddScoped<ICalendarEventRepository, CalendarEventRepository>();
builder.Services.AddScoped<ILifeGoalRepository, LifeGoalRepository>();
builder.Services.AddScoped<IJournalRepository, JournalRepository>();
builder.Services.AddScoped<IConveyanceRepository, ConveyanceRepository>();
builder.Services.AddScoped<IUserProfileRepository, UserProfileRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

// 3. Add Controllers and Views with JSON camelCase configuration
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

var app = builder.Build();

// 4. Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// 5. Automatic EF Core Migration & Demo Database Seeding on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<LifeOsDbContext>();
        await DbInitializer.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<Microsoft.Extensions.Logging.ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();
