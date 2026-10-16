using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LifeOS.Web.Models.Entities;
using LifeOS.Web.Repositories;

namespace LifeOS.Web.Controllers.Api
{
    // 1. Tasks
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskRepository _taskRepo;

        public TasksController(ITaskRepository taskRepo)
        {
            _taskRepo = taskRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tasks = await _taskRepo.GetAllAsync();
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaskItem task)
        {
            if (string.IsNullOrWhiteSpace(task.Title))
            {
                return BadRequest(new { message = "টাস্কের শিরোনাম আবশ্যক" });
            }
            var created = await _taskRepo.AddAsync(task);
            return Ok(created);
        }

        [HttpPost("{id}/toggle")]
        public async Task<IActionResult> Toggle(int id)
        {
            var success = await _taskRepo.ToggleStatusAsync(id);
            if (!success) return NotFound(new { message = "টাস্ক পাওয়া যায়নি" });
            return Ok(new { success = true });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TaskItem task)
        {
            var existing = await _taskRepo.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "টাস্ক পাওয়া যায়নি" });

            existing.Title = task.Title;
            existing.Description = task.Description;
            existing.DueDate = task.DueDate;
            existing.DueTime = task.DueTime;
            existing.Priority = task.Priority;
            existing.Status = task.Status;
            existing.Category = task.Category;

            await _taskRepo.UpdateAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _taskRepo.DeleteAsync(id);
            if (!success) return NotFound(new { message = "টাস্ক পাওয়া যায়নি" });
            return Ok(new { success = true });
        }
    }

    // 2. Habits
    [ApiController]
    [Route("api/[controller]")]
    public class HabitsController : ControllerBase
    {
        private readonly IHabitRepository _habitRepo;

        public HabitsController(IHabitRepository habitRepo)
        {
            _habitRepo = habitRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var habits = await _habitRepo.GetAllAsync();
            return Ok(habits);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Habit habit)
        {
            if (string.IsNullOrWhiteSpace(habit.Name))
            {
                return BadRequest(new { message = "অভ্যাসের নাম আবশ্যক" });
            }
            var created = await _habitRepo.AddAsync(habit);
            return Ok(created);
        }

        public class HabitToggleRequest
        {
            public string? Date { get; set; }
        }

        [HttpPost("{id}/toggle")]
        public async Task<IActionResult> Toggle(int id, [FromBody] HabitToggleRequest? req)
        {
            var dateStr = !string.IsNullOrEmpty(req?.Date) ? req.Date : DateTime.Today.ToString("yyyy-MM-dd");
            var success = await _habitRepo.ToggleCompletionAsync(id, dateStr);
            if (!success) return NotFound(new { message = "অভ্যাস পাওয়া যায়নি" });
            return Ok(new { success = true });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Habit habit)
        {
            var existing = await _habitRepo.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "অভ্যাস পাওয়া যায়নি" });

            existing.Name = habit.Name;
            existing.Category = habit.Category;
            existing.Frequency = habit.Frequency;
            existing.TimeOfDay = habit.TimeOfDay;
            existing.TargetDaysPerWeek = habit.TargetDaysPerWeek;
            existing.Color = habit.Color;
            existing.Icon = habit.Icon;

            await _habitRepo.UpdateAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _habitRepo.DeleteAsync(id);
            if (!success) return NotFound(new { message = "অভ্যাস পাওয়া যায়নি" });
            return Ok(new { success = true });
        }
    }

    // 3. Routines
    [ApiController]
    [Route("api/[controller]")]
    public class RoutinesController : ControllerBase
    {
        private readonly IRoutineRepository _routineRepo;

        public RoutinesController(IRoutineRepository routineRepo)
        {
            _routineRepo = routineRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var routines = await _routineRepo.GetAllAsync();
            return Ok(routines);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Routine routine)
        {
            if (string.IsNullOrWhiteSpace(routine.Name))
            {
                return BadRequest(new { message = "রুটিনের নাম আবশ্যক" });
            }
            var created = await _routineRepo.AddAsync(routine);
            return Ok(created);
        }

        public class StepToggleRequest
        {
            public string StepId { get; set; } = string.Empty;
        }

        [HttpPost("{id}/toggle-step")]
        public async Task<IActionResult> ToggleStep(int id, [FromBody] StepToggleRequest req)
        {
            var success = await _routineRepo.ToggleStepAsync(id, req.StepId);
            if (!success) return NotFound(new { message = "স্টেপ পাওয়া যায়নি" });
            return Ok(new { success = true });
        }

        [HttpPost("{id}/reset")]
        public async Task<IActionResult> Reset(int id)
        {
            var success = await _routineRepo.ResetStepsAsync(id);
            if (!success) return NotFound(new { message = "রুটিন পাওয়া যায়নি" });
            return Ok(new { success = true });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Routine routine)
        {
            var existing = await _routineRepo.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "রুটিন পাওয়া যায়নি" });

            existing.Name = routine.Name;
            existing.Period = routine.Period;
            existing.EstimatedTime = routine.EstimatedTime;
            existing.Color = routine.Color;
            existing.Icon = routine.Icon;
            if (!string.IsNullOrEmpty(routine.StepsJson)) existing.StepsJson = routine.StepsJson;

            await _routineRepo.UpdateAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _routineRepo.DeleteAsync(id);
            if (!success) return NotFound(new { message = "রুটিন পাওয়া যায়নি" });
            return Ok(new { success = true });
        }
    }

    // 4. Calendar
    [ApiController]
    [Route("api/[controller]")]
    public class CalendarController : ControllerBase
    {
        private readonly ICalendarEventRepository _eventRepo;

        public CalendarController(ICalendarEventRepository eventRepo)
        {
            _eventRepo = eventRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var events = await _eventRepo.GetAllAsync();
            return Ok(events);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CalendarEvent evt)
        {
            if (string.IsNullOrWhiteSpace(evt.Title))
            {
                return BadRequest(new { message = "ইভেন্টের শিরোনাম আবশ্যক" });
            }
            if (evt.Date == default) evt.Date = DateTime.Today;
            var created = await _eventRepo.AddAsync(evt);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CalendarEvent evt)
        {
            var existing = await _eventRepo.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "ইভেন্ট পাওয়া যায়নি" });

            existing.Title = evt.Title;
            existing.Date = evt.Date;
            existing.Time = evt.Time;
            existing.Duration = evt.Duration;
            existing.Category = evt.Category;
            existing.BadgeColor = evt.BadgeColor;
            existing.Location = evt.Location;
            existing.Notes = evt.Notes;

            await _eventRepo.UpdateAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _eventRepo.DeleteAsync(id);
            if (!success) return NotFound(new { message = "ইভেন্ট পাওয়া যায়নি" });
            return Ok(new { success = true });
        }
    }
}
