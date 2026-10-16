using System;

namespace LifeOS.Web.Models.Entities
{
    public class Transaction : BaseEntity
    {
        public string Code { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Type { get; set; } = "expense"; // "income", "expense", "transfer", "savings", "card_payment"
        public decimal Amount { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? AccountId { get; set; }
        public string? AccountName { get; set; }
        public int? ToAccountId { get; set; }
        public string? ToAccountName { get; set; }
        public int? CardId { get; set; }
        public string? CardName { get; set; }
        public string? PayeeOrPayer { get; set; }
        public string Status { get; set; } = "cleared";
        public string? Reference { get; set; }
        public string? Notes { get; set; }
    }

    public class Budget : BaseEntity
    {
        public string Category { get; set; } = string.Empty;
        public decimal MonthlyLimit { get; set; }
        public decimal Spent { get; set; }
        public string Period { get; set; } = "2026-10"; // Month YYYY-MM
        public string? Color { get; set; } = "#635BFF";
        public string? Icon { get; set; } = "bi-pie-chart";
        public bool AlertThresholdReached { get; set; } = false;
    }

    public class SavingsGoal : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public decimal TargetAmount { get; set; }
        public decimal CurrentAmount { get; set; }
        public DateTime TargetDate { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Priority { get; set; } = "High"; // "High", "Medium", "Low"
        public string? Color { get; set; } = "#10B981";
        public string? Icon { get; set; } = "bi-piggy-bank";
        public int? LinkedAccountId { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = "in_progress"; // "in_progress", "completed"
    }
}
