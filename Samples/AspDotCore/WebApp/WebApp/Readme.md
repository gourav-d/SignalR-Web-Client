
SignalR Web Client Samples
=====================


#### Startup.cs Configuration


```csharp
public void ConfigureServices(IServiceCollection services)
{
	.....
	services.AddCors(options => options.AddPolicy("Cors", builder =>
	{
		builder
			.AllowAnyMethod()
			.AllowAnyHeader()
			.AllowCredentials()
			.WithOrigins(
				"http://localhost:8080",
				"http://127.0.0.1:8080",
				"https://gourav-d.github.io"
			);
	}));
	....

	services.AddSignalR();
	...
}

public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
		....
		app.UseSignalR(option => {
			option.MapHub<SampleHub>(new PathString("/Test/Hub"));
			option.MapHub<SecuredHub>(new PathString("/Secured/Hub"));
	});
	....
}
```
<br/><br/>


### 1. Call Hub Method



 <div align="center" style="width: 1000px; height: 600px;">
    <img src="https://github.com/gourav-d/SignalR-Web-Client/blob/master/Samples/AspDotCore/WebApp/WebApp/Images/Basic_View.gif" width="100%" height="100%">
</div>

Example:

```csharp
public class SampleHub : Hub
{
    public async Task SendMessage(string data)
    {
        var connectionId = Context.ConnectionId;
        await Clients.Client(connectionId).SendAsync("ReceiveData", $"Data Received from  SendMessage method: {data}");
    }
}
```
<br/><br/>

### 2. Call Hub Method With Multiple Parameters

<div align="center" style="width: 1000px; height: 600px;">
    <img src="https://github.com/gourav-d/SignalR-Web-Client/blob/master/Samples/AspDotCore/WebApp/WebApp/Images/Basic_View_Multi_Param.gif" width="100%" height="100%">
</div>

Example:

```csharp
public async Task SendMessageWithId(string message, int id)
{
	var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType.ToString();
	await Clients.Client(Context.ConnectionId).SendAsync("Response", $"TransportType-{transportType} :: Data Received from SendMessageWithId method: {message}- {id}");
}
```
<br/><br/>

### 3. Call Hub Method With JSON Data


<div align="center" style="width: 1000px; height: 600px;">
    <img src="https://github.com/gourav-d/SignalR-Web-Client/blob/master/Samples/AspDotCore/WebApp/WebApp/Images/Basic_View_Json_Param.gif" width="100%" height="100%">
</div>

Example:

```csharp
public async Task ComplexData(User user)
{
	var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType.ToString();
	await Clients.Client(Context.ConnectionId).SendAsync("Response", new { Msg = $"TransportType-{transportType} :: Complex Data Received", User = user });
}
```
<br/><br/>

### 4. Receiving Hub Broadcast Messages

<div align="center" style="width: 1000px; height: 600px;">
    <img src="https://github.com/gourav-d/SignalR-Web-Client/blob/master/Samples/AspDotCore/WebApp/WebApp/Images/Server_Broadcast_Msg.gif" width="100%" height="100%">
</div>

Example:

```csharp
public class NotificationController : Controller
{
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
```
<br/><br/>

### 5. Call Secured Hub Using Token



<div align="center" style="width: 1000px; height: 600px;">
    <img src="https://github.com/gourav-d/SignalR-Web-Client/blob/master/Samples/AspDotCore/WebApp/WebApp/Images/Advance_Token.gif" width="100%" height="100%">
</div>


Example:

```csharp
[Authorize]
public class SecuredHub : Hub
{
	public async Task SendMessage(string message)
	{
		var transportType = Context.Features.Get<IHttpTransportFeature>().TransportType.ToString();
		await Clients.Client(Context.ConnectionId).SendAsync("Response", $"TransportType-{transportType} :: Data Received from SendMessageWithAuth method: {message}");
	}
}
```
