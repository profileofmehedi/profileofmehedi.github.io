using System;

namespace LifeOS.Web.Models.Entities
{
    public class TaskItem : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public string? DueTime { get; set; }
        public string Priority { get; set; } = "Medium"; // "Urgent", "High", "Medium", "Low"
        public string Status { get; set; } = "todo"; // "todo", "in_progress", "completed"
        public string Category { get; set; } = "সাধারণ";
        public string? Tags { get; set; }
    }

    public class Habit : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = "স্বাস্থ্য";
        public string Frequency { get; set; } = "দৈনিক";
        public string TimeOfDay { get; set; } = "সকাল";
        public int TargetDaysPerWeek { get; set; } = 7;
        public string? Color { get; set; } = "#16A36A";
        public string? Icon { get; set; } = "bi-check2-circle";
        public string CompletedDatesJson { get; set; } = "[]";
    }

    public class Routine : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Period { get; set; } = "সকাল";
        public string EstimatedTime { get; set; } = "৩০ মিনিট";
        public string? Color { get; set; } = "#635BFF";
        public string? Icon { get; set; } = "bi-sun";
        public string StepsJson { get; set; } = "[]";
    }

    public class CalendarEvent : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? Time { get; set; }
        public string? Duration { get; set; }
        public string Category { get; set; } = "মিটিং";
        public string? BadgeColor { get; set; } = "#635BFF";
        public string? Location { get; set; }
        public string? Notes { get; set; }
        public bool IsAllDay { get; set; } = false;
    }
}
