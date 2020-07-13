using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Connections.Features;
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
			var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType.ToString();
			await Clients.Client(Context.ConnectionId).SendAsync("Response", $"TransportType-{transportType} :: Data Received from SendMessage method: {message}");
		}

		public async Task SendMessageWithId(string message, int id)
		{
			var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType.ToString();
			await Clients.Client(Context.ConnectionId).SendAsync("Response", $"TransportType-{transportType} :: Data Received from SendMessageWithId method: {message}- {id}");
		}

		public async Task NotifyAllClient(string message)
		{
			var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType.ToString();
			await Clients.All.SendAsync("Response", $"TransportType-{transportType} :: Data Received: {message}");
		}

		public async Task ComplexData(User user)
		{
			var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType.ToString();
			await Clients.Client(Context.ConnectionId).SendAsync("Response", new { Msg = $"TransportType-{transportType} :: Complex Data Received", User = user });
		}

		public override Task OnDisconnectedAsync(Exception exception)
		{
			return base.OnDisconnectedAsync(exception);
		}

		//[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
		[Authorize]
		public async Task SendMessageWithAuth(string message)
		{
			var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType.ToString();
			await Clients.Client(Context.ConnectionId).SendAsync("Response", $"TransportType-{transportType} :: Data Received from SendMessageWithAuth method: {message}");
		}

		public async Task T1(string message)
		{
			var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType.ToString();
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("Response", $"TransportType-{transportType} :: Data Received from SendMessage method: {message}");
		}

		public async Task T2(int message)
		{
			var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType.ToString();
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("Response", $"TransportType-{transportType} :: Data Received from SendMessage method: {message}");
		}

		public async Task T3(double message)
		{
			var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType.ToString();
			var connectionId = Context.ConnectionId;
			await Clients.Client(connectionId).SendAsync("Response", $"TransportType-{transportType} :: Data Received from SendMessage method: {message}");
		}
	}
}