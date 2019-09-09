using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using System.Threading.Tasks;
using WebApp.Hubs;
using WebApp.Models;

namespace WebApp.Controllers
{
	public class HomeController : Controller
	{
		private IHubContext<OneHub> _hubContext;

		public HomeController(IHubContext<OneHub> hubContext)
		{
			_hubContext = hubContext;
		}

		public IActionResult Index()
		{
			return View();
		}

		public async Task<IActionResult> TestSRClient()
		{
			await _hubContext.Clients.All.SendAsync("ReceiveData", "Hey, OneHub is here");
			return new JsonResult($"Message sent from {nameof(OneHub)} to all the clients");
		}

		public IActionResult Privacy()
		{
			return View();
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}
