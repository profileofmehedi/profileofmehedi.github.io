using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Implementations;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace InventoryMedicineShop.Services
{
    /// <summary>
    /// Extension methods for registering services in the DI container
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Registers all application services for dependency injection
        /// </summary>
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Register DbContext
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            // Register Unit of Work
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Register Generic Repository
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

            // Register Entity Services
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ISupplierService, SupplierService>();
            services.AddScoped<IMedicineService, MedicineService>();
            services.AddScoped<IMedicineBatchService, MedicineBatchService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ISaleService, SaleService>();
            services.AddScoped<ISaleItemService, SaleItemService>();
            services.AddScoped<IAppSettingsService, AppSettingsService>();

            // Register Business Logic Services
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IReportService, ReportService>();

            // Register Password Hasher
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

            return services;
        }

        /// <summary>
        /// Registers database context with specific connection string
        /// </summary>
        public static IServiceCollection AddDatabaseContext(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString, sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorNumbersToAdd: null);
                }));

            return services;
        }

        /// <summary>
        /// Registers only the core repository services (without business logic services)
        /// </summary>
        public static IServiceCollection AddRepositoryServices(this IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            
            return services;
        }

        /// <summary>
        /// Registers only the business logic services (requires repositories to be registered first)
        /// </summary>
        public static IServiceCollection AddBusinessServices(this IServiceCollection services)
        {
            // Entity Services
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ISupplierService, SupplierService>();
            services.AddScoped<IMedicineService, MedicineService>();
            services.AddScoped<IMedicineBatchService, MedicineBatchService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ISaleService, SaleService>();
            services.AddScoped<ISaleItemService, SaleItemService>();
            services.AddScoped<IAppSettingsService, AppSettingsService>();

            // Additional Services
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IReportService, ReportService>();

            // Password Hasher
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

            return services;
        }
    }
}
