using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LifeOS.Web.Models.Entities;
using LifeOS.Web.Repositories;

namespace LifeOS.Web.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountRepository _accountRepo;
        private readonly ITransactionRepository _txRepo;

        public AccountsController(IAccountRepository accountRepo, ITransactionRepository txRepo)
        {
            _accountRepo = accountRepo;
            _txRepo = txRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAccounts()
        {
            var accounts = await _accountRepo.GetAllAccountsAsync();
            var cards = await _accountRepo.GetAllCardsAsync();
            return Ok(new { accounts, cards });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAccount(int id)
        {
            var acc = await _accountRepo.GetAccountByIdAsync(id);
            if (acc == null) return NotFound(new { message = "অ্যাকাউন্ট খুঁজে পাওয়া যায়নি" });
            return Ok(acc);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAccount([FromBody] Account account)
        {
            if (string.IsNullOrWhiteSpace(account.Name))
            {
                return BadRequest(new { message = "অ্যাকাউন্টের নাম আবশ্যক" });
            }
            if (string.IsNullOrEmpty(account.Code))
            {
                account.Code = $"ACC-{DateTime.UtcNow.Ticks % 10000}";
            }
            if (account.Type == "loan" && account.RemainingPrincipal == null && account.Balance > 0)
            {
                account.RemainingPrincipal = account.Balance;
            }
            var created = await _accountRepo.AddAccountAsync(account);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] Account account)
        {
            var existing = await _accountRepo.GetAccountByIdAsync(id);
            if (existing == null) return NotFound(new { message = "অ্যাকাউন্ট পাওয়া যায়নি" });

            existing.Name = account.Name;
            existing.Institution = account.Institution;
            existing.Type = account.Type;
            existing.Number = account.Number;
            existing.Balance = account.Balance;
            existing.Color = account.Color;
            existing.Icon = account.Icon;
            existing.IsPreferred = account.IsPreferred;
            existing.Branch = account.Branch;
            existing.MonthlyDeposit = account.MonthlyDeposit;
            existing.MaturityAmount = account.MaturityAmount;
            existing.MaturityDate = account.MaturityDate;
            existing.TenureMonths = account.TenureMonths;
            existing.InstallmentDay = account.InstallmentDay;
            existing.PaidInstallments = account.PaidInstallments;
            existing.TotalLoanAmount = account.TotalLoanAmount;
            existing.RemainingPrincipal = account.RemainingPrincipal;
            existing.MonthlyEmi = account.MonthlyEmi;
            existing.InterestRate = account.InterestRate;
            existing.EmiDueDay = account.EmiDueDay;
            existing.LoanTenureMonths = account.LoanTenureMonths;
            existing.PaidEmis = account.PaidEmis;
            existing.LoanType = account.LoanType;

            await _accountRepo.UpdateAccountAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var success = await _accountRepo.DeleteAccountAsync(id);
            if (!success) return NotFound(new { message = "অ্যাকাউন্ট পাওয়া যায়নি" });
            return Ok(new { success = true, message = "অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে" });
        }

        public class PaymentRequest
        {
            public int SourceAccountId { get; set; }
            public decimal Amount { get; set; }
            public string? Notes { get; set; }
            public DateTime? Date { get; set; }
        }

        [HttpPost("{id}/pay-dps")]
        public async Task<IActionResult> PayDpsInstallment(int id, [FromBody] PaymentRequest req)
        {
            var dps = await _accountRepo.GetAccountByIdAsync(id);
            if (dps == null || dps.Type != "dps") return NotFound(new { message = "ডিপিএস অ্যাকাউন্ট পাওয়া যায়নি" });

            var source = await _accountRepo.GetAccountByIdAsync(req.SourceAccountId);
            if (source == null) return BadRequest(new { message = "টাকা পরিশোধের জন্য নির্বাচিত অ্যাকাউন্টটি পাওয়া যায়নি" });

            if (req.Amount <= 0) return BadRequest(new { message = "কিস্তির পরিমাণ সঠিক নয়" });
            if (source.Balance < req.Amount) return BadRequest(new { message = $"নির্বাচিত অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই (বর্তমান ব্যালেন্স: ৳{source.Balance:N0})" });

            // Create ledger transaction which adjusts balances atomically via TransactionRepository
            var tx = new Transaction
            {
                Code = $"TX-{DateTime.UtcNow.Ticks % 100000}",
                Date = req.Date ?? DateTime.UtcNow,
                Type = "transfer",
                Amount = req.Amount,
                Category = "ডিপিএস সঞ্চয়",
                Description = $"ডিপিএস কিস্তি জমা: {source.Name} থেকে {dps.Name}",
                AccountId = source.Id,
                AccountName = source.Name,
                ToAccountId = dps.Id,
                ToAccountName = dps.Name,
                PayeeOrPayer = dps.Institution,
                Notes = req.Notes ?? "ডিপিএস কিস্তি জমা"
            };
            await _txRepo.AddAsync(tx);

            var updatedDps = await _accountRepo.GetAccountByIdAsync(id);
            var updatedSource = await _accountRepo.GetAccountByIdAsync(req.SourceAccountId);

            return Ok(new { success = true, dps = updatedDps, source = updatedSource, transaction = tx, message = "ডিপিএস কিস্তি সফলভাবে জমা হয়েছে" });
        }

        [HttpPost("{id}/pay-loan")]
        public async Task<IActionResult> PayLoanEmi(int id, [FromBody] PaymentRequest req)
        {
            var loan = await _accountRepo.GetAccountByIdAsync(id);
            if (loan == null || loan.Type != "loan") return NotFound(new { message = "লোন অ্যাকাউন্ট পাওয়া যায়নি" });

            var source = await _accountRepo.GetAccountByIdAsync(req.SourceAccountId);
            if (source == null) return BadRequest(new { message = "টাকা পরিশোধের জন্য নির্বাচিত অ্যাকাউন্টটি পাওয়া যায়নি" });

            if (req.Amount <= 0) return BadRequest(new { message = "ইএমআই এর পরিমাণ সঠিক নয়" });
            if (source.Balance < req.Amount) return BadRequest(new { message = $"নির্বাচিত অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই (বর্তমান ব্যালেন্স: ৳{source.Balance:N0})" });

            // Create ledger transaction which adjusts balances atomically via TransactionRepository
            var tx = new Transaction
            {
                Code = $"TX-{DateTime.UtcNow.Ticks % 100000}",
                Date = req.Date ?? DateTime.UtcNow,
                Type = "transfer",
                Amount = req.Amount,
                Category = "ঋণ / লোন পরিশোধ",
                Description = $"লোন ইএমআই পরিশোধ: {loan.Name} ({source.Name} হতে)",
                AccountId = source.Id,
                AccountName = source.Name,
                ToAccountId = loan.Id,
                ToAccountName = loan.Name,
                PayeeOrPayer = loan.Institution,
                Notes = req.Notes ?? "লোন ইএমআই পরিশোধ"
            };
            await _txRepo.AddAsync(tx);

            var updatedLoan = await _accountRepo.GetAccountByIdAsync(id);
            var updatedSource = await _accountRepo.GetAccountByIdAsync(req.SourceAccountId);

            return Ok(new { success = true, loan = updatedLoan, source = updatedSource, transaction = tx, message = "লোন ইএমআই সফলভাবে পরিশোধ হয়েছে" });
        }

        // Cards
        [HttpPost("cards")]
        public async Task<IActionResult> CreateCard([FromBody] Card card)
        {
            if (string.IsNullOrWhiteSpace(card.Name))
            {
                return BadRequest(new { message = "কার্ডের নাম আবশ্যক" });
            }
            if (string.IsNullOrEmpty(card.Code))
            {
                card.Code = $"CRD-{DateTime.UtcNow.Ticks % 10000}";
            }
            var created = await _accountRepo.AddCardAsync(card);
            return Ok(created);
        }

        [HttpPut("cards/{id}")]
        public async Task<IActionResult> UpdateCard(int id, [FromBody] Card card)
        {
            var existing = await _accountRepo.GetCardByIdAsync(id);
            if (existing == null) return NotFound(new { message = "কার্ড পাওয়া যায়নি" });

            existing.Name = card.Name;
            existing.Institution = card.Institution;
            existing.CardType = card.CardType;
            existing.CardNumberLast4 = card.CardNumberLast4;
            existing.CardholderName = card.CardholderName;
            existing.ExpiryDate = card.ExpiryDate;
            existing.CreditLimit = card.CreditLimit;
            existing.CurrentBalance = card.CurrentBalance;
            existing.LinkedAccountId = card.LinkedAccountId;
            existing.LinkedAccountName = card.LinkedAccountName;
            existing.BillingCycleDay = card.BillingCycleDay;
            existing.PaymentDueDay = card.PaymentDueDay;
            existing.Gradient = card.Gradient;

            await _accountRepo.UpdateCardAsync(existing);
            return Ok(existing);
        }

        [HttpPost("cards/{id}/pay-bill")]
        public async Task<IActionResult> PayCardBill(int id, [FromBody] PaymentRequest req)
        {
            var card = await _accountRepo.GetCardByIdAsync(id);
            if (card == null) return NotFound(new { message = "কার্ড পাওয়া যায়নি" });

            var source = await _accountRepo.GetAccountByIdAsync(req.SourceAccountId);
            if (source == null) return BadRequest(new { message = "টাকা পরিশোধের জন্য নির্বাচিত অ্যাকাউন্টটি পাওয়া যায়নি" });

            if (req.Amount <= 0) return BadRequest(new { message = "পরিশোধিত টাকার পরিমাণ সঠিক নয়" });
            if (source.Balance < req.Amount) return BadRequest(new { message = $"নির্বাচিত অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই (বর্তমান ব্যালেন্স: ৳{source.Balance:N0})" });

            // Create ledger transaction which adjusts card outstanding and bank balance atomically via TransactionRepository
            var tx = new Transaction
            {
                Code = $"TX-{DateTime.UtcNow.Ticks % 100000}",
                Date = req.Date ?? DateTime.UtcNow,
                Type = "card_payment",
                Amount = req.Amount,
                Category = "ক্রেডিট কার্ড বিল",
                Description = $"ক্রেডিট কার্ড বিল পরিশোধ: {card.Name} ({source.Name} হতে)",
                AccountId = source.Id,
                AccountName = source.Name,
                CardId = card.Id,
                CardName = card.Name,
                PayeeOrPayer = card.Institution,
                Notes = req.Notes ?? "কার্ড বিল পরিশোধ"
            };
            await _txRepo.AddAsync(tx);

            var updatedCard = await _accountRepo.GetCardByIdAsync(id);
            var updatedSource = await _accountRepo.GetAccountByIdAsync(req.SourceAccountId);

            return Ok(new { success = true, card = updatedCard, source = updatedSource, transaction = tx, message = "ক্রেডিট কার্ড বিল সফলভাবে পরিশোধ হয়েছে" });
        }

        [HttpDelete("cards/{id}")]
        public async Task<IActionResult> DeleteCard(int id)
        {
            var success = await _accountRepo.DeleteCardAsync(id);
            if (!success) return NotFound(new { message = "কার্ড পাওয়া যায়নি" });
            return Ok(new { success = true, message = "কার্ড সফলভাবে মুছে ফেলা হয়েছে" });
        }
    }
}
