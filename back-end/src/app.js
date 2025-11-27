import dotenv from "dotenv";
import cors from "cors";
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

const app = express();

app.use(
  /*
    Vulnerabilidade: API8:2023 - Má configuração de segurança
      Esta vulnerabilidade foi evitada no código ao configurar o CORS para aceitar apenas origens especificas 
      e confiáveis (definidas via variáveis de ambiente) em vez de permitir qualquer origem (*), reduzindo a superfície de ataque de navegadores
      e permitindo apenas receber requisições de sites especificos.
      Essa proteção foi implementada nos arquivos do commit do seguinte dia: (08/11) Validação de Car com Zod no back-end e no front-end
  */
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","),
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// Rate limiter: limita a quantidade de requisições que cada usuário/IP
// pode efetuar dentro de um determinado intervalo de tempo
import { rateLimit } from "express-rate-limit";

/*
Vulnerabilidade: API4:2023 - Consumo irrestrito de recursos
  Essa vulnerabilidade foi evitada no código ao implementar um limitador de taxa (rate limiter)
  que restringe o número de requisições por minuto vindas de um mesmo IP, prevenindo exaustão de recursos.
  Esse processo inclusive foi implementado no commit do seguinte dia: (29/10) Início da implementação de ataque de força bruta
*/
const limiter = rateLimit({
  windowMs: 60 * 1000, // Intervalo: 1 minuto
  limit: 20, // Máximo de 20 requisições
});

app.use(limiter);

/*********** ROTAS DA API **************/
// Middleware de verificação do token de autorização
import auth from "./middleware/auth.js";
app.use(auth);

import carsRouter from "./routes/cars.js";
app.use("/cars", carsRouter);

import customersRouter from "./routes/customers.js";
app.use("/customers", customersRouter);

import usersRouter from "./routes/users.js";
app.use("/users", usersRouter);

export default app;
