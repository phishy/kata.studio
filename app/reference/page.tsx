import Link from "next/link"

let arrayMethods = [
  "Array.prototype.at()",
  "Array.prototype.concat()",
  "Array.prototype.copyWithin()",
  "Array.prototype.entries()",
  "Array.prototype.every()",
  "Array.prototype.fill()",
  "Array.prototype.filter()",
  "Array.prototype.find()",
  "Array.prototype.findIndex()",
  "Array.prototype.findLast()",
  "Array.prototype.findLastIndex()",
  "Array.prototype.flat()",
  "Array.prototype.flatMap()",
  "Array.prototype.forEach()",
  "Array.from()",
  "Array.fromAsync()",
  "Array.prototype.group()",
  "Array.prototype.groupToMap()",
  "Array.prototype.includes()",
  "Array.prototype.indexOf()",
  "Array.isArray()",
  "Array.prototype.join()",
  "Array.prototype.keys()",
  "Array.prototype.lastIndexOf()",
  "Array.prototype.map()",
  "Array.of()",
  "Array.prototype.pop()",
  "Array.prototype.push()",
  "Array.prototype.reduce()",
  "Array.prototype.reduceRight()",
  "Array.prototype.reverse()",
  "Array.prototype.shift()",
  "Array.prototype.slice()",
  "Array.prototype.some()",
  "Array.prototype.sort()",
  "Array.prototype.splice()",
  "Array.prototype.toLocaleString()",
  "Array.prototype.toReversed()",
  "Array.prototype.toSorted()",
  "Array.prototype.toSpliced()",
  "Array.prototype.toString()",
  "Array.prototype.unshift()",
  "Array.prototype.values()",
  "Array.prototype.with()",
]

let stringMethods = [
  "String.prototype.charAt()",
  "String.prototype.charCodeAt()",
  "String.prototype.codePointAt()",
  "String.prototype.concat()",
  "String.prototype.endsWith()",
  "String.prototype.includes()",
  "String.prototype.indexOf()",
  "String.prototype.lastIndexOf()",
  "String.prototype.localeCompare()",
  "String.prototype.match()",
  "String.prototype.matchAll()",
  "String.prototype.normalize()",
  "String.prototype.padEnd()",
  "String.prototype.padStart()",
  "String.prototype.repeat()",
  "String.prototype.replace()",
  "String.prototype.replaceAll()",
  "String.prototype.search()",
  "String.prototype.slice()",
  "String.prototype.split()",
  "String.prototype.startsWith()",
  "String.prototype.substring()",
  "String.prototype.toLocaleLowerCase()",
  "String.prototype.toLocaleUpperCase()",
  "String.prototype.toLowerCase()",
  "String.prototype.toString()",
  "String.prototype.toUpperCase()",
  "String.prototype.trim()",
  "String.prototype.trimEnd()",
  "String.prototype.trimStart()",
  "String.prototype.valueOf()",
]

let setMethods = [
  "Set.prototype.add()",
  "Set.prototype.clear()",
  "Set.prototype.delete()",
  "Set.prototype.entries()",
  "Set.prototype.forEach()",
  "Set.prototype.has()",
  "Set.prototype.keys()",
  "Set.prototype.values()",
]

let dateMethods = [
  "Date.prototype.getDate()",
  "Date.prototype.getDay()",
  "Date.prototype.getFullYear()",
  "Date.prototype.getHours()",
  "Date.prototype.getMilliseconds()",
  "Date.prototype.getMinutes()",
  "Date.prototype.getMonth()",
  "Date.prototype.getSeconds()",
  "Date.prototype.getTime()",
  "Date.prototype.getTimezoneOffset()",
  "Date.prototype.getUTCDate()",
  "Date.prototype.getUTCDay()",
  "Date.prototype.getUTCFullYear()",
  "Date.prototype.getUTCHours()",
  "Date.prototype.getUTCMilliseconds()",
  "Date.prototype.getUTCMinutes()",
  "Date.prototype.getUTCMonth()",
  "Date.prototype.getUTCSeconds()",
  "Date.prototype.getYear()",
  "Date.now()",
  "Date.parse()",
  "Date.prototype.setDate()",
  "Date.prototype.setFullYear()",
  "Date.prototype.setHours()",
  "Date.prototype.setMilliseconds()",
  "Date.prototype.setMinutes()",
  "Date.prototype.setMonth()",
  "Date.prototype.setSeconds()",
  "Date.prototype.setTime()",
  "Date.prototype.setUTCDate()",
  "Date.prototype.setUTCFullYear()",
  "Date.prototype.setUTCHours()",
  "Date.prototype.setUTCMilliseconds()",
  "Date.prototype.setUTCMinutes()",
  "Date.prototype.setUTCMonth()",
  "Date.prototype.setUTCSeconds()",
  "Date.prototype.setYear()",
  "Date.prototype.toDateString()",
  "Date.prototype.toISOString()",
  "Date.prototype.toJSON()",
  "Date.prototype.toLocaleDateString()",
  "Date.prototype.toLocaleString()",
  "Date.prototype.toLocaleTimeString()",
  "Date.prototype.toString()",
  "Date.prototype.toTimeString()",
  "Date.prototype.toUTCString()",
  "Date.UTC()",
  "Date.prototype.valueOf()",
]

