import { Request, Response, NextFunction } from "express";


export const logger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now(); // Tempo di inizio della richiesta
  
    // Salviamo i metodi originali
    const originalSend = res.send;
    const originalJson = res.json;
  
    // Wrapper per `res.send`
    res.send = function (body) {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] method: ${req.method}, url: ${req.url}, headers: ${JSON.stringify(req.headers)}, body: ${JSON.stringify(req.body)}, responseStatusCode: ${res.statusCode}, response: ${body}, duration: ${duration}ms`);
      return originalSend.call(this, body); // Chiama il metodo originale
    };
  
    // Wrapper per `res.json`
    res.json = function (body) {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] method: ${req.method}, url: ${req.url}, headers: ${JSON.stringify(req.headers)}, body: ${JSON.stringify(req.body)}, responseStatusCode: ${res.statusCode}, response: ${JSON.stringify(body)}, duration: ${duration}ms`);
      return originalJson.call(this, body); // Chiama il metodo originale
    };
  
    next(); // Passa al prossimo middleware
  };
  