using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LifeOS.Web.Data;
using LifeOS.Web.Models.Entities;

namespace LifeOS.Web.Repositories
{
    public interface ILifeGoalRepository
    {
        Task<List<LifeGoal>> GetAllAsync();
        Task<LifeGoal?> GetByIdAsync(int id);
        Task<LifeGoal> AddAsync(LifeGoal goal);
        Task<bool> UpdateAsync(LifeGoal goal);
        Task<bool> DeleteAsync(int id);
    }

    public class LifeGoalRepository : ILifeGoalRepository
    {
        private readonly LifeOsDbContext _context;

        public LifeGoalRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<List<LifeGoal>> GetAllAsync()
        {
            return await _context.LifeGoals.ToListAsync();
        }

        public async Task<LifeGoal?> GetByIdAsync(int id)
        {
            return await _context.LifeGoals.FindAsync(id);
        }

        public async Task<LifeGoal> AddAsync(LifeGoal goal)
        {
            _context.LifeGoals.Add(goal);
            await _context.SaveChangesAsync();
            return goal;
        }

        public async Task<bool> UpdateAsync(LifeGoal goal)
        {
            goal.UpdatedAt = DateTime.UtcNow;
            _context.LifeGoals.Update(goal);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var g = await _context.LifeGoals.FindAsync(id);
            if (g == null) return false;
            g.IsDeleted = true;
            g.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }
    }

    public interface IJournalRepository
    {
        Task<List<JournalEntry>> GetAllAsync();
        Task<JournalEntry?> GetByIdAsync(int id);
        Task<JournalEntry?> GetByDateAsync(DateTime date);
        Task<JournalEntry> AddAsync(JournalEntry entry);
        Task<bool> UpdateAsync(JournalEntry entry);
        Task<bool> DeleteAsync(int id);
    }

    public class JournalRepository : IJournalRepository
    {
        private readonly LifeOsDbContext _context;

        public JournalRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<List<JournalEntry>> GetAllAsync()
        {
            return await _context.JournalEntries
                .OrderByDescending(j => j.Date)
                .ToListAsync();
        }

        public async Task<JournalEntry?> GetByIdAsync(int id)
        {
            return await _context.JournalEntries.FindAsync(id);
        }

        public async Task<JournalEntry?> GetByDateAsync(DateTime date)
        {
            var d = date.Date;
            return await _context.JournalEntries
                .FirstOrDefaultAsync(j => j.Date.Date == d);
        }

        public async Task<JournalEntry> AddAsync(JournalEntry entry)
        {
            _context.JournalEntries.Add(entry);
            await _context.SaveChangesAsync();
            return entry;
        }

        public async Task<bool> UpdateAsync(JournalEntry entry)
        {
            entry.UpdatedAt = DateTime.UtcNow;
            _context.JournalEntries.Update(entry);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var j = await _context.JournalEntries.FindAsync(id);
            if (j == null) return false;
            j.IsDeleted = true;
            j.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }
    }

    public interface IConveyanceRepository
    {
        Task<List<ConveyanceTrip>> GetAllTripsAsync();
        Task<ConveyanceTrip?> GetTripByIdAsync(int id);
        Task<List<ConveyanceTrip>> GetUnclaimedTripsAsync();
        Task<ConveyanceTrip> AddTripAsync(ConveyanceTrip trip);
        Task<bool> UpdateTripAsync(ConveyanceTrip trip);
        Task<bool> DeleteTripAsync(int id);

        Task<List<ConveyanceClaim>> GetAllClaimsAsync();
        Task<ConveyanceClaim?> GetClaimByIdAsync(int id);
        Task<ConveyanceClaim> AddClaimAsync(ConveyanceClaim claim, List<int>? tripIds = null);
        Task<bool> UpdateClaimAsync(ConveyanceClaim claim);
        Task<bool> SettleClaimAsync(int claimId, decimal disbursedAmount, decimal companyDeduction, int? depositAccountId = null);
        Task<bool> DeleteClaimAsync(int id);
    }

