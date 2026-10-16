using System;

namespace LifeOS.Web.Models.Entities
{
    public class Account : BaseEntity
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public string Type { get; set; } = "bank"; // "bank", "wallet", "cash"
        public string? Number { get; set; }
        public decimal Balance { get; set; }
        public string Currency { get; set; } = "BDT";
        public string? Color { get; set; } = "#635BFF";
        public string? Icon { get; set; } = "bi-wallet2";
        public bool IsPreferred { get; set; } = false;
        public bool HideFromDashboard { get; set; } = false;
        public string Status { get; set; } = "active";
        public string? Branch { get; set; }
        public DateTime? LastUpdated { get; set; } = DateTime.UtcNow;

        // DPS specific fields
        public decimal? MonthlyDeposit { get; set; }
        public decimal? MaturityAmount { get; set; }
        public DateTime? MaturityDate { get; set; }
        public int? TenureMonths { get; set; }
        public int? InstallmentDay { get; set; }
        public int? PaidInstallments { get; set; }

        // Loan specific fields
        public decimal? TotalLoanAmount { get; set; }
        public decimal? RemainingPrincipal { get; set; }
        public decimal? MonthlyEmi { get; set; }
        public decimal? InterestRate { get; set; }
        public int? EmiDueDay { get; set; }
        public int? LoanTenureMonths { get; set; }
        public int? PaidEmis { get; set; }
        public string? LoanType { get; set; }
    }

    public class Card : BaseEntity
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public string CardType { get; set; } = "credit"; // "credit" or "debit"
        public string CardNumberLast4 { get; set; } = string.Empty;
        public string CardholderName { get; set; } = string.Empty;
        public string ExpiryDate { get; set; } = string.Empty;
        public decimal CreditLimit { get; set; }
        public decimal CurrentBalance { get; set; }
        public int? LinkedAccountId { get; set; }
        public string? LinkedAccountName { get; set; }
        public int BillingCycleDay { get; set; } = 15;
        public int PaymentDueDay { get; set; } = 5;
        public string? Gradient { get; set; }
        public string Status { get; set; } = "active";
    }
}
