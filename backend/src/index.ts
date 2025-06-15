import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import dotenv from "dotenv";

import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

dotenv.config();

async function startServer() {
  const app: Application = express();
  const PORT = process.env.PORT || 4000;

  // CORS configuration
  app.use(
    cors({
      origin: [
        process.env.CORS_ORIGIN || "http://localhost:3000",
        "https://studio.apollographql.com",
      ],
      credentials: true,
    })
  );

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // Create GraphQL schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
    introspection: true,
  });

  await server.start();
  server.applyMiddleware({ app: app as any, path: "/graphql" });

  // Create HTTP server
  const httpServer = createServer(app);

  // WebSocket server for subscriptions
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: () => {
        console.log("🔌 Client connected to WebSocket");
      },
      onDisconnect: () => {
        console.log("🔌 Client disconnected from WebSocket");
      },
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );

  // Start server
  httpServer.listen(PORT, () => {
    console.log("🚀 Currency Tracker GraphQL Server Started!");
    console.log(
      `📊 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🔄 Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(`💊 Health check at http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    subscriptionServer.close();
    httpServer.close();
  });
}

startServer().catch((error) => {
  console.error("❌ Error starting server:", error);
  process.exit(1);
});
