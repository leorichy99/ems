import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import payrollRoutes from './routes/payrollRoutes.js';
import performanceRoutes from './routes/performance.js';
import periodRoutes from './routes/periodRoutes.js';
import jobsRouter from './routes/jobs.js';
import candidatesRouter from './routes/candidates.js';
import exitRoutes from './routes/exitRoutes.js';
import hrRoutes from './routes/hrRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import hrUsersRoutes from "./routes/hrUserRoute.js";
import hrjobsRoutes from './routes/hrJobRoute.js';
import leaveRoutes from './routes/leaveRoute.js';
import hrSettingsRoutes from './routes/hrSettingsRoutes.js';
import tasksRoutes from './routes/tasksRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import payrolRoutes from './routes/payrolRoutes.js';
import leaveRequestRoute from './routes/leaveRequestRoute.js';
import path from 'path';



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// Routes
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/periods', periodRoutes);
app.use('/api/jobs', jobsRouter);
app.use('/api/hrjobs', hrjobsRoutes);
app.use('/api/candidates', candidatesRouter);
app.use('/api/exit', exitRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/hr', hrRoutes);
app.use("/api/hrusers", hrUsersRoutes);
app.use('/api/leave-requests', leaveRoutes);
app.use('/api/hr-settings', hrSettingsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/payrol', payrolRoutes);
app.use('/api/leave-request', leaveRequestRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
