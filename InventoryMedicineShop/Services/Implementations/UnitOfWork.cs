using System;
using System.Threading.Tasks;
using InventoryMedicineShop.Models;
using InventoryMedicineShop.Services.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace InventoryMedicineShop.Services.Implementations
{
    /// <summary>
    /// Unit of Work implementation for managing database transactions
    /// </summary>
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;

        // Repository instances
        private IGenericRepository<Category>? _categories;
        private IGenericRepository<Supplier>? _suppliers;
        private IGenericRepository<Medicine>? _medicines;
        private IGenericRepository<MedicineBatch>? _medicineBatches;
        private IGenericRepository<User>? _users;
        private IGenericRepository<Sale>? _sales;
        private IGenericRepository<SaleItem>? _saleItems;
        private IGenericRepository<AppSettings>? _appSettings;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lazy loading of repositories
        public IGenericRepository<Category> Categories =>
            _categories ??= new GenericRepository<Category>(_context);

        public IGenericRepository<Supplier> Suppliers =>
            _suppliers ??= new GenericRepository<Supplier>(_context);

        public IGenericRepository<Medicine> Medicines =>
            _medicines ??= new GenericRepository<Medicine>(_context);

        public IGenericRepository<MedicineBatch> MedicineBatches =>
            _medicineBatches ??= new GenericRepository<MedicineBatch>(_context);

        public IGenericRepository<User> Users =>
            _users ??= new GenericRepository<User>(_context);

        public IGenericRepository<Sale> Sales =>
            _sales ??= new GenericRepository<Sale>(_context);

        public IGenericRepository<SaleItem> SaleItems =>
            _saleItems ??= new GenericRepository<SaleItem>(_context);

        public IGenericRepository<AppSettings> AppSettings =>
            _appSettings ??= new GenericRepository<AppSettings>(_context);

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await SaveChangesAsync();
                if (_transaction != null)
                {
                    await _transaction.CommitAsync();
                }
            }
            catch
            {
                await RollbackTransactionAsync();
                throw;
            }
            finally
            {
                if (_transaction != null)
                {
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
