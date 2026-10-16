using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LifeOS.Web.Repositories;

namespace LifeOS.Web.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IAccountRepository _accountRepo;
        private readonly ITransactionRepository _txRepo;
        private readonly ITaskRepository _taskRepo;
        private readonly IHabitRepository _habitRepo;
        private readonly IBudgetRepository _budgetRepo;
        private readonly ISavingsGoalRepository _savingsRepo;
        private readonly ICalendarEventRepository _eventRepo;
        private readonly IUserProfileRepository _profileRepo;

        public DashboardController(
            IAccountRepository accountRepo,
            ITransactionRepository txRepo,
            ITaskRepository taskRepo,
            IHabitRepository habitRepo,
            IBudgetRepository budgetRepo,
            ISavingsGoalRepository savingsRepo,
            ICalendarEventRepository eventRepo,
            IUserProfileRepository profileRepo)
        {
            _accountRepo = accountRepo;
            _txRepo = txRepo;
            _taskRepo = taskRepo;
            _habitRepo = habitRepo;
            _budgetRepo = budgetRepo;
            _savingsRepo = savingsRepo;
            _eventRepo = eventRepo;
            _profileRepo = profileRepo;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var accounts = await _accountRepo.GetAllAccountsAsync();
            var cards = await _accountRepo.GetAllCardsAsync();
            var transactions = await _txRepo.GetAllAsync();
            var tasks = await _taskRepo.GetAllAsync();
            var habits = await _habitRepo.GetAllAsync();
            var budgets = await _budgetRepo.GetAllAsync();
            var goals = await _savingsRepo.GetAllAsync();
            var user = await _profileRepo.GetProfileAsync();
            var settings = await _profileRepo.GetSettingsAsync();

            var today = DateTime.Today;
            var currentMonth = today.Month;
            var currentYear = today.Year;

            // Net Worth
            var totalAssets = accounts.Sum(a => a.Balance);
            var totalDebts = cards.Where(c => c.CardType == "credit").Sum(c => c.CurrentBalance);
            var netWorth = totalAssets - totalDebts;

            // Monthly stats
            var curMonthTxs = transactions.Where(t => t.Date.Year == currentYear && t.Date.Month == currentMonth).ToList();
            var monthlyIncome = curMonthTxs.Where(t => t.Type == "income").Sum(t => t.Amount);
            var monthlyExpenses = curMonthTxs.Where(t => t.Type == "expense").Sum(t => t.Amount);
            var monthlySavings = curMonthTxs.Where(t => t.Type == "savings").Sum(t => t.Amount);
            var savingsRate = monthlyIncome > 0 ? Math.Round((monthlySavings / monthlyIncome) * 100, 1) : 0;

            // Prior Month for comparison
            var prevDate = today.AddMonths(-1);
            var prevMonthTxs = transactions.Where(t => t.Date.Year == prevDate.Year && t.Date.Month == prevDate.Month).ToList();
            var prevMonthIncome = prevMonthTxs.Where(t => t.Type == "income").Sum(t => t.Amount);
            var prevMonthExpenses = prevMonthTxs.Where(t => t.Type == "expense").Sum(t => t.Amount);

            // Today's items
            var todayStr = today.ToString("yyyy-MM-dd");
            var todayTasks = tasks.Where(t => t.DueDate.HasValue && t.DueDate.Value.Date == today).ToList();
            var completedTasksToday = todayTasks.Count(t => t.Status == "completed");
            var habitsCompletedToday = habits.Count(h => (h.CompletedDatesJson ?? "").Contains(todayStr));

            var totalDaily = todayTasks.Count + habits.Count;
            var completedDaily = completedTasksToday + habitsCompletedToday;
            var dailyProgressPercent = totalDaily > 0 ? (int)Math.Round(((double)completedDaily / totalDaily) * 100) : 0;

            return Ok(new
            {
                user = new
                {
                    user.Name,
                    user.Email,
                    user.Role,
                    user.Avatar,
                    user.Location,
                    user.Bio
                },
                settings = new
                {
                    settings.Currency,
                    settings.CurrencySymbol,
                    settings.Theme,
                    settings.PrivacyMode
                },
                metrics = new
                {
                    netWorth,
                    totalAssets,
                    totalDebts,
                    monthlyIncome,
                    monthlyExpenses,
                    monthlySavings,
                    savingsRate,
                    prevMonthIncome,
                    prevMonthExpenses,
                    incomeGrowth = prevMonthIncome > 0 ? Math.Round(((monthlyIncome - prevMonthIncome) / prevMonthIncome) * 100, 1) : 0,
                    expenseGrowth = prevMonthExpenses > 0 ? Math.Round(((monthlyExpenses - prevMonthExpenses) / prevMonthExpenses) * 100, 1) : 0,
                    dailyProgressPercent,
                    totalDaily,
                    completedDaily
                },
                recentTransactions = transactions.Take(6).Select(t => new
                {
                    t.Id,
                    t.Code,
                    Date = t.Date.ToString("yyyy-MM-dd"),
                    t.Type,
                    t.Amount,
                    t.Category,
                    t.Description,
                    t.AccountName,
                    t.CardName
                }),
                todayTasks = todayTasks.Take(4).Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Priority,
                    t.Status,
                    t.DueTime
                }),
                topHabits = habits.Take(5).Select(h => new
                {
                    h.Id,
                    h.Name,
                    h.Category,
                    IsDone = (h.CompletedDatesJson ?? "").Contains(todayStr)
                }),
                budgets = budgets.Take(5).Select(b => new
                {
                    b.Id,
                    b.Category,
                    b.MonthlyLimit,
                    b.Spent,
                    b.Color,
                    Percent = b.MonthlyLimit > 0 ? Math.Round((b.Spent / b.MonthlyLimit) * 100) : 0
                }),
                savingsGoals = goals.Take(4).Select(g => new
                {
                    g.Id,
                    g.Name,
                    g.TargetAmount,
                    g.CurrentAmount,
                    g.Color,
                    Percent = g.TargetAmount > 0 ? Math.Round((g.CurrentAmount / g.TargetAmount) * 100) : 0
                })
            });
        }
    }
}
