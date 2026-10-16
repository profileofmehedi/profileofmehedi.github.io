using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LifeOS.Web.Data;
using LifeOS.Web.Models.Entities;
using LifeOS.Web.Repositories;

namespace LifeOS.Web.Controllers.Api
{
    // 1. Budgets
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetsController : ControllerBase
    {
        private readonly IBudgetRepository _budgetRepo;

        public BudgetsController(IBudgetRepository budgetRepo)
        {
            _budgetRepo = budgetRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var budgets = await _budgetRepo.GetAllAsync();
            return Ok(budgets);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Budget budget)
        {
            if (string.IsNullOrWhiteSpace(budget.Category))
            {
                return BadRequest(new { message = "ক্যাটাগরি আবশ্যক" });
            }
            if (string.IsNullOrEmpty(budget.Period))
            {
                budget.Period = DateTime.Today.ToString("yyyy-MM");
            }
            var created = await _budgetRepo.AddAsync(budget);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Budget budget)
        {
            var existing = await _budgetRepo.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "বাজেট পাওয়া যায়নি" });

            existing.Category = budget.Category;
            existing.MonthlyLimit = budget.MonthlyLimit;
            existing.Spent = budget.Spent;
            existing.Color = budget.Color;
            existing.Icon = budget.Icon;

