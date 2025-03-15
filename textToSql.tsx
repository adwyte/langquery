
import React from 'react';

// This is a simplified rule-based English to SQL converter
// A real implementation would use more sophisticated NLP techniques

interface SqlResult {
  sql: string;
  formatted: JSX.Element;
}

export const convertToSql = (text: string): SqlResult => {
  // Simple rule-based conversion for demo purposes
  let sql = "";
  
  // Normalize text
  const normalizedText = text.toLowerCase().trim();
  
  // Simple detection for SELECT queries
  if (normalizedText.includes("show") || 
      normalizedText.includes("get") || 
      normalizedText.includes("display") || 
      normalizedText.includes("find") ||
      normalizedText.includes("select")) {
    
    // Extract table name - look for "from" followed by a word
    const fromMatch = normalizedText.match(/from\s+(\w+)/);
    const tableMatch = normalizedText.match(/\b(table|tables|database)\s+(\w+)/);
    const inMatch = normalizedText.match(/\bin\s+(\w+)/);
    
    let table = "users"; // Default table
    
    if (fromMatch) {
      table = fromMatch[1];
    } else if (tableMatch) {
      table = tableMatch[2];
    } else if (inMatch) {
      table = inMatch[1];
    }
    
    // Extract columns
    let columns = "*";
    
    if (normalizedText.includes("name") && normalizedText.includes("age")) {
      columns = "name, age";
    } else if (normalizedText.includes("name")) {
      columns = "name";
    } else if (normalizedText.includes("age")) {
      columns = "age";
    } else if (normalizedText.includes("email")) {
      columns = "email";
    } else if (normalizedText.includes("id")) {
      columns = "id";
    }
    
    // Extract conditions
    let whereClause = "";
    
    if (normalizedText.includes("where")) {
      const whereMatch = normalizedText.match(/where\s+(.*)/i);
      if (whereMatch) {
        whereClause = ` WHERE ${whereMatch[1]}`;
      }
    }
    
    if (normalizedText.includes("older than") || normalizedText.includes("greater than")) {
      const ageMatch = normalizedText.match(/older than\s+(\d+)|greater than\s+(\d+)/);
      if (ageMatch) {
        const age = ageMatch[1] || ageMatch[2];
        whereClause = ` WHERE age > ${age}`;
      }
    }
    
    if (normalizedText.includes("younger than") || normalizedText.includes("less than")) {
      const ageMatch = normalizedText.match(/younger than\s+(\d+)|less than\s+(\d+)/);
      if (ageMatch) {
        const age = ageMatch[1] || ageMatch[2];
        whereClause = ` WHERE age < ${age}`;
      }
    }
    
    if (normalizedText.includes("named")) {
      const nameMatch = normalizedText.match(/named\s+["']?([a-zA-Z]+)["']?/);
      if (nameMatch) {
        whereClause = ` WHERE name = '${nameMatch[1]}'`;
      }
    }
    
    // Build the SQL query
    sql = `SELECT ${columns} FROM ${table}${whereClause};`;
  }
  
  // Handle CREATE TABLE queries
  else if (normalizedText.includes("create") && normalizedText.includes("table")) {
    const tableMatch = normalizedText.match(/table\s+(\w+)/);
    let table = tableMatch ? tableMatch[1] : "new_table";
    
    sql = `CREATE TABLE ${table} (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  created_at TIMESTAMP\n);`;
  }
  
  // Handle INSERT queries
  else if (normalizedText.includes("insert") || 
           normalizedText.includes("add") || 
           normalizedText.includes("put")) {
    
    const tableMatch = normalizedText.match(/\binto\s+(\w+)|\bto\s+(\w+)|\bin\s+(\w+)|\btable\s+(\w+)/);
    let table = "users"; // Default table
    
    if (tableMatch) {
      table = tableMatch[1] || tableMatch[2] || tableMatch[3] || tableMatch[4];
    }
    
    sql = `INSERT INTO ${table} (name, email) VALUES ('John Doe', 'john@example.com');`;
  }
  
  // Handle UPDATE queries
  else if (normalizedText.includes("update") || 
           normalizedText.includes("change") || 
           normalizedText.includes("modify")) {
    
    const tableMatch = normalizedText.match(/\btable\s+(\w+)|\bin\s+(\w+)/);
    let table = "users"; // Default table
    
    if (tableMatch) {
      table = tableMatch[1] || tableMatch[2];
    }
    
    sql = `UPDATE ${table} SET status = 'active' WHERE id = 1;`;
  }
  
  // Handle DELETE queries
  else if (normalizedText.includes("delete") || 
           normalizedText.includes("remove")) {
    
    const tableMatch = normalizedText.match(/\bfrom\s+(\w+)|\btable\s+(\w+)|\bin\s+(\w+)/);
    let table = "users"; // Default table
    
    if (tableMatch) {
      table = tableMatch[1] || tableMatch[2] || tableMatch[3];
    }
    
    sql = `DELETE FROM ${table} WHERE status = 'inactive';`;
  }
  
  // If no patterns match, return a generic SELECT query
  if (!sql) {
    sql = "SELECT * FROM users LIMIT 10;";
  }

  // Format SQL with syntax highlighting
  const formatted = formatSql(sql);
  
  return { sql, formatted };
};

const formatSql = (sql: string): JSX.Element => {
  // This is a simplified syntax highlighter
  // A real implementation would use a proper SQL parser
  
  // Replace keywords with styled spans
  const formattedParts: JSX.Element[] = [];
  
  // Split the SQL into lines
  const lines = sql.split('\n');
  
  lines.forEach((line, lineIndex) => {
    const words = line.split(/(\s+|[,;().])/);
    
    const wordElements = words.map((word, wordIndex) => {
      const key = `${lineIndex}-${wordIndex}`;
      
      if (word.match(/^(SELECT|FROM|WHERE|CREATE|TABLE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|PRIMARY|KEY|INT|VARCHAR|TIMESTAMP|AND|OR|LIMIT)$/i)) {
        return <span key={key} className="sql-keyword">{word}</span>;
      } else if (word.match(/^(COUNT|SUM|AVG|MIN|MAX)$/i)) {
        return <span key={key} className="sql-function">{word}</span>;
      } else if (word.match(/^(['"]).*\1$/)) {
        return <span key={key} className="sql-string">{word}</span>;
      } else if (word.match(/^\d+$/)) {
        return <span key={key} className="sql-number">{word}</span>;
      } else if (word.match(/^[=<>!+\-*/]+$/)) {
        return <span key={key} className="sql-operator">{word}</span>;
      } else {
        return <span key={key}>{word}</span>;
      }
    });
    
    formattedParts.push(
      <div key={`line-${lineIndex}`}>
        {wordElements}
      </div>
    );
  });
  
  return <>{formattedParts}</>;
};
