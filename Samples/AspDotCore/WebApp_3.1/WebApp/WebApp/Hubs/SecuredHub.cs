using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace WebApp.Hubs
{
	[Authorize]
	public class SecuredHub : Hub
	{
		public async Task SendMessage(string message)
		{
			var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType.ToString();
			await Clients.Client(Context.ConnectionId).SendAsync("Response", $"TransportType-{transportType} :: Data Received from SendMessageWithAuth method: {message}");
		}
	}
}
