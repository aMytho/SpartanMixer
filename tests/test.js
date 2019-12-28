let user = {     // an object
  name: "John",  // by key "name" store value "John"
  age: 30        // by key "age" store value 30
};


const fs = require('fs')


let content = user.age

try {
  const data = fs.writeFileSync('./test.js', content, {flag: 'a+' })
  //file written successfully
} catch (err) {
  console.error(err)
};


