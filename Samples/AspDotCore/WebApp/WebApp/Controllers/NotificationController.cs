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
		public IActionResult Send(string message)
		{
			var task = Task.Run(async() =>
			{
				for (int i = 0; i < 5; i++)
				{
					await _hubContext.Clients.All.SendAsync("ReceiveData", $"This message has been sent from Web API. Here is your message - {message}");
					await Task.Delay(1500);
				}
			});
			return new JsonResult($"Message has been sent to all the clients");
		}
	}
}