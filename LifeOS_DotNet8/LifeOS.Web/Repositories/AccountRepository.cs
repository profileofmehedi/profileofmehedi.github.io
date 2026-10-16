using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LifeOS.Web.Data;
using LifeOS.Web.Models.Entities;

namespace LifeOS.Web.Repositories
{
    public interface IAccountRepository
    {
        Task<List<Account>> GetAllAccountsAsync();
        Task<Account?> GetAccountByIdAsync(int id);
        Task<Account> AddAccountAsync(Account account);
        Task<bool> UpdateAccountAsync(Account account);
        Task<bool> DeleteAccountAsync(int id);

        Task<List<Card>> GetAllCardsAsync();
        Task<Card?> GetCardByIdAsync(int id);
        Task<Card> AddCardAsync(Card card);
        Task<bool> UpdateCardAsync(Card card);
        Task<bool> DeleteCardAsync(int id);
    }

    public class AccountRepository : IAccountRepository
    {
        private readonly LifeOsDbContext _context;

        public AccountRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<List<Account>> GetAllAccountsAsync()
        {
            return await _context.Accounts.ToListAsync();
        }

        public async Task<Account?> GetAccountByIdAsync(int id)
        {
            return await _context.Accounts.FindAsync(id);
        }

        public async Task<Account> AddAccountAsync(Account account)
        {
            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();
            return account;
        }

        public async Task<bool> UpdateAccountAsync(Account account)
        {
            account.UpdatedAt = System.DateTime.UtcNow;
            _context.Accounts.Update(account);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAccountAsync(int id)
        {
            var acc = await _context.Accounts.FindAsync(id);
            if (acc == null) return false;
            acc.IsDeleted = true;
            acc.UpdatedAt = System.DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<Card>> GetAllCardsAsync()
        {
            return await _context.Cards.ToListAsync();
        }

        public async Task<Card?> GetCardByIdAsync(int id)
        {
            return await _context.Cards.FindAsync(id);
        }

        public async Task<Card> AddCardAsync(Card card)
        {
            _context.Cards.Add(card);
            await _context.SaveChangesAsync();
            return card;
        }

        public async Task<bool> UpdateCardAsync(Card card)
        {
            card.UpdatedAt = System.DateTime.UtcNow;
            _context.Cards.Update(card);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteCardAsync(int id)
        {
            var card = await _context.Cards.FindAsync(id);
            if (card == null) return false;
            card.IsDeleted = true;
            card.UpdatedAt = System.DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
