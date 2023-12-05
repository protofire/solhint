# Docker Instructions
Thanks [@keypee](https://github.com/kaypee90) for the contribution<br><br>

1. Get the image. Run:<br>
`docker pull protodb/protofire-solhint:latest`

2. Check if image is present (protodb/protofire-solhint:latest)<br>
`docker images`

3. Solhint use:<br>

- Execute solhint with default config file<br>
`docker run -v ./:/app -w /app -it protodb/protofire-solhint solhint './contracts/*.sol'`

This command:<br>
- Maps current folder to app/ inside container <br>
- Executes solhint in './contracts/*.sol'<br>

- Navigate inside container sharing current folder into app/ container folder<br>
`docker run -v ./:/app -w /app -it protodb/protofire-solhint /bin/sh`<br>

This command:<br>
- Maps current folder to app/ container folder<br>
- Can run solhint inside the container by typping `solhint ./contracts/*.sol`<br>
(use your correct path, type exit to finish)<br>


