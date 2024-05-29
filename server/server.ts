import { app } from "./app";
import handleDBConnection from "./connection/db";
require("dotenv").config();
// create server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
  handleDBConnection();
});