    public class ConveyanceRepository : IConveyanceRepository
    {
        private readonly LifeOsDbContext _context;

        public ConveyanceRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<List<ConveyanceTrip>> GetAllTripsAsync()
        {
            return await _context.ConveyanceTrips
                .OrderByDescending(t => t.Date)
                .ThenByDescending(t => t.Id)
                .ToListAsync();
        }

        public async Task<ConveyanceTrip?> GetTripByIdAsync(int id)
        {
            return await _context.ConveyanceTrips.FindAsync(id);
        }

        public async Task<List<ConveyanceTrip>> GetUnclaimedTripsAsync()
        {
            return await _context.ConveyanceTrips
                .Where(t => t.Status == "unclaimed")
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }

        public async Task<ConveyanceTrip> AddTripAsync(ConveyanceTrip trip)
        {
            _context.ConveyanceTrips.Add(trip);
            await _context.SaveChangesAsync();
            return trip;
        }

        public async Task<bool> UpdateTripAsync(ConveyanceTrip trip)
        {
            trip.UpdatedAt = DateTime.UtcNow;
            _context.ConveyanceTrips.Update(trip);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteTripAsync(int id)
        {
            var t = await _context.ConveyanceTrips.FindAsync(id);
            if (t == null) return false;
            t.IsDeleted = true;
            t.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<ConveyanceClaim>> GetAllClaimsAsync()
        {
            return await _context.ConveyanceClaims
                .OrderByDescending(c => c.SubmissionDate)
                .ThenByDescending(c => c.Id)
                .ToListAsync();
        }

        public async Task<ConveyanceClaim?> GetClaimByIdAsync(int id)
        {
            return await _context.ConveyanceClaims.FindAsync(id);
        }

        public async Task<ConveyanceClaim> AddClaimAsync(ConveyanceClaim claim, List<int>? tripIds = null)
        {
            _context.ConveyanceClaims.Add(claim);
            await _context.SaveChangesAsync();

            if (tripIds != null && tripIds.Any())
            {
                var trips = await _context.ConveyanceTrips.Where(t => tripIds.Contains(t.Id)).ToListAsync();
                foreach (var t in trips)
                {
                    t.ClaimId = claim.Id;
                    t.VoucherNumber = claim.VoucherNumber;
                    t.Status = "claimed";
                    t.UpdatedAt = DateTime.UtcNow;
                }
                await _context.SaveChangesAsync();
            }

            return claim;
        }

        public async Task<bool> UpdateClaimAsync(ConveyanceClaim claim)
        {
            claim.UpdatedAt = DateTime.UtcNow;
            _context.ConveyanceClaims.Update(claim);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> SettleClaimAsync(int claimId, decimal disbursedAmount, decimal companyDeduction, int? depositAccountId = null)
        {
            var claim = await _context.ConveyanceClaims.FindAsync(claimId);
            if (claim == null) return false;

            claim.ApprovedDisbursedAmount += disbursedAmount;
            claim.CompanyDeduction = companyDeduction;
            claim.OutOfPocketLoss = Math.Max(0, (claim.TotalActualCost - claim.ApprovedDisbursedAmount));

            if (claim.ApprovedDisbursedAmount + claim.CompanyDeduction >= claim.TotalClaimedCost)
            {
                claim.Status = "settled";
            }
            else if (claim.ApprovedDisbursedAmount > 0)
            {
                claim.Status = "partially_disbursed";
            }

            claim.SettlementDate = DateTime.UtcNow;
            claim.UpdatedAt = DateTime.UtcNow;

            // If account specified, deposit reimbursement into account
            if (depositAccountId.HasValue && disbursedAmount > 0)
            {
                var acc = await _context.Accounts.FindAsync(depositAccountId.Value);
                if (acc != null)
                {
                    acc.Balance += disbursedAmount;
                    acc.UpdatedAt = DateTime.UtcNow;

                    // Log double-entry transaction
                    _context.Transactions.Add(new Transaction
                    {
                        Code = $"TX-CONV-{DateTime.UtcNow.Ticks % 10000}",
                        Date = DateTime.UtcNow,
                        Type = "income",
                        Amount = disbursedAmount,
                        Category = "যাতায়াত সমন্বয়",
                        Description = $"অফিস কনভেয়েন্স ভাউচার বিল পরিষদ ({claim.VoucherNumber})",
                        AccountId = acc.Id,
                        AccountName = acc.Name,
                        Status = "cleared",
                        Reference = claim.VoucherNumber
                    });
                }
            }

            // Mark associated trips as settled
            var trips = await _context.ConveyanceTrips.Where(t => t.ClaimId == claimId).ToListAsync();
            foreach (var t in trips)
            {
                t.Status = "settled";
                t.UpdatedAt = DateTime.UtcNow;
            }

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteClaimAsync(int id)
        {
            var c = await _context.ConveyanceClaims.FindAsync(id);
            if (c == null) return false;
            c.IsDeleted = true;
            c.UpdatedAt = DateTime.UtcNow;

            // Release trips back to unclaimed
            var trips = await _context.ConveyanceTrips.Where(t => t.ClaimId == id).ToListAsync();
            foreach (var t in trips)
            {
                t.ClaimId = null;
                t.VoucherNumber = null;
                t.Status = "unclaimed";
                t.UpdatedAt = DateTime.UtcNow;
            }

            return await _context.SaveChangesAsync() > 0;
        }
    }

    public interface IUserProfileRepository
    {
        Task<UserProfile> GetProfileAsync();
        Task<bool> UpdateProfileAsync(UserProfile profile);
        Task<UserSettings> GetSettingsAsync();
        Task<bool> UpdateSettingsAsync(UserSettings settings);
    }

    public class UserProfileRepository : IUserProfileRepository
    {
        private readonly LifeOsDbContext _context;

        public UserProfileRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfile> GetProfileAsync()
        {
            var p = await _context.UserProfiles.FirstOrDefaultAsync();
            if (p == null)
            {
                p = new UserProfile();
                _context.UserProfiles.Add(p);
                await _context.SaveChangesAsync();
            }
            return p;
        }

        public async Task<bool> UpdateProfileAsync(UserProfile profile)
        {
            profile.UpdatedAt = DateTime.UtcNow;
            _context.UserProfiles.Update(profile);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<UserSettings> GetSettingsAsync()
        {
            var s = await _context.UserSettings.FirstOrDefaultAsync();
            if (s == null)
            {
                s = new UserSettings();
                _context.UserSettings.Add(s);
                await _context.SaveChangesAsync();
            }
            return s;
        }

        public async Task<bool> UpdateSettingsAsync(UserSettings settings)
        {
            settings.UpdatedAt = DateTime.UtcNow;
            _context.UserSettings.Update(settings);
            return await _context.SaveChangesAsync() > 0;
        }
    }

    public interface INotificationRepository
    {
        Task<List<AppNotification>> GetAllAsync();
        Task<bool> MarkAsReadAsync(int id);
        Task<bool> MarkAllAsReadAsync();
        Task<AppNotification> AddAsync(AppNotification notification);
    }

    public class NotificationRepository : INotificationRepository
    {
        private readonly LifeOsDbContext _context;

        public NotificationRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<List<AppNotification>> GetAllAsync()
        {
            return await _context.Notifications
                .OrderByDescending(n => n.Date)
                .ToListAsync();
        }

        public async Task<bool> MarkAsReadAsync(int id)
        {
            var n = await _context.Notifications.FindAsync(id);
            if (n == null) return false;
            n.IsRead = true;
            n.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> MarkAllAsReadAsync()
        {
            var unread = await _context.Notifications.Where(n => !n.IsRead).ToListAsync();
            foreach (var n in unread)
            {
                n.IsRead = true;
                n.UpdatedAt = DateTime.UtcNow;
            }
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<AppNotification> AddAsync(AppNotification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return notification;
        }
    }
}
