import net from "net";

const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        console.log(data.toString);
    })
    socket.write("SERVER: Hello this is server speaker");
    socket.end("SERVER: End server");
}).on("error", (error) => console.error(error));

server.listen(9898, () => {
    console.log(`websocket server run on ${server.address().port}`)
})

export default server;