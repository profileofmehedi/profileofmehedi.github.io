using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LifeOS.Web.Data;
using LifeOS.Web.Models.Entities;

namespace LifeOS.Web.Repositories
{
    public interface ITransactionRepository
    {
        Task<List<Transaction>> GetAllAsync();
        Task<Transaction?> GetByIdAsync(int id);
        Task<List<Transaction>> GetRecentAsync(int count = 10);
        Task<List<Transaction>> GetByMonthAsync(int year, int month);
        Task<Transaction> AddAsync(Transaction tx);
        Task<bool> UpdateAsync(Transaction tx);
        Task<bool> DeleteAsync(int id);
    }

    public class TransactionRepository : ITransactionRepository
    {
        private readonly LifeOsDbContext _context;

        public TransactionRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<List<Transaction>> GetAllAsync()
        {
            return await _context.Transactions
                .OrderByDescending(t => t.Date)
                .ThenByDescending(t => t.Id)
                .ToListAsync();
        }

        public async Task<Transaction?> GetByIdAsync(int id)
        {
            return await _context.Transactions.FindAsync(id);
        }

        public async Task<List<Transaction>> GetRecentAsync(int count = 10)
        {
            return await _context.Transactions
                .OrderByDescending(t => t.Date)
                .ThenByDescending(t => t.Id)
                .Take(count)
                .ToListAsync();
        }

        public async Task<List<Transaction>> GetByMonthAsync(int year, int month)
        {
            return await _context.Transactions
                .Where(t => t.Date.Year == year && t.Date.Month == month)
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }

        public async Task<Transaction> AddAsync(Transaction tx)
        {
            // Adjust balances automatically based on transaction type
            if (tx.AccountId.HasValue)
            {
                var srcAcc = await _context.Accounts.FindAsync(tx.AccountId.Value);
                if (srcAcc != null)
                {
                    tx.AccountName = srcAcc.Name;
                    if (tx.Type == "expense")
                    {
                        srcAcc.Balance -= tx.Amount;
                    }
                    else if (tx.Type == "income")
                    {
                        srcAcc.Balance += tx.Amount;
                    }
                    else if (tx.Type == "transfer" || tx.Type == "savings" || tx.Type == "card_payment")
                    {
                        srcAcc.Balance -= tx.Amount;
                    }
                    srcAcc.UpdatedAt = DateTime.UtcNow;
                }
            }

            if (tx.ToAccountId.HasValue)
            {
                var destAcc = await _context.Accounts.FindAsync(tx.ToAccountId.Value);
                if (destAcc != null)
                {
                    tx.ToAccountName = destAcc.Name;
                    if (tx.Type == "transfer")
                    {
                        if (destAcc.Type == "loan")
                        {
                            destAcc.RemainingPrincipal = Math.Max(0, (destAcc.RemainingPrincipal ?? destAcc.Balance) - tx.Amount);
                            destAcc.Balance = destAcc.RemainingPrincipal.Value;
                            destAcc.PaidEmis = (destAcc.PaidEmis ?? 0) + 1;
                        }
                        else
                        {
                            destAcc.Balance += tx.Amount;
                            if (destAcc.Type == "dps")
                            {
                                destAcc.PaidInstallments = (destAcc.PaidInstallments ?? 0) + 1;
                            }
                        }
                        destAcc.UpdatedAt = DateTime.UtcNow;
                    }
                }
            }

            if (tx.CardId.HasValue)
            {
                var card = await _context.Cards.FindAsync(tx.CardId.Value);
                if (card != null)
                {
                    tx.CardName = card.Name;
                    if (tx.Type == "expense")
                    {
                        card.CurrentBalance += tx.Amount;
                    }
                    else if (tx.Type == "card_payment" || tx.Type == "debt_payment")
                    {
                        card.CurrentBalance = Math.Max(0, card.CurrentBalance - tx.Amount);
                    }
                    card.UpdatedAt = DateTime.UtcNow;
                }
            }

            _context.Transactions.Add(tx);
            await _context.SaveChangesAsync();
            return tx;
        }

        public async Task<bool> UpdateAsync(Transaction tx)
        {
            tx.UpdatedAt = DateTime.UtcNow;
            _context.Transactions.Update(tx);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var tx = await _context.Transactions.FindAsync(id);
            if (tx == null) return false;
            tx.IsDeleted = true;
            tx.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
