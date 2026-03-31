const fs = require('fs');
const readline = require('readline');

async function parseBigFile() {
  const fileStream = fs.createReadStream('D:\\ANTONISCHRONAKIS\\ALYSEISKEF1.htm');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  let colors = new Set();
  let spans = [];
  let currentEncoding = 'utf8'; // If Node fails to read it properly, we know it's utf-16.

  for await (const line of rl) {
    if (lineCount < 20) {
       if (line.includes('charset')) {
          console.log("Charset info:", line);
       }
    }

    // Try finding color rules 
    const colorMatch = line.match(/color\s*:\s*([^;>\"']+)/ig);
    if (colorMatch) {
       for(const c of colorMatch) {
           colors.add(c.toLowerCase());
       }
    }

    // Try finding red text specifically: red or #FF0000 or #C00000
    if (line.match(/color:(red|#ff0000|#c00000)/i) || line.match(/color\s*:\s*(red|#ff0000|#c00000)/i)) {
       spans.push(line.substring(0, 150));
    }

    lineCount++;
  }

  console.log(`Read ${lineCount} lines.`);
  console.log('Colors:', Array.from(colors).slice(0, 10));
  console.log('Spans found:', spans.length);
  if (spans.length > 0) {
      for(let i=0; i<Math.min(5, spans.length); i++) {
         console.log(spans[i]);
      }
  }
}

parseBigFile().catch(console.error);
