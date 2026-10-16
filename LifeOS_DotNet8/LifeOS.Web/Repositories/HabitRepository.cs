using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LifeOS.Web.Data;
using LifeOS.Web.Models.Entities;

namespace LifeOS.Web.Repositories
{
    public interface IHabitRepository
    {
        Task<List<Habit>> GetAllAsync();
        Task<Habit?> GetByIdAsync(int id);
        Task<Habit> AddAsync(Habit habit);
        Task<bool> UpdateAsync(Habit habit);
        Task<bool> ToggleCompletionAsync(int id, string dateStr);
        Task<bool> DeleteAsync(int id);
    }

    public class HabitRepository : IHabitRepository
    {
        private readonly LifeOsDbContext _context;

        public HabitRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<List<Habit>> GetAllAsync()
        {
            return await _context.Habits.ToListAsync();
        }

        public async Task<Habit?> GetByIdAsync(int id)
        {
            return await _context.Habits.FindAsync(id);
        }

        public async Task<Habit> AddAsync(Habit habit)
        {
            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();
            return habit;
        }

        public async Task<bool> UpdateAsync(Habit habit)
        {
            habit.UpdatedAt = DateTime.UtcNow;
            _context.Habits.Update(habit);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ToggleCompletionAsync(int id, string dateStr)
        {
            var h = await _context.Habits.FindAsync(id);
            if (h == null) return false;

            var dates = JsonSerializer.Deserialize<List<string>>(h.CompletedDatesJson ?? "[]") ?? new List<string>();
            if (dates.Contains(dateStr))
            {
                dates.Remove(dateStr);
            }
            else
            {
                dates.Add(dateStr);
            }

            h.CompletedDatesJson = JsonSerializer.Serialize(dates);
            h.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var h = await _context.Habits.FindAsync(id);
            if (h == null) return false;
            h.IsDeleted = true;
            h.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }
    }

    public interface IRoutineRepository
    {
        Task<List<Routine>> GetAllAsync();
        Task<Routine?> GetByIdAsync(int id);
        Task<Routine> AddAsync(Routine routine);
        Task<bool> UpdateAsync(Routine routine);
        Task<bool> ToggleStepAsync(int routineId, string stepId);
        Task<bool> ResetStepsAsync(int routineId);
        Task<bool> DeleteAsync(int id);
    }

    public class RoutineRepository : IRoutineRepository
    {
        private readonly LifeOsDbContext _context;

        public RoutineRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<List<Routine>> GetAllAsync()
        {
            return await _context.Routines.ToListAsync();
        }

        public async Task<Routine?> GetByIdAsync(int id)
        {
            return await _context.Routines.FindAsync(id);
        }

        public async Task<Routine> AddAsync(Routine routine)
        {
            _context.Routines.Add(routine);
            await _context.SaveChangesAsync();
            return routine;
        }

        public async Task<bool> UpdateAsync(Routine routine)
        {
            routine.UpdatedAt = DateTime.UtcNow;
            _context.Routines.Update(routine);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ToggleStepAsync(int routineId, string stepId)
        {
            var r = await _context.Routines.FindAsync(routineId);
            if (r == null) return false;

            try
            {
                var steps = JsonSerializer.Deserialize<List<Dictionary<string, object>>>(r.StepsJson ?? "[]");
                if (steps != null)
                {
                    foreach (var s in steps)
                    {
                        if (s.TryGetValue("id", out var idObj) && idObj?.ToString() == stepId)
                        {
                            bool cur = s.TryGetValue("completed", out var comp) && comp is JsonElement elem ? elem.GetBoolean() : false;
                            s["completed"] = !cur;
                        }
                    }
                    r.StepsJson = JsonSerializer.Serialize(steps);
                    r.UpdatedAt = DateTime.UtcNow;
                    return await _context.SaveChangesAsync() > 0;
                }
            }
            catch
            {
                // Json parsing fallback
            }

            return false;
        }

        public async Task<bool> ResetStepsAsync(int routineId)
        {
            var r = await _context.Routines.FindAsync(routineId);
            if (r == null) return false;

            try
            {
                var steps = JsonSerializer.Deserialize<List<Dictionary<string, object>>>(r.StepsJson ?? "[]");
                if (steps != null)
                {
                    foreach (var s in steps)
                    {
                        s["completed"] = false;
                    }
                    r.StepsJson = JsonSerializer.Serialize(steps);
                    r.UpdatedAt = DateTime.UtcNow;
                    return await _context.SaveChangesAsync() > 0;
                }
            }
            catch { }

            return false;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var r = await _context.Routines.FindAsync(id);
            if (r == null) return false;
            r.IsDeleted = true;
            r.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }
    }

    public interface ICalendarEventRepository
    {
        Task<List<CalendarEvent>> GetAllAsync();
        Task<CalendarEvent?> GetByIdAsync(int id);
        Task<List<CalendarEvent>> GetByMonthAsync(int year, int month);
        Task<CalendarEvent> AddAsync(CalendarEvent evt);
        Task<bool> UpdateAsync(CalendarEvent evt);
        Task<bool> DeleteAsync(int id);
    }

    public class CalendarEventRepository : ICalendarEventRepository
    {
        private readonly LifeOsDbContext _context;

        public CalendarEventRepository(LifeOsDbContext context)
        {
            _context = context;
        }

        public async Task<List<CalendarEvent>> GetAllAsync()
        {
            return await _context.CalendarEvents
                .OrderBy(e => e.Date)
                .ThenBy(e => e.Time)
                .ToListAsync();
        }

        public async Task<CalendarEvent?> GetByIdAsync(int id)
        {
            return await _context.CalendarEvents.FindAsync(id);
        }

        public async Task<List<CalendarEvent>> GetByMonthAsync(int year, int month)
        {
            return await _context.CalendarEvents
                .Where(e => e.Date.Year == year && e.Date.Month == month)
                .OrderBy(e => e.Date)
                .ToListAsync();
        }

        public async Task<CalendarEvent> AddAsync(CalendarEvent evt)
        {
            _context.CalendarEvents.Add(evt);
            await _context.SaveChangesAsync();
            return evt;
        }

        public async Task<bool> UpdateAsync(CalendarEvent evt)
        {
            evt.UpdatedAt = DateTime.UtcNow;
            _context.CalendarEvents.Update(evt);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _context.CalendarEvents.FindAsync(id);
            if (e == null) return false;
            e.IsDeleted = true;
            e.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
