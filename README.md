# Blog

This repository is for developer focused blogging software that can be used to share code and ideas.


## Instructions
This software is not yet ready for production.

### Requirements

- Node.js v0.6.X
- Webpack v2.1.0-beta.22 `npm i -g webpack@2.1.0-beta.22`
- TypeScript v2.0.3
- PostgreSQL v9.6

### Development

1. `git clone https://github.com/Mandosis/blog.git`
2. `npm install`
3. Create a file called `.env` with the following contents and modify as needed
```
DATABASE_URL="postgres://username:password@localhost:5432/dbname"
PORT=3000
SECRET="YourSecret"
```
4. `npm run setup`
5. `npm start`

To rebuild the project on file changes run `npm run watch` and `npm run server`

### Build for production

`npm run build:prod`

## License

MIT License

Copyright (c) 2016 Chris Rabuse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
