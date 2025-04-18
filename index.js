const dotenv = require("dotenv")
const express = require("express")
const connectDB = require("./config/db")
const hodRoutes = require("./routes/hodRoutes")
const authRoutes = require("./routes/authRoutes")
const fileRoutes = require("./routes/fileRoutes")
const studentRoutes = require("./routes/studentRoutes")
const teacherRoutes = require("./routes/teacherRoutes")

dotenv.config()
connectDB()
const PORT = process.env.PORT || 5000;

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
  res.send(`Server is Running at ${PORT}`)
})

app.use('/api/auth', hodRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/file", fileRoutes)
app.use("/api/student", studentRoutes)
app.use("/api/teacher", teacherRoutes)

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
