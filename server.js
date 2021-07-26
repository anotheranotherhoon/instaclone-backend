require("dotenv").config();
import http from "http";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import pubsub from "./pubsub";
import { createServerHttpLink } from "@graphql-tools/links";

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async ({ ctx }) => {
    if (ctx.req) {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    } else {
      const { connection: { context },
      } = ctx;
      return {
        logged: ctx.connection.context.loggedInUser
      }
    }
  },
  subscriptions: {
    onConnect: async ({ token }) => {
      if (!token) {
        throw new Error("You can't listen.");
      }
      const user = await getUser(token);
      console.log(user)
    }
  }
});

const app = express();
apollo.installSubscriptionHandlers(app);
app.use(logger("tiny"));
apollo.applyMiddleware({ app });
app.use("/static", express.static("uploads"));

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer)

httpServer.listen(PORT, () => {
  console.log(`🚀Server is running on http://localhost:${PORT} ✅`);
});