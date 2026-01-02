using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Models
{
    /// <summary>
    /// Database context for the Inventory Medicine Shop application
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Supplier> Suppliers { get; set; } = null!;
        public DbSet<Medicine> Medicines { get; set; } = null!;
        public DbSet<MedicineBatch> MedicineBatches { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Sale> Sales { get; set; } = null!;
        public DbSet<SaleItem> SaleItems { get; set; } = null!;
        public DbSet<AppSettings> AppSettings { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Category entity
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasIndex(e => e.Code).IsUnique();
                entity.HasIndex(e => e.Name);
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // Configure Supplier entity
            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Phone);
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // Configure Medicine entity
            modelBuilder.Entity<Medicine>(entity =>
            {
                entity.HasIndex(e => e.Code).IsUnique();
                entity.HasIndex(e => e.Name);
                entity.HasIndex(e => e.Barcode);
                entity.HasQueryFilter(e => !e.IsDeleted);

                entity.HasOne(m => m.Category)
                    .WithMany(c => c.Medicines)
                    .HasForeignKey(m => m.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure MedicineBatch entity
            modelBuilder.Entity<MedicineBatch>(entity =>
            {
                entity.HasIndex(e => e.BatchNumber);
                entity.HasIndex(e => e.ExpiryDate);
                entity.HasIndex(e => new { e.MedicineId, e.BatchNumber }).IsUnique();
                entity.HasQueryFilter(e => !e.IsDeleted);

                entity.HasOne(mb => mb.Medicine)
                    .WithMany(m => m.MedicineBatches)
                    .HasForeignKey(mb => mb.MedicineId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(mb => mb.Supplier)
                    .WithMany(s => s.MedicineBatches)
                    .HasForeignKey(mb => mb.SupplierId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Add check constraint for expiry date
                entity.HasCheckConstraint("CK_MedicineBatch_ExpiryDate", "[ExpiryDate] > [ManufactureDate]");
                entity.HasCheckConstraint("CK_MedicineBatch_SellingPrice", "[SellingPrice] >= [PurchasePrice]");
                entity.HasCheckConstraint("CK_MedicineBatch_RemainingQuantity", "[RemainingQuantity] <= [Quantity]");
            });

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // Configure Sale entity
            modelBuilder.Entity<Sale>(entity =>
            {
                entity.HasIndex(e => e.SaleNumber).IsUnique();
                entity.HasIndex(e => e.SaleDate);
                entity.HasIndex(e => e.Status);
                entity.HasQueryFilter(e => !e.IsDeleted);

                entity.HasOne(s => s.User)
                    .WithMany(u => u.Sales)
                    .HasForeignKey(s => s.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Add check constraint
                entity.HasCheckConstraint("CK_Sale_TotalAmount", "[TotalAmount] = [Subtotal] + [TaxAmount] - [DiscountAmount]");
            });

            // Configure SaleItem entity
            modelBuilder.Entity<SaleItem>(entity =>
            {
                entity.HasQueryFilter(e => !e.IsDeleted);

                entity.HasOne(si => si.Sale)
                    .WithMany(s => s.SaleItems)
                    .HasForeignKey(si => si.SaleId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(si => si.Medicine)
                    .WithMany()
                    .HasForeignKey(si => si.MedicineId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(si => si.MedicineBatch)
                    .WithMany()
                    .HasForeignKey(si => si.MedicineBatchId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Add check constraint
                entity.HasCheckConstraint("CK_SaleItem_Quantity", "[Quantity] > 0");
            });

            // Configure AppSettings entity
            modelBuilder.Entity<AppSettings>(entity =>
            {
                entity.HasIndex(e => e.Key).IsUnique();
                entity.HasIndex(e => new { e.Category, e.Key });
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // Seed initial data
            SeedInitialData(modelBuilder);
        }

        private void SeedInitialData(ModelBuilder modelBuilder)
        {
            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Pain Relief", Code = "CAT-001", Description = "Pain relief medications", CreatedAt = DateTime.UtcNow },
                new Category { Id = 2, Name = "Antibiotics", Code = "CAT-002", Description = "Antibiotic medications", CreatedAt = DateTime.UtcNow },
                new Category { Id = 3, Name = "Vitamins", Code = "CAT-003", Description = "Vitamin supplements", CreatedAt = DateTime.UtcNow },
                new Category { Id = 4, Name = "First Aid", Code = "CAT-004", Description = "First aid supplies", CreatedAt = DateTime.UtcNow }
            );

            // Seed Default Admin User (password: Admin@123)
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Name = "System Admin",
                    Username = "admin",
                    Email = "admin@medishop.com",
                    PasswordHash = "AQAAAAEAACcQAAAAEH8ZQDr9xVJKZqzJZqzJZqzJZqzJZqzJZqzJZqzJZqzJZqzJZqzJZqzJZqzJZqzJZqzJZqzJZqzJ", // This should be properly hashed
                    Role = "admin",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Seed App Settings
            modelBuilder.Entity<AppSettings>().HasData(
                new AppSettings { Id = 1, Key = "ShopName", Value = "MediShop Inventory", Category = "general", DataType = "string", IsSystemSetting = true, CreatedAt = DateTime.UtcNow },
                new AppSettings { Id = 2, Key = "Currency", Value = "USD", Category = "general", DataType = "string", IsSystemSetting = true, CreatedAt = DateTime.UtcNow },
                new AppSettings { Id = 3, Key = "TaxRate", Value = "0", Category = "sales", DataType = "number", CreatedAt = DateTime.UtcNow },
                new AppSettings { Id = 4, Key = "LowStockAlert", Value = "true", Category = "notification", DataType = "boolean", CreatedAt = DateTime.UtcNow },
                new AppSettings { Id = 5, Key = "ExpiryAlertDays", Value = "90", Category = "notification", DataType = "number", CreatedAt = DateTime.UtcNow }
            );
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateAuditFields();
            return base.SaveChangesAsync(cancellationToken);
        }

        public override int SaveChanges()
        {
            UpdateAuditFields();
            return base.SaveChanges();
        }

        private void UpdateAuditFields()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is BaseEntity &&
                           (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entry in entries)
            {
                var entity = (BaseEntity)entry.Entity;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entity.UpdatedAt = DateTime.UtcNow;
                }
            }
        }
    }
}
