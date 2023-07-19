import { Express  } from "express"
import userRoutes from "./routes/user.routes";
import imagesRoutes from "./routes/images.routes";

const routes = (app: Express): void => {
    //user routes
    app.use("/users", userRoutes);
    //images routes
    app.use("/images", imagesRoutes);
};

export default routes;