export default function Page() {
  return (
    <div className="p-10">
      <h1 className="text-4xl mb-10">Reference</h1>

      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">
          An Introduction to JavaScript Concepts
        </h1>

        <p className="mb-6">
          JavaScript, often abbreviated as JS, is a versatile and ubiquitous
          programming language that powers the dynamic and interactive aspects
          of web development.
        </p>

        <h2 className="text-2xl font-semibold mb-2">The Role of JavaScript</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>
            <a
              href="/kata?q=Enhancing%20User%20Experience"
              className="underline decoration-sky-500"
            >
              Enhancing User Experience
            </a>
          </li>
          <li>
            <a
              href="/kata?q=Handling%20User%20Input"
              className="underline decoration-sky-500"
            >
              Handling User Input
            </a>
          </li>
          <li>
            <a
              href="/kata?q=Asynchronous%20Operations"
              className="underline decoration-sky-500"
            >
              Asynchronous Operations
            </a>
          </li>
          <li>
            <a
              href="/kata?q=Manipulating%20the%20Document%20Object%20Model%20(DOM)"
              className="underline decoration-sky-500"
            >
              Manipulating the Document Object Model (DOM)
            </a>
          </li>
          <li>
            <a
              href="/kata?q=Validating%20and%20Processing%20Forms"
              className="underline decoration-sky-500"
            >
              Validating and Processing Forms
            </a>
          </li>
          <li>
            <a
              href="/kata?q=Browser%20Compatibility"
              className="underline decoration-sky-500"
            >
              Browser Compatibility
            </a>
          </li>
          <li>
            <a
              href="/kata?q=Creating%20Browser%20Games%20and%20Web%20Applications"
              className="underline decoration-sky-500"
            >
              Creating Browser Games and Web Applications
            </a>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2">JavaScript Essentials</h2>
        <ol className="list-decimal pl-6 mb-6">
          <li className="mb-2">
            <a
              href="/kata?q=Variables%20and%20Data%20Types"
              className="underline decoration-sky-500"
            >
              Variables and Data Types
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/kata?q=Operators"
              className="underline decoration-sky-500"
            >
              Operators
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/kata?q=Functions"
              className="underline decoration-sky-500"
            >
              Functions
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/kata?q=Conditional%20Statements"
              className="underline decoration-sky-500"
            >
              Conditional Statements
            </a>
          </li>
          <li className="mb-2">
            <a href="/kata?q=Loops" className="underline decoration-sky-500">
              Loops
            </a>
          </li>
          <li className="mb-2">
            <a href="/kata?q=Events" className="underline decoration-sky-500">
              Events
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/kata?q=DOM%20Manipulation"
              className="underline decoration-sky-500"
            >
              DOM Manipulation
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/kata?q=Asynchronous%20Programming"
              className="underline decoration-sky-500"
            >
              Asynchronous Programming
            </a>
          </li>
          <li>
            <a
              href="/kata?q=Error%20Handling"
              className="underline decoration-sky-500"
            >
              Error Handling
            </a>
          </li>
          <li>
            <a href="/kata?q=Modules" className="underline decoration-sky-500">
              Modules
            </a>
          </li>
        </ol>

        <p className="mt-4">
          These concepts form the foundation of JavaScript programming and are
          crucial for building dynamic and interactive web applications.
        </p>
      </div>

      <h2 className="text-3xl mb-5">Array</h2>
      <div className="grid grid-cols-3 gap-4">
        {arrayMethods.map((method) => (
          <Link href={`/kata?q=${method}`} key={method}>
            <div key={method} className="bg-gray-800 p-4 rounded-md">
              {method}
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-3xl mt-5 mb-5">Date</h2>
      <div className="grid grid-cols-3 gap-4">
        {dateMethods.map((method) => (
          <Link href={`/kata?q=${method}`} key={method}>
            <div key={method} className="bg-gray-800 p-4 rounded-md">
              {method}
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-3xl mt-5 mb-5">String</h2>
      <div className="grid grid-cols-3 gap-4">
        {stringMethods.map((method) => (
          <Link href={`/kata?q=${method}`} key={method}>
            <div key={method} className="bg-gray-800 p-4 rounded-md">
              {method}
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-3xl mt-5 mb-5">Set</h2>
      <div className="grid grid-cols-3 gap-4">
        {setMethods.map((method) => (
          <Link href={`/kata?q=${method}`} key={method}>
            <div key={method} className="bg-gray-800 p-4 rounded-md">
              {method}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
