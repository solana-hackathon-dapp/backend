import net from "net";

const client = net.createServer({port: 9898}, () => {
    console.log("CLIENT: I connected to server");
    client.write("CLIENT: Hello this is client");
})

client.on("data", (data) => {
    console.log(data.toString());
    client.end();
})

client.on("end", () => {
    console.log("CLIENT: I disconnected to the server.");
})