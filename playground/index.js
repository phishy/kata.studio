function extractCodeBlocks(text) {
  const codeBlocks = [];
  const codeRegex = /```([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    const [fullMatch, codeBlock] = match;
    const startIndex = text.indexOf(fullMatch, lastIndex);
    const description = text.substring(lastIndex, startIndex).trim();
    const code = codeBlock.trim();

    codeBlocks.push({ description, code });
    lastIndex = startIndex + fullMatch.length;
  }

  return codeBlocks;
}

const textWithCode = `
Here is an example of how that could be accomplished in JavaScript using a constructor function:

\`\`\`javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.retired = age >= 65 ? true : false;
}

const john = new Person('John Doe', 70);
console.log(john);  // { name: 'John Doe', age: 70, retired: true }

const jane = new Person('Jane Doe', 50);
console.log(jane); // { name: 'Jane Doe', age: 50, retired: false }
\`\`\`

In this example, the \`Person()\` function acts as a constructor for creating new \`Person\` objects. The \`this\` keyword refers to the newly created object. The \`retired\` attribute is set to \`true\` if the age is 65 and older, and \`false\` otherwise.
`;

const codeBlocks = extractCodeBlocks(textWithCode);
console.log(codeBlocks);
