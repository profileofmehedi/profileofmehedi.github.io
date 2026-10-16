using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LifeOS.Web.Data;
using LifeOS.Web.Models.Entities;

namespace LifeOS.Web.Repositories
{
    public interface IBudgetRepository
    {
        Task<List<Budget>> GetAllAsync();
        Task<Budget?> GetByIdAsync(int id);
        Task<List<Budget>> GetByPeriodAsync(string period);
        Task<Budget> AddAsync(Budget budget);
        Task<bool> UpdateAsync(Budget budget);
        Task<bool> DeleteAsync(int id);
    }

    public class BudgetRepository : IBudgetRepository
    {
        private readonly LifeOsDbContext _context;

        public BudgetRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<List<Budget>> GetAllAsync()
        {
            return await _context.Budgets.ToListAsync();
        }

        public async Task<Budget?> GetByIdAsync(int id)
        {
            return await _context.Budgets.FindAsync(id);
        }

        public async Task<List<Budget>> GetByPeriodAsync(string period)
        {
            return await _context.Budgets.Where(b => b.Period == period).ToListAsync();
        }

        public async Task<Budget> AddAsync(Budget budget)
        {
            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();
            return budget;
        }

        public async Task<bool> UpdateAsync(Budget budget)
        {
            budget.UpdatedAt = DateTime.UtcNow;
            _context.Budgets.Update(budget);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var b = await _context.Budgets.FindAsync(id);
            if (b == null) return false;
            b.IsDeleted = true;
            b.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }
    }

    public interface ISavingsGoalRepository
    {
        Task<List<SavingsGoal>> GetAllAsync();
        Task<SavingsGoal?> GetByIdAsync(int id);
        Task<SavingsGoal> AddAsync(SavingsGoal goal);
        Task<bool> UpdateAsync(SavingsGoal goal);
        Task<bool> DeleteAsync(int id);
        Task<bool> AddDepositAsync(int goalId, decimal amount);
    }

    public class SavingsGoalRepository : ISavingsGoalRepository
    {
        private readonly LifeOsDbContext _context;

        public SavingsGoalRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<List<SavingsGoal>> GetAllAsync()
        {
            return await _context.SavingsGoals.ToListAsync();
        }

        public async Task<SavingsGoal?> GetByIdAsync(int id)
        {
            return await _context.SavingsGoals.FindAsync(id);
        }

        public async Task<SavingsGoal> AddAsync(SavingsGoal goal)
        {
            _context.SavingsGoals.Add(goal);
            await _context.SaveChangesAsync();
            return goal;
        }

        public async Task<bool> UpdateAsync(SavingsGoal goal)
        {
            goal.UpdatedAt = DateTime.UtcNow;
            _context.SavingsGoals.Update(goal);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var g = await _context.SavingsGoals.FindAsync(id);
            if (g == null) return false;
            g.IsDeleted = true;
            g.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> AddDepositAsync(int goalId, decimal amount)
        {
            var g = await _context.SavingsGoals.FindAsync(goalId);
            if (g == null) return false;
            g.CurrentAmount += amount;
            if (g.CurrentAmount >= g.TargetAmount)
            {
                g.Status = "completed";
            }
            g.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }
    }

    public interface ITaskRepository
    {
        Task<List<TaskItem>> GetAllAsync();
        Task<TaskItem?> GetByIdAsync(int id);
        Task<List<TaskItem>> GetByDueDateAsync(DateTime date);
        Task<TaskItem> AddAsync(TaskItem task);
        Task<bool> UpdateAsync(TaskItem task);
        Task<bool> ToggleStatusAsync(int id);
        Task<bool> DeleteAsync(int id);
    }

    public class TaskRepository : ITaskRepository
    {
        private readonly LifeOsDbContext _context;

        public TaskRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<List<TaskItem>> GetAllAsync()
        {
            return await _context.Tasks
                .OrderBy(t => t.Status == "completed")
                .ThenBy(t => t.DueDate)
                .ToListAsync();
        }

        public async Task<TaskItem?> GetByIdAsync(int id)
        {
            return await _context.Tasks.FindAsync(id);
        }

        public async Task<List<TaskItem>> GetByDueDateAsync(DateTime date)
        {
            var target = date.Date;
            return await _context.Tasks
                .Where(t => t.DueDate.HasValue && t.DueDate.Value.Date == target)
                .ToListAsync();
        }

        public async Task<TaskItem> AddAsync(TaskItem task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<bool> UpdateAsync(TaskItem task)
        {
            task.UpdatedAt = DateTime.UtcNow;
            _context.Tasks.Update(task);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ToggleStatusAsync(int id)
        {
            var t = await _context.Tasks.FindAsync(id);
            if (t == null) return false;
            t.Status = t.Status == "completed" ? "todo" : "completed";
            t.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var t = await _context.Tasks.FindAsync(id);
            if (t == null) return false;
            t.IsDeleted = true;
            t.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
