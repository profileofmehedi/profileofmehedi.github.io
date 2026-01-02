using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace InventoryMedicineShop.Controllers
{
    /// <summary>
    /// Controller for the home/landing page
    /// </summary>
    public class HomeController : Controller
    {
        /// <summary>
        /// Display the home page (index.html)
        /// </summary>
        /// <returns>Home view</returns>
        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// About page
        /// </summary>
        /// <returns>About view</returns>
        public IActionResult About()
        {
            return View();
        }

        /// <summary>
        /// Contact page
        /// </summary>
        /// <returns>Contact view</returns>
        public IActionResult Contact()
        {
            return View();
        }

        /// <summary>
        /// Privacy policy page
        /// </summary>
        /// <returns>Privacy view</returns>
        public IActionResult Privacy()
        {
            return View();
        }

        /// <summary>
        /// Error page
        /// </summary>
        /// <returns>Error view</returns>
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View();
        }
    }
}
