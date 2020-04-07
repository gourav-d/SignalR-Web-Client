using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using WebApp.Models;

namespace WebApp.Hubs
{
	public class SampleHub : Hub
	{
		public override Task OnConnectedAsync()
		{
			return base.OnConnectedAsync();
		}

		public async Task SendMessage(string message)
		{
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("Response", $"Data Received from  SendMessage method: {message}");
		}

		public async Task SendMessageWithId(string message, int id)
		{
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("Response", $"Data Received from  TestCall method: {message}- {id}");
		}

		public async Task NotifyAllClient(string message)
		{
			await Clients.All.SendAsync("Response", $"Data Received: {message}");
		}

		public async Task ComplexData(User user)
		{
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("Response", new { Msg = "Complex Data Received", User = user });
		}

		public override Task OnDisconnectedAsync(Exception exception)
		{
			return base.OnDisconnectedAsync(exception);
		}

		//[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[Authorize]
		public async Task SendMessageWithAuth(string message)
		{
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("Response", $"Data Received from SendMessageWithAuth method: {message}");
		}
	}
}