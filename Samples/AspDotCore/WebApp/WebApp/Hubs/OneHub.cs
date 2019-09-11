using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace WebApp.Hubs
{
	public class OneHub : Hub
	{
		public override Task OnConnectedAsync()
		{
			return base.OnConnectedAsync();
		}

		public async Task NotifySameClient(string data)
		{
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("ReceiveData", $"Data Received: {data}");
		}

		//[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[Authorize]
		public async Task EE(string data)
		{
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("ReceiveData", $"Data Received: {data}");
		}

		public async Task NotifyAllClient(string data)
		{
			await Clients.All.SendAsync("ReceiveData", $"Data Received: {data}");
		}

		public async Task TestComplexData(string data)
		{
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("ReceiveData", $"Data Received: {data}");
		}

		public override Task OnDisconnectedAsync(Exception exception)
		{
			return base.OnDisconnectedAsync(exception);
		}
	}
}
