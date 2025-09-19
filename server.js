const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const apiRoutes = require("./routes/api");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use("/api", apiRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));