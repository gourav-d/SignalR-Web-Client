using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using WebApp.Hubs;

namespace WebApp.Controllers
{
	public class NotificationController : Controller
    {
		private IHubContext<SampleHub> _hubContext;

		public NotificationController(IHubContext<SampleHub> hubContext)
		{
			_hubContext = hubContext;
		}

		[HttpGet]
		public async Task<IActionResult> TestSRClient(string message)
		{
			await _hubContext.Clients.All.SendAsync("ReceiveData", $"This message has been sent from Controller. Here is you message - {message}");
			return new JsonResult($"Message has been sent to all the clients");
		}
	}
}