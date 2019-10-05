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

		public async Task TestCall(string data)
		{
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("ReceiveData", $"Data Received from  TestCall method: {data}");
		}

		public async Task TestCall1(string data, string d)
		{
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("ReceiveData", $"Data Received from  TestCall method: {data}- {d}");
		}

		//[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[Authorize]
		public async Task TestCallWithAuth(string data)
		{
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("ReceiveData", $"Data Received from TestCallWithAuth method: {data}");
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
