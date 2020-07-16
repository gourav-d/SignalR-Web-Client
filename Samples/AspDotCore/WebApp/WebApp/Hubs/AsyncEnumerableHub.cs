using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using WebApp.Models;

namespace WebApp.Hubs
{
	public class AsyncEnumerableHub : Hub
	{
		public override Task OnConnectedAsync()
		{
			return base.OnConnectedAsync();
		}

		public async IAsyncEnumerable<int> Counter(int count, int delay)
		{
			for (var i = 0; i < count; i++)
			{
				yield return i;
				await Task.Delay(delay);
			}
		}

		public ChannelReader<int> DelayCounter(int delay)
		{
			var channel = Channel.CreateUnbounded<int>();

			_ = WriteItems(channel.Writer, 20, delay);

			return channel.Reader;
		}

		private async Task WriteItems(ChannelWriter<int> writer, int count, int delay)
		{
			for (var i = 0; i < count; i++)
			{
				await writer.WriteAsync(i);
				await Task.Delay(delay);
			}

			writer.TryComplete();
		}

		public ChannelReader<User> Users(int delay)
		{
			var channel = Channel.CreateUnbounded<User>();
			 _ = WriteUserData(channel.Writer, delay);
			return channel.Reader;
		}

		private async Task WriteUserData(ChannelWriter<User> writer, int delay)
		{
			foreach (var usr in GetUsers())
			{
				await writer.WriteAsync(usr);
				await Task.Delay(delay);
			}

			writer.TryComplete();
		}

		private List<User> GetUsers()
		{
			return new List<User>
			{
				new User { Id = 1, Name = "A1", Address = new Address{ Country = "India", Pin = 91 } },
				new User { Id = 2, Name = "A2", Address = new Address{ Country = "India", Pin = 91 } },
				new User { Id = 3, Name = "A3", Address = new Address{ Country = "India", Pin = 91 } },
				new User { Id = 4, Name = "A4", Address = new Address{ Country = "India", Pin = 91 } },
				new User { Id = 5, Name = "A5", Address = new Address{ Country = "India", Pin = 91 } },
				new User { Id = 6, Name = "A6", Address = new Address{ Country = "India", Pin = 91 } },
				new User { Id = 7, Name = "A7", Address = new Address{ Country = "India", Pin = 91 } },
				new User { Id = 8, Name = "A8", Address = new Address{ Country = "India", Pin = 91 } },
				new User { Id = 9, Name = "A9", Address = new Address{ Country = "India", Pin = 91 } },
				new User { Id = 10, Name = "A10", Address = new Address{ Country = "India", Pin = 91 } }
			};
		}

	}
}
