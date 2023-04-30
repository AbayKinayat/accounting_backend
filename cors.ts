
import baseCors, { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  credentials: true,
  origin: "" || function (requestOrigin: any, callback :any) {
    return callback(null, true)
  } 
};

export const cors = baseCors(corsOptions);