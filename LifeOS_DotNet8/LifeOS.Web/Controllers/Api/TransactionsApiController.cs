using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LifeOS.Web.Models.Entities;
using LifeOS.Web.Repositories;

namespace LifeOS.Web.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionRepository _txRepo;

        public TransactionsController(ITransactionRepository txRepo)
        {
            _txRepo = txRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var txs = await _txRepo.GetAllAsync();
            return Ok(txs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var tx = await _txRepo.GetByIdAsync(id);
            if (tx == null) return NotFound(new { message = "লেনদেন পাওয়া যায়নি" });
            return Ok(tx);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Transaction tx)
        {
            if (tx.Amount <= 0)
            {
                return BadRequest(new { message = "টাকার পরিমাণ ০ এর বেশি হতে হবে" });
            }
            if (string.IsNullOrEmpty(tx.Code))
            {
                tx.Code = $"TX-{DateTime.UtcNow.Ticks % 100000}";
            }
            if (tx.Date == default)
            {
                tx.Date = DateTime.UtcNow;
            }

            var created = await _txRepo.AddAsync(tx);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Transaction tx)
        {
            var existing = await _txRepo.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "লেনদেন পাওয়া যায়নি" });

            existing.Date = tx.Date;
            existing.Type = tx.Type;
            existing.Amount = tx.Amount;
            existing.Category = tx.Category;
            existing.Description = tx.Description;
            existing.AccountId = tx.AccountId;
            existing.AccountName = tx.AccountName;
            existing.ToAccountId = tx.ToAccountId;
            existing.ToAccountName = tx.ToAccountName;
            existing.CardId = tx.CardId;
            existing.CardName = tx.CardName;
            existing.PayeeOrPayer = tx.PayeeOrPayer;
            existing.Reference = tx.Reference;
            existing.Notes = tx.Notes;

            await _txRepo.UpdateAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _txRepo.DeleteAsync(id);
            if (!success) return NotFound(new { message = "লেনদেন পাওয়া যায়নি" });
            return Ok(new { success = true, message = "লেনদেন মুছে ফেলা হয়েছে" });
        }
    }
}