            await _budgetRepo.UpdateAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _budgetRepo.DeleteAsync(id);
            if (!success) return NotFound(new { message = "বাজেট পাওয়া যায়নি" });
            return Ok(new { success = true });
        }
    }

    // 2. Savings
    [ApiController]
    [Route("api/[controller]")]
    public class SavingsController : ControllerBase
    {
        private readonly ISavingsGoalRepository _savingsRepo;

        public SavingsController(ISavingsGoalRepository savingsRepo)
        {
            _savingsRepo = savingsRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var goals = await _savingsRepo.GetAllAsync();
            return Ok(goals);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SavingsGoal goal)
        {
            if (string.IsNullOrWhiteSpace(goal.Name))
            {
                return BadRequest(new { message = "লক্ষ্যের নাম আবশ্যক" });
            }
            if (goal.TargetDate == default)
            {
                goal.TargetDate = DateTime.Today.AddYears(1);
            }
            var created = await _savingsRepo.AddAsync(goal);
            return Ok(created);
        }

        public class DepositRequest
        {
            public decimal Amount { get; set; }
        }

        [HttpPost("{id}/deposit")]
        public async Task<IActionResult> AddDeposit(int id, [FromBody] DepositRequest req)
        {
            if (req.Amount <= 0) return BadRequest(new { message = "টাকার পরিমাণ ০ এর বেশি হতে হবে" });
            var success = await _savingsRepo.AddDepositAsync(id, req.Amount);
            if (!success) return NotFound(new { message = "সঞ্চয় লক্ষ্য পাওয়া যায়নি" });
            return Ok(new { success = true });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SavingsGoal goal)
        {
            var existing = await _savingsRepo.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "সঞ্চয় লক্ষ্য পাওয়া যায়নি" });

            existing.Name = goal.Name;
            existing.TargetAmount = goal.TargetAmount;
            existing.CurrentAmount = goal.CurrentAmount;
            existing.TargetDate = goal.TargetDate;
            existing.Category = goal.Category;
            existing.Priority = goal.Priority;
            existing.Color = goal.Color;
            existing.Icon = goal.Icon;
            existing.Notes = goal.Notes;

            await _savingsRepo.UpdateAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _savingsRepo.DeleteAsync(id);
            if (!success) return NotFound(new { message = "সঞ্চয় লক্ষ্য পাওয়া যায়নি" });
            return Ok(new { success = true });
        }
    }

    // 3. Conveyance
    [ApiController]
    [Route("api/[controller]")]
    public class ConveyanceController : ControllerBase
    {
        private readonly IConveyanceRepository _convRepo;

        public ConveyanceController(IConveyanceRepository convRepo)
        {
            _convRepo = convRepo;
        }

        [HttpGet("trips")]
        public async Task<IActionResult> GetTrips()
        {
            var trips = await _convRepo.GetAllTripsAsync();
            return Ok(trips);
        }

        [HttpPost("trips")]
        public async Task<IActionResult> CreateTrip([FromBody] ConveyanceTrip trip)
        {
            if (string.IsNullOrWhiteSpace(trip.FromLocation) || string.IsNullOrWhiteSpace(trip.ToLocation))
            {
                return BadRequest(new { message = "যাত্রা শুরুর স্থান এবং গন্তব্য আবশ্যক" });
            }
            if (trip.Date == default) trip.Date = DateTime.Today;
            if (trip.ClaimedCost <= 0) trip.ClaimedCost = trip.ActualCost;

            var created = await _convRepo.AddTripAsync(trip);
            return Ok(created);
        }

        [HttpDelete("trips/{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            var success = await _convRepo.DeleteTripAsync(id);
            if (!success) return NotFound(new { message = "ট্রিপ পাওয়া যায়নি" });
            return Ok(new { success = true });
        }

        [HttpGet("claims")]
        public async Task<IActionResult> GetClaims()
        {
            var claims = await _convRepo.GetAllClaimsAsync();
            return Ok(claims);
        }

        public class CreateClaimRequest
        {
            public ConveyanceClaim Claim { get; set; } = new();
            public List<int>? TripIds { get; set; }
        }

        [HttpPost("claims")]
        public async Task<IActionResult> CreateClaim([FromBody] CreateClaimRequest req)
        {
            if (string.IsNullOrEmpty(req.Claim.VoucherNumber))
            {
                req.Claim.VoucherNumber = $"CONV-{DateTime.Today:yyyyMM}-{DateTime.UtcNow.Ticks % 1000:D3}";
            }
            if (req.Claim.SubmissionDate == default)
            {
                req.Claim.SubmissionDate = DateTime.Today;
            }
            var created = await _convRepo.AddClaimAsync(req.Claim, req.TripIds);
            return Ok(created);
        }

        public class SettleClaimRequest
        {
            public decimal DisbursedAmount { get; set; }
            public decimal CompanyDeduction { get; set; }
            public int? DepositAccountId { get; set; }
        }

        [HttpPost("claims/{id}/settle")]
        public async Task<IActionResult> SettleClaim(int id, [FromBody] SettleClaimRequest req)
        {
            var success = await _convRepo.SettleClaimAsync(id, req.DisbursedAmount, req.CompanyDeduction, req.DepositAccountId);
            if (!success) return NotFound(new { message = "ভাউচার ক্লেইম পাওয়া যায়নি" });
            return Ok(new { success = true });
        }

        [HttpDelete("claims/{id}")]
        public async Task<IActionResult> DeleteClaim(int id)
        {
            var success = await _convRepo.DeleteClaimAsync(id);
            if (!success) return NotFound(new { message = "ভাউচার ক্লেইম পাওয়া যায়নি" });
            return Ok(new { success = true });
        }
    }

    // 4. LifeGoals
    [ApiController]
    [Route("api/[controller]")]
    public class LifeGoalsController : ControllerBase
    {
        private readonly ILifeGoalRepository _goalRepo;

        public LifeGoalsController(ILifeGoalRepository goalRepo)
        {
            _goalRepo = goalRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var goals = await _goalRepo.GetAllAsync();
            return Ok(goals);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LifeGoal goal)
        {
            if (string.IsNullOrWhiteSpace(goal.Title))
            {
                return BadRequest(new { message = "লক্ষ্যের শিরোনাম আবশ্যক" });
            }
            var created = await _goalRepo.AddAsync(goal);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LifeGoal goal)
        {
            var existing = await _goalRepo.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "লক্ষ্য পাওয়া যায়নি" });

            existing.Title = goal.Title;
            existing.Category = goal.Category;
            existing.TargetYear = goal.TargetYear;
            existing.Progress = goal.Progress;
            existing.Notes = goal.Notes;
            if (!string.IsNullOrEmpty(goal.MilestonesJson)) existing.MilestonesJson = goal.MilestonesJson;

            await _goalRepo.UpdateAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _goalRepo.DeleteAsync(id);
            if (!success) return NotFound(new { message = "লক্ষ্য পাওয়া যায়নি" });
            return Ok(new { success = true });
        }
    }

    // 5. Journal
    [ApiController]
    [Route("api/[controller]")]
    public class JournalController : ControllerBase
    {
        private readonly IJournalRepository _journalRepo;

        public JournalController(IJournalRepository journalRepo)
        {
            _journalRepo = journalRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entries = await _journalRepo.GetAllAsync();
            return Ok(entries);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] JournalEntry entry)
        {
            if (entry.Date == default) entry.Date = DateTime.Today;
            var created = await _journalRepo.AddAsync(entry);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] JournalEntry entry)
        {
            var existing = await _journalRepo.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "জার্নাল পাওয়া যায়নি" });

            existing.Date = entry.Date;
            existing.Mood = entry.Mood;
            existing.MoodEmoji = entry.MoodEmoji;
            existing.Wins = entry.Wins;
            existing.Gratitude = entry.Gratitude;
            existing.Reflection = entry.Reflection;
            existing.TagsJson = entry.TagsJson;

            await _journalRepo.UpdateAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _journalRepo.DeleteAsync(id);
            if (!success) return NotFound(new { message = "জার্নাল পাওয়া যায়নি" });
            return Ok(new { success = true });
        }
    }

    // 6. Settings & Profile
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly IUserProfileRepository _profileRepo;
        private readonly LifeOsDbContext _context;

        public SettingsController(IUserProfileRepository profileRepo, LifeOsDbContext context)
        {
            _profileRepo = profileRepo;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _profileRepo.GetSettingsAsync();
            return Ok(settings);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateSettings([FromBody] UserSettings settings)
        {
            var existing = await _profileRepo.GetSettingsAsync();
            existing.Currency = settings.Currency;
            existing.CurrencySymbol = settings.CurrencySymbol;
            existing.Theme = settings.Theme;
            existing.DateFormat = settings.DateFormat;
            existing.FirstDayOfWeek = settings.FirstDayOfWeek;
            existing.PrivacyMode = settings.PrivacyMode;
            existing.DefaultPage = settings.DefaultPage;
            existing.NotificationSound = settings.NotificationSound;
            existing.BudgetAlertThreshold = settings.BudgetAlertThreshold;

            await _profileRepo.UpdateSettingsAsync(existing);
            return Ok(existing);
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var profile = await _profileRepo.GetProfileAsync();
            return Ok(profile);
        }

        [HttpPost("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UserProfile profile)
        {
            var existing = await _profileRepo.GetProfileAsync();
            existing.Name = profile.Name;
            existing.Email = profile.Email;
            existing.Role = profile.Role;
            existing.Location = profile.Location;
            existing.Bio = profile.Bio;
            if (!string.IsNullOrEmpty(profile.Avatar)) existing.Avatar = profile.Avatar;

            await _profileRepo.UpdateProfileAsync(existing);
            return Ok(existing);
        }

        [HttpPost("reset-demo")]
        public async Task<IActionResult> ResetDemo()
        {
            await DbInitializer.SeedAsync(_context);
            return Ok(new { success = true, message = "ডেমো ডেটা সফলভাবে রিলোড হয়েছে" });
        }
    }

    // 7. Notifications
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationRepository _notifRepo;

        public NotificationsController(INotificationRepository notifRepo)
        {
            _notifRepo = notifRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var notifs = await _notifRepo.GetAllAsync();
            return Ok(notifs);
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkRead(int id)
        {
            var success = await _notifRepo.MarkAsReadAsync(id);
            return Ok(new { success });
        }

        [HttpPost("read-all")]
        public async Task<IActionResult> MarkAllRead()
        {
            var success = await _notifRepo.MarkAllAsReadAsync();
            return Ok(new { success });
        }
    }
}
