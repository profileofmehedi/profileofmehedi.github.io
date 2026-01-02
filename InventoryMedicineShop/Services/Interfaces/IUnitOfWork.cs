using System;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;

namespace InventoryMedicineShop.Services.Interfaces
{
    /// <summary>
    /// Unit of Work interface for managing database transactions
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        // Repositories
        IGenericRepository<Category> Categories { get; }
        IGenericRepository<Supplier> Suppliers { get; }
        IGenericRepository<Medicine> Medicines { get; }
        IGenericRepository<MedicineBatch> MedicineBatches { get; }
        IGenericRepository<User> Users { get; }
        IGenericRepository<Sale> Sales { get; }
        IGenericRepository<SaleItem> SaleItems { get; }
        IGenericRepository<AppSettings> AppSettings { get; }
        
        // Transaction operations
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
