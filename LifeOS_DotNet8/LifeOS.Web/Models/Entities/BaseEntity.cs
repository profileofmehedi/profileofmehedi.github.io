using System;

namespace LifeOS.Web.Models.Entities
{
    /// <summary>
    /// Base class for all database entities in LifeOS
    /// </summary>
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
