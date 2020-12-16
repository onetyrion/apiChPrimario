const { default: app } = require("./app");
const config = require("../config/config");

async function main(){
    await app.listen(3100);
    console.log("Server on port 3100");
}

main();