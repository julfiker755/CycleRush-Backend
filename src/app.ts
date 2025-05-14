import express, { Application} from 'express';
import globalErrorHandler from './app/errors/globalErrorhandler';
import NotFound from './app/middleware/not-found';
import router from './app/routes';
const app: Application = express();
import cors from 'cors';
import { any } from 'zod';

app.use(express.json());
app.use(cors());

app.use('/api/v1',router);


app.get('/', (req, res) => {
  res.send('Health Care Sql server running');
});

app.use(NotFound)
app.use(globalErrorHandler)

// app.use((err:any, req:any, res:any, next:any) => {
//   console.log(err)
//     res.status(500).json({
//       success: false,
//       message: err.message || "Something went wrong",
//       error: err
//     });
//   });



export default app;
