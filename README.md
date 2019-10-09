# SignalR-Web-Client
ASP.Net Core Signal R JavaScript based Web Client


This is a UI based ASP.Net Core SignalR client. It is used to test SignalR Hub. It is a debugging tool to test ASP.Net Core SignalR hubs. Using this tool, we can send the data to the SignalR hub and receive the response emit from the Signal R Hub. This tool is design for dotnet developer to make their life easier when they work with SignalR.


<p align="center">
  <img src="./src/images/SignalR-Web-Client.jpg" >
  <br>
</p>


#Prerequsit


# How it works?

SignalR Web Client have two views:
1. Basic
2. Advance

## Baisc

In this basic view, you can contact to hub by providing the hub address. And to can start 

1. Pass the valid Hub address in Service Endpoint textbox.(for ex. https://localhost:5001/Test/OneHub).
<img src="./src/images/1.png"  width="600px" height="400px" />

2. Once click on Connect button, it will make connection with server. Once the connection is established, if any data is broadcast from the Hub(ex. OneHub) to all the client. Then, it will be displayed in Response payload textbox.

3. If we want to test any Hub method. For exmaple
```csharp
public class OneHub : Hub
{
    public async Task TestCall(string data)
    {
        var connectionId = Context.ConnectionId;
        await Clients.Client(connectionId).SendAsync("ReceiveData", $"Data Received from  TestCall method: {data}");
    }
}
```
So, in the tool, we have to pass the parameter.

Server Method: TestCall
Request Payload: It can take multiple parameters. In our example, TestCall method only taking one parameter of type string. 
ex. Arg: abc
    Type: Text

Currently Data Type supports: Text, Number & JSON

<img src="./src/images/5.png" width="300px" height="300px" />

Then click on send button. It will send all the data to the hub. 

<img src="./src/images/3.png"   />

## Advance

### Reporting Issues

Nothing is perfect. Same rule goes to this tool also.
- Found an issue or problem?
- Want a new feature?

Then, just open a [new clear and descriptive issue](../../issues/new).


## License

[MIT License](https://opensource.org/licenses/MIT)