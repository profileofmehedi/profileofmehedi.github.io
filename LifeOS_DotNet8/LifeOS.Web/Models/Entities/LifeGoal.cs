using System;

namespace LifeOS.Web.Models.Entities
{
    public class LifeGoal : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = "ক্যারিয়ার";
        public string TargetYear { get; set; } = "২০২৭";
        public int Progress { get; set; } = 0;
        public string? Notes { get; set; }
        public string MilestonesJson { get; set; } = "[]";
    }

    public class JournalEntry : BaseEntity
    {
        public DateTime Date { get; set; } = DateTime.Today;
        public string Mood { get; set; } = "চমৎকার";
        public string MoodEmoji { get; set; } = "🌟";
        public string? Wins { get; set; }
        public string? Gratitude { get; set; }
        public string? Reflection { get; set; }
        public string TagsJson { get; set; } = "[]";
    }

    public class ConveyanceTrip : BaseEntity
    {
        public DateTime Date { get; set; } = DateTime.Today;
        public string FromLocation { get; set; } = string.Empty;
        public string ToLocation { get; set; } = string.Empty;
        public string TransportMode { get; set; } = "উবার";
        public string Purpose { get; set; } = string.Empty;
        public decimal ActualCost { get; set; }
        public decimal ClaimedCost { get; set; }
        public string Status { get; set; } = "unclaimed"; // "unclaimed", "claimed", "settled"
        public int? ClaimId { get; set; }
        public string? VoucherNumber { get; set; }
        public string? ReceiptUrl { get; set; }
    }

    public class ConveyanceClaim : BaseEntity
    {
        public string VoucherNumber { get; set; } = string.Empty;
        public DateTime SubmissionDate { get; set; } = DateTime.Today;
        public decimal TotalActualCost { get; set; }
        public decimal TotalClaimedCost { get; set; }
        public decimal ApprovedDisbursedAmount { get; set; }
        public decimal CompanyDeduction { get; set; }
        public decimal OutOfPocketLoss { get; set; }
        public string Status { get; set; } = "submitted"; // "draft", "submitted", "approved", "partially_disbursed", "settled"
        public string? Notes { get; set; }
        public DateTime? SettlementDate { get; set; }
    }

    public class AppNotification : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "info"; // "info", "warning", "success", "danger"
        public string? Link { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
