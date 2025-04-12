import { Router } from "express";
import { execute_sql_tool } from "../db-tools";

const router = Router();

router.post("/execute-sql", async (req, res) => {
  try {
    const { sql_query } = req.body;
    if (!sql_query) {
      return res.status(400).json({ message: "SQL query is required" });
    }
    
    const result = await execute_sql_tool(sql_query);
    return res.json({ message: "SQL executed successfully", result });
  } catch (error: any) {
    return res.status(500).json({ message: "Error executing SQL", error: error.message });
  }
});

export default router;