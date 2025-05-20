import express, { Application} from 'express';
import globalErrorHandler from './app/errors/globalErrorhandler';
import NotFound from './app/middleware/not-found';
import router from './app/routes';
import cookieParser from 'cookie-parser'
const app: Application = express();
import cors from 'cors';


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/v1',router);


app.get('/', (req, res) => {
  res.send('Cycle Rust server running');
});

app.use(NotFound)
// app.use(globalErrorHandler)

app.use((err:any, req:any, res:any, next:any) => {
  console.log(err)
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
      error: err
    });
  });



export default app;
